import sharp from 'sharp';

async function cleanLizard() {
  console.log("Cleaning background shadows from HD lizard...");
  const img = sharp('public/images/capri-blue-lizard-hd.png');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      if (data[idx + 3] === 0) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      const minC = Math.min(r, g, b);
      const maxC = Math.max(r, g, b);
      const diff = maxC - minC;

      // 1. Fully white / very light grey
      if (minC > 215) {
        data[idx + 3] = 0;
      }
      // 2. Neutral grey shadow (the studio drop shadow under belly and between legs)
      else if (minC > 110 && diff < 38) {
        // Linear fade between minC 110 and 150
        if (minC > 145) {
          data[idx + 3] = 0;
        } else {
          const factor = (145 - minC) / 35;
          data[idx + 3] = Math.round(a * Math.pow(factor, 1.5));
        }
      }
      // 3. Faint shadow halo
      else if (minC > 95 && diff < 25) {
        const factor = (120 - minC) / 25;
        data[idx + 3] = Math.max(0, Math.round(a * Math.pow(factor, 2)));
      }
    }
  }

  await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile('public/images/capri-blue-lizard-clean.png');

  console.log("Saved clean HD lizard without shadows to public/images/capri-blue-lizard-clean.png");
}

cleanLizard().catch(console.error);
