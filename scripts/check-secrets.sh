#!/usr/bin/env bash
# Check GitHub repository secrets via GitHub REST API
# Usage: GITHUB_TOKEN=<token> ./check-secrets.sh owner repo
set -e
OWNER=$1
REPO=$2
if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
  echo "Usage: GITHUB_TOKEN=<token> $0 owner repo"
  exit 1
fi

REQUIRED=(DOCKER_REGISTRY DOCKER_USERNAME DOCKER_PASSWORD VERCEL_TOKEN GOOGLE_PLAY_JSON_KEY APP_STORE_CONNECT_API_KEY SLACK_WEBHOOK_URL)
MISSING=()
for s in "${REQUIRED[@]}"; do
  STATUS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$OWNER/$REPO/actions/secrets/$s" | jq -r '.name // empty')
  if [ -z "$STATUS" ]; then
    MISSING+=("$s")
  fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
  echo "Missing secrets: ${MISSING[*]}"
  exit 1
fi

echo "All required secrets are present."