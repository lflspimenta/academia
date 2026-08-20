-- ALTERAR APENAS OS EMAILS DE TESTE
do $$
declare
  tester_emails text[] := array['catia.bb@gmail.com','COLOCAR_SEGUNDO_EMAIL_AQUI'];
  em text; uid uuid;
begin
 foreach em in array tester_emails loop
   select id into uid from auth.users where lower(email)=lower(em) limit 1;
   if uid is null then raise notice 'Utilizador % não encontrado',em; continue; end if;
   delete from public.quiz_attempts where user_id=uid;
   delete from public.user_lesson_progress where user_id=uid;
   delete from public.certificates where user_id=uid;
   raise notice 'Teste reiniciado: %',em;
 end loop;
end $$;
