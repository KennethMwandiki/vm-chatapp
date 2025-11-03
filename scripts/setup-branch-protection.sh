#!/usr/bin/env bash
set -euo pipefail
REPO="${1:-$GITHUB_REPOSITORY}"
BRANCH="${2:-main}"
if [ -z "$REPO" ]; then
  echo "Usage: $0 owner/repo [branch]" >&2
  exit 1
fi

echo "Setting branch protection for $REPO $BRANCH"

gh api -X PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/${REPO}/branches/${BRANCH}/protection \
  -f required_status_checks='{"strict":true,"contexts":["build","lint","tests"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' \
  -f restrictions='null'

echo "Branch protection request sent. Check settings in repository settings -> Branches."
