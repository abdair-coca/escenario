// Opens the player in Chrome (or Playwright's Chromium as a fallback) at 1920x1080.
import { chromium } from "playwright";
import { formatUrlState } from "../../player/src/shared/url-state.js";

export async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

export async function openPlayer(browser, origin, { slug, scene = 0, step = 0, mode = "record" }) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => message.type() === "error" && pageErrors.push(message.text()));
  await page.goto(`${origin}/player/index.html${formatUrlState({ slug, scene, step, mode })}`);
  await page.waitForFunction(() => window.escenario?.ready || window.escenario?.errors.length, null, {
    timeout: 20000,
  });
  return { page, pageErrors };
}

// Waits until fonts are in and two frames have been painted.
export function settle(page) {
  return page.evaluate(async () => {
    await window.escenario.whenIdle();
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
