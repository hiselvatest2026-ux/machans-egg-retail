Machans Egg Retail — Fullstack (Frontend + Backend + Postgres)

Run locally with Docker Compose:

  docker compose up --build

- Frontend available at http://localhost:3000
- Backend API at http://localhost:5000

Notes:
- Frontend calls API at http://localhost:5000 (this is exposed by docker-compose).
- DB data persists in docker volume 'db_data'.
- Default DB credentials in docker-compose: machans / machans123
