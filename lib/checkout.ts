// Camada de checkout. Nesta fase não há gateway conectado: o front chama
// /api/checkout e espera receber { url } para redirecionar. Trocar o gateway
// (Kiwify, Hotmart, Stripe, Mercado Pago) é só implementar o route handler.

export interface DadosCheckout {
  produtoId: string;
  precoPorCentavos: number;
  /** Contexto do diagnóstico, para atribuição e personalização pós-compra. */
  arquetipo?: string;
  segmento?: string;
  origem: string;
}

export interface RespostaCheckout {
  url: string;
}

export class CheckoutIndisponivelError extends Error {
  status: number;
  constructor(mensagem: string, status = 503) {
    super(mensagem);
    this.name = "CheckoutIndisponivelError";
    this.status = status;
  }
}

export async function iniciarCheckout(
  dados: DadosCheckout,
): Promise<RespostaCheckout> {
  let resposta: Response;
  try {
    resposta = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new CheckoutIndisponivelError(
      "Não conseguimos falar com o servidor de pagamento agora. Tente de novo em instantes.",
    );
  }

  const corpo = (await resposta.json().catch(() => ({}))) as Partial<
    RespostaCheckout & { mensagem: string }
  >;

  if (!resposta.ok || !corpo.url) {
    throw new CheckoutIndisponivelError(
      corpo.mensagem ??
        "O pagamento ainda está sendo configurado. Deixe seu e-mail que avisamos assim que abrir.",
      resposta.status || 503,
    );
  }

  return { url: corpo.url };
}
