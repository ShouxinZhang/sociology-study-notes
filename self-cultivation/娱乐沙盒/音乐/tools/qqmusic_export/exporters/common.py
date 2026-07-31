"""Shared naming and song-field helpers."""

from __future__ import annotations

import re
import unicodedata
from pathlib import Path
from typing import Any


_UNSAFE_FILENAME = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
_WHITESPACE = re.compile(r"\s+")


def safe_filename(name: str, fallback: str = "未命名歌单") -> str:
    """Create a readable cross-platform filename without losing Chinese text."""

    normalized = unicodedata.normalize("NFKC", name).strip()
    normalized = _UNSAFE_FILENAME.sub("_", normalized)
    normalized = _WHITESPACE.sub(" ", normalized).strip(" .")
    return (normalized or fallback)[:120]


def unique_path(directory: Path, stem: str, suffix: str, identity: str) -> Path:
    """Return a stable path, adding the playlist id only on a name collision."""

    candidate = directory / f"{stem}{suffix}"
    if not candidate.exists():
        return candidate
    return directory / f"{stem}__{safe_filename(identity, 'id')}{suffix}"


def song_title(song: dict[str, Any]) -> str:
    return str(song.get("name") or song.get("songname") or song.get("title") or "")


def artist_names(song: dict[str, Any]) -> list[str]:
    singers = song.get("singer")
    if not isinstance(singers, list):
        return []
    return [
        str(singer.get("name") or singer.get("title") or "")
        for singer in singers
        if isinstance(singer, dict) and (singer.get("name") or singer.get("title"))
    ]


def album_name(song: dict[str, Any]) -> str:
    album = song.get("album")
    if isinstance(album, dict):
        return str(album.get("name") or album.get("title") or "")
    return str(song.get("albumname") or "")


def song_mid(song: dict[str, Any]) -> str:
    return str(song.get("mid") or song.get("songmid") or "")


def song_id(song: dict[str, Any]) -> str:
    return str(song.get("id") or song.get("songid") or "")


def duration_seconds(song: dict[str, Any]) -> int:
    value = song.get("interval", song.get("playTime", 0))
    try:
        return max(0, int(value))
    except (TypeError, ValueError):
        return 0


def song_detail_url(song: dict[str, Any]) -> str:
    identifier = song_mid(song) or song_id(song)
    return (
        f"https://y.qq.com/n/ryqq/songDetail/{identifier}"
        if identifier
        else ""
    )
