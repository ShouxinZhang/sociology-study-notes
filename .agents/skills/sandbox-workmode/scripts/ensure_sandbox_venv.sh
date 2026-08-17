#!/usr/bin/env bash
# Attach sandbox tasks to the repository's managed Python environment.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
RUNTIME_MANAGER="$REPO_ROOT/.agents/skills/manage-shared-dev-environment/scripts/manage-runtime.sh"
PYTHON_VERSION="${SHARED_PYTHON_VERSION:-3.14}"

if [[ ! -x "$RUNTIME_MANAGER" ]]; then
  printf '[sandbox][error] Missing shared runtime manager: %s\n' "$RUNTIME_MANAGER" >&2
  exit 1
fi

"$RUNTIME_MANAGER" init \
  --repo "$REPO_ROOT" \
  --python-version "$PYTHON_VERSION" \
  --source-venv "$REPO_ROOT/.venv"

"$RUNTIME_MANAGER" attach-python \
  --repo "$REPO_ROOT" \
  --python-version "$PYTHON_VERSION" \
  --scope sandbox

"$RUNTIME_MANAGER" validate \
  --repo "$REPO_ROOT" \
  --python-version "$PYTHON_VERSION" \
  --scope sandbox
