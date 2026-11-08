import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateFavicons() {
  const sourceImage = 'public/logo.png';
  if (!fs.existsSync(sourceImage)) {
    console.error('Source logo.png not found!');
    return;
  }

  console.log('Generating high-resolution Capri DMC favicons and touch icons...');

  // 1. Generate PNG variants
  const sizes = [
    { name: 'public/favicon-16x16.png', size: 16 },
    { name: 'public/favicon-32x32.png', size: 32 },
    { name: 'public/favicon-48x48.png', size: 48 },
    { name: 'public/apple-touch-icon.png', size: 180 },
    { name: 'public/android-chrome-192x192.png', size: 192 },
    { name: 'public/android-chrome-512x512.png', size: 512 },
  ];

  const pngBuffers = {};
  for (const item of sizes) {
    const buffer = await sharp(sourceImage)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    fs.writeFileSync(item.name, buffer);
    pngBuffers[item.size] = buffer;
    console.log(`✓ Generated ${item.name} (${item.size}x${item.size})`);
  }

  // 2. Generate multi-resolution ICO file (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const count = icoSizes.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // Count

  const entries = [];
  const imageBuffers = [];

  for (const s of icoSizes) {
    const buf = pngBuffers[s];
    imageBuffers.push(buf);

    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(s === 256 ? 0 : s, 0); // Width
    entry.writeUInt8(s === 256 ? 0 : s, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset
    entries.push(entry);

    offset += buf.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...imageBuffers]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log(`✓ Generated public/favicon.ico (${icoBuffer.length} bytes, containing 16x16, 32x32, 48x48)`);

  // 3. Generate vector/embedded SVG favicon
  // Convert 192px PNG to base64 for crisp embedding in SVG
  const base64Png = pngBuffers[192].toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="100%" height="100%">
  <defs>
    <clipPath id="circleClip">
      <circle cx="96" cy="96" r="92" />
    </clipPath>
  </defs>
  <circle cx="96" cy="96" r="94" fill="#07142E" stroke="#D4AF37" stroke-width="3" />
  <image href="data:image/png;base64,${base64Png}" width="192" height="192" clip-path="url(#circleClip)" />
</svg>`;
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
  console.log(`✓ Generated public/favicon.svg (embedded Capri DMC Crest with luxury brand circle)`);

  console.log('All Capri DMC favicons generated successfully!');
}

generateFavicons().catch(console.error);
