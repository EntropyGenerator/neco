# Agent 配色规则速查

面向自动化 Agent 的硬性规则。改动任何颜色前通读；完整变量表见 `../theming.md`。

## 硬性规则

1. 普通界面（卡片、表格、对话框、管理后台、表单）只用方案变量：`--bg*`、`--text*`、`--border*`、`--shadow*`、`--scrollbar*`、`--focus-ring`、`--accent*`、`--bevel*`。
2. MC 固定元素内部禁用方案变量。清单：`MinecraftButton.vue`（含 `.dark`、hover、focus、active 态）、`MinecraftButtonClassic.vue`、`MinecraftButton3D.vue`、`MinecraftInput.vue`、`MinecraftTextarea.vue`、`views/Activity/ActivityView.vue`、`views/Activity/ActivityItem.vue`。这些文件的颜色用字面值或 `--mc*`。
3. 深色遮罩容器（导航栏 `NavBar.vue`）两方案下都保持深色底：容器内文字用浅色固定值，或在浅色方案块里显式覆盖为浅色。把文字改成方案变量（浅色方案下会变深）属于已知错误模式。服务器列表页是方案自适应页面（见第 8 条），不按固定深色处理。
4. 状态色 `--success`/`--danger`/`--warning` 及其 `-bg` 跟随方案；用在固定深色容器内时核对可读性。
5. 主题色一律走 `--accent*`，不写绿色字面值。新增主题色预设时同步两处：`style.css` 末尾的 `[data-accent='<id>']` 深/浅两个块 + `components/ThemePalette.vue` 的 `ACCENTS` 数组（id 一致）。
6. `style.css` 无注释，是纯变量定义；变量语义以 `docs/theming.md` 为准。不要在 `style.css` 里加回注释。
7. 新增配色方案必须完整覆盖全部 scheme 变量（见 theming.md 清单），缺变量会回退深色值。
8. 组件级浅色覆盖已存在三处，改动时保持一致：`style.css` 的 `[data-theme='light'] .nmo-hero-panel`、`NavBar.vue` 的 `[data-theme='light'] .nav-bar`、`ListView.vue` 的 `[data-theme='light'] .list-area` 与 `.list-item-container`（列表页浅色方案）。

## 历史错误模式（不要复现）

- 把 MC 组件的 `#ddd`/`#fff` 等固定文字改成 `var(--text)`：浅色方案下变深色文字，落在固定深色底上不可读。
- 把输入框底色改成 `var(--bg-input)`：浅色方案变白底，破坏 MC 游戏 UI 观感。
- 把 3D 按钮的内嵌高光改成 `color-mix(var(--mc-btn-face), ...)` 或方案阴影变量：浅色方案下 3D 质感消失，且与原始配色有出入。
- 把活动条目（`ActivityItem.vue`）的背景改成 `--success-bg`/`--danger-bg`、文字改成 `--text*`：条目背景固定深绿/深红，文字必须固定浅色，浅色方案下会变成浅底深字的半套组合。
- 把活动页（`ActivityView.vue`）的背景色、标题、分页文字/边框改成方案变量：页面背景是固定深色材质图，浅色方案下深色背景上的文字会不可读。
- 服务器列表页浅色方案依赖 `ListView.vue` 中的 `[data-theme='light']` 覆盖（页面提亮 + 浅色容器）；把列表页当固定深色处理或删除覆盖，浅色方案下会深容器配深字。
- 把列表页容器/条目用方案变量时只改一半：容器仍是深色（`--bg-overlay-strong` 浅色下仍为深色）而文字变深，或面板变浅而页面保持深色。列表页的容器底色与页面背景必须整体换到浅色。
- 把导航栏文字继承方案文字色：导航栏保持深色，文字必须浅色。

## 变更检查清单

改动配色后逐项执行：

- [ ] 深色（默认）与浅色（`setAttribute('data-theme','light')`）两种方案都检查目标页面。
- [ ] MC 固定组件在两种方案下 `getComputedStyle` 取值完全一致。
- [ ] 固定深色容器（导航栏、活动页、对话框遮罩层）内文字为浅色，对比度可读。
- [ ] 服务器列表页两套方案均验证：深色为 MC 深色界面，浅色依赖 `ListView.vue` 覆盖。
- [ ] 焦点环在所在底色上可见。
- [ ] 没有向 `style.css` 添加注释。
- [ ] 新增方案时同步更新 `docs/theming.md` 对照表。
- [ ] 运行 `npm run type-check`；修改的 `.vue` 文件跑 ESLint。
