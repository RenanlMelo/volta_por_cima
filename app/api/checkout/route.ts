import { NextResponse } from "next/server";

/**
 * Handler de checkout — ponto único de integração com o pagamento.
 *
 * Hoje o checkout é um link fixo da Cakto. O front chama este handler, recebe
 * `{ url }` e redireciona. Para trocar de provedor, basta mudar `LINK_CHECKOUT`
 * (ou a env `CHECKOUT_URL`) e, se precisar, criar a sessão aqui antes de
 * devolver a URL.
 */

const LINK_CHECKOUT =
  process.env.CHECKOUT_URL || "https://pay.cakto.com.br/vpacvet_1090564";

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

  if (!LINK_CHECKOUT) {
    return NextResponse.json(
      {
        mensagem:
          "O pagamento ainda está sendo configurado. Em breve você poderá concluir a compra por aqui.",
      },
      { status: 503 },
    );
  }

  // Passa a atribuição pra Cakto via UTM (aparece no painel de vendas).
  const url = new URL(LINK_CHECKOUT);
  if (dados.origem) url.searchParams.set("utm_source", dados.origem);
  if (dados.arquetipo) url.searchParams.set("utm_content", dados.arquetipo);
  if (dados.segmento) url.searchParams.set("utm_campaign", dados.segmento);

  return NextResponse.json({ url: url.toString() });
}
