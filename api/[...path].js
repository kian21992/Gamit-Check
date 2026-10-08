import { createApp } from "../server/app.js";

// Vercel sends every /api/* request to this function. The Express app keeps
// the original request path, so the same routes work locally and in production.
export default createApp({ serveFrontend: false });
