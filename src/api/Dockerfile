FROM node:20-alpine AS builder
RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared-validation/package.json ./packages/shared-validation/
COPY src/api/package.json ./src/api/

RUN pnpm install --frozen-lockfile

COPY packages/shared-validation ./packages/shared-validation
COPY src/api ./src/api

RUN pnpm --filter @flow-forge/shared-validation build

WORKDIR /app/src/api
RUN npx prisma generate
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared-validation ./packages/shared-validation
COPY --from=builder /app/src/api/package.json ./src/api/
COPY --from=builder /app/src/api/dist ./src/api/dist
COPY --from=builder /app/src/api/node_modules ./src/api/node_modules
COPY --from=builder /app/src/api/prisma ./src/api/prisma
COPY --from=builder /app/src/api/tsconfig.json ./src/api/

WORKDIR /app/src/api
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && pnpm run start:prod"]
