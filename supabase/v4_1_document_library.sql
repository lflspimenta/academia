-- Academia Imobiliária V4.1 — fichas documentais e ligação às checklists
-- Executar DEPOIS do V4 Documentação.
begin;

alter table public.documents add column if not exists slug text;
alter table public.documents add column if not exists where_to_get text;
alter table public.documents add column if not exists what_to_check jsonb not null default '[]'::jsonb;
alter table public.documents add column if not exists alerts jsonb not null default '[]'::jsonb;
alter table public.documents add column if not exists professional_note text;
alter table public.documents add column if not exists verified_at date;

create unique index if not exists documents_slug_unique on public.documents(slug) where slug is not null;

-- Fichas documentais iniciais. O objetivo é explicar o documento e os pontos de controlo,
-- não substituir aconselhamento jurídico, fiscal, urbanístico ou técnico.
insert into public.documents(title,slug,category,description,source_url,status,where_to_get,what_to_check,alerts,professional_note,verified_at)
values
('Certidão permanente do registo predial','certidao-permanente-registo-predial','Registo Predial',
'Permite consultar os registos em vigor e os pedidos de registo pendentes relativos ao prédio.',
'https://conservatoria.justica.gov.pt/predio/certidoes-e-informacoes-de-registo-predial','published',
'Pode ser pedida e consultada através dos serviços de registo predial disponibilizados pela Justiça.',
'["Identificação e descrição do prédio.","Titulares inscritos.","Aquisições e respetivos títulos registados.","Hipotecas, penhoras, usufrutos, servidões ou outros ónus que constem do registo.","Pedidos de registo pendentes."]'::jsonb,
'["Titular indicado pelo cliente não coincide com o titular inscrito.","Existem ónus ou registos que não tinham sido comunicados.","Descrição, áreas ou composição aparentam divergir de outros documentos relevantes."]'::jsonb,
'Questões sobre efeitos de registos, conflitos de titularidade, ónus ou cancelamentos devem ser confirmadas com conservatória e/ou profissional jurídico competente.',
date '2026-08-18'),

('Caderneta predial','caderneta-predial','Fiscal',
'Documento matricial que reúne informação fiscal do prédio, como artigo, localização, afetação, áreas e VPT, consoante o caso.',
'https://www.portaldasfinancas.gov.pt/','published',
'É obtida através do Portal das Finanças ou dos serviços competentes da Autoridade Tributária pelo titular ou pessoa legitimada.',
'["Artigo matricial e freguesia.","Titulares matriciais.","Afetação do prédio.","Áreas indicadas.","Valor patrimonial tributário e restante informação fiscal relevante."]'::jsonb,
'["Áreas ou composição não coincidem com a certidão predial ou com a realidade observada.","Titular matricial diferente do titular registado.","A informação matricial está a ser usada como prova de regularidade urbanística."]'::jsonb,
'Divergências fiscais devem ser analisadas com a Autoridade Tributária e, quando afetem registo ou urbanismo, com os profissionais e entidades competentes.',
date '2026-08-18'),

('Certificado energético','certificado-energetico','Energia',
'Documento emitido no âmbito do Sistema de Certificação Energética para os edifícios e operações abrangidos pelo regime aplicável.',
'https://www.sce.pt/','published',
'A informação e os mecanismos de pesquisa do Sistema de Certificação Energética são disponibilizados pela ADENE/SCE.',
'["Se o imóvel e a operação estão abrangidos pela obrigação de certificação.","Validade do certificado apresentado.","Identificação do imóvel no certificado.","Classe energética e informação que será utilizada na promoção quando aplicável."]'::jsonb,
'["Certificado expirado ou referente a outro imóvel/fração.","Anúncio utiliza informação energética incompatível com o certificado.","Existe dúvida sobre eventual exceção ao regime."]'::jsonb,
'Em caso de dúvida sobre enquadramento, exceções ou validade, confirme no SCE/ADENE ou com técnico habilitado.',
date '2026-08-18'),

('Documentação urbanística','documentacao-urbanistica','Urbanismo',
'Conjunto de títulos, comunicações, autorizações, plantas, projetos e outros elementos que permitem compreender o enquadramento urbanístico do imóvel.',
'https://diariodarepublica.pt/','published',
'Os elementos urbanísticos são normalmente consultados junto do município competente e através dos serviços municipais disponibilizados para o efeito.',
'["Qual o título ou procedimento aplicável ao edifício e à utilização.","Se existem obras, ampliações, anexos ou alterações relevantes.","Correspondência entre plantas/documentos e realidade observada.","Antiguidade do imóvel e regime aplicável à situação concreta."]'::jsonb,
'["Construções ou ampliações que não aparecem nos elementos disponíveis.","Utilização real aparentemente diferente da documentada.","O proprietário afirma que está tudo legal, mas não consegue indicar a documentação que sustenta essa afirmação."]'::jsonb,
'A interpretação de situações urbanísticas deve ser confirmada junto do município e, quando necessário, por arquiteto, engenheiro ou profissional jurídico competente.',
date '2026-08-18'),

('Declaração de encargos de condomínio','declaracao-encargos-condominio','Condomínio',
'Documento relacionado com encargos e responsabilidades de condomínio relevante em transmissões de frações, nos termos do regime aplicável.',
'https://diariodarepublica.pt/','published',
'É normalmente solicitada à administração do condomínio, respeitando os requisitos legais aplicáveis.',
'["Identificação da fração.","Encargos correntes e eventuais valores em dívida.","Informação sobre responsabilidades aprovadas quando legalmente relevante.","Data e identificação de quem emite a declaração."]'::jsonb,
'["Existem dívidas ou encargos que não foram esclarecidos.","Informação do condomínio não coincide com o que foi comunicado pelo proprietário.","Existem obras ou deliberações com impacto económico relevante que precisam de ser compreendidas."]'::jsonb,
'Em caso de dúvidas sobre responsabilidade por dívidas, deliberações ou efeitos na transmissão, encaminhe para profissional jurídico competente.',
date '2026-08-18'),

('Habilitação de herdeiros','habilitacao-herdeiros','Sucessões',
'Instrumento utilizado para identificar quem são os herdeiros de uma pessoa falecida, conforme o caso e o procedimento sucessório aplicável.',
'https://justica.gov.pt/Servicos/Balcao-Herancas','published',
'Pode ser tratada através dos serviços de Justiça/notariado competentes, conforme o procedimento aplicável.',
'["Identidade do autor da herança.","Quem são os herdeiros habilitados.","Existência de testamento ou outros elementos sucessórios relevantes.","Se a situação registral do imóvel está preparada para o negócio pretendido."]'::jsonb,
'["Nem todos os herdeiros estão identificados ou disponíveis.","Existe conflito sucessório ou partilha pendente com impacto no negócio.","A titularidade registral não está coerente com a sucessão apresentada."]'::jsonb,
'Sucessões com testamentos, partilhas, conflitos, menores ou dúvidas de legitimidade devem ser acompanhadas por profissional jurídico/notarial competente.',
date '2026-08-18'),

('Contrato de arrendamento','contrato-arrendamento','Arrendamento',
'Documento que define a relação locatícia existente e é essencial para compreender um imóvel transmitido com ocupação.',
'https://diariodarepublica.pt/','published',
'Deve ser solicitado ao proprietário e analisado em conjunto com os demais elementos relevantes da relação de arrendamento.',
'["Identificação das partes e do imóvel.","Prazo e datas relevantes.","Valor da renda e condições contratuais.","Aditamentos, comunicações e garantias existentes.","Situação atual da ocupação."]'::jsonb,
'["O imóvel está ocupado mas não é apresentado contrato ou explicação consistente.","Existem versões diferentes do contrato ou aditamentos não esclarecidos.","Há dúvidas sobre direitos do arrendatário perante a venda."]'::jsonb,
'Direitos de preferência, cessação, atualização de rendas e efeitos da transmissão sobre o arrendamento exigem análise jurídica da situação concreta.',
date '2026-08-18'),

('Plano Diretor Municipal e regulamento','pdm-regulamento','Urbanismo',
'Instrumentos municipais essenciais para enquadrar a classificação, qualificação e regras urbanísticas aplicáveis a um terreno ou operação.',
'https://diariodarepublica.pt/','published',
'Devem ser consultados através do município competente e das plataformas oficiais de informação territorial disponibilizadas para o concelho.',
'["Localização exata do terreno nas plantas.","Classificação e qualificação aplicáveis.","Parâmetros e regras do regulamento associados à categoria de espaço.","Eventuais disposições transitórias ou especiais relevantes."]'::jsonb,
'["O terreno é descrito comercialmente como urbanizável sem identificação do enquadramento no plano.","A análise usa apenas uma imagem de mapa sem consultar o regulamento.","A parcela está abrangida por mais do que uma categoria ou regime."]'::jsonb,
'A interpretação do potencial construtivo deve ser confirmada junto do município e, quando necessário, por arquiteto ou urbanista.',
date '2026-08-18'),

('Planta de condicionantes','planta-condicionantes','Urbanismo',
'Cartografia que representa condicionantes e servidões com possível impacto no uso, transformação ou construção do solo.',
'https://diariodarepublica.pt/','published',
'É consultada no conjunto dos instrumentos territoriais e serviços oficiais do município e demais entidades competentes.',
'["Se a parcela é abrangida por condicionantes.","Qual a entidade responsável por cada condicionante relevante.","Se a restrição afeta apenas parte ou a totalidade do prédio.","Se são necessárias autorizações, pareceres ou estudos adicionais."]'::jsonb,
'["A análise de edificabilidade ignora RAN, REN, domínio hídrico, vias, património ou outras servidões.","O limite da condicionante é incerto face aos limites do prédio."]'::jsonb,
'Condicionantes devem ser analisadas com o município, entidade setorial competente e técnicos habilitados quando necessário.',
date '2026-08-18'),

('Pedido de Informação Prévia','pip','Urbanismo',
'Procedimento urbanístico usado para obter informação municipal prévia sobre determinada operação, nos termos legalmente aplicáveis.',
'https://diariodarepublica.pt/','published',
'É apresentado ao município competente com os elementos exigidos para a operação e o nível de informação pretendido.',
'["Quem apresentou o pedido e sobre que prédio/operação.","Conteúdo concreto da decisão ou informação emitida.","Condições, reservas e parâmetros indicados.","Datas e efeitos temporais relevantes."]'::jsonb,
'["Um PIP relativo a uma operação é apresentado como autorização genérica para qualquer projeto.","O anúncio resume o PIP sem mencionar condicionantes relevantes.","Não é claro se o documento ainda produz os efeitos pretendidos."]'::jsonb,
'O significado e efeitos de um PIP devem ser confirmados com o município e equipa técnica responsável pela operação.',
date '2026-08-18')
on conflict (slug) do update set
 title=excluded.title,
 category=excluded.category,
 description=excluded.description,
 source_url=excluded.source_url,
 status='published',
 where_to_get=excluded.where_to_get,
 what_to_check=excluded.what_to_check,
 alerts=excluded.alerts,
 professional_note=excluded.professional_note,
 verified_at=excluded.verified_at;

-- Atribuir slugs às linhas antigas que já existiam mas ainda não tinham slug.
update public.documents set slug='certidao-permanente-registo-predial' where title='Certidão permanente do registo predial' and slug is null;
update public.documents set slug='caderneta-predial' where title='Caderneta predial' and slug is null;
update public.documents set slug='certificado-energetico' where title='Certificado energético' and slug is null;
update public.documents set slug='documentacao-urbanistica' where title='Documentação urbanística' and slug is null;
update public.documents set slug='declaracao-encargos-condominio' where title='Declaração de encargos de condomínio' and slug is null;
update public.documents set slug='habilitacao-herdeiros' where title='Habilitação de herdeiros' and slug is null;

-- Enriquecer os itens das checklists com ligação à ficha documental, sem alterar o texto já aprovado.
update public.document_checklist_rules r
set items = (
  select jsonb_agg(
    case
      when lower(e->>'item') like 'certidão permanente%' then e || jsonb_build_object('document_slug','certidao-permanente-registo-predial')
      when lower(e->>'item') like 'caderneta%' then e || jsonb_build_object('document_slug','caderneta-predial')
      when lower(e->>'item') like 'certificado energético%' or lower(e->>'item') like 'certificados energéticos%' then e || jsonb_build_object('document_slug','certificado-energetico')
      when lower(e->>'item') like 'documentação urbanística%' then e || jsonb_build_object('document_slug','documentacao-urbanistica')
      when lower(e->>'item') like 'documentação de condomínio%' then e || jsonb_build_object('document_slug','declaracao-encargos-condominio')
      when lower(e->>'item') like 'habilitação de herdeiros%' then e || jsonb_build_object('document_slug','habilitacao-herdeiros')
      when lower(e->>'item') like 'contrato de arrendamento%' or lower(e->>'item') like 'contratos de arrendamento%' then e || jsonb_build_object('document_slug','contrato-arrendamento')
      when lower(e->>'item') like 'pdm%' then e || jsonb_build_object('document_slug','pdm-regulamento')
      when lower(e->>'item') like 'planta de condicionantes%' then e || jsonb_build_object('document_slug','planta-condicionantes')
      when lower(e->>'item') like 'pip%' then e || jsonb_build_object('document_slug','pip')
      else e
    end
    order by ord
  )
  from jsonb_array_elements(r.items) with ordinality as x(e,ord)
);

commit;

select title,slug,verified_at from public.documents where slug is not null order by title;
