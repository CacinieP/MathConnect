# MathConnect

MathConnect turns mathematical relations into a fast connect-the-pairs puzzle for calculus practice.

[Play the live game](https://caciniep.github.io/MathConnect/) | [View the source](https://github.com/CacinieP/MathConnect)

![MathConnect preview](public/social-preview.png)

## Why This Exists

Calculus formulas are often memorized as isolated facts. MathConnect turns them into an interactive puzzle: clear the board by connecting two formulas that share the same mathematical relationship, following a Lianliankan-style path rule (at most two turns).

The game now covers equivalent infinitesimals, derivatives, integrals, Taylor expansions, trigonometric identities, inverse functions, and famous limits.

## How To Play

1. Pick two tiles from the same mathematical family.
2. The tiles must connect through empty space with at most two turns.
3. Clear the full board to finish the round.

## Features

- **7 calculus levels**: Equivalent infinitesimals, derivatives, integrals, Taylor expansions, trig identities, inverse pairs, and famous limits.
- **Visual theme**: Formula Nebula — dark neon glassmorphism tiles, animated particle background, glowing connection paths, and family color coding.
- **Game modes**: Guide (color hints), Classic (subtle color hints), Challenge (no color hints).
- **Progression**: Unlock levels by completing the previous one.
- **Feedback**: Match explanations, Math Notes panel, victory stats, streak counter, and achievements.
- **Bilingual UI**: English / 中文.
- **Accessibility**: Respects `prefers-reduced-motion` and supports keyboard focus.

## Current Scope

- 7 calculus levels
- 6×10 board on desktop, 8×6 on small screens
- KaTeX-powered math tiles
- React, Vite, JavaScript, CSS
- GitHub Pages deployment

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

Run lint:

```bash
npm run lint
```

## License

MIT

---

# MathConnect 中文说明

MathConnect 将数学关系变成速配连连看游戏，用于微积分练习。

[在线游玩](https://caciniep.github.io/MathConnect/) | [查看源码](https://github.com/CacinieP/MathConnect)

## 为什么做这个

微积分公式经常被孤立地死记硬背。MathConnect 把它们变成可交互的消除游戏：把属于同一数学关系的两个公式用最多拐两次弯的路径相连并消除。

游戏目前涵盖等价无穷小、导数、积分、泰勒展开、三角恒等式、反函数对和重要极限。

## 玩法

1. 点击两个属于同一数学关系族的方块。
2. 两个方块之间可通过空白区域相连，路径最多拐两次弯。
3. 清空全部方块即可进入下一局。

## 功能

- **7 个微积分关卡**：等价无穷小、导数本质、积分对偶、泰勒展开、三角恒等、反函数对、重要极限。
- **视觉主题**：公式星云——暗色霓虹玻璃拟态方块、动态粒子背景、发光连线路径、族类颜色编码。
- **游戏模式**：引导模式（颜色提示）、经典模式（ subtle 颜色提示）、挑战模式（隐藏颜色）。
- **进度系统**：完成一关解锁下一关。
- **反馈机制**：配对解释、数学笔记面板、胜利统计、连击计数、成就系统。
- **双语界面**：中文 / English。
- **无障碍**：响应 `prefers-reduced-motion`，支持键盘焦点。

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

运行代码检查：

```bash
npm run lint
```

## 许可

MIT
