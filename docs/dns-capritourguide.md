# Configurazione DNS & Produzione Dominio: capritourguide.com

**Destinatario:** Pep (`partnerships@capridmc.com`)  
**Data:** 25 Ottobre 2026  
**Dominio di Produzione per questo progetto:** `https://www.capritourguide.com`  
**Sito www.capridmc.com:** Invariato e gestito al 100% su IONOS (completamente indipendente).  
**Registrar Attuale:** IONOS  
**Hosting / Deploy:** Cloudflare Pages (`capridmc-reborn.pages.dev`)

---

## 1. Perché l'inserimento del reindirizzamento `@` in IONOS dava errore

Nel pannello di controllo IONOS:
- La tabella **DNS** accetta soltanto record standard (`A`, `AAAA`, `CNAME`, `MX`, `TXT`). **Non esiste il tipo "Reindirizzamento" tra i record DNS**.
- Inoltre, lo standard DNS **non consente record CNAME sull'host radice `@`** (`capritourguide.com` senza `www`). Se si tenta di inserire un CNAME per `@`, IONOS mostra un errore.
- Su IONOS, l'inoltro/reindirizzamento della radice `@` si gestisce tramite la sezione dedicata **"Uso del dominio"** (non dal DNS).

Dato che su `capritourguide.com` **non ci sono caselle email attive**, puoi completare la configurazione da zero scegliendo uno dei seguenti due metodi:

---

## 2. METODO A (Consigliato su IONOS — Nessun cambio Nameserver, 2 minuti)

### Parte 1: Su Cloudflare Pages
1. Accedi a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → seleziona **`capridmc-reborn`**.
2. Vai su **Custom Domains** (Domini personalizzati) → clicca su **Set up a custom domain**.
3. Inserisci: `www.capritourguide.com`.

---

### Parte 2: Nel pannello IONOS di `capritourguide.com`

#### Step 2.1 — Tabella "DNS" (Collega `www` al nuovo sito Astro)
1. Vai su **Dominio & SSL** → seleziona **`capritourguide.com`** → clicca sulla scheda **DNS**.
2. **Elimina** i vecchi record `A` e `AAAA` che hanno come nome host `www` (puntavano a `217.160.0.170` e `2001:8d8:...`).
3. Clicca su **Aggiungi record** (o modifica il record `www`):
   - **Tipo:** `CNAME`
   - **Nome host:** `www`
   - **Punti a / Destinazione:** `capridmc-reborn.pages.dev`
   - **TTL:** 1 ora (o Automatico)
   - Clicca su **Salva**.

*(A questo punto `www.capritourguide.com` punta al nuovo sito con la lucertola!)*

#### Step 2.2 — Scheda "Uso del dominio" (Inoltra `capritourguide.com` verso `www`)
Chi digita l'indirizzo senza `www` deve atterrare su `www.capritourguide.com`:
1. Dalla schermata principale di `capritourguide.com` su IONOS, clicca sulla scheda in alto **"Uso del dominio"** (oppure sull'icona delle opzioni / 3 puntini e seleziona **"Modifica tipo di utilizzo"** / **"Inoltra dominio"**).
2. Seleziona l'opzione **"Inoltro a URL esterno"** (o *"Reindirizza a un sito web"*).
3. Inserisci come destinazione esatta:
   ```text
   https://www.capritourguide.com
   ```
4. Seleziona tipo: **Reindirizzamento HTTP 301** (Permanente).
5. Salva.

---

## 3. METODO B (Alternativa: Spostare i Nameserver su Cloudflare)

Se vuoi evitare le restrizioni del pannello IONOS e gestire tutto da Cloudflare:
1. Su Cloudflare Dashboard, clicca su **Add a site** → inserisci `capritourguide.com` (piano **Free**).
2. Cloudflare ti mostrerà due nameserver (es. `ada.ns.cloudflare.com` e `bob.ns.cloudflare.com`).
3. Su IONOS: vai su **Server dei nomi** → **Server dei nomi personalizzati** e incolla i due nameserver Cloudflare.
4. Su Cloudflare potrai impostare con un solo clic sia `@` che `www` verso `capridmc-reborn.pages.dev`, con CNAME flattening automatico e certificato SSL per entrambi.

---

## 4. Codice del Progetto Aggiornato al 100% per `capritourguide.com`

Tutti i parametri di configurazione del repository sono stati allineati a `https://www.capritourguide.com`:
- `astro.config.mjs`: `site: 'https://www.capritourguide.com'`
- `src/components/Seo.astro`: canonical fisso su `https://www.capritourguide.com/`, Open Graph e Twitter card aggiornati
- `src/components/JsonLd.astro`: schema structured data su `https://www.capritourguide.com/#organization`, `#website`, `#webpage`
- `public/robots.txt`: sitemap `https://www.capritourguide.com/sitemap-index.xml`
- `public/llms.txt`, `public/llms-full.txt`, `public/index.md`: link interni aggiornati al nuovo dominio
