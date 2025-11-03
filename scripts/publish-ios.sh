#!/usr/bin/env bash
# Publish iOS via Fastlane placeholder
set -e
if [ -z "$APP_STORE_CONNECT_API_KEY" ]; then
  echo "APP_STORE_CONNECT_API_KEY is not set. Export it or add it to CI secrets."
  exit 1
fi
# Example: run fastlane ios release
cd ios || exit 1
fastlane ios release

echo "iOS publish triggered."