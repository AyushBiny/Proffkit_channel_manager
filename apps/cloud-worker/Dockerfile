FROM mcr.microsoft.com/playwright:v1.48.0-noble
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . .
RUN pnpm install --frozen-lockfile
CMD ["pnpm", "--filter", "@proffkit/cloud-worker", "start"]
