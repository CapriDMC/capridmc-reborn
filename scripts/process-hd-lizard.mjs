import fs from 'fs';
import { chromium } from 'playwright';

async function processImage() {
  console.log("Processing pixel-perfect cropped HD lizard with Playwright / Chrome Canvas...");
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();

  const imgPath = '/Users/pep/.gemini/antigravity/brain/6750deec-4231-4a2e-b4e2-f9d539d2a22b/blue_lizard_capri_dorsal_1792845754656.jpg';
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c"></canvas>
      <script>
        async function run(base64) {
          const img = new Image();
          img.src = 'data:image/jpeg;base64,' + base64;
          await new Promise(r => img.onload = r);

          // In original JPEG:
          // minX: 200, maxX: 647, minY: 101 (snout), maxY: 1218 (tail)
          // We crop with 15px padding around claws:
          const srcX = 185;
          const srcY = 95;
          const srcW = 478; // 185 to 663
          const srcH = 1130; // 95 to 1225

          const canvas = document.getElementById('c');
          canvas.width = srcW;
          canvas.height = srcH;
          const ctx = canvas.getContext('2d');

          // Draw flipped vertically so head is at the bottom, tail at the top
          ctx.save();
          ctx.translate(0, srcH);
          ctx.scale(1, -1);
          // Draw from original bounding rect
          ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
          ctx.restore();

          // Background removal with anti-aliased edge feathering
          const imgData = ctx.getImageData(0, 0, srcW, srcH);
          const d = imgData.data;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i+1];
            const b = d[i+2];

            const whiteness = Math.min(r, g, b);

            if (whiteness > 245) {
              d[i+3] = 0;
            } else if (whiteness > 215) {
              const alpha = (245 - whiteness) / (245 - 215);
              d[i+3] = Math.round(d[i+3] * Math.pow(alpha, 1.25));
            }
          }

          ctx.putImageData(imgData, 0, 0);
          return canvas.toDataURL('image/png');
        }
      </script>
    </body>
    </html>
  `);

  const pngDataUrl = await page.evaluate(async (b64) => {
    return await window.run(b64);
  }, imgBase64);

  const pngBase64 = pngDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('/Users/pep/capridmc/capridmc-reborn/public/images/capri-blue-lizard-hd.png', Buffer.from(pngBase64, 'base64'));
  console.log("Saved pixel-perfect cropped HD lizard to public/images/capri-blue-lizard-hd.png");

  await browser.close();
}

processImage().catch(e => {
  console.error(e);
  process.exit(1);
});
