import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

const schemaPath = fileURLToPath(new URL("../db/schema.sql", import.meta.url));

try {
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);
  console.log("Database migration completed. The items table is ready.");
} catch (error) {
  console.error("Database migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
