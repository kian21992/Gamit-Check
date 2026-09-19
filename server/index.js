import "dotenv/config";
import { createApp } from "./app.js";
import { pool } from "./db.js";

const port = Number(process.env.PORT || 3000);
const app = createApp();

const server = app.listen(port, () => {
  console.log(`Gamit Check API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received. Closing the API server.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
