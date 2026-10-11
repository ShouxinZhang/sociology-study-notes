#!/usr/bin/env python3
"""虚拟朋友圈周记容器自动化创建与索引同步脚本。

功能：
1. 自动计算目标日期所在自然周（周日—周六）的起止时间。
2. 在 weekly/<YYYY>/ 目录下创建规范化的周记 Markdown 容器。
3. 联动更新 random_writing.md 索引，将前一周标记为已归档并追加新一周。
4. 同步更新仓库架构文档中的周归档延伸范围记录。
"""

from __future__ import annotations

import argparse
import datetime
import os
import re
import subprocess
import sys
from pathlib import Path


def find_repo_root() -> Path:
    """定位仓库根目录。"""
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / ".git").exists() or (parent / "docs" / "architecture").exists():
            return parent
    return Path.cwd()


def get_week_bounds(target_date: datetime.date) -> tuple[datetime.date, datetime.date]:
    """计算指定日期所在周的周日（起始）与周六（结束）。"""
    # Python 中 weekday(): 0 为周一，6 为周日
    days_since_sunday = (target_date.weekday() + 1) % 7
    sunday = target_date - datetime.timedelta(days=days_since_sunday)
    saturday = sunday + datetime.timedelta(days=6)
    return sunday, saturday


def resolve_model_name(repo_root: Path, override_model: str | None = None) -> str:
    """解析当前执行模型名称。"""
    if override_model and override_model.strip():
        return override_model.strip()

    env_model = os.environ.get("AI_MODEL_NAME")
    if env_model and env_model.strip():
        return env_model.strip()

    script_path = repo_root / ".agents" / "skills" / "get-model-name" / "scripts" / "get_model_name.py"
    if script_path.exists():
        try:
            res = subprocess.run(
                [sys.executable, str(script_path)],
                capture_output=True,
                text=True,
                check=False,
            )
            detected = res.stdout.strip()
            if detected and detected != "unknown":
                return detected
        except Exception:
            pass

    return "AI Assistant"


def create_weekly_file(
    file_path: Path,
    sunday_str: str,
    saturday_str: str,
    model_name: str,
    dry_run: bool,
    force: bool,
) -> bool:
    """创建周记 Markdown 文件。"""
    if file_path.exists() and not force:
        print(f"[跳过] 周记文件已存在: {file_path}")
        return False

    content = f"""# {sunday_str} — {saturday_str}

> 周归档：{sunday_str} 至 {saturday_str}（周日—周六），当前记录中。

<!-- 周容器创建模型：{model_name} -->

## 本周记录

"""
    if dry_run:
        print(f"[Dry Run] 将创建文件: {file_path}")
        print(f"[Dry Run] 包含内容:\n{content.strip()}")
    else:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        print(f"[新建] 已成功创建周记容器: {file_path}")
    return True


def update_random_writing_index(
    index_path: Path,
    year: int,
    sunday_str: str,
    saturday_str: str,
    dry_run: bool,
) -> bool:
    """更新 random_writing.md 索引文件。"""
    if not index_path.exists():
        print(f"[警告] 未找到随笔索引文件: {index_path}")
        return False

    text = index_path.read_text(encoding="utf-8")
    week_range_str = f"{sunday_str}--{saturday_str}"

    # 如果当周已经在索引中，检查是否需要修正
    if f"[{week_range_str}]" in text:
        print(f"[信息] 随笔索引中已存在当周条目: {week_range_str}")
        return False

    # 将之前的“记录中”条目更新为“已归档”
    new_text = re.sub(
        r"(\|\s*\[\d{4}-\d{2}-\d{2}--\d{4}-\d{2}-\d{2}\][^|]+\|\s*\d+\s*\|\s*)记录中(\s*\|)",
        r"\g<1>已归档\g<2>",
        text,
    )

    # 追加新的一行
    new_row = f"| [{week_range_str}](weekly/{year}/{week_range_str}.md) | 0 | 记录中 |\n"
    if not new_text.endswith("\n"):
        new_text += "\n"
    new_text += new_row

    if dry_run:
        print(f"[Dry Run] 将更新随笔索引 {index_path}，追加条目: {week_range_str}")
    else:
        index_path.write_text(new_text, encoding="utf-8")
        print(f"[更新] 已同步随笔索引: {index_path}")
    return True


def update_architecture_docs(
    repo_root: Path,
    sunday_str: str,
    saturday_str: str,
    dry_run: bool,
) -> None:
    """更新仓库架构文档中的周归档延伸信息。"""
    leaf_path = repo_root / "docs" / "architecture" / "repository-structure" / "modules" / "self-cultivation" / "virtual-social-circle.md"
    parent_path = repo_root / "docs" / "architecture" / "repository-structure" / "modules" / "self-cultivation" / "README.md"

    # 更新叶子记录
    if leaf_path.exists():
        leaf_text = leaf_path.read_text(encoding="utf-8")
        updated_leaf = re.sub(
            r"(已延伸至\s*)\d{4}-\d{2}-\d{2}[—\-]+\d{4}-\d{2}-\d{2}",
            rf"\g<1>{sunday_str}—{saturday_str}",
            leaf_text,
        )
        if updated_leaf != leaf_text:
            if dry_run:
                print(f"[Dry Run] 将更新架构叶子记录 {leaf_path} 延伸周期至: {sunday_str}—{saturday_str}")
            else:
                leaf_path.write_text(updated_leaf, encoding="utf-8")
                print(f"[更新] 已同步架构叶子记录: {leaf_path}")

    # 更新直接父级 README
    if parent_path.exists():
        parent_text = parent_path.read_text(encoding="utf-8")
        updated_parent = re.sub(
            r"(周归档已延伸至\s*)\d{4}-\d{2}-\d{2}",
            rf"\g<1>{saturday_str}",
            parent_text,
        )
        if updated_parent != parent_text:
            if dry_run:
                print(f"[Dry Run] 将更新父级索引 {parent_path} 延伸日期至: {saturday_str}")
            else:
                parent_path.write_text(updated_parent, encoding="utf-8")
                print(f"[更新] 已同步父级架构索引: {parent_path}")


def main() -> int:
    parser = argparse.ArgumentParser(description="自动添加虚拟朋友圈周记容器并同步索引与架构文档")
    parser.add_argument("--date", help="指定目标自然日期（YYYY-MM-DD），默认使用今日")
    parser.add_argument("--model", help="周记容器创建模型名称（默认自动检测或使用备用值）")
    parser.add_argument("--root", help="仓库根目录路径（默认自动查找）")
    parser.add_argument("--dry-run", action="store_true", help="演练模式，仅打印变更计划而不写入磁盘")
    parser.add_argument("--force", action="store_true", help="强制覆盖已存在的周记容器")

    args = parser.parse_args()

    repo_root = Path(args.root).resolve() if args.root else find_repo_root()

    if args.date:
        try:
            target_date = datetime.date.fromisoformat(args.date)
        except ValueError:
            print(f"错误: 日期格式错误，必须为 YYYY-MM-DD，收到: {args.date}", file=sys.stderr)
            return 1
    else:
        target_date = datetime.date.today()

    sunday, saturday = get_week_bounds(target_date)
    sunday_str = sunday.isoformat()
    saturday_str = saturday.isoformat()
    year = sunday.year

    model_name = resolve_model_name(repo_root, args.model)

    print(f"目标自然周: {sunday_str} 至 {saturday_str} (周日—周六)")
    print(f"执行模型名: {model_name}")

    weekly_dir = repo_root / "self-cultivation" / "虚拟朋友圈" / "random-writing" / "weekly" / str(year)
    target_file = weekly_dir / f"{sunday_str}--{saturday_str}.md"
    index_file = repo_root / "self-cultivation" / "虚拟朋友圈" / "random-writing" / "random_writing.md"

    create_weekly_file(target_file, sunday_str, saturday_str, model_name, args.dry_run, args.force)
    update_random_writing_index(index_file, year, sunday_str, saturday_str, args.dry_run)
    update_architecture_docs(repo_root, sunday_str, saturday_str, args.dry_run)

    print("周记自动化处理完成。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
