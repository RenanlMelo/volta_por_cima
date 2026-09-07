"use client";

import type { Opcao } from "@/lib/diagnostico/tipos";

export function CartaoOpcao({
  opcao,
  selecionada,
  multipla,
  onClick,
}: {
  opcao: Opcao;
  selecionada: boolean;
  multipla: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionada}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria ${
        selecionada
          ? "border-primaria bg-superficie-suave shadow-[0_8px_24px_-14px_rgba(88,37,63,0.5)]"
          : "border-borda bg-superficie hover:border-primaria-clara hover:bg-superficie-suave/40"
      }`}
    >
      <span
        aria-hidden
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center border transition-colors ${
          multipla ? "rounded-md" : "rounded-full"
        } ${
          selecionada
            ? "border-primaria bg-primaria text-white"
            : "border-borda bg-superficie text-transparent group-hover:border-primaria-clara"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
          <path
            d="M4 10.5l4 4 8-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block font-medium leading-snug text-texto">
          {opcao.rotulo}
        </span>
        {opcao.descricao ? (
          <span className="mt-0.5 block text-sm text-texto-suave">
            {opcao.descricao}
          </span>
        ) : null}
      </span>
    </button>
  );
}
