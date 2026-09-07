import { PrintRelato } from "@/components/PrintRelato";

export function ProvaSocial() {
  return (
    <aside className="rounded-3xl border border-borda bg-superficie/60 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-acento">
        Quem já passou por isso
      </p>
      <h3 className="mt-1.5 text-lg leading-snug text-texto">
        Você não está sozinha nessa história
      </h3>
      <PrintRelato
        src="/relato2.png"
        alt="Print de uma conversa mostrando uma reaproximação leve, sem cobrança"
        width={700}
        height={1290}
        className="mt-4 w-full"
      />
    </aside>
  );
}
