# OS Dashboard — local-first personal AI assistant.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps: none needed beyond the stdlib for the dashboard.
# Copy the source first so `pip install .` sees the real packages.
COPY . .
RUN pip install --upgrade pip && \
    pip install ".[dashboard,google]"

# Persistent state: dashboard DB (incl. encrypted credentials), vault key,
# memory, logs. Mount or name this volume so reconnecting services survive
# container rebuilds.
VOLUME ["/app/data"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:3000/api/me', timeout=4)"

# Bind 0.0.0.0 inside the container; compose publishes it as localhost:3000.
CMD ["python", "cli.py", "dashboard", "--port", "3000", "--host", "0.0.0.0"]
