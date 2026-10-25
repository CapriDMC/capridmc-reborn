# Configurazione Dominio Satellite: capritourguide.com

**Destinatario:** Pep (`partnerships@capridmc.com`)  
**Data:** 25 Ottobre 2026  
**Progetto:** `CapriDMC/capridmc-reborn` (Cloudflare Pages: `capridmc-reborn.pages.dev`)  
**Ruolo del Dominio:** **Satellite** verso `https://www.capridmc.com` (nessuna email collegata, massima priorità SEO su Capri DMC).  
**Registrar Attuale:** IONOS

---

## 1. Perché IONOS non permette di inserire il "reindirizzamento @" nei record DNS

Nel pannello **DNS** di IONOS:
1. **Non esiste il tipo "Reindirizzamento" tra i record DNS**: la tabella DNS accetta solo record tecnici standard (`A`, `AAAA`, `CNAME`, `TXT`, `MX`).
2. Lo standard DNS mondiale **non consente i record CNAME sulla radice `@`** (`capritourguide.com` senza `www`). Se provi a inserire un CNAME per `@`, IONOS restituisce errore.
3. In IONOS, il reindirizzamento è una funzione separata chiamata **"Inoltro dominio"** (o **"Uso del dominio"**).

Dato che **non ci sono caselle email da tutelare**, hai due strade semplicissime:

---

## Opzione 1 (Consigliata su IONOS — Fai tutto in 2 minuti)

### Parte A: Nel pannello DNS di IONOS (per `www`)
1. Vai su **Dominio & SSL** → clicca su **`capritourguide.com`** → scheda **DNS**.
2. **Elimina** i vecchi record `A` e `AAAA` associati a `www` (che puntavano a `217.160.0.170` e `2001:8d8:...`).
3. Clicca su **Aggiungi record** (o modifica il record `www` esistente):
   - **Tipo:** `CNAME`
   - **Nome host:** `www`
   - **Punti a / Destinazione:** `capridmc-reborn.pages.dev`
   - **TTL:** Automatico (o 1 ora / 3600 sec)
   - Clicca su **Salva**.

### Parte B: Nella scheda "Uso del dominio" di IONOS (per `@` senza www)
1. Nella schermata del dominio `capritourguide.com`, esci dalla scheda DNS e clicca sulla scheda **Uso del dominio** (oppure sui tre puntini / **Azione** accanto al dominio e scegli **Reindirizza dominio** o **Modifica tipo di utilizzo**).
2. Seleziona **Inoltro a URL esterno** (o **Reindirizza a un sito web**).
3. Inserisci come destinazione:
   ```text
   https://www.capridmc.com
   ```
   *(oppure `https://www.capritourguide.com`)*
4. Tipo di inoltro: **Reindirizzamento HTTP 301** (Permanente).
5. Salva.

In questo modo:
- Chi digita `capritourguide.com` viene reindirizzato all'istante via 301.
- Chi digita `www.capritourguide.com` atterra direttamente sul nuovo sito Capri DMC su Cloudflare.

---

## Opzione 2 (La più comoda e definitiva — Delega Nameserver a Cloudflare)

Se vuoi liberarti completamente dalle limitazioni del pannello IONOS:
1. Accedi a [Cloudflare Dashboard](https://dash.cloudflare.com) e clicca su **Add a site** (Aggiungi un sito) inserendo `capritourguide.com` (piano Free gratuito).
2. Cloudflare ti assegna due nameserver (es. `ada.ns.cloudflare.com` e `bob.ns.cloudflare.com`).
3. Su IONOS: vai su **Server dei nomi** → **Server dei nomi personalizzati** e incolla i due nameserver di Cloudflare.
4. Su Cloudflare il record su `@` viene "appiattito" (CNAME flattening) in automatico con un clic, con certificato SSL e redirect gestiti senza limiti.

---

## 2. Allineamento SEO & GEO: Dominio Satellite

Poiché `www.capritourguide.com` è confermato come **satellite**:
- I file sorgente (`src/components/Seo.astro`, `src/components/JsonLd.astro`, `astro.config.mjs`) mantengono `https://www.capridmc.com` come **URL canonico assoluto**.
- Qualsiasi visitatore o bot AI che scopre il sito tramite `capritourguide.com` trasferisce il 100% dell'autorevolezza e del ranking a **Capri DMC**.
