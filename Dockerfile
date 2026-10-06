# Stage 1: build the site. Every page is prerendered to its own
# <route>/index.html in dist/.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# The contact form's endpoint is baked in at build time. .env is kept out of
# the build context (.dockerignore), so compose.yaml passes the value in here.
ARG VITE_CONTACT_ENDPOINT=

RUN npm run build

# Stage 2: serve dist/ with nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
