"""Write a readable Markdown index and one song table per playlist."""

from __future__ import annotations

from pathlib import Path
from urllib.parse import quote

from ..models import Playlist
from .common import (
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


def export_markdown(batch: Path, playlists: list[Playlist]) -> list[str]:
    """Write the Markdown reading view and return manifest-relative paths."""

    directory = batch / "normalized" / "markdown"
    playlist_directory = directory / "playlists"
    playlist_directory.mkdir(parents=True, exist_ok=True)
    files: list[str] = []
    index_rows: list[str] = []

    for playlist in playlists:
        path = unique_path(
            playlist_directory,
            safe_filename(playlist.name),
            ".md",
            playlist.playlist_id,
        )
        path.write_text(_playlist_markdown(playlist), encoding="utf-8")
        relative_from_index = f"playlists/{quote(path.name)}"
        category = _CATEGORY_LABELS.get(playlist.category, playlist.category)
        index_rows.append(
            "| {name} | {category} | {songs} | [查看]({target}) |".format(
                name=_cell(playlist.name),
                category=_cell(category),
                songs=len(playlist.songs),
                target=relative_from_index,
            )
        )
        files.append(path.relative_to(batch).as_posix())

    index_lines = [
        "# QQ 音乐歌单阅读索引",
        "",
        f"本批次共 {len(playlists)} 个歌单、"
        f"{sum(len(item.songs) for item in playlists)} 条歌单成员记录。",
        "",
        "| 歌单 | 类型 | 歌曲数 | 明细 |",
        "|---|---|---:|---|",
        *index_rows,
        "",
    ]
    index_path = directory / "README.md"
    index_path.write_text("\n".join(index_lines), encoding="utf-8")
    return [index_path.relative_to(batch).as_posix(), *files]
