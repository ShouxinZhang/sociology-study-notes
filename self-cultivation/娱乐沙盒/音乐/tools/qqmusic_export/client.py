"""Start an isolated QQ Music client and collect its in-memory playlist data."""

from __future__ import annotations

import json
import os
import shutil
import signal
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from contextlib import AbstractContextManager
from pathlib import Path
from typing import Any


class QQMusicClientError(RuntimeError):
    """Raised when an isolated client or the runtime collector fails."""


def _free_tcp_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
        listener.bind(("127.0.0.1", 0))
        return int(listener.getsockname()[1])


def _available_display() -> int:
    for number in range(90, 151):
        if not Path(f"/tmp/.X11-unix/X{number}").exists():
            return number
    raise QQMusicClientError("没有可用的 Xvfb 显示编号（90—150）")


def _wait_for_json_endpoint(endpoint: str, process: subprocess.Popen[bytes]) -> None:
    deadline = time.monotonic() + 45
    url = f"{endpoint.rstrip('/')}/json/list"
    last_error = "尚未响应"
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise QQMusicClientError(
                f"临时 QQ 音乐客户端提前退出，状态码 {process.returncode}"
            )
        try:
            with urllib.request.urlopen(url, timeout=1) as response:
                targets = json.load(response)
            if any(
                item.get("type") == "page"
                and "index.html" in str(item.get("url", ""))
                for item in targets
            ):
                return
            last_error = "调试端口已响应，但主窗口尚未载入"
        except (OSError, urllib.error.URLError, json.JSONDecodeError) as error:
            last_error = str(error)
        time.sleep(0.25)
    raise QQMusicClientError(f"等待 QQ 音乐客户端超时：{last_error}")


def _stop_process_group(process: subprocess.Popen[bytes] | None) -> None:
    if process is None or process.poll() is not None:
        return
    try:
        os.killpg(process.pid, signal.SIGTERM)
        process.wait(timeout=8)
    except (ProcessLookupError, subprocess.TimeoutExpired):
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        process.wait(timeout=3)


class IsolatedQQMusicSession(AbstractContextManager[str]):
    """A disposable QQ Music process backed by a copied local login profile."""

    _EXCLUDED_NAMES = {
        "Cache",
        "Code Cache",
        "GPUCache",
        "SS",
        "SingletonCookie",
        "SingletonLock",
        "SingletonSocket",
    }

    def __init__(self, source_profile: Path, qqmusic_bin: Path) -> None:
        self.source_profile = source_profile.expanduser().resolve()
        self.qqmusic_bin = qqmusic_bin.expanduser().resolve()
        self._temporary: tempfile.TemporaryDirectory[str] | None = None
        self._xvfb: subprocess.Popen[bytes] | None = None
        self._qqmusic: subprocess.Popen[bytes] | None = None

    def _ignore_profile_items(
        self, _directory: str, names: list[str]
    ) -> set[str]:
        return {
            name
            for name in names
            if name in self._EXCLUDED_NAMES
            or name.startswith(".org.chromium.Chromium.")
        }

    def __enter__(self) -> str:
        if not self.source_profile.is_dir():
            raise QQMusicClientError(
                f"QQ 音乐配置目录不存在：{self.source_profile}"
            )
        if not self.qqmusic_bin.is_file():
            raise QQMusicClientError(
                f"QQ 音乐程序不存在：{self.qqmusic_bin}"
            )
        if shutil.which("Xvfb") is None:
            raise QQMusicClientError("系统未安装 Xvfb，无法隔离启动客户端")

        self._temporary = tempfile.TemporaryDirectory(
            prefix="qqmusic-playlist-export-"
        )
        profile = Path(self._temporary.name) / "profile"
        shutil.copytree(
            self.source_profile,
            profile,
            ignore=self._ignore_profile_items,
            symlinks=False,
        )

        display = _available_display()
        self._xvfb = subprocess.Popen(
            [
                "Xvfb",
                f":{display}",
                "-screen",
                "0",
                "1600x1000x24",
                "-nolisten",
                "tcp",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        display_socket = Path(f"/tmp/.X11-unix/X{display}")
        deadline = time.monotonic() + 10
        while not display_socket.exists() and time.monotonic() < deadline:
            if self._xvfb.poll() is not None:
                raise QQMusicClientError("Xvfb 启动失败")
            time.sleep(0.1)

        port = _free_tcp_port()
        endpoint = f"http://127.0.0.1:{port}"
        environment = os.environ.copy()
        environment.pop("ELECTRON_RUN_AS_NODE", None)
        environment["DISPLAY"] = f":{display}"

        # The application logs login parameters on stdout in this historical
        # Linux build. Discard both streams so credentials never reach logs.
        self._qqmusic = subprocess.Popen(
            [
                str(self.qqmusic_bin),
                "--disable-gpu-sandbox",
                "--no-sandbox",
                "--disable-gpu",
                f"--user-data-dir={profile}",
                "--remote-debugging-address=127.0.0.1",
                f"--remote-debugging-port={port}",
            ],
            env=environment,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        try:
            _wait_for_json_endpoint(endpoint, self._qqmusic)
        except Exception:
            self.__exit__(None, None, None)
            raise
        return endpoint

    def __exit__(self, _type: object, _value: object, _traceback: object) -> None:
        _stop_process_group(self._qqmusic)
        _stop_process_group(self._xvfb)
        if self._temporary is not None:
            self._temporary.cleanup()
        self._qqmusic = None
        self._xvfb = None
        self._temporary = None


def collect_from_runtime(
    endpoint: str,
    *,
    node_bin: str = "node",
    timeout_seconds: int = 900,
) -> dict[str, Any]:
    """Run the JavaScript CDP collector and decode its JSON payload."""

    collector = Path(__file__).with_name("runtime") / "collect.mjs"
    try:
        result = subprocess.run(
            [node_bin, str(collector), endpoint],
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout_seconds,
        )
    except FileNotFoundError as error:
        raise QQMusicClientError(f"找不到 Node.js：{node_bin}") from error
    except subprocess.TimeoutExpired as error:
        raise QQMusicClientError("采集 QQ 音乐歌单超时") from error

    if result.returncode != 0:
        diagnostic = result.stderr.strip().splitlines()
        summary = diagnostic[-1] if diagnostic else "未知错误"
        raise QQMusicClientError(f"QQ 音乐运行时采集失败：{summary}")

    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError as error:
        raise QQMusicClientError("采集器返回了无效 JSON") from error
    if not isinstance(payload, dict):
        raise QQMusicClientError("采集器返回值不是 JSON 对象")
    return payload
