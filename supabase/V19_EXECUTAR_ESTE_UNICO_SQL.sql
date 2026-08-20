-- V19 — MIGRAÇÃO ÚNICA
-- Executar apenas este ficheiro no Supabase SQL Editor.


-- Remover a aula redundante confirmada.
delete from public.user_lesson_progress where lesson_id=3;
delete from public.lessons where id=3;

-- Normalizar posições em todos os módulos.
with ranked as (
 select id,row_number() over(partition by module_id order by position,id) new_position
 from public.lessons
)
update public.lessons l set position=r.new_position
from ranked r where l.id=r.id and l.position is distinct from r.new_position;

-- V18 — Persistência e estado dos testes
-- Executar uma vez no Supabase SQL Editor.

alter table public.quiz_attempts
  add column if not exists answers jsonb not null default '[]'::jsonb;

create or replace function public.submit_quiz(p_quiz_id bigint, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  total_q int;
  correct_q int;
  pct numeric(5,2);
  pass_pct int;
  attempt_id bigint;
  feedback jsonb;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  select count(*), q.pass_percentage into total_q, pass_pct
  from public.questions qu join public.quizzes q on q.id=qu.quiz_id
  where q.id=p_quiz_id group by q.pass_percentage;

  if coalesce(total_q,0)=0 then raise exception 'quiz not found or empty'; end if;

  select count(*) into correct_q
  from public.questions qu
  where qu.quiz_id=p_quiz_id
    and exists (
      select 1
      from jsonb_array_elements(p_answers) x
      join public.answers a on a.id=(x->>'answer_id')::bigint
      where (x->>'question_id')::bigint=qu.id
        and a.question_id=qu.id and a.is_correct=true
    );

  pct := round((correct_q::numeric / total_q::numeric) * 100, 2);
  insert into public.quiz_attempts(user_id,quiz_id,score,passed,answers)
  values(auth.uid(),p_quiz_id,pct,pct>=pass_pct,coalesce(p_answers,'[]'::jsonb))
  returning id into attempt_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'question_id', qu.id,
    'correct_answer_id', ca.id,
    'explanation', qu.explanation
  ) order by qu.position),'[]'::jsonb)
  into feedback
  from public.questions qu
  join lateral (
    select a.id from public.answers a where a.question_id=qu.id and a.is_correct=true limit 1
  ) ca on true
  where qu.quiz_id=p_quiz_id;

  return jsonb_build_object('attempt_id',attempt_id,'score',pct,'passed',pct>=pass_pct,'pass_percentage',pass_pct,'answers',coalesce(p_answers,'[]'::jsonb),'feedback',feedback);
end $$;

grant execute on function public.submit_quiz(bigint,jsonb) to authenticated;

create or replace function public.get_latest_quiz_attempt_review(p_quiz_id bigint)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  a public.quiz_attempts%rowtype;
  feedback jsonb;
  pass_pct int;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  select * into a
  from public.quiz_attempts
  where user_id=auth.uid() and quiz_id=p_quiz_id
  order by created_at desc, id desc
  limit 1;

  if a.id is null then return null; end if;

  select q.pass_percentage into pass_pct from public.quizzes q where q.id=p_quiz_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'question_id', qu.id,
    'correct_answer_id', ca.id,
    'explanation', qu.explanation
  ) order by qu.position),'[]'::jsonb)
  into feedback
  from public.questions qu
  join lateral (
    select ans.id from public.answers ans where ans.question_id=qu.id and ans.is_correct=true limit 1
  ) ca on true
  where qu.quiz_id=p_quiz_id;

  return jsonb_build_object(
    'attempt_id',a.id,
    'score',a.score,
    'passed',a.passed,
    'pass_percentage',pass_pct,
    'answers',coalesce(a.answers,'[]'::jsonb),
    'feedback',feedback,
    'created_at',a.created_at
  );
end $$;

grant execute on function public.get_latest_quiz_attempt_review(bigint) to authenticated;


-- Conferência
select c.title,count(l.id) aulas
from public.courses c join public.modules m on m.course_id=c.id join public.lessons l on l.module_id=m.id
group by c.id,c.title order by c.id;
