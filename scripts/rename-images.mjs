import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const imageDir = path.join(process.cwd(), 'public/images/capri');

const renameMap = {
  '.jpeg.jpg': 'capri-faraglioni-aerial-coastline.jpg',
  'anacapri-damecuta-anacapri-guided-tours.jpg': 'anacapri-damecuta-guided-tours.jpg',
  'anacapri-faro-aperitivo.jpg': 'anacapri-faro-sunset-aperitivo.jpg',
  'anacapri-faro-punta-carena-guided-tours.jpg': 'anacapri-punta-carena-guided-tours.jpg',
  'anacapri-lighthouse-2.jpg': 'anacapri-lighthouse-cliffside.jpg',
  'circular-logo.png': 'capri-dmc-circular-logo.png',
  'concierge-service.jpg': 'capri-concierge-service.jpg',
  'exclusive-boat-tours.jpeg.jpg': 'capri-exclusive-boat-tours-cove.jpg',
  'exclusive-boat-tours.jpg': 'capri-exclusive-boat-charter.jpg',
  'exclusive-events.jpg': 'capri-exclusive-events.jpg',
  'exclusive-solutions.jpg': 'capri-exclusive-solutions.jpg',
  'faraglioni-boat-tours.jpeg.jpg': 'capri-faraglioni-boat-tours.jpg',
  'faraglioni-capri-faraglioni.jpg': 'faraglioni-capri-seascape.jpg',
  'faraglioni-faraglioni-rocks.jpg': 'capri-faraglioni-rocks.jpg',
  'faraglioni-guided-tours-exclusive.jpeg.jpg': 'faraglioni-guided-tours-exclusive.jpg',
  'faraglioni-rocks-guided-tour-private-boat-capri.jpg': 'faraglioni-rocks-guided-tour-private-boat.jpg',
  'guided-tours.jpg': 'capri-guided-cultural-tours.jpg',
  'hiking-capri.jpg': 'capri-hiking-nature-trail.jpg',
  'hiking-in-capri-anacapri.jpeg.jpg': 'hiking-in-capri-anacapri.jpg',
  'hiking-in-capri-guided.jpeg.jpg': 'hiking-in-capri-guided.jpg',
  'mount-solaro-hiking.jpeg.jpg': 'capri-mount-solaro-hiking.jpg',
  'private-boat-tours-exclusive.jpeg.jpg': 'private-boat-tours-exclusive.jpg',
  'private-boat-tours-in-capri.jpeg.jpg': 'capri-private-boat-tours.jpg',
  'private-guided-tours-in-capri-.jpeg.jpg': 'private-guided-tours-in-capri.jpg',
  'private-guided-tours.jpeg.jpg': 'capri-private-guided-tours.jpg',
  'private-guided-tours.jpg': 'capri-private-historical-tours.jpg',
  'private-shopper.jpeg.jpg': 'capri-artisanal-sandals-shopper.jpg',
  'private-tour-in-capri-anacapri-mount-solaro.jpeg.jpg': 'private-tour-anacapri-mount-solaro.jpg',
  'seaview-boat-tour-beautiful.jpg': 'capri-seaview-boat-tour.jpg',
  'seaview.jpg': 'capri-panoramic-seaview.jpg',
  'solo-tour.jpg': 'capri-family-concierge-care.jpg',
  'sunrise.jpg': 'capri-faraglioni-sunrise.jpg',
  'sunset.jpg': 'capri-mediterranean-sunset.jpg',
  'sunsets.jpg': 'capri-punta-carena-sunsets.jpg',
  'villa-lysis-tour-private-tour-capri.jpeg.jpg': 'capri-villa-lysis-private-tour.jpg',
  'wedding-in-capri.jpeg.jpg': 'capri-luxury-wedding-celebration.jpg',
  'wedding.jpg': 'capri-historic-villa-wedding.jpg'
};

function getSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

const csvRows = ['old_file,new_file,sha256'];
const redirects = [];

for (const [oldName, newName] of Object.entries(renameMap)) {
  const oldPath = path.join(imageDir, oldName);
  if (!fs.existsSync(oldPath)) {
    console.warn(`File not found: ${oldPath}`);
    continue;
  }
  const oldHash = getSha256(oldPath);
  const newPath = path.join(imageDir, newName);

  if (oldName !== newName) {
    execSync(`git mv "public/images/capri/${oldName}" "public/images/capri/${newName}"`, { stdio: 'inherit' });
    const newHash = getSha256(newPath);
    if (oldHash !== newHash) {
      throw new Error(`Hash mismatch for ${oldName} -> ${newName}! ${oldHash} vs ${newHash}`);
    }
  }

  csvRows.push(`${oldName},${newName},${oldHash}`);
  redirects.push(`/images/capri/${oldName} /images/capri/${newName} 301`);
}

// Add files that were already clean
const allFiles = fs.readdirSync(imageDir);
for (const f of allFiles) {
  if (!renameMap[f] && !Object.values(renameMap).includes(f)) {
    const fPath = path.join(imageDir, f);
    if (fs.statSync(fPath).isFile()) {
      const h = getSha256(fPath);
      csvRows.push(`${f},${f},${h}`);
    }
  }
}

fs.writeFileSync('docs/image-rename-map.csv', csvRows.join('\n') + '\n');
console.log('Saved docs/image-rename-map.csv');

// Update references in src/
const targetExtensions = ['.astro', '.json', '.txt', '.md', '.css'];
function updateRefs(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== 'dist') updateRefs(full);
    } else if (targetExtensions.some(ext => item.endsWith(ext))) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [oldName, newName] of Object.entries(renameMap)) {
        if (oldName !== newName && content.includes(oldName)) {
          content = content.replaceAll(oldName, newName);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated references in: ${path.relative(process.cwd(), full)}`);
      }
    }
  }
}

updateRefs(path.join(process.cwd(), 'src'));
updateRefs(path.join(process.cwd(), 'public'));
if (fs.existsSync('ai-context.txt')) {
  let content = fs.readFileSync('ai-context.txt', 'utf8');
  for (const [oldName, newName] of Object.entries(renameMap)) {
    if (oldName !== newName && content.includes(oldName)) {
      content = content.replaceAll(oldName, newName);
    }
  }
  fs.writeFileSync('ai-context.txt', content, 'utf8');
}

console.log('All image references updated cleanly.');
