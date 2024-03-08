FROM node:lts as builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM node:lts
COPY --from=builder /app/build /app
WORKDIR /app
EXPOSE 3000
CMD ["node", "app.js"]