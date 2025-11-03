# Frontend — Live Streaming UI

About
-----

The frontend is a React-based UI that provides platform selection, stream setup, and monitoring for multi-platform live broadcasts. It consumes the backend REST API and ships styles and assets for branded deployments.

Quick start (local)
-------------------

1. Install dependencies:
   ```sh
   cd frontend
   yarn install
   ```
2. Start the dev server:
   ```sh
   yarn start
   ```

3. Build for production:
   ```sh
   yarn build
   ```

For containerized usage, see the root `Dockerfile` and `docker-compose.yml`.
# Frontend Service (React)

## Build & Run with Docker

1. Build the frontend image:
   ```sh
   docker build -t vmchat-frontend .
   ```
2. Run the frontend container:
   ```sh
   docker run -p 8080:80 vmchat-frontend
   ```

---

For development, use `yarn start` locally.
