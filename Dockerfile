# Base
FROM node:lts AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Production Dependencies
FROM base AS build-deps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch --frozen-lockfile

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build
FROM build-deps AS build

COPY . ./

ENV DATABASE_URL="file:/app/local.db"

RUN pnpm db:push --force

RUN pnpm run build

# Serve
FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app/build /app/build

EXPOSE 3000

CMD [ "bun", "run", "--server", "build/index.js" ]