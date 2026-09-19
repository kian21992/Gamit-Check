import assert from "node:assert/strict";
import test from "node:test";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox, webkit } from "playwright";
import react from "@vitejs/plugin-react";
import { createServer as createViteServer } from "vite";
import { createApp } from "../server/app.js";
import { pool } from "../server/db.js";

let apiServer;
let viteServer;
let browser;
let appUrl;
const createdIds = new Set();

test.before(async () => {
  await pool.query("SELECT 1");

  apiServer = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => apiServer.once("listening", resolve));
  const apiUrl = `http://127.0.0.1:${apiServer.address().port}`;

  viteServer = await createViteServer({
    configFile: false,
    clearScreen: false,
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 0,
      strictPort: false,
      proxy: { "/api": apiUrl },
    },
  });
  await viteServer.listen();
  appUrl = viteServer.resolvedUrls.local[0].replace(/\/$/, "");
  browser = await chromium.launch({ headless: true });
});

test.after(async () => {
  if (browser) await browser.close();
  if (viteServer) await viteServer.close();
  if (createdIds.size) {
    await pool.query("DELETE FROM items WHERE id = ANY($1::bigint[])", [
      [...createdIds],
    ]);
  }
  if (apiServer) {
    await new Promise((resolve, reject) =>
      apiServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
  await pool.end();
});

test("load failure offers a retry and recovers", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let simulateOutage = true;
  await page.route("**/api/items", async (route) => {
    if (simulateOutage && route.request().method() === "GET") {
      await route.abort("connectionfailed");
    } else {
      await route.continue();
    }
  });

  await page.goto(`${appUrl}/#/items`);
  await page.getByRole("alert").filter({ hasText: "Could not load" }).waitFor();
  simulateOutage = false;
  await page.getByRole("button", { name: "Try Again" }).click();
  await page.getByRole("alert").waitFor({ state: "hidden" });
  await page.getByRole("region", { name: "Your items" }).waitFor();
  await page.close();
});

test("form displays and clears field-specific API errors", async () => {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  await page.route("**/api/items", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Please correct the highlighted fields.",
          fields: { brand: "Brand needs review." },
        }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(`${appUrl}/#/add`);
  await page.getByLabel(/Item name/).fill("Field error check");
  await page.getByLabel(/Category/).selectOption("Electronics");
  await page.getByLabel(/Brand/).fill("Test");
  await page.getByLabel(/Condition/).selectOption("Good");
  await page.getByRole("button", { name: "Add Item" }).click();

  const brand = page.getByLabel(/Brand/);
  await page.locator("#brand-error").waitFor();
  assert.equal(await brand.getAttribute("aria-invalid"), "true");
  assert.equal(
    await page.locator("#brand-error").innerText(),
    "Brand needs review.",
  );
  await brand.fill("Corrected brand");
  await page.locator("#brand-error").waitFor({ state: "detached" });
  await page.close();
});

test("desktop and mobile complete create, edit, refresh, and delete", async () => {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  const stamp = Date.now();
  const originalName = `Automated Browser ${stamp}`;
  const updatedName = `Automated Browser Updated ${stamp}`;

  await page.goto(`${appUrl}/#/add`);
  await page.getByLabel(/Item name/).fill(originalName);
  await page.getByLabel(/Category/).selectOption("Electronics");
  await page.getByLabel(/Condition/).selectOption("Good");
  await page.getByLabel(/Location/).fill("Automated shelf");
  const firstPhoto = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  );
  await page.getByLabel(/Item photo/).setInputFiles({
    name: "browser-photo.png",
    mimeType: "image/png",
    buffer: firstPhoto,
  });
  await page.getByAltText("Selected item preview").waitFor();
  await page.getByRole("button", { name: "Add Item" }).click();
  await page.locator("h1").filter({ hasText: originalName }).waitFor();
  const id = page.url().match(/#\/items\/(\d+)$/)?.[1];
  assert.ok(id);
  createdIds.add(id);
  await page.getByAltText(`Photo of ${originalName}`).waitFor();
  assert.equal(
    (
      await fetch(
        `http://127.0.0.1:${apiServer.address().port}/api/items/${id}/image`,
      )
    ).status,
    200,
  );

  await page.getByRole("link", { name: "Edit Item" }).click();
  await page.getByLabel(/Item name/).fill(updatedName);
  await page.getByLabel(/Condition/).selectOption("Fair");
  await page.getByLabel(/Location/).fill("Updated automated shelf");
  const replacementPhoto = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2n0YAAAAASUVORK5CYII=",
    "base64",
  );
  await page.getByLabel(/Item photo/).setInputFiles({
    name: "browser-replacement.png",
    mimeType: "image/png",
    buffer: replacementPhoto,
  });
  await page.getByRole("button", { name: "Save Changes" }).click();
  await page.locator("h1").filter({ hasText: updatedName }).waitFor();
  await page.reload();
  await page.locator("h1").filter({ hasText: updatedName }).waitFor();
  assert.match(
    await page.locator("body").innerText(),
    /Updated automated shelf/,
  );

  await page.getByRole("link", { name: "Edit Item" }).click();
  await page.getByRole("button", { name: "Remove current photo" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();
  await page.locator("h1").filter({ hasText: updatedName }).waitFor();
  assert.equal(
    (
      await fetch(
        `http://127.0.0.1:${apiServer.address().port}/api/items/${id}/image`,
      )
    ).status,
    404,
  );
  await page.locator(".detail-art .product-art").waitFor();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${appUrl}/#/items`);
  const searchResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname === "/api/items" &&
      url.searchParams.get("search") === updatedName &&
      url.searchParams.get("pageSize") === "8"
    );
  });
  await page.getByLabel("Search items").fill(updatedName);
  await searchResponse;
  await page
    .locator(".inventory-card-grid .item-card")
    .filter({ hasText: updatedName })
    .waitFor();
  await page.goto(`${appUrl}/#/items/${id}`);
  await page.getByRole("button", { name: "Delete Item" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete Item" })
    .click();
  await page.waitForURL(/#\/items$/);

  const deleted = await fetch(
    `http://127.0.0.1:${apiServer.address().port}/api/items/${id}`,
  );
  assert.equal(deleted.status, 404);
  createdIds.delete(id);
  await page.close();
});

test("key pages have no serious or critical automated accessibility violations", async () => {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
  });
  try {
    const page = await context.newPage();
    for (const route of ["/", "/items", "/add"]) {
      await page.goto(`${appUrl}/#${route}`);
      await page.locator("h1").waitFor();
      const results = await new AxeBuilder({ page }).analyze();
      const severe = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact),
      );
      assert.deepEqual(
        severe.map(({ id, impact, help }) => ({ id, impact, help })),
        [],
        `Accessibility violations on ${route}`,
      );
    }

    await page.goto(`${appUrl}/#/`);
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").innerText(), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator(":focus").getAttribute("id"),
      "main-content",
    );
  } finally {
    await context.close();
  }
});

for (const [name, browserType] of [
  ["Chromium", chromium],
  ["Firefox", firefox],
  ["WebKit", webkit],
]) {
  test(`${name} opens Dashboard, My Items, and Add Item`, async () => {
    const testBrowser = await browserType.launch({ headless: true });
    try {
      const page = await testBrowser.newPage({
        viewport: { width: 1280, height: 800 },
      });
      for (const [route, heading] of [
        ["/", "Dashboard"],
        ["/items", "My Items"],
        ["/add", "Add a new item"],
      ]) {
        await page.goto(`${appUrl}/#${route}`);
        await page.getByRole("heading", { level: 1, name: heading }).waitFor();
      }
    } finally {
      await testBrowser.close();
    }
  });
}
