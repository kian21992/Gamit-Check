import assert from "node:assert/strict";
import test from "node:test";
import { validateItem } from "../server/app.js";

test("validateItem accepts and normalizes a complete item", () => {
  const { item, errors } = validateItem({
    name: "  Camera  ",
    category: "Electronics",
    brand: "  Fujifilm  ",
    condition: "Good",
    location: "  Bedroom shelf  ",
    acquired: "2026-09-20",
    notes: "  Stored in its case.  ",
  });

  assert.deepEqual(errors, {});
  assert.equal(item.name, "Camera");
  assert.equal(item.brand, "Fujifilm");
  assert.equal(item.location, "Bedroom shelf");
  assert.equal(item.notes, "Stored in its case.");
});

test("validateItem reports every required field", () => {
  const { errors } = validateItem({});

  assert.equal(errors.name, "Item name is required.");
  assert.equal(errors.category, "Select a valid category.");
  assert.equal(errors.condition, "Select a valid condition.");
});

test("validateItem rejects invalid values and dates", () => {
  const { errors } = validateItem({
    name: "Valid name",
    category: "Unknown",
    condition: "Perfect",
    acquired: "2026-02-30",
    notes: "x".repeat(2001),
  });

  assert.equal(errors.category, "Select a valid category.");
  assert.equal(errors.condition, "Select a valid condition.");
  assert.equal(errors.acquired, "Enter a valid date acquired.");
  assert.equal(errors.notes, "Notes must be 2,000 characters or fewer.");
});

test("validateItem converts blank optional fields to null", () => {
  const { item, errors } = validateItem({
    name: "Book",
    category: "School Items",
    condition: "New",
    brand: " ",
    location: "",
    acquired: null,
    notes: undefined,
  });

  assert.deepEqual(errors, {});
  assert.equal(item.brand, null);
  assert.equal(item.location, null);
  assert.equal(item.acquired, null);
  assert.equal(item.notes, null);
});
