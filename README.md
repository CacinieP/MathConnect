# MathConnect

MathConnect turns equivalent infinitesimals into a fast connect-the-pairs puzzle for calculus practice.

[Play the live game](https://caciniep.github.io/MathConnect/) | [View the source](https://github.com/CacinieP/MathConnect)

![MathConnect preview](public/social-preview.png)

## Why This Exists

Equivalent infinitesimals are usually memorized as a list. MathConnect makes that list interactive: clear the board by connecting two formulas that behave the same as `x -> 0`, while following a Lianliankan-style path rule.

The result is a small browser game that helps learners recognize patterns like:

| Family | Matching examples |
| --- | --- |
| `x` | `sin x`, `tan x`, `arcsin x`, `arctan x`, `e^x - 1`, `ln(1+x)` |
| `2x` | `sin(2x)`, `tan(2x)`, `e^{2x} - 1`, `ln(1+2x)` |
| `x^2 / 2` | `1 - cos x` |
| `x^2` | `2(1 - cos x)`, `sin^2 x` |

## How To Play

1. Pick two tiles with equivalent behavior as `x -> 0`.
2. The tiles must connect through empty space with at most two turns.
3. Clear the full board and start another round.

## Current Scope

- Level: equivalent infinitesimals for `x -> 0`
- Board: 6 by 10 on desktop, 8 by 6 on small screens
- Rendering: KaTeX-powered math tiles
- Stack: React, Vite, JavaScript, CSS
- Deployment: GitHub Pages

## Roadmap

- Add timed and relaxed modes
- Add hint and shuffle controls
- Add more calculus levels: limits, derivatives, integrals, and Taylor expansions
- Track streaks, mistakes, and completion time
- Add a bilingual rules panel for classroom use

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Run the lightweight game-logic check:

```bash
node testGame.js
```

## License

MIT

---

# MathConnect 中文说明

MathConnect 将等价无穷小变成速配连连看游戏，用于微积分练习。

[在线游玩](https://caciniep.github.io/MathConnect/) | [查看源码](https://github.com/CacinieP/MathConnect)

## 为什么做这个

等价无穷小通常靠死记硬背。MathConnect 把那张表变成可交互的：在 `x -> 0` 时行为相同的两个公式之间连线消除，路径规则遵循连连看玩法。

游戏帮助学习者快速识别以下模式：

| 家族 | 配对示例 |
| --- | --- |
| `x` | `sin x`, `tan x`, `arcsin x`, `arctan x`, `e^x - 1`, `ln(1+x)` |
| `2x` | `sin(2x)`, `tan(2x)`, `e^{2x} - 1`, `ln(1+2x)` |
| `x² / 2` | `1 - cos x` |
| `x²` | `2(1 - cos x)`, `sin² x` |

## 玩法

1. 点击两个在 `x -> 0` 时等价的方块。
2. 两个方块之间可通过空白区域相连，路径最多拐两次弯。
3. 清空全部方块即可进入下一局。

## 当前范围

- 关卡：`x -> 0` 等价无穷小
- 棋盘：桌面端 6×10，小屏 8×6
- 渲染：KaTeX 数学公式方块
- 技术栈：React, Vite, JavaScript, CSS
- 部署：GitHub Pages

## 路线图

- 增加限时模式和休闲模式
- 增加提示和洗牌功能
- 增加更多微积分关卡：极限、导数、积分、泰勒展开
- 记录连击、失误和完成时间
- 增加双语规则面板，便于课堂使用

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

运行轻量游戏逻辑测试：

```bash
node testGame.js
```

## 许可

MIT
