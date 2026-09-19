# Gamit Check

## 1. Overview

Gamit Check is a complete personal inventory web application for people who want to remember what they own, where they keep it, and its condition. React provides the interface, Express provides the API, and PostgreSQL stores item records and optional photos. The application includes persistent CRUD, server-side inventory queries, accessible error recovery, automated multi-browser tests, and a container-ready production build.

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

   Internet access is needed to download dependencies. Run the commands in this README from the project root, **not** the documentation-only `project/` subfolder.

3. Install the browser engines used by the automated tests:

   ```sh
   npx playwright install chromium firefox webkit
   ```

### Environment and configuration

Copy `.env.example` to `.env`, then configure these values:

| Variable        | Example value                                                         | Purpose                                          |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| `PORT`          | `3000`                                                                | Express API port                                 |
| `DATABASE_URL`  | `postgresql://postgres:gamit_check_local@localhost:54329/gamit_check` | PostgreSQL connection string                     |
| `CLIENT_ORIGIN` | `http://localhost:5173`                                               | Frontend origin allowed by CORS                  |
| `DATABASE_SSL`  | `false`                                                               | Use `true` for hosted databases that require SSL |
| `VITE_API_URL`  | Empty locally                                                         | Optional deployed API URL                        |

Never commit `.env`; it is ignored by Git. Vite proxies `/api` requests to `http://localhost:3000` during development.

### Database setup and seeding

For the included workspace-local PostgreSQL, open a terminal and run:

```sh
npm run db:local
```

The first run initializes `.postgres-data/`, creates `gamit_check`, and applies `server/db/schema.sql`. Keep this terminal open while developing. The data persists between runs and is ignored by Git.

To use an external PostgreSQL server instead, change `DATABASE_URL`, create the database, and run `npm run db:migrate`. There is no seed command because the inventory starts empty.

## 3. How to run it

With `npm run db:local` still running in the first terminal, start the React frontend and Express API in a second terminal:

```sh
npm run dev
```

Open **http://localhost:5173**. A working app displays **API connected**. A new database shows zero-valued cards and a **No items yet** panel. Press **Ctrl+C** to stop both processes.

To build and check the production version locally:

```sh
npm run build
npm run preview
```

The build creates `dist/`. The preview normally opens at **http://localhost:4173**; use the address Vite prints. This is a local preview, not a public deployment.

### Run the automated tests

Keep `npm run db:local` running, close any application data you do not want to edit manually, and run:

```sh
npm test
```

The test command runs validation unit tests, API integration tests, accessibility checks, and Chromium, Firefox, and WebKit browser tests. Tests create uniquely named records and remove only those records afterward. Individual commands are `npm run test:unit`, `npm run test:api`, and `npm run test:e2e`.

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
| Navigation flow | `/#/flow`                          | Diagram of the intended five-screen flow         |
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
Dockerfile                 Production Node.js container
compose.yaml               App and PostgreSQL container stack
DEPLOYMENT.md              Production and container deployment guide
docs/previews/      Desktop/mobile screenshots and screenshot index
project/
  README.md         Workspace link to this documentation
  REPORT.md         Workspace copy of the weekly report
index.html          Application entry page
vite.config.js      Vite and React plugin configuration
package.json        Dependencies and dev/build/preview commands
package-lock.json   Locked versions for npm ci
README.md           Setup, usage, and current status
WIREFRAME.md        Design reference and intended navigation flow
REPORT.md           Weekly Increment Report
```

`node_modules/` and `dist/` are generated locally and ignored by Git.

## 6. Screenshots

These screenshots show the running app after sample items were removed.

**Dashboard — desktop**

![Empty Dashboard with zero counts and an Add your first item link](docs/previews/dashboard-desktop.png)

**My Items — desktop**

![My Items with search and category controls and no inventory records](docs/previews/my-items-desktop.png)

See the [screenshot gallery](docs/previews/README.md) for mobile layouts and other screens. Earlier populated Item Details, Edit Item, and Delete confirmation images are labeled as historical design references, not current inventory records.

## 7. Known issues and next steps

- **The database must be running:** keep `npm run db:local` open, or configure an external PostgreSQL server.
- **Automated accessibility has practical limits:** axe checks and keyboard skip navigation pass, but a manual screen-reader review is still recommended before a public release.
- **Photos use database storage:** each image is limited to 3 MB to keep backups and hosted-database usage manageable.
- **Public deployment URL pending:** the repository is published at [github.com/kian21992/Gamit-Check](https://github.com/kian21992/Gamit-Check). Deploy using [DEPLOYMENT.md](DEPLOYMENT.md), then record the public application URL.

## Production deployment

The Express production server serves both the built React interface and `/api`. `Dockerfile` builds the application, while `compose.yaml` runs it with PostgreSQL. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for local containers, hosted environment variables, health checks, and release verification.

See the [wireframe reference](WIREFRAME.md) for the planned flow and the [Weekly Increment Report](REPORT.md) for completed work and remaining tasks.

A complete copy of this guide is also available in [docs/README.md](docs/README.md) for workspace submission.
