"""Write a readable Markdown index for songs, playlists, and albums."""

from __future__ import annotations

from pathlib import Path
from urllib.parse import quote

from ..models import Album, Playlist
from .common import (
    album_detail_url,
    album_name,
    artist_names,
    duration_seconds,
    safe_filename,
    song_detail_url,
    song_title,
    unique_path,
)


_CATEGORY_LABELS = {
    "self_created": "自建歌单",
    "favorited": "收藏歌单",
}


def _cell(value: object) -> str:
    return (
        str(value)
        .replace("\\", "\\\\")
        .replace("|", "\\|")
        .replace("\r\n", "<br>")
        .replace("\n", "<br>")
        .strip()
    )


def _duration(value: int) -> str:
    hours, remainder = divmod(value, 3600)
    minutes, seconds = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


def _playlist_markdown(playlist: Playlist) -> str:
    category = _CATEGORY_LABELS.get(playlist.category, playlist.category)
    expected = playlist.expected_song_count
    count_text = str(len(playlist.songs))
    if expected is not None:
        count_text += f" / 客户端记录 {expected}"

    lines = [
        f"# {playlist.name}",
        "",
        f"- 类型：{category}",
        f"- 歌单 ID：`{playlist.playlist_id}`",
        f"- 歌曲数：{count_text}",
        "",
        "| # | 歌曲 | 歌手 | 专辑 | 时长 | QQ 音乐 |",
        "|---:|---|---|---|---:|---|",
    ]
    for position, song in enumerate(playlist.songs, start=1):
        url = song_detail_url(song)
        link = f"[打开]({url})" if url else "不可用"
        lines.append(
            "| {position} | {title} | {artists} | {album} | {duration} | {link} |".format(
                position=position,
                title=_cell(song_title(song)) or "（无标题）",
                artists=_cell(" / ".join(artist_names(song))) or "—",
                album=_cell(album_name(song)) or "—",
                duration=_duration(duration_seconds(song)),
                link=link,
            )
        )
    return "\n".join(lines) + "\n"


def _album_markdown(album: Album) -> str:
    expected = album.expected_song_count
    count_text = str(len(album.songs))
    if expected is not None:
        count_text += f" / 客户端记录 {expected}"
    album_url = album_detail_url(album.album_mid)

    lines = [
        f"# {album.name}",
        "",
        f"- 类型：收藏专辑",
        f"- 歌手：{' / '.join(album.artists) or '—'}",
        f"- 专辑 MID：`{album.album_mid}`",
        f"- 曲目数：{count_text}",
        f"- QQ 音乐：[打开专辑]({album_url})",
        "",
        "| # | 歌曲 | 歌手 | 时长 | QQ 音乐 |",
        "|---:|---|---|---:|---|",
    ]
    for position, song in enumerate(album.songs, start=1):
        url = song_detail_url(song)
        link = f"[打开]({url})" if url else "不可用"
        lines.append(
            "| {position} | {title} | {artists} | {duration} | {link} |".format(
                position=position,
                title=_cell(song_title(song)) or "（无标题）",
                artists=_cell(" / ".join(artist_names(song))) or "—",
                duration=_duration(duration_seconds(song)),
                link=link,
            )
        )
    return "\n".join(lines) + "\n"


def _playlist_index_rows(
    entries: list[tuple[Playlist, Path]],
    directory: Path,
) -> list[str]:
    rows = [
        "| 歌单 | 类型 | 歌曲数 | 明细 |",
        "|---|---|---:|---|",
    ]
    for playlist, path in entries:
        target = quote(path.relative_to(directory).as_posix())
        category = _CATEGORY_LABELS.get(playlist.category, playlist.category)
        rows.append(
            "| {name} | {category} | {songs} | [查看]({target}) |".format(
                name=_cell(playlist.name),
                category=_cell(category),
                songs=len(playlist.songs),
                target=target,
            )
        )
    return rows


def _album_index_rows(
    entries: list[tuple[Album, Path]],
    directory: Path,
) -> list[str]:
    rows = [
        "| 专辑 | 歌手 | 曲目数 | 明细 |",
        "|---|---|---:|---|",
    ]
    for album, path in entries:
        target = quote(path.relative_to(directory).as_posix())
        rows.append(
            "| {name} | {artists} | {tracks} | [查看]({target}) |".format(
                name=_cell(album.name),
                artists=_cell(" / ".join(album.artists)) or "—",
                tracks=len(album.songs),
                target=target,
            )
        )
    return rows


def export_markdown(
    batch: Path,
    playlists: list[Playlist],
    albums: list[Album],
) -> list[str]:
    """Write the Markdown reading view and return manifest-relative paths."""

    directory = batch / "normalized" / "markdown"
    playlist_directory = directory / "playlists"
    album_directory = directory / "albums"
    playlist_directory.mkdir(parents=True, exist_ok=True)
    album_directory.mkdir(parents=True, exist_ok=True)
    files: list[str] = []
    playlist_entries: list[tuple[Playlist, Path]] = []
    album_entries: list[tuple[Album, Path]] = []

    for playlist in playlists:
        path = unique_path(
            playlist_directory,
            safe_filename(playlist.name),
            ".md",
            playlist.playlist_id,
        )
        path.write_text(_playlist_markdown(playlist), encoding="utf-8")
        playlist_entries.append((playlist, path))
        files.append(path.relative_to(batch).as_posix())

    for album in albums:
        path = unique_path(
            album_directory,
            safe_filename(album.name),
            ".md",
            album.album_mid,
        )
        path.write_text(_album_markdown(album), encoding="utf-8")
        album_entries.append((album, path))
        files.append(path.relative_to(batch).as_posix())

    liked_entries = [
        item for item in playlist_entries if item[0].name.strip() == "我喜欢"
    ]
    self_created_entries = [
        item
        for item in playlist_entries
        if item[0].category == "self_created"
        and item[0].name.strip() != "我喜欢"
    ]
    favorited_entries = [
        item for item in playlist_entries if item[0].category == "favorited"
    ]

    index_lines = [
        "# QQ 音乐收藏阅读索引",
        "",
        f"本批次包含 {len(liked_entries)} 个“我喜欢”歌曲清单、"
        f"{len(self_created_entries)} 个其它自建歌单、"
        f"{len(favorited_entries)} 个收藏歌单和 {len(albums)} 张收藏专辑。",
        "",
        "## 我喜欢的歌曲",
        "",
        *_playlist_index_rows(liked_entries, directory),
        "",
        "## 其它自建歌单",
        "",
        *_playlist_index_rows(self_created_entries, directory),
        "",
        "## 收藏歌单",
        "",
        *_playlist_index_rows(favorited_entries, directory),
        "",
        "## 收藏专辑",
        "",
        *_album_index_rows(album_entries, directory),
        "",
    ]
    index_path = directory / "README.md"
    index_path.write_text("\n".join(index_lines), encoding="utf-8")
    return [index_path.relative_to(batch).as_posix(), *files]
