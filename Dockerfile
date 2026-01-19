# Use Node 20 base image
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate || npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install deps (prefer pnpm if lockfile present)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else npm install; fi

# Copy rest of the source
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:20-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app and dependencies from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Install a lightweight production server (Next.js default start)
RUN corepack enable || true

EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]
