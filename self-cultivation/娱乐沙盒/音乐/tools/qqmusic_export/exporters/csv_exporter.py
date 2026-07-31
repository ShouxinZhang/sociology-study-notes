"""Write a flat playlist-membership CSV."""

from __future__ import annotations

import csv
from pathlib import Path

from ..models import Album, Playlist
from .common import (
    album_name,
    artist_names,
    duration_seconds,
    song_detail_url,
    song_id,
    song_mid,
    song_title,
)


_FIELDS = [
    "playlist_id",
    "playlist_name",
    "playlist_category",
    "position",
    "song_id",
    "song_mid",
    "title",
    "artists",
    "album",
    "duration_seconds",
    "qqmusic_url",
]

_ALBUM_FIELDS = [
    "album_mid",
    "album_name",
    "album_artists",
    "position",
    "song_id",
    "song_mid",
    "title",
    "artists",
    "duration_seconds",
    "qqmusic_url",
]


def export_csv(batch: Path, playlists: list[Playlist]) -> str:
    path = batch / "normalized" / "songs.csv"
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=_FIELDS)
        writer.writeheader()
        for playlist in playlists:
            for position, song in enumerate(playlist.songs, start=1):
                writer.writerow(
                    {
                        "playlist_id": playlist.playlist_id,
                        "playlist_name": playlist.name,
                        "playlist_category": playlist.category,
                        "position": position,
                        "song_id": song_id(song),
                        "song_mid": song_mid(song),
                        "title": song_title(song),
                        "artists": " / ".join(artist_names(song)),
                        "album": album_name(song),
                        "duration_seconds": duration_seconds(song),
                        "qqmusic_url": song_detail_url(song),
                    }
                )
    return path.relative_to(batch).as_posix()


def export_album_csv(batch: Path, albums: list[Album]) -> str:
    path = batch / "normalized" / "album_tracks.csv"
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=_ALBUM_FIELDS)
        writer.writeheader()
        for album in albums:
            for position, song in enumerate(album.songs, start=1):
                writer.writerow(
                    {
                        "album_mid": album.album_mid,
                        "album_name": album.name,
                        "album_artists": " / ".join(album.artists),
                        "position": position,
                        "song_id": song_id(song),
                        "song_mid": song_mid(song),
                        "title": song_title(song),
                        "artists": " / ".join(artist_names(song)),
                        "duration_seconds": duration_seconds(song),
                        "qqmusic_url": song_detail_url(song),
                    }
                )
    return path.relative_to(batch).as_posix()
