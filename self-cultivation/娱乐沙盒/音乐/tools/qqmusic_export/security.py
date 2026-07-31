"""Remove authentication material before data enters the export tree."""

from __future__ import annotations

import re
from typing import Any


_SENSITIVE_KEY = re.compile(
    r"(?:^|_)(?:access_?token|refresh_?token|music_?key|musickey|"
    r"cookie|authorization|auth_?key|session_?key)(?:$|_)",
    re.IGNORECASE,
)


def sanitize(value: Any) -> Any:
    """Recursively copy JSON-like data while dropping credential-shaped keys."""

    if isinstance(value, dict):
        return {
            str(key): sanitize(item)
            for key, item in value.items()
            if not _SENSITIVE_KEY.search(str(key))
        }
    if isinstance(value, list):
        return [sanitize(item) for item in value]
    return value


def find_sensitive_paths(value: Any, prefix: str = "$") -> list[str]:
    """Return any credential-shaped paths that survived sanitization."""

    matches: list[str] = []
    if isinstance(value, dict):
        for key, item in value.items():
            path = f"{prefix}.{key}"
            if _SENSITIVE_KEY.search(str(key)):
                matches.append(path)
            matches.extend(find_sensitive_paths(item, path))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            matches.extend(find_sensitive_paths(item, f"{prefix}[{index}]"))
    return matches
