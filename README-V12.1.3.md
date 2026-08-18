# V12.1.3 — Testes dos módulos

Correção:
- mantém 1 teste no final de cada módulo;
- corrige a verificação de acesso à página do teste, incluindo o `course.id` na consulta;
- o clique em `Teste · Módulo ...` abre `/teste/[id]`;
- permite responder e submeter o teste;
- resultado e tentativa continuam registados pela função existente `submit_quiz`;
- quando não aprovado, surge `Repetir teste`.

Não requer SQL novo.
