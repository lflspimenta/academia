# Academia Imobiliária — V3.1

Atualização focada em duas melhorias:

1. Gestão de utilizadores dentro do Admin
2. Navegação completa em cursos, módulos, aulas e testes

## Antes do deploy — duas variáveis novas na Vercel

Em **Vercel → Project → Settings → Environment Variables**, adicione:

- `SUPABASE_SERVICE_ROLE_KEY` — a Secret/Service Role do Supabase. **Nunca** use `NEXT_PUBLIC_` neste nome.
- `NEXT_PUBLIC_SITE_URL` — por exemplo `https://academia-inky-two.vercel.app`

Mantenha também:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Depois faça um novo deploy.

## Onde obter a chave administrativa

No Supabase use a área de API Keys/Project Settings e copie a chave secreta/service role adequada ao servidor. Não partilhe essa chave e nunca a coloque no código do browser ou no GitHub.

## Gestão de utilizadores

Abra:

`/admin/utilizadores`

O administrador pode:
- criar utilizadores com nome, email, password temporária e perfil;
- alterar Aluno ↔ Administrador;
- bloquear/reativar acesso;
- solicitar email de recuperação de password.

A própria conta do administrador autenticado não pode ser bloqueada/despromovida nesse ecrã.

## Navegação

- Curso: botão **Voltar à Academia**.
- Aula: breadcrumb + **Voltar ao módulo**.
- Aula: **Aula anterior / Próxima aula**.
- Teste: **Voltar à aula** ou **Voltar ao módulo**.
- Testes de módulo aparecem no final do respetivo módulo.

## Base de dados

Esta atualização não exige SQL novo. Continue com o schema/V2 e o pacote V3 de conteúdo já executados.


## V5.1 — Analisar Terreno
Execute `supabase/v5_1_land_analyzer.sql` no Supabase. A rota `/terrenos` passa a ser uma ferramenta guiada e as análises podem ser guardadas por utilizador.
