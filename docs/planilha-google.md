# Planilha como "banco" do MVP (Google Sheets + conta de serviço)

Enquanto o projeto é MVP, os eventos do quiz são gravados numa planilha do
Google. O site autentica com uma **conta de serviço** (um "robô" do Google com
e-mail próprio) — não há tela de consentimento nem login de usuária envolvidos.

```
quiz concluído
  → lib/eventos.ts            (calcula o diagnóstico, monta o payload anônimo)
  → POST /api/eventos         (servidor: assina um JWT com a chave da conta de serviço)
  → API Google Sheets v4      (append de 1 linha na aba "quiz")
```

Código: [`app/api/eventos/route.ts`](../app/api/eventos/route.ts) +
[`app/api/eventos/planilha.ts`](../app/api/eventos/planilha.ts).

## 1. Criar a planilha

1. Crie uma planilha em <https://sheets.new>.
2. Renomeie a primeira aba para **`quiz`** (duplo-clique na aba embaixo).
   O cabeçalho das colunas é escrito sozinho na primeira gravação.
3. Guarde o **id da planilha**: na URL
   `https://docs.google.com/spreadsheets/d/`**`ESTE_TRECHO`**`/edit`.

## 2. Criar a conta de serviço (Google Cloud, grátis)

1. Abra <https://console.cloud.google.com/> e crie um projeto (ou use um existente).
2. **APIs e serviços → Biblioteca** → procure **Google Sheets API** → **Ativar**.
3. **APIs e serviços → Credenciais → Criar credenciais → Conta de serviço**.
   - Dê um nome (ex.: `volta-por-cima-planilha`) e conclua (sem papéis).
4. Abra a conta de serviço criada → aba **Chaves → Adicionar chave → Criar nova
   chave → JSON**. Baixa um arquivo `.json`. **Esse arquivo é o segredo** — não
   comitar.
5. Copie o e-mail da conta de serviço (algo como
   `volta-por-cima-planilha@SEU-PROJETO.iam.gserviceaccount.com`).

## 3. Compartilhar a planilha com a conta de serviço

Na planilha → **Compartilhar** → cole o e-mail da conta de serviço → permissão
**Editor** → enviar. É isso que autoriza a escrita; nenhuma tela extra.

## 4. Ligar no site

No `.env.local` (e nas variáveis de ambiente da Vercel):

```
GOOGLE_SHEETS_ID=1AbC...id-da-planilha
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","token_uri":"https://oauth2.googleapis.com/token", ...}
# GOOGLE_SHEETS_ABA=quiz   # só se a aba tiver outro nome
```

- Cole o **conteúdo inteiro** do arquivo `.json` baixado como valor de
  `GOOGLE_SERVICE_ACCOUNT_JSON`, numa linha só. O `\n` dentro de `private_key`
  pode ficar como está — o código normaliza.
- Na Vercel, cole o JSON no campo de valor normalmente (aspas incluídas).
- Sem `GOOGLE_SHEETS_ID` **e** `GOOGLE_SERVICE_ACCOUNT_JSON`, a coleta fica
  desligada e `/api/eventos` responde `204` sem gravar — útil em desenvolvimento.

## 5. Testar

- Rode o site, conclua o quiz uma vez e confira a nova linha na aba `quiz`.
- Erros de gravação aparecem no log do servidor com o prefixo `[eventos]`
  (a usuária nunca é bloqueada por isso).
- Reenvio: cada sessão só grava uma vez (`enviadoEm` no `localStorage`). Para
  forçar de novo, refaça o quiz numa aba anônima ou limpe o storage do site.

## Colunas gravadas

| coluna | origem |
| --- | --- |
| `recebido_em` | timestamp ISO gerado no servidor |
| `id` | id da sessão (`SessaoSalva.id`) — casa a conclusão com o checkout no futuro |
| `evento` | `quiz_concluido` (haverá outros quando o checkout entrar) |
| `arquetipo`, `segmento`, `estagio`, `nivel_contato` | dimensões do diagnóstico |
| `intensidade_ciclo` | 0–5 (comportamentos de monitoramento na P3) |
| `objetivo`, `prontidao`, `estado_emocional` | respostas P9 / P10 / P8 |
| `origem` | `utm_source` ou `document.referrer` |
| `respostas` | JSON com as 10 respostas |

## Quando trocar por um banco de verdade

A planilha aguenta bem alguns milhares de linhas. Passando disso, ou quando
precisar de consulta/relacionamento (juntar conclusão + checkout + reembolso),
migre para Vercel Postgres / Supabase mantendo o mesmo `POST /api/eventos` como
porta de entrada — só o conteúdo de `planilha.ts` muda.
