// End-to-end checks of the player contract against tests/fixtures/presentation.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startStaticServer } from "../scripts/lib/static-server.mjs";
import { launchBrowser, openPlayer, settle } from "../scripts/lib/browser.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLUG = "fixture-contract";
let server;
let browser;

before(async () => {
  server = await startStaticServer(ROOT, {
    [`/presentations/${SLUG}/`]: join(ROOT, "tests", "fixtures", "presentation"),
  });
  browser = await launchBrowser();
});

after(async () => {
  await browser?.close();
  await server?.close();
});

const boxX = (page) =>
  page.evaluate(() => {
    const host = document.querySelector(".scene-host");
    return gsap.getProperty(host.shadowRoot.querySelector(".box"), "x");
  });

const waitIdle = (page) => page.waitForFunction(() => !window.escenario.busy());

test("loads the presentation and reuses one scene with different props", async () => {
  const { page, pageErrors } = await openPlayer(browser, server.origin, { slug: SLUG, mode: "live" });
  assert.deepEqual(await page.evaluate(() => window.escenario.errors), []);
  const outline = await page.evaluate(() => window.escenario.outline());
  assert.deepEqual(outline.map((scene) => scene.title), ["Mover A", "Mover B", "Mover C", "Mover D", "Mover E"]);
  assert.deepEqual(pageErrors, []);
  await page.close();
});

test("→ plays to the next hold and stops; ← jumps to the previous rest state", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, mode: "live" });
  assert.equal(await boxX(page), 0);

  await page.keyboard.press("ArrowRight");
  await waitIdle(page);
  assert.equal(await boxX(page), 400);
  assert.match(page.url(), /s=1&k=2/);

  await page.keyboard.press("ArrowLeft");
  await settle(page);
  assert.equal(await boxX(page), 0, "back must not play in reverse");
  assert.match(page.url(), /s=1&k=1/);
  await page.close();
});

test("pressing → during an animation completes it instead of skipping a step", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, mode: "live" });
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await settle(page);
  assert.equal(await boxX(page), 400);
  assert.deepEqual(await page.evaluate(() => window.escenario.position()), { scene: 0, step: 1 });
  await page.close();
});

test("after the last step the next press enters the next scene with its transition", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, step: 2, mode: "live" });
  await page.keyboard.press("ArrowRight");
  await waitIdle(page);
  assert.deepEqual(await page.evaluate(() => window.escenario.position()), { scene: 1, step: 0 });
  assert.equal(await page.locator(".scene-host").count(), 1, "the old scene is removed");
  assert.match(page.url(), /s=2&k=1/);
  await page.close();
});

test("every transition type ends with only the new scene on stage, untransformed", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, scene: 1, step: 2, mode: "live" });
  for (const scene of [2, 3, 4]) {
    await page.keyboard.press("ArrowRight");
    await waitIdle(page);
    assert.deepEqual(await page.evaluate(() => window.escenario.position()), { scene, step: 0 });
    assert.equal(await page.locator(".scene-host").count(), 1);
    assert.equal(await page.locator(".transition-panel").count(), 0);
    assert.equal(await page.locator(".scene-host").evaluate((host) => host.getAttribute("style") ?? ""), "");
    await page.evaluate((position) => window.escenario.goTo(position), { scene, step: 2 });
  }
  assert.deepEqual(await page.evaluate(() => window.escenario.errors), []);
  await page.close();
});

test("the URL restores a step directly, with that scene's own props", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, scene: 1, step: 1, mode: "live" });
  await settle(page);
  assert.equal(await boxX(page), 800);
  await page.close();
});

test("I opens the scene index and picking a scene jumps to it", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, mode: "live" });
  await page.keyboard.press("i");
  assert.equal(await page.locator("#scene-index").isVisible(), true);
  await page.keyboard.press("2");
  await settle(page);
  assert.equal(await page.locator("#scene-index").isVisible(), false);
  assert.deepEqual(await page.evaluate(() => window.escenario.position()), { scene: 1, step: 0 });
  await page.close();
});

test("G toggles recording mode: no HUD and no cursor", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, mode: "live" });
  await page.keyboard.press("g");
  assert.equal(await page.evaluate(() => document.body.dataset.mode), "record");
  assert.match(page.url(), /mode=record/);
  assert.equal(await page.locator("#hud").isVisible(), false);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).cursor), "none");
  await page.close();
});

test("the presenter window gets notes and drives the player", async () => {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const player = await context.newPage();
  await player.goto(`${server.origin}/player/index.html?p=${SLUG}`);
  await player.waitForFunction(() => window.escenario?.ready);
  const presenter = await context.newPage();
  await presenter.goto(`${server.origin}/player/presenter.html?p=${SLUG}`);
  await presenter.waitForFunction(() => document.getElementById("now-note").textContent === "note for start");

  await presenter.keyboard.press("ArrowRight");
  await player.waitForFunction(() => window.escenario.position().step === 1);
  await presenter.waitForFunction(() => document.getElementById("now-note").textContent === "note for moved");
  await context.close();
});

test("the audit flags text under 40 px", async () => {
  const { page } = await openPlayer(browser, server.origin, { slug: SLUG, step: 2 });
  await settle(page);
  const issues = await page.evaluate(() => window.escenario.audit());
  assert.deepEqual(
    issues.map((issue) => [issue.kind, issue.text, issue.size]),
    [["small-text", "small print", 20]],
  );
  await page.close();
});
