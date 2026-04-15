#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "Backend directory not found at: $BACKEND_DIR" >&2
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "Frontend directory not found at: $FRONTEND_DIR" >&2
  exit 1
fi

echo "Starting Rails API on http://localhost:3000"
echo "Starting Next.js on http://localhost:3001"
echo "Press Ctrl+C to stop both."

cleanup() {
  # kill whole process group
  trap - INT TERM EXIT
  kill 0 2>/dev/null || true
}
trap cleanup INT TERM EXIT

(cd "$BACKEND_DIR" && bundle exec rails server -p 3000) &
(cd "$FRONTEND_DIR" && npm run dev) &

wait

