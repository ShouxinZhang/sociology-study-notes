"""Coordinate all output formats and write the batch manifest."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from ..models import Playlist
from ..playlist_service import incomplete_playlists
from .csv_exporter import export_csv
from .json_exporter import export_normalized_json, export_raw, write_json
from .m3u_exporter import export_m3u
from .markdown_exporter import export_markdown


def export_bundle(
    output_root: Path,
    playlists: list[Playlist],
    *,
    exported_at: datetime | None = None,
) -> tuple[Path, dict[str, object]]:
    """Write one timestamped export batch and return its manifest."""

    timestamp = exported_at or datetime.now(ZoneInfo("Asia/Shanghai"))
    batch = output_root / timestamp.strftime("%Y%m%d_%H%M%S")
    if batch.exists():
        raise FileExistsError(f"导出批次已存在：{batch}")
    batch.mkdir(parents=True)

    raw_files = export_raw(batch, playlists)
    normalized_json = export_normalized_json(batch, playlists)
    csv_file = export_csv(batch, playlists)
    m3u_files = export_m3u(batch, playlists)
    markdown_files = export_markdown(batch, playlists)
    incomplete = incomplete_playlists(playlists)

    category_counts: dict[str, int] = {}
    for playlist in playlists:
        category_counts[playlist.category] = (
            category_counts.get(playlist.category, 0) + 1
        )

    manifest: dict[str, object] = {
        "schema_version": 1,
        "source": "QQ Music Linux client runtime",
        "exported_at": timestamp.isoformat(),
        "playlist_count": len(playlists),
        "song_membership_count": sum(len(item.songs) for item in playlists),
        "unique_song_mid_count": len(
            {
                str(song.get("mid"))
                for playlist in playlists
                for song in playlist.songs
                if song.get("mid")
            }
        ),
        "category_counts": category_counts,
        "complete": not incomplete,
        "incomplete_playlists": [
            {
                "playlist_id": item.playlist_id,
                "name": item.name,
                "expected": item.expected_song_count,
                "exported": len(item.songs),
            }
            for item in incomplete
        ],
        "files": {
            "raw": raw_files,
            "normalized_json": normalized_json,
            "csv": csv_file,
            "m3u": m3u_files,
            "markdown": markdown_files,
        },
    }
    write_json(batch / "manifest.json", manifest)
    return batch, manifest
