"""Validate and normalize the raw collection returned by QQ Music."""

from __future__ import annotations

from typing import Any

from .models import Playlist
from .security import find_sensitive_paths, sanitize


class PlaylistDataError(ValueError):
    """Raised when the client returned an incomplete or unexpected payload."""


def load_playlists(payload: dict[str, Any]) -> list[Playlist]:
    """Build playlist models and reject malformed or credential-bearing data."""

    clean_payload = sanitize(payload)
    leaked_paths = find_sensitive_paths(clean_payload)
    if leaked_paths:
        raise PlaylistDataError(
            "认证字段过滤失败：" + ", ".join(leaked_paths[:5])
        )

    raw_playlists = clean_payload.get("playlists")
    if not isinstance(raw_playlists, list):
        raise PlaylistDataError("QQ 音乐返回值缺少 playlists 数组")

    playlists: list[Playlist] = []
    seen_ids: set[tuple[str, str]] = set()
    for index, item in enumerate(raw_playlists):
        if not isinstance(item, dict):
            raise PlaylistDataError(f"第 {index + 1} 个歌单不是对象")

        metadata = item.get("metadata")
        songs = item.get("songs")
        category = str(item.get("category") or "unknown")
        if not isinstance(metadata, dict) or not isinstance(songs, list):
            raise PlaylistDataError(
                f"第 {index + 1} 个歌单缺少 metadata 或 songs"
            )
        if any(not isinstance(song, dict) for song in songs):
            raise PlaylistDataError(f"歌单 {index + 1} 含有非对象歌曲记录")

        playlist = Playlist(category=category, metadata=metadata, songs=songs)
        identity = (playlist.category, playlist.playlist_id)
        if not playlist.playlist_id:
            raise PlaylistDataError(f"歌单 {index + 1} 缺少 tid/dirId")
        if identity in seen_ids:
            raise PlaylistDataError(
                f"重复歌单：category={playlist.category}, id={playlist.playlist_id}"
            )
        seen_ids.add(identity)
        playlists.append(playlist)

    if not playlists:
        raise PlaylistDataError("没有读取到任何歌单")

    favorite = [
        playlist for playlist in playlists if playlist.name.strip() == "我喜欢"
    ]
    if len(favorite) != 1:
        raise PlaylistDataError(
            f"应当且只能读取一个“我喜欢”歌单，实际为 {len(favorite)} 个"
        )
    return playlists


def incomplete_playlists(playlists: list[Playlist]) -> list[Playlist]:
    """Return playlists whose declared and exported song counts differ."""

    return [playlist for playlist in playlists if not playlist.is_complete]
