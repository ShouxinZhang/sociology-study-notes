"""瞄准精灵生成器：把每把远程武器“朝前开枪”的动作帧旋转到 5 个方向，输出 assets/sprites/aim.json。

为什么需要它：朝前开枪有每把武器专属的两帧后坐动画，其他方向原本只有一张通用静止图。
本脚本从 attacks.json / contra.json 读取 attack_<武器> 帧，抽出“前臂 + 枪”图层，
绕肩膀（aim.json 的 pivot）旋转后与无腿上半身合成；腿部另出 legs_* 图层，运行时叠加，
从而边走边瞄时腿部照常摆动。新增远程武器后重新运行即可：

    python3 tools/gen_aim_sprites.py

输出精灵（画布 32×32，脚底以下多留 below 行，供向下瞄准时枪管伸出脚底）：
- <attackSprite>_<dir>：上半身 + 旋转后的枪，帧数与 fps 同原攻击动作，最后一帧为待机瞄准姿势
- <fx>_<dir>：枪口火光绕自身中心旋转（fwd 方向沿用原 fx）
- legs_idle / legs_walk / legs_jump：只含腿部
"""
import json
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
AIM = json.loads((ASSETS / "data/aim.json").read_text(encoding="utf-8"))
OUT = ASSETS / "sprites/aim.json"

BODY_ORIGIN = (8, 8)  # 攻击动作画布中 16×16 身体的左上角（与 gen_attacks 约定一致）
LEG_ROW = 13  # 身体第 13 行起为腿部（walk / jump 动画只在这几行不同）
GRIP = ((17, 19), (15, 18))  # 枪托 / 握手区域（x 范围, y 范围）：与身体重叠也随枪旋转，避免枪身出现缺口
FRONT_X = 17  # 该列以右的武器像素随枪旋转；以左（枪托、发射筒尾部）在非朝前方向被身体挡住，丢弃

# 无手臂的玩家身体（与 gen_attacks.py 相同），后臂单独绘制
BODY = [
    "................", ".....######.....", "....########....", "....#oooooo#....",
    "....#oooo#o#....", "....#oooooo#....", "....#ooo##o#....", ".....######.....",
    "....########....", "....########....", "....########....", ".....######.....",
    ".....######.....", ".....##..##.....", ".....##..##.....", "....###..###....",
]
BACK_ARM = [(11, y) for y in (16, 17, 18)]


def blank(w, h):
    return [["."] * w for _ in range(h)]


def base_pose():
    """32×24 攻击画布中的无武器姿势：身体 + 后臂；用于和攻击帧做差分"""
    g = blank(32, 24)
    ox, oy = BODY_ORIGIN
    for y, row in enumerate(BODY):
        for x, ch in enumerate(row):
            if ch != ".":
                g[oy + y][ox + x] = ch
    for x, y in BACK_ARM:
        g[y][x] = "#"
    return g


BASE = base_pose()


def weapon_layer(frame):
    """攻击帧 → {(x, y): 字符}，只含武器与前臂（与无武器姿势不同的像素 + 握手区域）"""
    layer = {}
    (gx0, gx1), (gy0, gy1) = GRIP
    for y, row in enumerate(frame):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            if ch != BASE[y][x] or (gx0 <= x <= gx1 and gy0 <= y <= gy1):
                layer[(x, y)] = ch
    return layer


def rotate_layer(layer, angle_deg, offset, w, h):
    """绕 pivot 旋转图层：对目标画布逐像素反向映射取最近邻，保证结果无空洞"""
    px, py = AIM["pivot"]
    a = math.radians(-angle_deg)
    ca, sa = math.cos(a), math.sin(a)
    out = {}
    for ty in range(h):
        for tx in range(w):
            dx, dy = tx - px - offset[0], ty - py - offset[1]
            sx, sy = round(px + dx * ca - dy * sa), round(py + dx * sa + dy * ca)
            if (sx, sy) in layer:
                out[(tx, ty)] = layer[(sx, sy)]
    return out


def compose(frame, attack_name, dir_name):
    """一帧瞄准精灵：无腿上半身 + （可选）身后静态部件 + 旋转后的武器"""
    cw, ch_ = AIM["canvas"]["w"], AIM["canvas"]["h"]
    spec = AIM["dirs"][dir_name]
    g = blank(cw, ch_)
    ox, oy = BODY_ORIGIN
    for y, row in enumerate(BODY[:LEG_ROW]):
        for x, c in enumerate(row):
            if c != ".":
                g[oy + y][ox + x] = c
    for x, y in BACK_ARM:
        g[y][x] = "#"

    layer = weapon_layer(frame)
    front = {p: c for p, c in layer.items() if p[0] >= FRONT_X}
    if dir_name == "fwd":
        front = layer  # 朝前：原样保留全部武器像素
    elif attack_name in AIM["keepBehind"]:
        for (x, y), c in layer.items():  # 背包等身后部件不随枪旋转
            if x < FRONT_X:
                g[y][x] = c
    # 枪被平移（如朝上时移出脸部）后，用 2 像素粗的手臂把肩膀与握把连起来
    (px, py), (ox, oy) = AIM["pivot"], spec["offset"]
    for i in range(max(abs(ox), abs(oy)) + 1):
        x, y = px + round(ox * i / max(abs(ox), abs(oy), 1)), py + round(oy * i / max(abs(ox), abs(oy), 1))
        for yy in (y, y + 1):
            g[yy][x] = "#"
    for (x, y), c in rotate_layer(front, spec["angle"], spec["offset"], cw, ch_).items():
        g[y][x] = c
    return ["".join(r) for r in g]


def rotate_fx(frames, angle_deg):
    """枪口火光绕自身中心旋转到方形画布，中心仍是枪口"""
    h, w = len(frames[0]), len(frames[0][0])
    n = max(w, h)
    cx, cy, tc = (w - 1) / 2, (h - 1) / 2, (n - 1) / 2
    a = math.radians(-angle_deg)
    ca, sa = math.cos(a), math.sin(a)
    out = []
    for f in frames:
        g = blank(n, n)
        for ty in range(n):
            for tx in range(n):
                dx, dy = tx - tc, ty - tc
                sx, sy = round(cx + dx * ca - dy * sa), round(cy + dx * sa + dy * ca)
                if 0 <= sx < w and 0 <= sy < h and f[sy][sx] != ".":
                    g[ty][tx] = f[sy][sx]
        out.append(["".join(r) for r in g])
    return out


def legs(frame16):
    """16×16 玩家帧 → 只含腿部的 32×32 画布（与瞄准精灵同尺寸、同锚点）"""
    g = blank(AIM["canvas"]["w"], AIM["canvas"]["h"])
    ox, oy = BODY_ORIGIN
    for y in range(LEG_ROW, 16):
        for x, c in enumerate(frame16[y]):
            if c != ".":
                g[oy + y][ox + x] = c
    return ["".join(r) for r in g]


def main():
    defs = {}
    for name in ("player.json", "attacks.json", "contra.json"):
        defs.update(json.loads((ASSETS / "sprites" / name).read_text(encoding="utf-8")))
    weapons = [w for w in json.loads((ASSETS / "data/weapons.json").read_text(encoding="utf-8")) if w["type"] == "ranged"]
    below = AIM["canvas"]["below"]

    out = {}
    for w in weapons:
        atk = defs[w["attackSprite"]]
        for d, spec in AIM["dirs"].items():
            frames = [compose(f, w["attackSprite"], d) for f in atk["frames"]]
            out[f"{w['attackSprite']}_{d}"] = {"fps": atk["fps"], "below": below, "frames": frames}
            if d != "fwd":
                fx = defs[w["fx"]]
                out[f"{w['fx']}_{d}"] = {"fps": fx.get("fps", 0), "frames": rotate_fx(fx["frames"], spec["angle"])}
    out["legs_idle"] = {"below": below, "frames": [legs(defs["player_idle"]["frames"][0])]}
    out["legs_walk"] = {"fps": defs["player_walk"]["fps"], "below": below, "frames": [legs(f) for f in defs["player_walk"]["frames"]]}
    out["legs_jump"] = {"below": below, "frames": [legs(defs["player_jump"]["frames"][0])]}

    OUT.write_text(json.dumps(out, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(out)} sprites -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
