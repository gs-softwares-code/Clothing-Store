/**
 * Captures QA screenshots of key pages at desktop + mobile widths.
 * Usage: node scripts/screenshots.mjs [baseURL]
 * Requires a running server (e.g. `npx next start -p 3315`).
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3315";
const OUT = "test-results/screenshots";

const routes = [
  ["home", "/"],
  ["women", "/women"],
  ["plp-sub", "/men/t-shirts"],
  ["pdp", "/product/relaxed-boxy-cotton-tee"],
  ["collections", "/collections"],
  ["checkout", "/checkout"],
  ["showcase", "/showcase"],
];

const browser = await chromium.launch();
for (const [name, path] of routes) {
  for (const [label, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${label}-${name}.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
console.log("Screenshots written to", OUT);
