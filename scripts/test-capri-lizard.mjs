import { chromium } from 'playwright';
import fs from 'fs';

const screenshotDir = '/Users/pep/.gemini/antigravity/brain/6750deec-4231-4a2e-b4e2-f9d539d2a22b/scratch';
fs.mkdirSync(screenshotDir, { recursive: true });

async function testLizard() {
  console.log("Launching Chrome for Ultra-HD Capri Lizard verification...");
  const browser = await chromium.launch({ channel: 'chrome' });

  // 1. Desktop Test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check lizard container
  const lizard = page.locator('#capri-lizard-container');
  await lizard.waitFor({ state: 'visible' });
  console.log("Lizard container found and visible!");

  // Screenshot 1: Desktop Initial Perch
  await page.screenshot({ path: `${screenshotDir}/lizard-1-desktop-initial.png` });
  console.log("Saved: lizard-1-desktop-initial.png");

  // 2. Scroll Down Simulation (Active Sinuous Crawl)
  console.log("Scrolling down to trigger crawling gait...");
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 120));
    await page.waitForTimeout(50);
  }

  // Screenshot 2: Mid-scroll Crawling
  await page.screenshot({ path: `${screenshotDir}/lizard-2-crawling.png` });
  console.log("Saved: lizard-2-crawling.png");

  // Check transform position
  const midY = await page.evaluate(() => {
    const el = document.getElementById('capri-lizard-container');
    return el.style.transform;
  });
  console.log(`Lizard vertical position mid-scroll: ${midY}`);

  // 3. Stop scrolling & wait for Idle State (450ms debounce + 240ms head turn + 200ms tongue reach)
  console.log("Stopping scroll to trigger Idle State (head turn & hissing tongue flick)...");
  await page.waitForTimeout(850);

  // Close-up crop of lizard during idle tongue flick
  await lizard.screenshot({ path: `${screenshotDir}/lizard-closeup-tongue.png` });
  console.log("Saved: lizard-closeup-tongue.png");

  // Screenshot 3: Idle State (Head turned towards page content + visible tongue)
  await page.screenshot({ path: `${screenshotDir}/lizard-3-idle-look.png` });
  console.log("Saved: lizard-3-idle-look.png");

  // 4. Mobile Test (390 x 844)
  console.log("Testing mobile viewport (390x844)...");
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(900);

  // Screenshot 4: Mobile Perch
  await mobilePage.screenshot({ path: `${screenshotDir}/lizard-4-mobile.png` });
  console.log("Saved: lizard-4-mobile.png");

  await browser.close();
  console.log("Ultra-HD Capri Lizard test completed successfully!");
}

testLizard().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
