import type { ReactNode } from "react";

type Tom = "neutro" | "destaque" | "positivo" | "atencao";

const ESTILO: Record<Tom, { card: string; etiqueta: string; icone: string }> = {
  neutro: {
    card: "border-borda bg-superficie",
    etiqueta: "text-acento",
    icone: "bg-superficie-suave text-primaria",
  },
  destaque: {
    card: "border-primaria bg-superficie-suave",
    etiqueta: "text-primaria-escura",
    icone: "bg-primaria text-white",
  },
  positivo: {
    card: "border-sucesso/35 bg-sucesso/5",
    etiqueta: "text-sucesso",
    icone: "bg-sucesso/15 text-sucesso",
  },
  atencao: {
    card: "border-acento/45 bg-acento/5",
    etiqueta: "text-acento",
    icone: "bg-acento/15 text-acento",
  },
};

export function BlocoResultado({
  indice = 0,
  etiqueta,
  titulo,
  tom = "neutro",
  icone,
  children,
}: {
  indice?: number;
  etiqueta: string;
  titulo?: string;
  tom?: Tom;
  icone?: ReactNode;
  children: ReactNode;
}) {
  const s = ESTILO[tom];
  return (
    <section
      className={`vpc-vista rounded-3xl border p-6 sm:p-7 ${s.card}`}
      style={{ animationDelay: `${Math.min(indice * 0.05, 0.3)}s` }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        {icone ? (
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${s.icone}`}
          >
            {icone}
          </span>
        ) : null}
        <p
          className={`text-xs font-semibold uppercase tracking-[0.14em] ${s.etiqueta}`}
        >
          {etiqueta}
        </p>
      </div>
      {titulo ? (
        <h3 className="mb-2 text-lg leading-snug text-texto sm:text-xl">
          {titulo}
        </h3>
      ) : null}
      <div className="text-[15px] leading-relaxed text-texto-suave [&_strong]:text-texto">
        {children}
      </div>
    </section>
  );
}
