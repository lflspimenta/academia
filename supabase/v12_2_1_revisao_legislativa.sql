-- V12.2.1 — Revisão legislativa das formações
-- Verificação: 18/08/2026
-- Não altera progresso, acessos, testes ou certificados.

begin;

-- 1. ARRENDAMENTO — corrigir afirmação demasiado absoluta sobre forma escrita
update public.lessons l
set content = jsonb_build_object(
  'intro',
  'No arrendamento urbano, a forma e os requisitos dependem do regime aplicável. O artigo 1069.º do Código Civil estabelece que o contrato deve ser celebrado por escrito quando tenha duração superior a seis meses. A lei prevê ainda regras específicas de prova em determinadas situações de falta de redução a escrito.',
  'sections', jsonb_build_array(
    jsonb_build_object(
      'title','O que o consultor deve saber',
      'body','A forma escrita é exigida, nos termos do artigo 1069.º do Código Civil, para contratos de arrendamento urbano com duração superior a seis meses. A falta de redução a escrito pode ter regras próprias de prova, nomeadamente a favor do arrendatário nas condições legalmente previstas. Para além da forma, devem ser definidos e conferidos finalidade, renda, prazo, garantias, identificação das partes e demais elementos relevantes.'
    ),
    jsonb_build_object(
      'title','Checklist prática',
      'body','• Identificar senhorio e legitimidade para arrendar.\n• Definir finalidade, renda, prazo e garantias.\n• Confirmar o uso e enquadramento do imóvel.\n• Confirmar as obrigações fiscais e comunicações aplicáveis.\n• Encaminhar dúvidas contratuais concretas para profissional jurídico competente.'
    ),
    jsonb_build_object(
      'title','Limite profissional',
      'body','O consultor organiza informação e identifica riscos. Não deve dar como definitiva uma interpretação jurídica do contrato sem análise do caso concreto.'
    )
  ),
  'takeaway',
  'Não ensine simplesmente que “todo o arrendamento urbano tem de estar sempre por escrito”. Confirme duração, regime aplicável e documentação concreta.'
),
source_url='https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2006-34578375',
verified_at=date '2026-08-18',
legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='Arrendamento'
  and l.title='Contrato e finalidade';

-- 2. MEDIAÇÃO / CMI — apontar para regime atual e modelo regulamentado
update public.lessons l
set source_url='https://diariodarepublica.pt/dr/detalhe/lei/15-2013-257806',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='Angariação e CMI';

-- 3. CRÉDITO — versão consolidada com alteração de 27/04/2026
update public.lessons l
set source_url='https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2017-107572846',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='Financiamento e Avaliação Bancária';

-- 4. FISCALIDADE — manter abordagem sem tabelas cristalizadas e apontar para AT atual
update public.lessons l
set source_url='https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimt/Pages/codigo-do-imt-indice.aspx',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='Fiscalidade Imobiliária';

-- 5. AML — Lei 83/2017 + regulamentação IMPIC
update public.lessons l
set source_url='https://diariodarepublica.pt/dr/detalhe/regulamento/603-2021-166264672',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='Prevenção do Branqueamento de Capitais — AML';

-- Reforço específico na aula de âmbito AML
update public.lessons l
set content = jsonb_set(
      jsonb_set(
        coalesce(content,'{}'::jsonb),
        '{takeaway}',
        to_jsonb('As atividades imobiliárias estão abrangidas por deveres de prevenção BC/FT. O consultor deve seguir os procedimentos internos e a regulamentação IMPIC aplicável, sem transformar sinais de risco em acusações.'::text),
        true
      ),
      '{sections,1,body}',
      to_jsonb('• Identificar cliente e representantes.\n• Compreender beneficiário efetivo quando aplicável.\n• Aplicar diligência adequada ao risco.\n• Registar informação e documentação exigidas.\n• Conhecer os procedimentos de comunicação aplicáveis à atividade imobiliária.\n• Preservar a confidencialidade legalmente exigida.'::text),
      true
    ),
    source_url='https://diariodarepublica.pt/dr/detalhe/regulamento/603-2021-166264672',
    verified_at=date '2026-08-18'
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='Prevenção do Branqueamento de Capitais — AML'
  and l.title='Identificação, beneficiário efetivo e origem de fundos';

-- 6. RGPD — RGPD + Lei 58/2019; consentimento não é a única base
update public.lessons l
set source_url='https://diariodarepublica.pt/dr/detalhe/lei/58-2019-123815982',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='pratica-profissional-avancada'
  and m.title='RGPD e Proteção de Dados';

-- 7. URBANISMO — revisão RJUE 2026 + retificação + novos modelos
update public.lessons l
set source_url='https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1999-34567875-45232875',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='urbanismo-pratico';

-- 8. TERRENOS — atualizar data/fonte das aulas juridicamente sensíveis
update public.lessons l
set source_url='https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1999-34567875-45232875',
    verified_at=date '2026-08-18'
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='terrenos'
  and coalesce(l.legal_sensitive,false)=true;

-- 9. DOCUMENTAÇÃO IMOBILIÁRIA PROFISSIONAL — reforçar fonte atual
update public.lessons l
set verified_at=date '2026-08-18'
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and c.slug='documentacao-imobiliaria-profissional'
  and coalesce(l.legal_sensitive,false)=true;

-- 10. Certificação energética: fonte oficial SCE/ADENE nas aulas correspondentes
update public.lessons l
set source_url='https://www.sce.pt/perguntas-frequentes/',
    verified_at=date '2026-08-18',
    legal_sensitive=true
from public.modules m
join public.courses c on c.id=m.course_id
where l.module_id=m.id
  and (
       m.title='Certificação Energética — Avançado'
       or lower(l.title) like '%certificado energético%'
       or lower(l.title) like '%certificação energética%'
  );

commit;

-- RESUMO DE VERIFICAÇÃO
select c.title as formacao,
       count(*) filter(where l.legal_sensitive=true) as aulas_sensiveis,
       count(*) filter(where l.legal_sensitive=true and l.verified_at=date '2026-08-18') as verificadas_18082026,
       count(*) filter(where l.legal_sensitive=true and l.verified_at is null) as por_rever
from public.courses c
join public.modules m on m.course_id=c.id
join public.lessons l on l.module_id=m.id
where c.status='published'
group by c.id,c.title,c.position
order by c.position nulls last,c.id;
