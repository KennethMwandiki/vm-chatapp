# VM CHAT INTENG: Dockerized Deployment & Development Guide

## Project Structure

- `/backend` — Node.js backend (API, authentication, integrations)
- `/frontend` — React frontend (UI, static assets)
- `/docker-compose.yml` — Multi-service orchestration

## Prerequisites
- Docker & Docker Compose installed
- Node.js & Yarn (for local dev)

## Quick Start: All Services

1. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```
   - Backend: http://localhost:3000
   - Frontend: http://localhost:8080
   - MongoDB: localhost:27017

2. **Stop all services:**
   ```sh
   docker-compose down
   ```

## Customization
- Edit environment variables in `docker-compose.yml` or use a `.env` file.
- Update Dockerfiles as needed for custom build steps.

## Development Workflow

- **Backend:**
  - Work in `/backend`.
  - Use `yarn dev` or `node server.js` for local dev.
  - Build/test Docker image with `docker build .` in `/backend`.

- **Frontend:**
  - Work in `/frontend`.
  - Use `yarn start` for local dev.
  - Build/test Docker image with `docker build .` in `/frontend`.

## API Access & Integrations
- The backend exposes REST APIs on port 3000.
- MongoDB is available at `mongodb://database:27017` from within containers.
- Integrate with external platforms by extending backend logic.

## Clean Up
```sh
docker-compose down -v
```

---

For Kubernetes deployment, see `/k8s` folder.

## About

This platform is an enterprise-ready, developer-first multi-platform live-streaming control center that lets teams launch, manage, and scale real-time broadcasts to every major destination from a single, branded interface. Built on low-latency Agora media and a modular Node/React backend, it abstracts provider complexities (YouTube, Twitch, Facebook, TikTok, X, WeChat, LinkedIn, Vimeo, custom RTMP and more) behind a simple API and one-click workflows so you can start simultaneous streams, manage sessions and chat, and monitor health and metrics with confidence. Containerized for easy deployment (Docker + Kubernetes), integrated with CI/CD for reproducible one-click publishing, and furnished with automation scripts for secure secret handling and branch protection, the platform accelerates live production while keeping governance, extensibility, and reliability front and center.

## GitHub deployment criteria (quick checklist)

Before enabling the one-click publish pipeline or protecting `main`, ensure the following are configured in the repository:

- Secrets are present in Settings → Secrets → Actions (required examples):
  - `DOCKER_REGISTRY`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`
  - `VERCEL_TOKEN` (for web publish)
  - `GOOGLE_PLAY_JSON_KEY` (base64 or file contents)
  - `APP_STORE_CONNECT_PRIVATE_KEY` and `APP_STORE_CONNECT_ISSUER_ID`
  - `SLACK_WEBHOOK_URL` (optional, for notifications)
- CI workflows must run successfully at least once so their status checks appear (use the Actions tab to verify):
  - Job names used as required status checks (example job names: `build`, `lint`, `tests`)
- Branch protection rules (recommended):
  - Require pull request reviews before merging
  - Require status checks to pass (list exact job names from the Actions jobs)
  - Require code owner review (`.github/CODEOWNERS` provided)
  - Enforce for administrators (optional but recommended for stricter governance)
- The repository must have a configured `GITHUB_TOKEN` or admin PAT with `repo` and `workflow` scopes available to automation (GitHub Actions provides `GITHUB_TOKEN` automatically for workflows).

Helper scripts included in `scripts/`:

- `publish-platform-secrets.sh` / `publish-platform-secrets.ps1` — interactive helpers to upload platform and publishing secrets via `gh secret set`.
- `setup-branch-protection.sh` / `setup-branch-protection.ps1` — helpers that call the GitHub API to propose recommended protection settings on a branch.

After these items are in place you can safely enable the `one-click-publish.yml` workflow and protect `main` knowing workflows and checks will prevent unauthorized merges.
