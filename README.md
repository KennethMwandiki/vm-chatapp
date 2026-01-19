# VM Chat Control Center (Unified Vercel Monorepo)

A multi-platform live-streaming control center that lets teams launch, manage, and scale real-time broadcasts to every major destination from a single, branded interface.

## 🚀 Key Features
- **Unified Dashboard**: React-based UI for managing streams, viewing metrics, and controlling sessions.
- **Multi-Platform Support**: Native integrations for **YouTube, Facebook, Instagram, LinkedIn, Twitter (X), WeChat**, and Generic RTMP (Substack, Kick, Trovo).
- **Secure Authentication**: Google OAuth + Local Login implementation.
- **Real-Time Metrics**: Live viewer counts and stream quality monitoring.
- **Vercel Deployment**: Optimized for serverless deployment (Frontend + API Functions).

## 📂 Project Structure
- `frontend/`: React + Vite application (The Unified Dashboard).
- `api/`: Node.js Serverless Functions (Backend API).
    - `services/`: Platform adapters (Facebook, YouTube, etc.).
    - `models/`: MongoDB Schemas (User, Stream).
- `vercel.json`: Deployment configuration.

## 🛠️ Quick Start (Local)

### 1. Backend Setup
```bash
cd api
npm install
npm test # Verify API logic
```
Create a `.env` file in the root based on `.env.example`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:5173`.

## 🌍 Vercel Deployment

1.  **Environment Variables**: Add all keys from `.env.example` to your Vercel Project Settings.
    - `MONGO_URI`, `SESSION_SECRET`
    - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
    - `FACEBOOK_PAGE_ACCESS_TOKEN`, `YOUTUBE_CLIENT_ID`, etc.
2.  **Push to Main**: Deployment is automatic.

## 🔌 API Integrations
The backend uses a **Service Adapter Pattern** in `api/services/`:
- **Meta**: `facebookService.js` (uses `facebook-nodejs-business-sdk`)
- **Google**: `youtubeService.js` (uses `googleapis`)
- **Twitter**: `twitterService.js` (uses `twitter-api-v2`)
- **LinkedIn**: `linkedinService.js` (Direct API)
- **Generic**: `genericRtmpService.js` (Substack, Kick, etc.)

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
