"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ETAPAS = [
  "Contexto da situação",
  "Seu padrão de comportamento",
  "Nível de contato",
  "Momento emocional",
  "Objetivo principal",
];

const INTERVALO_ETAPA = 620;
const PAUSA_FINAL = 700;
const LIMITE_SEGURANCA = 9000;

/**
 * Tela de processamento (blueprint, seção 9). Não simula "IA analisando dados":
 * representa a montagem do diagnóstico determinístico que já foi calculado.
 *
 * Robustez: `aoConcluir` é sempre chamado uma única vez — pelo fluxo normal ou
 * por um limite de segurança, mesmo que os timers sejam estrangulados (aba em
 * segundo plano, por exemplo).
 */
export function TelaProcessamento({ aoConcluir }: { aoConcluir: () => void }) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const concluidoRef = useRef(false);

  useEffect(() => {
    const finalizar = () => {
      if (concluidoRef.current) return;
      concluidoRef.current = true;
      aoConcluir();
    };

    let etapa = 0;
    let timeoutFinal: ReturnType<typeof setTimeout> | undefined;

    const intervalo = setInterval(() => {
      etapa += 1;
      setEtapaAtual(etapa);
      if (etapa >= ETAPAS.length) {
        clearInterval(intervalo);
        timeoutFinal = setTimeout(finalizar, PAUSA_FINAL);
      }
    }, INTERVALO_ETAPA);

    const seguranca = setTimeout(finalizar, LIMITE_SEGURANCA);

    return () => {
      clearInterval(intervalo);
      clearTimeout(seguranca);
      if (timeoutFinal) clearTimeout(timeoutFinal);
    };
  }, [aoConcluir]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        className="mb-8 size-14 rounded-full border-[3px] border-superficie-suave border-t-primaria"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <h2 className="mb-8 text-2xl text-texto">Analisando seu diagnóstico…</h2>
      <ul className="w-full max-w-xs space-y-3 text-left">
        {ETAPAS.map((etapa, i) => {
          const concluida = i < etapaAtual;
          return (
            <li
              key={etapa}
              className={`flex items-center gap-3 text-[15px] transition-opacity duration-300 ${
                concluida ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full border text-white transition-colors ${
                  concluida
                    ? "border-sucesso bg-sucesso"
                    : "border-borda bg-transparent"
                }`}
              >
                {concluida ? (
                  <svg viewBox="0 0 20 20" fill="none" className="size-3">
                    <path
                      d="M4 10.5l4 4 8-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span className={concluida ? "text-texto" : "text-texto-suave"}>
                {etapa}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
