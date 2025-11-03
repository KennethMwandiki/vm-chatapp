# One-Click Publish — Setup Guide

This document explains how to configure CI to automatically build and publish to multiple stores when changes are pushed to `main`.

## Required Secrets (GitHub repository secrets)
- `DOCKER_REGISTRY` — Docker registry URL (e.g., ghcr.io/yourorg)
- `DOCKER_USERNAME` — Docker registry username
- `DOCKER_PASSWORD` — Docker registry password
- `VERCEL_TOKEN` — Vercel token for web publishing
- `GOOGLE_PLAY_JSON_KEY` — Google Play JSON key (base64 or file upload)
- `APP_STORE_CONNECT_API_KEY` — App Store Connect API key

## Files
- `.github/workflows/one-click-publish.yml` — CI workflow that builds and publishes
- `scripts/publish-web.sh` — Script to publish web build (Vercel by default)
- `scripts/publish-android.sh` — Script to trigger Fastlane Android release
- `scripts/publish-ios.sh` — Script to trigger Fastlane iOS release (macOS runners required)
- `scripts/publish-desktop.sh` — Placeholder for desktop publish commands

## How it works
1. Push to `main` triggers the workflow.
2. Workflow builds frontend and backend artifacts.
3. Artifacts are uploaded or published using provider CLIs (Vercel, Fastlane, etc.).

## Notes & Next Steps
- iOS publishing requires macOS runners or an external service (e.g., Bitrise).
- Configure Fastlane lanes in `android/fastlane` and `ios/fastlane` before enabling mobile publishing.
- For Microsoft Store or other desktop stores, add provider-specific CLI steps to `scripts/publish-desktop.sh`.

## Enable / Disable Publish Targets
You can enable or disable specific publish targets by editing `.github/workflows/one-click-publish.yml` environment variables or by setting repository-level environment variables.

- To disable iOS publishing, set `PUBLISH_IOS` to `false` in the workflow or in repository secrets/env.
- To disable Android publishing, set `PUBLISH_ANDROID` to `false`.
- To disable web publishing, set `PUBLISH_WEB` to `false`.
- To disable desktop publishing, set `PUBLISH_DESKTOP` to `false`.

Example (workflow env override):

```yaml
env:
	PUBLISH_WEB: 'true'
	PUBLISH_ANDROID: 'true'
	PUBLISH_IOS: 'false'
	PUBLISH_DESKTOP: 'false'
```

## Slack Notifications
You can enable Slack notifications by adding the `SLACK_WEBHOOK_URL` secret to your repository. The workflow will send a completion message when the pipeline finishes.

Steps:
1. Create an Incoming Webhook in Slack and copy the webhook URL.
2. Add `SLACK_WEBHOOK_URL` as a repository secret.
3. The workflow will post a summary message on completion.

## Manual Release & One-Click Publish
You can manually trigger a release and run the one-click publish from the GitHub UI or via the `gh` CLI.

From the Actions UI:
- Open the `Publish Release and Trigger One-Click` workflow and click `Run workflow`. Provide a `tag` and `release-name` if desired.

From the CLI using `gh`:

```bash
gh workflow run publish-release.yml --repo OWNER/REPO --field tag=v1.0.0 --field release-name="Release 1.0.0"
```

This will create an optional GitHub release and then trigger the `one-click-publish.yml` workflow.

## Verifying Repository Secrets
Before running the publish workflows, ensure required secrets are present in the repository Settings → Secrets.

Required secrets:
- `DOCKER_REGISTRY`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`
- `VERCEL_TOKEN`
- `GOOGLE_PLAY_JSON_KEY`
- `APP_STORE_CONNECT_API_KEY`
- `SLACK_WEBHOOK_URL` (optional)

You can check secrets programmatically after the repository is created using the helper scripts in `scripts/`.

Bash (Linux/macOS/WSL):
```bash
GITHUB_TOKEN=<your_pat> ./scripts/check-secrets.sh OWNER REPO
```

PowerShell (Windows):
```powershell
$env:GITHUB_TOKEN = "<your_pat>"
.\scripts\check-secrets.ps1 -Owner OWNER -Repo REPO
```

If any secrets are missing, add them in GitHub: Settings → Secrets → Actions → New repository secret.

About
-----

Broadcast to all major platforms at once — simple, fast, and reliable live streaming. This repo contains the one-click CI tooling and platform code to start and manage multi-platform live broadcasts with low latency, session chat, and centralized governance.

## Repository management and security

1. Publish platform & CI secrets
	- Use the helper script `scripts/publish-platform-secrets.sh` (bash) or `scripts/publish-platform-secrets.ps1` (PowerShell) to upload secrets to this repository via `gh secret set`.
	- You will still need to provide service account JSON files or private key files for Play Store and App Store Connect when prompted by the script.

2. Branch protection and merge control
	- This repo includes `scripts/setup-branch-protection.sh` and `scripts/setup-branch-protection.ps1` which call the GitHub API to set recommended protection rules on `main` (require PR reviews, require status checks `build`, `lint`, `tests`, and enforce code owner reviews).
	- Run the relevant script with: `scripts/setup-branch-protection.sh owner/repo` or the PowerShell equivalent.
	- A `.github/CODEOWNERS` file is included to ensure code owner review is required for critical areas (backend, infra, CI workflows).

3. CI required checks
	- After setting up branch protection, go to repository settings -> Branches and specify the exact status check names from the workflows (for example: `build`, `lint`, `tests`). Make sure workflows expose these names via job names.

