// Catálogo de produtos. Preços em centavos para evitar erro de ponto flutuante.

export interface Produto {
  id: string;
  nome: string;
  precoDeCentavos: number; // valor cheio (âncora)
  precoPorCentavos: number; // valor praticado hoje
  tipo: "principal" | "order-bump" | "upsell";
}

export const PROTOCOLO_EFEITO_SAUDADE: Produto = {
  id: "protocolo-efeito-saudade-21d",
  nome: "Protocolo Efeito Saudade 21 dias",
  precoDeCentavos: 14990,
  precoPorCentavos: 2990,
  tipo: "principal",
};

export function formatarBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function percentualDesconto(produto: Produto): number {
  const { precoDeCentavos: de, precoPorCentavos: por } = produto;
  if (de <= 0 || por >= de) return 0;
  return Math.round((1 - por / de) * 100);
}
