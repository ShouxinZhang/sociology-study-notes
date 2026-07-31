from __future__ import annotations

import unittest

from tools.qqmusic_export.security import find_sensitive_paths, sanitize


class SecurityTests(unittest.TestCase):
    def test_removes_nested_authentication_fields(self) -> None:
        value = {
            "playlist": {
                "name": "保留",
                "access_token": "remove",
                "refreshToken": "remove",
                "musickey": "remove",
                "nested": [{"cookie": "remove", "mid": "keep"}],
            }
        }

        clean = sanitize(value)

        self.assertEqual("保留", clean["playlist"]["name"])
        self.assertEqual("keep", clean["playlist"]["nested"][0]["mid"])
        self.assertEqual([], find_sensitive_paths(clean))
        self.assertNotIn("access_token", clean["playlist"])
        self.assertNotIn("musickey", clean["playlist"])


if __name__ == "__main__":
    unittest.main()
