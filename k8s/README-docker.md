# Docker Deployment Structure

- `/backend` — Node.js backend Docker context
  - `Dockerfile`, `.dockerignore`, `.env.example`, `README.md`
- `/frontend` — React frontend Docker context
  - `Dockerfile`, `.dockerignore`, `.env.example`, `README.md`
- `/docker-compose.yml` — Orchestrates backend, frontend, and MongoDB

## Usage
- Build and run all services:
  ```sh
  docker-compose up --build
  ```
- Stop all services:
  ```sh
  docker-compose down
  ```
