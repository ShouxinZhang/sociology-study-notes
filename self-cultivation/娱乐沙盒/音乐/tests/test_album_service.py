from __future__ import annotations

import unittest

from tests.fixtures import sample_payload
from tools.qqmusic_export.album_service import (
    AlbumDataError,
    incomplete_albums,
    load_albums,
)


class AlbumServiceTests(unittest.TestCase):
    def test_loads_complete_favorited_album(self) -> None:
        albums = load_albums(sample_payload())

        self.assertEqual(1, len(albums))
        self.assertEqual("测试收藏专辑", albums[0].name)
        self.assertEqual(["测试歌手"], albums[0].artists)
        self.assertEqual("测试歌曲", albums[0].songs[0]["name"])
        self.assertEqual([], incomplete_albums(albums))

    def test_reports_track_count_mismatch(self) -> None:
        payload = sample_payload()
        payload["albums"][0]["metadata"]["songnum"] = 2  # type: ignore[index]

        albums = load_albums(payload)

        self.assertEqual(
            ["测试收藏专辑"],
            [item.name for item in incomplete_albums(albums)],
        )

    def test_rejects_invalid_song_info(self) -> None:
        payload = sample_payload()
        payload["albums"][0]["details"]["songList"][0] = {}  # type: ignore[index]

        with self.assertRaisesRegex(AlbumDataError, "songInfo"):
            load_albums(payload)


if __name__ == "__main__":
    unittest.main()
