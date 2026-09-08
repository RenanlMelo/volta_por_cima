// Envio de eventos do quiz para a planilha do Google (API Sheets v4). O front
// só chama /api/eventos; a autenticação (conta de serviço + chave privada) fica
// inteira no servidor. Regra de ouro: nada aqui pode travar ou atrasar o fluxo
// da usuária — se o registro falhar, o quiz e o resultado seguem normalmente.

import { lerSessao, marcarSessaoEnviada } from "./armazenamento";
import { calcularDiagnostico } from "./diagnostico/motor";
import type { RespostasQuiz } from "./diagnostico/tipos";

/** De onde veio a visita: utm_source na URL ou o referrer. */
function origem(): string {
  if (typeof window === "undefined") return "";
  try {
    const utm = new URLSearchParams(window.location.search).get("utm_source");
    return utm || document.referrer || "";
  } catch {
    return "";
  }
}

/**
 * Registra a conclusão do quiz na planilha (dados anônimos: só o diagnóstico
 * calculado e as respostas). Idempotente por sessão: se já foi enviado, não
 * repete. Chamada em "fire-and-forget" — não dá para `await` no fluxo.
 */
export async function registrarConclusaoQuiz(
  respostas: RespostasQuiz,
): Promise<void> {
  const sessao = lerSessao();
  if (!sessao || sessao.enviadoEm) return;

  const d = calcularDiagnostico(respostas);
  const corpo = {
    evento: "quiz_concluido",
    id: sessao.id ?? "",
    arquetipo: d.arquetipo,
    segmento: d.segmento,
    estagio: d.estagio,
    nivelContato: d.nivelContato,
    intensidadeCiclo: d.intensidadeCiclo,
    objetivo: d.objetivo,
    prontidao: d.prontidao,
    estadoEmocional: d.estadoEmocional,
    respostas,
    origem: origem(),
  };

  try {
    const resposta = await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      // Mantém o envio vivo mesmo com a navegação para /resultado logo em seguida.
      keepalive: true,
    });
    // 204 = linha gravada. 200 = coleta desligada (não marca como enviada,
    // para não perder a conclusão quando a planilha for ligada depois).
    if (resposta.status === 204) marcarSessaoEnviada();
  } catch {
    // Sem rede ou planilha fora do ar: ignoramos de propósito.
  }
}
