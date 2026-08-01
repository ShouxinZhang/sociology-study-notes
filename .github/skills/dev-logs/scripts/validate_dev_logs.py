#!/usr/bin/env python3
"""Validate new-format task logs without rewriting legacy records."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


NEW_RECORD = re.compile(r"\d{2}-\d{2}-\d{2}\+[a-z0-9]+(?:-[a-z0-9]+)*\.md")
MONTH = re.compile(r"\d{4}-\d{2}")
DAY = re.compile(r"\d{4}-\d{2}-\d{2}")
REQUIRED_HEADINGS = (
    "## 用户目标",
    "## 用户原始 Prompt",
    "## 方案与边界",
    "## 关键动作",
    "## 变更文件",
    "## 验证结果",
    "## 风险与回滚",
    "## 最终成果",
)
REQUIRED_FIELDS = (
    "任务 ID",
    "开始时间",
    "完成时间",
    "状态",
    "类型",
    "影响范围",
    "执行模型",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("docs/dev_logs"))
    parser.add_argument("--record", type=Path, action="append", default=[])
    return parser.parse_args()


def relative_link_present(index: Path, target_name: str) -> bool:
    if not index.is_file():
        return False
    return bool(re.search(rf"\]\([^)]*{re.escape(target_name)}\)", index.read_text(errors="replace")))


def validate_record(record: Path, root: Path) -> list[str]:
    errors: list[str] = []
    try:
        relative = record.resolve().relative_to(root.resolve())
    except ValueError:
        return [f"record is outside dev-log root: {record}"]

    if len(relative.parts) != 3:
        errors.append(f"new record must have month/day/file depth: {record}")
        return errors
    month, day, filename = relative.parts
    if not MONTH.fullmatch(month) or not DAY.fullmatch(day) or day[:7] != month:
        errors.append(f"invalid month/day partition: {record}")
    if not NEW_RECORD.fullmatch(filename):
        errors.append(f"invalid new record filename: {filename}")
    if not record.is_file():
        errors.append(f"record does not exist: {record}")
        return errors

    text = record.read_text(errors="replace")
    for field in REQUIRED_FIELDS:
        if not re.search(rf"^- {re.escape(field)}：\S", text, re.MULTILINE):
            errors.append(f"missing field '{field}': {record}")
    for heading in REQUIRED_HEADINGS:
        if heading not in text:
            errors.append(f"missing heading '{heading}': {record}")

    day_index = record.parent / "README.md"
    month_index = record.parent.parent / "README.md"
    root_index = root / "INDEX.md"
    if not relative_link_present(day_index, filename):
        errors.append(f"day index does not link record: {record}")
    if not relative_link_present(month_index, f"{day}/README.md"):
        errors.append(f"month index does not link day: {record.parent}")
    if not relative_link_present(root_index, f"{month}/README.md"):
        errors.append(f"root index does not link month: {record.parent.parent}")
    return errors


def main() -> int:
    args = parse_args()
    root = args.root
    if not root.is_dir():
        print(f"ERROR: dev-log root does not exist: {root}", file=sys.stderr)
        return 1

    records = list(args.record)
    if not records:
        records = [path for path in root.glob("*/*/*.md") if NEW_RECORD.fullmatch(path.name)]

    errors = [error for record in records for error in validate_record(record, root)]
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"PASS: validated {len(records)} new-format task log(s); legacy logs were not rewritten")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
