# 开发者文档

Neco（NMO Ecosystem 前端）的开发者文档。项目为 Vue 3 + TypeScript + Vite 构建，界面以 Minecraft 像素风为主。

## 文档总目录

| 文档 | 读者 | 内容 |
|---|---|---|
| [architecture.md](./architecture.md) | 所有人 | 架构总览：前后端关系、目录结构、路由、API 层、关键数据流 |
| [development.md](./development.md) | 开发者 | 开发指南：环境与启动、新增页面/组件/接口流程、组件规范、无障碍、验证 |
| [theming.md](./theming.md) | 开发者 | 主题系统：变量分层、深色/浅色对照表、切换与新增配色方案、Minecraft 固定配色约定 |
| [api.md](./api.md) | 开发者 | API 封装规范：axios 实例、拦截器、模块化封装模式、上传与认证 |
| [deployment.md](./deployment.md) | 运维 | 部署与运维：构建、GitHub Pages、Nginx 同源部署、环境变量 |
| [agents/](./agents/README.md) | Agent | Agent 专用规则与代码库速查，分派自动化任务时随任务说明附带 |

## 阅读路径

- 安装、开服、启动开发服务器：仓库根目录 `README.md`（面向运维）。
- 理解整体结构与数据流：`architecture.md`。
- 开始写代码：`development.md`，配色相关先读 `theming.md`。
- 给 Agent 分派任务：把对应文档（通常为 `agents/codebase.md` 与 `agents/theming.md`）附进任务说明。

## 与其他文档的分工

- 根目录 `README.md`：项目介绍、安装、运行、部署，面向服务器管理。
- `API.md`（根目录）：前后端 API 约定（请求/响应格式），由后端与前端共同维护。
- `docs/api.md`：前端 `src/api/` 的封装规范与实现模式。
