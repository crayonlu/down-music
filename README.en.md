# down-music

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

## API Backends

This project requires two music API backends:

- [NeteaseCloudMusicApi](./backend/NeteaseCloudMusicApi) - NetEase Cloud Music API
- [KuGouMusicApi](./backend/KuGouMusicApi) - KuGou Music API

Both APIs need to be running for full functionality.

## Known Issues

- Some resources returned by the KuGou API are served over HTTP (not HTTPS). Browser mixed content policies may flag the site as insecure or block those resources from loading.
  - Recommendation: Use a backend proxy to rewrite resource URLs to HTTPS or replace links with HTTPS, and consider using a CORS/HTTPS proxy where applicable.
