"""Write raw and normalized JSON representations."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..models import Playlist
from .common import (
    album_name,
    artist_names,
    duration_seconds,
    safe_filename,
    song_detail_url,
    song_id,
    song_mid,
    song_title,
    unique_path,
)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def _normalized_song(song: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "song_id": song_id(song),
        "song_mid": song_mid(song),
        "title": song_title(song),
        "artists": artist_names(song),
        "album": album_name(song),
        "duration_seconds": duration_seconds(song),
        "qqmusic_url": song_detail_url(song),
    }


def normalized_playlist(playlist: Playlist) -> dict[str, Any]:
    return {
        "playlist_id": playlist.playlist_id,
        "name": playlist.name,
        "category": playlist.category,
        "expected_song_count": playlist.expected_song_count,
        "exported_song_count": len(playlist.songs),
        "is_complete": playlist.is_complete,
        "songs": [
            _normalized_song(song, position)
            for position, song in enumerate(playlist.songs, start=1)
        ],
    }


def export_raw(batch: Path, playlists: list[Playlist]) -> list[str]:
    raw_directory = batch / "raw"
    playlist_directory = raw_directory / "playlists"
    playlist_directory.mkdir(parents=True, exist_ok=True)
    files: list[str] = []
    index: list[dict[str, Any]] = []

    for playlist in playlists:
        payload = {
            "category": playlist.category,
            "metadata": playlist.metadata,
            "songs": playlist.songs,
        }
        if playlist.name.strip() == "我喜欢":
            path = raw_directory / "我喜欢.json"
        else:
            path = unique_path(
                playlist_directory,
                safe_filename(playlist.name),
                ".json",
                playlist.playlist_id,
            )
        write_json(path, payload)
        relative = path.relative_to(batch).as_posix()
        files.append(relative)
        index.append(
            {
                "playlist_id": playlist.playlist_id,
                "name": playlist.name,
                "category": playlist.category,
                "expected_song_count": playlist.expected_song_count,
                "exported_song_count": len(playlist.songs),
                "file": relative,
            }
        )

    index_path = raw_directory / "playlist_index.json"
    write_json(index_path, index)
    files.append(index_path.relative_to(batch).as_posix())
    return files


def export_normalized_json(batch: Path, playlists: list[Playlist]) -> str:
    path = batch / "normalized" / "playlists.json"
    write_json(path, [normalized_playlist(item) for item in playlists])
    return path.relative_to(batch).as_posix()
