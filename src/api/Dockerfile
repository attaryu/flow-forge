FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod-deps
WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-validation/package.json ./packages/shared-validation/
COPY src/api/package.json ./src/api/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-validation/package.json ./packages/shared-validation/
COPY src/api/package.json ./src/api/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY packages/shared-validation ./packages/shared-validation
COPY src/api ./src/api

RUN pnpm --filter @flow-forge/shared-validation build

WORKDIR /app/src/api

RUN npx prisma generate
RUN pnpm run build

FROM node:22-slim AS runtime
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/packages/shared-validation ./packages/shared-validation
COPY --from=build /app/src/api/dist ./src/api/dist
COPY --from=build /app/src/api/prisma ./src/api/prisma
COPY --from=build /app/src/api/prisma.config.ts ./src/api/prisma.config.ts
COPY package.json ./

WORKDIR /app/src/api
RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main"]
