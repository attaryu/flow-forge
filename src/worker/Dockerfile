FROM node:20-alpine AS builder
RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/worker/package.json ./src/worker/

RUN pnpm install --frozen-lockfile

COPY src/worker ./src/worker

WORKDIR /app/src/worker
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/src/worker/package.json ./src/worker/
COPY --from=builder /app/src/worker/dist ./src/worker/dist
COPY --from=builder /app/src/worker/node_modules ./src/worker/node_modules

WORKDIR /app/src/worker

CMD ["pnpm", "run", "start:prod"]
