# Academia Imobiliária — V2 Dinâmica

Esta versão transforma a Academia numa aplicação dinâmica com conteúdos carregados do Supabase.

## O que muda nesta V2

- Academia e cursos vêm da base de dados.
- Percurso Nível 1 com 10 módulos criado no Supabase.
- Primeira aula completa com mini teste.
- Progresso por utilizador guardado na base de dados.
- Testes corrigidos por função SQL no servidor sem expor `is_correct` ao aluno.
- Dashboard calcula progresso e média real.
- Radar Legislativo dinâmico.
- Backoffice para criar cursos, módulos, aulas e atualizações legislativas.
- Conteúdo legal inclui `verified_at` e fonte oficial.
- Área Terrenos passa a usar o curso dinâmico `/academia/terrenos`.

## Atualização no projeto Supabase já existente

Não volte a executar `schema.sql` se já o executou na V1.

Execute apenas:

`supabase/v2_dynamic.sql`

No Supabase: **SQL Editor → New query → cole todo o conteúdo do ficheiro → Run**.

O script acrescenta as funções seguras dos quizzes, estrutura os 10 módulos do Nível 1, cria a estrutura de Terrenos e introduz a primeira atualização do Radar relativa ao RJUE 2026 e à retificação publicada em julho de 2026.

## Atualizar no GitHub

Substitua os ficheiros do repositório pelos desta V2, mantendo as mesmas Environment Variables na Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Faça commit para a branch `main`. A Vercel deverá iniciar novo deploy automaticamente.

## Sequência recomendada de teste

1. Login com a conta admin.
2. Abrir `/academia`.
3. Abrir `Iniciante · Entrar no Imobiliário`.
4. Abrir a primeira aula.
5. Marcar a aula como concluída.
6. Fazer o mini teste.
7. Voltar ao Dashboard e confirmar progresso e média.
8. Abrir `/admin` e criar um curso/módulo/aula de teste em rascunho.
9. Publicar pelo backoffice e confirmar que aparece na Academia.
10. Abrir Radar Legislativo.

## Segurança dos testes

Os alunos não têm `SELECT` na tabela `answers`. A função `get_quiz_safe` devolve apenas o texto/id das opções. A função `submit_quiz` corrige dentro da base de dados e só depois devolve score, aprovação e explicações.

## Conteúdo jurídico

Conteúdo jurídico, fiscal, documental e urbanístico deve continuar a ser revisto antes de publicação. A V2 inclui campos de data de verificação e fonte oficial precisamente para manter essa disciplina editorial.
