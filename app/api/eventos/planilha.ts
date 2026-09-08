// Escrita na planilha do Google via API Sheets v4, autenticando com uma conta
// de serviço (service account). Sem tela de consentimento: a conta de serviço
// é um "robô" com e-mail próprio; basta compartilhar a planilha com esse e-mail.
//
// Módulo só de servidor (usa `node:crypto` e a chave privada). Nunca importar
// no cliente.

import crypto from "node:crypto";

const ESCOPO = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

/** Ordem das colunas na aba. A linha montada na rota segue exatamente esta ordem. */
export const COLUNAS = [
  "recebido_em",
  "id",
  "evento",
  "arquetipo",
  "segmento",
  "estagio",
  "nivel_contato",
  "intensidade_ciclo",
  "objetivo",
  "prontidao",
  "estado_emocional",
  "origem",
  "respostas",
] as const;

interface ContaServico {
  client_email: string;
  private_key: string;
}

export function planilhaConfigurada(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_SHEETS_ID,
  );
}

function conta(): ContaServico {
  const bruto = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!bruto) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON ausente");
  const json = JSON.parse(bruto) as Partial<ContaServico>;
  if (!json.client_email || !json.private_key) {
    throw new Error("JSON da conta de serviço incompleto (client_email/private_key)");
  }
  return {
    client_email: json.client_email,
    // Alguns painéis (Vercel/CI) guardam a chave com \n escapado.
    private_key: json.private_key.replace(/\\n/g, "\n"),
  };
}

function base64url(entrada: Buffer | string): string {
  return Buffer.from(entrada)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Cache do access token entre requisições (vale ~1h). Evita reassinar o JWT
// a cada conclusão de quiz.
let cacheToken: { valor: string; expiraEm: number } | null = null;

async function accessToken(): Promise<string> {
  const agora = Math.floor(Date.now() / 1000);
  if (cacheToken && cacheToken.expiraEm > agora + 60) return cacheToken.valor;

  const { client_email, private_key } = conta();
  const cabecalho = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const reivindicacoes = base64url(
    JSON.stringify({
      iss: client_email,
      scope: ESCOPO,
      aud: TOKEN_URL,
      iat: agora,
      exp: agora + 3600,
    }),
  );
  const assinatura = base64url(
    crypto.sign("RSA-SHA256", Buffer.from(`${cabecalho}.${reivindicacoes}`), private_key),
  );
  const jwt = `${cabecalho}.${reivindicacoes}.${assinatura}`;

  const resposta = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!resposta.ok) {
    const texto = await resposta.text().catch(() => "");
    throw new Error(`Falha ao autenticar na Google (${resposta.status}): ${texto.slice(0, 200)}`);
  }
  const dados = (await resposta.json()) as { access_token: string; expires_in: number };
  cacheToken = { valor: dados.access_token, expiraEm: agora + dados.expires_in };
  return dados.access_token;
}

// Garante que a primeira linha da aba tem os nomes de coluna. Roda uma vez por
// inicialização do processo (cold start).
let cabecalhoOk = false;

async function garantirCabecalho(id: string, aba: string, token: string): Promise<void> {
  if (cabecalhoOk) return;
  const faixa = `${encodeURIComponent(aba)}!A1:M1`;
  const auth = { Authorization: `Bearer ${token}` };

  const atual = await fetch(`${SHEETS_API}/${id}/values/${faixa}`, { headers: auth });
  if (atual.ok) {
    const dados = (await atual.json()) as { values?: string[][] };
    if (dados.values?.[0]?.[0] === COLUNAS[0]) {
      cabecalhoOk = true;
      return;
    }
  }

  const gravou = await fetch(
    `${SHEETS_API}/${id}/values/${faixa}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [COLUNAS] }),
    },
  );
  if (!gravou.ok) {
    const texto = await gravou.text().catch(() => "");
    throw new Error(`Não foi possível escrever o cabeçalho (${gravou.status}): ${texto.slice(0, 200)}`);
  }
  cabecalhoOk = true;
}

/** Acrescenta uma linha ao fim da aba. `valores` segue a ordem de `COLUNAS`. */
export async function adicionarLinha(valores: (string | number)[]): Promise<void> {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_ID ausente");
  const aba = process.env.GOOGLE_SHEETS_ABA || "quiz";

  const token = await accessToken();
  await garantirCabecalho(id, aba, token);

  const faixa = `${encodeURIComponent(aba)}!A1`;
  const resposta = await fetch(
    `${SHEETS_API}/${id}/values/${faixa}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [valores] }),
    },
  );
  if (!resposta.ok) {
    const texto = await resposta.text().catch(() => "");
    throw new Error(`Sheets append falhou (${resposta.status}): ${texto.slice(0, 200)}`);
  }
}
