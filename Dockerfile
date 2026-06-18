# syntax=docker/dockerfile:1.20

FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile


FROM deps AS dev

COPY . .

EXPOSE 5173

CMD ["node_modules/.bin/vite", "dev", "--host", "0.0.0.0", "--port", "5173"]


FROM dev AS build

RUN pnpm build


FROM build AS preview

EXPOSE 4173

CMD ["node_modules/.bin/vite", "preview", "--host", "0.0.0.0", "--port", "4173"]


FROM deps AS prod

COPY --from=build /app/build ./build

EXPOSE 8000

CMD ["node", "build/index.js"]
