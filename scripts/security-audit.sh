#!/bin/sh

set -eu

mkdir -p reports

set +e
npm audit --json > reports/npm-audit.json
AUDIT_EXIT_CODE=$?
set -e

set +e
node -e "
const fs = require('node:fs');
const path = 'reports/npm-audit.json';
const raw = fs.readFileSync(path, 'utf8');
const data = JSON.parse(raw);
const meta = data.metadata?.vulnerabilities;
if (!meta) {
  console.error('Security audit output does not include vulnerability metadata.');
  process.exit(2);
}
const high = Number(meta.high || 0);
const critical = Number(meta.critical || 0);
console.log('Audit summary:', { high, critical });
if (high > 0 || critical > 0) {
  console.error('Security audit failed: high/critical vulnerabilities detected.');
  process.exit(1);
}
" 
NODE_EXIT_CODE=$?
set -e

if [ "$NODE_EXIT_CODE" -eq 2 ] && [ "${SECURITY_AUDIT_ALLOW_NETWORK_ERROR:-0}" = "1" ]; then
  echo "Security audit metadata unavailable (likely offline). Continuing due to SECURITY_AUDIT_ALLOW_NETWORK_ERROR=1."
  exit 0
fi

if [ "$NODE_EXIT_CODE" -ne 0 ]; then
  exit "$NODE_EXIT_CODE"
fi

if [ "$AUDIT_EXIT_CODE" -ne 0 ]; then
  echo "npm audit exited with code $AUDIT_EXIT_CODE (no high/critical vulnerabilities detected)."
fi

echo "Audit report generated: reports/npm-audit.json"
