from __future__ import annotations

import csv
import json
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from tests.fixtures import sample_payload
from tools.qqmusic_export.exporters import export_bundle
from tools.qqmusic_export.exporters.common import song_detail_url
from tools.qqmusic_export.playlist_service import load_playlists


class ExporterTests(unittest.TestCase):
    def test_writes_complete_bundle(self) -> None:
        playlists = load_playlists(sample_payload())
        exported_at = datetime(
            2026, 7, 31, 12, 34, 56, tzinfo=ZoneInfo("Asia/Shanghai")
        )

        with tempfile.TemporaryDirectory() as temporary:
            batch, manifest = export_bundle(
                Path(temporary), playlists, exported_at=exported_at
            )

            self.assertEqual("20260731_123456", batch.name)
            self.assertTrue((batch / "raw" / "我喜欢.json").is_file())
            self.assertTrue(
                (batch / "raw" / "playlists" / "测试_歌单.json").is_file()
            )
            self.assertEqual(2, manifest["playlist_count"])
            self.assertEqual(2, manifest["song_membership_count"])
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
            self.assertIn("QQ 音乐歌单阅读索引", markdown_index)
            self.assertIn("我喜欢", markdown_index)
            self.assertIn(
                "| 1 | 测试歌曲 | 测试歌手 | 测试专辑 | 3:05 |",
                liked_markdown,
            )
            self.assertIn(
                "https://y.qq.com/n/ryqq/songDetail/song-mid-101",
                liked_markdown,
            )

    def test_song_url_falls_back_to_numeric_id(self) -> None:
        self.assertEqual(
            "https://y.qq.com/n/ryqq/songDetail/3485118947",
            song_detail_url({"id": 3485118947, "mid": ""}),
        )


if __name__ == "__main__":
    unittest.main()
