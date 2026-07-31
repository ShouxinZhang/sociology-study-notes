"""Command-line entry point for exporting all QQ Music playlists."""

from __future__ import annotations

import argparse
import sys
from contextlib import nullcontext
from pathlib import Path

from .album_service import AlbumDataError, incomplete_albums, load_albums
from .client import (
    IsolatedQQMusicSession,
    QQMusicClientError,
    collect_from_runtime,
)
from .exporters import export_bundle
from .playlist_service import (
    PlaylistDataError,
    incomplete_playlists,
    load_playlists,
)


def _default_music_root() -> Path:
    return Path(__file__).resolve().parents[2]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="导出当前 QQ 音乐账号的我喜欢、自建和收藏歌单"
    )
    parser.add_argument(
        "--endpoint",
        help="连接已开启调试端口的 QQ 音乐客户端，例如 http://127.0.0.1:49222",
    )
    parser.add_argument(
        "--source-profile",
        type=Path,
        default=Path.home() / ".config" / "qqmusic",
        help="当前 QQ 音乐用户配置目录",
    )
    parser.add_argument(
        "--qqmusic-bin",
        type=Path,
        default=Path("/opt/qqmusic/qqmusic"),
        help="QQ 音乐 Linux 客户端程序",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=_default_music_root() / "exports",
        help="导出批次的父目录",
    )
    parser.add_argument(
        "--node-bin",
        default="node",
        help="Node.js 可执行文件（仅使用内置 WebSocket，无 npm 依赖）",
    )
    return parser


def run(args: argparse.Namespace) -> Path:
    if args.endpoint:
        session = nullcontext(args.endpoint)
    else:
        session = IsolatedQQMusicSession(
            source_profile=args.source_profile,
            qqmusic_bin=args.qqmusic_bin,
        )

    with session as endpoint:
        payload = collect_from_runtime(endpoint, node_bin=args.node_bin)

    playlists = load_playlists(payload)
    albums = load_albums(payload)
    incomplete = incomplete_playlists(playlists)
    if incomplete:
        details = "；".join(
            f"{item.name}: 预期 {item.expected_song_count}, 导出 {len(item.songs)}"
            for item in incomplete
        )
        raise PlaylistDataError(f"歌单歌曲数不完整：{details}")

    incomplete_album_list = incomplete_albums(albums)
    if incomplete_album_list:
        details = "；".join(
            f"{item.name}: 预期 {item.expected_song_count}, 导出 {len(item.songs)}"
            for item in incomplete_album_list
        )
        raise AlbumDataError(f"收藏专辑曲目数不完整：{details}")

    batch, manifest = export_bundle(
        args.output_root.resolve(),
        playlists,
        albums,
    )
    print(f"导出完成：{batch}")
    print(
        "歌单：{playlist_count}；歌曲条目：{song_membership_count}；"
        "收藏专辑：{album_count}；专辑曲目：{album_track_count}；"
        "跨歌单与专辑去重歌曲：{unique_song_mid_count}".format(**manifest)
    )
    return batch


def main() -> int:
    args = build_parser().parse_args()
    try:
        run(args)
    except (
        QQMusicClientError,
        AlbumDataError,
        PlaylistDataError,
        FileExistsError,
        OSError,
    ) as error:
        print(f"导出失败：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
