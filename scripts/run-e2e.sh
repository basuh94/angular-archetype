#!/bin/sh

set -eu

if [ "${E2E_DISABLED:-0}" = "1" ]; then
  echo "E2E is disabled (E2E_DISABLED=1). Skipping Playwright suite."
  exit 0
fi

npx playwright test
