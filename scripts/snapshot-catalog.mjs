// Saves the live catalog to public/catalog-snapshot.json before each build. Netlify
// serves it from its CDN, so a first-time visitor sees products straight away even
// while Render's free plan is waking the backend (~25s). The live API replaces it
// once it answers. A failed fetch never fails the build: the site falls back to
// waiting for the API, as before.
import { readFile, writeFile } from "node:fs/promises";

// Same API address the build uses: the environment (Netlify's settings), else the
// production env file used for local `npm run deploy` builds.
async function apiFromEnvFile() {
  for (const name of [".env.production.local", ".env.production"]) {
    try {
      const text = await readFile(new URL(`../${name}`, import.meta.url), "utf8");
      const match = text.match(/^REACT_APP_API_BASE_URL=(.*)$/m);
      if (match) return match[1].trim();
    } catch {
      // No such file.
    }
  }
  return "";
}

const apiBase = process.env.REACT_APP_API_BASE_URL || (await apiFromEnvFile());
const target = new URL("../public/catalog-snapshot.json", import.meta.url);

if (!apiBase || /localhost|127\.0\.0\.1/.test(apiBase)) {
  console.log("catalog snapshot: skipped (no hosted API configured)");
  process.exit(0);
}

try {
  // Long timeout: this request may be the one that wakes the backend.
  const res = await fetch(`${apiBase}/api/products`, { signal: AbortSignal.timeout(90000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const products = await res.json();
  if (!Array.isArray(products) || !products.length) throw new Error("empty catalog");
  await writeFile(target, JSON.stringify({ savedAt: Date.now(), products }));
  console.log(`catalog snapshot: saved ${products.length} products`);
} catch (error) {
  console.warn(`catalog snapshot: skipped (${error.message})`);
}
