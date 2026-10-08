import { createApp } from "../server/app.js";

const app = createApp({ serveFrontend: false });

export default function handler(request, response) {
  const url = new URL(request.url, "http://localhost");
  const routePath = url.searchParams.get("vercelPath") || "";
  url.searchParams.delete("vercelPath");

  const query = url.searchParams.toString();
  request.url = `/api/${routePath}${query ? `?${query}` : ""}`;

  return app(request, response);
}
