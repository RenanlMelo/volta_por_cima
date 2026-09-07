import Image from "next/image";

/**
 * Print de conversa (WhatsApp), no mesmo formato do mock fictício que existia
 * antes: moldura escura tipo capinha de celular.
 *
 * As imagens em `public/relato1.png` e `public/relato2.png` são recortes de
 * conversas reais, já anonimizadas (foto de rosto borrada, nome real trocado
 * por "Ele" — ver histórico do projeto) e cortadas numa borda limpa entre
 * mensagens, para caber num card compacto sem esticar nem cortar texto.
 */
export function PrintRelato({
  src,
  alt,
  width,
  height,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-[26px] border border-borda bg-[#0b3d36] p-2  ${className}`}
    >
      <div className="overflow-hidden rounded-[20px]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
        />
      </div>
    </figure>
  );
}
