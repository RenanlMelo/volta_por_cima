import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "secundario" | "claro";
type Tamanho = "padrao" | "grande";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria disabled:cursor-not-allowed disabled:opacity-40";

const POR_TAMANHO: Record<Tamanho, string> = {
  padrao: "px-7 py-3.5 text-base",
  grande: "px-9 py-4 text-lg",
};

const POR_VARIANTE: Record<Variante, string> = {
  primario:
    "bg-primaria text-white shadow-[0_12px_32px_-12px_rgba(88,37,63,0.55)] hover:bg-primaria-escura hover:-translate-y-0.5",
  secundario:
    "border border-borda bg-superficie text-texto hover:border-primaria-clara hover:text-primaria",
  claro:
    "bg-white text-primaria-escura shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5",
};

function classes(variante: Variante, tamanho: Tamanho, extra: string) {
  return `${BASE} ${POR_TAMANHO[tamanho]} ${POR_VARIANTE[variante]} ${extra}`;
}

export function BotaoLink({
  href,
  variante = "primario",
  tamanho = "padrao",
  className = "",
  children,
}: {
  href: string;
  variante?: Variante;
  tamanho?: Tamanho;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={classes(variante, tamanho, className)}>
      {children}
    </Link>
  );
}

export function Botao({
  variante = "primario",
  tamanho = "padrao",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variante?: Variante; tamanho?: Tamanho }) {
  return (
    <button className={classes(variante, tamanho, className)} {...props}>
      {children}
    </button>
  );
}
