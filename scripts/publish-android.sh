#!/usr/bin/env bash
# Publish Android via Fastlane placeholder
set -e
if [ -z "$GOOGLE_PLAY_JSON_KEY" ]; then
  echo "GOOGLE_PLAY_JSON_KEY is not set. Export it or add it to CI secrets."
  exit 1
fi
# Example: run fastlane android release
cd android || exit 1
fastlane android release

echo "Android publish triggered."