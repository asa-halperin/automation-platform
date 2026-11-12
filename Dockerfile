FROM mcr.microsoft.com/playwright:v1.64.1-noble

RUN apt-get update \
    && apt-get install -y --only-upgrade apt libapt-pkg6.0t64 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm@12.16.1 && rm -rf /root/.npm

COPY . .

RUN pnpm install --frozen-lockfile

CMD ["pnpm", "test"]
