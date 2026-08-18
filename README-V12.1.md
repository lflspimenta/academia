# V12.1 — Analisar Imóvel

## 1. Supabase
Execute uma única vez:
`supabase/v12_1_analisar_imovel.sql`

Cria apenas a tabela `property_analyses` e respetivas políticas RLS.

## 2. Publicação
Depois substitua os ficheiros no GitHub e faça deploy na Vercel.

## Funcionalidade
- formulário guiado em 6 etapas;
- titularidade, documentação, ónus, urbanismo, ocupação, acessos e preferências;
- semáforo/score de risco;
- alertas críticos e avisos;
- documentos em falta;
- próximos passos;
- ligação a Analisar Terreno, Alterar Uso e Que documentos preciso?;
- histórico de análises por utilizador;
- relatório imprimível / Guardar como PDF;
- aviso expresso de que não substitui validação documental/jurídica/técnica.

A análise é determinística e baseada nas respostas do utilizador; não inventa dados sobre o imóvel.
