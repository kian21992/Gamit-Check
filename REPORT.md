## Week of: September 14, 2026

Updated: September 20, 2026

## What changed this week

- Created the Gamit Check frontend wireframe using React, Vite, JavaScript, and CSS, with Codex assistance.
- Built the Dashboard, My Items, Add Item, Item Details, and Edit Item interfaces. Added shared navigation and a screen-flow diagram.
- Added the requested item fields: name, category, brand, condition, location, date acquired, and notes. Required fields use browser validation.
- Prototyped search, category filtering, table/grid views, pagination, and a delete-confirmation dialog using sample items. These controls now operate on records loaded from the API.
- Added responsive layouts, including a mobile navigation menu, inventory cards, and stacked form fields. Increased small text and fixed uneven spacing between fields on narrow screens.
- Removed all 24 sample items after the initial wireframe review. The inventory now starts empty. Dashboard counts are zero, and Dashboard and My Items show a "No items yet" message with an "Add your first item" link. Item Details and Edit Item components remain in the code, but there are no existing items to open or edit.
- Added setup instructions, a wireframe reference, and desktop/mobile screenshots. Updated the empty-state screenshots; earlier populated detail/edit screenshots are labeled as historical design references.
- Confirmed that the production build passes. Browser checks covered the initial screen flows and responsive layouts, followed by checks of the empty inventory, zero counts, Add Item navigation, and unavailable former sample-item URLs.
- Added an Express API and PostgreSQL connection pool, environment template, database migration, server-side validation, and health, list, detail, and create endpoints.
- Connected React to the API. Add Item now creates a database record, then opens Item Details; Dashboard and My Items use records returned by the API.
- Added a persistent workspace-local PostgreSQL 18 development cluster and verified the migration against it.
- Completed a real browser-to-API-to-PostgreSQL test: created an item, refreshed Item Details, retrieved it again, verified My Items, and removed only the verification record afterward.
- Completed Iteration 2 (server and database foundation) and Iteration 3 (add, list, and view items), including desktop and mobile verification against the real local database.
- Completed Iteration 4 with validated update and delete API endpoints, a persistent Edit Item form, deletion confirmation and cancellation, React state updates, and navigation after removal.
- Verified the full create, read, update, and delete workflow in desktop and mobile Chrome against PostgreSQL, including persistence after refresh and cleanup of only the temporary verification records.
- Completed Iteration 5 with field-specific form errors, accessible invalid-field descriptions, clearer network/database messages, and a retry action for failed inventory loads.
- Added a maintained `npm test` suite with validation unit tests, real PostgreSQL API integration tests, and browser CRUD and recovery tests. All 16 tests pass, and the dependency audit reports no vulnerabilities.
- Completed Iteration 6 by moving search, category filtering, four sort modes, and pagination to validated API queries. Added WCAG axe checks, keyboard skip-navigation coverage, and Chromium, Firefox, and WebKit smoke tests; contrast issues discovered by axe were corrected.
- Completed the local work for Iteration 7: Express serves the production React build, a multi-stage Dockerfile and PostgreSQL Compose stack are included, a health check and automatic migration are configured, and the deployment guide documents hosted environment variables and release checks.
- Verified the production build directly on port 3100: the root page, JavaScript asset, database health endpoint, paginated inventory endpoint, and unknown-API 404 all responded correctly.

## Why

These changes establish the interface and the first functional data flow for a personal inventory application. A new user starts with an empty PostgreSQL table, can add an item, and can view the saved item in the inventory and details screens.

The current functional scope is complete CRUD: Create, Read, Update, and Delete. Authentication remains intentionally excluded from the personal-use project scope.

## What broke or what I got stuck on

- The first visual review showed that some labels were too small. Increasing the text sizes improved readability. A later mobile review found missing spacing between some form fields; this was corrected.
- The in-app browser tool was unavailable, so verification used local Chrome instead. Some automated checks initially failed because of an incorrect search-field role and a terminal encoding issue with an apostrophe. The checks were corrected; these were test-tool issues rather than application failures.
- Removing the sample items left the original recent-items and category sections without useful content and made the sample-item links invalid. Empty states were added, and the flow diagram no longer links to nonexistent sample items.
- PostgreSQL was not installed system-wide. A workspace-local PostgreSQL cluster was added instead, allowing real persistence testing without changing the required database technology.
- Installing the parallel-process development package initially hit a locked dependency folder. A retry succeeded, and `npm run dev` now starts both the API and Vite.
- The first recovery test conflicted with React Strict Mode's duplicate development request, and its mobile assertion targeted a status badge hidden on small screens. The test was corrected to simulate the outage until retry and assert the visible inventory result.
- The first accessibility run found insufficient contrast in secondary navigation, footer, form-placeholder, and helper text. Those colors were darkened and the WCAG scan now passes. Docker is not installed on this computer, so the production container could not be executed locally; the equivalent production Node server path was verified instead.

## What is left

- Publish the prepared local repository to the owner's Git host and deploy the included container using the owner's hosting and managed-PostgreSQL accounts.
- Replace documentation placeholders with the resulting repository and public application URLs, then perform a manual screen-reader review of the hosted release.
