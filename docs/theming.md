# 主题系统

全站颜色统一以 CSS 变量管理，集中定义在 `src/style.css`。`style.css` 有意不保留注释，本文件是变量语义与取值的唯一权威参考；修改配色时同步更新本文件的对照表。

## 变量分层

变量分为四组，改动前先判断目标属于哪一组：

1. **主题色（Accent）`--accent*`** —— 站点强调色（Minecraft 绿）。换主题色只需覆盖这一组。
2. **配色方案（Scheme）** —— `:root` 即深色方案（默认）；`[data-theme='light']` 覆盖为浅色方案。`--bg*`、`--text*`、`--border*`、`--shadow*`、`--scrollbar*`、`--focus-ring`、`--bevel*` 均属此组。
3. **Minecraft 固定调色板 `--mc*`** —— 与 MC 纹理/UI 视觉绑定的固定色，两种方案下取值相同。
4. **状态色 `--success` / `--danger` / `--warning`** —— 语义状态色，跟随配色方案但不受主题色影响。

切换方案通过操作 `<html>` 上的 `data-theme` 属性完成，见下文「切换配色方案」。

## 变量对照表

以下为深色（默认）与浅色两套取值。`—` 表示该变量在浅色方案中未覆盖，沿用深色值。

### 主题色

| 变量 | 深色 | 浅色 | 用途 |
|---|---|---|---|
| `--accent` | `#3c8527` | `#4e7a2e` | 主强调色 |
| `--accent-light` | `#6cc349` | `#5d9438` | 亮强调色（hover、链接） |
| `--accent-dark` | `#2a641c` | `#3d6426` | 暗强调色 |
| `--accent-contrast` | `#101010` | `#ffffff` | 强调色底上的文字色 |
| `--accent-soft` | `rgba(60,133,39,.34)` | `rgba(90,122,58,.15)` | 强调色半透明底（选中态） |
| `--accent-tint` | `rgba(108,195,73,.15)` | `rgba(90,122,58,.12)` | 强调色光晕（径向渐变） |
| `--accent-bright` | `#a0e081` | `#4e8a33` | 亮绿（选中勾、页码边框） |
| `--accent-pale` | `#c6f6b6` | `#46782c` | 浅绿（高亮文字、行内 code） |
| `--accent-bevel-light` | `rgba(255,255,255,.45)` | `rgba(255,255,255,.35)` | 强调色块上的高光边 |

### 背景

| 变量 | 深色 | 浅色 | 用途 |
|---|---|---|---|
| `--bg-page` | `#0f0e0d` | `#eceae2` | 页面最底层 |
| `--bg` | `#171615` | `#e3e0d6` | 全局背景 |
| `--bg-card` | `#313131` | `#f7f5ee` | 卡片底 |
| `--bg-surface` | `#2e2e2e` | `#f4f1e8` | 面板/表头底 |
| `--bg-surface-2` | `#303030` | `#efece2` | 次级面板/表体底 |
| `--bg-surface-3` | `#3c3c3c` | `#faf8f1` | 表头底 |
| `--bg-elevated` | `#4a4a4a` | `#fdfdf8` | 凸起区块（管理 section） |
| `--bg-sunken` | `#111111` | `#d9d6cb` | 凹陷区块（树形目录等） |
| `--bg-sunken-2` | `#161616` | `#d2cfc4` | 凹陷区块 2（编辑器） |
| `--bg-input` | `#616161` | `#ffffff` | 表单输入框底（管理后台） |
| `--bg-input-disabled` | `#424242` | `#dcd9cf` | 输入框禁用底 |
| `--bg-panel` | `color-mix(in srgb, white, black 75%)` | `#e8e6dd` | `mc-border` 面板底 |
| `--bg-overlay` | `rgba(0,0,0,.5)` | `rgba(0,0,0,.4)` | 半透明遮罩/底 |
| `--bg-overlay-strong` | `rgba(0,0,0,.7)` | `rgba(0,0,0,.6)` | 强遮罩 |
| `--bg-overlay-soft` | `rgba(0,0,0,.3)` | `rgba(0,0,0,.15)` | 弱遮罩 |
| `--bg-scrim` | `rgba(0,0,0,.24)` | `rgba(0,0,0,.08)` | 内嵌压暗（方块纹理上） |
| `--bg-scrim-2` | `rgba(0,0,0,.18)` | `rgba(0,0,0,.06)` | 内嵌压暗 2 |
| `--bg-hover` | `rgba(255,255,255,.1)` | `rgba(0,0,0,.08)` | 白色悬停罩 |
| `--bg-hover-strong` | `rgba(255,255,255,.2)` | `rgba(0,0,0,.12)` | 白色选中罩 |
| `--bg-hover-faint` | `rgba(255,255,255,.04)` | `rgba(0,0,0,.04)` | 极淡悬停（表格行） |
| `--bg-selection` | `rgba(100,100,255,.25)` | `rgba(90,122,58,.2)` | 列表选中（蓝调） |
| `--bg-selection-strong` | `rgba(100,100,255,.45)` | `rgba(90,122,58,.3)` | 选中（强调） |
| `--bg-drag-accent` | `rgba(152,203,132,.15)` | `rgba(90,122,58,.2)` | 拖拽落点高亮 |
| `--bg-code` | `#181818` | `#fbfbfb` | 行内 code 底 |
| `--bg-log` | `#202020` | `#e8e5db` | 日志列表底 |
| `--bg-log-item` | `#2d2d2d` | `#f2efe6` | 日志条目底 |
| `--bg-thumb` | `rgba(0,0,0,.3)` | `rgba(0,0,0,.06)` | 图片缩略图底 |
| `--bg-danger-deep` | `#400` | `#f5e1e1` | 深红底（删除按钮） |
| `--bg-danger-deep-hover` | `#600` | `#eccfcf` | 深红底 hover |

### 文字

| 变量 | 深色 | 浅色 | 用途 |
|---|---|---|---|
| `--text` | `#ffffff` | `#2b2b2b` | 主文字 |
| `--text-soft` | `rgba(255,255,255,.88)` | `rgba(43,43,43,.88)` | 较强次级文字 |
| `--text-dim` | `rgba(255,255,255,.8)` | `rgba(43,43,43,.8)` | 次级文字（全局默认文字色） |
| `--text-muted` | `rgba(255,255,255,.72)` | `rgba(43,43,43,.72)` | 弱化文字 |
| `--text-faint` | `rgba(255,255,255,.6)` | `rgba(43,43,43,.6)` | 更弱文字 |
| `--text-subtle` | `rgba(255,255,255,.5)` | `rgba(43,43,43,.5)` | 弱提示文字 |
| `--text-disabled` | `rgba(255,255,255,.45)` | `rgba(43,43,43,.45)` | 禁用/极弱文字 |
| `--text-inverse` | `#101010` | `#ffffff` | 与 `--text` 相反（用于亮/暗底） |
| `--text-placeholder` | `#808080` | `#8a857a` | 占位符文字 |
| `--text-hint` | `#ccc` | `#6b665e` | 提示文字 |
| `--text-muted-solid` | `#aba09c` | `#6b5f52` | 灰棕文字（新闻总数） |
| `--text-gray` | `#aaaaaa` | `#7a7468` | 中性灰文字（状态、箭头） |

### 边框与立体边

| 变量 | 深色 | 浅色 | 用途 |
|---|---|---|---|
| `--border` | `#222222` | `#b9b4a8` | 主边框 |
| `--border-dark` | `#111111` | `#a39e92` | 深边框 |
| `--border-dark-2` | `#1a1a1a` | `#c9c4b8` | 次深边框 |
| `--border-light` | `#555555` | `#cfcabf` | 亮边框 |
| `--border-soft` | `rgba(255,255,255,.14)` | `rgba(0,0,0,.12)` | 半透明白边框 |
| `--border-soft-2` | `rgba(255,255,255,.12)` | `rgba(0,0,0,.1)` | 半透明白边框 2 |
| `--border-strong` | `#aaaaaa` | `#8a857a` | 强边框 |
| `--border-strong-2` | `#909399` | `#909399` | 中性灰边框（页脚等） |
| `--border-divider` | `#747271` | `#a8a296` | 分隔线 |
| `--border-danger` | `#c44` | `#b04a4a` | 危险边框 |
| `--bevel-dark` | `#1f1f1f` | `#b3aea2` | 立体边暗侧 |
| `--bevel-light` | `#454545` | `#ffffff` | 立体边亮侧 |
| `--bevel-dark-strong` | `#3a3a3a` | `#a8a396` | 立体边暗侧（强） |
| `--bevel-light-strong` | `#6b6b6b` | `#f5f2ea` | 立体边亮侧（强） |

### 阴影与滚动条

| 变量 | 深色 | 浅色 | 用途 |
|---|---|---|---|
| `--shadow-strong` | `rgba(0,0,0,.7)` | `rgba(0,0,0,.4)` | 强阴影 |
| `--shadow` | `rgba(0,0,0,.5)` | `rgba(0,0,0,.3)` | 常规阴影 |
| `--shadow-soft` | `rgba(0,0,0,.35)` | `rgba(0,0,0,.18)` | 弱阴影 |
| `--shadow-card` | `rgba(0,0,0,.25)` | `rgba(0,0,0,.12)` | 卡片阴影 |
| `--scrollbar-thumb` | `#777` | `#9a958a` | 滚动条滑块 |
| `--scrollbar-track` | `#222` | `#d8d5cc` | 滚动条轨道 |
| `--scrollbar-border` | `#111` | `#c4c0b6` | 滚动条边框 |
| `--scrollbar-thumb-border` | `#aaa` | `#6f6a60` | 滑块描边 |
| `--focus-ring` | `#fff` | `#2b2b2b` | 键盘焦点环 |

### 状态色与固定装饰

| 变量 | 深色 | 浅色 | 用途 |
|---|---|---|---|
| `--success` | `#67c23a` | `#3f7d1f` | 成功 |
| `--success-bg` | `rgb(45,72,31)` | `rgb(214,233,205)` | 成功底 |
| `--danger` | `#f56c6c` | `#c45656` | 危险 |
| `--danger-bg` | `rgb(88,46,46)` | `rgb(240,213,213)` | 危险底 |
| `--danger-soft` | `rgb(247,137,137)` | `rgb(214,122,122)` | 危险弱化 |
| `--danger-deep-border` | `#c44` | `#b04a4a` | 危险深边框 |
| `--warning` | `#f0c36a` | `#b07f2a` | 警告 |
| `--warning-soft` | `#ffd7d7` | `#8a5a5a` | 警告弱化 |
| `--nav-slider` | `#7e0c6b` | — | 导航滑块（固定装饰色） |
| `--nav-slider-light` | `#9b428c` | — | 滑块亮边 |
| `--nav-slider-dark` | `#46073b` | — | 滑块暗边 |

## Minecraft 固定调色板（`--mc*`）

两种方案取值相同，定义在 `:root`。与 MC 纹理/UI 视觉绑定，改动需谨慎：

| 变量 | 值 | 用途 |
|---|---|---|
| `--mc-dark` | `#171615` | MC 深色 |
| `--mc-gray` | `#3d3938` | MC 灰 |
| `--mc-gray-dark` | `#262524` | MC 深灰 |
| `--mc-gray-light` | `#747271` | MC 浅灰 |
| `--mc-black` | `#000000` | MC 黑 |
| `--mc-btn-face` | `#c6c6c6` | MC 按钮面 |
| `--mc-btn-face-dark` | `#303030` | MC 按钮暗面 |
| `--mc-btn-hover` | `#43a01c` | MC 按钮 hover |
| `--mc-btn-pressed` | `#8b8b8b` | MC 按钮按下 |
| `--mc-btn-text` | `#000` | MC 按钮文字 |
| `--mc-btn-bevel` | `#333` | MC 按钮立体边 |
| `--mc-slot-bg` | `#555` | 格子底 |
| `--mc-slot` | `#8b8b8b` | 格子 |
| `--mc-slot-border-dark` | `#373737` | 格子暗边 |
| `--mc-slot-border-light` | `#ffffff` | 格子亮边 |
| `--mc-slot-input` | `#6b6b6b` | 格子输入框 |
| `--mc-slot-input-focus` | `#aaa` | 格子输入框聚焦 |
| `--mc-table-header` | `#3f3f3f` | 表格表头 |
| `--mc-table-header-hover` | `#5b5b5b` | 表头 hover |
| `--mc-table-cell-hover` | `#aeaeae` | 单元格 hover |
| `--mc-table-bg` | `#c6c6c6` | 表格底 |
| `--mc-table-stripe` | `rgba(224,224,224,.1)` | 表格条纹 |
| `--mc-code-bg` | `#3b3b3b` | code 底 |
| `--mc-code-bg-dark` | `#2a2a2a` | code 深底 |
| `--mc-code-border-dark` | `#555555` | code 暗边 |
| `--mc-code-border-light` | `#ffffff` | code 亮边 |
| `--mc-code-text` | `#e0e0e0` | code 文字 |
| `--mc-code-shadow` | `#1a1a1a` | code 阴影 |
| `--mc-table-header-dark` | `#292929` | 表头（暗） |
| `--mc-classic-selected-text` | `#ffffa0` | 经典按钮选中文字 |
| `--mc-quote-bg` | `#8b5e3c` | 引用块底 |
| `--mc-quote-border` | `#5d3a1a` | 引用块边框 |
| `--mc-quote-shadow` | `#3e2723` | 引用块阴影 |

## 切换配色方案

方案由 `<html>` 上的 `data-theme` 属性决定：

```ts
// 浅色
document.documentElement.setAttribute('data-theme', 'light')
// 深色（默认，移除属性即可）
document.documentElement.removeAttribute('data-theme')
```

接入 VueUse 后，`useDark` / `useColorMode` 可直接驱动该属性：

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'dark', // 默认深色，与 :root 一致
})
const toggleTheme = useToggle(isDark)
```

`valueDark: 'dark'` 会把属性写成 `data-theme="dark"`，该取值没有对应覆盖块，仍落到 `:root` 深色值，行为正确。不需要为 `dark` 写额外规则。

## 新增配色方案

1. 在 `src/style.css` 追加一个块，选择器为 `[data-theme='<方案名>']`。
2. 复制浅色方案（`[data-theme='light']`）的全部变量作为起点，按新方案调整取值。方案块必须完整覆盖所有 scheme 变量——未覆盖的变量会回退到 `:root` 深色值，导致部分组件颜色错乱。
3. 需要完整覆盖的变量清单：`--accent*`（9 个）、`--bg*`（22 个）、`--text*`（12 个）、`--border*`（10 个）、`--bevel*`（4 个）、`--shadow*`（4 个）、`--scrollbar*`（4 个）、`--focus-ring`、`--success*`、`--danger*`、`--warning*`、`color-scheme`。
4. 更新本文件的对照表，补充新方案的取值列。
5. 验证：dev server 运行中执行 `setAttribute('data-theme', '<方案名>')`，逐页检查文字对比度、固定 MC 元素、深色遮罩容器。

新增方案时同样需要检查已有组件级覆盖是否合理：`style.css` 中的 `[data-theme='light'] .nmo-hero-panel`（头图纹理）、`NavBar.vue` 中的 `[data-theme='light'] .nav-bar`（导航栏文字）、`ListView.vue` 中的 `[data-theme='light'] .list-area` / `.list-item-container`（列表页浅色方案）。若新方案的处理方式不同，需要同步添加对应覆盖。

## 更换主题色

主题色即 `--accent*` 组。两种方式：

- 静态：给 `<html>` 加 `data-accent='<主题名>'`，在 `style.css` 写 `[data-accent='<主题名>'] { --accent: ...; ... }` 块。注意 `--accent*` 在深色、浅色方案中各定义了一份；换主题色时按目标方案的取值分别覆盖，或利用块顺序让 `[data-accent]` 规则位于方案块之后、以 `:root`/`[data-theme]` 同优先级覆盖。
- 运行时：`useCssVar('--accent', document.documentElement)` 后写值，同时写入需要联动的 `--accent-*`。

任何方式都不需要改动业务组件——组件只消费变量。

## Minecraft 固定配色约定

部分组件与页面模仿 Minecraft 游戏 UI，底色绑定 MC 纹理（材质图、border-image）或固定深色，属于「固定配色」：两种方案下取值完全相同。这类元素内部**禁用方案变量**（`--text*`、`--bg*`、`--border*`、`--shadow*`、`--focus-ring`），否则浅色方案下会出现深底深字之类的不可读组合。

固定配色的组件与页面：

| 组件/页面 | 文件 | 固定原因 |
|---|---|---|
| 经典按钮 | `components/utils/MinecraftButtonClassic.vue` | 背景为 `bgbtn.jpg` 材质，文字固定 `#ddd`，选中 `#ffffa0` |
| MC 按钮 | `components/utils/MinecraftButton.vue` | 面/暗面/悬停/按下为 MC 固定色；`.dark` 变体与 hover/focus 文字固定 `#fff` |
| 3D 按钮 | `components/utils/MinecraftButton3D.vue` | 底色 `#313233` + 固定内嵌高光阴影 |
| 输入框 | `components/utils/MinecraftInput.vue` | 底 `#616161`、白字、黑 outline（MC 游戏 UI） |
| 文本域 | `components/utils/MinecraftTextarea.vue` | 同上 |
| 活动页 | `views/Activity/ActivityView.vue`、`ActivityItem.vue` | 页面背景为固定深色材质图（bg.jpg 全幅不透明）；条目背景固定深绿（进行中）/深红（已结束），标题、时间、简介、分页文字全部固定浅色 |

深色遮罩容器：导航栏（`NavBar.vue`）在浅色方案下仍保持深色底，通过 `[data-theme='light'] .nav-bar { color: var(--text-inverse) }` 保证文字可读。给这类容器加内容时沿用同样的处理：容器保持深色，文字固定浅色（或显式覆盖）。

服务器列表页（`views/List/`）是方案自适应页面：深色方案为 MC 多人服务器列表的深色界面（深色遮罩容器 + 白字）；浅色方案在 `ListView.vue` 中通过 `[data-theme='light']` 覆盖页面背景（白色提亮）与容器底色（浅色半透明），条目文字、边框、玩家面板等全部走方案变量。修改列表页配色时两套方案都要验证，浅色覆盖不能删除。

固定配色的判定标准：元素是否带 MC 纹理或固定深色底。带纹理/固定深底的元素必须固定内部文字色；没有纹理、跟随方案换肤的普通卡片、面板、表单则全部使用方案变量。

固定配色的原则：底色与内部文字必须同属一套——固定底配固定字，换肤底配方案字。避免在固定 MC 组件上用方案变量覆盖背景、同时保留方案变量文字的半套组合：浅色方案下会出现底色与文字错配（如固定深底配浅色文字变深底深字）。

## 常见判断

- 颜色服务于普通界面（卡片、表格、对话框、管理后台）→ 方案变量。
- 元素本身是 MC 纹理/固定深色 → 固定色（字面值或 `--mc*`）。
- 状态色（成功/危险/警告）→ 方案变量，但出现在固定深色容器内时核对可读性。
- 主题色 → `--accent*`，不直接写绿色字面值。
