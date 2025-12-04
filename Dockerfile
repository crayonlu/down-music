FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM node:20-alpine AS backend-kugou

WORKDIR /app

COPY backend/KuGouMusicApi/package.json backend/KuGouMusicApi/pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile --prod

COPY backend/KuGouMusicApi .


FROM node:20-alpine AS backend-netease

WORKDIR /app

COPY backend/NeteaseCloudMusicApi/package.json backend/NeteaseCloudMusicApi/pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile --prod

COPY backend/NeteaseCloudMusicApi .


FROM nginx:alpine AS production

COPY --from=frontend-builder /app/dist /usr/share/nginx/html

COPY --from=backend-kugou /app /app/kugou
COPY --from=backend-netease /app /app/netease

RUN apk add --no-cache nodejs npm supervisor

COPY <<EOF /etc/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:nginx]
command=/usr/sbin/nginx -g 'daemon off;'
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:kugou-api]
command=node /app/kugou/app.js
directory=/app/kugou
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=PORT=3001

[program:netease-api]
command=node /app/netease/app.js
directory=/app/netease
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=PORT=3002
EOF

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
    }

    location /kugou/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /netease/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
