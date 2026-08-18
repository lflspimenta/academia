# Academia Imobiliária — V4.1 Documentação Dinâmica

## O que muda
- `Que documentos preciso?` deixa de usar uma lista fixa.
- As opções e checklists vêm de `document_checklist_rules` no Supabase.
- Cada item pode abrir uma ficha documental própria.
- As fichas mostram: descrição, onde obter, o que verificar, sinais de alerta, quando encaminhar, fonte oficial e data de verificação.
- Se não existir checklist específica para uma situação, a app mostra a checklist base do imóvel e avisa o utilizador.

## 1. Supabase
Execute primeiro:

`supabase/v4_1_document_library.sql`

Este script é incremental. Não volte a executar `schema.sql`.

## 2. GitHub / Vercel
Substitua os ficheiros do projeto pelos desta versão e faça commit para a branch usada pela Vercel.

Não são necessárias novas variáveis de ambiente.

## Teste recomendado
1. Documentos → Venda → Moradia → Herança → Gerar checklist.
2. Abrir `Saber mais` na Certidão Predial.
3. Confirmar descrição, verificações, alertas e fonte.
4. Testar Venda → Terreno → Normal.
