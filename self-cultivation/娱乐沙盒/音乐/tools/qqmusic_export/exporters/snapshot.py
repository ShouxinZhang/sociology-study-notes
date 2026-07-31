"""Atomically replace the single exported music-library snapshot."""

from __future__ import annotations

import shutil
import tempfile
from pathlib import Path
from types import TracebackType


class SnapshotWriter:
    """Build in a temporary directory, then replace ``exports/current``."""

    def __init__(self, output_root: Path) -> None:
        self.output_root = output_root
        self.current = output_root / "current"
        self.previous = output_root / ".current.previous"
        self._temporary: tempfile.TemporaryDirectory[str] | None = None
        self.staging: Path | None = None
        self._committed = False

    def __enter__(self) -> "SnapshotWriter":
        self.output_root.mkdir(parents=True, exist_ok=True)
        self._recover_interrupted_swap()
        self._temporary = tempfile.TemporaryDirectory(
            prefix=".current.staging-",
            dir=self.output_root,
        )
        self.staging = Path(self._temporary.name)
        return self

    def _recover_interrupted_swap(self) -> None:
        if not self.previous.exists():
            return
        if self.current.exists():
            shutil.rmtree(self.previous)
        else:
            self.previous.rename(self.current)

    def commit(self) -> Path:
        if self.staging is None or self._temporary is None:
            raise RuntimeError("snapshot writer is not active")
        if self.previous.exists():
            raise RuntimeError(f"临时旧快照未清理：{self.previous}")

        if self.current.exists():
            self.current.rename(self.previous)
        try:
            self.staging.rename(self.current)
        except Exception:
            if self.previous.exists() and not self.current.exists():
                self.previous.rename(self.current)
            raise

        if self.previous.exists():
            shutil.rmtree(self.previous)
        self._committed = True
        return self.current

    def __exit__(
        self,
        _type: type[BaseException] | None,
        _value: BaseException | None,
        _traceback: TracebackType | None,
    ) -> None:
        if self._temporary is not None:
            self._temporary.cleanup()
        self._temporary = None
        self.staging = None
