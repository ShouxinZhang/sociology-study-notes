"""Shared data structures used by the export pipeline."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Playlist:
    """One playlist and the songs returned by the QQ Music runtime."""

    category: str
    metadata: dict[str, Any]
    songs: list[dict[str, Any]]

    @property
    def playlist_id(self) -> str:
        value = self.metadata.get("tid") or self.metadata.get("dirId")
        return str(value or "")

    @property
    def name(self) -> str:
        return str(
            self.metadata.get("dirName")
            or self.metadata.get("name")
            or f"未命名歌单-{self.playlist_id}"
        )

    @property
    def expected_song_count(self) -> int | None:
        value = self.metadata.get("songNum", self.metadata.get("songnum"))
        try:
            return int(value) if value is not None else None
        except (TypeError, ValueError):
            return None

    @property
    def is_complete(self) -> bool:
        expected = self.expected_song_count
        return expected is None or expected == len(self.songs)
