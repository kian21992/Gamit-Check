# AI Usage Disclosure

Gamit Check was developed with extensive assistance from OpenAI Codex. No more than 80% of the project was AI-assisted. My independently written contribution includes `server/app.js`, `src/styles.css`, `src/inventory.js`, and `index.html`. This record identifies both kinds of work and links them to the repository history.

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
- **Received:** Guidance and supporting code for the database schema, connection pool, migration scripts, frontend API requests, and integration of the backend with React.
- **Kept or changed:** I wrote the final Express routes, validation, and SQL behavior in `server/app.js`. I kept PostgreSQL and the REST structure because they matched my approved stack. I required name, category, and condition while keeping brand, location, acquired date, and notes optional.
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

### Code I wrote myself

#### Express routes, validation, and PostgreSQL queries

- **File:** `server/app.js`
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I wrote the Express application that connects the frontend to PostgreSQL. The health route checks that the database can answer a query. The item-list route reads search, category, sort, page, and page-size values, builds the allowed filters, and uses parameterized queries so user input is not inserted directly into SQL. It also runs a count query so the response can include the total number of records and pages. The single-item, create, update, and delete routes validate IDs and item fields, return `404` for missing records, and use appropriate HTTP status codes. The image routes validate the MIME type and size before storing photo bytes and metadata in PostgreSQL. I kept validation in the server because browser validation can be bypassed by a direct API request.

#### Application styling and responsive behavior

- **File:** `src/styles.css`
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I wrote the shared styles for the navigation, Dashboard cards, inventory table and grid, forms, dialogs, empty states, feedback messages, and item details. I used shared colour, type, and spacing values so the screens remain consistent. The responsive rules change the sidebar into a mobile menu, replace wide table layouts with item cards, stack form fields and actions, and reduce page padding at smaller widths. These rules keep the interface usable on a 375 px phone without horizontal page scrolling.

#### Inventory options and date helper

- **File:** `src/inventory.js`
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I wrote the shared category and condition lists used by the forms and filtering controls. Keeping them in one module prevents Add Item, Edit Item, and My Items from using different options. I also wrote `formatDate`, which turns a stored `YYYY-MM-DD` value into a readable month, day, and year. Adding noon before formatting avoids a date moving backward because of a local timezone conversion.

#### HTML application entry point

- **File:** `index.html`
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** I wrote the HTML entry document used by Vite. It defines the language, character encoding, responsive viewport, page description, favicon, title, React root element, and module entry script. The viewport declaration is required for the responsive CSS to use the real device width instead of displaying a scaled desktop page on mobile.

Together, these files form a meaningful part of the project rather than an isolated cosmetic change. `server/app.js` contains the main Node, Express, and PostgreSQL behavior, while the other three files define the application's data choices, presentation, responsive behavior, and browser entry point.

### AI-written code I understand best: frontend API client

- **File:** `src/api.js`
- **Commit:** [b04a32b — Complete Gamit Check inventory application](https://github.com/kian21992/Gamit-Check/commit/b04a32b)
- **Explanation:** Codex wrote most of the frontend API client. Its request helper sends requests to the configured API address, checks whether a response succeeded, reads structured error messages, and throws an error that the React interface can display. The exported functions map user actions to the correct endpoint and HTTP method: listing and retrieving use `GET`, creating uses `POST`, editing and photo replacement use `PUT`, and deletion uses `DELETE`. Item responses are normalized so the React screens receive a consistent object shape. I kept this module because it prevents every component from repeating fetch and error-handling code and provides one place to change the API address for deployment.
