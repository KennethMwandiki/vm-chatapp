#!/usr/bin/env bash
# Publish common platform and CI secrets to GitHub repository using gh
set -euo pipefail
REPO="${1:-$GITHUB_REPOSITORY}"
if [ -z "$REPO" ]; then
  echo "Usage: $0 owner/repo" >&2
  exit 1
fi

echo "Publishing secrets to $REPO"
read -p "Enter AGORA_APP_ID: " AGORA_APP_ID
read -s -p "Enter AGORA_CUSTOMER_SECRET: " AGORA_CUSTOMER_SECRET
echo
read -p "Enter VERCEL_TOKEN: " VERCEL_TOKEN
read -s -p "Enter GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (path): " GOOGLE_PLAY_JSON_PATH
echo
read -p "Enter APP_STORE_CONNECT_ISSUER_ID: " ASC_ISSUER_ID
read -s -p "Enter APP_STORE_CONNECT_PRIVATE_KEY (path): " ASC_KEY_PATH
echo
read -p "Enter DOCKERHUB_USERNAME: " DOCKERHUB_USER
read -s -p "Enter DOCKERHUB_TOKEN: " DOCKERHUB_TOKEN
echo
read -s -p "Enter SLACK_WEBHOOK_URL: " SLACK_WEBHOOK_URL
echo

gh secret set AGORA_APP_ID --repo "$REPO" --body "$AGORA_APP_ID"
gh secret set AGORA_CUSTOMER_SECRET --repo "$REPO" --body "$AGORA_CUSTOMER_SECRET"
gh secret set VERCEL_TOKEN --repo "$REPO" --body "$VERCEL_TOKEN"

if [ -n "$GOOGLE_PLAY_JSON_PATH" ] && [ -f "$GOOGLE_PLAY_JSON_PATH" ]; then
  gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON --repo "$REPO" --body "$(cat $GOOGLE_PLAY_JSON_PATH)"
fi

if [ -n "$ASC_KEY_PATH" ] && [ -f "$ASC_KEY_PATH" ]; then
  gh secret set APP_STORE_CONNECT_PRIVATE_KEY --repo "$REPO" --body "$(cat $ASC_KEY_PATH)"
fi

gh secret set APP_STORE_CONNECT_ISSUER_ID --repo "$REPO" --body "$ASC_ISSUER_ID"
gh secret set DOCKERHUB_USERNAME --repo "$REPO" --body "$DOCKERHUB_USER"
gh secret set DOCKERHUB_TOKEN --repo "$REPO" --body "$DOCKERHUB_TOKEN"
gh secret set SLACK_WEBHOOK_URL --repo "$REPO" --body "$SLACK_WEBHOOK_URL"

echo "Secrets published. Double-check via 'gh secret list --repo $REPO'"
