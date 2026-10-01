# Gamit Check

[![Made with AI assistance](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

Built with OpenAI Codex assistance (approximately 70% AI-assisted and at least 30% independently written or substantially developed). See the evidence and exact file responsibilities in the [AI usage disclosure](AI-USAGE.md).

## 1. Overview

Gamit Check is a complete personal inventory web application for people who want to remember what they own, where they keep it, and its condition. React provides the interface, Express provides the API, and a Supabase-hosted PostgreSQL database stores item records and optional photos. The application includes persistent CRUD, server-side inventory queries, accessible error recovery, automated multi-browser tests, and a production build prepared for public hosting.

**Repository:** [github.com/kian21992/Gamit-Check](https://github.com/kian21992/Gamit-Check)

## 2. Setup and installation

### Prerequisites

Install **Node.js 24.x** (includes npm), **Git**, and a modern browser such as Chrome or Edge. This project was checked with Node.js **24.18.0** and npm **11.16.0**. The development dependencies include a workspace-local PostgreSQL 18 binary, so a system-wide PostgreSQL installation is optional.

Check the tools:

```sh
node --version
npm --version
git --version
```

The frontend uses React 19 and Vite 6. The backend uses Express 5 and the `pg` PostgreSQL driver. npm installs these dependencies locally.

### Get the code and install dependencies

1. Clone the project and enter its root folder:

   ```sh
   git clone https://github.com/kian21992/Gamit-Check.git gamit-check
   cd gamit-check
   ```

   Alternatively, download the project ZIP from GitHub, extract it, and open a terminal in the folder containing `package.json`.

2. Install the versions recorded in `package-lock.json`:

   ```sh
   npm ci
   ```

   Internet access is needed to download dependencies. Run the commands in this README from the project root.

3. Install the browser engines used by the automated tests:

   ```sh
   npx playwright install chromium firefox webkit
   ```

### Environment and configuration

Copy `.env.example` to `.env`, then configure these values:

| Variable            | Example value                                                         | Purpose                                          |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| `PORT`              | `3000`                                                                | Express API port                                 |
| `DATABASE_URL`      | `postgresql://postgres:gamit_check_local@localhost:54329/gamit_check` | Private PostgreSQL connection string             |
| `DATABASE_POOL_MAX` | `10` locally / `1` with the Supabase pooler                           | Maximum PostgreSQL connections per process       |
| `CLIENT_ORIGIN`     | `http://localhost:5173`                                               | Frontend origin allowed by CORS                  |
| `DATABASE_SSL`      | `false` locally / `true` with Supabase                                | Enable TLS for the hosted database               |
| `VITE_API_URL`      | Empty locally                                                         | Optional deployed API URL                        |

Never commit `.env`; it is ignored by Git. Vite proxies `/api` requests to `http://localhost:3000` during development.

### Supabase database setup

The current application is verified against a Supabase-hosted PostgreSQL database. In Supabase, create a project and run `server/db/schema.sql` in the SQL Editor. Then copy the **Transaction pooler** URI into `DATABASE_URL` and use:

```env
DATABASE_POOL_MAX=1
DATABASE_SSL=true
```

The pooler URI normally uses port `6543`. Keep it only in the ignored local `.env` file and in the deployment host's encrypted environment-variable settings. You can also apply or update the schema from the project root:

```sh
npm run db:migrate
```

There is no seed command because a new inventory intentionally starts empty.

### Optional local database

To work without Supabase, use the included workspace-local PostgreSQL. Open a terminal and run:

```sh
npm run db:local
```

The first run initializes `.postgres-data/`, creates `gamit_check`, and applies `server/db/schema.sql`. Keep this terminal open while developing. The data persists between runs and is ignored by Git. Use the local values from `.env.example`, including `DATABASE_POOL_MAX=10` and `DATABASE_SSL=false`.

## 3. How to run it

With Supabase configured in `.env`, start the React frontend and Express API:

```sh
npm run dev
```

Open **http://localhost:5173**. A working app displays **API connected**. A new database shows zero-valued cards and a **No items yet** panel. Press **Ctrl+C** to stop both processes.

When using the optional local database, run `npm run db:local` in a separate terminal before `npm run dev`.

To build the production version:

```sh
npm run build
```

The build creates `dist/`. With Supabase configured, start the production server in PowerShell:

```powershell
$env:NODE_ENV="production"
npm start
```

Open **http://localhost:3000**. Express serves the built React application and API from the same address.

### Run the automated tests

Make sure the configured PostgreSQL database is reachable, then run:

```sh
npm test
```

The test command runs 18 validation, API, photo, accessibility, and Chromium/Firefox/WebKit browser tests. Tests create uniquely named records and remove only those records afterward. All seven API integration tests have also been run successfully against Supabase. Individual commands are `npm run test:unit`, `npm run test:api`, and `npm run test:e2e`.

## 4. Features and usage

### Primary flow

1. **Dashboard:** view the item, category-in-use, and recently-added counts. A new database starts at zero.
2. Click **My Items** or **View all items** to see, search, and filter the inventory.
3. Click **Add Item** or **Add your first item**. Item name, category, and condition are required; brand, location, date acquired, notes, and a photo are optional.
4. Optionally choose a JPEG, PNG, or WebP photo up to 3 MB, then press **Add Item**. The API validates the input, PostgreSQL saves the record and photo, and the application opens Item Details. **Cancel** returns to My Items.
5. From Item Details or My Items, choose **Edit Item** to change fields, replace or remove the photo, and press **Save Changes**.
6. Choose **Delete Item**, review the confirmation, and either keep the item or permanently remove it.
7. Use **View screen flow** in the footer to inspect the navigation diagram. On mobile, use the menu button beside the app name to open navigation.

| Screen          | Address after the local server URL | Current behavior                                 |
| --------------- | ---------------------------------- | ------------------------------------------------ |
| Dashboard       | `/#/`                              | Live item, category, and recent-item counts      |
| My Items        | `/#/items`                         | Saved records with search and category filtering |
| Add Item        | `/#/add`                           | Validated form that creates a PostgreSQL record  |
| Navigation flow | `/#/flow`                          | Diagram of the implemented five-screen flow      |
| Item Details    | `/#/items/:id`                     | Displays one saved item                          |
| Edit Item       | `/#/items/:id/edit`                | Updates an existing PostgreSQL record            |

`:id` represents a saved item's PostgreSQL identifier. Add, edit, and delete actions update the database immediately. Search, category filtering, sorting, and pagination are processed by the API.

| Method   | Endpoint               | Purpose                                                                  |
| -------- | ---------------------- | ------------------------------------------------------------------------ |
| `GET`    | `/api/health`          | Check API and database connectivity                                      |
| `GET`    | `/api/items`           | List items; accepts `search`, `category`, `sort`, `page`, and `pageSize` |
| `GET`    | `/api/items/:id`       | Retrieve one item                                                        |
| `POST`   | `/api/items`           | Validate and create an item                                              |
| `PUT`    | `/api/items/:id`       | Validate and update an item                                              |
| `DELETE` | `/api/items/:id`       | Permanently delete an item                                               |
| `GET`    | `/api/items/:id/image` | Retrieve an item's photo                                                 |
| `PUT`    | `/api/items/:id/image` | Upload or replace a JPEG, PNG, or WebP photo                             |
| `DELETE` | `/api/items/:id/image` | Remove an item's photo                                                   |

## 5. Project structure

```text
src/
  api.js            Frontend API requests and item normalization
  main.jsx          Navigation, shared components, screen interfaces
  inventory.js      Category/condition options and date helper
  ProductArt.jsx    Vector placeholders retained for item layouts
  styles.css        Shared styles, empty states, responsive layouts
public/
  favicon.svg       Application icon
server/
  app.js            Express routes, validation, and error handling
  db.js             PostgreSQL connection pool
  index.js          API server entry point
  db/schema.sql     Items table migration
  scripts/migrate.js  Migration runner
tests/
  validation.test.js       Item validation unit tests
  api.integration.test.js  Real PostgreSQL API integration tests
  crud.e2e.test.js         Desktop/mobile browser workflow tests
index.html          Application entry page
vite.config.js      Vite and React plugin configuration
package.json        Dependencies and dev/build/preview commands
package-lock.json   Locked versions for npm ci
README.md           Setup, usage, and current status
```

`node_modules/` and `dist/` are generated locally and ignored by Git.

## 6. Known issues and next steps

- **Supabase is connected:** the hosted database schema, CRUD operations, queries, and photo storage have been verified. Its credentials remain private and are not committed.
- **Automated accessibility has practical limits:** axe checks and keyboard skip navigation pass, but a manual screen-reader review is still recommended before a public release.
- **Photos use database storage:** each image is limited to 3 MB to keep backups and hosted-database usage manageable.
- **Application deployment pending:** Supabase is online, but the React and Express application still needs a public Vercel deployment URL. The repository is published at [github.com/kian21992/Gamit-Check](https://github.com/kian21992/Gamit-Check).

## Production deployment

Supabase provides the hosted PostgreSQL database. Vercel is the selected host for the React interface and Express API. Configure the private database variables in the Vercel dashboard, verify `/api/health`, and test every inventory workflow after deployment.
