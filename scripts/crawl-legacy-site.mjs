import fs from 'fs';
import path from 'path';

const urls = [
  'https://www.capridmc.com/',
  'https://www.capridmc.com/your-team-in-capri/',
  'https://www.capridmc.com/transfers-check-in-and-ticketing-services/',
  'https://www.capridmc.com/destination-management-company-capri-nesea/',
  'https://www.capridmc.com/events-capri-destination-management-company/',
  'https://www.capridmc.com/contact-us-capri-destination-management-company/',
  'https://www.capridmc.com/conciergerie-capri-destination-management-company/',
  'https://www.capridmc.com/cooking-classes-capri-destination-management-company/',
  'https://www.capridmc.com/custom-experiences-capri-destination-management-company/',
  'https://www.capridmc.com/exclusive-solutions-capri-destination-management-company/',
  'https://www.capridmc.com/let-us-show-you-capri-destination-management-company-capri/',
  'https://www.capridmc.com/personal-shopper-service-capri-destination-management-company/',
  'https://www.capridmc.com/capri-private-boat-tours-capri-destination-management-company/',
  'https://www.capridmc.com/exclusive-guided-tours-with-capri-destination-management-company/',
  'https://www.capridmc.com/babysitting-and-dogsitting-in-capri-capri-destination-management-company/',
  'https://www.capridmc.com/personal-trainer-and-sport-activities-capri-destination-management-company/',
  'https://www.capridmc.com/artisanal-sandals-knitwear-and-textiless-capri-destination-management-company/',
  'https://www.capridmc.com/capri-destination-management-company-hiking-in-capri-hidden-routes-of-excursion/'
];

function cleanCsv(str) {
  if (!str) return '""';
  const cleaned = str.replace(/"/g, '""').replace(/[\r\n]+/g, ' ').trim();
  return `"${cleaned}"`;
}

async function crawl() {
  console.log(`Crawling ${urls.length} legacy URLs from live www.capridmc.com...`);
  const results = [];
  const allImages = new Set();

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();

      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
      const desc = descMatch ? descMatch[1].trim() : '';

      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

      const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
      const canon = canonMatch ? canonMatch[1].trim() : '';

      const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/gi)];
      const pageImages = imgMatches.map(m => `${m[1]} (alt: ${m[2]})`).join('; ');

      for (const m of imgMatches) {
        allImages.add(JSON.stringify({ src: m[1], alt: m[2] }));
      }

      results.push({
        url,
        status: res.status,
        title,
        desc,
        h1,
        canon,
        images: pageImages
      });

      console.log(`[${res.status}] ${url} | Title: ${title.slice(0, 40)}...`);
    } catch (e) {
      console.error(`Error crawling ${url}:`, e.message);
      results.push({
        url,
        status: 'ERROR',
        title: '',
        desc: '',
        h1: '',
        canon: '',
        images: ''
      });
    }
  }

  // Write CSV
  const csvHeader = 'url,status,title,meta_description,h1,canonical,images';
  const csvRows = results.map(r => 
    `${cleanCsv(r.url)},${r.status},${cleanCsv(r.title)},${cleanCsv(r.desc)},${cleanCsv(r.h1)},${cleanCsv(r.canon)},${cleanCsv(r.images)}`
  );

  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/legacy-url-inventory.csv', [csvHeader, ...csvRows].join('\n') + '\n', 'utf8');
  console.log(`Saved docs/legacy-url-inventory.csv with ${results.length} URLs`);

  // Write legacy images inventory
  const imgList = Array.from(allImages).map(s => JSON.parse(s));
  const imgCsvHeader = 'legacy_image_url,alt';
  const imgCsvRows = imgList.map(i => `${cleanCsv(i.src)},${cleanCsv(i.alt)}`);
  fs.writeFileSync('docs/legacy-image-inventory.csv', [imgCsvHeader, ...imgCsvRows].join('\n') + '\n', 'utf8');
  console.log(`Saved docs/legacy-image-inventory.csv with ${imgList.length} legacy images`);
}

crawl().catch(err => {
  console.error(err);
  process.exit(1);
});
