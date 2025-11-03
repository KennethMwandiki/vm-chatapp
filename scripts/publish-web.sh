#!/usr/bin/env bash
# Publish web build (Vercel example)
set -e
if [ -z "$VERCEL_TOKEN" ]; then
  echo "VERCEL_TOKEN is not set. Export it or add it to CI secrets."
  exit 1
fi
npx vercel --prod --token "$VERCEL_TOKEN"

echo "Web publish completed."