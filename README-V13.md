# V13 — Revisão Pedagógica Integral

Base: V12.6.

## O que foi revisto
- 191 aulas das 5 formações.
- Cada aula passa a ter: domínio da matéria, procedimento prático, verificações, exemplo profissional, erros frequentes e limites profissionais.
- Fontes e data de verificação atualizadas para 20/08/2026.
- Correção crítica de Urbanismo: o DL 155-B/2026 prorrogou para 01/10/2026 a entrada em vigor das alterações do DL 108/2026. As aulas relevantes passam a distinguir regime atual e regime aprovado para outubro.
- Caderneta Predial: removida a simplificação “área bruta de construção = privativa + dependente”; o laboratório passa a remeter para a expressão fiscal do art. 40.º CIMI.
- A estrutura, IDs, slugs, módulos e testes não são alterados.

## Aplicação
1. Se quiser reiniciar os testers, editar e executar `supabase/v13_revisao_integral/00_reset_contas_teste.sql`.
2. Executar os 5 SQL de formação em `supabase/v13_revisao_integral/`.
3. Fazer deploy deste projeto para aplicar também a correção da interatividade.

Os SQL de conteúdo não apagam progresso. O reset é separado e só atua nos emails indicados.
