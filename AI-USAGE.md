# AI Usage Disclosure

Gamit Check was developed with extensive assistance from OpenAI Codex. I estimate that about 80% of the implementation was AI-assisted and about 20% came from my project requirements, interface decisions, review, testing, corrections, and edits. This record uses real commits and does not claim that AI-generated files were written independently by me.

## 1. How I used AI

### September 20, 2026 — Interface and navigation

- **Tool:** OpenAI Codex
- **Asked for:** A responsive React application based on my Gamit Check proposal, with Dashboard, My Items, Add Item, Item Details, and Edit Item screens.
- **Received:** React screen structure, hash navigation, forms, empty states, shared interface sections, and responsive CSS.
- **Kept or changed:** I kept the main screen structure. I chose the inventory fields, requested an empty starting inventory, and asked for clearer empty-state actions and mobile spacing corrections.
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)

### September 20, 2026 — Express and PostgreSQL

- **Tool:** OpenAI Codex
- **Asked for:** A functional backend and database instead of preview-only forms.
- **Received:** The database schema, connection pool, migration scripts, server validation, REST endpoints, and frontend API requests for CRUD operations.
- **Kept or changed:** I kept PostgreSQL and the REST structure because they matched my approved stack. I required name, category, and condition while keeping brand, location, acquired date, and notes optional.
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)

### September 20, 2026 — Testing and accessibility

- **Tool:** OpenAI Codex
- **Asked for:** Testing after every completed iteration and an overall functional check.
- **Received:** Validation tests, PostgreSQL API integration tests, and Playwright workflows for CRUD, mobile layouts, keyboard access, axe accessibility checks, and three browsers.
- **Kept or changed:** I kept tests that exercise real workflows. Test records use unique names and returned IDs so cleanup does not delete existing inventory.
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)

### September 20, 2026 — Item photos

- **Tool:** OpenAI Codex
- **Asked for:** Persistent photo support as the next application feature.
- **Received:** Image database columns and endpoints, upload validation, previews, replace/remove controls, and photo tests.
- **Kept or changed:** I kept JPEG, PNG, and WebP support, selected the 3 MB limit, and kept photos in PostgreSQL so records and photos share one backup and deployment setup.
- **Commit:** [dd4e7a5 — Add persistent item photos](https://github.com/kian21992/Gamit-Check/commit/dd4e7a5)

### September 20, 2026 — Documentation

- **Tool:** OpenAI Codex
- **Asked for:** Documentation that lets a new reader install, run, understand, and test the completed application.
- **Received:** Setup steps, environment variables, database instructions, routes, endpoints, project structure, screenshots, and limitations.
- **Kept or changed:** I checked the instructions against the real npm scripts, replaced the placeholder repository address, and made the README describe the working backend instead of the earlier frontend-only wireframe.
- **Commit:** [0ac91b4 — Refresh README and application screenshots](https://github.com/kian21992/Gamit-Check/commit/0ac91b4)

### September 20, 2026 — Wireframes

- **Tool:** OpenAI Codex
- **Asked for:** A screen map, desktop and phone sketches, and React component breakdown based on my proposal.
- **Received:** Route diagrams, box-and-label layouts, a component tree, and atomic-design categories.
- **Kept or changed:** I kept the four main desktop wireframes and asked for them as separate images. I requested plain structural sketches based on my reference image instead of polished screenshots.
- **Commit:** [a13e9c1 — Add submission-ready wireframe images](https://github.com/kian21992/Gamit-Check/commit/a13e9c1)

### September 20, 2026 — Design system

- **Tool:** OpenAI Codex
- **Asked for:** The completed design-system worksheet and its required visual submission.
- **Received:** A palette, type scale, spacing scale, component examples, responsive rules, and accessibility checklist.
- **Kept or changed:** I kept plain CSS, a five-colour palette, and an 8 px spacing base. I asked for the first written version to be shortened because it exceeded what the assignment required.
- **Commit:** [9d6a57b — Add visual design system documentation](https://github.com/kian21992/Gamit-Check/commit/9d6a57b) and [76682a2 — Simplify design system section](https://github.com/kian21992/Gamit-Check/commit/76682a2)

### September 23, 2026 — Weekly report

- **Tool:** OpenAI Codex
- **Asked for:** An updated weekly report based on the work completed since the previous report.
- **Received:** A report covering the design work, repository cleanup, tests, database status, problems, and remaining deployment tasks.
- **Kept or changed:** I shortened the draft and kept wording that accurately described the application as functional locally but not publicly deployed.
- **Commit:** [a315ca8 — Add weekly increment report for September 21](https://github.com/kian21992/Gamit-Check/commit/a315ca8)

## 2. Where the AI got it wrong

### 1. It made the early wireframe look functional before persistence existed

- **AI output:** Populated sample records and controls that appeared to work even though they did not save data.
- **Problem:** This hid the actual project status and did not represent a new user's first experience.
- **My correction:** I requested removal of all sample records, zero Dashboard counts, “No items yet” messages, and a clear route to Add Item. Real persistence was then added through Express and PostgreSQL.
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)

### 2. It left documentation describing an obsolete frontend-only version

- **AI output:** Documentation stating that the API, database, and persistent CRUD operations did not exist.
- **Problem:** Those claims became false after backend integration. Following the old instructions would also leave PostgreSQL stopped and cause “Could not load inventory.”
- **My correction:** I checked the scripts and environment variables and updated the README with the database startup step, real endpoints, tests, and current status.
- **Commit:** [0ac91b4 — Refresh README and application screenshots](https://github.com/kian21992/Gamit-Check/commit/0ac91b4)

### 3. It overcomplicated the planning documentation

- **AI output:** Several long Markdown, HTML, image, PDF, and editable planning files inside the application repository.
- **Problem:** The assignment needed clear submission visuals, while the extra files mixed course artifacts with runtime files and made the repository harder to understand.
- **My correction:** I simplified the design-system section, removed obsolete planning artifacts, and fixed links and page metadata afterward.
- **Commit:** [76682a2 — Simplify design system section](https://github.com/kian21992/Gamit-Check/commit/76682a2) and [7e6d0bc — Remove project documentation artifacts](https://github.com/kian21992/Gamit-Check/commit/7e6d0bc)

## 3. Who wrote what

### My contribution

The project used extensive Codex assistance. My clearest contribution is the product definition and the decisions used to accept, reject, test, or revise generated work. I do not claim that the following files were produced without AI.

#### Inventory model and rules

- **Files:** `src/inventory.js`, `server/app.js`, `server/db/schema.sql`
- **Commit:** [b04a32b](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I defined the item fields, categories, conditions, and which fields are required. The same rules appear in the form, server validation, and schema so invalid data cannot bypass the React interface.

#### Empty-first workflow

- **Files:** `src/main.jsx`, `src/styles.css`
- **Commit:** [b04a32b](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I decided to remove sample items. A new database therefore shows zero totals and an empty state with a direct Add Item action. This makes it clear that every displayed item is stored data.

#### Responsive review and corrections

- **Files:** `src/main.jsx`, `src/styles.css`
- **Commit:** [b04a32b](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I reviewed desktop and phone layouts and identified small text, crowded fields, and wide table layouts. I requested and checked the mobile menu, stacked fields, wrapped controls, and mobile cards so a 375 px screen does not scroll horizontally.

#### Repository scope

- **Files:** `README.md`, `index.html`, and removed planning artifacts
- **Commit:** [7e6d0bc](https://github.com/kian21992/Gamit-Check/commit/7e6d0bc)
- **Explanation:** I decided the app repository should focus on the working application. I requested removal of extra course artifacts and checked that the remaining README and metadata did not reference deleted files.

### AI-written code I understand best: inventory REST API

- **File:** `server/app.js`
- **Commit:** [b04a32b](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** Codex wrote most of this Express API. The list route reads search, category, sort, page, and page-size parameters. Parameterized PostgreSQL queries keep user values separate from SQL text. Other routes validate data before inserts or updates, return `404` for missing IDs, and return error responses when input or the database fails. I kept this structure because it separates database work from React and applies validation to every client. Integration tests verify it using real temporary PostgreSQL records.

## Authorship note

This disclosure is accurate to the available project history. My contribution is strongest in the requirements, data fields, workflow decisions, responsive review, testing decisions, and corrections. Codex generated a large part of the implementation. Before claiming that at least 20% of the code was independently written by me, I must be able to identify and explain the exact lines I personally authored or substantially rewrote.
