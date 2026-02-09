# syntax=docker/dockerfile:1.20

FROM denoland/deno:2.6.6 AS deps
WORKDIR /app

COPY deno.json* deno.lock* package.json* ./

RUN --mount=type=cache,target=/deno-dir \
    deno install


FROM deps AS dev

COPY . .

EXPOSE 5173

CMD ["deno", "task", "dev", "--host", "0.0.0.0", "--port", "5173"]


FROM dev AS build

RUN deno task build


FROM build AS preview

COPY --from=build /app/ /app/

EXPOSE 4173

CMD ["deno", "task", "preview", "--host", "0.0.0.0", "--port", "4173"]


FROM denoland/deno:2.6.6 AS prod

COPY --from=build /app/.deno-deploy ./.deno-deploy
COPY --from=build /app/deno.json* /app/deno.lock* /app/package.json ./

EXPOSE 3000

CMD ["deno", "run", "-A", "./.deno-deploy/server.ts"]
