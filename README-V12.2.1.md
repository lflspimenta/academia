# V12.2.1 — Revisão Legislativa

Auditoria consolidada das 5 formações + Glossário, verificada em 18/08/2026.

## Principais correções
- Arrendamento: corrige a formulação sobre forma escrita segundo o art. 1069.º do Código Civil.
- CMI/mediação: fontes alinhadas com Lei 15/2013 na redação em vigor e Portaria 228/2018.
- Urbanismo: alinhamento com RJUE após DL 108/2026, retificação de julho e Portaria 320/2026/1.
- RGEU: deixa de ser apresentado como simplesmente revogado numa data fixa.
- Crédito: fonte consolidada do DL 74-A/2017, alterado em 27/04/2026.
- Fiscalidade: mantém método sem cristalizar tabelas e aponta para AT atual.
- AML: reforça Lei 83/2017 + Regulamento IMPIC 603/2021.
- RGPD: acrescenta Lei 58/2019 e mantém distinção entre consentimento e outras bases de licitude.
- Certificação energética: fonte SCE/ADENE.
- Glossário: acrescenta Comunicação de Utilização, Comunicação Prévia com Prazo, Título de Utilização, Licença/Autorização de Utilização e RGEU.
- Glossário passa a mostrar fonte oficial e data de verificação quando aplicável.

## Instalação
Se ainda NÃO executou V12.2:
1. Execute `supabase/v12_2_glossario_profissional.sql`
2. Execute `supabase/v12_2_1_revisao_legislativa.sql`
3. Faça deploy da aplicação.

Se JÁ executou V12.2:
1. Pode voltar a executar `supabase/v12_2_glossario_profissional.sql` (é idempotente por `on conflict`)
2. Depois execute `supabase/v12_2_1_revisao_legislativa.sql`
3. Faça deploy.

Nenhum dos SQL altera progresso, resultados de testes, certificados ou acessos dos formandos.
