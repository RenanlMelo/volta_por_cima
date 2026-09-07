import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import logo from "@/public/logo.png";

/**
 * Cabeçalho da marca, usado em todas as telas. Barra fina, fundo translúcido,
 * logo + wordmark à esquerda e um espaço opcional de ação à direita.
 */
export function Cabecalho({
  containerClassName = "max-w-2xl",
  acao,
  fixo = false,
}: {
  containerClassName?: string;
  acao?: ReactNode;
  fixo?: boolean;
}) {
  return (
    <header
      className={`z-20 w-full border-b border-borda/70 bg-fundo/85 backdrop-blur-sm ${
        fixo ? "sticky top-0" : ""
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-5 py-3 ${containerClassName}`}
      >
        <Link
          href="/"
          aria-label="Volta por Cima — página inicial"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
        >
          <Image
            src={logo}
            alt=""
            priority
            className="h-9 w-auto transition-transform duration-200 group-hover:scale-105 sm:h-10"
          />
          <span className="font-serif text-lg leading-none text-primaria sm:text-xl">
            Volta por Cima
          </span>
        </Link>
        {acao ? <div className="shrink-0">{acao}</div> : null}
      </div>
    </header>
  );
}
