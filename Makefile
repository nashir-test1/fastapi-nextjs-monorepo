# Convenience targets. The README documents the underlying commands.

.PHONY: db db-down db-reset psql backend frontend

db:            ## Start Postgres (port 6543)
	docker compose up -d

db-down:       ## Stop Postgres
	docker compose down

db-reset:      ## Stop Postgres and wipe all data
	docker compose down -v
	docker compose up -d

psql:          ## Open a psql shell in the database
	docker compose exec db psql -U postgres app

backend:       ## Run the FastAPI dev server (port 8765)
	cd backend && uv run fastapi dev app/main.py --port 8765

frontend:      ## Run the Next.js dev server (port 4321)
	cd frontend && npm run dev
