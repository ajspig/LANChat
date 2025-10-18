# Use Bun image
FROM oven/bun:1 as base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "src/server/index.ts"]
