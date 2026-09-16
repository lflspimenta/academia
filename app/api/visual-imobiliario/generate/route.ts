import { NextResponse } from "next/server";

/**
 * Endpoint reservado ao motor de geração.
 *
 * O frontend está concluído sem acoplar o produto a um fornecedor específico.
 * Na fase seguinte este handler deverá:
 * 1. validar autenticação e limites do utilizador;
 * 2. receber a fotografia e as opções normalizadas;
 * 3. armazenar o original no Supabase Storage;
 * 4. construir instruções internas (sem prompts livres);
 * 5. chamar o fornecedor de edição/geração escolhido;
 * 6. guardar original + resultado + metadados;
 * 7. devolver jobId/status/resultUrl.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "AI_PROVIDER_NOT_CONNECTED",
      message: "Interface concluída. Motor de IA ainda não configurado.",
    },
    { status: 501 }
  );
}
