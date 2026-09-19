# Gamit Check deployment

The production build runs the React application and Express API from one Node.js container. PostgreSQL remains a separate persistent service.

Item photos are stored in PostgreSQL with a 3 MB limit per image. Include database storage growth when choosing the managed PostgreSQL plan and backup schedule.

## Local production container

1. Install Docker Desktop.
2. Copy `.env.docker.example` to `.env.docker` and replace the database password placeholder.
3. Build and start both services:

   ```sh
   docker compose --env-file .env.docker up --build
   ```

4. Open `http://localhost:3000`. The app container waits for PostgreSQL, applies the schema, and then starts the production server.
5. Stop the services with `docker compose --env-file .env.docker down`. Add `--volumes` only when you intentionally want to erase the container database.

## Container hosting

Deploy the `Dockerfile` to a container host and attach a PostgreSQL database. Configure these environment variables:

| Variable        | Production value                                                |
| --------------- | --------------------------------------------------------------- |
| `NODE_ENV`      | `production`                                                    |
| `PORT`          | The port assigned by the host, usually provided automatically   |
| `DATABASE_URL`  | The private PostgreSQL connection string supplied by the host   |
| `DATABASE_SSL`  | `true` when the hosted database requires TLS; otherwise `false` |
| `CLIENT_ORIGIN` | Optional when the UI and API use the same domain                |

The container runs the schema migration before starting. Configure the platform health check to request `/api/health`. Use a persistent managed PostgreSQL service; do not store production data inside the application container.

## Release checks

Before publishing a release, run:

```sh
npm ci
npm run db:local
npm test
npm run build
npm audit
```

Run `npm run db:local` in its own terminal. The automated tests remove only the records they create.

After deployment, verify the public root page, `/api/health`, Add Item, Edit Item, and Delete Item. Then add the public application URL to the README.
