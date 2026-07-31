#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

SANDBOX_DIR="$REPO_ROOT/.agents/sandbox"
SANDBOX_VENV="$SANDBOX_DIR/.venv"

has_shared_pth() {
  [[ -x "$SANDBOX_VENV/bin/python" ]] || return 1
  find "$SANDBOX_VENV/lib" -maxdepth 3 -type f -name _shared_heavy_packages.pth -print -quit | grep -q .
}

if has_shared_pth; then
  echo "[OK] Sandbox venv already attached: $SANDBOX_VENV"
  exit 0
fi

export SHARED_ENV_NAME="${SHARED_ENV_NAME:-py312-torch-cu130}"

bash "$REPO_ROOT/.agents/skills/shared-python-env/scripts/setup_shared_env.sh" attach "$SANDBOX_DIR"
