# 开发指南

Vue 3 + TypeScript + Vite 工程开发流程与约定。主题与颜色规则见 [theming.md](./theming.md)，架构见 [architecture.md](./architecture.md)，API 封装见 [api.md](./api.md)。

## 环境要求

- Node.js 22+
- npm 11+
- 后端项目 [necore](../necore)（本地开发时默认运行在 `localhost:3000`）

## 安装与启动

```bash
npm install
npm run dev
```

开发服务器由 `vite.config.ts` 配置：监听 `0.0.0.0`，把 `/necore` 代理到 `http://localhost:3000`（含 WebSocket）。后端不在时页面能打开，但所有数据请求会失败。

`vite.config.ts` 还配置了 `allowedHosts`（`nmo.net.cn` 相关域名），局域网或自定义域名访问时按需增补。

## 常用命令

```bash
npm run dev          # 开发服务器
npm run type-check   # vue-tsc 类型检查
npm run build        # 类型检查 + 构建
npm run preview      # 预览构建产物
npm run format       # prettier 格式化 src/
npm run lint         # eslint 修复 src/
```

## 目录结构

```text
src/
├── api/                # API 封装（axios 实例 + 各模块接口）
├── components/
│   ├── utils/          # Minecraft 风格组件
│   ├── documents/      # 文档树组件
│   └── icons/          # 图标组件
├── eventbus/           # mitt 事件总线
├── font/               # 像素字体
├── lantern/            # 灯笼装饰
├── router/             # 路由
├── theme-override/     # 第三方组件主题覆盖
└── views/              # 页面
```

静态资源在 `public/`：`UI/`（MC 界面纹理）、`blockbg/`（方块材质）、`background/`（背景图）、`resources/`、`friend-logo/` 等。

## 新增页面

1. 在 `src/views/<模块>/` 下新建视图组件。
2. 在 `src/router/index.ts` 注册路由；需要导航入口的同步更新 `NavBar.vue` 或 `ManagementView.vue`。
3. 接口统一封装到 `src/api/`（模式见 [api.md](./api.md)），页面组件不直接拼 axios 请求。
4. 页面级配色全部使用方案变量，遵循 [theming.md](./theming.md) 的分层规则。

## 新增组件

- 通用可复用组件放 `components/utils/` 或 `components/`，页面内私有组件放对应视图目录。
- Minecraft 风格组件：带点击音效（`/button.click.ogg`），事件处理在组件内部完成，调用方只传内容与属性。
- 新组件内部文字/背景颜色按 theming.md 规则选择方案变量或固定色。

## 组件规范

### Minecraft 通用组件（`components/utils/`）

| 组件 | 用途 | 配色 |
|---|---|---|
| `MinecraftButton` | 标准 MC 按钮（绿色纹理） | 固定（`--mc*` + 字面值） |
| `MinecraftButtonClassic` | 经典 MC 按钮（材质背景） | 固定 |
| `MinecraftButton3D` | 立体按压按钮 | 固定 |
| `MinecraftInput` | MC 输入框 | 固定 |
| `MinecraftTextarea` | MC 文本域 | 固定 |
| `MinecraftSwitch` | MC 开关 | 固定主体，焦点环随方案 |
| `MinecraftDialog` | MC 对话框 | 面板随方案换肤 |

固定配色的完整清单与判定标准见 theming.md。

### 颜色使用规则

- 组件样式里不写随意的字面颜色；普通界面一律用方案变量。
- MC 固定组件内部禁用方案变量（`--text*`、`--bg*`、`--border*`、`--shadow*`、`--focus-ring`）。
- 阴影立体感用 `--bevel*` / `--shadow*` 组合。
- 焦点环统一用 `--focus-ring`（固定深色容器内例外，用浅色固定值）。

### 键盘导航与无障碍

- 可点击元素使用 `button` 或提供明确的键盘交互。
- 图标按钮提供 `aria-label`。
- Dialog 有标题，确认/取消可通过键盘操作。
- 动态状态变化用 `aria-live` 提示。
- 列表、表格、日志等区域使用合适的 `role`、`caption` 或 `aria-label`。
- 路由切换后焦点回到 `#main-content`（router 已处理）。
- 全局 `:focus-visible` 样式在 `style.css` 中定义；组件可覆盖但须保证可见。

## 第三方组件覆盖

第三方库样式覆盖集中在 `src/theme-override/`（md-editor、toast），随 `main.ts` 引入，使用方案变量联动主题。管理后台中模仿 MC 输入框的表单控件（如日期选择器 `.dp__input`）在管理组件内覆盖，底色用 `--bg-input`，属于跟随方案的表单。

## 响应式与断点

各视图自带媒体查询，断点不统一，改布局时先看目标组件现有断点：

- 活动页：`524px`（条目图片/信息上下排布）。
- 服务器列表：`768px`（条目压缩）、`947px`（活动条目高度切换由 JS 判断 `window.innerWidth < 947`）。
- 新闻头图：`1180px`、`760px`（网格降列）。

新增断点沿用相邻组件的做法，避免引入第三套。

## 资源与素材

静态资源放 `public/`，按用途分目录：

| 目录 | 内容 |
|---|---|
| `UI/` | MC 界面纹理（按钮、对话框、输入框边框、服务器状态图标） |
| `blockbg/` | 方块材质（深板岩、圆石等，16×16 像素纹理） |
| `background/` | 页面背景图（bg.jpg、header-bg.jpg、list-background.jpg 等） |
| `resources/`、`friend-logo/`、`otherlogos/` | 文章资源、友链图标等 |

纹理类素材沿用像素风约定：小尺寸（16px 方块）、CSS `image-rendering: pixelated`。新增头图背景时参照 `style.css` 中 `.nmo-hero-panel` 的纹理 + 遮罩结构，并同步浅色方案覆盖。

## 验证流程

改动颜色或布局后：

1. dev server 运行中打开对应页面。
2. 控制台切换方案：`document.documentElement.setAttribute('data-theme', 'light')`，再 `removeAttribute('data-theme')` 切回深色。
3. 两种方案各检查一遍：文字对比度、MC 固定元素、深色遮罩容器、焦点环。
4. 用 `getComputedStyle(el).getPropertyValue('...')` 核对关键颜色。
5. 运行 `npm run type-check`，修改的 `.vue` 文件跑 `npx eslint <文件>`。

项目不维护自动化测试套件，行为验证以浏览器实测为准；涉及新契约（API 字段、路由、权限）时在改动说明中给出实测证据。

## 故障排查

| 现象 | 原因与处理 |
|---|---|
| 页面打开但数据为空 | 后端（necore）未运行或不在 3000 端口；检查 `localhost:3000` 与 `vite.config.ts` 代理 |
| 控制台请求 404/代理错误 | `/necore` 未转发；开发环境检查 Vite 代理，生产环境检查 Nginx `location /necore/` |
| 自定义域名访问被 Vite 拒绝 | `server.allowedHosts` 未包含该域名，在 `vite.config.ts` 增补 |
| 改的样式不生效 | HMR 偶发残留；硬刷新页面，或重启 dev server |
| `npm run build` 失败 | 先跑 `npm run type-check` 定位类型错误；构建同时执行类型检查 |
| GitHub Pages 刷新 404 | SPA 路由回退依赖 `try_files /index.html`；Pages 部署需在仓库启用 Pages + GitHub Actions 来源 |

## Git 与持续集成

- 开发分支自定，合并到 `main` 后 GitHub Actions 自动构建并发布到 Pages（`.github/workflows/`）。
- 提交前跑 `npm run type-check` 与改动文件的 ESLint。
- 涉及配色/主题的提交附带两方案实测结果（见验证流程）。

## 注意事项

- 文件上传接口返回的 `/contents/...` 路径不一定带 `/necore` 前缀，展示资源时统一处理。
- 对后端返回的日志 HTML 片段做白名单清理，不直接渲染不可信 HTML。
- 修改导出的组件/API 前，用 IDE 的引用查找（references）确认调用方。
- `style.css` 不写注释，变量语义以 theming.md 为准。
