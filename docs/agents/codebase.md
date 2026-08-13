# Agent 代码库速查

面向自动化 Agent 的项目地图与硬规则。改动代码前通读；配色相关另见 [theming.md](./theming.md)。

## 项目地图

| 路径 | 内容 | 注意事项 |
|---|---|---|
| `src/main.ts` | 入口，引入全局样式与第三方覆盖 | — |
| `src/style.css` | 全局样式 + 全部主题变量 | 无注释，禁止加回注释 |
| `src/api/` | axios 封装 | 页面组件不直接拼 axios |
| `src/router/index.ts` | 路由表 | 新增页面需同步注册 |
| `src/components/utils/` | MC 风格通用组件 | 多为固定配色，见 theming.md |
| `src/views/` | 页面（Lobby/List/Activity/News/About/Documents/Wiki/Management/Auth） | 管理后台在 `views/Management/Components/` |
| `src/theme-override/` | 第三方组件样式覆盖 | 用方案变量 |
| `docs/` | 开发者文档 | 修改行为时同步更新 |

## 硬规则

1. 普通界面只用方案变量（`--bg*`、`--text*`、`--border*`、`--shadow*`、`--scrollbar*`、`--focus-ring`、`--accent*`、`--bevel*`）。
2. MC 固定文件内部禁用方案变量：`MinecraftButton.vue`、`MinecraftButtonClassic.vue`、`MinecraftButton3D.vue`、`MinecraftInput.vue`、`MinecraftTextarea.vue`、`views/Activity/ActivityView.vue`、`views/Activity/ActivityItem.vue`。用字面值或 `--mc*`。
3. 深色遮罩容器（导航栏 `NavBar.vue`、活动页）两方案下保持深色，容器内文字必须浅色。服务器列表页（`views/List/`）是方案自适应页面：深色方案为 MC 深色界面，浅色方案依赖 `ListView.vue` 中的 `[data-theme='light']` 覆盖（页面提亮 + 浅色容器），改动时两套方案都要验证。
4. `style.css` 无注释；变量语义以 `docs/theming.md` 为准。
5. API 一律封装进 `src/api/`。
6. 不改 `README.md` 的开发细节——README 面向运维；开发细节写 `docs/`。
7. 不引入新依赖；优先用现有工具（mitt、vue-clipboard3、md-editor-v3、toast）解决。

## 常见任务步骤

### 改颜色

1. 判断目标属于固定配色还是方案配色（theming.md 规则）。
2. 定位颜色来源：组件内字面值、`--mc*`、方案变量。
3. 修改后按「验证」一节实测。

### 加页面

1. `views/<模块>/` 新建组件。
2. `router/index.ts` 注册路由（注意 `meta.title`）。
3. 需要导航入口时更新 `NavBar.vue`（公开页）或 `ManagementView.vue`（后台）。
4. API 封装进 `src/api/`。

### 加接口

1. 在对应 `src/api/<模块>.ts` 加类型与具名函数（模式见 `../api.md`）。
2. 页面组件导入调用。

### 修布局/交互 bug

1. 浏览器打开页面复现。
2. 定位组件与样式，最小改动修复。
3. 深色/浅色两种方案都验证。

## 验证

- dev server 已在运行时直接复用；未运行时按 `README.md` 启动。
- 切换方案：`document.documentElement.setAttribute('data-theme','light')`；切回：`removeAttribute('data-theme')`。
- 核对颜色用 `getComputedStyle(el).getPropertyValue(...)`，不凭截图猜测。
- 类型检查：`npm run type-check`（或 `npx vue-tsc --noEmit -p tsconfig.app.json`）。
- 单个文件 lint：`npx eslint <文件>`。
- 不跑全量测试/lint（任务指定的除外）。
