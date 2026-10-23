# Domande Aperte & Dati da Confermare — Capri DMC

**Destinatario:** Pep (`partnerships@capridmc.com`)  
**Data:** 24 Ottobre 2026  
**Riferimento:** Vincolo V6 e §9 dell'Handoff SEO + GEO

In ossequio al **Vincolo V6** (*"Ogni dato in JSON-LD / llms.txt deve essere presente e vero sul sito o confermato da Pep. Mai inventare dati. Nessun placeholder in produzione"*), i seguenti campi sono stati temporaneamente omessi dal codice o impostati a valori generici verificati. Si richiede il riscontro di Pep per il loro perfezionamento finale:

---

### 1. Anno di Fondazione Formale (`foundingDate`)
- **Stato attuale:** Il sito menziona *"Since 2010"* e *"Est. 2010"*, riferito all'inizio dell'attività turistica e all'esperienza delle fondatrici con Nesea Capri Tours & Events.
- **Domanda per Pep:** Qual è la data / anno di registrazione formale dello spin-off **Capri Destination Management Company** (es. `2010`, `2023`, `2024`) da inserire nel campo `foundingDate` del grafo `Organization`?

---

### 2. Dati Societari Formali (`legalName` & Licenza)
- **Stato attuale:** Nel codice è utilizzato il nome commerciale `Capri Destination Management Company`.
- **Domanda per Pep:** Qual è la ragione sociale esatta registrata (es. *Nesea S.r.l.* o altra entità), la Partita IVA / Codice Fiscale e il numero di Licenza Tour Operator da includere nei metadati legali?

---

### 3. Indirizzo Stradale Completo (`PostalAddress`)
- **Stato attuale:** Nel markup e nel footer è indicato `Isola di Capri, 80076 Capri (NA), Campania, Italia`.
- **Domanda per Pep:** Esiste una sede operativa con via e numero civico specifici (es. Via Roma, Via le Botteghe, Marina Grande) da indicare nel dato strutturato per rafforzare la local authority su Google Maps e assistenti AI?

---

### 4. Link Social Istituzionali (`sameAs` in Schema.org)
- **Stato attuale:** Omessi per non inserire link errati.
- **Domanda per Pep:** Si prega di confermare gli URL esatti dei seguenti profili (se attivi) per popolare la proprietà `sameAs`:
  - LinkedIn Aziendale (es. `https://www.linkedin.com/company/capridmc/`)
  - Instagram (es. `https://www.instagram.com/capridmc/`)
  - Profili directory Virtuoso, Serandipians o Traveller Made (se associati).

---

### 5. Proporzioni Immagine Social Share (`og:image`)
- **Stato attuale:** È stata utilizzata la splendida foto originale della Hero (`faraglioni-rocks-guided-tour-private-boat.jpg`), avente risoluzione nativa `3648x2736 px` (aspect ratio `4:3`).
- **Nota tecnica:** Le specifiche Open Graph raccomandano un rapporto `1.91:1` (es. `1200x630 px`). In ottemperanza al Vincolo V4 (**nessun ritaglio o modifica alle foto**), l'immagine è stata lasciata integra.
- **Domanda per Pep:** Desidera fornire un file immagine dedicato specificamente alle anteprime social (1200x630 px) da inserire come nuova risorsa in `public/og-image.jpg`?

---

### 6. Versioni Linguistiche Future (`hreflang`)
- **Stato attuale:** Il sito è configurato come monolingua inglese (`lang="en"`), con terminologia caprese autentica. Non sono state introdotte versioni `/it/` per rispettare il vincolo V2 (nessuna nuova pagina).
- **Domanda per Pep:** È prevista a breve una versione localizzata in italiano o altre lingue per attivare il mapping `hreflang` e `x-default`?

---

### 7. Token di Verifica Motori di Ricerca (Variabili d'Ambiente)
- **Stato attuale:** `Seo.astro` è già configurato per leggere `PUBLIC_GSC_TOKEN` e `PUBLIC_BING_TOKEN`.
- **Azione per Pep:** Inserire le due chiavi nelle variabili d'ambiente di Cloudflare Pages (o fornircele) una volta creati gli account Search Console e Bing Webmaster.

---

### 8. Gestione Modulo di Contatto Legacy vs Contatto Diretto B2B
- **Stato attuale:** Il vecchio sito IONOS aveva un form contatti MailPoet su `/contact-us-capri-destination-management-company/`. Nel nuovo sito ad altissime prestazioni statiche, i bottoni "B2B Appointment" puntano a quell'URL (che ora reindirizza via 301 a `/#contact`, dove sono visibili la linea diretta 24/7 `+39 333 594 3947`, la sede e i riferimenti aziendali).
- **Domanda per Pep:** Desidera che il bottone "B2B Appointment" apra direttamente il client email verso `partnerships@capridmc.com` con oggetto preimpostato (es. `mailto:partnerships@capridmc.com?subject=Capri%20DMC%20-%20B2B%20Advisor%20Inquiry`), oppure preferisce integrare un modal o form B2B serverless dedicato (es. Formspree / Cloudflare Turnstile)?

---

### 9. Cookie Banner e Conformità Privacy GDPR
- **Stato attuale:** Il nuovo sito su Cloudflare Pages è al 100% privo di cookie di profilazione e di terze parti (zero script esterni invasivi, zero cookie traccianti). In conformità alle linee guida del Garante Privacy e GDPR/ePrivacy, **nessun cookie banner è attualmente obbligatorio**.
- **Domanda per Pep:** Prevede di installare strumenti di terze parti (come Google Analytics 4, Meta Pixel o LinkedIn Insight Tag)? In caso affermativo, andrà predisposto un banner di consenso preventivo bloccante conforme GDPR prima dell'attivazione dei relativi script.

