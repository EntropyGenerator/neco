# 部署与运维

前端是纯静态 SPA，构建产物 `dist/` 可由任意静态服务器托管；后端（necore）单独部署。

## 构建

```bash
npm run build      # 类型检查 + 构建
npm run preview    # 本地预览构建产物
```

产物位于 `dist/`。

## 环境变量

| 变量 | 作用 |
|---|---|
| `VITE_IS_GITHUB_PAGES` | 置 `1` 时 `vite.config.ts` 把 `base` 设为 `/neco/`（GitHub Pages 子路径部署） |

## GitHub Pages 自动部署

`.github/workflows/` 中已配置：push 到 `main` 后自动执行

```bash
VITE_IS_GITHUB_PAGES=1 npm run build
```

并把 `dist/` 发布到 Pages。仓库需在 GitHub 设置中启用 Pages 并选择「GitHub Actions」作为来源。

## 同源部署（Nginx）

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

要点：

- SPA 路由回退：`try_files ... /index.html`。
- `/necore/bots/ws/` 需要 WebSocket 升级头，`proxy_http_version 1.1` 与 `Upgrade`/`Connection` 缺一不可。
- 后端端口（示例 3000）按 necore 实际配置调整。

## 开发服务器配置（vite.config.ts）

- `server.host: "0.0.0.0"`：局域网可访问。
- `server.proxy`：`/necore` → `http://localhost:3000`（含 `ws: true`）。
- `server.allowedHosts`：已包含 `nmo.net.cn` 相关域名；使用其他域名访问时需增补，否则 Vite 会拒绝请求。

## 后端要求

- 后端项目为 [`necore`](../necore)，默认端口 3000。
- 前端只通过 `/necore` 前缀访问，跨域由代理解决，无需 CORS 配置。
