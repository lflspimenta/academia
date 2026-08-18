-- Academia Imobiliária V1 — schema inicial
create type public.user_role as enum ('student','admin');
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,full_name text,role public.user_role not null default 'student',created_at timestamptz not null default now());
create table public.courses(id bigint generated always as identity primary key,title text not null,slug text unique not null,description text,level text,status text not null default 'draft',position int not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.modules(id bigint generated always as identity primary key,course_id bigint not null references public.courses(id) on delete cascade,title text not null,description text,position int not null default 0,status text not null default 'draft');
create table public.lessons(id bigint generated always as identity primary key,module_id bigint not null references public.modules(id) on delete cascade,title text not null,slug text not null,content jsonb not null default '{}'::jsonb,duration_minutes int,legal_sensitive boolean not null default false,verified_at date,source_url text,status text not null default 'draft',position int not null default 0,unique(module_id,slug));
create table public.quizzes(id bigint generated always as identity primary key,module_id bigint references public.modules(id) on delete cascade,lesson_id bigint references public.lessons(id) on delete cascade,title text not null,pass_percentage int not null default 80);
create table public.questions(id bigint generated always as identity primary key,quiz_id bigint not null references public.quizzes(id) on delete cascade,question text not null,explanation text,position int not null default 0);
create table public.answers(id bigint generated always as identity primary key,question_id bigint not null references public.questions(id) on delete cascade,answer text not null,is_correct boolean not null default false,position int not null default 0);
create table public.user_lesson_progress(user_id uuid not null references auth.users(id) on delete cascade,lesson_id bigint not null references public.lessons(id) on delete cascade,completed boolean not null default false,completed_at timestamptz,primary key(user_id,lesson_id));
create table public.quiz_attempts(id bigint generated always as identity primary key,user_id uuid not null references auth.users(id) on delete cascade,quiz_id bigint not null references public.quizzes(id) on delete cascade,score numeric(5,2) not null,passed boolean not null,created_at timestamptz not null default now());
create table public.document_guides(id bigint generated always as identity primary key,title text not null,property_type text,operation_type text,situation text,content jsonb not null default '{}'::jsonb,legal_sensitive boolean not null default true,verified_at date,source_url text,status text not null default 'draft');
create table public.legislative_updates(id bigint generated always as identity primary key,title text not null,topic text not null,summary text not null,impact text,source_url text not null,published_on date,verified_at date not null,status text not null default 'draft',created_at timestamptz not null default now());

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=auth.uid() and role='admin')$$;

alter table public.profiles enable row level security;alter table public.courses enable row level security;alter table public.modules enable row level security;alter table public.lessons enable row level security;alter table public.quizzes enable row level security;alter table public.questions enable row level security;alter table public.answers enable row level security;alter table public.user_lesson_progress enable row level security;alter table public.quiz_attempts enable row level security;alter table public.document_guides enable row level security;alter table public.legislative_updates enable row level security;

create policy "profiles own read" on public.profiles for select using(id=auth.uid() or public.is_admin());
create policy "profiles admin update" on public.profiles for update using(public.is_admin());
create policy "published courses read" on public.courses for select using(status='published' or public.is_admin());
create policy "admin courses" on public.courses for all using(public.is_admin()) with check(public.is_admin());
create policy "published modules read" on public.modules for select using(status='published' or public.is_admin());
create policy "admin modules" on public.modules for all using(public.is_admin()) with check(public.is_admin());
create policy "published lessons read" on public.lessons for select using(status='published' or public.is_admin());
create policy "admin lessons" on public.lessons for all using(public.is_admin()) with check(public.is_admin());
create policy "quiz read" on public.quizzes for select using(auth.uid() is not null);create policy "quiz admin" on public.quizzes for all using(public.is_admin()) with check(public.is_admin());
create policy "questions read" on public.questions for select using(auth.uid() is not null);create policy "questions admin" on public.questions for all using(public.is_admin()) with check(public.is_admin());
create policy "answers admin" on public.answers for all using(public.is_admin()) with check(public.is_admin());
-- As respostas corretas não são expostas diretamente aos alunos. O texto das opções deve ser servido por uma RPC/view segura na fase de ligação dos quizzes.
create policy "own lesson progress" on public.user_lesson_progress for all using(user_id=auth.uid() or public.is_admin()) with check(user_id=auth.uid() or public.is_admin());
create policy "own quiz attempts" on public.quiz_attempts for all using(user_id=auth.uid() or public.is_admin()) with check(user_id=auth.uid() or public.is_admin());
create policy "published guides read" on public.document_guides for select using(status='published' or public.is_admin());create policy "admin guides" on public.document_guides for all using(public.is_admin()) with check(public.is_admin());
create policy "published updates read" on public.legislative_updates for select using(status='published' or public.is_admin());create policy "admin updates" on public.legislative_updates for all using(public.is_admin()) with check(public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''));return new;end;$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.courses(title,slug,description,level,status,position) values
('Iniciante · Entrar no Imobiliário','iniciante','Formação base para começar e acompanhar uma transação imobiliária.','Nível 1','published',1),
('Terrenos e Potencial Construtivo','terrenos','PDM, condicionantes, PIP, loteamentos e desenvolvimento.','Especialização','published',2),
('Documentação Avançada','documentacao-avancada','Registo, matriz, urbanismo, heranças, usufrutos e ónus.','Especialização','published',3);
