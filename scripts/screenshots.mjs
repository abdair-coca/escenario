// npm run screenshots <slug>
// Opens every step of a presentation in recording mode, jumping straight to it, saves a PNG
// in screenshots/<slug>/ and runs the automatic checks (text >= 40 px, 90% safe area).
import { mkdir, rm, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startStaticServer } from "./lib/static-server.mjs";
import { launchBrowser, openPlayer, settle } from "./lib/browser.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run screenshots <slug>");
  process.exit(2);
}
try {
  await access(join(ROOT, "presentations", slug, "presentation.json"));
} catch {
  console.error(`presentations/${slug}/presentation.json does not exist`);
  process.exit(2);
}

const outDir = join(ROOT, "screenshots", slug);
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const server = await startStaticServer(ROOT);
const browser = await launchBrowser();
let failed = false;
try {
  const { page, pageErrors } = await openPlayer(browser, server.origin, { slug });
  const playerErrors = await page.evaluate(() => window.escenario.errors);
  if (playerErrors.length) throw new Error(`Player errors:\n- ${playerErrors.join("\n- ")}`);

  const report = [];
  const outline = await page.evaluate(() => window.escenario.outline());
  for (const [sceneIndex, scene] of outline.entries()) {
    for (const [stepIndex, label] of scene.steps.entries()) {
      await page.evaluate((position) => window.escenario.goTo(position), { scene: sceneIndex, step: stepIndex });
      await settle(page);
      const file = `s${pad(sceneIndex + 1)}-k${pad(stepIndex + 1)}-${scene.id}-${label}.png`;
      await page.screenshot({ path: join(outDir, file) });
      const issues = await page.evaluate(() => window.escenario.audit());
      report.push({ file, scene: scene.title, step: label, issues });
      console.log(`${issues.length ? "✗" : "✓"} ${file}${issues.length ? `  (${issues.length} issues)` : ""}`);
    }
  }

  const errors = [...pageErrors, ...(await page.evaluate(() => window.escenario.errors))];
  await writeFile(join(outDir, "audit.json"), JSON.stringify({ slug, errors, steps: report }, null, 2));
  const issueCount = report.reduce((sum, step) => sum + step.issues.length, 0);
  failed = issueCount > 0 || errors.length > 0;
  console.log(`\n${report.length} screenshots in screenshots/${slug}/ · ${issueCount} audit issues · ${errors.length} errors`);
  if (failed) console.log(`Details: screenshots/${slug}/audit.json`);
} catch (error) {
  failed = true;
  console.error(error.message);
} finally {
  await browser.close();
  await server.close();
}
process.exit(failed ? 1 : 0);

function pad(number) {
  return String(number).padStart(2, "0");
}
