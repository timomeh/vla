# syntax=docker/dockerfile:1

FROM node:lts AS build
WORKDIR /app

RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY docs/package.json ./docs/package.json
RUN pnpm install --filter @vla/docs --frozen-lockfile
COPY docs/astro.config.mjs docs/tsconfig.json ./docs/
COPY docs/public ./docs/public
COPY docs/src ./docs/src
RUN pnpm --dir docs build

FROM nginx:alpine AS runtime
COPY <<'EOF' /etc/nginx/nginx.conf
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  server {
    listen 8080;
    server_name   _;

    root   /usr/share/nginx/html;
    index  index.html index.htm;
    include /etc/nginx/mime.types;

    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    error_page 404 /404.html;
    location = /404.html {
      root /usr/share/nginx/html;
      internal;
    }

    location / {
      try_files $uri $uri/index.html =404;
    }
  }
}
EOF
COPY --from=build /app/docs/dist/ /usr/share/nginx/html/
EXPOSE 8080
