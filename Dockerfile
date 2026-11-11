FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

RUN npm install -g pnpm@12.16.1 && rm -rf /root/.npm

COPY . .

RUN pnpm install --frozen-lockfile

CMD ["pnpm", "test"]
