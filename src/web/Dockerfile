FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod-deps
WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-validation/package.json ./packages/shared-validation/
COPY src/web/package.json ./src/web/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-validation/package.json ./packages/shared-validation/
COPY src/web/package.json ./src/web/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY packages/shared-validation ./packages/shared-validation
COPY src/web ./src/web

RUN pnpm --filter @flow-forge/shared-validation build

WORKDIR /app/src/web
RUN pnpm run build

FROM node:22-slim AS runtime
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/packages/shared-validation ./packages/shared-validation
COPY --from=build /app/src/web/build ./src/web/build
COPY package.json ./

WORKDIR /app/src/web
ENV PORT=3030

EXPOSE 3030
CMD ["npx", "--no-install", "react-router-serve", "./build/server/index.js"]
