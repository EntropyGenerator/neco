# API 封装规范

前端所有后端请求集中在 `src/api/`。请求/响应格式约定见根目录 `API.md`；本文档说明前端封装模式。

## axios 实例

`src/api/api.ts`：

```ts
export const BASE_URL = '/necore'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})
```

- `BASE_URL` 恒为 `/necore`，由部署层代理到后端（开发环境见 `vite.config.ts`）。
- 请求拦截器自动附加 `Authorization: Bearer <token>`（token 存于 `localStorage`）。
- 401 时调用 `CheckAuthorized()` 尝试恢复登录态，失败则提示并跳转 `/auth/login`。

## 模块化封装模式

每个领域一个文件（`auth.ts`、`newslist.ts`、`serverlist.ts`、`documents.ts`、`links.ts`、`bot.ts`），模式：

1. 定义实体类型并导出（如 `NewsEntity`、`ServerEntity`）。
2. 用 `api.get` / `api.post` 封装为具名异步函数，返回已定型的类型。
3. 错误用 `.catch(() => {})` 吞掉并返回安全默认值，或由调用方 toast 提示——保持调用方不需要处理异常分支。

```ts
export interface NewsEntity { /* ... */ }

export const GetNewsTotal = async (target: NewsTarget): Promise<number> => {
  let result = 0
  await api.get(`/news/total/${target}`).then((res) => {
    result = res.data.total
  }).catch(() => {})
  return result
}
```

POST 请求直接传对象字面量：

```ts
await api.post('/news/list', { target, page, page_size: pageSize, pin: false })
```

## 新增接口

1. 在对应模块文件加实体类型（放 `src/api/` 内，与后端 `API.md` 对齐字段）。
2. 加具名导出函数，遵循上述模式。
3. 页面组件从 `src/api/` 导入调用，不直接 import axios 或拼 URL。

## 认证与用户

`auth.ts` 提供 `Login`、`CheckAuthorized`、`GetUserInfo`、`GetAvatar` 等。`CheckAuthorized` 同时承担 401 后的会话恢复，被 `api.ts` 拦截器复用。权限组（`admin`、`news_admin`、`server_admin`、`document_admin`、`bot_admin`）由用户 `group` 字段决定，管理页面据此控制能力。

## 文件上传

上传接口返回的 `/contents/...` 路径不一定带 `/necore` 前缀，展示资源时用 `BASE_URL` 补齐（参考各模块对 `BASE_URL` 的既有用法）。

## 约定

- 页面组件不直接拼装 axios 请求。
- 类型字段与后端返回对齐；后端字段变更时同步更新类型与封装。
- 日志等不可信 HTML 片段由后端提供，前端渲染前必须做白名单清理。
