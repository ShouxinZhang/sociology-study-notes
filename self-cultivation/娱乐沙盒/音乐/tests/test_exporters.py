from __future__ import annotations

import csv
import json
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from tests.fixtures import sample_payload
from tools.qqmusic_export.album_service import load_albums
from tools.qqmusic_export.exporters import export_bundle
from tools.qqmusic_export.exporters.common import song_detail_url
from tools.qqmusic_export.playlist_service import load_playlists


class ExporterTests(unittest.TestCase):
    def test_writes_complete_bundle(self) -> None:
        playlists = load_playlists(sample_payload())
        albums = load_albums(sample_payload())
        exported_at = datetime(
            2026, 7, 31, 12, 34, 56, tzinfo=ZoneInfo("Asia/Shanghai")
        )

        with tempfile.TemporaryDirectory() as temporary:
            batch, manifest = export_bundle(
                Path(temporary),
                playlists,
                albums,
                exported_at=exported_at,
            )

            self.assertEqual("current", batch.name)
            self.assertTrue((batch / "raw" / "我喜欢.json").is_file())
            self.assertTrue(
                (batch / "raw" / "playlists" / "测试_歌单.json").is_file()
            )
            self.assertEqual(2, manifest["playlist_count"])
            self.assertEqual(2, manifest["song_membership_count"])
            self.assertEqual(1, manifest["album_count"])
            self.assertEqual(1, manifest["album_track_count"])
            self.assertTrue(manifest["complete"])

            normalized = json.loads(
                (batch / "normalized" / "playlists.json").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual("song-mid-101", normalized[0]["songs"][0]["song_mid"])

            with (batch / "normalized" / "songs.csv").open(
                encoding="utf-8-sig", newline=""
            ) as stream:
                rows = list(csv.DictReader(stream))
            self.assertEqual(2, len(rows))
            self.assertEqual("测试歌手", rows[0]["artists"])

            albums_json = json.loads(
                (batch / "normalized" / "albums.json").read_text(encoding="utf-8")
            )
            self.assertEqual("测试收藏专辑", albums_json[0]["name"])
            self.assertEqual(1, len(albums_json[0]["tracks"]))

            with (batch / "normalized" / "album_tracks.csv").open(
                encoding="utf-8-sig", newline=""
            ) as stream:
                album_rows = list(csv.DictReader(stream))
            self.assertEqual(1, len(album_rows))
            self.assertEqual("测试收藏专辑", album_rows[0]["album_name"])

            m3u = (batch / "normalized" / "m3u" / "我喜欢.m3u8").read_text(
                encoding="utf-8"
            )
            self.assertIn("#EXTM3U", m3u)
            self.assertIn(
                "https://y.qq.com/n/ryqq/songDetail/song-mid-101",
                m3u,
            )

            markdown_index = (
                batch / "normalized" / "markdown" / "README.md"
            ).read_text(encoding="utf-8")
            liked_markdown = (
                batch / "normalized" / "markdown" / "playlists" / "我喜欢.md"
            ).read_text(encoding="utf-8")
            self.assertIn("QQ 音乐收藏阅读索引", markdown_index)
            self.assertIn("我喜欢", markdown_index)
            self.assertIn(
                "| 1 | 测试歌曲 | 测试歌手 | 测试专辑 | 3:05 |",
                liked_markdown,
            )
            album_markdown = (
                batch
                / "normalized"
                / "markdown"
                / "albums"
                / "测试收藏专辑.md"
            ).read_text(encoding="utf-8")
            self.assertIn("## 收藏歌单", markdown_index)
            self.assertIn("## 收藏专辑", markdown_index)
            self.assertIn("测试收藏专辑", markdown_index)
            self.assertIn("| 1 | 测试歌曲 | 测试歌手 | 3:05 |", album_markdown)

            album_m3u = (
                batch / "normalized" / "m3u" / "albums" / "测试收藏专辑.m3u8"
            ).read_text(encoding="utf-8")
            self.assertIn("#PLAYLIST:测试收藏专辑", album_m3u)
            self.assertIn(
                "https://y.qq.com/n/ryqq/songDetail/song-mid-101",
                liked_markdown,
            )

    def test_song_url_falls_back_to_numeric_id(self) -> None:
        self.assertEqual(
            "https://y.qq.com/n/ryqq/songDetail/3485118947",
            song_detail_url({"id": 3485118947, "mid": ""}),
        )

    def test_replaces_current_snapshot_without_history_directories(self) -> None:
        playlists = load_playlists(sample_payload())
        albums = load_albums(sample_payload())
        first_time = datetime(
            2026, 7, 31, 12, 0, 0, tzinfo=ZoneInfo("Asia/Shanghai")
        )
        second_time = datetime(
            2026, 7, 31, 13, 0, 0, tzinfo=ZoneInfo("Asia/Shanghai")
        )

        with tempfile.TemporaryDirectory() as temporary:
            output_root = Path(temporary)
            export_bundle(
                output_root,
                playlists,
                albums,
                exported_at=first_time,
            )
            batch, manifest = export_bundle(
                output_root,
                playlists,
                albums,
                exported_at=second_time,
            )

            self.assertEqual(output_root / "current", batch)
            self.assertEqual(second_time.isoformat(), manifest["exported_at"])
            self.assertEqual(
                ["current"],
                sorted(path.name for path in output_root.iterdir()),
            )


if __name__ == "__main__":
    unittest.main()
