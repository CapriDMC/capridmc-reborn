# CAPRI DMC — DOSSIER DI HANDOFF TECNICO ED EDITORIALE
**Progetto:** Capri Destination Management Company (`www.capridmc.com`)  
**Data Aggiornamento:** 22 Novembre 2026  
**Autore / Assistente:** Antigravity (Google DeepMind Agent)  
**Destinatario:** Pep / Team Capri DMC / Nuova Sessione di Lavoro  

---

## 1. IDENTITÀ, BRAND & DNA AZIENDALE DI CAPRI DMC

### 1.1 Chi siamo & Origini
- **Ragione Sociale:** Capri Destination Management Company (Capri DMC).
- **Sede Operativa & Legale:** 80076 Capri (NA), Italia.
- **Anno di Fondazione:** **Since 2010** (oltre 15 anni di presenza continuativa sull'isola).
- **Curatela:** **Team Nesea** — Società e network interamente al femminile ("Women-Owned") fondato da residenti native capresi.
- **Mission:** Essere il ponte diretto ed esclusivo tra i luxury travel designers, le agenzie d'élite mondiali, i corporate planner internazionali e l'autentica accoglienza dell'isola di Capri, eliminando ogni intermediario della terraferma.
- **Payoff Ufficiale:** *"Your Capri Destination Management Company — Your Local Team in Capri · The best partner to plan experiences in Capri for your customers."*

### 1.2 Founding Leadership (Il Team Fondatore)
Il board direttivo è composto da tre residenti native, ciascuna a presidio di una colonna operativa:
1. **Giusy Perrotta — Co-Founder & Director of Operations:**
   Nativa caprese con oltre 15 anni di esperienza nella gestione diretta della logistica marittima, trasferimenti complessi, coordinamento barche e relazioni B2B con gli advisor internazionali.
2. **Melania Esposito — Co-Founder & Head of Event Production:**
   Specialista nelle celebrazioni esclusive e matrimoni in ville storiche private a picco sui Faraglioni; referente per eventi del ciclo di vita ebraico (Bar/Bat Mitzvah, Kiddushin) con supervisione di catering rigorosamente Kosher e cerimonie con vista panoramica.
3. **Roberta De Martino — Co-Founder & Lead Cultural Curator:**
   Storica dell'arte e guida autorizzata della Regione Campania; cura l'accesso a porte chiuse a dimore storiche, musei, ville imperiali romane (Villa Jovis, Damecuta) e convogliamento del cerimoniale culturale isolano.

### 1.3 Valori Non Negoziabili & Policy Editoriale
- **100% Residenti Capresi ("Viviamo qui"):**
  La nostra forza risiede nella presenza fisica costante sull'isola 365 giorni l'anno. Nessun ufficio a Milano o Roma: viviamo a Capri e conosciamo personalmente armatori, marinai, autisti, custodi e proprietari di tenute.
- **On-Ground Dispatch & Resilienza Meteo:**
  In caso di condizioni meteo avverse o mareggiate improvvise che bloccano i collegamenti marittimi, il nostro team residente è già sul posto per attivare piani B immediati di lusso (trasferimenti via elicottero, degustazioni in cantine private storiche, visite esclusive in ville).
- **Integrità Commissionale B2B:**
  Riconosciamo tariffe nette (*Net Rates*) trasparenti e proteggiamo rigorosamente il rapporto agenzia-cliente.
- **White-Label Service:**
  Operiamo come estensione diretta dell'agenzia partner, operando sotto il suo brand (*white label*) per elevarne la reputazione verso il cliente finale.
- **Trasparenza Logistica Bagagli:**
  I bagagli arrivano sempre *dopo* i clienti nelle suite o nelle ville private attraverso il facchinaggio dedicato, per garantire un arrivo privo di stress.
- **Conformità Legale & Marchi Protetti:**
  Nessun uso di marchi registrati terzi senza consenso esplicito (vietato l'uso di nomi come *Virtuoso*, *Riva*, *Maybach*). È rigorosamente vietata e non promossa la navigazione sotto l'arco dei Faraglioni (*Faraglioni arch navigation*), in quanto illegale per ordinanza marittima della Capitaneria di Porto.
- **Nessuna Certezza Assoluta nei Mesi di Picco:**
  I servizi di barche (gozzi e speedboats) sono sempre offerti *"su richiesta"* (*upon request*), senza mai garantire per iscritto disponibilità illimitata a luglio/agosto.

---

## 2. DESIGN SYSTEM & USER EXPERIENCE ("CARTIER LUXURY ARCHITECTURE")

Il sito adotta un'impostazione visiva editoriale ispirata alla raffinatezza minimalista delle grandi maison di lusso (es. Cartier, Aman Resorts):

### 2.1 Palette Cromatica
- **Brand Navy (Profondo):** `#10285D` (testi principali, titoli scuri, accenti).
- **Brand Dark (Notturno/Spazio):** `#07142E` (sfondo del footer, sezioni scure, HUD Mappamondo).
- **Brand Gold (Oro Caldo):** `#D4AF37` (linee sottili, numerazioni, badge, accenti).
- **Brand Gold Light:** `#F0D575` & **Gold Dark:** `#B38E22`.
- **Brand Cream (Solido Chiaro):** `#FAF8F5` (Layer 1 servizi, stacco architettonico).
- **Pure White:** `#FFFFFF` (sfondo naturale, respiro visivo).

### 2.2 Tipografia
- **Font con Grazie (Serif):** *Cormorant Garamond* (Google Fonts, pesi 300, 400, 500, 600, corsivi eleganti). Usato per tutti i titoli (`h1`, `h2`, `h3`, `h4`) e citazioni.
- **Font Lineare (Sans-Serif):** *Proza Libre* (Google Fonts, pesi 400, 500, 600). Usato per testi descrittivi, etichette B2B e corpo pagina.

### 2.3 Layer Architetturali & Finestre Parallasse
- **Parallasse Hardware-Accelerated:** Le sezioni parallasse (`.cartier-parallax-window`) usano immagini fisse ad altissima risoluzione WebP con overlay scuro (`#07142E/65`) e testi fluttuanti candidi.
- **Layering Solido Fisico:** I blocchi di contenuto scorrono sopra le finestre di parallasse con ombre tridimensionali graduate (`.cartier-layer-solid-light`, `.cartier-layer-solid-white`, `.cartier-layer-solid-dark`).
- **Nessuna Didascalia sulle Foto:** Le immagini sono completamente pulite, senza box, badge o scritte in sovrimpressione.
- **Navbar a Scomparsa Intelligente:** Barra di navigazione trasparente a inizio pagina; scendendo si nasconde fluidamente; risalendo riappare istantaneamente con effetto vetro smerigliato (*frosted glass*).
- **Audio Onde del Mare:** Controller fisso in basso a destra con audio autentico del mare di Capri a volume tenue (`0.10`), rispettoso delle autoplay policies dei browser moderni.

---

## 3. CATALOGO UFFICIALE DEI SERVIZI (PROGRESSIONE DA 01 A 11)

I servizi sono rigorosamente organizzati in due raggruppamenti (*cluster*) all'interno di `src/data/services.json`:

### Cluster A: Exclusive Solutions (Servizi Primari B2B — 01 / 04)
1. **01 / Exclusive Guided Island Tours:**
   - *ID:* `exclusive-guided-tours`
   - *Descrizione:* Visite culturali private ed esclusive condotte da storiche dell'arte residenti e guide ufficiali del Team Nesea. Accesso privilegiato a Villa Lysis, Villa San Michele, Villa Jovis ed eremi panoramici.
2. **02 / Capri Private Boat Services & Gozzo Charters:**
   - *ID:* `capri-private-boat-tours`
   - *Descrizione:* Tradizionali gozzi capresi in legno, motoscafi veloci (*speedboats*) e yacht privati disponibili su richiesta tramite il nostro network marinaro nativo. Champagne fresco, frutta e catering personalizzato a bordo.
3. **03 / Private and Exclusive Transfer Services:**
   - *ID:* `transfers-ticketing`
   - *Descrizione:* Coordinamento logistico dall'aeroporto di Napoli Capodichino (NAP) o stazione ferroviaria con auto o van di lusso NCC fino al porto; traversata marittima privata e taxi decappottabili tipici a Capri. Gestione del facchinaggio bagagli con recapito in villa/suite successivo all'arrivo degli ospiti.
4. **04 / White-Label On-Island Service:**
   - *ID:* `conciergerie`
   - *Descrizione:* Presidio a terra professionale e riservato per conto delle agenzie partner. Garanzia di costanza e affidabilità anche in caso di maltempo: operiamo a nome dell'advisor per proteggerne ed elevarne la reputazione.

### Cluster B: Custom Experiences (Esperienze Sartoriali — 05 / 11)
5. **05 / Weddings, Bar Mitzvahs & Milestone Celebrations:**
   - *ID:* `events-milestone`
   - *Descrizione:* Buyout di tenute storiche, cerimonie civili e religiose, specializzazione in celebrazioni ebraiche (Torah readings, Shabbat logistics e supervisione Kosher).
6. **06 / Artisanal Sandals, Knitwear & Bespoke Textiles:**
   - *ID:* `artisanal-sandals-textiles`
   - *Descrizione:* Incontri privati con maestri calzolai capresi per sandali su misura in cuoio e commissioni di maglieria artigianale in lino e cashmere.
7. **07 / Private Cooking Classes in Authentic Caprese Homes:**
   - *ID:* `cooking-classes`
   - *Descrizione:* Lezioni di cucina in case panoramiche con orto: ravioli capresi, pescato fresco locale, torta caprese e limoncello con limoni biologici.
8. **08 / Personal Shopper Service & Global Shipping:**
   - *ID:* `personal-shopper`
   - *Descrizione:* Shopping privato nelle boutique di Via Camerelle, sbrigo pratiche Tax-Free e spedizioni internazionali assicurate al domicilio dei clienti.
9. **09 / Hidden Hiking Excursions & Secret Nature Routes:**
   - *ID:* `hiking-secret-routes`
   - *Descrizione:* Spedizioni a piedi con guide ambientali lungo il Sentiero dei Fortini, Passetiello e Monte Solaro, lontani dai flussi turistici.
10. **10 / Personal Trainer & Private Sport Activities:**
    - *ID:* `personal-trainer-sports`
    - *Descrizione:* Istruttori certificati per yoga all'alba sui Faraglioni, pilates in villa, lezioni di tennis e uscite in kayak in cale appartate.
11. **11 / Bespoke Babysitting & Pet Sitting for B2B Clients:**
    - *ID:* `babysitting-dogsitting`
    - *Descrizione:* Personale multilingue referenziato per assistenza all'infanzia e pet-care durante escursioni o cene di gala.

---

## 4. IL MAPPAMONDO 3D INTERATTIVO (CALCOLATORE DISTANZE)

- **File Componente:** `src/components/LogisticsMap.astro`.
- **Dataset:** `src/data/globe-countries.json` (coordinate capitali mondiali, bandiere, confini GeoJSON).
- **Libreria Matematica:** D3-Geo su Canvas HTML5 con accelerazione 60fps.
- **Funzionamento & Spirito:** È un **esploratore geografico di curiosità ("Quanto sono lontano da Capri?")**.
  - Ruotando la sfera e cliccando su un paese, calcola la distanza geodetica ortodromica esatta (formula del cerchio massimo WGS-84) tra la capitale e Capri, stimando le ore di volo indicative.
  - **Vincolo Editoriale:** Non implica mai che Capri DMC gestisca voli intercontinentali o aerei dall'estero. Chiarisce che l'accoglienza di Capri DMC si attiva sul campo all'arrivo in Italia (Napoli e Capri).

---

## 5. INFRASTRUTTURA TECNICA, DEPLOYMENT & PIPELINE CI/CD

L'architettura web è un modello **Jamstack statico a prestazioni estreme (100/100 Core Web Vitals)**:

```
[ Modifica Codice Locale ]
          │
          ▼  git push origin main
[ GitHub Repository: CapriDMC/capridmc-reborn ]
          │
          ▼  Webhook GitHub Actions
[ Workflow CI/CD: .github/workflows/deploy.yml ]
   ├─ Node 22 LTS
   ├─ scripts/generate-favicons.mjs
   ├─ scripts/generate-llm-text.mjs
   └─ astro build (SSG -> ./dist)
          │
          ▼  Pubblicazione Artefatto
[ Hosting Origine: GitHub Pages (capridmc.github.io) ]
   └─ CNAME: www.capridmc.com
          │
          ▼  Proxy CNAME (Nuvola Arancione)
[ Cloudflare Global Edge (Zone: capridmc.com) ]
   ├─ SSL Full Strict & HSTS
   ├─ CDN Cache Globale Anycast
   ├─ WAF & Anti-DDoS
   └─ Record DNS Posta (SPF, DKIM, DMARC, BIMI)
          │
          ▼
   [ https://www.capridmc.com ]
```

### 5.1 Repository GitHub
- **URL:** `https://github.com/CapriDMC/capridmc-reborn.git`
- **Branch di Lavoro & Produzione:** `main`
- **Cartella Locale di Lavoro:** `/Users/pep/capridmc/capridmc-reborn`

### 5.2 GitHub Actions (.github/workflows/deploy.yml)
- Il file attiva il runner `ubuntu-latest` a ogni push su `main`.
- Esegue in sequenza:
  1. `npm ci` (installazione pulita e deterministica da `package-lock.json`).
  2. `npm run build` (lancia i due script pre-build e poi compila Astro in `./dist`).
  3. `actions/upload-pages-artifact@v3` e `actions/deploy-pages@v4`.
- **Tempo di Deploy:** circa 35-45 secondi.

### 5.3 Hosting su GitHub Pages & File CNAME
- Nella cartella `public/` è presente il file `CNAME` con valore:
  ```text
  www.capridmc.com
  ```
  Questo file garantisce che GitHub Pages risponda direttamente per il dominio di produzione.

### 5.4 Cloudflare Edge Network (capridmc.com)
- **Zone ID:** `d58485186bf18108c42d888c92b474ec`
- **Nameservers:** `arch.ns.cloudflare.com`, `cass.ns.cloudflare.com`
- **Record DNS Web:**
  - `www.capridmc.com` (CNAME) &rarr; `capridmc.github.io` (Proxied / Nuvola arancione attiva).
  - `capridmc.com` (A) &rarr; `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (Proxied).

---

## 6. CONFIGURAZIONE EMAIL, RECORD DNS & RISOLUZIONE SPAM

### 6.1 Record di Posta Elettronica Configurati su Cloudflare
- **MX Record:** `mta-gw.infomaniak.ch` (priorità 5) &rarr; La posta in arrivo è gestita su Infomaniak.
- **SPF Record (TXT):**
  ```text
  v=spf1 include:spf.infomaniak.ch include:_spf-eu.ionos.com ~all
  ```
  > **Nota Anti-Spam Risolta:** In precedenza il record SPF conteneva solo Infomaniak con terminatore restrittivo `-all`. Chi inviava email dal client Mail configurato con i server SMTP di IONOS (`smtp.ionos.it`) finiva automaticamente nello spam di Gmail/Outlook. Con la direttiva `include:_spf-eu.ionos.com ~all`, sia i server Infomaniak sia quelli europei di IONOS sono autorizzati e conformi.
- **DKIM (TXT):** Host `20261108._domainkey.capridmc.com` con chiave RSA pubblica a 2048-bit.
- **DMARC (TXT):** Host `_dmarc.capridmc.com` con policy `v=DMARC1; p=none; fo=1; aspf=r; adkim=r`.
- **BIMI (TXT):** Host `default._bimi.capridmc.com` con puntamento al favicon vettoriale `https://www.capridmc.com/favicon.svg`.

### 6.2 Parametri Ufficiali per Configurare il Client Mail (Apple Mail, Outlook)
- **Email / Username:** `partnerships@capridmc.com`
- **Server Posta in Entrata (IMAP):** `mail.infomaniak.com` | Porta **993** | SSL/TLS
- **Server Posta in Uscita (SMTP):** `mail.infomaniak.com` | Porta **465** | SSL/TLS

---

## 7. ANALYTICS, PRIVACY (GARANTE) & GEO (AI OPTIMIZATION)

### 7.1 Tracciamento Google (GoogleTracking.astro)
- **Google Tag Manager:** `GTM-NGPT29NB`
- **Google Analytics 4:** `G-E0ZLGSFCC4`
- **Google Consent Mode v2:** Attiva con stato `denied` di default conforme alle linee guida del Garante Privacy italiano e GDPR.
- **Cookie Consent Modal:** Implementata in `src/components/CookieConsent.astro` tramite elemento nativo `<dialog>` accessibile e banner con salvataggio preferenze in `localStorage`.

### 7.2 GEO (Generative Engine Optimization) & File per Agenti AI
Durante ogni build, `scripts/generate-llm-text.mjs` sincronizza automaticamente i seguenti file nella cartella `public/`:
1. `llms.txt`: Specifica standard [llmstxt.org] per LLM (riassunto essenziale dei servizi, contatti e dati societari).
2. `llms-full.txt`: Dossier B2B completo a testo pieno per agenti di ricerca e pianificazione itinerari.
3. `ai-context.txt` & `/ai-context.html`: File di contesto semantico strutturato per Perplexity, ChatGPT Search e Gemini.
4. `index.md`: Mirror in puro markdown della homepage.

---

## 8. STATO DEL DOMINIO CAPRITOURGUIDE.COM

- **Situazione:** Il dominio `capritourguide.com` è stato intercettato a livello edge su Cloudflare per impedire la visualizzazione del vecchio sito duplicate.
- **Prossimo Step per Nuova Iniziativa:** Quando partirà il nuovo progetto autonomo, basterà accedere alla Cloudflare Dashboard &rarr; **Workers & Pages** &rarr; Progetto `capridmc-reborn` &rarr; **Custom Domains** &rarr; cliccare su `...` accanto a `www.capritourguide.com` e scegliere **Remove domain**. Il dominio sarà immediatamente libero per essere associato al nuovo repository dedicato.

---

## 9. GUIDA PRATICA PER NUOVE PUBBLICAZIONI SU WWW.CAPRIDMC.COM

Per apportare qualsiasi nuova modifica nella nuova conversazione:

1. **Posizionarsi nella cartella di lavoro:**
   ```bash
   cd /Users/pep/capridmc/capridmc-reborn
   ```
2. **Ambiente di sviluppo locale (facoltativo, su porta 4321):**
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run dev
   ```
3. **Aggiornamento Servizi o Testi:**
   - I servizi si modificano in: `src/data/services.json`.
   - I componenti dell'interfaccia si trovano in: `src/components/` (`Hero.astro`, `TheAuthority.astro`, `BentoGridServices.astro`, `LogisticsMap.astro`, `AdvisorPerks.astro`, `Footer.astro`).
4. **Verifica della Build Locale:**
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run build
   ```
   *(La build genererà automaticamente favicons, file llms.txt, dossier AI e file statici).*
5. **Pubblicazione Online Live:**
   ```bash
   git add -A
   git commit -m "feat/fix: descrizione della modifica apportata"
   git push origin main
   ```
6. **Esito:**
   GitHub Actions compilerà e distribuirà il codice su `https://www.capridmc.com` in circa 40 secondi.
