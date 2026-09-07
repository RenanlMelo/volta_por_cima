"use client";

import { useEffect, useRef, useState } from "react";

const FRASES = [
  "Respire fundo. Sem pressa.",
  "Não existe resposta certa aqui.",
  "Isto é só entre você e você.",
];

const DURACAO_PADRAO = 2200;
const LIMITE_SEGURANCA = 6000;

/**
 * Tela de carregamento exibida logo depois de "Fazer meu diagnóstico".
 * Momento de respiro antes da primeira pergunta — leve, acolhedor, curto.
 * `aoConcluir` é sempre chamado uma única vez (fluxo normal ou limite de segurança).
 */
export function TelaCarregamento({
  aoConcluir,
  duracao = DURACAO_PADRAO,
}: {
  aoConcluir: () => void;
  duracao?: number;
}) {
  const [frase, setFrase] = useState(0);
  const concluidoRef = useRef(false);

  useEffect(() => {
    const finalizar = () => {
      if (concluidoRef.current) return;
      concluidoRef.current = true;
      aoConcluir();
    };

    const principal = setTimeout(finalizar, duracao);
    const seguranca = setTimeout(finalizar, LIMITE_SEGURANCA);
    const troca = setInterval(
      () => setFrase((f) => (f + 1) % FRASES.length),
      1400,
    );

    return () => {
      clearTimeout(principal);
      clearTimeout(seguranca);
      clearInterval(troca);
    };
  }, [aoConcluir, duracao]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="relative mb-10 flex size-40 items-center justify-center">
        <span className="vpc-ondulacao absolute size-24 rounded-full bg-primaria-clara/30" />
        <span
          className="vpc-ondulacao absolute size-24 rounded-full bg-primaria-clara/25"
          style={{ animationDelay: "0.8s" }}
        />
        <span
          className="vpc-ondulacao absolute size-24 rounded-full bg-primaria-clara/20"
          style={{ animationDelay: "1.6s" }}
        />
        <span className="vpc-respiro relative flex size-16 items-center justify-center rounded-full bg-primaria text-white shadow-[var(--sombra-suave)]">
          <svg viewBox="0 0 24 24" fill="none" className="size-7">
            <path
              d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <p className="vpc-surge text-sm font-semibold uppercase tracking-[0.15em] text-acento">
        Preparando o seu diagnóstico
      </p>
      <p
        key={frase}
        className="vpc-surge mt-3 font-serif text-xl italic text-texto"
      >
        {FRASES[frase]}
      </p>
    </div>
  );
}
