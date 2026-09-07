export function BarraProgresso({
  numero,
  total,
}: {
  numero: number;
  total: number;
}) {
  const percentual = Math.round((numero / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-texto-suave">
        <span>
          Pergunta {numero} de {total}
        </span>
        <span>{percentual}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-superficie-suave">
        <div
          className="h-full rounded-full bg-primaria transition-[width] duration-500 ease-out"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
