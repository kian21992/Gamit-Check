import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../server/app.js";
import { pool } from "../server/db.js";

let server;
let baseUrl;
const createdIds = new Set();

test.before(async () => {
  await pool.query("SELECT 1");
  server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (createdIds.size) {
    await pool.query("DELETE FROM items WHERE id = ANY($1::bigint[])", [
      [...createdIds],
    ]);
  }
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  await pool.end();
});

test("health endpoint confirms database connectivity", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    database: "connected",
  });
});

test("item endpoints complete the CRUD lifecycle", async () => {
  const stamp = Date.now();
  const createResponse = await fetch(`${baseUrl}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Automated API ${stamp}`,
      category: "Electronics",
      condition: "Good",
      location: "API shelf",
    }),
  });
  assert.equal(createResponse.status, 201);
  const { item: created } = await createResponse.json();
  createdIds.add(created.id);

  const updateResponse = await fetch(`${baseUrl}/api/items/${created.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Automated API Updated ${stamp}`,
      category: "Accessories",
      brand: "",
      condition: "Fair",
      location: "Updated API shelf",
      notes: "Updated by the maintained integration test.",
    }),
  });
  assert.equal(updateResponse.status, 200);
  const { item: updated } = await updateResponse.json();
  assert.equal(updated.category, "Accessories");
  assert.equal(updated.brand, null);

  const detailResponse = await fetch(`${baseUrl}/api/items/${created.id}`);
  assert.equal(detailResponse.status, 200);
  const { item: detail } = await detailResponse.json();
  assert.equal(detail.location, "Updated API shelf");

  const searchResponse = await fetch(
    `${baseUrl}/api/items?search=${encodeURIComponent(String(stamp))}&category=Accessories`,
  );
  const { items } = await searchResponse.json();
  assert.ok(items.some((item) => item.id === created.id));

  const deleteResponse = await fetch(`${baseUrl}/api/items/${created.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 204);
  createdIds.delete(created.id);

  const missingResponse = await fetch(`${baseUrl}/api/items/${created.id}`);
  assert.equal(missingResponse.status, 404);
});

test("create and update return field-specific validation errors", async () => {
  for (const method of ["POST", "PUT"]) {
    const path = method === "POST" ? "/api/items" : "/api/items/999999";
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(response.status, 400);
    const data = await response.json();
    assert.equal(data.fields.name, "Item name is required.");
    assert.equal(data.fields.category, "Select a valid category.");
    assert.equal(data.fields.condition, "Select a valid condition.");
  }
});

test("missing records return 404 for update and delete", async () => {
  const validItem = {
    name: "Missing item",
    category: "Other",
    condition: "New",
  };
  const updateResponse = await fetch(`${baseUrl}/api/items/999999999999`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validItem),
  });
  const deleteResponse = await fetch(`${baseUrl}/api/items/999999999999`, {
    method: "DELETE",
  });

  assert.equal(updateResponse.status, 404);
  assert.equal(deleteResponse.status, 404);
});

test("item photo endpoints upload, return, replace, and remove images", async () => {
  const createResponse = await fetch(`${baseUrl}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Automated photo item",
      category: "Other",
      condition: "Good",
    }),
  });
  const { item } = await createResponse.json();
  createdIds.add(item.id);

  const firstImage = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  );
  const uploadBody = new FormData();
  uploadBody.append(
    "image",
    new Blob([firstImage], { type: "image/png" }),
    "first.png",
  );
  const uploadResponse = await fetch(`${baseUrl}/api/items/${item.id}/image`, {
    method: "PUT",
    body: uploadBody,
  });
  const uploaded = await uploadResponse.json();
  assert.equal(uploadResponse.status, 200);
  assert.equal(uploaded.item.hasImage, true);
  assert.equal(uploaded.item.imageName, "first.png");

  const imageResponse = await fetch(`${baseUrl}/api/items/${item.id}/image`);
  assert.equal(imageResponse.status, 200);
  assert.equal(imageResponse.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await imageResponse.arrayBuffer()), firstImage);

  const replacementImage = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2n0YAAAAASUVORK5CYII=",
    "base64",
  );
  const replacementBody = new FormData();
  replacementBody.append(
    "image",
    new Blob([replacementImage], { type: "image/png" }),
    "replacement.png",
  );
  const replacementResponse = await fetch(
    `${baseUrl}/api/items/${item.id}/image`,
    { method: "PUT", body: replacementBody },
  );
  const replacement = await replacementResponse.json();
  assert.equal(replacement.item.imageName, "replacement.png");

  const removeResponse = await fetch(`${baseUrl}/api/items/${item.id}/image`, {
    method: "DELETE",
  });
  const removed = await removeResponse.json();
  assert.equal(removeResponse.status, 200);
  assert.equal(removed.item.hasImage, false);
  assert.equal(
    (await fetch(`${baseUrl}/api/items/${item.id}/image`)).status,
    404,
  );
});

test("item photo endpoint rejects unsupported and fake images", async () => {
  const createResponse = await fetch(`${baseUrl}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Invalid photo item",
      category: "Other",
      condition: "Good",
    }),
  });
  const { item } = await createResponse.json();
  createdIds.add(item.id);

  const unsupportedBody = new FormData();
  unsupportedBody.append(
    "image",
    new Blob(["not an image"], { type: "text/plain" }),
    "notes.txt",
  );
  const unsupportedResponse = await fetch(
    `${baseUrl}/api/items/${item.id}/image`,
    { method: "PUT", body: unsupportedBody },
  );
  assert.equal(unsupportedResponse.status, 400);

  const fakeBody = new FormData();
  fakeBody.append(
    "image",
    new Blob(["not really png"], { type: "image/png" }),
    "fake.png",
  );
  const fakeResponse = await fetch(`${baseUrl}/api/items/${item.id}/image`, {
    method: "PUT",
    body: fakeBody,
  });
  assert.equal(fakeResponse.status, 400);

  const largeBody = new FormData();
  largeBody.append(
    "image",
    new Blob([Buffer.alloc(3 * 1024 * 1024 + 1)], { type: "image/png" }),
    "large.png",
  );
  const largeResponse = await fetch(`${baseUrl}/api/items/${item.id}/image`, {
    method: "PUT",
    body: largeBody,
  });
  assert.equal(largeResponse.status, 413);
});

test("list endpoint paginates, filters, and sorts on the server", async () => {
  const stamp = Date.now();
  const names = ["Zulu", "Alpha", "Mike", "Bravo", "Echo"];
  for (const name of names) {
    const response = await fetch(`${baseUrl}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${name} Server Query ${stamp}`,
        category: "Gaming",
        condition: "Good",
        location: "Pagination shelf",
      }),
    });
    const { item } = await response.json();
    createdIds.add(item.id);
  }

  const firstPageResponse = await fetch(
    `${baseUrl}/api/items?search=${stamp}&category=Gaming&sort=name_asc&page=1&pageSize=2`,
  );
  const firstPage = await firstPageResponse.json();
  assert.equal(firstPageResponse.status, 200);
  assert.equal(firstPage.pagination.total, 5);
  assert.equal(firstPage.pagination.pages, 3);
  assert.deepEqual(
    firstPage.items.map((item) => item.name.split(" ")[0]),
    ["Alpha", "Bravo"],
  );

  const lastPage = await (
    await fetch(
      `${baseUrl}/api/items?search=${stamp}&category=Gaming&sort=name_asc&page=3&pageSize=2`,
    )
  ).json();
  assert.equal(lastPage.items.length, 1);
  assert.equal(lastPage.items[0].name.split(" ")[0], "Zulu");

  const invalidResponse = await fetch(
    `${baseUrl}/api/items?category=Invalid&sort=unknown&page=0&pageSize=101`,
  );
  const invalid = await invalidResponse.json();
  assert.equal(invalidResponse.status, 400);
  assert.deepEqual(Object.keys(invalid.fields).sort(), [
    "category",
    "page",
    "pageSize",
    "sort",
  ]);
});
