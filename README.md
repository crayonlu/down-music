# 🎶down-music

[English](./README.en.md) | 简体中文

一个集成多平台音乐搜索、播放和下载功能的网页音乐播放器。

## 功能特性

- 多平台音乐搜索（网易云音乐、酷狗音乐）
- 实时音频播放与可视化效果
- 歌词显示与同步滚动
- 播放列表管理
- 歌曲下载功能
- 多种播放模式（顺序播放、单曲循环、随机播放）
- 深色/浅色主题切换
- 响应式设计，支持移动端和桌面端

## 技术栈

- Vue 3 + TypeScript
- Vite
- Pinia（状态管理）
- Vue Router
- SCSS

## 项目设置

```sh
pnpm install
```

### 开发环境

启动前端：

```sh
pnpm dev
```

启动后端 API：

```sh
cd backend/NeteaseCloudMusicApi
bun start

cd backend/KuGouMusicApi
bun start
```

### 生产构建

```sh
pnpm build
```

### Self-host

拉取镜像并RUN RUN RUN

```sh
# 拉取镜像
docker pull ghcr.io/crayonlu/down-music:main

# Run (映射主机端口 2999 -> container的 80)
docker run -d --name down-music-app -p 2999:80 ghcr.io/crayonlu/down-music:main
```

## API 后端

本项目需要两个音乐 API 后端：

- [NeteaseCloudMusicApi](./backend/NeteaseCloudMusicApi) - 网易云音乐 API
- [KuGouMusicApi](./backend/KuGouMusicApi) - 酷狗音乐 API

两个 API 都需要运行才能实现完整功能。

## 媒体代理配置

- `VITE_MEDIA_PROXY_URL`: 生产环境下推荐设置为完整代理 URL（例如 `https://api.example.com/proxy`）
- `VITE_MEDIA_PROXY_PREFIX`: 当前端部署在特定路径前缀时使用的代理前缀
- `VITE_PROXY_IMAGES=false|true`: 是否启用图片代理，默认 `false`（不代理图片）。设为 `true` 后，前端会使用代理 URL 替换图片链接。

开发时在本地启用图片代理：将 `VITE_PROXY_IMAGES=true` 写入 `.env` 或在 `env.example` 中复制为 `.env` 并修改。
