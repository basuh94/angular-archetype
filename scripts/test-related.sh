#!/bin/sh

set -eu

STAGED_TS_FILES="$(git diff --cached --name-only --diff-filter=ACMR -- '*.ts')"

if [ -z "$STAGED_TS_FILES" ]; then
  echo "No staged TypeScript files. Skipping related tests."
  exit 0
fi

echo "Running related tests for staged TypeScript files..."
npx jest --bail --findRelatedTests --passWithNoTests $STAGED_TS_FILES
