#!/usr/bin/env bash
# Nightly self-update, run by skylight-update.timer. Fast-forwards the checkout
# to origin/<branch> (default: release), reinstalls deps, rebuilds, restarts the
# server. Config and data are never touched. A failed build is rolled back to
# the previous commit so the ceiling keeps working.
#
#   SKYLIGHT_BRANCH   branch to follow (default release)
#   APPDIR            checkout (default ~/skylight)
# Turn it off:  sudo systemctl disable --now skylight-update.timer
set -euo pipefail

APPDIR="${APPDIR:-$HOME/skylight}"
BRANCH="${SKYLIGHT_BRANCH:-release}"
cd "$APPDIR"
[ -d .git ] || { echo "not a git checkout; nothing to update"; exit 0; }
export CI=true COREPACK_ENABLE_DOWNLOAD_PROMPT=0

git fetch -q origin "$BRANCH" || { echo "fetch failed; try again tomorrow"; exit 0; }
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"
if [ "$LOCAL" = "$REMOTE" ]; then
  echo "up to date ($(git rev-parse --short HEAD))"
  exit 0
fi
if ! git merge -q --ff-only "origin/$BRANCH"; then
  echo "local changes block a fast-forward; leaving as is"
  exit 0
fi
echo "updating $(git rev-parse --short "$LOCAL") -> $(git rev-parse --short "$REMOTE")"
if pnpm install && pnpm build; then
  sudo systemctl restart skylight-server
  systemctl is-active --quiet skylight-tracker && sudo systemctl restart skylight-tracker || true
  echo "updated to $(git rev-parse --short HEAD)"
else
  echo "install/build failed; rolling back to $(git rev-parse --short "$LOCAL")"
  git reset -q --hard "$LOCAL"
  pnpm install >/dev/null 2>&1 || true
  pnpm build >/dev/null 2>&1 || true
  exit 1
fi
