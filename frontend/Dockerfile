# syntax=docker/dockerfile:1

FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src src
COPY public public
COPY index.html .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist dist
RUN npm install -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
