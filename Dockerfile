# The platform as one self-contained image: it runs on any container host, with
# nothing outside it but GitHub (ADR 0007, 0014). One server, one address: the
# API under /api/, the application's files everywhere else (ADR 0016).
FROM node:22-alpine AS base
RUN corepack enable pnpm

FROM base AS build
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/domain/package.json packages/domain/
COPY packages/adapters/github/package.json packages/adapters/github/
COPY packages/adapters/mock/package.json packages/adapters/mock/
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY . .
# Built without CLAREE_ADAPTERS: the real adapters, and no mock in the image (ADR 0012).
RUN pnpm --filter @claree/web build && pnpm --filter @claree/server build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
# The server is bundled into one file, so the image needs no node_modules.
COPY --from=build /repo/apps/server/dist/main.js ./server.js
COPY --from=build /repo/apps/web/dist ./web
USER node
EXPOSE 3000
ENV PORT=3000 CLAREE_WEB=./web
CMD ["node", "server.js"]
