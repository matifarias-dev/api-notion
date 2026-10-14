FROM node:23.11.0-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:23.11.0-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "build/app.js"]