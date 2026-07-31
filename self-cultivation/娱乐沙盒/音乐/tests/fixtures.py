"""Small credential-free QQ Music-shaped fixtures."""

from __future__ import annotations


def sample_payload() -> dict[str, object]:
    liked_song = {
        "id": 101,
        "mid": "song-mid-101",
        "name": "测试歌曲",
        "interval": 185,
        "singer": [{"id": 1, "name": "测试歌手"}],
        "album": {"id": 2, "name": "测试专辑"},
    }
    other_song = {
        "id": 102,
        "mid": "song-mid-102",
        "title": "第二首歌",
        "interval": "200",
        "singer": [{"title": "另一位歌手"}],
        "albumname": "另一张专辑",
    }
    return {
        "collectedAt": "2026-07-31T04:00:00.000Z",
        "collections": {
            "selfCreatedCount": 2,
            "favoritePlaylistCount": 0,
        },
        "playlists": [
            {
                "category": "self_created",
                "metadata": {
                    "tid": 1001,
                    "dirId": 201,
                    "dirName": "我喜欢",
                    "songNum": 1,
                },
                "songs": [liked_song],
            },
            {
                "category": "self_created",
                "metadata": {
                    "tid": 1002,
                    "dirId": 1,
                    "dirName": "测试/歌单",
                    "songNum": 1,
                },
                "songs": [other_song],
            },
        ],
    }
