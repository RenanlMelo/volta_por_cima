import { NextResponse } from "next/server";
import { adicionarLinha, planilhaConfigurada } from "./planilha";

/**
 * Coletor de eventos do quiz — grava uma linha na planilha do Google (API
 * Sheets v4) autenticando com uma conta de serviço. As credenciais ficam só no
 * servidor; nada disso vai para o bundle do cliente.
 *
 * Configuração (ver `.env.example`):
 *  - GOOGLE_SHEETS_ID: id da planilha (trecho da URL entre `/d/` e `/edit`).
 *  - GOOGLE_SERVICE_ACCOUNT_JSON: conteúdo do arquivo de chave da conta de serviço.
 *  - GOOGLE_SHEETS_ABA: nome da aba (opcional, padrão `quiz`).
 *
 * Sem essas variáveis a coleta fica desligada: respondemos 204 e o quiz segue
 * normalmente. O registro é sempre opcional e nunca trava o fluxo da usuária.
 *
 * Passo a passo da planilha: `docs/planilha-google.md`.
 */

export const runtime = "nodejs";

function texto(valor: unknown): string {
  if (typeof valor === "string") return valor;
  return valor == null ? "" : String(valor);
}

export async function POST(request: Request) {
  let corpo: Record<string, unknown>;
  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ mensagem: "Requisição inválida." }, { status: 400 });
  }

  if (!planilhaConfigurada()) {
    // Coleta desligada (sem env vars): aceitamos, mas sinalizamos que NÃO
    // gravou — assim o cliente não marca a sessão como enviada e a conclusão
    // ainda pode ser registrada depois que a planilha for configurada.
    return NextResponse.json({ registrado: false }, { status: 200 });
  }

  // Mesma ordem de `COLUNAS` em `planilha.ts`.
  const linha: (string | number)[] = [
    new Date().toISOString(),
    texto(corpo.id),
    texto(corpo.evento),
    texto(corpo.arquetipo),
    texto(corpo.segmento),
    texto(corpo.estagio),
    texto(corpo.nivelContato),
    typeof corpo.intensidadeCiclo === "number" ? corpo.intensidadeCiclo : "",
    texto(corpo.objetivo),
    texto(corpo.prontidao),
    texto(corpo.estadoEmocional),
    texto(corpo.origem),
    JSON.stringify(corpo.respostas ?? {}),
  ];

  try {
    await adicionarLinha(linha);
  } catch (erro) {
    console.error("[eventos] falha ao gravar na planilha:", erro);
    return NextResponse.json({ mensagem: "Falha ao registrar." }, { status: 502 });
  }

  return new NextResponse(null, { status: 204 });
}
