"use client";

import { useState } from "react";
import { Botao } from "@/components/Botao";
import { CheckoutIndisponivelError, iniciarCheckout } from "@/lib/checkout";
import type { Diagnostico } from "@/lib/diagnostico/tipos";
import { rastrearPixel } from "@/lib/pixel";
import { PROTOCOLO_EFEITO_SAUDADE } from "@/lib/produtos";

type Situacao = "ocioso" | "carregando" | "indisponivel";

export function BotaoCheckout({ diagnostico }: { diagnostico: Diagnostico }) {
  const [situacao, setSituacao] = useState<Situacao>("ocioso");
  const [mensagem, setMensagem] = useState("");

  async function comprar() {
    setSituacao("carregando");
    setMensagem("");
    rastrearPixel("InitiateCheckout", {
      value: PROTOCOLO_EFEITO_SAUDADE.precoPorCentavos / 100,
      currency: "BRL",
      content_name: PROTOCOLO_EFEITO_SAUDADE.nome,
    });
    try {
      const { url } = await iniciarCheckout({
        produtoId: PROTOCOLO_EFEITO_SAUDADE.id,
        precoPorCentavos: PROTOCOLO_EFEITO_SAUDADE.precoPorCentavos,
        arquetipo: diagnostico.arquetipo,
        segmento: diagnostico.segmento,
        origem: "resultado-diagnostico",
      });
      window.location.href = url;
    } catch (erro) {
      setSituacao("indisponivel");
      setMensagem(
        erro instanceof CheckoutIndisponivelError
          ? erro.message
          : "Não foi possível abrir o pagamento agora. Tente novamente em instantes.",
      );
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Botao
        onClick={comprar}
        disabled={situacao === "carregando"}
        variante="claro"
        className="w-full max-w-sm"
      >
        {situacao === "carregando"
          ? "Abrindo pagamento…"
          : "Quero começar meu plano agora"}
      </Botao>

      {situacao === "indisponivel" ? (
        <p className="max-w-sm text-center text-xs text-white/80">{mensagem}</p>
      ) : null}
    </div>
  );
}
