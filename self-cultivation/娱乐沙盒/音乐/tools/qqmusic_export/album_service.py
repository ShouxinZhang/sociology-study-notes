"""Validate favorited albums and expose completeness checks."""

from __future__ import annotations

from typing import Any

from .models import Album
from .security import find_sensitive_paths, sanitize


class AlbumDataError(ValueError):
    """Raised when the client returned malformed favorited album data."""


def load_albums(payload: dict[str, Any]) -> list[Album]:
    """Build album models from the credential-free collector payload."""

    clean_payload = sanitize(payload)
    leaked_paths = find_sensitive_paths(clean_payload)
    if leaked_paths:
        raise AlbumDataError("认证字段过滤失败：" + ", ".join(leaked_paths[:5]))

    raw_albums = clean_payload.get("albums")
    if not isinstance(raw_albums, list):
        raise AlbumDataError("QQ 音乐返回值缺少 albums 数组")

    albums: list[Album] = []
    seen_mids: set[str] = set()
    for index, item in enumerate(raw_albums):
        if not isinstance(item, dict):
            raise AlbumDataError(f"第 {index + 1} 张专辑不是对象")
        metadata = item.get("metadata")
        details = item.get("details")
        if not isinstance(metadata, dict) or not isinstance(details, dict):
            raise AlbumDataError(f"第 {index + 1} 张专辑缺少 metadata 或 details")

        album = Album(metadata=metadata, details=details)
        if not album.album_mid:
            raise AlbumDataError(f"第 {index + 1} 张专辑缺少 MID")
        if album.album_mid in seen_mids:
            raise AlbumDataError(f"重复收藏专辑：{album.album_mid}")
        if not isinstance(details.get("songList"), list):
            raise AlbumDataError(f"专辑“{album.name}”缺少 songList 数组")
        if len(album.songs) != len(details["songList"]):
            raise AlbumDataError(f"专辑“{album.name}”含有无效 songInfo")

        seen_mids.add(album.album_mid)
        albums.append(album)
    return albums


def incomplete_albums(albums: list[Album]) -> list[Album]:
    """Return albums whose declared and exported track counts differ."""

    return [album for album in albums if not album.is_complete]
