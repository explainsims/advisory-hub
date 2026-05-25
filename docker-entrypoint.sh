#!/bin/sh
set -e

# Generate /runtime-config.js from Cloud Run environment variables.
# Allow the generic API_KEY to stand in for GEMINI_API_KEY so Cloud Run secrets
# only need one entry.
GEMINI_API_KEY="${GEMINI_API_KEY:-${API_KEY:-}}"
APP_URL="${APP_URL:-}"

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.RUNTIME_CONFIG = {
  GEMINI_API_KEY: "${GEMINI_API_KEY}",
  API_KEY: "${GEMINI_API_KEY}",
  APP_URL: "${APP_URL}"
};
EOF
