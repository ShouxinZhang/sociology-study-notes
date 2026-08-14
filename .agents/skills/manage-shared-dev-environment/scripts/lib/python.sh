#!/usr/bin/env bash
# Python environment creation, compatibility snapshot, attachment, and checks.

python_runtime_target() {
  local repo_root="$1"
  local python_version="$2"
  printf '%s/.agents/runtime/python/%s/.venv\n' "$repo_root" "$python_version"
}

python_actual_minor() {
  local python_executable="$1"
  "$python_executable" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")'
}

python_snapshot_requirements() {
  local source_venv="$1"
  local lock_path="$2"
  local temp_path

  [[ -x "$source_venv/bin/python" ]] || {
    runtime_warn "No source Python environment to snapshot: $source_venv"
    return 1
  }
  "$source_venv/bin/python" -m pip --version >/dev/null 2>&1 || {
    runtime_die "Source environment has no pip metadata exporter: $source_venv"
  }

  # `pip freeze` preserves VCS commit pins and direct URLs. Reconstructing the
  # list from package metadata alone would turn non-PyPI packages into invalid
  # `name==version` requirements and make migrations unrecoverable.
  temp_path="$(mktemp "${lock_path}.tmp.XXXXXX")"
  "$source_venv/bin/python" -m pip freeze > "$temp_path"
  mv -- "$temp_path" "$lock_path"
  runtime_log "Saved Python compatibility snapshot: $lock_path"
}

python_ensure_environment() {
  local target_venv="$1"
  local python_version="$2"
  local actual_version
  local candidate

  if [[ -x "$target_venv/bin/python" ]]; then
    actual_version="$(python_actual_minor "$target_venv/bin/python")"
    [[ "$actual_version" == "$python_version" ]] || {
      runtime_die "Python environment version mismatch at $target_venv: $actual_version"
    }
    runtime_log "Python environment already exists: $target_venv"
    return 0
  fi
  if [[ -e "$target_venv" || -L "$target_venv" ]]; then
    runtime_die "Python target exists but is not a usable environment: $target_venv"
  fi

  mkdir -p "$(dirname "$target_venv")"
  if runtime_has_command uv; then
    uv venv --seed --python "$python_version" "$target_venv"
  else
    candidate="python${python_version}"
    runtime_has_command "$candidate" || {
      runtime_die "Neither uv nor $candidate is available to create Python $python_version"
    }
    "$candidate" -m venv "$target_venv"
  fi
  runtime_log "Created Python $python_version environment: $target_venv"
}

python_install_snapshot() {
  local target_venv="$1"
  local lock_path="$2"

  [[ -s "$lock_path" ]] || {
    runtime_log "No Python compatibility packages need installation"
    return 0
  }

  if runtime_has_command uv; then
    uv pip install --python "$target_venv/bin/python" --requirement "$lock_path"
  else
    "$target_venv/bin/python" -m pip install --requirement "$lock_path"
  fi
  runtime_log "Installed Python compatibility snapshot into shared environment"
}

python_attach_scope() {
  local repo_root="$1"
  local target_venv="$2"
  local scope="$3"
  local backup_root="$4"

  case "$scope" in
    root)
      runtime_attach_symlink "$repo_root/.venv" "$target_venv" "$backup_root" root-venv
      ;;
    sandbox)
      runtime_attach_symlink "$repo_root/.agents/sandbox/.venv" "$target_venv" "$backup_root" sandbox-venv
      ;;
    all)
      runtime_attach_symlink "$repo_root/.venv" "$target_venv" "$backup_root" root-venv
      runtime_attach_symlink "$repo_root/.agents/sandbox/.venv" "$target_venv" "$backup_root" sandbox-venv
      ;;
    *)
      runtime_die "Unsupported Python attachment scope: $scope"
      ;;
  esac
}

python_entry_is_attached() {
  local entry_path="$1"
  local target_venv="$2"

  [[ -L "$entry_path" ]] || return 1
  [[ "$(readlink -f -- "$entry_path" 2>/dev/null || true)" == "$(readlink -f -- "$target_venv")" ]]
}

python_scope_is_attached() {
  local repo_root="$1"
  local target_venv="$2"
  local scope="$3"

  case "$scope" in
    root)
      python_entry_is_attached "$repo_root/.venv" "$target_venv"
      ;;
    sandbox)
      python_entry_is_attached "$repo_root/.agents/sandbox/.venv" "$target_venv"
      ;;
    all)
      python_entry_is_attached "$repo_root/.venv" "$target_venv" && \
        python_entry_is_attached "$repo_root/.agents/sandbox/.venv" "$target_venv"
      ;;
    *)
      runtime_die "Unsupported Python attachment scope: $scope"
      ;;
  esac
}

python_validate_scope() {
  local repo_root="$1"
  local target_venv="$2"
  local python_version="$3"
  local scope="$4"
  local actual_version

  [[ -x "$target_venv/bin/python" ]] || runtime_die "Missing shared Python environment: $target_venv"
  actual_version="$(python_actual_minor "$target_venv/bin/python")"
  [[ "$actual_version" == "$python_version" ]] || {
    runtime_die "Expected Python $python_version, found $actual_version"
  }
  runtime_log "Validated Python ABI: $actual_version"

  case "$scope" in
    root)
      runtime_assert_symlink_target "$repo_root/.venv" "$target_venv"
      ;;
    sandbox)
      runtime_assert_symlink_target "$repo_root/.agents/sandbox/.venv" "$target_venv"
      ;;
    all)
      runtime_assert_symlink_target "$repo_root/.venv" "$target_venv"
      runtime_assert_symlink_target "$repo_root/.agents/sandbox/.venv" "$target_venv"
      ;;
    *)
      runtime_die "Unsupported Python validation scope: $scope"
      ;;
  esac

  "$target_venv/bin/python" -m pip check
  runtime_log "Validated Python dependency consistency"
}

python_print_inventory() {
  local target_venv="$1"
  local python_version="$2"

  printf 'python.requested=%s\n' "$python_version"
  printf 'python.environment=%s\n' "$target_venv"
  if [[ -x "$target_venv/bin/python" ]]; then
    printf 'python.actual=%s\n' "$($target_venv/bin/python --version 2>&1)"
  else
    printf 'python.actual=missing\n'
  fi
  if runtime_has_command uv; then
    printf 'python.manager=%s\n' "$(command -v uv)"
    printf 'python.manager_version=%s\n' "$(uv --version 2>/dev/null)"
  else
    printf 'python.manager=missing\n'
  fi
}
