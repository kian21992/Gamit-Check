# Gamit Check Documentation

## 1. Overview

Gamit Check is a complete personal inventory web application for people who want to remember what they own, where they keep it, and its condition. React provides the interface, Express provides the API, and PostgreSQL stores item records and optional photos. The application includes persistent CRUD, server-side inventory queries, accessible error recovery, automated multi-browser tests, and a container-ready production build.

**Repository:** [github.com/kian21992/Gamit-Check](https://github.com/kian21992/Gamit-Check)

## 2. Wireframes & Component Breakdown

This section turns the sections in the [project proposal](https://github.com/HAU-6APSI/student-6apsi-2203-kian21992/blob/main/content/final-project-planning/01-proposal.md) into routes and React component boundaries. The sketches use only boxes and labels. They describe structure and responsive behavior without choosing colors, fonts, or decorative details.

The three images in this section are the submission-ready visual copies. Open an image, then save or copy it for submission:

- [Screen map picture](wireframe-screen-map.png)
- [Desktop and phone screen-sketch picture](wireframe-screen-sketches.png)
- [React component-tree picture](wireframe-component-tree.png)

### Step A: Screen map

The Dashboard is the first screen and the main home base. Dashboard, My Items, and Add Item remain available through the shared desktop navigation or phone menu. Every secondary screen has a route back to My Items or Dashboard.

```mermaid
flowchart TD
    Dashboard[Dashboard] -->|click View all items| Items[My Items]
    Dashboard -->|click Add Item| Add[Add Item]
    Dashboard -->|click a recent item| Details[Item Details]
    Dashboard -->|click a category| Items

    Items -->|click an item or View| Details
    Items -->|click Add Item| Add
    Items -->|click Edit| Edit[Edit Item]
    Items -->|click Delete| Confirm[Delete confirmation]

    Add -->|submit a valid item| Details
    Add -->|click Cancel| Items
    Details -->|click Edit Item| Edit
    Details -->|click Back to My Items| Items
    Details -->|click Delete Item| Confirm
    Edit -->|save changes| Details
    Edit -->|click Cancel| Details
    Confirm -->|click Keep Item or press Escape| Origin[Return to previous screen]
    Confirm -->|confirm Delete Item| Items

    Dashboard -->|click View screen flow| Flow[Navigation flow]
    Flow -->|use shared navigation| Dashboard
```

The delete confirmation is a modal state rather than a separate URL. Item Details and Edit Item require an existing item ID. The remaining screens are directly reachable from the shared navigation.

<img src="./wireframe-screen-map.png" alt="Gamit Check screen map showing navigation between Dashboard, My Items, Add Item, Item Details, Edit Item, delete confirmation, and navigation flow" width="100%">

### Step B: Screen sketches

The shared desktop layout uses a navigation column, page header, main-content area, and footer. On a phone, the navigation collapses behind a menu button and all major content regions stack vertically.

<img src="./wireframe-screen-sketches.png" alt="Box-and-label desktop and phone wireframes for every Gamit Check screen" width="100%">

| Screen | Desktop layout | Phone layout | Navigates to |
| --- | --- | --- | --- |
| Dashboard | Navigation beside summary, recent items, and categories | Menu above stacked summary, recent items, and categories | My Items, Add Item, Item Details, Navigation flow |
| My Items | Toolbar above table or card grid and pagination | Controls wrap; records become stacked cards | Add Item, Item Details, Edit Item, Delete confirmation |
| Add Item | Form fields with a supporting information panel | One field per row; actions stack at narrow widths | Item Details after save, My Items on cancel |
| Item Details | Item image beside information and actions | Image, information, notes, and actions stack | My Items, Edit Item, Delete confirmation |
| Edit Item | Prefilled form with a supporting information panel | One field per row; actions stack at narrow widths | Item Details after save or cancel |
| Navigation flow | Route boxes arranged across the content area | Route boxes form a vertical sequence | Dashboard, My Items, Add Item |
| Delete confirmation | Centered dialog over the current screen | Dialog fits the phone width; actions can stack | Previous screen or My Items |

#### Dashboard

```text
DESKTOP
+----------------+---------------------------------------------+
| Shared nav     | Page heading                  [Add Item]    |
| - Dashboard    +-------------+-------------+-----------------+
| - My Items     | Total items | Categories  | Recently added  |
| - Add Item     +-------------+-------------+-----------------+
|                | Recent items / empty-state panel            |
|                +---------------------------------------------+
|                | Category cards                              |
+----------------+---------------------------------------------+
| Shared footer                                                |
+--------------------------------------------------------------+

PHONE
+--------------------------------+
| App name              [Menu]   |
+--------------------------------+
| Page heading          [Add]    |
+----------+----------+----------+
| Total    | Category | Recent   |
+----------+----------+----------+
| Recent items / empty state    |
+--------------------------------+
| Category card                 |
| Category card                 |
+--------------------------------+
| Shared footer                 |
+--------------------------------+
```

#### My Items

```text
DESKTOP
+----------------+---------------------------------------------+
| Shared nav     | Page heading                  [Add Item]    |
|                +---------------------------------------------+
|                | [Search] [Category] [Sort] [View switch]   |
|                +---------------------------------------------+
|                | Item table or repeated item cards          |
|                | [Item row] [Item row] [Item row]            |
|                +---------------------------------------------+
|                | Pagination                                  |
+----------------+---------------------------------------------+
| Shared footer                                                |
+--------------------------------------------------------------+

PHONE
+--------------------------------+
| App name              [Menu]   |
+--------------------------------+
| Page heading          [Add]    |
+--------------------------------+
| Search                         |
| Category filter               |
| Sort and view controls        |
+--------------------------------+
| Item card                     |
| Item card                     |
+--------------------------------+
| Pagination                    |
+--------------------------------+
| Shared footer                 |
+--------------------------------+
```

#### Add Item

```text
DESKTOP
+----------------+---------------------------------------------+
| Shared nav     | Page heading                                |
|                +-----------------------------+---------------+
|                | Item form                   | Help panel    |
|                | [Name]      [Category]      |               |
|                | [Brand]     [Condition]     |               |
|                | [Location]  [Date]          |               |
|                | [Notes]                     |               |
|                | [Photo upload / preview]    |               |
|                | [Cancel] [Add Item]         |               |
+----------------+-----------------------------+---------------+
| Shared footer                                                |
+--------------------------------------------------------------+

PHONE
+--------------------------------+
| App name              [Menu]   |
+--------------------------------+
| Page heading                   |
+--------------------------------+
| Name field                     |
| Category field                 |
| Brand field                    |
| Condition field                |
| Location field                 |
| Date field                     |
| Notes field                    |
| Photo upload / preview         |
| Help panel                     |
| [Cancel]                       |
| [Add Item]                     |
+--------------------------------+
| Shared footer                 |
+--------------------------------+
```

#### Item Details

```text
DESKTOP
+----------------+---------------------------------------------+
| Shared nav     | Back link                                   |
|                +----------------------+----------------------+
|                | Photo / artwork      | Item name            |
|                |                      | Condition badge      |
|                |                      | Item information    |
|                |                      | Notes               |
|                |                      | [Edit] [Delete]     |
+----------------+----------------------+----------------------+
| Shared footer                                                |
+--------------------------------------------------------------+

PHONE
+--------------------------------+
| App name              [Menu]   |
+--------------------------------+
| Back link                      |
| Photo / artwork                |
| Item name                      |
| Condition badge               |
| Item information              |
| Notes                          |
| [Edit Item]                    |
| [Delete Item]                  |
+--------------------------------+
| Shared footer                 |
+--------------------------------+
```

#### Edit Item

```text
DESKTOP
+----------------+---------------------------------------------+
| Shared nav     | Page heading                                |
|                +-----------------------------+---------------+
|                | Prefilled item form         | Help panel    |
|                | [Name]      [Category]      |               |
|                | [Brand]     [Condition]     |               |
|                | [Location]  [Date]          |               |
|                | [Notes]                     |               |
|                | [Photo replace / remove]    |               |
|                | [Cancel] [Save Changes]     |               |
+----------------+-----------------------------+---------------+
| Shared footer                                                |
+--------------------------------------------------------------+

PHONE
+--------------------------------+
| App name              [Menu]   |
+--------------------------------+
| Page heading                   |
+--------------------------------+
| Prefilled fields               |
| Photo replace / remove         |
| Help panel                     |
| [Cancel]                       |
| [Save Changes]                 |
+--------------------------------+
| Shared footer                 |
+--------------------------------+
```

#### Navigation flow

```text
DESKTOP
+----------------+---------------------------------------------+
| Shared nav     | Page heading                                |
|                +---------------------------------------------+
|                | [Dashboard] -> [My Items] -> [Details]      |
|                |      |             |             |          |
|                |  [Add Item]     [Edit Item]  [Delete]       |
+----------------+---------------------------------------------+
| Shared footer                                                |
+--------------------------------------------------------------+

PHONE
+--------------------------------+
| App name              [Menu]   |
+--------------------------------+
| Page heading                   |
| [Dashboard]                    |
|      |                         |
| [My Items]                     |
|      |                         |
| [Item Details]                 |
| [Add] [Edit] [Delete]          |
+--------------------------------+
| Shared footer                 |
+--------------------------------+
```

#### Delete confirmation

```text
DESKTOP                              PHONE
+-----------------------------+     +-------------------------+
| Dialog title                |     | Dialog title            |
| Consequence message         |     | Consequence message     |
| [Keep Item] [Delete Item]   |     | [Keep Item]             |
+-----------------------------+     | [Delete Item]           |
                                    +-------------------------+
```

### Step C: Component tree

My Items is the busiest screen because it combines navigation, server query controls, repeated inventory records, pagination, deletion, and feedback states. The proposed tree is:

<img src="./wireframe-component-tree.png" alt="Gamit Check React component tree and atomic-design breakdown" width="100%">

```text
AppLayout
|-- Sidebar
|   |-- Logo
|   |-- NavLink (repeated)
|   `-- AddButton
|-- MainContent
|   `-- MyItemsPage
|       |-- PageHeading
|       |-- InventoryToolbar
|       |   |-- SearchField
|       |   |-- FilterSelect
|       |   |-- SortSelect
|       |   `-- ViewToggle
|       |-- InventoryResults
|       |   |-- ItemTable
|       |   |   `-- ItemRow (repeated with item ID as key)
|       |   `-- ItemGrid
|       |       `-- ItemCard (repeated with item ID as key)
|       |-- EmptyInventory
|       `-- Pagination
|-- Footer
|-- Toast
`-- DeleteDialog
```

| Atomic-design level | Purpose | Gamit Check components |
| --- | --- | --- |
| Atoms | Small controls or visual elements | `Icon`, `Logo`, `Button`, `Input`, `Select`, `Textarea`, `Badge`, `NavLink` |
| Molecules | Small groups of atoms with one task | `AddButton`, `PageHeading`, `SearchField`, `FilterSelect`, `SortSelect`, `ViewToggle`, `FormField`, `ItemArtwork`, `ItemRow`, `ItemCard`, `Pagination`, `Toast` |
| Organisms | Complete interface regions | `Sidebar`, `InventoryToolbar`, `InventoryResults`, `ItemForm`, `ItemDetailsPanel`, `DeleteDialog`, `DashboardSummary`, `RecentItems`, `CategoryList`, `FlowDiagram`, `Footer` |
| Pages/layout | Route-level composition and shared shell | `AppLayout`, `DashboardPage`, `MyItemsPage`, `AddItemPage`, `ItemDetailsPage`, `EditItemPage`, `FlowPage` |

Repeated item rows and cards receive an item object through props and use the PostgreSQL item ID as the React key. Atoms stay independent of molecules and organisms. Several of these boundaries currently live together in `src/main.jsx`; the table defines how they can be extracted into `src/components/` without changing behavior.

Suggested folders:

```text
src/
  components/
    atoms/
    molecules/
    organisms/
  layouts/
    AppLayout.jsx
  pages/
    DashboardPage.jsx
    MyItemsPage.jsx
    AddItemPage.jsx
    ItemDetailsPage.jsx
    EditItemPage.jsx
    FlowPage.jsx
```

### Step D: Sanity check

The most important user task is adding an item and finding it again:

1. The user lands on **Dashboard** and clicks **Add Item**.
2. **Add Item** owns the draft field values, field errors, photo preview, and submitting state.
3. A valid submission creates the item through `POST /api/items`; an optional photo is stored through `PUT /api/items/:id/image`.
4. The app opens **Item Details** using the returned PostgreSQL ID so the user can verify the saved record.
5. The user clicks **Back to My Items** and can search, filter, sort, or page through the server-backed inventory.
6. The shared navigation provides a route back to **Dashboard** at every step.

No screen is stranded. Cancel returns Add Item to My Items and Edit Item to Item Details. Deleting requires confirmation; keeping the item returns to the originating screen, while confirming deletion returns to My Items.

| State | Owning component or layer |
| --- | --- |
| Current route, global item summary, mobile menu, toast, delete target | `App` / `AppLayout` |
| Search, category, sort, page, view mode, query loading and errors | `MyItemsPage` |
| Item fields, validation errors, photo preview, submission status | `ItemForm` |
| Selected record and its loading/error state | `ItemDetailsPage` or `EditItemPage` |
| Delete progress and delete error | `DeleteDialog` |
| Persistent records, image bytes, filtering, sorting, pagination | Express API and PostgreSQL |

The screen map becomes the hash routes and navigation links. Each labelled box is a component candidate, and the phone stacking notes map to the responsive rules in `src/styles.css`.

## 3. Design System

<img src="./design-system.png" alt="Gamit Check design system showing the colour palette, type scale, spacing, reusable components, responsive layouts, and accessibility checks" width="100%">

[Download the design-system picture](design-system.png) | [Download the PDF](design-system.pdf)

### Step A: Choose your styling approach

**My approach:** Plain CSS. The tokens are stored as `:root` custom properties in `src/styles.css`.

### Step B: Colour tokens

| Token | Role | Colour |
| --- | --- | --- |
| `--color-primary` | Links, buttons, active states | `#256B4A` |
| `--color-accent` | Destructive call-to-action | `#B42318` |
| `--color-bg` | Page background | `#F6F7F8` |
| `--color-surface` | Cards and panels | `#FFFFFF` |
| `--color-text` | Body text | `#1F2937` |

All text-on-background combinations pass the required **4.5:1** contrast ratio.

### Step C: Type scale

| Style | Size | Weight | Used for |
| --- | ---: | --- | --- |
| Heading | 28 px | Bold | Screen and section titles |
| Body | 14 px | Regular | Paragraphs and lists |
| Small | 12 px | Regular | Captions, labels, and footer |

### Step D: Spacing rule

The base spacing unit is **8 px**.

- Tight spacing: **8 px** (`--space-1`)
- Standard spacing: **32 px** (`--space-4`)
- Screen-edge padding: **32 px on desktop** and **18 px on phone**

### Step E: Reusable components

| Component | Level | Appears on | Props it takes |
| --- | --- | --- | --- |
| `Button` | Atom | Every screen with actions | `variant`, `disabled`, `onClick`, `children` |
| `ConditionBadge` | Atom | Dashboard, My Items, Item Details | `condition` |
| `FormField` | Molecule | Add Item, Edit Item | `label`, `name`, `required`, `error`, `children` |
| `ItemCard` | Molecule | Dashboard, My Items | `item`, `actions`, `onDelete` |
| `PageHeading` | Molecule | Every main screen | `eyebrow`, `title`, `description`, `action` |
| `Sidebar` | Organism | Every main screen | `active`, `open`, `close`, `itemCount` |
| `ItemForm` | Organism | Add Item, Edit Item | `item`, `onCreated`, `onUpdated` |
| `Footer` | Organism | Every main screen | `children` |

The project uses custom components built with React and Plain CSS. It does not use a UI component library.

### Step F: Responsive plan

- **760 px and below:** the navigation collapses, cards use one column, form fields stack, and page padding becomes 18 px.
- **761 px and above:** the sidebar stays visible, cards can use multiple columns, and related form fields sit side by side.
- The page does not scroll horizontally at **375 px** wide.

### Accessibility check

- [x] Every text-on-background pair passes 4.5:1 contrast.
- [x] The app uses semantic elements such as `<nav>`, `<main>`, and `<button>`.
- [x] Meaningful images have alt text and decorative images are hidden.
- [x] Every form input has a matching label.
- [x] Every link and button can be reached with Tab and has a visible focus state.

### What to keep

- The colour, type, and spacing tokens are stored in `src/styles.css`.
- Reusable components are shared across the React screens.
- The responsive plan is implemented with CSS media queries.

## 4. Setup and installation

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
   git clone https://github.com/kian21992/Gamit-Check.git gamit-check
   cd gamit-check
   ```

   Alternatively, download the project ZIP from GitHub, extract it, and open a terminal in the folder containing `package.json`.

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

## 5. How to run it

With the local database running in the first terminal, start the React frontend and Express API in a second terminal:

```sh
npm run dev
```

Open **http://localhost:5173**. A working app displays **API connected**. A new database shows zero-valued cards and a **No items yet** panel. Press **Ctrl+C** to stop both processes.

Build the production version:

```sh
npm run build
```

The build creates `dist/`. With PostgreSQL still running, start the production server in PowerShell:

```powershell
$env:NODE_ENV="production"
npm start
```

Open **http://localhost:3000**. Express serves the built interface and API from the same address.

### Run the automated tests

Keep `npm run db:local` running, then run:

```sh
npm test
```

This runs 18 validation, API, photo, accessibility, and Chromium/Firefox/WebKit browser tests. Temporary test records are identified by their returned IDs and removed afterward. Use `npm run test:unit`, `npm run test:api`, or `npm run test:e2e` to run one layer.

## 6. Features and usage

### Primary flow

1. Open the **Dashboard** to view the total item, category-in-use, and recently-added counts. A new database starts at zero.
2. Open **My Items** to view, search, and filter saved records.
3. Click **Add Item** or **Add your first item** to open the item form.
4. Enter an item name, category, and condition. Brand, location, date acquired, notes, and an item photo are optional.
5. Optionally choose a JPEG, PNG, or WebP photo up to 3 MB, then press **Add Item**. The API validates and stores the record and photo before opening Item Details.
6. Choose **Edit Item** to update fields, replace or remove the photo, and press **Save Changes**.
7. Choose **Delete Item**, then keep or permanently remove the item from the confirmation dialog.
8. Open **View screen flow** in the footer to inspect the planned navigation. On mobile, use the menu button beside the app name.

| Screen          | Route               | Current behavior                                 |
| --------------- | ------------------- | ------------------------------------------------ |
| Dashboard       | `/#/`               | Live item, category, and recent-item counts      |
| My Items        | `/#/items`          | Saved records with search and category filtering |
| Add Item        | `/#/add`            | Validated form that creates a PostgreSQL record  |
| Navigation flow | `/#/flow`           | Implemented five-screen flow diagram             |
| Item Details    | `/#/items/:id`      | Displays one saved item                          |
| Edit Item       | `/#/items/:id/edit` | Updates an existing PostgreSQL record            |

Item IDs come from PostgreSQL. Add, edit, and delete actions update the database immediately. Search, category filtering, sorting, and pagination are processed by the API.

| Method   | Endpoint               | Purpose                                                             |
| -------- | ---------------------- | ------------------------------------------------------------------- |
| `GET`    | `/api/health`          | Check API and database connectivity                                 |
| `GET`    | `/api/items`           | List items with search, category, sort, page, and page-size queries |
| `GET`    | `/api/items/:id`       | Retrieve one item                                                   |
| `POST`   | `/api/items`           | Validate and create an item                                         |
| `PUT`    | `/api/items/:id`       | Validate and update an item                                         |
| `DELETE` | `/api/items/:id`       | Permanently delete an item                                          |
| `GET`    | `/api/items/:id/image` | Retrieve an item's photo                                            |
| `PUT`    | `/api/items/:id/image` | Upload or replace a JPEG, PNG, or WebP photo                        |
| `DELETE` | `/api/items/:id/image` | Remove an item's photo                                              |

## 7. Project structure

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
  design-system.html  Editable visual design-system source
  design-system.png   Submission-ready design-system image
  design-system.pdf   Print-ready design-system export
  wireframes-visual.html  Editable wireframe visual source
  wireframe-screen-map.png  Submission-ready screen map
  wireframe-screen-sketches.png  Desktop and phone wireframes
  wireframe-component-tree.png  React component breakdown
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

## 8. Screenshots

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

See the [complete screenshot gallery](previews/README.md) for current desktop and mobile layouts of every major screen.

## 9. Known issues and next steps

- The database process must remain running while the application is used.
- Automated axe checks and keyboard skip navigation pass, but a manual screen-reader review is still recommended before public release.
- Photos are stored in PostgreSQL and limited to 3 MB each to keep database storage manageable.
- The repository is published at [github.com/kian21992/Gamit-Check](https://github.com/kian21992/Gamit-Check). A container-host account is still required to publish the application and add its public URL.

### Production deployment

The production Express process serves both the built React interface and the API. `Dockerfile` and `compose.yaml` provide a containerized app and PostgreSQL stack. Follow the [deployment guide](../DEPLOYMENT.md) for commands, environment variables, health checks, and release verification.

Related documents:

- [Main repository README](../README.md)
- [Wireframe reference](../WIREFRAME.md)
- [Weekly Increment Report](../REPORT.md)
