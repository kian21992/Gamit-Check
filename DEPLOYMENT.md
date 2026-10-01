# Gamit Check deployment

Gamit Check uses Supabase for hosted PostgreSQL and Vercel as the target host for the React interface and Express API. Item photos are stored in PostgreSQL and limited to 3 MB each.

## Current status

- The Supabase Transaction pooler is configured locally.
- `server/db/schema.sql` has been applied successfully.
- All seven API integration tests pass against Supabase.
- The React and Express application still needs to be imported and configured in Vercel.

## Supabase

Use the **Transaction pooler** URI from the Supabase Connect dialog. It normally uses port `6543`. Configure these private values locally and in Vercel:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Supabase Transaction pooler URI |
| `DATABASE_POOL_MAX` | `1` |
| `DATABASE_SSL` | `true` |

Never commit the connection string. To create or update the database schema, run:

```sh
npm run db:migrate
```

## Vercel target configuration

The Vercel project will need the following environment variables:

| Variable | Production value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Supabase Transaction pooler URI |
| `DATABASE_POOL_MAX` | `1` |
| `DATABASE_SSL` | `true` |
| `CLIENT_ORIGIN` | Final Vercel application origin |
| `VITE_API_URL` | Empty when the UI and API share the same origin |

Before importing the repository, add the Vercel Express entry and routing configuration, then verify it locally. Do not run the schema migration automatically for every serverless request.

## Release checks

With the configured Supabase database reachable, run:

```sh
npm ci
npm test
npm run build
```

The tests use unique temporary records and remove only the records they create. After deployment, verify the public root page, `/api/health`, create, view, edit, delete, search, filtering, pagination, and photo upload. Then add the public application URL to `README.md` and the private class workspace pointer.
