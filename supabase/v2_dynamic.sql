-- Academia Imobiliária V2 — conteúdo dinâmico, quizzes seguros e seed inicial
-- Executar DEPOIS do schema.sql da V1.

create table if not exists public.legislative_update_lessons(
  update_id bigint not null references public.legislative_updates(id) on delete cascade,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  primary key(update_id, lesson_id)
);
alter table public.legislative_update_lessons enable row level security;
drop policy if exists "published update lesson links read" on public.legislative_update_lessons;
create policy "published update lesson links read" on public.legislative_update_lessons for select
using (
  public.is_admin() or exists(
    select 1 from public.legislative_updates lu
    where lu.id=update_id and lu.status='published'
  )
);
drop policy if exists "admin update lesson links" on public.legislative_update_lessons;
create policy "admin update lesson links" on public.legislative_update_lessons for all
using(public.is_admin()) with check(public.is_admin());

-- Entrega o quiz sem revelar is_correct.
create or replace function public.get_quiz_safe(p_quiz_id bigint)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare result jsonb;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select jsonb_build_object(
    'id', q.id,
    'title', q.title,
    'pass_percentage', q.pass_percentage,
    'questions', coalesce(jsonb_agg(
      jsonb_build_object(
        'id', qu.id,
        'question', qu.question,
        'position', qu.position,
        'answers', (
          select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'answer',a.answer,'position',a.position) order by a.position),'[]'::jsonb)
          from public.answers a where a.question_id=qu.id
        )
      ) order by qu.position
    ) filter (where qu.id is not null),'[]'::jsonb)
  ) into result
  from public.quizzes q
  left join public.questions qu on qu.quiz_id=q.id
  where q.id=p_quiz_id
  group by q.id;
  return result;
end $$;

grant execute on function public.get_quiz_safe(bigint) to authenticated;

-- Corrige no servidor, grava tentativa e devolve apenas score/feedback após submissão.
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
  insert into public.quiz_attempts(user_id,quiz_id,score,passed)
  values(auth.uid(),p_quiz_id,pct,pct>=pass_pct)
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

  return jsonb_build_object('attempt_id',attempt_id,'score',pct,'passed',pct>=pass_pct,'pass_percentage',pass_pct,'feedback',feedback);
end $$;

grant execute on function public.submit_quiz(bigint,jsonb) to authenticated;

-- Seed do percurso Nível 1
insert into public.courses(title,slug,description,level,status,position)
values ('Iniciante · Entrar no Imobiliário','iniciante','Formação base para compreender e acompanhar uma transação imobiliária em Portugal.','Nível 1','published',1)
on conflict(slug) do update set description=excluded.description,status='published',position=1;

DO $$
declare c_id bigint; m_id bigint; l_id bigint; q_id bigint; qn bigint;
begin
  select id into c_id from public.courses where slug='iniciante';

  -- Módulo 1
  insert into public.modules(course_id,title,description,position,status)
  select c_id,'Entrar no mundo imobiliário','Fundamentos da mediação imobiliária e do papel profissional.',1,'published'
  where not exists(select 1 from public.modules where course_id=c_id and position=1);
  select id into m_id from public.modules where course_id=c_id and position=1 limit 1;

  insert into public.lessons(module_id,title,slug,content,duration_minutes,legal_sensitive,verified_at,source_url,status,position)
  values(m_id,'O que é a mediação imobiliária?','o-que-e-mediacao-imobiliaria',jsonb_build_object(
    'intro','A mediação imobiliária não é apenas anunciar imóveis. É uma atividade regulada que aproxima clientes e destinatários para a realização de negócios sobre imóveis.',
    'sections',jsonb_build_array(
      jsonb_build_object('title','A atividade','body','Em Portugal, a atividade de mediação imobiliária só pode ser exercida por empresas de mediação e mediante contrato. A atividade inclui a procura de interessados para negócios sobre imóveis e pode abranger ações de prospeção, recolha de informação e promoção.'),
      jsonb_build_object('title','Cliente e destinatário','body','Cliente é quem celebra o contrato de mediação com a empresa. O destinatário é a pessoa ou entidade que pode vir a celebrar com esse cliente o negócio mediado.'),
      jsonb_build_object('title','Regra profissional','body','Informação fornecida pelo proprietário não deve ser automaticamente tratada como documentalmente confirmada. O consultor deve saber o que verificar e quando encaminhar uma questão para advogado, arquiteto, engenheiro, conservatória, finanças ou município.')
    ),
    'case_title','Caso prático',
    'case_body','O proprietário afirma que a moradia tem 220 m² incluindo um anexo. A documentação apresentada não permite confirmar imediatamente essa área. O procedimento profissional é analisar e esclarecer a divergência antes de anunciar a característica como confirmada.',
    'takeaway','Ouvir → recolher → documentar → verificar → esclarecer → comunicar.'
  ),10,true,'2026-08-18','https://diariodarepublica.pt/dr/detalhe/lei/15-2013-257806','published',1)
  on conflict(module_id,slug) do update set content=excluded.content,verified_at=excluded.verified_at,source_url=excluded.source_url,status='published';
  select id into l_id from public.lessons where module_id=m_id and slug='o-que-e-mediacao-imobiliaria';

  if not exists(select 1 from public.quizzes where lesson_id=l_id) then
    insert into public.quizzes(lesson_id,title,pass_percentage) values(l_id,'Mini teste · Mediação Imobiliária',80) returning id into q_id;
    insert into public.questions(quiz_id,question,explanation,position) values(q_id,'A mediação imobiliária limita-se à compra e venda?','Pode abranger outros negócios sobre imóveis, incluindo arrendamento, permuta e trespasse.',1) returning id into qn;
    insert into public.answers(question_id,answer,is_correct,position) values(qn,'Sim',false,1),(qn,'Não',true,2);
    insert into public.questions(quiz_id,question,explanation,position) values(q_id,'Quem é o cliente da empresa de mediação?','É a pessoa ou entidade que celebra o contrato de mediação com a empresa habilitada.',2) returning id into qn;
    insert into public.answers(question_id,answer,is_correct,position) values(qn,'Quem vê o anúncio',false,1),(qn,'Quem celebra o contrato de mediação',true,2),(qn,'Qualquer visitante',false,3);
    insert into public.questions(quiz_id,question,explanation,position) values(q_id,'O proprietário indica uma área que não consegue confirmar nos documentos. O que deve fazer?','A informação deve ser verificada antes de ser apresentada como facto confirmado.',3) returning id into qn;
    insert into public.answers(question_id,answer,is_correct,position) values(qn,'Publicar imediatamente',false,1),(qn,'Verificar e esclarecer primeiro',true,2),(qn,'Ignorar a documentação',false,3);
  end if;

  -- Módulos 2 a 10: percurso completo já navegável.
  insert into public.modules(course_id,title,description,position,status)
  select c_id,x.title,x.descr,x.pos,'published'
  from (values
    ('Prospeção e primeiros clientes','Organização comercial, contactos, leads e rotina de prospeção.',2),
    ('Angariação','Preparação da reunião, proprietário, imóvel e proposta de serviço.',3),
    ('CMI e relação com o proprietário','Contrato de mediação, exclusividade, remuneração e comunicação.',4),
    ('Análise do imóvel e preço','Áreas, comparáveis, preço de mercado e apresentação ao proprietário.',5),
    ('Documentação básica','Registo, matriz, energia e documentação essencial da operação.',6),
    ('Preparação e promoção','Apresentação, anúncio, informação rigorosa e estratégia de promoção.',7),
    ('Compradores e visitas','Qualificação, visitas, financiamento e acompanhamento.',8),
    ('Propostas e negociação','Condições, contrapropostas, negociação e registo de decisões.',9),
    ('CPCV, escritura e pós-venda','Do acordo à conclusão do negócio e acompanhamento final.',10)
  ) as x(title,descr,pos)
  where not exists(select 1 from public.modules m where m.course_id=c_id and m.position=x.pos);

  -- Uma aula-base por módulo para que o percurso já tenha conteúdo real e possa crescer pelo backoffice.
  for m_id in select id from public.modules where course_id=c_id and position between 2 and 10 loop
    if not exists(select 1 from public.lessons where module_id=m_id) then
      insert into public.lessons(module_id,title,slug,content,duration_minutes,legal_sensitive,verified_at,source_url,status,position)
      select m_id,
        case m.position
          when 2 then 'Criar uma rotina de prospeção profissional'
          when 3 then 'Preparar uma angariação'
          when 4 then 'Compreender o CMI'
          when 5 then 'Preço, valor e comparáveis'
          when 6 then 'Documentos que deve reconhecer'
          when 7 then 'Preparar um imóvel para o mercado'
          when 8 then 'Qualificar compradores e conduzir visitas'
          when 9 then 'Receber e apresentar propostas'
          when 10 then 'Do CPCV à conclusão do negócio' end,
        'aula-base-modulo-'||m.position,
        jsonb_build_object(
          'intro', case m.position
            when 2 then 'Prospeção consistente começa com método: definir zona, público, canais, rotina e registo de contactos.'
            when 3 then 'Uma boa angariação começa antes da reunião: identificação das partes, objetivo, situação do imóvel e documentação disponível.'
            when 4 then 'O CMI formaliza a relação entre a empresa de mediação e o cliente e deve ser compreendido antes de ser explicado.'
            when 5 then 'Preço anunciado e valor de mercado não são sinónimos. A análise deve considerar comparáveis, estado, localização, áreas e procura.'
            when 6 then 'O consultor não precisa substituir os profissionais jurídicos ou técnicos, mas deve reconhecer os documentos essenciais e identificar divergências.'
            when 7 then 'Promover bem não é exagerar características: é apresentar o imóvel com clareza, contexto e informação verificável.'
            when 8 then 'Qualificar um comprador permite perceber necessidade, prazo, orçamento, financiamento e capacidade de decisão antes de multiplicar visitas.'
            when 9 then 'Uma proposta deve ser registada com preço, condições, prazos e dependências relevantes, evitando ambiguidades.'
            when 10 then 'A fase final exige coordenação entre partes, profissionais e documentação, acompanhando o processo sem ultrapassar competências reservadas.' end,
          'sections', jsonb_build_array(
            jsonb_build_object('title','Objetivo da aula','body','Aplicar um processo profissional, documentado e claro.'),
            jsonb_build_object('title','Na prática','body','Use checklists e registe decisões importantes. Quando exista dúvida jurídica, fiscal, técnica ou urbanística, confirme a fonte e encaminhe para o profissional competente.')
          ),
          'takeaway','Processo consistente reduz erros e melhora a experiência de cliente.'
        ),
        8,
        (m.position in (4,6,10)),
        case when m.position in (4,6,10) then date '2026-08-18' else null end,
        case when m.position=4 then 'https://www.impic.pt/impic/pt-pt/validacao-de-minutas/contratos-de-mediacao-imobiliaria'
             when m.position in (6,10) then 'https://diariodarepublica.pt/dr/detalhe/lei/15-2013-257806'
             else null end,
        'published',1
      from public.modules m where m.id=m_id;
    end if;
  end loop;
end $$;

-- Especialização Terrenos
insert into public.courses(title,slug,description,level,status,position)
values ('Terrenos e Potencial Construtivo','terrenos','PDM, condicionantes, PIP, loteamentos e desenvolvimento.','Especialização','published',2)
on conflict(slug) do update set description=excluded.description,status='published',position=2;

DO $$
declare c_id bigint;
begin
 select id into c_id from public.courses where slug='terrenos';
 insert into public.modules(course_id,title,description,position,status)
 select c_id,x.title,x.descr,x.pos,'published' from (values
 ('O que é um terreno urbanizável?','Classificação do solo e diferença entre expectativa e edificabilidade efetiva.',1),
 ('Como saber se pode construir','Identificação do prédio, PDM, regulamento e confirmação urbanística.',2),
 ('PDM na prática','Leitura de plantas, qualificação do solo e parâmetros urbanísticos.',3),
 ('RAN, REN e condicionantes','Restrições e servidões que podem afetar o aproveitamento.',4),
 ('Infraestruturas e acessos','Água, saneamento, eletricidade, arruamentos e encargos.',5),
 ('Loteamento','Lotes, operações de loteamento, urbanização e cedências.',6),
 ('Como desenvolver o terreno','Percurso da análise ao projeto e execução.',7),
 ('Pedido de Informação Prévia — PIP','Finalidade, enquadramento e valor da informação prévia.',8),
 ('Do terreno ao projeto','Equipa técnica, procedimentos e fases do desenvolvimento.',9),
 ('Análise económica','Capacidade construtiva, custos, área vendável e risco.',10),
 ('Como anunciar terrenos','Níveis de certeza e comunicação responsável do potencial.',11),
 ('Casos práticos','Aplicação integrada a diferentes tipos de terrenos.',12)
 ) x(title,descr,pos)
 where not exists(select 1 from public.modules m where m.course_id=c_id and m.position=x.pos);
end $$;

-- Radar legislativo: revisão RJUE 2026 + retificação posterior.
insert into public.legislative_updates(title,topic,summary,impact,source_url,published_on,verified_at,status)
select 'Revisão do RJUE em 2026 e respetiva retificação','Urbanismo',
'O Decreto-Lei n.º 108/2026 reviu o regime aplicável ao licenciamento de operações urbanísticas e republicou o RJUE. Em 27 de julho de 2026 foi publicada a Declaração de Retificação n.º 29-A/2026/1, corrigindo diversas inexatidões do diploma.',
'Os conteúdos de terrenos, PIP, licenciamento, utilização e documentação urbanística devem ser lidos à luz da redação revista e da retificação de julho de 2026.',
'https://diariodarepublica.pt/dr/detalhe/declaracao-retificacao/29-a-2026-1152696606',date '2026-07-27',date '2026-08-18','published'
where not exists(select 1 from public.legislative_updates where title='Revisão do RJUE em 2026 e respetiva retificação');

-- Endurecimento de permissões das funções SECURITY DEFINER.
revoke execute on function public.get_quiz_safe(bigint) from public, anon;
revoke execute on function public.submit_quiz(bigint,jsonb) from public, anon;
grant execute on function public.get_quiz_safe(bigint) to authenticated;
grant execute on function public.submit_quiz(bigint,jsonb) to authenticated;
