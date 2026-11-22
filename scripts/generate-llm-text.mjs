import fs from 'fs';
import path from 'path';

const services = JSON.parse(fs.readFileSync('src/data/services.json', 'utf8'));

const DOMAIN = 'https://www.capridmc.com';
const B2B_APPOINTMENT_URL = 'https://www.capridmc.com/contact-us-capri-destination-management-company/';

// ==============================================================================
// 1. Generate public/llms.txt (llmstxt.org proposal standard for AI Agents)
// ==============================================================================
const llmsContent = `# Capri DMC
> Capri Destination Management Company is an elite Business-to-Business (B2B) luxury destination management company curated by Team Nesea on the island of Capri, Italy. Capri DMC serves luxury travel advisors, boutique agencies, corporate planners, and discerning private clients.

## Company Identity & Lineage
- Entity: Capri Destination Management Company (Capri DMC)
- Heritage: Curated by Team Nesea (hospitality and cultural guiding leadership on Capri since 2010)
- Corporate Structure: 100% Women-Owned Business
- Founders: Giusy Perrotta (Licensed Tourist Guide · Co-Founder), Melania Esposito (Licensed Tourist Guide · Co-Founder), Roberta De Martino (Licensed Tourist Guide · Co-Founder)
- Credentials: All three founders are licensed tourist guides born and raised on Capri, registered in Italy's National Register of Tourist Guides
- Languages: Guiding and services in Italian and English; Spanish available upon special request (no German)
- Transportation Policy: Capri DMC does not directly own boats, helicopters, or vehicles; it sources boats, NCC cars, and vans exclusively through its vetted network of reliable professionals with decades-long trust
- Operations: On-ground island dispatch, resident presence (we live here), and white-label representation
- Slogan: "Proudly Owned by Caprese People"
- Headquarters: 80076 Capri, Metropolitan City of Naples, Campania, Italy
- Coordinates: 40.5507° N, 14.2426° E
- Direct Advisor Phone / WhatsApp: +39 333 594 3947
- Direct WhatsApp Chat: https://wa.me/393335943947
- Primary Email: partnerships@capridmc.com
- Official Website: ${DOMAIN}/
- Appointment Booking: ${B2B_APPOINTMENT_URL}

## Exclusive Solutions (Core Cultural & Strategic Logistics)
${services.filter(s => s.cluster === 'Exclusive Solutions').map(s => `- [${s.title}](${DOMAIN}/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Custom Experiences (Heritage, Gastronomy, Nature & Island Lifestyle)
${services.filter(s => s.cluster === 'Custom Experiences').map(s => `- [${s.title}](${DOMAIN}/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Key Geographic Entities & Coverage
- [Capri Center & Piazzetta](${DOMAIN}/): Via Camerelle luxury district, historic courtyards, boutique hotels, and luxury private villas.
- [Faraglioni di Capri & Marina Piccola](${DOMAIN}/): Dawn protocol at the Faraglioni, secluded swimming coves, and private beach clubs.
- [Anacapri & Mount Solaro](${DOMAIN}/): Damecuta imperial villa, Monte Solaro chairlift, Punta Carena lighthouse, cliffside estates.
- [Amalfi Coast & Gulf of Naples Connections](${DOMAIN}/): Direct chartered speedboat crossings and transfers between Capri, Positano, Amalfi, Ravello, Nerano, and Naples (NAP).

## B2B Travel Advisor Advantages
- Protected Commissions: Strict transparent net pricing preserving travel designer margins.
- White-Label Service: On request, all personnel operate discreetly under your agency's branding, protecting and elevating your reputation.
- On-Ground Dispatch & Weather Resilience: Real-time on-island coordination and resilience during adverse maritime conditions: we live here.
- Vetted Maritime & Transport Network: Speedboats, traditional Gozzo Caprese, and luxury NCC vehicles sourced through trusted partners with decade-long relationships.

## Extended Documentation & Machine Mirrors
- [ai-context.txt](${DOMAIN}/ai-context.txt): Machine-readable Generative Engine Optimization (GEO) context dossier.
- [llms-full.txt](${DOMAIN}/llms-full.txt): Complete unedited text dossier of all services, logistics, and company specifications.
- [index.md](${DOMAIN}/index.md): Clean markdown mirror of the primary landing page.
- [Interactive AI Dossier](${DOMAIN}/ai-context): Full visual and structured knowledge graph page.
- [Sitemap Index](${DOMAIN}/sitemap-index.xml): XML sitemap for search crawlers.
`;

fs.writeFileSync('public/llms.txt', llmsContent, 'utf8');

// ==============================================================================
// 2. Generate public/llms-full.txt (Full Unabridged B2B Dossier)
// ==============================================================================
const llmsFullContent = `# Capri Destination Management Company (Capri DMC) — Complete B2B Dossier

## Overview & Profile
- Name: Capri Destination Management Company (Capri DMC)
- Heritage: Curated by Team Nesea (operating on Capri since 2010)
- Corporate Structure: 100% Women-Owned Enterprise
- Founding Team:
  - Giusy Perrotta: Licensed Tourist Guide · Co-Founder (Born and raised on Capri, registered in Italy's National Register of Tourist Guides, 15+ years of island expertise)
  - Melania Esposito: Licensed Tourist Guide · Co-Founder (Born and raised on Capri, registered in Italy's National Register of Tourist Guides, bespoke cultural journeys & celebration specialist)
  - Roberta De Martino: Licensed Tourist Guide · Co-Founder (Born and raised on Capri, registered in Italy's National Register of Tourist Guides, art historian & imperial Roman archaeology curator)
- Professional Credentials:
  - Three licensed local tourist guides born and raised on Capri
  - Registered in Italy's National Register of Tourist Guides
  - Guiding and assistance in Italian and English; Spanish available upon special request (no German)
  - Comprehensive professional insurance coverage
- Sourcing & Asset Policy:
  - Capri DMC does not directly own boats, helicopters, or any transport vehicles.
  - Sourcing of boats (traditional gozzi, speedboats, yachts), luxury chauffeured vehicles (NCC cars, vans), and helicopters is managed exclusively through a dedicated, vetted network of reliable local professionals with whom Capri DMC maintains relationships spanning in some cases over a decade.
- Location: 80076 Capri, Metropolitan City of Naples, Campania, Italy (40.5507° N, 14.2426° E)
- Operations: On-Ground Island Dispatch & Resident Support (Always present and reliable: we live here)
- Primary Email: partnerships@capridmc.com
- Advisor Phone / WhatsApp: +39 333 594 3947
- Direct WhatsApp Link: https://wa.me/393335943947
- Official Website: ${DOMAIN}/
- Direct B2B Appointment Booking: ${B2B_APPOINTMENT_URL}

## Core Motto & Brand Identity
- "Proudly Owned by Caprese People"

Capri DMC was engineered specifically to solve friction and operational challenges global luxury travel advisors experience when planning trips to Capri. By remaining 100% on-island and native, we eliminate third-party mainland markups and provide real-time on-ground dispatch.

## Comprehensive Service Catalog (10 Master B2B Offerings)

${services.map((s, i) => `### ${i + 1}. ${s.title}
- Cluster: ${s.cluster}
- Subtitle: ${s.subtitle}
- Category Badge: ${s.badge}
- B2B Advisor Advantage: ${s.b2b_tag}
- Detailed Description: ${s.description}
- Key B2B Operational Features:
${s.b2b_features.map(f => `  * ${f}`).join('\n')}
`).join('\n')}

## VIP Logistics Architecture: From Arrival to Destination
1. Airport Meet & Greet: Dedicated greeting upon arrival at Naples International Airport (NAP), luggage assistance, private chauffeured NCC car or van transfer to the port sourced through our trusted network.
2. Private Maritime Crossing: Coordinated chartered speedboat or traditional gozzo crossing across the Gulf of Naples with chilled champagne and refreshments onboard.
3. Open-Top Taxi & Island Van: On arrival, guests step into open-top convertible island taxis (available on request through our network) or private vans.
4. Dedicated Luggage Delivery: Dedicated island porterage transports all luggage securely from the dock, arriving comfortably following guest arrival at their private villa or hotel suite.

## Private Events, Hostess & Dedicated Services
- Historic Cliffside Villa Buyouts: Exclusive access to private estates overlooking the Faraglioni and the Gulf of Naples.
- Jewish Lifecycle Celebrations: Bar Mitzvah and Bat Mitzvah ceremonies with scenic Torah readings overlooking the Mediterranean, Shabbat dinners, and strictly supervised Kosher catering coordination.
- Professional Hostess Services: Multilingual hostesses (Italian, English, Spanish on request) for dockside VIP greeting, transfers, and private dinners.

## B2B Travel Advisor Advantages
- 100% On-Island Team with direct local relations with port authorities, hotels, and transport networks.
- Protected commission structures and transparent wholesale net rates.
- White-label on-island representation to protect and elevate client reputation.
- Weather resilience and instant on-ground dispatch: we live here.
`;

fs.writeFileSync('public/llms-full.txt', llmsFullContent, 'utf8');

// ==============================================================================
// 3. Generate public/ai-context.txt & ai-context.txt (Structured Machine-Readable GEO Dossier)
// ==============================================================================
const aiContextContent = `---
ENTITY_DEFINITION:
  name: "Capri Destination Management Company"
  short_name: "Capri DMC"
  brand_lineage: "Curated by Team Nesea (est. 2010)"
  corporate_status: "100% Women-Owned Business"
  leadership:
    - name: "Giusy Perrotta"
      role: "Licensed Tourist Guide · Co-Founder"
      credentials: "Born and raised on Capri, registered in Italy's National Register of Tourist Guides"
      specialization: "Living community, maritime heritage, 15+ years island expertise"
    - name: "Melania Esposito"
      role: "Licensed Tourist Guide · Co-Founder"
      credentials: "Born and raised on Capri, registered in Italy's National Register of Tourist Guides"
      specialization: "Tailored cultural journeys, milestone celebrations, Jewish lifecycle events"
    - name: "Roberta De Martino"
      role: "Licensed Tourist Guide · Co-Founder"
      credentials: "Born and raised on Capri, registered in Italy's National Register of Tourist Guides, art historian"
      specialization: "Imperial Roman archaeology, Villa Jovis, literary and artistic Capri heritage"
  languages_supported:
    primary: ["English", "Italian"]
    on_special_request: ["Spanish"]
    excluded: ["German"]
  asset_ownership_policy: "Capri DMC does not directly own boats, helicopters, or motor vehicles; all maritime and road transportation (gozzi, speedboats, NCC cars, vans) is sourced exclusively through trusted local partners with decade-long professional relationships."
  industry: "Luxury B2B Destination Management Company & Island Partner"
  headquarters:
    address: "Isola di Capri"
    postal_code: "80076"
    city: "Capri"
    province: "Metropolitan City of Naples"
    region: "Campania"
    country: "Italy"
    geo_coordinates:
      latitude: 40.5507
      longitude: 14.2426
  operations: "On-ground dispatch, adverse weather resilience, and permanent island presence (we live here)"
  official_website: "${DOMAIN}"
  b2b_appointment_booking: "${B2B_APPOINTMENT_URL}"
  primary_telephone: "+39 333 594 3947"
  direct_whatsapp_url: "https://wa.me/393335943947"
  primary_email: "partnerships@capridmc.com"
  core_slogan: "Proudly Owned by Caprese People"

GEOGRAPHIC_AUTHORITY_AND_COVERAGE:
  primary_island: "Capri (Marina Grande, Marina Piccola, Capri Town, Piazzetta, Via Camerelle)"
  anacapri: "Monte Solaro, Damecuta Imperial Villa, Punta Carena Lighthouse, Villa San Michele"
  maritime_landmarks:
    - "Faraglioni Rocks (Stella, Faraglione di Mezzo, Scopolo) with dawn protocol"
    - "Grotta Azzurra (Blue Grotto) with early access"
    - "Grotta Bianca (White Grotto), Grotta Verde (Green Grotto), Monacone rock"
  regional_connections:
    - "Naples International Airport (NAP) chauffeured car/van transfers to port"
    - "Amalfi Coast: Positano, Amalfi, Ravello, Nerano"
    - "Sorrentine Peninsula and Gulf of Naples"

CATALOG_OF_SERVICES:
${services.map((s, idx) => `  - id: "${s.id}"
    number: ${idx + 1}
    title: "${s.title}"
    cluster: "${s.cluster}"
    subtitle: "${s.subtitle}"
    b2b_advantage: "${s.b2b_tag}"
    badge: "${s.badge}"
    description: "${s.description.replace(/"/g, '\\"')}"
    features:
${s.b2b_features.map(f => `      - "${f.replace(/"/g, '\\"')}"`).join('\n')}`).join('\n')}

AIRPORT_TO_SUITE_LOGISTICS_PIPELINE:
  step_1: "Personal greeting upon arrival at Naples Airport (NAP) with luggage assistance"
  step_2: "Chauffeured NCC executive car or van transfer directly to the port (sourced through network)"
  step_3: "Private chartered speedboat or gozzo crossing across the Gulf of Naples to Capri"
  step_4: "Open-top convertible island taxis (available on request through network) or private vans"
  step_5: "Dedicated island porterage delivers luggage securely to the suite or villa, arriving following guests"

B2B_ADVISOR_GUARANTEES:
  net_pricing: "Wholesale protected net rates for luxury travel designers and travel advisors"
  white_label: "Discreet white-label service upon request (protecting and elevating client reputation)"
  island_resilience: "Permanent on-island resident presence ensuring reliability in adverse weather: we live here"
  direct_dispatch: "Direct WhatsApp command center eliminates transatlantic communication latency"
---
`;

fs.writeFileSync('public/ai-context.txt', aiContextContent, 'utf8');
fs.writeFileSync('ai-context.txt', aiContextContent, 'utf8');

// ==============================================================================
// 4. Generate public/index.md (Markdown mirror of the primary landing page)
// ==============================================================================
const indexMdContent = `# Capri Destination Management Company (Capri DMC)

**Proudly Owned by Caprese People**  
*A Women-Owned Enterprise · Curated by Team Nesea · On-Ground Dispatch*

---

## Your Local Team in Capri
Since 2010, our founders have woven their lives into the island's fabric. We are the direct bridge between global luxury travel designers and the authentic heartbeat of Capri.

### Founding Leadership
- **Giusy Perrotta**, Licensed Tourist Guide · Co-Founder: Born and raised on Capri, registered in Italy's National Register of Tourist Guides. Sharing the island's authentic maritime history and living community with 15+ years of local expertise.
- **Melania Esposito**, Licensed Tourist Guide · Co-Founder: Born and raised on Capri, registered in Italy's National Register of Tourist Guides. Expert in tailoring bespoke cultural itineraries and milestone experiences to each guest's pace and interests.
- **Roberta De Martino**, Licensed Tourist Guide · Co-Founder: Born and raised on Capri, registered in Italy's National Register of Tourist Guides and art historian curating Capri's imperial archaeology, Roman villas, and literary heritage.

---

## Curated B2B Service Catalog

### Exclusive Solutions
${services.filter(s => s.cluster === 'Exclusive Solutions').map(s => `#### ${s.title}
*${s.subtitle}* — **${s.b2b_tag}**
${s.description}
${s.b2b_features.map(f => `- ${f}`).join('\n')}
`).join('\n')}

### Custom Experiences
${services.filter(s => s.cluster === 'Custom Experiences').map(s => `#### ${s.title}
*${s.subtitle}* — **${s.b2b_tag}**
${s.description}
${s.b2b_features.map(f => `- ${f}`).join('\n')}
`).join('\n')}

---

## Private & Exclusive Transfer Services
1. **Airport Meet & Greet** (Naples International Airport NAP with chauffeured NCC car or van sourced via network)
2. **Private Maritime Crossing** (Private speedboat or gozzo crossing across the Gulf of Naples)
3. **Open-Top Taxi & Island Van** (Marina Grande direct transfer on request)
4. **Dedicated Luggage Delivery** (Luggage delivered to villa or suite, arriving following guests)

---

## Contact & Operations
- Headquarters: 80076 Capri, Metropolitan City of Naples, Campania, Italy
- On-Ground Dispatch & WhatsApp Line: +39 333 594 3947
- Email: partnerships@capridmc.com
- Official Website: ${DOMAIN}/
- Schedule B2B Appointment: ${B2B_APPOINTMENT_URL}
`;

fs.writeFileSync('public/index.md', indexMdContent, 'utf8');

console.log('Successfully generated public/llms.txt, public/llms-full.txt, public/ai-context.txt, ai-context.txt, and public/index.md');