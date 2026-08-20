-- V13 — RESET APENAS DE CONTAS DE TESTE
-- Edite o array abaixo. Emails inexistentes são ignorados.
-- NÃO elimina utilizadores nem acessos às formações.

do $$
declare
  tester_emails text[] := array[
    'catia.bb@gmail.com',
    'COLOCAR_SEGUNDO_EMAIL_AQUI'
  ];
  uid uuid;
  em text;
begin
  foreach em in array tester_emails loop
    select id into uid from auth.users where lower(email)=lower(em) limit 1;
    if uid is null then
      raise notice 'Ignorado: % não encontrado', em;
      continue;
    end if;

    delete from public.quiz_attempts qa
    where qa.user_id=uid
      and qa.quiz_id in (
        select q.id from public.quizzes q
        join public.modules m on m.id=q.module_id
        join public.courses c on c.id=m.course_id
        where c.status='published'
      );

    delete from public.user_lesson_progress ulp
    where ulp.user_id=uid
      and ulp.lesson_id in (
        select l.id from public.lessons l
        join public.modules m on m.id=l.module_id
        join public.courses c on c.id=m.course_id
        where c.status='published'
      );

    delete from public.certificates cert
    where cert.user_id=uid
      and cert.course_id in (select id from public.courses where status='published');

    raise notice 'Progresso de teste limpo para %', em;
  end loop;
end $$;
