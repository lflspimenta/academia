# V11 — Estrutura Comercial + Certificados

1. Execute `supabase/v11_certificados.sql`.
2. Confirme que o curso ID 12 passou a `Documentação Imobiliária Profissional` e o ID 3 ficou `archived`.
3. Depois publique os ficheiros da app.

A migração move os módulos do antigo curso 3 para o 12 sem apagar aulas, testes ou progresso.
Acessos do antigo curso são copiados para o novo.

Certificado:
- 100% das aulas publicadas concluídas.
- Todos os testes do curso aprovados segundo `pass_percentage` (normalmente 80%).
- Código único verificável.
- Carga horária calculada pelas durações das aulas.
- Página pública `/certificado/CODIGO`.
