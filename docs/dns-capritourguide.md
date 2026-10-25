# Configurazione DNS e Collegamento Dominio: capritourguide.com

**Destinatario:** Pep (`partnerships@capridmc.com`)  
**Data:** 25 Ottobre 2026  
**Progetto:** `CapriDMC/capridmc-reborn` (Cloudflare Pages / Workers: `capridmc-reborn.partnerships-ef3.workers.dev`)  
**Registrar DNS Attuale:** IONOS (`ui-dns.com` / `ui-dns.de` / `ui-dns.biz` / `ui-dns.org`)

---

## 1. Analisi dello Stato Attuale (IONOS)

Dai test DNS eseguiti sul dominio `capritourguide.com`:
- **Server Web attuale:** Record A `217.160.0.170` e AAAA `2001:8d8:100f:f000::288` (pagina placeholder/default di cortesia IONOS Apache).
- **Posta elettronica attiva:** Record MX `mx00.ionos.it` e `mx01.ionos.it`, record TXT SPF `v=spf1 include:_spf-eu.ionos.com ~all`.

> [!CAUTION]
> **PRESERVAZIONE DELLA POSTA ELETTRONICA:**  
> Non toccare, modificare o eliminare i record **MX** (`mx00.ionos.it`, `mx01.ionos.it`) e il record **TXT SPF**. Se modificati, la posta associata alle caselle `@capritourguide.com` smetterebbe di funzionare.  
> La modifica interessa **esclusivamente i record web** (`A`, `AAAA` e `CNAME`).

---

## 2. Procedura di Collegamento in 2 Step

### Step 1: Registrazione del Dominio su Cloudflare
1. Accedi alla dashboard di Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com).
2. Vai su **Workers & Pages** → Seleziona il progetto **`capridmc-reborn`**.
3. Clicca sulla scheda **Custom Domains** (o in *Settings* → *Domains & Routes* / *Custom Domains*).
4. Clicca su **Set up a custom domain** (Aggiungi dominio personalizzato).
5. Inserisci prima **`www.capritourguide.com`** e poi **`capritourguide.com`**.
6. Cloudflare ti mostrerà il record CNAME di destinazione (generalmente `capridmc-reborn.pages.dev` oppure `capridmc-reborn.partnerships-ef3.workers.dev`).

---

### Step 2: Inserimento Record nel Pannello DNS di IONOS

Accedi all'area clienti IONOS su **IONOS Domain Center** → **capritourguide.com** → **DNS**:

#### A. Record da ELIMINARE su IONOS per liberare il traffico Web:
- Rimuovi il record **A** per `www` (valore `217.160.0.170`).
- Rimuovi il record **AAAA** per `www` (valore `2001:8d8:100f:f000::288`).

#### B. Record da INSERIRE / IMPOSTARE su IONOS:

| Tipo | Nome Host / Subdomain | Valore / Destinazione | TTL | Note |
|---|---|---|---|---|
| **CNAME** | `www` | `capridmc-reborn.pages.dev` *(o target fornito da Cloudflare)* | 300 o 3600 (Automatico) | Punta il traffico principale al nuovo sito |
| **Inoltro HTTP** | `@` (radice `capritourguide.com`) | Inoltro 301 verso `https://www.capritourguide.com/` | - | Gestibile tramite la funzione nativa di IONOS *"Inoltro dominio / Reindirizzamento"* |

*(Se IONOS ti chiede la convalida della proprietà tramite record TXT `_cf-custom-hostname.capritourguide.com` fornito da Cloudflare, inserisci anche quel record TXT).*

#### C. Record da LASCIARE INVARIATI (Mail IONOS):

| Tipo | Host | Valore | Priorità |
|---|---|---|---|
| **MX** | `@` | `mx00.ionos.it` | 10 |
| **MX** | `@` | `mx01.ionos.it` | 10 |
| **TXT** | `@` | `"v=spf1 include:_spf-eu.ionos.com ~all"` | - |

---

## 3. Gestione Strategica SEO (Canonici)

Nel codice attuale del sito (`src/components/Seo.astro`), il tag canonico è impostato su:
`https://www.capridmc.com`

- **Se `capritourguide.com` è un dominio satellite / alias:** Questa configurazione è ottimale perché trasferisce tutta l'autorità SEO e il "link juice" a Capri DMC senza rischi di penalizzazione per contenuti duplicati.
- **Se invece `capritourguide.com` deve diventare il dominio primario:** Possiamo aggiornare la proprietà `site` in `astro.config.mjs` e in `src/components/Seo.astro` in un singolo commit.

---

## 4. Test di Verifica Post-Cutover da Terminale

Appena salvate le modifiche su IONOS, la propagazione richiederà da pochi minuti a massimo 1-2 ore:

```bash
# 1. Verifica risoluzione DNS del record CNAME
dig www.capritourguide.com CNAME +short

# 2. Verifica risposta HTTP/2 con certificato SSL emesso da Cloudflare
curl -sI https://www.capritourguide.com/ | grep -E "HTTP/|server:|location:"

# 3. Verifica reindirizzamento da apex a www
curl -sI https://capritourguide.com/ | grep -E "HTTP/|server:|location:"
```
