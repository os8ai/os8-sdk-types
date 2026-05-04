#!/usr/bin/env bash
# Phase 5 PR 5.2 — sync `index.d.ts` from the canonical
# `os8ai/os8/src/templates/os8-sdk.d.ts` and surface a diff.
#
# Run on a release branch BEFORE pushing the next `vX.Y.Z` tag so the
# published package's types match what the desktop's drift-check
# expects (`tools/check-sdk-drift.js --include-published`).
#
# Usage:
#   tools/sync-from-os8.sh                            # uses ../os8 by default
#   tools/sync-from-os8.sh /path/to/os8/clone         # explicit clone path
#   tools/sync-from-os8.sh --no-clone /path/to/os8    # don't clone — assume the
#                                                     # provided path is the
#                                                     # already-checked-out source
#
# By default the script clones os8 fresh at the latest tag (or HEAD if
# no v* tags exist) into a tmp dir, copies the canonical .d.ts in,
# prints a diff, and exits. The user is responsible for committing.

set -euo pipefail

OS8_PATH="${1:-../os8}"
NO_CLONE=false
if [[ "${1:-}" == "--no-clone" ]]; then
  NO_CLONE=true
  OS8_PATH="${2:-../os8}"
fi

if [[ ! -d "$OS8_PATH" ]]; then
  echo "ERROR: os8 source not found at $OS8_PATH" >&2
  echo "  pass an explicit path: $0 /path/to/os8" >&2
  exit 1
fi

if [[ "$NO_CLONE" == "true" ]]; then
  CLONE="$OS8_PATH"
else
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT
  CLONE="$TMP/os8"
  echo "Cloning os8 → $CLONE..."
  git clone --depth 1 "$OS8_PATH" "$CLONE" >/dev/null 2>&1
fi

SRC="$CLONE/src/templates/os8-sdk.d.ts"
DST="$(cd "$(dirname "$0")/.." && pwd)/index.d.ts"

if [[ ! -f "$SRC" ]]; then
  echo "ERROR: canonical .d.ts not found at $SRC" >&2
  exit 1
fi

if diff -q "$SRC" "$DST" >/dev/null 2>&1; then
  echo "✓ index.d.ts already matches $SRC — nothing to do."
  exit 0
fi

echo "Diff:"
echo "---"
diff -u "$DST" "$SRC" || true
echo "---"
echo
cp "$SRC" "$DST"
echo "✓ Copied canonical .d.ts → $DST"
echo
echo "Next steps:"
echo "  1. Review the change with \`git diff\`"
echo "  2. Bump version in package.json + add CHANGELOG entry"
echo "  3. Commit, tag, and push:"
echo "       git commit -am 'release vX.Y.Z'"
echo "       git tag vX.Y.Z && git push --tags"
