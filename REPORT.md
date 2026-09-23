# Weekly Increment Report

## Week of: September 21, 2026

## What changed this week

- Created separate desktop wireframes for the Dashboard, My Items, Add Item, and Navigation Flow screens. The wireframes use boxes and labels to show each screen's layout without final visual styling.
- Completed a visual design system with the application's colour palette, typography scale, spacing scale, reusable components, responsive breakpoints, and accessibility checklist.
- Added shared colour, type, spacing, and page-padding tokens to `src/styles.css` so the implemented screens use the same design decisions.
- Exported the design system as PDF and DOCX files for submission in the class workspace.
- Cleaned the application repository by removing old planning documents and generated documentation files that were no longer part of the running app.
- Updated the main README and page metadata after the cleanup so they describe the current functional application and do not link to deleted files.
- Checked the production build and ran the complete automated test suite after the cleanup. The build succeeded and all 18 unit, API, accessibility, and browser tests passed.
- Reviewed the database and deployment setup. The application still uses PostgreSQL, and the existing Express API can use Supabase PostgreSQL later by changing the database connection environment variables.

## Why

The wireframes and design system were created to document the layout and shared visual rules before further interface changes. The CSS tokens make the implemented interface more consistent across screens. The repository cleanup keeps the application code focused and removes outdated files that could confuse someone running the project. Rebuilding and retesting the app confirmed that removing those files did not break CRUD operations, photos, search, filtering, pagination, or the responsive interface. Reviewing Supabase also clarified how the local PostgreSQL database can be replaced with a hosted database for deployment.

## What broke or what I got stuck on

- The documentation work became larger and more complicated than the assignment required, so it had to be simplified and the extra files were removed from the application repository.
- The DOCX design-system file could not be fully rendered for a visual check because LibreOffice was not installed. Its document structure and embedded design-system image were checked instead.
- The separate desktop wireframe images are currently stored outside the application repository, so they still need to be placed in the correct class submission location if they are required there.
- Supabase has not been connected yet because a Supabase project, hosted connection string, and production environment variables have not been configured.
- The application is still running against the local PostgreSQL setup and does not yet have a public deployment URL.

## What is left

- Create or select a Supabase project, apply `server/db/schema.sql`, and configure the hosted `DATABASE_URL` and SSL setting.
- Deploy the Express and React application to a public host and connect it to the hosted PostgreSQL database.
- Test create, view, edit, delete, search, filtering, pagination, and photo upload again in the deployed environment.
- Add the final public application URL to the README and class submission.
- Move the required wireframe images into the class workspace and submit their live links.
- Complete a manual screen-reader review and fix any accessibility issues found.
- As later code cleanup, split the large `src/main.jsx` file into page and reusable component files and consolidate the remaining duplicate CSS rules.
