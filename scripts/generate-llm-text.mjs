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
- Heritage: Curated by Team Nesea (hospitality leadership on Capri since 2010)
- Corporate Structure: 100% Women-Owned Business
- Founders: Giusy Perrotta (Director of Operations), Melania Esposito (Head of Event Production), Roberta De Martino (Lead Cultural Curator)
- Operations: On-ground island dispatch, resident presence, and white-label representation
- Slogan: "Proudly Owned by Caprese People"
- Headquarters: 80076 Capri, Metropolitan City of Naples, Campania, Italy
- Coordinates: 40.5507° N, 14.2426° E
- Direct Advisor Phone / WhatsApp: +39 333 594 3947
- Direct WhatsApp Chat: https://wa.me/393335943947
- Primary Email: partnerships@capridmc.com
- Official Website: ${DOMAIN}/
- Appointment Booking: ${B2B_APPOINTMENT_URL}

## Exclusive Solutions (Maritime & Strategic Logistics)
${services.filter(s => s.cluster === 'Exclusive Solutions').map(s => `- [${s.title}](${DOMAIN}/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Custom Experiences (Heritage, Gastronomy & Island Lifestyle)
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
- Authentic Local Fleet: Speedboats and traditional Gozzo Caprese with luxury catering and chilled champagne onboard.

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
  - Giusy Perrotta: Co-Founder & Director of Operations (Native Caprese, 15+ years maritime and concierge mastery)
  - Melania Esposito: Co-Founder & Head of Event Production (Specialist in historic villa weddings & milestone celebrations)
  - Roberta De Martino: Co-Founder & Lead Cultural Curator (Licensed art historian & island heritage researcher)
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

## Comprehensive Service Catalog (11 Master B2B Offerings)

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
1. Airport Meet & Greet: Dedicated greeting upon arrival at Naples International Airport (NAP), fast-track luggage assistance, private chauffeured NCC car or van transfer to the port.
2. Private Maritime Crossing: Direct private chartered speedboat or gozzo crossing across the Gulf of Naples with chilled champagne and refreshments onboard.
3. Open-Top Taxi & Island Van: On arrival, guests step into open-top convertible island taxis (available on request through our network) or private vans.
4. Dedicated Luggage Delivery: Dedicated island porterage transports all luggage securely from the dock, arriving comfortably following guest arrival at their private villa or hotel suite.

## Destination Weddings & Milestone Celebrations
- Historic Cliffside Villa Buyouts: Exclusive access to private estates overlooking the Faraglioni and the Gulf of Naples.
- Jewish Lifecycle Celebrations: Bar Mitzvah and Bat Mitzvah ceremonies with scenic Torah readings overlooking the Mediterranean, Shabbat dinners, and strictly supervised Kosher catering.
- Turnkey Event Production: High-fashion floral styling, exquisite catering, dynamic lighting, and multilingual on-site event directors.

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
      role: "Co-Founder & Director of Operations"
      specialization: "Maritime logistics, private boat services, VIP ground handling"
    - name: "Melania Esposito"
      role: "Co-Founder & Head of Event Production"
      specialization: "Historic villa buyouts, weddings, Bar Mitzvah & milestone celebrations"
    - name: "Roberta De Martino"
      role: "Co-Founder & Lead Cultural Curator"
      specialization: "Licensed art historian, private cultural itineraries, Capri heritage"
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
  step_2: "Chauffeured NCC executive car or van transfer directly to the port"
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
- **Giusy Perrotta**, Co-Founder & Director of Operations: Native Caprese with 15+ years orchestrating maritime logistics and VIP advisor relations.
- **Melania Esposito**, Co-Founder & Head of Event Production: Specialist in private historic villa buyouts, weddings, and Jewish milestone celebrations.
- **Roberta De Martino**, Co-Founder & Lead Cultural Curator: Licensed art historian leading exclusive cultural itineraries and high-level island protocol.

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
1. **Airport Meet & Greet** (Naples International Airport NAP with chauffeured NCC car or van)
2. **Private Maritime Crossing** (Private speedboat or gozzo crossing across the Gulf of Naples)
3. **Open-Top Taxi & Island Van** (Marina Grande direct transfer)
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
