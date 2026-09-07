import { NextResponse } from "next/server";

/**
 * Handler de checkout — ponto único de integração com o gateway de pagamento.
 *
 * Como conectar um gateway (Kiwify / Hotmart / Stripe / Mercado Pago):
 *  1. Defina as variáveis de ambiente do provedor (ver `.env.example`).
 *  2. No bloco marcado abaixo, crie a sessão/checkout no provedor usando
 *     `dados.produtoId` e `dados.precoPorCentavos`.
 *  3. Devolva `{ url }` com o link de pagamento — o front redireciona sozinho.
 *
 * Enquanto `CHECKOUT_PROVIDER` não estiver configurado, respondemos 503 com uma
 * mensagem amigável (o front trata isso e oferece captura de e-mail).
 */

interface CorpoCheckout {
  produtoId?: string;
  precoPorCentavos?: number;
  arquetipo?: string;
  segmento?: string;
  origem?: string;
}

export async function POST(request: Request) {
  let dados: CorpoCheckout;
  try {
    dados = (await request.json()) as CorpoCheckout;
  } catch {
    return NextResponse.json(
      { mensagem: "Requisição inválida." },
      { status: 400 },
    );
  }

  if (!dados.produtoId || typeof dados.precoPorCentavos !== "number") {
    return NextResponse.json(
      { mensagem: "Produto não informado." },
      { status: 422 },
    );
  }

  const provedor = process.env.CHECKOUT_PROVIDER;

  // ────────────────────────────────────────────────────────────────────
  // INTEGRAÇÃO COM O GATEWAY VAI AQUI.
  //
  // Exemplo (pseudo):
  //   if (provedor === "stripe") {
  //     const session = await stripe.checkout.sessions.create({ ... });
  //     return NextResponse.json({ url: session.url });
  //   }
  //   if (provedor === "kiwify") {
  //     const url = montarLinkKiwify(dados);
  //     return NextResponse.json({ url });
  //   }
  // ────────────────────────────────────────────────────────────────────

  if (!provedor) {
    return NextResponse.json(
      {
        mensagem:
          "O pagamento ainda está sendo configurado. Em breve você poderá concluir a compra por aqui.",
      },
      { status: 503 },
    );
  }

  // Provedor configurado mas ainda sem implementação específica.
  return NextResponse.json(
    {
      mensagem: `Gateway "${provedor}" ainda não implementado neste handler.`,
    },
    { status: 501 },
  );
}
