/**
 * Citação no estilo epígrafe de livro: texto em itálico, atribuição abaixo,
 * separada por um filete — sem "cara de card de app".
 */
export function Citacao({
  texto,
  autor,
  papel,
  className = "",
}: {
  texto: string;
  autor: string;
  papel?: string;
  className?: string;
}) {
  return (
    <figure
      className={`mx-auto max-w-md border-y border-borda py-6 text-center ${className}`}
    >
      <blockquote className="text-pretty font-serif text-xl italic leading-relaxed text-texto">
        “{texto}”
      </blockquote>
      <figcaption className="mt-4 text-sm text-texto-suave">
        <span aria-hidden className="mx-auto mb-2 block h-px w-6 bg-primaria-clara" />
        <span className="font-semibold uppercase tracking-[0.08em] text-primaria-escura">
          {autor}
        </span>
        {papel ? <span>, {papel}</span> : null}
      </figcaption>
    </figure>
  );
}
