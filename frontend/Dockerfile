FROM node:lts-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
#ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ARG VITE_RAILWAY_BACKEND_URL

RUN npm run build

FROM caddy

WORKDIR /app

COPY Caddyfile ./

RUN caddy fmt Caddyfile --overwrite

COPY --from=build /app/dist ./dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]