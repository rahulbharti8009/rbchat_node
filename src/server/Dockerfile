# ---- Base image ----
FROM node:18-alpine

# ---- App directory ----
WORKDIR /app

# ---- Install dependencies first (better caching) ----
COPY package.json package-lock.json ./
RUN npm ci --only=production

# ---- Copy source code ----
COPY . .

# ---- Expose API port ----
EXPOSE 5000

# ---- Start server ----
CMD ["node", "src/index.js"]
