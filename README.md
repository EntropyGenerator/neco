# NMO Ecosystem（Neco）

![version](https://img.shields.io/badge/version-1.14.514-42b883)
![license](https://img.shields.io/badge/license-MIT-brightgreen)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff)
![Node](https://img.shields.io/badge/Node-22%2B-339933)

Neco 是 NMO Ecosystem 的前端项目。NMO 是南京大学 Minecraft 协会，围绕 Minecraft 发展建筑、计算机、软件、电路、建模等方向的兴趣与知识。Neco 承载协会的官网能力：服务器列表与实时状态、活动与新闻、文档、百科，以及面向管理员的内容管理后台。

后端项目为 [`necore`](../necore)，前端通过 `/necore` 前缀访问后端 API。

## 特色

- **Minecraft 像素风界面**：全套 MC 纹理组件（按钮、输入框、对话框、服务器列表），全局主题系统支持深色/浅色配色方案与自定义主题色。
- **服务器列表与实时状态**：展示在线状态、延迟、在线人数、容量、版本与服务器图标，支持展开在线玩家头像列表（悬停或 Tab 聚焦显示玩家名）。
- **活动 / 新闻 / 公告 / 社刊**：Markdown 与 PDF 文章，头图展示与分页列表。
- **文档与百科**：公开文档树、词条与物品百科。
- **部门展示**：维度页展示社团部门与成员卡片（负责人标识、成员轮播），后台可维护排序。
- **管理后台**：用户、社团、部门、服务器、文章、文档、Bot 连接八大管理模块，按权限组控制能力。
- **Bot 文章推送**：保存文章时可把更新事件推送到指定的在线 Bot 连接（WebSocket）。
- **无障碍与键盘导航**：全站 `focus-visible` 焦点环、`aria-label`、Dialog 键盘操作、路由切换焦点管理。

## 目录

- [环境要求](#环境要求)
- [安装](#安装)
- [启动开发服务器](#启动开发服务器)
- [构建与预览](#构建与预览)
- [部署（开服）](#部署开服)
- [后端说明](#后端说明)
- [权限组](#权限组)
- [技术栈](#技术栈)
- [文档](#文档)
- [开发引导](#开发引导)
- [无障碍设计约定](#无障碍设计约定)
- [License](#license)

## 环境要求

- Node.js 22+
- npm 11+

使用 Nix 的环境可直接进入仓库根目录的 `shell.nix`（提供 Node 22 与 npm-check-updates）。

## 安装

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

默认监听 `0.0.0.0:5173`，并把 `/necore` 代理到 `http://localhost:3000`（含 WebSocket）。后端（necore）需要提前在 3000 端口运行，否则页面可打开但数据请求失败。

局域网或自定义域名访问时注意 `vite.config.ts` 中的 `allowedHosts` 配置。

## 构建与预览

```bash
npm run build      # 类型检查 + 构建到 dist/
npm run preview    # 本地预览构建产物
```

## 部署（开服）

前端是纯静态 SPA，构建产物 `dist/` 可由任意静态服务器托管；后端（necore）单独部署。

### GitHub Pages 自动部署

push 到 `main` 后，GitHub Actions 自动执行 `VITE_IS_GITHUB_PAGES=1 npm run build` 并发布 `dist/` 到 Pages（`.github/workflows/`）。仓库需启用 Pages 并选择「GitHub Actions」作为来源。

### 同源部署（Nginx）

前端与后端共用同一域名：

```text
https://example.com/          -> 静态资源（dist/）
https://example.com/necore/   -> 后端
```

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /necore/ {
    proxy_pass http://127.0.0.1:3000/necore/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /necore/bots/ws/ {
    proxy_pass http://127.0.0.1:3000/necore/bots/ws/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

要点：SPA 路由回退用 `try_files ... /index.html`；`/necore/bots/ws/` 必须携带 WebSocket 升级头。部署细节见 [docs/deployment.md](docs/deployment.md)。

## 后端说明

- 后端项目：[`necore`](../necore)，默认端口 3000。
- 前端 `src/api/api.ts` 中 `BASE_URL` 恒为 `/necore`，由代理转发，无需 CORS 配置。
- 服务器实时状态接口：`POST /necore/server/status`。`realtime === true` 的条目会轮询该接口，返回 `online: true` 时展示在线人数、容量、版本、延迟与玩家头像（头像策略：UUID → 玩家名 → 兜底源 → 默认 Steve 头像；MC 状态协议的玩家列表为 sample，不保证完整）。

## 权限组

管理后台按登录用户的 `group` 字段控制能力：

| 权限组 | 用途 |
|---|---|
| `admin` | 超级管理员，拥有全部管理权限 |
| `news_admin` | 文章/新闻管理 |
| `server_admin` | 服务器列表管理 |
| `document_admin` | 文档管理 |
| `bot_admin` | Bot Token 与 WebSocket 连接管理 |

管理后台入口：`/management`。

## 技术栈

- Vue 3 + TypeScript + Vite
- Vue Router、Axios
- md-editor-v3（Markdown 编辑/预览）、vue-toastification（通知）、vue-clipboard3（剪贴板）、@vuepic/vue-datepicker（日期选择）
- mitt（事件总线）

## 文档

| 文档 | 内容 |
|---|---|
| [docs/README.md](docs/README.md) | 开发者文档总目录 |
| [docs/architecture.md](docs/architecture.md) | 架构总览与数据流 |
| [docs/development.md](docs/development.md) | 开发指南：环境、组件规范、验证流程 |
| [docs/theming.md](docs/theming.md) | 主题系统：变量、配色方案、Minecraft 固定配色 |
| [docs/api.md](docs/api.md) | API 封装规范 |
| [docs/deployment.md](docs/deployment.md) | 部署与运维 |
| [docs/agents/](docs/agents/README.md) | Agent 专用规则与代码库速查 |
| [API.md](API.md) | 前后端 API 约定（请求/响应格式） |

## 开发引导

开发相关约定（新增页面/组件/接口、配色规则、无障碍、验证流程）见 [docs/](docs/README.md)。要点：

- 新增 API 时在 `src/api/` 中封装，页面组件不要直接拼装 axios 请求。
- 新增后台页面时同步修改 `src/router/index.ts` 与 `ManagementView.vue` 导航入口。
- 文件上传返回的 `/contents/...` 路径不一定带 `/necore` 前缀，展示资源时统一处理。
- 后端返回的日志 HTML 片段必须做白名单清理，避免渲染不可信 HTML。

## 无障碍设计约定

- 可点击元素使用 `button` 或提供明确的键盘交互。
- 图标按钮提供 `aria-label`。
- Dialog 使用明确标题，确认/取消可通过键盘操作。
- 动态状态变化使用 `aria-live` 提示。
- 列表、表格、日志等区域使用合适的 `role`、`caption` 或 `aria-label`。
- 服务器玩家头像支持 Tab 聚焦，并在聚焦时显示玩家名称。

## License

[MIT](LICENSE)
