#!/usr/bin/env bash
# Helper: Add GitHub remote and push main branch
# Usage: ./create-remote.sh OWNER REPO
set -e
OWNER=$1
REPO=$2
if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
  echo "Usage: $0 OWNER REPO"
  exit 1
fi
REMOTE_URL="https://github.com/$OWNER/$REPO.git"

git remote add origin "$REMOTE_URL" || git remote set-url origin "$REMOTE_URL"

git push -u origin main

echo "Pushed to $REMOTE_URL"
