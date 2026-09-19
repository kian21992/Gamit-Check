# Gamit Check Documentation

## 1. Overview

Gamit Check is a complete personal inventory web application for people who want to remember what they own, where they keep it, and its condition. React provides the interface, Express provides the API, and PostgreSQL stores item records. All planned local iterations are complete: persistent CRUD, server-side inventory queries, accessible error recovery, automated multi-browser tests, and a container-ready production build.

## 2. Setup and installation

### Prerequisites

Install **Node.js 24.x** (including npm), **Git**, and a modern browser. The project was checked with Node.js **24.18.0** and npm **11.16.0**. A workspace-local PostgreSQL 18 binary is included through the development dependencies, so system-wide PostgreSQL is optional.

```sh
node --version
npm --version
git --version
```

The frontend uses React 19 and Vite 6. The backend uses Express 5 and the `pg` PostgreSQL driver. npm installs these dependencies locally.

### Get the code

1. Clone the repository and enter the project folder:

   ```sh
   git clone <REPOSITORY_URL> gamit-check
   cd gamit-check
   ```

   Replace `<REPOSITORY_URL>` with the real clone URL. No Git remote is configured in the current workspace, so this placeholder must be replaced after the repository is published. If the project was supplied as a ZIP, extract it and open a terminal in the folder containing `package.json`.

2. Install the locked dependencies:

   ```sh
   npm ci
   ```

Run these commands from the project root, not from the `docs/` or `project/` folder.

3. Install the automated-test browsers:

   ```sh
   npx playwright install chromium firefox webkit
   ```

### Environment and configuration

Copy `.env.example` to `.env`, then configure:

| Variable        | Example value                                                         | Purpose                                   |
| --------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| `PORT`          | `3000`                                                                | Express API port                          |
| `DATABASE_URL`  | `postgresql://postgres:gamit_check_local@localhost:54329/gamit_check` | PostgreSQL connection                     |
| `CLIENT_ORIGIN` | `http://localhost:5173`                                               | Allowed frontend origin                   |
| `DATABASE_SSL`  | `false`                                                               | Enable for hosted databases requiring SSL |
| `VITE_API_URL`  | Empty locally                                                         | Optional deployed API URL                 |

Do not commit `.env`. Vite proxies `/api` requests to the Express server on port 3000 during development.

### Database setup and seeding

Start the included workspace-local PostgreSQL:

```sh
npm run db:local
```

The first run initializes `.postgres-data/`, creates the database, and applies the schema automatically. Keep that terminal open. To use an external PostgreSQL server instead, update `DATABASE_URL`, create the database, and run `npm run db:migrate`.

## 3. How to run it

With the local database running in the first terminal, start the React frontend and Express API in a second terminal:

```sh
npm run dev
```

Open **http://localhost:5173**. A working app displays **API connected**. A new database shows zero-valued cards and a **No items yet** panel. Press **Ctrl+C** to stop both processes.

Build and preview the production version:

```sh
npm run build
npm run preview
```

The build creates `dist/`. The preview normally uses **http://localhost:4173**, but the printed address is the source of truth.

### Run the automated tests

Keep `npm run db:local` running, then run:

```sh
npm test
```

This runs validation unit tests, API integration tests, accessibility checks, and Chromium, Firefox, and WebKit browser tests. Temporary test records are identified by their returned IDs and removed afterward. Use `npm run test:unit`, `npm run test:api`, or `npm run test:e2e` to run one layer.

## 4. Features and usage

### Primary flow

1. Open the **Dashboard** to view the total item, category-in-use, and recently-added counts. A new database starts at zero.
2. Open **My Items** to view, search, and filter saved records.
3. Click **Add Item** or **Add your first item** to open the item form.
4. Enter an item name, category, and condition. Brand, location, date acquired, and notes are optional.
5. Press **Add Item**. The API validates the input, PostgreSQL saves it, and the application opens Item Details.
6. Choose **Edit Item**, change the fields, and press **Save Changes** to update the record.
7. Choose **Delete Item**, then keep or permanently remove the item from the confirmation dialog.
8. Open **View screen flow** in the footer to inspect the planned navigation. On mobile, use the menu button beside the app name.

| Screen          | Route               | Current behavior                                 |
| --------------- | ------------------- | ------------------------------------------------ |
| Dashboard       | `/#/`               | Live item, category, and recent-item counts      |
| My Items        | `/#/items`          | Saved records with search and category filtering |
| Add Item        | `/#/add`            | Validated form that creates a PostgreSQL record  |
| Navigation flow | `/#/flow`           | Planned five-screen flow diagram                 |
| Item Details    | `/#/items/:id`      | Displays one saved item                          |
| Edit Item       | `/#/items/:id/edit` | Updates an existing PostgreSQL record            |

Item IDs come from PostgreSQL. Add, edit, and delete actions update the database immediately. Search, category filtering, sorting, and pagination are processed by the API.

| Method   | Endpoint         | Purpose                                                             |
| -------- | ---------------- | ------------------------------------------------------------------- |
| `GET`    | `/api/health`    | Check API and database connectivity                                 |
| `GET`    | `/api/items`     | List items with search, category, sort, page, and page-size queries |
| `GET`    | `/api/items/:id` | Retrieve one item                                                   |
| `POST`   | `/api/items`     | Validate and create an item                                         |
| `PUT`    | `/api/items/:id` | Validate and update an item                                         |
| `DELETE` | `/api/items/:id` | Permanently delete an item                                          |

## 5. Project structure

```text
src/
  api.js            Frontend API requests
  main.jsx          Navigation, components, and screen interfaces
  inventory.js      Category and condition options
  ProductArt.jsx    Vector placeholders for item layouts
  styles.css        Shared and responsive styles
public/
  favicon.svg       Application icon
server/
  app.js            Express routes and validation
  db.js             PostgreSQL connection pool
  index.js          API entry point
  db/schema.sql     Items table migration
  scripts/migrate.js  Migration runner
tests/
  validation.test.js       Item validation unit tests
  api.integration.test.js  Real PostgreSQL API integration tests
  crud.e2e.test.js         Desktop/mobile browser workflow tests
Dockerfile                 Production Node.js container
compose.yaml               App and PostgreSQL container stack
DEPLOYMENT.md              Production and container deployment guide
docs/
  README.md         This documentation copy
  previews/         Desktop and mobile screenshots
project/
  README.md         Workspace documentation links
  REPORT.md         Workspace weekly report
index.html          Application entry page
vite.config.js      Vite configuration
package.json        Dependencies and npm commands
package-lock.json   Locked dependency versions
README.md           Main repository documentation
WIREFRAME.md        Design and navigation reference
REPORT.md           Weekly Increment Report
```

`node_modules/` and `dist/` are generated locally and ignored by Git.

## 6. Screenshots

The images below are embedded from `docs/previews/`. In VS Code, open the rendered Markdown preview with **Ctrl+Shift+V** (Windows/Linux) or **Cmd+Shift+V** (macOS) to see them instead of the Markdown source.

### Dashboard — desktop

<img src="./previews/dashboard-desktop.png" alt="Gamit Check empty Dashboard on desktop" width="100%">

### Dashboard — mobile

<img src="./previews/dashboard-mobile.png" alt="Gamit Check empty Dashboard on mobile" width="390">

### My Items — desktop

<img src="./previews/my-items-desktop.png" alt="Gamit Check empty My Items screen on desktop" width="100%">

### My Items — mobile

<img src="./previews/my-items-mobile.png" alt="Gamit Check empty My Items screen on mobile" width="390">

### Add Item — desktop

<img src="./previews/add-item-desktop.png" alt="Gamit Check Add Item form on desktop" width="100%">

### Navigation flow — desktop

<img src="./previews/navigation-flow-desktop.png" alt="Gamit Check navigation flow on desktop" width="100%">

See the [complete screenshot gallery](previews/README.md) for mobile layouts and other screens. The populated Item Details, Edit Item, and Delete confirmation screenshots are historical design references and do not represent current records.

## 7. Known issues and next steps

- The database process must remain running while the application is used.
- Automated axe checks and keyboard skip navigation pass, but a manual screen-reader review is still recommended before public release.
- The local repository and container configuration are ready. Publishing still requires the owner's Git host and deployment accounts; afterward, replace `<REPOSITORY_URL>` and add the public URL.

### Production deployment

The production Express process serves both the built React interface and the API. `Dockerfile` and `compose.yaml` provide a containerized app and PostgreSQL stack. Follow the [deployment guide](../DEPLOYMENT.md) for commands, environment variables, health checks, and release verification.

Related documents:

- [Main repository README](../README.md)
- [Wireframe reference](../WIREFRAME.md)
- [Weekly Increment Report](../REPORT.md)
