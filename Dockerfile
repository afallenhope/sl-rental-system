# PNPM
FROM node:19-alpine AS base
ENV PORT 3000

WORKDIR /opt/app
RUN npm install -g pnpm

# DEV DEPENDENCIES
FROM base AS dev
COPY pnpm-lock.yaml .
RUN set -eux; \
  apk add --no-cache \
   git \
   python3 \
   make \
  g++ \
  rm -rf  /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && \
  pnpm fetch
COPY package*.json .

RUN pnpm install --only=dev

# PROD APP
FROM dev AS prod
COPY . .
RUN pnpm install \
&& pnpm build

EXPOSE ${PORT}
CMD ["node", "dist/index.js"]
