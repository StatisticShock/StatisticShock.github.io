# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

# ─────────────────────────────────────────────
# Build stage
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy package.json from server/ and install dependencies
COPY server/package.json ./server/
WORKDIR /app/server
RUN npm install

# Copy full project (includes server/ and util/)
WORKDIR /app
COPY . .

# ─────────────────────────────────────────────
# Final stage
FROM base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y chromium chromium-sandbox && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY --from=build /app /app

EXPOSE 8080
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
CMD ["node", "server/server.js"]
