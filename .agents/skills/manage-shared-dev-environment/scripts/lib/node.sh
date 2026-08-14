#!/usr/bin/env bash
# Node, npm, and pnpm discovery. Package content remains in native stores.

node_print_inventory() {
  local pnpm_store="missing"

  if runtime_has_command pnpm; then
    pnpm_store="$(pnpm store path 2>/dev/null || printf 'unavailable')"
  fi

  printf 'node.path=%s\n' "$(command -v node 2>/dev/null || printf 'missing')"
  printf 'node.version=%s\n' "$(runtime_command_version node --version)"
  printf 'npm.path=%s\n' "$(command -v npm 2>/dev/null || printf 'missing')"
  printf 'npm.version=%s\n' "$(runtime_command_version npm --version)"
  printf 'pnpm.path=%s\n' "$(command -v pnpm 2>/dev/null || printf 'missing')"
  printf 'pnpm.version=%s\n' "$(runtime_command_version pnpm --version)"
  printf 'pnpm.store=%s\n' "$pnpm_store"
}

node_validate_toolchain() {
  local missing=0
  local tool_name

  for tool_name in node npm pnpm; do
    if runtime_has_command "$tool_name"; then
      runtime_log "Validated $tool_name: $($tool_name --version 2>/dev/null | head -n 1)"
    else
      runtime_warn "$tool_name is not installed; Node/TypeScript projects are not ready"
      missing=1
    fi
  done

  if runtime_has_command pnpm; then
    runtime_log "Validated pnpm store: $(pnpm store path)"
  fi
  return "$missing"
}
