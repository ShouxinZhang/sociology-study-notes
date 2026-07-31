from __future__ import annotations

import unittest

from tests.fixtures import sample_payload
from tools.qqmusic_export.playlist_service import (
    PlaylistDataError,
    incomplete_playlists,
    load_playlists,
)


class PlaylistServiceTests(unittest.TestCase):
    def test_loads_liked_and_other_playlists(self) -> None:
        playlists = load_playlists(sample_payload())

        self.assertEqual(["我喜欢", "测试/歌单"], [item.name for item in playlists])
        self.assertEqual([], incomplete_playlists(playlists))

    def test_rejects_missing_liked_playlist(self) -> None:
        payload = sample_payload()
        payload["playlists"] = payload["playlists"][1:]  # type: ignore[index]

        with self.assertRaisesRegex(PlaylistDataError, "我喜欢"):
            load_playlists(payload)

    def test_reports_song_count_mismatch(self) -> None:
        payload = sample_payload()
        payload["playlists"][0]["metadata"]["songNum"] = 2  # type: ignore[index]

        playlists = load_playlists(payload)

        self.assertEqual(["我喜欢"], [item.name for item in incomplete_playlists(playlists)])


if __name__ == "__main__":
    unittest.main()
