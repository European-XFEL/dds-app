# Base
FROM node:lts AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app


# Production Dependencies
FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Serve
FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app/build /app/build

EXPOSE 3000

CMD [ "bun", "run", "--server", "build/index.js" ]