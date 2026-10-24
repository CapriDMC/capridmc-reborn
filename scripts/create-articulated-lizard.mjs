import fs from 'fs';
import { chromium } from 'playwright';

async function createArticulatedLizard() {
  console.log("Generating clean articulated lizard components with smooth socket overlap...");
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();

  const sourceImgPath = '/Users/pep/capridmc/capridmc-reborn/public/images/capri-blue-lizard-clean.png';
  const imgBase64 = fs.readFileSync(sourceImgPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c"></canvas>
      <script>
        async function run(base64) {
          const img = new Image();
          img.src = 'data:image/png;base64,' + base64;
          await new Promise(r => img.onload = r);

          const W = img.width;  // 478
          const H = img.height; // 1130

          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');

          function getPng(w, h, drawFn) {
            canvas.width = w;
            canvas.height = h;
            ctx.clearRect(0, 0, w, h);
            drawFn(ctx);
            return canvas.toDataURL('image/png').replace(/^data:image\\/png;base64,/, '');
          }

          // 1. FRONT LEFT LEG (FL)
          // Bounding box: x: 40..230, y: 840..1035 (W: 190, H: 195)
          // Shoulder pivot in full image: (180, 925) -> relative: (140, 85)
          const flBBox = { x: 40, y: 840, w: 190, h: 195, pivotX: 140, pivotY: 85 };
          const flPng = getPng(flBBox.w, flBBox.h, (c) => {
            c.save();
            c.beginPath();
            // Rounded socket cap centered on pivot (radius 48)
            c.arc(flBBox.pivotX, flBBox.pivotY, 48, -Math.PI * 0.5, Math.PI * 0.5, false);
            c.lineTo(0, flBBox.h);
            c.lineTo(0, 0);
            c.closePath();
            c.clip();
            c.drawImage(img, -flBBox.x, -flBBox.y);
            c.restore();
          });

          // 2. FRONT RIGHT LEG (FR)
          // Bounding box: x: 248..438, y: 840..1035 (W: 190, H: 195)
          // Shoulder pivot in full image: (298, 925) -> relative: (50, 85)
          const frBBox = { x: 248, y: 840, w: 190, h: 195, pivotX: 50, pivotY: 85 };
          const frPng = getPng(frBBox.w, frBBox.h, (c) => {
            c.save();
            c.beginPath();
            // Rounded socket cap centered on pivot (radius 48)
            c.arc(frBBox.pivotX, frBBox.pivotY, 48, Math.PI * 0.5, Math.PI * 1.5, false);
            c.lineTo(frBBox.w, 0);
            c.lineTo(frBBox.w, frBBox.h);
            c.closePath();
            c.clip();
            c.drawImage(img, -frBBox.x, -frBBox.y);
            c.restore();
          });

          // 3. REAR LEFT LEG (RL)
          // Bounding box: x: 10..235, y: 510..735 (W: 225, H: 225)
          // Hip pivot in full image: (185, 650) -> relative: (175, 140)
          const rlBBox = { x: 10, y: 510, w: 225, h: 225, pivotX: 175, pivotY: 140 };
          const rlPng = getPng(rlBBox.w, rlBBox.h, (c) => {
            c.save();
            c.beginPath();
            // Rounded socket cap (radius 50)
            c.arc(rlBBox.pivotX, rlBBox.pivotY, 50, -Math.PI * 0.5, Math.PI * 0.5, false);
            c.lineTo(0, rlBBox.h);
            c.lineTo(0, 0);
            c.closePath();
            c.clip();
            c.drawImage(img, -rlBBox.x, -rlBBox.y);
            c.restore();
          });

          // 4. REAR RIGHT LEG (RR)
          // Bounding box: x: 240..465, y: 510..735 (W: 225, H: 225)
          // Hip pivot in full image: (290, 650) -> relative: (50, 140)
          const rrBBox = { x: 240, y: 510, w: 225, h: 225, pivotX: 50, pivotY: 140 };
          const rrPng = getPng(rrBBox.w, rrBBox.h, (c) => {
            c.save();
            c.beginPath();
            // Rounded socket cap (radius 50)
            c.arc(rrBBox.pivotX, rrBBox.pivotY, 50, Math.PI * 0.5, Math.PI * 1.5, false);
            c.lineTo(rrBBox.w, 0);
            c.lineTo(rrBBox.w, rrBBox.h);
            c.closePath();
            c.clip();
            c.drawImage(img, -rrBBox.x, -rrBBox.y);
            c.restore();
          });

          // 5. BODY (Smooth, continuous flank contours)
          const bodyPng = getPng(W, H, (c) => {
            c.save();
            c.beginPath();
            c.moveTo(239, 0);
            // Down left tail
            c.lineTo(218, 480);
            // Smooth pelvis
            c.bezierCurveTo(198, 540, 186, 610, 184, 650);
            c.bezierCurveTo(182, 700, 178, 760, 180, 830);
            // Smooth shoulder
            c.bezierCurveTo(180, 880, 178, 925, 182, 960);
            // Head & Snout
            c.bezierCurveTo(186, 1000, 200, 1070, 238, 1130);
            // Right Head
            c.bezierCurveTo(276, 1070, 290, 1000, 294, 960);
            // Right Shoulder
            c.bezierCurveTo(298, 925, 298, 880, 298, 830);
            // Right Torso & Pelvis
            c.bezierCurveTo(298, 760, 294, 700, 292, 650);
            c.bezierCurveTo(290, 610, 278, 540, 258, 480);
            // Up right tail
            c.lineTo(239, 0);
            c.closePath();
            c.clip();
            c.drawImage(img, 0, 0);
            c.restore();
          });

          return {
            fl: { b64: flPng, bbox: flBBox },
            fr: { b64: frPng, bbox: frBBox },
            rl: { b64: rlPng, bbox: rlBBox },
            rr: { b64: rrPng, bbox: rrBBox },
            body: { b64: bodyPng }
          };
        }
      </script>
    </body>
    </html>
  `);

  const results = await page.evaluate(async (b64) => {
    return await window.run(b64);
  }, imgBase64);

  fs.writeFileSync('public/images/lizard-leg-fl.png', Buffer.from(results.fl.b64, 'base64'));
  fs.writeFileSync('public/images/lizard-leg-fr.png', Buffer.from(results.fr.b64, 'base64'));
  fs.writeFileSync('public/images/lizard-leg-rl.png', Buffer.from(results.rl.b64, 'base64'));
  fs.writeFileSync('public/images/lizard-leg-rr.png', Buffer.from(results.rr.b64, 'base64'));
  fs.writeFileSync('public/images/lizard-body.png', Buffer.from(results.body.b64, 'base64'));

  fs.writeFileSync('scratch/lizard-rig-metadata.json', JSON.stringify({
    fl: results.fl.bbox,
    fr: results.fr.bbox,
    rl: results.rl.bbox,
    rr: results.rr.bbox,
  }, null, 2));

  console.log("Successfully generated clean articulated lizard components!");
  await browser.close();
}

createArticulatedLizard().catch(e => {
  console.error(e);
  process.exit(1);
});
