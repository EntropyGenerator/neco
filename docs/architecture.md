# 架构总览

## 整体结构

```mermaid
flowchart LR
    Browser[浏览器] -->|静态资源| Web[Web 服务器<br/>Vite dev / Nginx / GitHub Pages]
    Web --> App[Vue 3 SPA<br/>src/]
    App -->|axios 请求 /necore/*| Proxy[/necore 反向代理]
    Proxy --> Backend[necore 后端<br/>localhost:3000]
    Backend --> DB[(数据库)]
    Backend <-->|WebSocket /bots| Bot[在线 Bot 连接]
    App -->|WebSocket /necore/bots/ws/*| Proxy
    Proxy --> Backend
```

前端是纯静态 SPA，不直接访问后端；所有 API 请求走 `/necore` 前缀，由部署层的反向代理转发到后端（开发环境由 Vite 代理到 `localhost:3000`）。

## 前端目录

```text
src/
├── main.ts                  # 入口：挂载 App、路由、Toast、全局样式
├── App.vue                  # 根组件（仅渲染 router-view）
├── style.css                # 全局样式与主题变量（无注释，语义见 theming.md）
├── api/                     # API 封装
│   ├── api.ts               # axios 实例、baseURL、鉴权拦截器
│   ├── auth.ts              # 登录、用户、权限
│   ├── newslist.ts          # 新闻/活动/公告
│   ├── serverlist.ts        # 服务器列表与状态
│   ├── documents.ts         # 文档树与内容
│   ├── links.ts             # 友情链接
│   └── bot.ts               # Bot Token 与连接
├── components/              # 通用组件
│   ├── utils/               # Minecraft 风格组件（按钮、输入框、Dialog、Switch…）
│   ├── documents/           # 文档树
│   └── icons/               # 图标
├── eventbus/                # mitt 全局事件总线
├── lantern/                 # 灯笼装饰动画
├── font/                    # 像素字体与 DefineFont.css
├── router/                  # 路由定义
├── theme-override/          # 第三方组件样式覆盖（md-editor、toast）
└── views/                   # 页面
    ├── HomeView.vue         # 公开页外壳（含 NavBar）
    ├── Lobby/               # 大厅页
    ├── List/                # 服务器列表（MC 多人服务器列表界面）
    ├── Activity/            # 活动页
    ├── News/                # 新闻/活动/公告/社刊
    ├── About/               # 关于
    ├── Documents/           # 文档
    ├── Wiki/                # 百科
    ├── Auth/                # 登录
    ├── Management/          # 管理后台
    └── NotFound.vue         # 404
```

## 路由

定义在 `src/router/index.ts`，使用 `createWebHistory`。

- `/` 下挂载公开页子路由：`/lobby`、`/list`、`/activity`、`/news`、`/news/detail/:id`、`/about`、`/documents`、`/wiki`、`/wiki/detail/:kind/:id`。
- `/management` 下挂载 7 个管理模块（用户、社团、服务器、文章、文档、Bot、百科）。
- `/documents_editor`、`/auth/login` 为独立页面。
- `/:catchAll(.*)*` 兜底到 404。

路由守卫：

- `beforeEach`：根据 `meta.title` 设置 `document.title`。
- `afterEach`：把焦点移回 `#main-content`（键盘导航/屏幕阅读器支持）。

## API 层

`src/api/api.ts` 创建 axios 实例，`baseURL` 为 `/necore`，10 秒超时。请求拦截器自动附加 `Authorization: Bearer <token>`（token 存于 `localStorage`）；401 时调用 `CheckAuthorized()` 尝试刷新，失败则提示并跳转登录页。模块化封装模式见 [api.md](./api.md)。

## 关键数据流

### 服务器实时状态

`ListView.vue` 加载服务器列表后，对 `realtime === true` 的条目轮询 `POST /necore/server/status`；状态决定延迟图标（`Server_Ping_N.png`）与在线人数/容量/版本/延迟。返回 `players` 时展示可展开的在线玩家头像列表。

### 新闻与活动

- `NewsView.vue`：`GetNewsBrief()` 取 4 类（活动/资讯/社刊/公告）头条，展示在头图（`.nmo-hero-panel`）；`NewsList.vue` 按分类分页列表。
- `ActivityView.vue`：`GetNewsTotal()` + `GetNews('activity', page, pageSize)` 分页；条目为 3D 按钮，按日期判断「进行中/已结束」。
- `NewsDetail.vue`：`GetNewsDetail(id)` 返回 Markdown/PDF 分段内容。

### Bot 推送

管理后台的 Bot 连接通过 `/necore/bots/ws/` WebSocket 维护（`src/api/bot.ts`）。文章管理保存时可选择把 `article_updated` 事件推送到选中的 Bot 连接，消息体为 `{ doesNotify, notifySessionIds }`。

## 事件总线

`src/eventbus/EventBus.ts` 基于 mitt 创建，用于组件间轻量通信（如跨组件刷新）。

## 第三方集成

| 库 | 用途 | 覆盖位置 |
|---|---|---|
| md-editor-v3 | Markdown 编辑/预览 | `theme-override/md-preview.css` |
| vue-toastification | 全局通知 | `theme-override/toast.css` |
| vue-clipboard3 | 剪贴板 | — |
| @vuepic/vue-datepicker | 日期选择（文章管理） | 管理组件内 scoped 覆盖 |
