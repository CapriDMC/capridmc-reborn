import { chromium } from 'playwright';
import fs from 'fs';

const screenshotDir = '/Users/pep/.gemini/antigravity/brain/6750deec-4231-4a2e-b4e2-f9d539d2a22b/scratch';
fs.mkdirSync(screenshotDir, { recursive: true });

async function testLizard() {
  console.log("Launching Chrome for Articulated Capri Lizard verification...");
  const browser = await chromium.launch({ channel: 'chrome' });

  // 1. Desktop Test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check lizard container
  const lizard = page.locator('#capri-lizard-container');
  await lizard.waitFor({ state: 'visible' });
  console.log("Lizard container found and visible!");

  // Screenshot 1: Resting stance
  await page.screenshot({ path: `${screenshotDir}/lizard-1-desktop-initial.png` });
  console.log("Saved: lizard-1-desktop-initial.png");

  // 2. Active crawling scroll simulation
  console.log("Scrolling to trigger active trotting gait...");
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(40);
  }
  // Capture stride A
  await page.screenshot({ path: `${screenshotDir}/lizard-stride-a.png` });
  console.log("Saved: lizard-stride-a.png");

  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 80));
    await page.waitForTimeout(40);
  }
  // Capture stride B
  await page.screenshot({ path: `${screenshotDir}/lizard-stride-b.png` });
  console.log("Saved: lizard-stride-b.png");

  // 3. Stop scrolling & trigger Idle State (400ms debounce + 220ms delay + 120ms tongue flick)
  console.log("Triggering final scroll stop to capture delicate sibilant tongue in idle state...");
  await page.evaluate(() => window.scrollBy(0, 40)); // Final scroll nudge
  await page.waitForTimeout(700); // Wait for debounce (400ms) + delay (220ms) + dart out (80ms)

  // Close-up crop of lizard during delicate tongue flick
  await lizard.screenshot({ path: `${screenshotDir}/lizard-closeup-tongue.png` });
  console.log("Saved: lizard-closeup-tongue.png");

  // Screenshot 3: Full Page Idle State
  await page.screenshot({ path: `${screenshotDir}/lizard-3-idle-look.png` });
  console.log("Saved: lizard-3-idle-look.png");

  // 4. Mobile Test (390 x 844)
  console.log("Testing mobile viewport (390x844)...");
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(900);

  await mobilePage.screenshot({ path: `${screenshotDir}/lizard-4-mobile.png` });
  console.log("Saved: lizard-4-mobile.png");

  console.log("Articulated Capri Lizard verification completed successfully!");
  await browser.close();
}

testLizard().catch(e => {
  console.error("Test failed:", e);
  process.exit(1);
});
