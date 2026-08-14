#!/usr/bin/env python3
"""输出当前 AI 编程模型标识；无法核实时输出 ``unknown``。"""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
from collections import deque
from collections.abc import Callable, Iterable
from pathlib import Path
from typing import Any

UNKNOWN = "unknown"
FRAMEWORKS = ("codex", "github-copilot", "claude-code", "opencode", "grok")


class ChineseArgumentParser(argparse.ArgumentParser):
    """将 argparse 帮助标题统一为简体中文。"""

    def format_help(self) -> str:
        return (
            super()
            .format_help()
            .replace("usage:", "用法:", 1)
            .replace("options:", "选项:", 1)
        )


def clean_model(value: Any) -> str | None:
    """接受模型标识，拒绝不代表具体模型的选择器。"""
    if not isinstance(value, str):
        return None
    model = value.strip()
    if not model or model.lower() in {"auto", "default", "unknown", "<synthetic>"}:
        return None
    return model


def json_lines(path: Path) -> Iterable[dict[str, Any]]:
    """逐行读取合法 JSON，并容忍未写完的会话日志行。"""
    try:
        with path.open(encoding="utf-8", errors="replace") as stream:
            for line in stream:
                try:
                    value = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if isinstance(value, dict):
                    yield value
    except OSError:
        return


def last_match(
    path: Path, extract: Callable[[dict[str, Any]], str | None]
) -> str | None:
    """返回最后一个匹配值，不在内存中保留完整日志。"""
    matches: deque[str] = deque(maxlen=1)
    for item in json_lines(path):
        model = extract(item)
        if model:
            matches.append(model)
    return matches[-1] if matches else None


def newest(paths: Iterable[Path]) -> Path | None:
    """选择最近修改且可读取的路径。"""
    candidates: list[tuple[int, Path]] = []
    for path in paths:
        try:
            candidates.append((path.stat().st_mtime_ns, path))
        except OSError:
            continue
    return max(candidates, default=(0, None))[1]


def model_from_mapping(value: Any) -> str | None:
    """将常见供应商/模型对象规范化为稳定标识。"""
    if isinstance(value, str):
        return clean_model(value)
    if not isinstance(value, dict):
        return None
    model = clean_model(
        value.get("modelID")
        or value.get("model_id")
        or value.get("id")
        or value.get("name")
    )
    provider = clean_model(
        value.get("providerID") or value.get("provider_id") or value.get("provider")
    )
    if model and provider and not model.startswith(f"{provider}/"):
        return f"{provider}/{model}"
    return model


def codex_model(env: dict[str, str]) -> str | None:
    """从当前 Codex 回合上下文读取实际模型。"""
    thread_id = env.get("CODEX_THREAD_ID")
    if not thread_id:
        return None
    root = Path(env.get("CODEX_HOME", str(Path.home() / ".codex"))).expanduser()
    session = newest(root.glob(f"sessions/**/*{thread_id}.jsonl"))
    if not session:
        return None

    def extract(item: dict[str, Any]) -> str | None:
        if item.get("type") != "turn_context":
            return None
        payload = item.get("payload")
        return clean_model(payload.get("model")) if isinstance(payload, dict) else None

    return last_match(session, extract)


def copilot_model(env: dict[str, str]) -> str | None:
    """从 Copilot 会话开始或最后一次模型切换事件读取模型。"""
    root = Path(env.get("COPILOT_HOME", str(Path.home() / ".copilot"))).expanduser()
    session_id = env.get("COPILOT_SESSION_ID")
    if session_id:
        event_file = root / "session-state" / session_id / "events.jsonl"
    else:
        event_file = newest(root.glob("session-state/*/events.jsonl"))

    def extract(item: dict[str, Any]) -> str | None:
        if item.get("type") not in {
            "session.start",
            "session.resume",
            "session.model_change",
        }:
            return None
        data = item.get("data")
        if not isinstance(data, dict):
            return None
        for key in ("model", "modelId", "model_id", "resolvedModel", "newModel"):
            model = model_from_mapping(data.get(key))
            if model:
                return model
        return None

    session_model = (
        last_match(event_file, extract) if event_file and event_file.is_file() else None
    )
    return session_model or clean_model(env.get("COPILOT_MODEL"))


def claude_model(env: dict[str, str]) -> str | None:
    """从 Claude Code 最近一条助手消息读取模型。"""
    root = Path(env.get("CLAUDE_CONFIG_DIR", str(Path.home() / ".claude"))).expanduser()
    session_id = env.get("CLAUDE_CODE_SESSION_ID") or env.get("CLAUDE_SESSION_ID")
    if session_id:
        transcript = newest(root.glob(f"projects/**/*{session_id}.jsonl"))
    else:
        transcript = newest(root.glob("projects/**/*.jsonl"))
    if not transcript:
        return clean_model(env.get("ANTHROPIC_MODEL"))

    def extract(item: dict[str, Any]) -> str | None:
        message = item.get("message")
        return clean_model(message.get("model")) if isinstance(message, dict) else None

    return last_match(transcript, extract) or clean_model(env.get("ANTHROPIC_MODEL"))


def opencode_model(env: dict[str, str], cwd: Path) -> str | None:
    """从 OpenCode 只读会话数据库读取选中模型。"""
    data_root = Path(
        env.get("XDG_DATA_HOME", str(Path.home() / ".local/share"))
    ).expanduser()
    database = Path(
        env.get("OPENCODE_DB", str(data_root / "opencode/opencode.db"))
    ).expanduser()
    if not database.is_file():
        return clean_model(env.get("OPENCODE_MODEL"))
    session_id = env.get("OPENCODE_SESSION_ID")
    try:
        connection = sqlite3.connect(f"file:{database}?mode=ro", uri=True)
        if session_id:
            row = connection.execute(
                "SELECT model FROM session WHERE id = ?", (session_id,)
            ).fetchone()
        else:
            row = connection.execute(
                "SELECT model FROM session WHERE directory = ? ORDER BY time_updated DESC LIMIT 1",
                (str(cwd),),
            ).fetchone()
        connection.close()
    except (OSError, sqlite3.Error):
        row = None
    if row and row[0]:
        try:
            return model_from_mapping(json.loads(row[0]))
        except (TypeError, json.JSONDecodeError):
            return clean_model(row[0])
    return clean_model(env.get("OPENCODE_MODEL"))


def grok_model(env: dict[str, str], cwd: Path) -> str | None:
    """从 Grok 会话摘要读取当前模型标识。"""
    root = Path(env.get("GROK_HOME", str(Path.home() / ".grok"))).expanduser()
    session_id = env.get("GROK_SESSION_ID")
    summaries = (
        list(root.glob(f"sessions/**/{session_id}/summary.json"))
        if session_id
        else list(root.glob("sessions/**/summary.json"))
    )
    if not session_id:
        matching: list[Path] = []
        for summary in summaries:
            try:
                data = json.loads(summary.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                continue
            info = data.get("info")
            if isinstance(info, dict) and info.get("cwd") == str(cwd):
                matching.append(summary)
        summaries = matching
    summary = newest(summaries)
    if summary:
        try:
            data = json.loads(summary.read_text(encoding="utf-8"))
            model = clean_model(data.get("current_model_id"))
            if model:
                return model
        except (OSError, json.JSONDecodeError):
            pass
    return clean_model(env.get("GROK_DEFAULT_MODEL"))


def parent_commands() -> str:
    """仅检查进程名称，用于识别调用方框架。"""
    commands: list[str] = []
    pid = os.getppid()
    for _ in range(12):
        if pid <= 1:
            break
        try:
            commands.append(
                Path(f"/proc/{pid}/cmdline")
                .read_bytes()
                .replace(b"\0", b" ")
                .decode(errors="ignore")
                .lower()
            )
            status = Path(f"/proc/{pid}/status").read_text(
                encoding="utf-8", errors="ignore"
            )
            pid = int(
                next(
                    line.split()[1]
                    for line in status.splitlines()
                    if line.startswith("PPid:")
                )
            )
        except (OSError, StopIteration, ValueError):
            break
    return "\n".join(commands)


def infer_framework(env: dict[str, str]) -> str | None:
    """识别当前宿主，不使用过期模型历史推断。"""
    explicit = env.get("AI_FRAMEWORK")
    if explicit in FRAMEWORKS:
        return explicit
    markers = (
        ("codex", ("CODEX_THREAD_ID",)),
        ("github-copilot", ("COPILOT_CLI", "COPILOT_SESSION_ID", "COPILOT_MODEL")),
        ("opencode", ("OPENCODE_PID", "OPENCODE_SESSION_ID")),
        ("grok", ("GROK_SESSION_ID", "GROK_HOOK_EVENT")),
        ("claude-code", ("CLAUDE_CODE_SESSION_ID", "CLAUDE_SESSION_ID")),
    )
    for framework, names in markers:
        if any(env.get(name) for name in names):
            return framework
    commands = parent_commands()
    for framework, command in (
        ("codex", "codex"),
        ("github-copilot", "copilot"),
        ("claude-code", "claude"),
        ("opencode", "opencode"),
        ("grok", "grok"),
    ):
        if command in commands:
            return framework
    return None


def main() -> int:
    """解析当前框架，仅输出一个可审计值。"""
    parser = ChineseArgumentParser(description=__doc__, add_help=False)
    parser.add_argument("-h", "--help", action="help", help="显示帮助并退出")
    parser.add_argument(
        "--framework", choices=FRAMEWORKS, help="显式指定当前 AI 编程框架"
    )
    args = parser.parse_args()
    env = dict(os.environ)
    explicit_model = clean_model(env.get("AI_MODEL_NAME"))
    if explicit_model:
        print(explicit_model)
        return 0
    framework = args.framework or infer_framework(env)
    cwd = Path.cwd().resolve()
    detectors: dict[str, Callable[[], str | None]] = {
        "codex": lambda: codex_model(env),
        "github-copilot": lambda: copilot_model(env),
        "claude-code": lambda: claude_model(env),
        "opencode": lambda: opencode_model(env, cwd),
        "grok": lambda: grok_model(env, cwd),
    }
    model = detectors[framework]() if framework in detectors else None
    print(model or UNKNOWN)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
