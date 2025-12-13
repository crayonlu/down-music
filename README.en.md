# 🎶down-music

English | [简体中文](./README.md)

A web-based music player that integrates with multiple music platforms for searching, streaming, and downloading songs.

## Features

- Multi-platform music search (NetEase Cloud Music, KuGou Music)
- Real-time audio playback with visualizer
- Lyrics display with synchronized scrolling
- Playlist management
- Song download functionality
- Multiple playback modes (sequence, loop, random)
- Dark/Light theme support
- Responsive design for mobile and desktop

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- SCSS

## Project Setup

```sh
pnpm install
```

### Development

Start the frontend:

```sh
pnpm dev
```

Start the backend APIs:

```sh
cd backend/NeteaseCloudMusicApi
bun start

cd backend/KuGouMusicApi
bun start
```

### Production Build

```sh
pnpm build
```

### Self-host

Pull the pre-built image from the registry and run it:

```sh
# Pull pre-built image
docker pull ghcr.io/crayonlu/down-music:main

# Run container (expose port 2999 -> container's 80)
docker run -d --name down-music-app -p 2999:80 ghcr.io/crayonlu/down-music:main
```

## API Backends

This project requires two music API backends:

- [NeteaseCloudMusicApi](./backend/NeteaseCloudMusicApi) - NetEase Cloud Music API
- [KuGouMusicApi](./backend/KuGouMusicApi) - KuGou Music API

Both APIs need to be running for full functionality.

## Media proxy configuration

- `VITE_MEDIA_PROXY_URL`: It is recommended to set to the full proxy URL in production environment (for example `https://api.example.com/proxy`)
- `VITE_MEDIA_PROXY_PREFIX`: The proxy prefix used when the front-end is deployed at a specific path prefix
- `VITE_PROXY_IMAGES=false|true`: Whether to enable image proxy, the default is `false` (do not proxy images). When set to `true`, the frontend will replace the image link with the proxy URL.

Enable image proxy locally during development: write `VITE_PROXY_IMAGES=true` to `.env` or copy it to `.env` in `env.example` and modify it.
