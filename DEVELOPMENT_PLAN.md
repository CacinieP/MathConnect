# MathConnect 开发计划与 Checkpoints

> 基于 `DESIGN_PROPOSAL.md v2.0` 制定，目标是在可控节奏内完成升级开发。

---

## 总体节奏

| 阶段 | 主题 | 预估工时 | 验收方式 |
| --- | --- | --- | --- |
| 阶段 1 | 视觉快速升级 MVP | 1-2 天 | 本地 `npm run dev` 可看到新主题、动画、胜利画面 |
| 阶段 2 | 数学深度：关卡系统 | 2-3 天 | 可选关卡、新增 3 个数学关卡、可解性保证 |
| 阶段 3 | 可玩性打磨 | 1-2 天 | 计时、计分、成就、设置面板、双语 |

> 注：本计划按「单开发会话可推进」拆分，每个 checkpoint 都能独立验证。

---

## Checkpoint 清单

### 阶段 1：视觉快速升级 MVP

| # | Checkpoint | 关键文件 | 验证命令/方式 |
| --- | --- | --- | --- |
| 1.1 | 重构 CSS 变量为星云暗色主题 | `src/index.css` | 页面整体变为深蓝/霓虹风格 |
| 1.2 | 新增星云粒子背景组件 | `src/components/BackgroundCanvas.jsx` | 背景有缓慢漂移粒子 |
| 1.3 | Tile 玻璃拟态 + 族色边框/能量条 | `src/components/Tile.jsx`, `src/index.css` | 同族 Tile 颜色一致 |
| 1.4 | 选中/错误/匹配动效 | `src/index.css` | hover、selected、error、matched 状态明显 |
| 1.5 | 连线发光 + 路径粒子动画 | `src/components/GameBoard.jsx` | 路径有发光渐变与流动光点 |
| 1.6 | 胜利画面组件 | `src/components/VictoryModal.jsx` | 清盘后弹出 overlay |
| 1.7 | 规则面板（可折叠） | `src/components/RulePanel.jsx` | 展开显示规则与颜色对照 |

### 阶段 2：数学深度

| # | Checkpoint | 关键文件 | 验证命令/方式 |
| --- | --- | --- | --- |
| 2.1 | 重构 `EQUIVALENCE_CLASSES` → `LEVELS` | `src/data/levels.js` | 现有等价无穷小关卡正常运行 |
| 2.2 | 新增导数本质关卡 | `src/data/levels.js` | 导数关卡可玩 |
| 2.3 | 新增三角恒等式关卡 | `src/data/levels.js` | 三角关卡可玩 |
| 2.4 | 新增泰勒展开关卡 | `src/data/levels.js` | 泰勒关卡可玩 |
| 2.5 | 配对后数学解释 | `src/components/GameBoard.jsx` | 成功匹配显示一句话解释 |
| 2.6 | Math Notes 面板 | `src/components/MathNotesPanel.jsx` | 可查看本关所有族解释 |
| 2.7 | 关卡选择器 + 解锁逻辑 | `src/components/LevelSelect.jsx` | 完成一关解锁下一关 |
| 2.8 | 棋盘可解性预检 | `src/utils/solvable.js` | 每局生成后保证至少一步可解 |

### 阶段 3：可玩性打磨

| # | Checkpoint | 关键文件 | 验证命令/方式 |
| --- | --- | --- | --- |
| 3.1 | 计时器、步数、连击 | `src/hooks/useGameTimer.js`, `src/components/GameBoard.jsx` | HUD 实时更新 |
| 3.2 | 计分公式 | `src/utils/scoring.js` | 胜利画面显示 Score |
| 3.3 | 引导/经典/挑战三种模式 | `src/components/GameBoard.jsx` | 开始游戏前可选模式 |
| 3.4 | 成就系统 + localStorage | `src/utils/storage.js` | 成就解锁后持久化 |
| 3.5 | 设置面板（音效、粒子、语言） | `src/components/SettingsPanel.jsx` | 设置项生效 |
| 3.6 | 中英双语 | `src/utils/i18n.js` | 切换语言所有文案更新 |
| 3.7 | 测试与 lint 通过 | `testGame.js`, `npm run lint` | `npm run lint` 无报错，`testGame.js` 通过 |

---

## 开发约定

1. **不引入新依赖**：继续用 React + Vite + CSS，音效用 Web Audio API。
2. **CSS 变量优先**：颜色、尺寸、动画时长统一用变量，避免硬编码。
3. **无障碍保留**：所有新增交互支持键盘，动画响应 `prefers-reduced-motion`。
4. **提交粒度**：每个 checkpoint 完成后一次 commit，message 格式 `feat(scope): description`。
5. **测试**：每阶段结束前运行 `npm run lint` 和 `node testGame.js`。

---

## 风险与应对

| 风险 | 应对 |
| --- | --- |
| 长公式溢出 | 限制每族表达式数量，动态字号，移动端用短表达式 |
| 粒子背景掉帧 | 移动端自动减半粒子、关闭连线 |
| 无解棋盘 | 生成后调用 `hasAnyValidMove`，失败则重排 |
| 改动范围大导致回归 | 每完成一个 checkpoint 就运行现有测试 |

---

## 完成情况

| 阶段 | 状态 | 提交 |
| --- | --- | --- |
| 阶段 1：视觉快速升级 MVP | ✅ 已完成 | `6cdda23` |
| 阶段 2：数学深度 | ✅ 已完成 | `6cdda23` |
| 阶段 3：可玩性打磨 | ✅ 已完成 | `6cdda23` |

已验证：

- `npm run lint` 通过
- `node testGame.js` 15/15 通过
- `npm run build` 成功

*计划位置：`MathConnect/DEVELOPMENT_PLAN.md`*
