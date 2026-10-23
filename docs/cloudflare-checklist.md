# Checklist Cloudflare per Visibilità AI & GEO — Capri DMC

**Destinatario:** Pep (`partnerships@capridmc.com`)  
**Data:** 24 Ottobre 2026  
**Riferimento:** Vincolo §3.2 dell'Handoff SEO + GEO

> [!WARNING]
> Nelle nuove zone Cloudflare, la protezione anti-AI è attiva di default e può bloccare i crawler degli assistenti (ChatGPT, Claude, Perplexity) con sfide CAPTCHA o con un `robots.txt` gestito, **senza che il codice sorgente o il repository se ne accorgano**.

Seguire i seguenti passaggi nella dashboard di Cloudflare:

---

## 1. Sicurezza Bot & AI Scrapers

1. Accedere alla dashboard Cloudflare su [dash.cloudflare.com](https://dash.cloudflare.com).
2. Selezionare la zona / dominio di **Capri DMC** (`capridmc.com`).
3. Andare su **Security** → **Bots**.
4. Alla voce **Block AI bots / AI Scrapers and Crawlers**:
   - Impostare su **Allow** (oppure configurare una Custom WAF Rule dedicata per consentire esplicitamente i bot di ricerca/assistenti indicati al punto 3).
5. **Bot Fight Mode / Super Bot Fight Mode**:
   - Assicurarsi che i crawler legittimi non vengano sfidati da JavaScript Challenge o CAPTCHA.

---

## 2. Managed robots.txt & Content Signals

1. Andare su **Scrape Shield** (oppure **Security** → **Bots** → **Managed robots.txt**).
2. Se attiva l'opzione **Managed robots.txt** o **Content Signals**:
   - **Disattivarla**, oppure assicurarsi che rispetti le direttive del file statico `public/robots.txt` presente nel repository, altrimenti Cloudflare sovrascriverà le intestazioni consentite alle AI.

---

## 3. Disattivazione URL *.workers.dev (Prevenzione Contenuti Duplicati)

Attualmente il sito è raggiungibile anche tramite URL `capridmc-reborn.partnerships-ef3.workers.dev`.
Una volta associato e propagato il dominio di produzione `https://www.capridmc.com`:
1. Andare su **Workers & Pages** → Selezionare il progetto `capridmc-reborn`.
2. Andare su **Settings** → **Domains & Routes**.
3. Disattivare l'accesso pubblico diretto dall'indirizzo `*.workers.dev` oppure impostarlo su non indicizzabile. I preview branch generano automaticamente `<meta name="robots" content="noindex, nofollow" />` grazie al componente `Seo.astro`.

---

## 4. Test di Verifica da Terminale

Eseguire i seguenti comandi per verificare che Cloudflare risponda con `HTTP 200` e non con `403` o `429`:

```bash
# OpenAI SearchBot (ChatGPT Search)
curl -A "OAI-SearchBot" -I https://www.capridmc.com/

# Anthropic SearchBot (Claude)
curl -A "Claude-SearchBot" -I https://www.capridmc.com/

# Perplexity AI
curl -A "PerplexityBot" -I https://www.capridmc.com/

# Applebot (Apple Intelligence)
curl -A "Applebot" -I https://www.capridmc.com/

# Googlebot (AI Overviews)
curl -A "Googlebot" -I https://www.capridmc.com/

# Bingbot (Microsoft Copilot)
curl -A "Bingbot" -I https://www.capridmc.com/
```

**Esito atteso:** `HTTP/2 200` (o `HTTP/1.1 200 OK`) su tutte le richieste.
