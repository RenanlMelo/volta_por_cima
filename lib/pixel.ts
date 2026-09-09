// Wrapper seguro para o Meta Pixel. O script (`fbq`) é carregado no layout raiz;
// aqui a gente só dispara eventos se ele estiver disponível — se o usuário
// bloqueia rastreamento ou o script ainda não subiu, vira no-op silencioso.

type ParamsPixel = Record<string, string | number>;

type Fbq = (...args: unknown[]) => void;

export function rastrearPixel(evento: string, params?: ParamsPixel): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  try {
    if (params) fbq("track", evento, params);
    else fbq("track", evento);
  } catch {
    // pixel indisponível/bloqueado — ignora
  }
}
