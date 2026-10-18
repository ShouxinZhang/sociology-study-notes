#!/usr/bin/env python3
"""虚拟朋友圈周记容器自动化创建与索引同步脚本。

功能：
1. 自动计算目标日期所在自然周（周日—周六）的起止时间。
2. 在 weekly/<YYYY>/ 目录下创建规范化的周记 Markdown 容器。
3. 联动更新 random_writing.md 索引：将前一周标记为已归档、回填其源记录数，并追加新一周。
4. 可选回填历史周的源记录数（--backfill-counts）。

说明：架构文档由人工在 docs/architecture/ 中维护，本脚本不再触碰。
"""

from __future__ import annotations

import argparse
import datetime
import os
import re
import subprocess
import sys
from pathlib import Path

# 源记录时间戳行，如 "2026-10-11 14:13:58 CST"；源记录数即此类行的数量（与历史索引口径一致）
TIMESTAMP_RE = re.compile(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} CST\s*$", re.MULTILINE)

# 索引表格行：| [周期](相对路径) | 源记录数 | 状态 |
ROW_RE = re.compile(r"^\|\s*\[(?P<range>[\d-]+)\]\((?P<path>[^)]+)\)\s*\|\s*(?P<count>\d+)\s*\|\s*(?P<status>\S+)\s*\|\s*$", re.MULTILINE)


def find_repo_root() -> Path:
    """定位仓库根目录。"""
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / ".git").exists():
            return parent
    return Path.cwd()


def get_week_bounds(target_date: datetime.date) -> tuple[datetime.date, datetime.date]:
    """计算指定日期所在周的周日（起始）与周六（结束）。"""
    # Python 中 weekday(): 0 为周一，6 为周日
    days_since_sunday = (target_date.weekday() + 1) % 7
    sunday = target_date - datetime.timedelta(days=days_since_sunday)
    return sunday, sunday + datetime.timedelta(days=6)


def resolve_model_name(repo_root: Path, override_model: str | None) -> str | None:
    """解析当前执行模型名称；无法确认时返回 None，由调用方报错，禁止以占位名兜底。"""
    for candidate in (override_model, os.environ.get("AI_MODEL_NAME")):
        if candidate and candidate.strip():
            return candidate.strip()

    script_path = repo_root / ".agents" / "skills" / "get-model-name" / "scripts" / "get_model_name.py"
    if script_path.exists():
        res = subprocess.run([sys.executable, str(script_path)], capture_output=True, text=True, check=False)
        detected = res.stdout.strip()
        if detected and detected != "unknown":
            return detected
    return None


def count_records(file_path: Path) -> int | None:
    """统计周记文件中的源记录时间戳行数；文件不存在时返回 None。"""
    if not file_path.exists():
        return None
    return len(TIMESTAMP_RE.findall(file_path.read_text(encoding="utf-8")))


def create_weekly_file(file_path: Path, sunday_str: str, saturday_str: str, model_name: str, dry_run: bool, force: bool) -> None:
    """创建周记 Markdown 容器。"""
    if file_path.exists() and not force:
        print(f"[跳过] 周记文件已存在：{file_path}")
        return

    content = f"""# {sunday_str} — {saturday_str}

> 周归档：{sunday_str} 至 {saturday_str}（周日—周六），当前记录中。

<!-- 周容器创建模型：{model_name} -->

## 本周记录

"""
    if dry_run:
        print(f"[演练] 将创建文件：{file_path}\n{content.strip()}")
        return
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content, encoding="utf-8")
    print(f"[新建] 已创建周记容器：{file_path}")


def update_random_writing_index(index_path: Path, year: int, sunday_str: str, saturday_str: str, backfill: bool, dry_run: bool) -> None:
    """更新随笔索引：归档“记录中”条目并回填其记录数，按需回填历史 0 值，最后追加新周。"""
    if not index_path.exists():
        print(f"[警告] 未找到随笔索引文件：{index_path}")
        return

    text = index_path.read_text(encoding="utf-8")
    week_range = f"{sunday_str}--{saturday_str}"
    is_new_week = f"[{week_range}]" not in text

    def rewrite_row(m: re.Match) -> str:
        """对单行索引执行归档与计数回填。"""
        status, count = m["status"], int(m["count"])
        if m["range"] == week_range:
            return m[0]  # 当周条目保持原样
        archiving = status == "记录中" and is_new_week
        if not (archiving or (backfill and count == 0)):
            return m[0]
        real = count_records(index_path.parent / m["path"])
        new_count = real if real is not None else count
        new_status = "已归档" if archiving else status
        if (new_count, new_status) != (count, status):
            print(f"[索引] {m['range']}：记录数 {count} → {new_count}，状态 {status} → {new_status}")
        return f"| [{m['range']}]({m['path']}) | {new_count} | {new_status} |"

    new_text = ROW_RE.sub(rewrite_row, text)
    if is_new_week:
        new_text = new_text.rstrip("\n") + f"\n| [{week_range}](weekly/{year}/{week_range}.md) | 0 | 记录中 |\n"
    else:
        print(f"[信息] 随笔索引中已存在当周条目：{week_range}")

    if new_text == text:
        return
    if dry_run:
        print(f"[演练] 将写入随笔索引：{index_path}")
    else:
        index_path.write_text(new_text, encoding="utf-8")
        print(f"[更新] 已同步随笔索引：{index_path}")


def main() -> int:
    parser = argparse.ArgumentParser(description="添加虚拟朋友圈周记容器并同步随笔索引")
    parser.add_argument("--date", help="目标自然日期（YYYY-MM-DD），默认今日")
    parser.add_argument("--model", help="周记容器创建模型名称；无法自动检测时必须提供")
    parser.add_argument("--root", help="仓库根目录路径（默认自动查找）")
    parser.add_argument("--dry-run", action="store_true", help="演练模式，仅打印变更计划")
    parser.add_argument("--force", action="store_true", help="强制覆盖已存在的周记容器")
    parser.add_argument("--backfill-counts", action="store_true", help="回填索引中记录数为 0 的历史周")
    args = parser.parse_args()

    repo_root = Path(args.root).resolve() if args.root else find_repo_root()
    try:
        target_date = datetime.date.fromisoformat(args.date) if args.date else datetime.date.today()
    except ValueError:
        print(f"错误：日期格式须为 YYYY-MM-DD，收到：{args.date}", file=sys.stderr)
        return 1

    model_name = resolve_model_name(repo_root, args.model)
    if not model_name:
        print("错误：无法确认执行模型名称，请通过 --model 显式提供。", file=sys.stderr)
        return 2

    sunday, saturday = get_week_bounds(target_date)
    sunday_str, saturday_str = sunday.isoformat(), saturday.isoformat()
    print(f"目标自然周：{sunday_str} 至 {saturday_str}（周日—周六）；执行模型：{model_name}")

    base = repo_root / "self-cultivation" / "虚拟朋友圈" / "random-writing"
    target_file = base / "weekly" / str(sunday.year) / f"{sunday_str}--{saturday_str}.md"

    create_weekly_file(target_file, sunday_str, saturday_str, model_name, args.dry_run, args.force)
    update_random_writing_index(base / "random_writing.md", sunday.year, sunday_str, saturday_str, args.backfill_counts, args.dry_run)
    print("周记自动化处理完成。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
