# FastAPI + Next.js Starter

A minimal monorepo for local development:

- **`backend/`** — Python [FastAPI](https://fastapi.tiangolo.com/) app with SQLAlchemy, run with [uv](https://docs.astral.sh/uv/)
- **`frontend/`** — [Next.js](https://nextjs.org/) app (pages router, TypeScript, Tailwind CSS)
- **Postgres** — runs in Docker via `docker compose`

## Ports

Nonstandard ports on purpose, so nothing collides with whatever you already have running on 3000/8000/5432. They're all descending digit runs:

| Service  | URL                             |
|----------|---------------------------------|
| Frontend | http://localhost:**4321**       |
| Backend  | http://localhost:**8765**       |
| Postgres | `localhost:`**6543** (user `postgres`, password `postgres`, db `app`) |

## Prerequisites

- **Docker** (Docker Desktop or equivalent) — runs Postgres
- **[uv](https://docs.astral.sh/uv/getting-started/installation/)** — runs the backend (installs Python 3.12 and all deps automatically; no local Python setup needed)
- **Node.js 20+** — runs the frontend

You do **not** need a local Postgres or a local Python install.

## Running the app

Three processes, three terminals (run each from the repo root):

**1. Start Postgres**

```sh
docker compose up -d
```

**2. Start the backend** (port 8765)

```sh
cd backend
uv run fastapi dev app/main.py --port 8765
```

The first run takes a moment while uv downloads Python and the dependencies.

**3. Start the frontend** (port 4321)

```sh
cd frontend
npm install
npm run dev
```

**4. Verify:** open <http://localhost:4321> — the page shows "ok" for frontend, backend, and database. Interactive API docs are at <http://localhost:8765/docs>.

There's also a `Makefile` with shortcuts: `make db`, `make backend`, `make frontend`, `make psql`, `make db-reset`.

## Project structure

```
docker-compose.yml      # Postgres (the only containerized service)
backend/
  pyproject.toml        # deps: fastapi, sqlalchemy, psycopg
  app/
    main.py             # FastAPI app, CORS, /health + /fruits endpoints
    db.py               # engine, SessionLocal, Base, get_db dependency
    models.py           # SQLAlchemy models/tables (contains the sample table)
frontend/
  src/
    pages/              # Next.js pages router (index + /fruits sample page)
    lib/api.ts          # apiUrl() helper for calling the backend
    styles/globals.css  # Tailwind entry point
```

## Sample feature: fruits

A tiny end-to-end example showing the full path DB → API → UI, useful as a pattern to copy (and safe to delete):

- **Table**: `sample_fruits` in `backend/app/models.py`, seeded with a few rows on backend startup
- **API**: `GET /fruits` in `backend/app/main.py` (try it at http://localhost:8765/docs)
- **UI**: http://localhost:4321/fruits (`frontend/src/pages/fruits.tsx`) renders the table contents

## Common tasks

**Add a database table** — define a model in `backend/app/models.py` (example in the file's docstring), then restart the backend. Tables are created automatically on startup via `Base.metadata.create_all` — no migrations in this repo.

**Add a backend dependency**

```sh
cd backend && uv add <package>
```

**Call the backend from the frontend** — use the helper so the base URL stays in one place:

```ts
import { apiUrl } from "@/lib/api";
const res = await fetch(apiUrl("/health"));
```

CORS is already configured on the backend for `http://localhost:4321`.

**Open a psql shell**

```sh
docker compose exec db psql -U postgres app
```

**Reset the database** (wipes all data)

```sh
docker compose down -v && docker compose up -d
```

**Stop everything** — Ctrl-C the two dev servers, then `docker compose down`.

## Troubleshooting

- **Page shows an error for "Backend"** — the backend isn't running or crashed; check its terminal.
- **Page shows an error for "Database"** — Postgres isn't up. Run `docker compose up -d` and give it a couple of seconds, then refresh.
- **Port already in use** — something else is on 4321/8765/6543. Ports are set in `frontend/package.json` (`dev` script), the backend run command, and `docker-compose.yml`.
