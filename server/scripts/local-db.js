import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const databaseDir = resolve(".postgres-data");
const postgres = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "gamit_check_local",
  port: 54329,
  persistent: true,
  onLog: () => {},
  onError: (error) => console.error(error),
});

if (!existsSync(resolve(databaseDir, "PG_VERSION"))) {
  console.log("Initializing the workspace-local PostgreSQL cluster…");
  await postgres.initialise();
}

await postgres.start();

const client = postgres.getPgClient();
await client.connect();
const database = await client.query(
  "SELECT 1 FROM pg_database WHERE datname = $1",
  ["gamit_check"],
);
await client.end();
if (!database.rowCount) await postgres.createDatabase("gamit_check");

const applicationClient = postgres.getPgClient("gamit_check");
await applicationClient.connect();
const schema = await readFile(resolve("server/db/schema.sql"), "utf8");
await applicationClient.query(schema);
await applicationClient.end();

console.log("Local PostgreSQL is running on localhost:54329.");
console.log("The gamit_check database and items table are ready.");
console.log("Keep this terminal open while developing. Press Ctrl+C to stop.");

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await postgres.stop();
  process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
await new Promise(() => {});
