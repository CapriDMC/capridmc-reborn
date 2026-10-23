# SEO & GEO Audit Baseline — Capri DMC

**Data di rilevazione:** 23 Ottobre 2026  
**Repository:** `CapriDMC/capridmc-reborn`  
**Ambiente analizzato:** Locale (`http://localhost:4321`) & Configurazione Repository  
**Branch:** `seo-geo`  

---

## 1. Configurazione URL, Domini & Hosting

| Parametro | Valore Attuale | Note / Azione |
|---|---|---|
| `site` in `astro.config.mjs` | **Non definito** (mancante) | Da configurare: `https://www.capridmc.com` |
| Dominio di Produzione Principale | `https://www.capridmc.com` | Usato nei link canonici e Open Graph di `Layout.astro` |
| URL Workers / Cloudflare Preview | `capridmc-reborn.partnerships-ef3.workers.dev` | Rilevato rischio contenuti duplicati: canonical fisso su dominio custom e segnalazione a Pep per disattivare il dominio *.workers.dev |
| Regola Trailing Slash | Non definita esplicitamente in Astro | Da configurare in `astro.config.mjs`: `trailingSlash: 'ignore'` o `'never'` con coerenza ovunque |
| Adapter Cloudflare / SSR | **Nessun adapter SSR** (`output: "static"`) | Il progetto genera static HTML/CSS/JS in `dist/`, servito come Cloudflare Pages statico |
| File `wrangler.*` | **Assenti** nel repository | Deploy statico tramite Cloudflare Pages Git integration |

---

## 2. Internazionalizzazione & Struttura Route

- **Lingua primaria:** Inglese (`en`) con toponimi e denominazioni di tradizione caprese/italiana.
- **Gestione `<html lang>`:** Hardcoded in `src/layouts/Layout.astro` come `<html lang="en" class="scroll-smooth">`.
- **Route presenti:** Unica route radice (`/`, generata da `src/pages/index.astro`). Non sono presenti sotto-pagine o varianti di lingua (nessun `/it/` attivo).
- **Hreflang:** Non attivo nella baseline (non esistono al momento versioni tradotte separate).

---

## 3. Gestione `<head>` e Componenti SEO Esistenti

- **Layout:** `src/layouts/Layout.astro` genera l'intero tag `<head>` e include meta tag base, Open Graph, Twitter Card, Google Fonts e lo script schema.
- **Componente SEO dedicato:** **Assente**. I meta tag sono cablati direttamente in `Layout.astro`. Verrà estratto e standardizzato il componente `Seo.astro`.
- **Dati strutturati esistenti:** `src/components/GeoSchema.astro` genera un JSON-LD con `@type: "TravelAgency"`. Verrà unificato e modularizzato nel componente conforme `JsonLd.astro` con `@graph` stabili, nodi `Organization`, `WebSite`, `WebPage`, e catalogo completo dei servizi.

---

## 4. Elenco Pagine, Title, Meta Description, H1 e Canonical

### Pagina Home (`/`)
- **File sorgente:** `src/pages/index.astro`
- **`<title>` attuale:** `Capri DMC | Luxury Destination Management Company & B2B Tour Operator` (69 caratteri)
- **`<meta name="description">` attuale:** `Capri Destination Management Company is the luxury B2B spin-off from Nesea Capri Tours & Events. Bespoke private boat tours, weddings, Bar Mitzvah, VIP logistics, and 24/7 on-island operations.` (201 caratteri — leggermente oltre i 160 caratteri ideali)
- **`<link rel="canonical">`:** `https://www.capridmc.com/` (generato dinamicamente da `new URL(Astro.url.pathname, "https://www.capridmc.com")`)
- **`<h1>` attuale:** Collocato in `src/components/Hero.astro`:
  ```html
  <h1 class="hero-item gsap-reveal font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal leading-[1.08] tracking-tight mb-8 drop-shadow-2xl">
    Your Destination <br />
    <span class="font-serif italic text-brand-gold font-normal">Management</span> Company
  </h1>
  ```

---

## 5. Inventario Immagini Baseline

Tutte le immagini fotografiche risiedono in `public/images/capri/` (45 MB totali, 50 file) e il logo in `public/logo.png`.

| File Attuale | Usata in | Alt Text Attuale | Problema / Note |
|---|---|---|---|
| `/logo.png` | `Header.astro`, `Footer.astro`, `Hero.astro` | `"Capri DMC Logo"`, `"Capri DMC Official Crest"`, `"Capri DMC - Destination Management Company"` | Logo vettoriale / medaglione |
| `faraglioni-rocks-guided-tour-private-boat-capri.jpg` | `Hero.astro` | `"Capri Faraglioni Coastline and Mediterranean Sea"` | Background Hero LCP |
| `faraglioni-faraglioni-rocks.jpg` | `TheAuthority.astro`, `services.json` | `"Authentic Capri Faraglioni and Mediterranean Sea"` | Sezione The Authority & Tour Guidati |
| `anacapri-faro-aperitivo.jpg` | `TheAuthority.astro`, `services.json` | `"Capri Faro Sunset Champagne Aperitivo"` | The Authority & Cooking Classes |
| `concierge-service.jpg` | `BentoGridServices.astro`, `services.json` | `"Capri Infinity Pool Luxury Concierge"` | Banner 24/7 & Conciergerie |
| `private-boat-tours-in-capri.jpeg.jpg` | `services.json` | Titolo servizio (*Private Boat Tours*) | Doppio suffisso estensione `.jpeg.jpg` |
| `exclusive-boat-tours-with-local-guide.jpg` | `services.json` | Titolo servizio (*Transfers & Ticketing*) | Servizio Transfer |
| `wedding-in-capri.jpeg.jpg` | `services.json` | Titolo servizio (*Weddings & Bar Mitzvahs*) | Doppio suffisso estensione `.jpeg.jpg` |
| `private-shopper.jpeg.jpg` | `services.json` | Titolo servizio (*Artisanal Sandals & Textiles*) | Doppio suffisso estensione `.jpeg.jpg` |
| `villa-lysis-tour-private-tour-capri.jpeg.jpg` | `services.json` | Titolo servizio (*Personal Shopper*) | Doppio suffisso estensione `.jpeg.jpg` |
| `mount-solaro-hiking.jpeg.jpg` | `services.json` | Titolo servizio (*Hidden Hiking*) | Doppio suffisso estensione `.jpeg.jpg` |
| `anacapri-lighthouse-rough-sea-hiking.jpg` | `services.json` | Titolo servizio (*Personal Trainer & Sports*) | Servizio Sport/Fitness |
| `solo-tour.jpg` | `services.json` | Titolo servizio (*Babysitting & Pet Sitting*) | Servizio Babysitting/Pet |

---

## 6. Screenshot Baseline (Playwright)

Catturati tramite script automatizzato Playwright headless su Chromium/Chrome nei 3 viewport stabiliti:
1. **Mobile (390 x 844):** `tests/screenshots/baseline/homepage-mobile-390.png`
2. **Tablet (768 x 1024):** `tests/screenshots/baseline/homepage-tablet-768.png`
3. **Desktop (1440 x 900):** `tests/screenshots/baseline/homepage-desktop-1440.png`

Questi screenshot costituiscono il punto di riferimento per il **gate visivo a pixel-diff zero**.

---

## 7. Punteggio Lighthouse Baseline

Test condotto tramite engine ufficiale Lighthouse v12:

| Categoria | Desktop Baseline | Mobile Baseline | Obiettivo Post-Ottimizzazione |
|---|---|---|---|
| **Performance** | **62** | **62** | Non peggiorare (≥ 62) |
| **Accessibility** | **93** | **93** | Non peggiorare (≥ 93) |
| **Best Practices** | **100** | **100** | Invariato (100) |
| **SEO** | **92** | **92** | **≥ 95** (Target: 100) |

### Dettaglio audit SEO non superato nella baseline:
- `link-text`: presenza di link con testo generico ("Learn more") proveniente dall'Astro dev toolbar in esecuzione locale; il build di produzione e la corretta semantica porteranno il punteggio a 100.
