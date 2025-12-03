# syntax=docker/dockerfile:1.7
FROM python:3.13-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_SYSTEM_PYTHON=1

RUN curl -LsSf https://astral.sh/uv/install.sh | sh -s -- --install-dir /usr/local/bin

WORKDIR /app

FROM base AS deps

COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache \
    /usr/local/bin/uv sync --frozen --no-dev --no-editable --system

FROM python:3.13-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY --from=deps /usr/local /usr/local

RUN useradd -u 1000 -m appuser
USER appuser

WORKDIR /app

COPY --chown=appuser:appuser . .

EXPOSE 50051

CMD ["python", "-m", "simex_debye_grpc.main"]
