"""Write one extended-M3U file per playlist."""

from __future__ import annotations

from pathlib import Path

from ..models import Playlist
from .common import (
    artist_names,
    duration_seconds,
    safe_filename,
    song_detail_url,
    song_title,
    unique_path,
)


def export_m3u(batch: Path, playlists: list[Playlist]) -> list[str]:
    directory = batch / "normalized" / "m3u"
    directory.mkdir(parents=True, exist_ok=True)
    files: list[str] = []

    for playlist in playlists:
        path = unique_path(
            directory,
            safe_filename(playlist.name),
            ".m3u8",
            playlist.playlist_id,
        )
        lines = ["#EXTM3U", f"#PLAYLIST:{playlist.name}"]
        for song in playlist.songs:
            artists = " / ".join(artist_names(song))
            display = " - ".join(item for item in (artists, song_title(song)) if item)
            lines.append(f"#EXTINF:{duration_seconds(song)},{display}")
            lines.append(song_detail_url(song))
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        files.append(path.relative_to(batch).as_posix())
    return files
