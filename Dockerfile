# Stage 1: Build
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:1.3-alpine
WORKDIR /app
COPY --from=builder /app/dist/index.js ./index.js
EXPOSE 3000
CMD ["bun", "run", "index.js"]
