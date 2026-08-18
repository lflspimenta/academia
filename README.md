# Academia Imobiliária — V1 real

Base Next.js + Supabase, sem pagamentos, mantendo o design aprovado.

## 1. Criar o projeto Supabase
1. Criar um projeto em supabase.com.
2. Abrir SQL Editor e executar `supabase/schema.sql`.
3. Em Project Settings/API copiar Project URL e Publishable Key.
4. Criar `.env.local` a partir de `.env.example`.

## 2. Criar o primeiro administrador
1. Authentication > Users > Add user.
2. Depois no SQL Editor executar:
   `update public.profiles set role='admin' where id='<UUID DO UTILIZADOR>';`

## 3. Executar localmente
Requer Node.js 20.9+.

```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

## 4. Publicar na Vercel
1. Enviar esta pasta para um repositório GitHub.
2. Na Vercel, New Project > importar o repositório.
3. Adicionar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` em Environment Variables.
4. Deploy.

## Estado desta V1
- Login por email/password ligado ao Supabase.
- Proteção de rotas através de `proxy.ts` (Next.js 16).
- Perfis Student/Admin no banco de dados.
- Schema para cursos, módulos, aulas, quizzes, perguntas, respostas, progresso, documentos e Radar Legislativo.
- RLS ativado e políticas iniciais.
- Interface premium aprovada aplicada às páginas principais.
- Sem Stripe/pagamentos nesta fase.

## Próxima evolução
Ligar as páginas de Academia/Admin aos dados reais do Supabase e criar formulários de edição/publicação no backoffice.

## Recuperação de password

A V1 inclui agora o fluxo completo de recuperação:

- `/forgot-password` envia o email através do Supabase Auth.
- `/auth/callback` troca o código PKCE por uma sessão válida.
- `/reset-password` permite definir a nova password.
- O utilizador é depois encaminhado novamente para `/login`.

No Supabase > Authentication > URL Configuration, mantenha:

- Site URL: o domínio de produção da Vercel.
- Redirect URLs: inclua `https://SEU-DOMINIO.vercel.app/**`.

Para produção com domínio próprio, adicione também esse domínio às Redirect URLs.
