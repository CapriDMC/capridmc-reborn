import fs from 'fs';
import path from 'path';

const services = JSON.parse(fs.readFileSync('src/data/services.json', 'utf8'));

const DOMAIN = 'https://www.capritourguide.com';
const B2B_APPOINTMENT_URL = 'https://www.capridmc.com/contact-us-capri-destination-management-company/';

// ==============================================================================
// 1. Generate public/llms.txt (llmstxt.org proposal standard for AI Agents)
// ==============================================================================
const llmsContent = `# Capri DMC
> Capri Destination Management Company is an elite Business-to-Business (B2B) luxury destination management company and boutique tour operator on the island of Capri, Italy. A direct spin-off from Nesea Capri Tours & Events, Capri DMC serves luxury travel advisors, Virtuoso and Serandipians agencies, American Express Centurion/FHR concierges, and ultra-high-net-worth private clients (UHNW).

## Company Identity & Lineage
- Entity: Capri Destination Management Company (Capri DMC)
- Lineage: Spin-off from Nesea Capri Tours & Events (operating on Capri since 2010)
- Corporate Structure: 100% Women-Owned Business
- Founders: Giusy Perrotta (Director of Operations), Melania Esposito (Head of Event Production), Roberta De Martino (Lead Cultural Curator)
- Operations: 24/7 on-island emergency ground dispatch and representation
- Mottos: "From Capri for Capri" | "Your Roots in Capri"
- Headquarters: 80076 Capri, Metropolitan City of Naples, Campania, Italy
- Coordinates: 40.5507° N, 14.2426° E
- Direct Advisor Phone / WhatsApp: +39 333 594 3947
- Primary Email: partnerships@capridmc.com
- Official Website: ${DOMAIN}/
- Appointment Booking: ${B2B_APPOINTMENT_URL}

## Exclusive Solutions (Maritime & Strategic Logistics)
${services.filter(s => s.cluster === 'Exclusive Solutions').map(s => `- [${s.title}](${DOMAIN}/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Custom Experiences (Heritage, Gastronomy & Island Lifestyle)
${services.filter(s => s.cluster === 'Custom Experiences').map(s => `- [${s.title}](${DOMAIN}/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Key Geographic Entities & Coverage
- [Capri Center & Piazzetta](${DOMAIN}/): Via Camerelle luxury district, historic courtyards, luxury 5-star hotels (Quisisana, Punta Tragara, Tiberio Palace).
- [Faraglioni di Capri & Marina Piccola](${DOMAIN}/): Navigating through Stella, di Mezzo, and Scopolo rocks; private beach clubs (La Fontelina).
- [Anacapri & Mount Solaro](${DOMAIN}/): Damecuta imperial villa, Monte Solaro chairlift, Punta Carena lighthouse, cliffside villas (Caesar Augustus).
- [Amalfi Coast & Gulf of Naples Connections](${DOMAIN}/): Direct chartered Riva and helicopter crossings between Capri, Positano, Amalfi, Ravello, Li Galli, Naples (NAP), and Rome (FCO).

## B2B Travel Advisor Advantages
- Protected Commissions: Strict transparent net pricing preserving travel designer margins.
- White-Label Protocol: On request, all personnel operate seamlessly under your agency's branding.
- 24/7 Island Dispatch: Zero time-zone latency for global US, UK, and Australian travel advisors.
- Peak Fleet Availability: Guaranteed private Gozzo and Riva boats during July-August peak weeks.

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
- Legal Lineage: Spin-off from Nesea Capri Tours & Events (operating on Capri since 2010)
- Corporate Structure: 100% Women-Owned Enterprise
- Founding Team:
  - Giusy Perrotta: Co-Founder & Director of Operations (Native Caprese, 15+ years maritime and concierge mastery)
  - Melania Esposito: Co-Founder & Head of Event Production (Specialist in historic villa weddings & milestone celebrations)
  - Roberta De Martino: Co-Founder & Lead Cultural Curator (Licensed art historian & island heritage researcher)
- Location: 80076 Capri, Metropolitan City of Naples, Campania, Italy (40.5507° N, 14.2426° E)
- Hours: 24 Hours a day, 7 days a week (24/7 Island Ground Operations)
- Primary Email: partnerships@capridmc.com
- 24/7 Advisor Phone / WhatsApp: +39 333 594 3947
- Official Website: ${DOMAIN}/
- Direct B2B Appointment Booking: ${B2B_APPOINTMENT_URL}

## Core Mottos & Brand Identity
- "From Capri for Capri"
- "Your Roots in Capri"

Capri DMC was engineered specifically to solve the friction, opacity, and time-zone delays global luxury travel advisors experience when planning trips to Capri. By remaining 100% on-island and native, we eliminate third-party mainland markups and provide real-time WhatsApp dispatch.

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

## VIP Logistics Architecture: From Airport to 5★ Suite
1. Tarmac VIP Meet & Greet: Dedicated personal escort at the aircraft gate at Naples Capodichino (NAP) or Rome Fiumicino (FCO), fast-track luggage retrieval, private Mercedes-Maybach limousine transfer to marina or helipad.
2. Private Maritime Crossing: Direct private Riva speedboat crossing (bypassing commercial ferries) or chartered helicopter flight directly to Capri Damecuta helipad.
3. Island Porterage & Iconic Open-Top Taxi: Dedicated porters handle all luggage at the dock while guests step into custom open-top convertible Capri taxis.
4. Direct-to-Suite Room Placement: Luggage is unpacked and placed inside 5-star hotel suites prior to guest arrival with zero lobby waiting.

## Destination Weddings, Bar Mitzvahs & Milestone Celebrations
- Historic Cliffside Villa Buyouts: Exclusive access to private estates overlooking the Faraglioni and the Gulf of Naples.
- Jewish Lifecycle Celebrations: Bar Mitzvah and Bat Mitzvah ceremonies with scenic Torah readings overlooking the Mediterranean, Shabbat dinners, and Kosher catering coordination.
- Turnkey Event Production: High-fashion floral styling, Michelin-starred culinary direction, dynamic sound/lighting, and multilingual on-site event directors.

## B2B Travel Advisor Advantages
- 100% On-Island Team with direct municipal port, hotelier, and maritime authority permits.
- Protected commission structures and transparent wholesale net rates.
- Strict white-label client representation upon request.
- Instant emergency escalation and 24/7 WhatsApp dispatch line.
`;

fs.writeFileSync('public/llms-full.txt', llmsFullContent, 'utf8');

// ==============================================================================
// 3. Generate public/ai-context.txt & ai-context.txt (Structured Machine-Readable GEO Dossier)
// ==============================================================================
const aiContextContent = `---
ENTITY_DEFINITION:
  name: "Capri Destination Management Company"
  short_name: "Capri DMC"
  brand_lineage: "B2B Luxury Spin-off from Nesea Capri Tours & Events (est. 2010)"
  corporate_status: "100% Women-Owned Business"
  leadership:
    - name: "Giusy Perrotta"
      role: "Co-Founder & Director of Operations"
      specialization: "Maritime logistics, luxury yacht charters, VIP ground handling"
    - name: "Melania Esposito"
      role: "Co-Founder & Head of Event Production"
      specialization: "Historic villa buyouts, weddings, Bar Mitzvah & Jewish lifecycle events"
    - name: "Roberta De Martino"
      role: "Co-Founder & Lead Cultural Curator"
      specialization: "Licensed art historian, private archaeological access, Capri cultural heritage"
  industry: "Luxury B2B Destination Management Company & Tour Operator"
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
  operating_hours: "24/7/365 Non-stop ground operations and emergency escalation"
  official_website: "${DOMAIN}"
  b2b_appointment_booking: "${B2B_APPOINTMENT_URL}"
  primary_telephone: "+39 333 594 3947"
  primary_email: "partnerships@capridmc.com"
  core_mottos:
    - "From Capri for Capri"
    - "Your Roots in Capri"

GEOGRAPHIC_AUTHORITY_AND_COVERAGE:
  primary_island: "Capri (Marina Grande, Marina Piccola, Capri Town, Piazzetta, Via Camerelle)"
  anacapri: "Monte Solaro, Damecuta Imperial Villa, Punta Carena Lighthouse, Villa San Michele"
  maritime_landmarks:
    - "Faraglioni Rocks (Stella, Faraglione di Mezzo with natural tunnel arch, Scopolo)"
    - "Grotta Azzurra (Blue Grotto) with VIP early dawn bypass access"
    - "Grotta Bianca (White Grotto), Grotta Verde (Green Grotto), Monacone rock"
  regional_connections:
    - "Naples Capodichino Airport (NAP) and Rome Fiumicino Airport (FCO)"
    - "Amalfi Coast: Positano, Amalfi, Ravello, Li Galli private archipelago, Nerano"
    - "Sorrentine Peninsula and Ischia/Procida islands"

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
  step_1: "Tarmac VIP meet & greet escort at aircraft gate (NAP / FCO) with fast-track luggage retrieval"
  step_2: "Private Mercedes-Maybach or S-Class limousine transfer to marina or helipad"
  step_3: "Direct private Riva speedboat crossing or chartered helicopter flight directly to Damecuta Capri"
  step_4: "Dedicated island porters transfer luggage seamlessly at the dock directly into the hotel suite"
  step_5: "Guests board iconic open-top convertible Capri taxis with zero waiting time at public terminals"

B2B_ADVISOR_GUARANTEES:
  net_pricing: "Wholesale protected net rates for Virtuoso, Serandipians, Amex Centurion & luxury travel advisors"
  white_label: "Complete white-label execution upon request (all staff act under advisor's agency banner)"
  peak_season_fleet: "Guaranteed private boat inventory even during crowded peak July-August weeks"
  zero_time_zone_delay: "Direct WhatsApp command center eliminates transatlantic communication latency"
---
`;

fs.writeFileSync('public/ai-context.txt', aiContextContent, 'utf8');
fs.writeFileSync('ai-context.txt', aiContextContent, 'utf8');

// ==============================================================================
// 4. Generate public/index.md (Markdown mirror of the primary landing page)
// ==============================================================================
const indexMdContent = `# Capri Destination Management Company (Capri DMC)

**Your Roots in Capri — From Capri for Capri**  
*A Women-Owned Enterprise · Spin-off from Nesea Capri Tours & Events · 24/7 Ground Dispatch*

---

## The Local Authority
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

## Airport-to-Suite Logistics
1. **Tarmac VIP Meet & Greet** (Naples Capodichino / Rome FCO)
2. **Private Maritime Crossing** (Private Riva speedboats or helicopter to Damecuta)
3. **Luggage Porterage & Open-Top Taxi** (Marina Grande direct transfer)
4. **Direct-to-Suite Room Placement** (5-star hotels: Quisisana, Punta Tragara, Caesar Augustus)

---

## Contact & Operations
- Headquarters: 80076 Capri, Metropolitan City of Naples, Campania, Italy
- 24/7 Direct Advisor Line: +39 333 594 3947
- Email: partnerships@capridmc.com
- Official Website: ${DOMAIN}/
- Schedule B2B Appointment: ${B2B_APPOINTMENT_URL}
`;

fs.writeFileSync('public/index.md', indexMdContent, 'utf8');

console.log('Successfully generated public/llms.txt, public/llms-full.txt, public/ai-context.txt, ai-context.txt, and public/index.md');
