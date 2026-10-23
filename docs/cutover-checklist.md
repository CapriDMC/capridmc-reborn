# Checklist Operativa Cutover DNS & Migrazione — Capri DMC

**Destinatario:** Pep (`partnerships@capridmc.com`)  
**Data:** 24 Ottobre 2026  
**Dominio di Produzione:** `https://www.capridmc.com`  
**Piattaforma:** Da IONOS / MyWebsite (WordPress gox) a Cloudflare Pages (Astro v5 + Tailwind CSS v4)  
**Obiettivo:** Switch DNS a zero disservizi, conservazione totale del posizionamento organico (SEO) e massima indicizzazione per motori generativi (GEO / AEO).

---

## 1. Cronoprogramma di Migrazione

```
┌────────────────┐     ┌───────────────┐     ┌──────────────┐     ┌────────────────┐
│     T - 7d     │ ──> │      T 0      │ ──> │    T + 1h    │ ──> │ T + 24h a 4w   │
│ Riduzione TTL  │     │  Cutover DNS  │     │ Test 18 URL  │     │ Submit GSC/Bing│
│ & Setup CF     │     │   Cloudflare  │     │ & Redirects  │     │ & Monitoraggio │
└────────────────┘     └───────────────┘     └──────────────┘     └────────────────┘
```

---

## 2. Fase T-7 Giorni: Preparazione Pre-Cutover

| Task | Responsabile | Dettagli & Verifica | Stato |
|------|--------------|---------------------|-------|
| **1. Riduzione TTL DNS** | Pep / Registrar | Ridurre il TTL del record `A` e `CNAME` per `capridmc.com` e `www.capridmc.com` da 86400s (24h) o 3600s a **300 secondi (5 minuti)** presso l'attuale gestore DNS (IONOS). Questo consentirà una propagazione immediata al momento del cutover. | [ ] Da fare |
| **2. Creazione Progetto Cloudflare Pages** | Pep | Collegare la repository `CapriDMC/capridmc-reborn` su Cloudflare Pages.<br>• Build command: `npm run build`<br>• Build output directory: `dist`<br>• Node version: `20` o superiore. | [ ] Da fare |
| **3. Configurazione Variabili d'Ambiente** | Pep | Inserire nel pannello Cloudflare Pages (*Settings > Environment variables*):<br>• `PUBLIC_GSC_TOKEN` (da Google Search Console)<br>• `PUBLIC_BING_TOKEN` (da Bing Webmaster Tools) | [ ] Da fare |
| **4. Verifica Regole di Redirect Locali** | Antigravity | Verificare che `public/_redirects` contenga tutte le 18 regole 301 per gli URL legacy, i 2 redirect per le vecchie sitemap WP e i 37 redirect per le immagini ottimizzate. | [x] Completato |
| **5. Verifica Risorse AI (GEO)** | Antigravity | Verificare la presenza di `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`, `public/index.md` e token IndexNow `f63b28b7e08240409741a4a0342ebcb3.txt`. | [x] Completato |

---

## 3. Fase T-0: Cutover DNS (Giorno del Lancio)

> [!IMPORTANT]
> Eseguire il cutover in una finestra a basso traffico (es. primo mattino tra le 07:00 e le 08:30 CET o tarda serata).

| Step | Azione | Note Tecniche |
|------|--------|---------------|
| **1** | Aggiunta Custom Domain su Cloudflare | Nel pannello Cloudflare Pages, aggiungere `www.capridmc.com` e `capridmc.com` come domini personalizzati del progetto. |
| **2** | Aggiornamento Record DNS | Presso il registrar del dominio:<br>• Se la zona DNS è già gestita da Cloudflare: impostare il record CNAME `www` e CNAME/Apex `@` verso `<nome-progetto>.pages.dev` con Proxy abilitato (nuvoletta arancione).<br>• Se la zona DNS è esterna (IONOS): impostare record `CNAME` per `www` che punta a `<nome-progetto>.pages.dev`. |
| **3** | Verifica Configurazione SSL/TLS | Su Cloudflare, impostare la modalità di crittografia SSL/TLS su **Full** (o **Full (strict)**) e attivare *Always Use HTTPS*. |
| **4** | Regola Apex -> WWW | Verificare che le richieste su `https://capridmc.com` vengano inoltrate a `https://www.capridmc.com` con redirect 301 permanente. |

---

## 4. Fase T+1 Ora: Verifica Immediata Post-Cutover

Eseguire lo script di verifica automatica o i test puntuali da terminale:

```bash
# Test rapido status code homepage
curl -sI https://www.capridmc.com/ | grep -E "HTTP/|location:"

# Test redirect dei 18 vecchi percorsi (devono restituire HTTP/2 301 -> /#anchor)
curl -sI "https://www.capridmc.com/events-capri-destination-management-company/" | grep -E "HTTP/|location:"
curl -sI "https://www.capridmc.com/your-team-in-capri/" | grep -E "HTTP/|location:"
curl -sI "https://www.capridmc.com/transfers-check-in-and-ticketing-services/" | grep -E "HTTP/|location:"
curl -sI "https://www.capridmc.com/contact-us-capri-destination-management-company/" | grep -E "HTTP/|location:"

# Test legacy WP sitemap
curl -sI "https://www.capridmc.com/wp-sitemap.xml" | grep -E "HTTP/|location:"

# Test file GEO / AI
curl -sI https://www.capridmc.com/robots.txt | grep "HTTP/"
curl -sI https://www.capridmc.com/llms.txt | grep "HTTP/"
curl -sI https://www.capridmc.com/sitemap-index.xml | grep "HTTP/"
```

### Checklist di Validazione T+1h:
- [ ] La home `https://www.capridmc.com/` risponde `HTTP 200` con caricamento rapido (< 1s).
- [ ] Nessun errore misto HTTP/HTTPS né alert del certificato SSL.
- [ ] Tutti i 18 URL storici censiti in `docs/redirect-map.csv` rispondono `HTTP 301` e atterrano sulla sezione pertinente senza redirect loop.
- [ ] Le vecchie immagini WordPress (`/wp-content/uploads/...`) reindirizzano a `/logo.png`.
- [ ] I crawler AI (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`) ricevono `HTTP 200` e il payload HTML completo.

---

## 5. Fase T+24 Ore: Notifica Motori di Ricerca & GEO

1. **Google Search Console (GSC):**
   - Accedere alla proprietà `https://www.capridmc.com/`.
   - Nella sezione *Sitemap*, inviare l'URL: `https://www.capridmc.com/sitemap-index.xml`.
   - Richiedere l'ispezione URL e l'indicizzazione per la Home Page `https://www.capridmc.com/`.
2. **Bing Webmaster Tools:**
   - Inviare la sitemap `https://www.capridmc.com/sitemap-index.xml`.
3. **IndexNow Instant Dispatch:**
   - Eseguire il comando di notifica automatica per informare istantaneamente Bing, Yandex, Seznam e Naver:
     ```bash
     npm run notify:indexnow
     ```

---

## 6. Fasi T+1 Settimana e T+4 Settimane: Monitoraggio Continuativo

| Periodo | Metriche & Punti di Controllo | Azione Correttiva |
|---------|-------------------------------|-------------------|
| **T + 7 Giorni** | • Verifica rapporto *Pagine indicizzate* in GSC.<br>• Controllo errori 404 nei log Cloudflare o nel rapporto *Pagine non indicizzate*.<br>• Monitoraggio query di brand: *"Capri DMC"*, *"Capri Destination Management Company"*, *"From Capri for Capri"*. | Se compaiono 404 inattesi, aggiungere immediatamente la corrispondenza 301 in `public/_redirects`. |
| **T + 14 Giorni** | • Verifica Core Web Vitals (LCP, INP, CLS) nei dati reali di CrUX / GSC.<br>• Test delle risposte generative su Perplexity, ChatGPT Search e Gemini: interrogare *"Qual è la migliore DMC B2B a Capri per tour in barca ed eventi privati?"* per verificare che citino Capri DMC e facciano riferimento ai dati di `llms.txt`. | Ottimizzare ulteriormente i nodi di conoscenza o citazioni B2B. |
| **T + 30 Giorni** | • Analisi andamento click/impression su Google Search Console rispetto allo storico.<br>• Verifica totale de-indicizzazione dei vecchi percorsi IONOS e consolidamento del ranking sulla nuova infrastruttura Astro. | Consolidamento completato con successo. |

---

## 7. Piano di Rollback di Emergenza

Nell'improbabile eventualità di un blocco critico durante il cutover:
1. Ripristinare immediatamente il record `A` / `CNAME` del DNS verso l'indirizzo IP del server IONOS originario.
2. Poiché il TTL è stato impostato a 300 secondi al punto 1, il traffico ritornerà al vecchio sito entro 5 minuti.
3. Nessun dato o lead andrà perso.
