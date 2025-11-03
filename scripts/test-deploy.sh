#!/usr/bin/env bash
# Test deploy script: validates CI environment and performs simple smoke checks
set -e

echo "Validating environment variables..."
REQUIRED=(DOCKER_REGISTRY DOCKER_USERNAME DOCKER_PASSWORD VERCEL_TOKEN GOOGLE_PLAY_JSON_KEY APP_STORE_CONNECT_API_KEY)
MISSING=()
for v in "${REQUIRED[@]}"; do
  if [ -z "${!v}" ]; then
    MISSING+=("$v")
  fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
  echo "Missing required env vars: ${MISSING[*]}"
  exit 1
fi

echo "All required env vars present."

# Validate Docker registry access
if ! echo "$DOCKER_PASSWORD" | docker login "$DOCKER_REGISTRY" -u "$DOCKER_USERNAME" --password-stdin; then
  echo "Docker login failed"
  exit 1
fi

echo "Docker registry access OK."

# Optional: curl health endpoint if backend service URL provided
if [ -n "$BACKEND_URL" ]; then
  echo "Checking backend health at $BACKEND_URL/healthz"
  if ! curl --fail "$BACKEND_URL/healthz"; then
    echo "Backend health check failed"
    exit 1
  fi
  echo "Backend health check OK."
fi

echo "Test deploy validations passed."
