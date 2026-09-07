/** Ícones simples (traço), 20x20, herdam currentColor. */

type Props = { className?: string };

export function IconeCheck({ className = "size-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeAtencao({ className = "size-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 3.5l7 12.5H3L10 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 8.5v3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconeEstrela({ className = "size-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5l1.9 4.6 5 .4-3.8 3.3 1.2 4.9L10 17.2 5.7 15.7l1.2-4.9L3 7.5l5-.4L10 2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeBussola({ className = "size-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13 7l-1.6 4.4L7 13l1.6-4.4L13 7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeRaio({ className = "size-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M11 2.5L4.5 11H9l-.8 6.5L15.5 9H11l0-6.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeEscudo({ className = "size-4" }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5l6 2.2v4.6c0 4-2.6 6.6-6 8-3.4-1.4-6-4-6-8V4.7L10 2.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10l1.8 1.8 3.2-3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
