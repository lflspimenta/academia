# V9.1 — Acessos modulares na interface

Pré-requisito: `course_access`, `initial_course_id()` e `has_course_access()` já criados no Supabase.

Não é necessário executar SQL novo nesta versão.

## O que muda
- Iniciação continua incluída.
- Outros cursos aparecem bloqueados ao formando.
- Abrir URL direto de curso/aula/teste não contorna o acesso.
- Ferramentas são incluídas com:
  - Terrenos → Analisar Terreno
  - Urbanismo Prático → Alterar Uso do Imóvel
  - Documentação Imobiliária → Que documentos preciso?
- Dashboard calcula progresso apenas sobre formações disponíveis ao formando.
- Admin → Utilizadores passa a permitir Dar acesso / Retirar acesso por formação.
- Administradores mantêm acesso total.

## Publicação
Substitua os ficheiros no GitHub e faça deploy na Vercel.
