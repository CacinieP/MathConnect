# MathConnect 升级策划案（最终稿）

> **版本**：v2.0  
> **目标**：在保留「连连看 + 数学公式」核心玩法的前提下，从 **视觉表现** 与 **关卡/数学深度** 两个方向升级，让玩家既觉得酷，又能在游玩中真正理解数学之间的联系。  
> **约束**：保持 React + Vite + JavaScript + CSS 技术栈；不引入大型游戏引擎；优先保证移动端性能、无障碍支持与可维护性。

---

## 0. 一句话总结

**把 MathConnect 从「记忆型连连看」升级成「公式星云探索器」**：用暗色霓虹视觉包裹数学关系，用多关卡、解释面板、族谱图和挑战模式让玩家在消除中理解微积分。

---

## 目录

1. [设计原则](#1-设计原则)
2. [思路 1：让视觉更酷炫](#2-思路-1让视觉更酷炫)
3. [思路 2：让关卡更有趣、更数学](#3-思路-2让关卡更有趣更数学)
4. [两思路的融合点](#4-两思路的融合点)
5. [推荐实施优先级与验收标准](#5-推荐实施优先级与验收标准)
6. [数据结构与关键算法](#6-数据结构与关键算法)
7. [风险与注意事项](#7-风险与注意事项)
8. [附录](#8-附录)

---

## 1. 设计原则

1. **核心玩法不变**：点击两个 Tile，若属于同一数学关系族且存在不超过两次转弯的路径，则消除。
2. **视觉为数学服务**：所有颜色、动效、反馈都应帮助玩家识别「哪些公式属于同一族」，拒绝纯炫技。
3. **渐进式披露**：新手先看到颜色提示；熟练后关闭提示进入挑战；数学解释在关键时刻出现，不干扰节奏。
4. **性能优先**：动画以 CSS 为主，复杂效果按设备能力降级；移动端减少粒子与路径动画。
5. **无障碍**：保留键盘操作、ARIA 标签、`prefers-reduced-motion` 支持；颜色不是唯一信息通道。

---

## 2. 思路 1：让视觉更酷炫

### 2.1 当前问题

- 配色偏棕/橙，科技感与「能量感」不足。
- 消除动画只有 500ms 路径线 + 直接变空，反馈弱。
- Tile 没有族类视觉区分，玩家主要靠记忆公式外形判断。
- 缺少主题包装，数学感有余、游戏感不足。

### 2.2 方向定位：公式星云（Formula Nebula）

- 每个数学关系族 = 一颗「星体/元素」，拥有固定色相。
- 成功连线 = 两个公式通过能量束共振，坍缩成光点。
- 失败 = 粒子排斥，Tile 短暂变红抖动。
- 胜利 = 星云稳定，全屏释放一次脉冲动画。

### 2.3 设计系统

#### 2.3.1 颜色系统

升级 CSS 变量，保留现有结构但扩展为暗色霓虹主题：

```css
:root {
  --bg-color: #0b0c15;
  --surface: #12131f;
  --surface-strong: #1a1c2e;
  --text-color: #f0f4ff;
  --muted-text: #9aa3b8;
  --border: #2a2e45;
  --accent: #38bdf8;
  --accent-soft: #7dd3fc;
  --error: #fb7185;

  /* 族类色，每个族固定 */
  --family-x: #22d3ee;       /* 青 */
  --family-2x: #c084fc;      /* 紫 */
  --family-half-x2: #f472b6; /* 粉 */
  --family-x2: #fbbf24;      /* 金 */
  --family-deriv: #34d399;   /* 绿 */
  --family-taylor: #f87171;  /* 红 */
  --family-trig: #a3e635;    /* 青柠 */
  --family-inverse: #818cf8; /* 靛蓝 */
  --family-limits: #fb923c;  /* 橙 */
}
```

配色原则：

- 背景 `#0b0c15` + 棋盘 `#12131f`，保证 KaTeX 白色公式可读。
- 每个族使用 300-400 级饱和度较高的色值，hover 时通过发光增强，不替换颜色。
- 错误态统一用 `--error`，避免与族色混淆。
- 每个族色在 HSL 空间中保持相近明度，确保 HUD 进度条视觉平衡。

#### 2.3.2 背景层

- **星云粒子背景**：固定定位 `<canvas>`，绘制 40-60 个缓慢漂移的半透明圆点。
  - 粒子颜色取当前关卡主题色 + 全局强调色，透明度 0.08-0.15。
  - 粒子间距小于 120px 时绘制极细连线，形成网状星云。
  - 仅在 `prefers-reduced-motion: no-preference` 且非省电模式时启用。
  - 移动端粒子数量减半至 20-25，连线关闭。
- **网格底纹**：保留现有 32px 网格线，透明度从 0.035 降至 0.02，避免与粒子冲突。

#### 2.3.3 Tile 视觉升级

每个 Tile 由四层视觉组成：

1. **底色层**：玻璃拟态，半透明 `var(--surface-strong)` + `backdrop-filter: blur(8px)`。
2. **族色边框层**：1px solid 族色，透明度 0.35；hover 时升至 0.85。
3. **底部能量条**：3px 高渐变条，`linear-gradient(90deg, transparent, var(--family-x), transparent)`，hover 时发光。
4. **公式层**：KaTeX 渲染，字号根据内容长度动态调整（避免长公式溢出）。

状态定义：

| 状态 | 视觉 |
| --- | --- |
| idle | 玻璃卡片 + 族色细边框 + 底部能量条 |
| hover | 上移 2px、边框高亮、能量条发光、box-shadow 扩散 |
| selected | 边框变为族色不透明、卡片上浮 3px、持续脉动发光、公式放大 1.06x |
| error | 0.32s 左右抖动 + 背景闪红 + 边框变白 |
| matched | 0.4s 内爆缩小 + 亮度提升 + 粒子向上飘散，最终 opacity: 0 |

**匹配消失动画**：

- 0-200ms：两个 Tile 同时高亮，亮度提升 40%。
- 200-500ms：scale 从 1 到 0.85，同时生成 8-12 个 4px 粒子向四周散开。
- 500-700ms：scale 到 0，opacity 到 0，粒子向上飘出棋盘并淡出。
- `prefers-reduced-motion: reduce` 下直接 opacity: 0。

**公式等号提示（可选）**：

当匹配的两个 Tile 内容不同时，在消失前 200ms 于两个 Tile 中间显示浮动标签：

```
sin x ~ ln(1+x) ~ x
```

强化「不同外表、同一本质」的认知。

### 2.4 连线视觉升级

当前实现是 SVG polyline + stroke-dasharray，升级方案：

1. **发光路径**：
   - 使用 SVG `<defs>` 定义线性渐变，颜色取起点与终点 Tile 的族色（同族则使用该族色）。
   - 添加 `filter: drop-shadow(0 0 6px currentColor)`。
   - stroke-width 4px → 5px，stroke-linecap/linejoin 保持 round。

2. **路径绘制动画**：
   - 计算 polyline 总长度 `L`。
   - `stroke-dasharray: L; stroke-dashoffset: L;`。
   - 300ms 内 offset 过渡到 0，形成「能量束从起点射向终点」。

3. **流动粒子**：
   - SVG 中叠加 `<circle>`，使用 `offset-path` + `offset-distance` 从 0% 到 100%。
   - 桌面端启用，移动端关闭。

4. **拐角标记**：
   - 路径转折点绘制 3px 小圆点，颜色与路径一致，停留 100ms 后淡出。
   - 强化「最多两弯」规则感知。

### 2.5 HUD 与界面动效

#### 2.5.1 HUD 升级

当前 HUD 是 4 个数据卡片，升级后：

- **关卡名**：中英双语显示当前关卡。
- **进度条**：横向分段条，每段代表 10%，匹配成功时当前段有弹跳填充动画。
- **剩余 Tile 数**：大数字显示。
- **步数**：记录点击配对次数（成功与失败都计入）。
- **计时器**：本局已用时间 `mm:ss`。
- **连击计数**：连续成功匹配时显示 `×2`、`×3` 浮层，中断后重置。

#### 2.5.2 状态消息

- 保留底部状态消息区，族色高亮关键公式。
- 成功示例：
  - `"Connected: sin x ~ x. The cyan family shrinks."`
  - `"Connected: ln(1+x) ~ x. Same family, different look."`

#### 2.5.3 胜利画面

清空棋盘后 300ms 弹出全屏 overlay：

- 背景：半透明星云脉冲。
- 标题：`"Nebula Stabilized"` / `"公式星云已稳定"`。
- 数据：Time、Moves、Accuracy、Best Streak、Score。
- 按钮：`"Next Level"` / `"Replay"` / `"Back to Menu"`。
- 动画：中央 logo 放大 + 粒子爆发，持续 1.2s。

#### 2.5.4 规则面板

- intro-panel 增加 `"How it works"` / `"玩法说明"` 折叠按钮。
- 展开后显示：
  - 本关数学关系图解。
  - 路径规则示意图。
  - 当前关卡所有族的颜色对照表。

### 2.6 音效与震动（可选增强）

- 使用 Web Audio API 生成合成音效，不引入外部音频文件。
- 事件映射：
  - 选中：800Hz 正弦波，60ms。
  - 匹配成功：440Hz → 880Hz 三角波，随连击升高基频。
  - 错误：150Hz 方波，120ms，轻微颤音。
- 震动：`navigator.vibrate?.(40)`，仅在匹配成功时触发。
- 默认关闭音效，设置面板开启；遵守系统静音与 `prefers-reduced-motion`。

### 2.7 视觉实现建议

- 动画状态通过 CSS class 切换，React 只负责设置状态类名。
- 新增 `useReducedMotion` Hook，统一读取 `prefers-reduced-motion`。
- 粒子背景独立为 `BackgroundCanvas` 组件，`requestAnimationFrame` 驱动，unmount 时取消。
- Tile 接收 `familyColor` prop，设置为 inline `--tile-family-color`，CSS 中引用该变量。

---

## 3. 思路 2：让关卡更有趣、更数学

### 3.1 当前问题

- 只有「等价无穷小」一个关卡，可玩性有限。
- 玩家可能只凭外形配对，不理解「为什么等价」。
- 无难度曲线、无进度保存、无成就感系统。
- `generateGrid` 纯随机，可能产生无解棋盘。

### 3.2 方向定位：数学关系探索器

- 每个关卡揭示一类数学关系，配对成功后解释关系由来。
- 颜色编码与族谱图帮助玩家建立公式之间的结构感。
- 解锁、挑战、成就形成长期目标。

### 3.3 关卡体系

所有关卡共用同一套 `checkMatch`（按 `classKey` 判断）与路径规则，仅内容不同。

| 编号 | 关卡 ID | 中文名 | 英文名 | 数学主题 | 配对示例 | 教育价值 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `infinitesimals` | 等价无穷小 | Equivalent Infinitesimals | `x -> 0` 等价替换 | `x` ↔ `sin x` | 熟悉第一组重要等价 |
| 2 | `derivatives` | 导数本质 | Essence of Derivatives | 导数定义式 | `f'(x)` ↔ `lim_{h->0} (f(x+h)-f(x))/h` | 理解导数是极限 |
| 3 | `integrals` | 积分对偶 | Integral Duality | 函数与反导数 | `f(x)` ↔ `F'(x)=f(x)` | 连接微分与积分 |
| 4 | `taylor` | 泰勒展开 | Taylor Expansions | 低阶泰勒近似 | `e^x` ↔ `1 + x + x^2/2` | 理解局部多项式近似 |
| 5 | `trig` | 三角恒等 | Trig Identities | 等价三角公式 | `sin^2 x + cos^2 x` ↔ `1` | 强化恒等变形 |
| 6 | `inverse` | 反函数对 | Inverse Pairs | 指数对数互逆 | `e^{ln x}` ↔ `x` | 理解反函数 |
| 7 | `limits` | 重要极限 | Famous Limits | 函数与极限值 | `sin x / x` ↔ `1` | 记忆两个重要极限 |

**解锁机制**：

- 默认开放第 1 关。
- 第 N 关在「第 N-1 关任意模式完成一次」后解锁。
- 进度使用 `localStorage` 保存。

### 3.4 各关卡详细内容

#### 3.4.1 等价无穷小（infinitesimals）

保留并扩展当前内容：

```js
{
  x: {
    label: 'x 族',
    labelEn: 'x family',
    color: 'var(--family-x)',
    explanation: '当 x -> 0 时，这些函数与 x 的比值极限为 1。',
    explanationEn: 'These functions have limit 1 when divided by x as x -> 0.',
    expressions: [
      'x',
      '\\sin x',
      '\\tan x',
      '\\arcsin x',
      '\\arctan x',
      'e^x - 1',
      '\\ln(1+x)'
    ]
  },
  two_x: {
    label: '2x 族',
    labelEn: '2x family',
    color: 'var(--family-2x)',
    explanation: '把 x 替换为 2x，等价关系仍然成立。',
    explanationEn: 'Substituting 2x for x preserves the equivalence.',
    expressions: [
      '2x',
      '\\sin(2x)',
      '\\tan(2x)',
      'e^{2x} - 1',
      '\\ln(1+2x)'
    ]
  },
  half_x2: {
    label: 'x²/2 族',
    labelEn: 'x²/2 family',
    color: 'var(--family-half-x2)',
    explanation: '1 - cos x 是 x²/2 的等价无穷小。',
    explanationEn: '1 - cos x is equivalent to x²/2 as x -> 0.',
    expressions: [
      '\\frac{1}{2}x^2',
      '1 - \\cos x'
    ]
  },
  x2: {
    label: 'x² 族',
    labelEn: 'x² family',
    color: 'var(--family-x2)',
    explanation: '当 x -> 0 时，这些函数与 x² 等价。',
    explanationEn: 'These functions are equivalent to x² as x -> 0.',
    expressions: [
      'x^2',
      '2(1 - \\cos x)',
      '\\sin^2 x'
    ]
  }
}
```

#### 3.4.2 导数本质（derivatives）

```js
{
  derivative_sin: {
    label: 'sin x 的导数',
    labelEn: 'Derivative of sin x',
    color: 'var(--family-deriv)',
    explanation: '(sin x)\' 与极限式表示同一个概念。',
    explanationEn: 'Both notations represent the derivative of sin x.',
    expressions: [
      "(\\sin x)'",
      '\\lim_{h \\to 0} \\frac{\\sin(x+h)-\\sin x}{h}',
      '\\cos x'
    ]
  },
  derivative_cos: {
    label: 'cos x 的导数',
    labelEn: 'Derivative of cos x',
    expressions: [
      "(\\cos x)'",
      '\\lim_{h \\to 0} \\frac{\\cos(x+h)-\\cos x}{h}',
      '-\\sin x'
    ]
  },
  derivative_exp: {
    label: 'e^x 的导数',
    labelEn: 'Derivative of e^x',
    expressions: [
      "(e^x)'",
      '\\lim_{h \\to 0} \\frac{e^{x+h}-e^x}{h}',
      'e^x'
    ]
  },
  derivative_ln: {
    label: 'ln x 的导数',
    labelEn: 'Derivative of ln x',
    expressions: [
      "(\\ln x)'",
      '\\lim_{h \\to 0} \\frac{\\ln(x+h)-\\ln x}{h}',
      '\\frac{1}{x}'
    ]
  }
}
```

#### 3.4.3 积分对偶（integrals）

```js
{
  integral_x: {
    label: 'x 的积分',
    labelEn: 'Integral of x',
    color: 'var(--family-deriv)',
    explanation: 'x 的一个原函数是 x²/2。',
    explanationEn: 'An antiderivative of x is x²/2.',
    expressions: ['x', '\\frac{x^2}{2}']
  },
  integral_sin: {
    label: 'sin x 的积分',
    expressions: ['\\sin x', '-\\cos x']
  },
  integral_cos: {
    label: 'cos x 的积分',
    expressions: ['\\cos x', '\\sin x']
  },
  integral_exp: {
    label: 'e^x 的积分',
    expressions: ['e^x', 'e^x']
  },
  integral_one_over_x: {
    label: '1/x 的积分',
    expressions: ['\\frac{1}{x}', '\\ln|x|']
  }
}
```

#### 3.4.4 泰勒展开（taylor）

```js
{
  taylor_exp: {
    label: 'e^x 在 0 处展开',
    labelEn: 'Taylor series of e^x at 0',
    color: 'var(--family-taylor)',
    explanation: 'e^x ≈ 1 + x + x²/2 是在 x=0 附近的二阶近似。',
    explanationEn: 'This is the second-order Taylor approximation of e^x near 0.',
    expressions: [
      'e^x',
      '1 + x + \\frac{x^2}{2}'
    ]
  },
  taylor_sin: {
    label: 'sin x 在 0 处展开',
    expressions: [
      '\\sin x',
      'x - \\frac{x^3}{6}'
    ]
  },
  taylor_cos: {
    label: 'cos x 在 0 处展开',
    expressions: [
      '\\cos x',
      '1 - \\frac{x^2}{2}'
    ]
  },
  taylor_ln: {
    label: 'ln(1+x) 在 0 处展开',
    expressions: [
      '\\ln(1+x)',
      'x - \\frac{x^2}{2}'
    ]
  }
}
```

#### 3.4.5 三角恒等式（trig）

```js
{
  trig_pythagorean: {
    label: '毕达哥拉斯恒等式',
    labelEn: 'Pythagorean identity',
    color: 'var(--family-trig)',
    explanation: 'sin²x + cos²x 恒等于 1。',
    explanationEn: 'sin²x + cos²x is identically equal to 1.',
    expressions: [
      '\\sin^2 x + \\cos^2 x',
      '1'
    ]
  },
  trig_sin_double: {
    label: '正弦二倍角',
    expressions: ['\\sin(2x)', '2\\sin x \\cos x']
  },
  trig_cos_double: {
    label: '余弦二倍角',
    expressions: ['\\cos(2x)', '1 - 2\\sin^2 x', '2\\cos^2 x - 1']
  },
  trig_one_minus_cos: {
    label: '1 - cos²',
    expressions: ['1 - \\cos^2 x', '\\sin^2 x']
  }
}
```

#### 3.4.6 反函数对（inverse）

```js
{
  inverse_exp_ln: {
    label: '指数与对数',
    labelEn: 'Exponential and logarithm',
    color: 'var(--family-inverse)',
    explanation: '在 x > 0 时，e^{ln x} = x。',
    explanationEn: 'For x > 0, e^{ln x} equals x.',
    expressions: ['e^{\\ln x}', 'x']
  },
  inverse_ln_exp: {
    label: '对数与指数',
    expressions: ['\\ln(e^x)', 'x']
  },
  inverse_arcsin_sin: {
    label: 'arcsin 与 sin',
    expressions: ['\\arcsin(\\sin x)', 'x']
  },
  inverse_arctan_tan: {
    label: 'arctan 与 tan',
    expressions: ['\\arctan(\\tan x)', 'x']
  }
}
```

#### 3.4.7 重要极限（limits）

```js
{
  limit_sin_over_x: {
    label: 'sin x / x',
    labelEn: 'Limit of sin x / x',
    color: 'var(--family-limits)',
    explanation: '这是微积分中最重要的极限之一。',
    explanationEn: 'One of the most important limits in calculus.',
    expressions: [
      '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
      '1'
    ]
  },
  limit_one_plus_1_over_n: {
    label: '自然底数定义',
    expressions: [
      '\\lim_{n \\to \\infty} \\left(1+\\frac{1}{n}\\right)^n',
      'e'
    ]
  },
  limit_ln_one_plus_x: {
    label: 'ln(1+x) / x',
    expressions: [
      '\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x}',
      '1'
    ]
  },
  limit_e_power_minus_1: {
    label: '(e^x - 1) / x',
    expressions: [
      '\\lim_{x \\to 0} \\frac{e^x - 1}{x}',
      '1'
    ]
  }
}
```

### 3.5 配对后数学解释

每次成功消除后，HUD 消息区显示解释：

```
[族名]：[公式A] 与 [公式B] 相连，因为 [原因]。
```

示例：

- `"x 族：sin x 与 ln(1+x) 都满足 lim_{x→0} f(x)/x = 1。"`
- `"导数定义：(sin x)' 与极限式表示同一个概念。"`
- `"泰勒展开：e^x ≈ 1 + x + x²/2 是在 x=0 附近的二阶近似。"`

**Math Notes 面板**：

- intro-panel 增加「数学笔记」按钮。
- 点击后弹出侧边栏，列出本关卡所有族、颜色、解释。
- 玩家可随时复习，不干扰游戏节奏。

### 3.6 子模式设计

每个关卡三种模式：

| 模式 | 说明 | 用途 |
| --- | --- | --- |
| 引导模式 | Tile 按族显示完整颜色，hover 显示族名 | 首次学习 |
| 经典模式 | 仅边框/能量条有族色提示 | 日常练习 |
| 挑战模式 | 限时 90 秒，无颜色提示（单色 Tile），错配扣 5 秒 | 熟练后测验 |

**关于干扰项的修正**：

初版提到「干扰项 Tile」，但连连看要求所有 Tile 可消除，否则必死局。因此：

- 挑战模式不加入无配对 Tile。
- 难度通过「隐藏族色」和「限时」提升。
- 若未来要加入炸弹/道具变体，需单独设计新玩法，不在本策划范围内。

### 3.7 难度滑块

关卡选择界面提供难度：

| 难度 | 效果 |
| --- | --- |
| Easy | 3-4 族，每族 Tile 多，外形差异大 |
| Normal | 4-5 族，标准分布 |
| Hard | 6+ 族，加入外形相似但不同族的表达式（如 `sin x` vs `sin(2x)`） |

### 3.8 自适应生成策略（解决无解问题）

当前 `generateGrid` 纯随机，可能无解。升级策略：

1. 生成棋盘后运行「可解性扫描」：检查是否存在至少一对可连的同类 Tile。
2. 若无解，进行有限次数（最多 50 次）洗牌重排，每次重排后检测。
3. 若仍无解，减少族数量或重新生成。
4. 更优方案：生成阶段即保证可解性——先生成所有配对，按「可连放置」策略逐步摆放。

### 3.9 成就与进度系统

使用 `localStorage`，key 前缀 `mathconnect:`：

```js
{
  "mathconnect:unlockedLevels": ["infinitesimals", "derivatives"],
  "mathconnect:bestScores": {
    "infinitesimals": { "classic": 2840, "challenge": 1950 }
  },
  "mathconnect:bestTimes": {
    "infinitesimals": { "classic": 42, "challenge": 78 }
  },
  "mathconnect:achievements": ["first-win", "streak-5", "no-mistakes"],
  "mathconnect:settings": { "sound": false, "reducedParticles": false, "lang": "zh" }
}
```

成就列表：

| 成就 ID | 名称 | 条件 |
| --- | --- | --- |
| first-win | 首次清盘 | 完成任意关卡 |
| speedster | 速战速决 | 任意关卡 45 秒内清盘 |
| streak-5 | 五连击 | 连续 5 次成功匹配无错误 |
| no-mistakes | 无错大师 | 整局零错误 |
| explorer | 关系探索者 | 解锁全部 7 关 |
| polyglot | 双语玩家 | 切换过语言 |

### 3.10 计分公式

```
Base = 1000
TimeBonus = max(0, 300 - elapsedSeconds) * 5
MoveBonus = max(0, totalPairs * 2 - moves) * 20
StreakBonus = maxStreak * 50
AccuracyBonus = (successfulMatches / totalClicks) * 500

TotalScore = Base + TimeBonus + MoveBonus + StreakBonus + AccuracyBonus
```

---

## 4. 两思路的融合点

| 设计 | 视觉体现 | 数学体现 |
| --- | --- | --- |
| 族类颜色编码 | Tile 边框、能量条、路径颜色 | 同一颜色 = 同一数学关系族 |
| 粒子坍缩动画 | 酷炫消除反馈 | 两个公式「归一」到同一数学本质 |
| 路径能量束 | 光效从起点流向终点 | 强调两个公式之间的逻辑连接 |
| 胜利星云脉冲 | 全屏庆祝动画 | 展示本关核心公式与解释 |
| 族谱图 | 可视化成就奖励 | 展示数学结构网络 |
| 公式等号提示 | 消除前短暂显示 | 强化「不同外表、同一本质」 |

---

## 5. 推荐实施优先级与验收标准

### 阶段 1：视觉快速升级（MVP，1-2 周）

| 序号 | 任务 | 验收标准 |
| --- | --- | --- |
| 1.1 | 重构 CSS 变量为星云暗色主题 | 所有页面元素使用新变量，无硬编码旧色 |
| 1.2 | Tile 玻璃拟态 + 族色边框/能量条 | 同族 Tile 颜色一致，hover/selected/error/matched 四种状态可见 |
| 1.3 | 选中/错误/匹配动效 | 动画流畅，reduced-motion 下直接切换无动画 |
| 1.4 | 连线发光 + 路径粒子动画 | 路径有渐变描边与流动粒子，拐角有标记 |
| 1.5 | 胜利画面 | 清盘后弹出 overlay，展示 Time/Moves/Accuracy/Streak/Score |

### 阶段 2：数学深度（2-3 周）

| 序号 | 任务 | 验收标准 |
| --- | --- | --- |
| 2.1 | 重构 `EQUIVALENCE_CLASSES` 为 `LEVELS` | `checkMatch` 逻辑不变，数据可配置 |
| 2.2 | 实现关卡选择器与解锁逻辑 | 默认开第 1 关，完成后解锁下一关 |
| 2.3 | 新增 2-3 个关卡 | 至少完成「导数本质」「三角恒等式」「泰勒展开」 |
| 2.4 | 配对后解释弹窗/面板 | 每次成功匹配显示一句话解释，Math Notes 面板可查看全部 |
| 2.5 | 棋盘可解性预检 | `generateGrid` 生成的棋盘必须通过可解性检测 |

### 阶段 3：可玩性打磨（1-2 周）

| 序号 | 任务 | 验收标准 |
| --- | --- | --- |
| 3.1 | 计时器、步数、连击计数 | HUD 实时更新，连击中断后重置 |
| 3.2 | 计分公式与本地排行榜 | 每局结束计算分数并保存最佳 |
| 3.3 | 引导/经典/挑战三种模式 | 三种模式可在关卡开始界面切换 |
| 3.4 | 成就系统 | 至少实现 6 个成就并持久化 |
| 3.5 | 双语（EN/ZH）规则与解释 | 切换语言后所有文案更新 |
| 3.6 | 设置面板 | 可开关音效、粒子密度、语言 |

### 阶段 4：扩展（可选）

1. 用户自定义关卡（JSON 导入）。
2. 分享本局成绩卡片（生成 PNG 或文本）。
3. PWA 离线游玩。

---

## 6. 数据结构与关键算法

### 6.1 关卡数据结构

```js
export const LEVELS = {
  infinitesimals: {
    id: 'infinitesimals',
    title: 'Equivalent Infinitesimals',
    titleZh: '等价无穷小',
    theme: 'nebula',
    groups: {
      x: {
        id: 'x',
        label: 'x 族',
        labelEn: 'x family',
        color: 'var(--family-x)',
        explanation: '当 x -> 0 时，这些函数与 x 等价。',
        explanationEn: 'These functions are equivalent to x as x -> 0.',
        expressions: ['x', '\\sin x', '\\tan x', '\\arcsin x', '\\arctan x', 'e^x - 1', '\\ln(1+x)']
      }
      // ...
    }
  }
};
```

### 6.2 Tile 数据结构

```js
{
  id: 'tile-0-a',
  content: '\\sin x',
  classKey: 'x',
  familyColor: 'var(--family-x)',
  status: 'idle', // idle | matched
  row: 2,
  col: 3
}
```

### 6.3 可解性预检算法

```js
function hasAnyValidMove(grid) {
  const idleTiles = grid.flat().filter(t => t.status === 'idle');
  const byClass = {};
  idleTiles.forEach(t => {
    byClass[t.classKey] = byClass[t.classKey] || [];
    byClass[t.classKey].push(t);
  });

  for (const classKey of Object.keys(byClass)) {
    const tiles = byClass[classKey];
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        const path = findPath(
          grid,
          { row: tiles[i].row, col: tiles[i].col },
          { row: tiles[j].row, col: tiles[j].col }
        );
        if (path) return true;
      }
    }
  }
  return false;
}
```

### 6.4 路径动画实现

```jsx
function PathLine({ points, color }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const length = el.getTotalLength();
    el.style.strokeDasharray = length;
    el.style.strokeDashoffset = length;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 300ms ease-out';
      el.style.strokeDashoffset = 0;
    });
  }, []);
  return <polyline ref={ref} points={points} stroke={color} fill="none" />;
}
```

---

## 7. 风险与注意事项

| 风险 | 影响 | 缓解措施 |
| --- | --- | --- |
| KaTeX 长公式溢出 | 小 Tile 上显示不全 | 动态缩放字号；限制表达式长度；移动端优先短表达式 |
| 粒子背景掉帧 | 低端设备卡顿 | 移动端减半粒子、关闭连线；提供「减少动效」设置 |
| 棋盘无解 | 玩家卡死 | 阶段 2 早期实现可解性预检，保证每局可解 |
| 数学表述不严谨 | 误导玩家 | 泰勒展开标注「近似」；反函数标注定义域 |
| 颜色成为唯一信息通道 | 色盲用户无法区分 | 形状/纹理辅助；引导模式显示族名；避免仅用颜色传递关键信息 |
| 新关卡公式过长 | 影响连连看节奏 | 每族保留 2-4 个核心表达式，避免信息过载 |
| 过度设计 | 实施周期过长 | 按阶段验收，阶段 1 优先上线视觉 MVP |

---

## 8. 附录

### 8.1 当前代码基线

- 核心逻辑：`src/utils/gameLogic.js`
- 棋盘组件：`src/components/GameBoard.jsx`
- Tile 组件：`src/components/Tile.jsx`
- 样式：`src/index.css`
- 测试：`testGame.js`

### 8.2 新增文件建议

| 文件 | 用途 |
| --- | --- |
| `src/data/levels.js` | 关卡数据 |
| `src/hooks/useReducedMotion.js` | 动效偏好检测 |
| `src/hooks/useGameTimer.js` | 计时器 |
| `src/hooks/useLocalStorage.js` | 本地持久化 |
| `src/components/LevelSelect.jsx` | 关卡选择 |
| `src/components/VictoryModal.jsx` | 胜利画面 |
| `src/components/BackgroundCanvas.jsx` | 星云背景 |
| `src/components/MathNotesPanel.jsx` | 数学笔记面板 |
| `src/components/SettingsPanel.jsx` | 设置面板 |
| `src/utils/solvable.js` | 可解性检测 |
| `src/utils/scoring.js` | 计分 |
| `src/utils/i18n.js` | 中英双语 |

### 8.3 不引入的依赖

- 不使用 Three.js、Phaser、Pixi 等重型渲染库。
- 不使用 lodash（项目当前已避免）。
- 音效使用原生 Web Audio API，不引入音频文件。

### 8.4 版本记录

- v1.0：初始策划，提出视觉与关卡两个方向。
- v2.0（本稿）：补充实现细节、修正干扰项问题、增加数据结构与算法、风险表、验收标准、双语支持。
