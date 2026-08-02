#!/usr/bin/env bash
# Shared path, logging, backup, and symlink helpers for the runtime manager.

runtime_log() {
  printf '[runtime] %s\n' "$*"
}

runtime_warn() {
  printf '[runtime][warn] %s\n' "$*" >&2
}

runtime_die() {
  printf '[runtime][error] %s\n' "$*" >&2
  exit 1
}

runtime_has_command() {
  command -v "$1" >/dev/null 2>&1
}

runtime_resolve_repo() {
  local requested_path="$1"
  local repo_root

  repo_root="$(git -C "$requested_path" rev-parse --show-toplevel 2>/dev/null)" || {
    runtime_die "Cannot resolve a Git repository from: $requested_path"
  }
  realpath -m -- "$repo_root"
}

runtime_timestamp() {
  date '+%Y-%m-%d_%H-%M-%S'
}

runtime_allocate_backup_root() {
  local repo_root="$1"
  local base_path="$repo_root/.agents/cache/manage-shared-dev-environment/$(runtime_timestamp)"
  local candidate="$base_path"
  local suffix=1

  while [[ -e "$candidate" || -L "$candidate" ]]; do
    candidate="${base_path}-${suffix}"
    ((suffix += 1))
  done
  mkdir -p "$candidate"
  printf '%s\n' "$candidate"
}

runtime_ensure_layout() {
  local repo_root="$1"

  mkdir -p \
    "$repo_root/.agents/runtime/python" \
    "$repo_root/.agents/runtime/state" \
    "$repo_root/.agents/cache/manage-shared-dev-environment"
}

runtime_backup_path() {
  local source_path="$1"
  local backup_root="$2"
  local backup_name="$3"
  local destination="$backup_root/$backup_name"

  if [[ ! -e "$source_path" && ! -L "$source_path" ]]; then
    return 0
  fi
  if [[ -e "$destination" || -L "$destination" ]]; then
    runtime_die "Backup destination already exists: $destination"
  fi

  mkdir -p "$backup_root"
  mv -- "$source_path" "$destination"
  runtime_log "Backed up $source_path -> $destination"
}

runtime_attach_symlink() {
  local entry_path="$1"
  local target_path="$2"
  local backup_root="$3"
  local backup_name="$4"
  local current_target=""
  local relative_target

  if [[ -L "$entry_path" ]]; then
    current_target="$(readlink -f -- "$entry_path" 2>/dev/null || true)"
    if [[ "$current_target" == "$(readlink -f -- "$target_path")" ]]; then
      runtime_log "Entry already attached: $entry_path"
      return 0
    fi
  fi

  runtime_backup_path "$entry_path" "$backup_root" "$backup_name"
  mkdir -p "$(dirname "$entry_path")"
  relative_target="$(realpath -m --relative-to="$(dirname "$entry_path")" "$target_path")"
  ln -s -- "$relative_target" "$entry_path"
  runtime_log "Attached $entry_path -> $relative_target"
}

runtime_assert_symlink_target() {
  local entry_path="$1"
  local expected_target="$2"
  local actual_target

  [[ -L "$entry_path" ]] || runtime_die "Expected a symbolic link: $entry_path"
  actual_target="$(readlink -f -- "$entry_path")"
  [[ "$actual_target" == "$(readlink -f -- "$expected_target")" ]] || {
    runtime_die "Unexpected link target for $entry_path: $actual_target"
  }
  runtime_log "Validated link: $entry_path"
}

runtime_command_version() {
  local command_name="$1"
  shift

  if runtime_has_command "$command_name"; then
    "$command_name" "$@" 2>/dev/null | head -n 1
  else
    printf 'missing'
  fi
}
