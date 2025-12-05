# syntax=docker/dockerfile:1.20

# Base
FROM node:22-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV DATABASE_URL="/app/local.db"

RUN corepack enable pnpm

# Dependencies
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile

# Seed
FROM deps AS db-seed

COPY --parents ./drizzle.config.ts ./src/data ./src/lib/server/db ./src/lib/server/thermo.ts ./

RUN pnpm run db:push --force && pnpm run db:seed

# Build
FROM base AS build

COPY . ./

RUN pnpm run build

# Development/Preview
FROM build AS dev

EXPOSE 4173

CMD [ "pnpm", "run", "preview", "--host", "0.0.0.0" ]

# Production
FROM base AS prod

ENV DATABASE_URL="/app/local.db"

# Copy package files and install production dependencies only
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# Copy build output and database
COPY --from=build /app/build ./build
COPY --from=build /app/local.db ./local.db

EXPOSE 3000

CMD [ "node", "build" ]
