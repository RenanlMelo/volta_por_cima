import type { Arquetipo } from "@/lib/diagnostico/tipos";

const GLIFOS: Record<Arquetipo, React.ReactNode> = {
  corrida: (
    <path
      d="M6 7l5 5-5 5M13 7l5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  silencio: (
    <path
      d="M15.5 15.5A7 7 0 1 1 12 3a5.5 5.5 0 0 0 3.5 12.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  ),
  vitrine: (
    <>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  explosao: (
    <path
      d="M12 3l2.2 5.3L20 9l-4.3 3.4L17 18l-5-3-5 3 1.3-5.6L4 9l5.8-.7L12 3z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
};

export function EmblemaArquetipo({
  arquetipo,
  className = "size-16",
}: {
  arquetipo: Arquetipo;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-primaria text-white shadow-[var(--sombra-suave)] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-1/2">
        {GLIFOS[arquetipo]}
      </svg>
    </span>
  );
}
