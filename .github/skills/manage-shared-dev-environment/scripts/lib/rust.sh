#!/usr/bin/env bash
# Rust toolchain discovery. rustup and Cargo retain their native shared stores.

rust_print_inventory() {
  local active_toolchain="missing"

  if runtime_has_command rustup; then
    active_toolchain="$(rustup show active-toolchain 2>/dev/null || printf 'unavailable')"
  fi

  printf 'rustup.path=%s\n' "$(command -v rustup 2>/dev/null || printf 'missing')"
  printf 'rustup.version=%s\n' "$(runtime_command_version rustup --version)"
  printf 'rustc.path=%s\n' "$(command -v rustc 2>/dev/null || printf 'missing')"
  printf 'rustc.version=%s\n' "$(runtime_command_version rustc --version)"
  printf 'cargo.path=%s\n' "$(command -v cargo 2>/dev/null || printf 'missing')"
  printf 'cargo.version=%s\n' "$(runtime_command_version cargo --version)"
  printf 'rust.active_toolchain=%s\n' "$active_toolchain"
  printf 'cargo.home=%s\n' "${CARGO_HOME:-$HOME/.cargo}"
}

rust_validate_toolchain() {
  local missing=0
  local tool_name

  for tool_name in rustup rustc cargo; do
    if runtime_has_command "$tool_name"; then
      runtime_log "Validated $tool_name: $($tool_name --version 2>/dev/null | head -n 1)"
    else
      runtime_warn "$tool_name is not installed; Rust projects are not ready"
      missing=1
    fi
  done

  if runtime_has_command rustup; then
    runtime_log "Validated active Rust toolchain: $(rustup show active-toolchain)"
  fi
  return "$missing"
}
