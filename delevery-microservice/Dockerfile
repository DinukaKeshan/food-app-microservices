# ─── Stage 1: Build / Install Dependencies ───────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only dependency manifests first (layer caching)
COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

# ─── Stage 2: Production Image ────────────────────────────────────────────────
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S delivery -u 1001

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps --chown=delivery:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=delivery:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown delivery:nodejs logs

# Switch to non-root user
USER delivery

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

# Start server
CMD ["node", "server.js"]
