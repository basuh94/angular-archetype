#!/bin/sh

set -eu

mkdir -p reports

npx license-checker --production --json --out reports/licenses.json
npx license-checker --production --summary --out reports/licenses-summary.txt

echo "License reports generated:"
echo "- reports/licenses.json"
echo "- reports/licenses-summary.txt"
