FROM node:22.12.0-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json package-lock.json ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm exec ng build --configuration development \
    && SITE_DIR="$(dirname "$(find dist -name index.html | head -n 1)")" \
    && mkdir -p /tmp/site \
    && cp -R "$SITE_DIR"/. /tmp/site/

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /tmp/site /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
