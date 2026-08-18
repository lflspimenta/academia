# V7.1 — Build corrigido + Logout

Esta versão corrige o erro de sintaxe em `components/AppShell.tsx`, mantém a ferramenta `Que documentos preciso?` no menu e acrescenta `Terminar sessão`.

## Instalação
- Não executar SQL novo.
- Substituir os ficheiros no GitHub por esta versão e fazer commit/push.
- A Vercel fará novo deploy.

## Teste
1. Entrar na app.
2. Confirmar no menu: Analisar Terreno, Alterar Uso do Imóvel, Que documentos preciso?.
3. Clicar em Terminar sessão.
4. Confirmar redirecionamento para `/login`.
5. Tentar abrir `/academia` sem autenticação; deve regressar ao login.
