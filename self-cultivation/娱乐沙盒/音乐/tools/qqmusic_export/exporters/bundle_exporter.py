"""Coordinate all output formats and write the batch manifest."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from ..album_service import incomplete_albums
from ..models import Album, Playlist
from ..playlist_service import incomplete_playlists
from .csv_exporter import export_album_csv, export_csv
from .json_exporter import (
    export_normalized_albums_json,
    export_normalized_json,
    export_raw,
    export_raw_albums,
    write_json,
)
from .m3u_exporter import export_album_m3u, export_m3u
from .markdown_exporter import export_markdown
from .snapshot import SnapshotWriter


def export_bundle(
    output_root: Path,
    playlists: list[Playlist],
    albums: list[Album],
    *,
    exported_at: datetime | None = None,
) -> tuple[Path, dict[str, object]]:
    """Write one timestamped export batch and return its manifest."""

    timestamp = exported_at or datetime.now(ZoneInfo("Asia/Shanghai"))
    with SnapshotWriter(output_root) as snapshot:
        if snapshot.staging is None:
            raise RuntimeError("无法创建导出临时目录")
        batch = snapshot.staging

        raw_files = export_raw(batch, playlists)
        raw_album_files = export_raw_albums(batch, albums)
        normalized_json = export_normalized_json(batch, playlists)
        normalized_albums_json = export_normalized_albums_json(batch, albums)
        csv_file = export_csv(batch, playlists)
        album_csv_file = export_album_csv(batch, albums)
        m3u_files = export_m3u(batch, playlists)
        album_m3u_files = export_album_m3u(batch, albums)
        markdown_files = export_markdown(batch, playlists, albums)
        incomplete = incomplete_playlists(playlists)
        incomplete_album_list = incomplete_albums(albums)

        category_counts: dict[str, int] = {}
        for playlist in playlists:
            category_counts[playlist.category] = (
                category_counts.get(playlist.category, 0) + 1
            )

        manifest: dict[str, object] = {
            "schema_version": 2,
            "source": "QQ Music Linux client runtime",
            "exported_at": timestamp.isoformat(),
            "playlist_count": len(playlists),
            "song_membership_count": sum(len(item.songs) for item in playlists),
            "album_count": len(albums),
            "album_track_count": sum(len(item.songs) for item in albums),
            "unique_song_mid_count": len(
                {
                    str(song.get("mid"))
                    for collection in [*playlists, *albums]
                    for song in collection.songs
                    if song.get("mid")
                }
            ),
            "category_counts": category_counts,
            "complete": not incomplete and not incomplete_album_list,
            "incomplete_playlists": [
                {
                    "playlist_id": item.playlist_id,
                    "name": item.name,
                    "expected": item.expected_song_count,
                    "exported": len(item.songs),
                }
                for item in incomplete
            ],
            "incomplete_albums": [
                {
                    "album_mid": item.album_mid,
                    "name": item.name,
                    "expected": item.expected_song_count,
                    "exported": len(item.songs),
                }
                for item in incomplete_album_list
            ],
            "files": {
                "raw": raw_files,
                "raw_albums": raw_album_files,
                "normalized_json": normalized_json,
                "normalized_albums_json": normalized_albums_json,
                "csv": csv_file,
                "album_csv": album_csv_file,
                "m3u": m3u_files,
                "album_m3u": album_m3u_files,
                "markdown": markdown_files,
            },
        }
        write_json(batch / "manifest.json", manifest)
        current = snapshot.commit()
    return current, manifest
