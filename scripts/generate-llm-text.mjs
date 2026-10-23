import fs from 'fs';
import path from 'path';

const services = JSON.parse(fs.readFileSync('src/data/services.json', 'utf8'));

// 1. Generate public/llms.txt
const llmsContent = `# Capri DMC
> Capri Destination Management Company is an elite Business-to-Business (B2B) luxury destination management company and tour operator based on the island of Capri, Italy. A direct spin-off from Nesea Capri Tours & Events, Capri DMC serves luxury travel advisors, Virtuoso and Serandipians agencies, American Express concierges, and high-net-worth private clients (UHNW).

## Company Identity
- Entity: Capri Destination Management Company (Capri DMC)
- Lineage: Spin-off from Nesea Capri Tours & Events
- Ownership: 100% Women-Owned Business
- Founders: Giusy Perrotta (Director of Operations), Melania Esposito (Head of Event Production), Roberta De Martino (Lead Cultural Curator)
- Operations: 24/7 on-island emergency ground dispatch and representation
- Mottos: "From Capri for Capri" | "Your Roots in Capri"
- Headquarters: 80076 Capri, Metropolitan City of Naples, Campania, Italy
- Contact: partnerships@capridmc.com | +39 333 594 3947
- Official Website: https://www.capridmc.com/
- Appointment Booking: https://www.capridmc.com/contact-us-capri-destination-management-company/

## Exclusive Solutions (Core Logistics & Maritime)
${services.filter(s => s.cluster === 'Exclusive Solutions').map(s => `- [${s.title}](https://www.capridmc.com/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Custom Experiences (Heritage, Gastronomy & Lifestyle)
${services.filter(s => s.cluster === 'Custom Experiences').map(s => `- [${s.title}](https://www.capridmc.com/#services): ${s.subtitle}. ${s.description}`).join('\n')}

## Destinations Served
- [Capri](https://www.capridmc.com/): Marina Grande, Marina Piccola, Capri center, Piazzetta, Faraglioni coast.
- [Anacapri](https://www.capridmc.com/): Mount Solaro, Damecuta, Punta Carena lighthouse, cliffside villas.
- [Amalfi Coast & Gulf of Naples](https://www.capridmc.com/): Positano, Amalfi, Ravello, Li Galli, Nerano, Naples, Sorrento.

## B2B Advisor Privileges
- Commission Integrity: Protected commissions and transparent net pricing structures.
- White-Label Protocol: On request, all personnel operate seamlessly under your agency's brand identity.
- 24/7 Island Command: Zero time-zone latency for global luxury travel designers.

## Optional & Mirrors
- [llms-full.txt](https://www.capridmc.com/llms-full.txt): Complete unedited text dossier of all services, logistics, and company specifications.
- [ai-context.txt](https://www.capridmc.com/ai-context.txt): Machine-readable Generative Engine Optimization (GEO) context file.
- [index.md](https://www.capridmc.com/index.md): Clean markdown mirror of the primary landing page.
`;

fs.writeFileSync('public/llms.txt', llmsContent, 'utf8');

// 2. Generate public/llms-full.txt
const llmsFullContent = `# Capri Destination Management Company (Capri DMC) — Complete B2B Dossier

## Overview & Profile
- Name: Capri Destination Management Company (Capri DMC)
- Legal Lineage: Spin-off from Nesea Capri Tours & Events (operating on Capri since 2010)
- Corporate Structure: Women-Owned Enterprise
- Founding Team:
  - Giusy Perrotta: Co-Founder & Director of Operations
  - Melania Esposito: Co-Founder & Head of Event Production
  - Roberta De Martino: Co-Founder & Lead Cultural Curator
- Location: 80076 Capri, Metropolitan City of Naples, Campania, Italy (40.5507° N, 14.2426° E)
- Hours: 24 Hours a day, 7 days a week (24/7 Island Operations)
- Primary Email: partnerships@capridmc.com
- 24/7 Advisor Phone: +39 333 594 3947
- Official Website: https://www.capridmc.com/
- Direct Appointment Booking: https://www.capridmc.com/contact-us-capri-destination-management-company/

## Mottos & Core Mission
- "From Capri for Capri"
- "Your Roots in Capri"

Capri DMC was engineered specifically to solve the friction and opacity global luxury travel advisors experience when planning trips to Capri. By remaining 100% on-island and native, we eliminate third-party markups, mainland disconnects, and time-zone communication delays.

## Detailed Service Catalog

${services.map((s, i) => `### ${i + 1}. ${s.title}
- Cluster: ${s.cluster}
- Subtitle: ${s.subtitle}
- B2B Benefit: ${s.b2b_tag}
- Category Badge: ${s.badge}
- Description: ${s.description}
- Key B2B Features:
${s.b2b_features.map(f => `  * ${f}`).join('\n')}
`).join('\n')}

## VIP Logistics Architecture: From Airport to 5★ Suite
1. Tarmac VIP Meet & Greet: Personal hostess escort at aircraft gate at Naples Capodichino (NAP) or Rome Fiumicino (FCO), fast-track luggage retrieval, private Mercedes-Maybach limousine transfer to marina or helipad.
2. Private Maritime Crossing: Direct private Riva speedboat crossing or chartered helicopter flight directly to Capri Damecuta helipad, bypassing public ferry queues.
3. Luggage Porterage & Island Taxi: Dedicated porters transfer bags directly at the dock while guests enter iconic open-top convertible Capri taxis.
4. Direct-to-Suite Room Placement: Luggage delivered inside 5-star hotel suites prior to guest arrival with zero lobby waiting.

## B2B Travel Advisor Advantages
- 100% On-Island Team with direct municipal port, hotelier, and maritime authority permits.
- Protected commission structures and transparent wholesale net rates.
- Strict white-label client representation upon request.
- Instant emergency escalation and 24/7 WhatsApp dispatch line.
`;

fs.writeFileSync('public/llms-full.txt', llmsFullContent, 'utf8');

// 3. Generate public/index.md (Markdown mirror of the homepage)
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
- Official Website: https://www.capridmc.com/
- Schedule B2B Appointment: https://www.capridmc.com/contact-us-capri-destination-management-company/
`;

fs.writeFileSync('public/index.md', indexMdContent, 'utf8');

console.log('Successfully generated public/llms.txt, public/llms-full.txt, and public/index.md');
