import cors from "cors";
import express from "express";
import path from "node:path";
import { pool } from "./db.js";

const categories = [
  "Electronics",
  "Clothes",
  "Sports Equipment",
  "Gaming",
  "School Items",
  "Accessories",
  "Other",
];
const conditions = ["New", "Good", "Fair", "Damaged"];
const itemSorts = {
  created_desc: "created_at DESC, id DESC",
  created_asc: "created_at ASC, id ASC",
  name_asc: "LOWER(name) ASC, id ASC",
  name_desc: "LOWER(name) DESC, id DESC",
};

const itemColumns = `
  id::text AS id,
  name,
  category,
  brand,
  condition,
  location,
  date_acquired::text AS acquired,
  notes,
  created_at::date::text AS added,
  updated_at::text AS "updatedAt"
`;

function cleanOptional(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned || null;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateItem(body) {
  const item = {
    name: String(body.name ?? "").trim(),
    category: String(body.category ?? "").trim(),
    brand: cleanOptional(body.brand),
    condition: String(body.condition ?? "").trim(),
    location: cleanOptional(body.location),
    acquired: cleanOptional(body.acquired),
    notes: cleanOptional(body.notes),
  };
  const errors = {};

  if (!item.name) errors.name = "Item name is required.";
  else if (item.name.length > 100)
    errors.name = "Item name must be 100 characters or fewer.";
  if (!categories.includes(item.category))
    errors.category = "Select a valid category.";
  if (!conditions.includes(item.condition))
    errors.condition = "Select a valid condition.";
  if (item.brand?.length > 100)
    errors.brand = "Brand must be 100 characters or fewer.";
  if (item.location?.length > 150)
    errors.location = "Location must be 150 characters or fewer.";
  if (item.notes?.length > 2000)
    errors.notes = "Notes must be 2,000 characters or fewer.";
  if (item.acquired && !isValidDate(item.acquired))
    errors.acquired = "Enter a valid date acquired.";

  return { item, errors };
}

export function createApp({
  serveFrontend = process.env.NODE_ENV === "production",
} = {}) {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", async (_request, response, next) => {
    try {
      await pool.query("SELECT 1");
      response.json({ status: "ok", database: "connected" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/items", async (request, response, next) => {
    try {
      const search = String(request.query.search ?? "").trim();
      const category = String(request.query.category ?? "").trim();
      const sort = String(request.query.sort ?? "created_desc").trim();
      const paginated =
        request.query.page !== undefined ||
        request.query.pageSize !== undefined;
      const page = Number(request.query.page ?? 1);
      const pageSize = Number(request.query.pageSize ?? 8);

      const queryErrors = {};
      if (category && !categories.includes(category))
        queryErrors.category = "Select a valid category.";
      if (!itemSorts[sort]) queryErrors.sort = "Select a valid sort order.";
      if (!Number.isInteger(page) || page < 1)
        queryErrors.page = "Page must be a positive integer.";
      if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100)
        queryErrors.pageSize = "Page size must be between 1 and 100.";
      if (Object.keys(queryErrors).length)
        return response.status(400).json({
          error: "Invalid inventory query.",
          fields: queryErrors,
        });

      const values = [];
      const filters = [];

      if (search) {
        values.push(`%${search}%`);
        filters.push(`(
          name ILIKE $${values.length}
          OR COALESCE(brand, '') ILIKE $${values.length}
          OR COALESCE(location, '') ILIKE $${values.length}
          OR category ILIKE $${values.length}
          OR condition ILIKE $${values.length}
        )`);
      }
      if (category) {
        values.push(category);
        filters.push(`category = $${values.length}`);
      }

      const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
      const countResult = await pool.query(
        `SELECT COUNT(*)::integer AS total FROM items ${where}`,
        values,
      );
      const total = countResult.rows[0].total;
      const listValues = [...values];
      let limit = "";
      if (paginated) {
        listValues.push(pageSize, (page - 1) * pageSize);
        limit = `LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`;
      }
      const result = await pool.query(
        `SELECT ${itemColumns}
         FROM items
         ${where}
         ORDER BY ${itemSorts[sort]}
         ${limit}`,
        listValues,
      );
      response.json({
        items: result.rows,
        pagination: {
          page: paginated ? page : 1,
          pageSize: paginated ? pageSize : total,
          total,
          pages: paginated ? Math.ceil(total / pageSize) : total ? 1 : 0,
        },
        sort,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/items/:id", async (request, response, next) => {
    try {
      const result = await pool.query(
        `SELECT ${itemColumns} FROM items WHERE id = $1`,
        [request.params.id],
      );
      if (!result.rows[0])
        return response.status(404).json({ error: "Item not found." });
      response.json({ item: result.rows[0] });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/items", async (request, response, next) => {
    const { item, errors } = validateItem(request.body ?? {});
    if (Object.keys(errors).length)
      return response.status(400).json({
        error: "Please correct the highlighted fields.",
        fields: errors,
      });

    try {
      const result = await pool.query(
        `INSERT INTO items
          (name, category, brand, condition, location, date_acquired, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING ${itemColumns}`,
        [
          item.name,
          item.category,
          item.brand,
          item.condition,
          item.location,
          item.acquired,
          item.notes,
        ],
      );
      response.status(201).json({ item: result.rows[0] });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/items/:id", async (request, response, next) => {
    const { item, errors } = validateItem(request.body ?? {});
    if (Object.keys(errors).length)
      return response.status(400).json({
        error: "Please correct the highlighted fields.",
        fields: errors,
      });

    try {
      const result = await pool.query(
        `UPDATE items
         SET name = $1,
             category = $2,
             brand = $3,
             condition = $4,
             location = $5,
             date_acquired = $6,
             notes = $7,
             updated_at = NOW()
         WHERE id = $8
         RETURNING ${itemColumns}`,
        [
          item.name,
          item.category,
          item.brand,
          item.condition,
          item.location,
          item.acquired,
          item.notes,
          request.params.id,
        ],
      );
      if (!result.rows[0])
        return response.status(404).json({ error: "Item not found." });
      response.json({ item: result.rows[0] });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/items/:id", async (request, response, next) => {
    try {
      const result = await pool.query(
        "DELETE FROM items WHERE id = $1 RETURNING id",
        [request.params.id],
      );
      if (!result.rows[0])
        return response.status(404).json({ error: "Item not found." });
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.use((request, response, next) => {
    if (request.path.startsWith("/api/"))
      return response.status(404).json({ error: "API route not found." });
    next();
  });

  if (serveFrontend) {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((_request, response) =>
      response.sendFile(path.join(distPath, "index.html")),
    );
  } else {
    app.use((_request, response) => {
      response.status(404).json({ error: "Route not found." });
    });
  }

  app.use((error, _request, response, _next) => {
    console.error(error);
    if (error.code === "22P02")
      return response.status(400).json({ error: "Invalid item identifier." });
    if (
      String(error.code || "").startsWith("08") ||
      ["57P01", "57P02", "57P03", "ECONNREFUSED", "ETIMEDOUT"].includes(
        error.code,
      )
    )
      return response
        .status(503)
        .json({ error: "The inventory database is temporarily unavailable." });
    response
      .status(500)
      .json({ error: "The server could not complete the request. Try again." });
  });

  return app;
}
