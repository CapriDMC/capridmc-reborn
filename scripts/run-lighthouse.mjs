import fs from 'fs';
import path from 'path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const url = process.argv[2] || 'http://localhost:4321';
const prefix = process.argv[3] || 'baseline';

async function runAudit(preset) {
  const chrome = await chromeLauncher.launch({
    chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
    preset: preset === 'desktop' ? 'desktop' : undefined
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  const reportJson = runnerResult.report;
  const lhr = runnerResult.lhr;

  const outPath = path.join('docs', `lighthouse-${prefix}-${preset}.json`);
  fs.writeFileSync(outPath, reportJson);

  const scores = {
    performance: Math.round((lhr.categories.performance?.score || 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
    seo: Math.round((lhr.categories.seo?.score || 0) * 100)
  };

  console.log(`[${prefix.toUpperCase()} - ${preset.toUpperCase()}] Scores:`, JSON.stringify(scores));
  return scores;
}

async function main() {
  fs.mkdirSync('docs', { recursive: true });
  console.log(`Running Lighthouse audits for ${url}...`);
  const desktop = await runAudit('desktop');
  const mobile = await runAudit('mobile');

  const summary = {
    url,
    timestamp: new Date().toISOString(),
    desktop,
    mobile
  };

  fs.writeFileSync(path.join('docs', `lighthouse-${prefix}-summary.json`), JSON.stringify(summary, null, 2));
  console.log('Lighthouse summary saved.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
