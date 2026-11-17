FROM node:26-slim

RUN npm install -g pnpm@12.16.1 && rm -rf /root/.npm

WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile --filter @platform/padel-app

WORKDIR /repo/apps/padel
ENV PORT=3002
EXPOSE 3002
CMD ["pnpm", "start"]