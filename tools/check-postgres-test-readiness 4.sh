#!/usr/bin/env bash
# Read-only environment readiness check. Never connects to production or runs SQL.
set -euo pipefail
if command -v psql >/dev/null 2>&1; then
  echo 'PSQL_CLIENT=AVAILABLE'
else
  echo 'PSQL_CLIENT=MISSING'
fi
if command -v pg_ctl >/dev/null 2>&1 && command -v initdb >/dev/null 2>&1; then
  echo 'LOCAL_POSTGRES_SERVER=AVAILABLE'
else
  echo 'LOCAL_POSTGRES_SERVER=MISSING'
fi
if command -v docker >/dev/null 2>&1; then
  echo 'DOCKER=AVAILABLE'
else
  echo 'DOCKER=MISSING'
fi
printf '%s\n' 'DATABASE_TESTS=NOT_RUN' 'PRODUCTION_DATABASE=UNTOUCHED'
