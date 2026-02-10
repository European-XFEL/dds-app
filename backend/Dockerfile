# syntax=docker/dockerfile:1.7
FROM ghcr.io/astral-sh/uv:debian AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_CACHE_DIR=/root/.cache/uv/python

WORKDIR /app

RUN apt update && apt install -y python3-dev

FROM base AS deps

RUN mkdir -p -m 0700 /root/.ssh && ssh-keyscan -p 10022 git.xfel.eu >> /root/.ssh/known_hosts

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=ssh \
    uv sync --locked --no-install-project

FROM base

COPY --from=deps /app/.venv /app/.venv

COPY . /app

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

EXPOSE 50051

CMD ["uv", "run", "-m", "simex_debye_grpc.main"]
