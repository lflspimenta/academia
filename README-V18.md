# V18 — Persistência dos testes

Corrige dois problemas:
- teste aprovado passa a aparecer como concluído na listagem do módulo, com a melhor classificação aprovada;
- ao voltar a abrir um teste, a última tentativa aparece guardada em vez de abrir como um teste novo em branco.

Novas tentativas guardam também as respostas selecionadas, permitindo rever a tentativa. Tentativas antigas, criadas antes da V18, mantêm score/estado, mas não têm respostas históricas para reconstruir.

Instalação:
1. Executar `supabase/v18_quiz_persistencia.sql`.
2. Fazer deploy desta versão na Vercel.
