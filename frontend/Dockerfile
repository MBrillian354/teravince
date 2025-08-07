# Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage (menggunakan nginx)
FROM nginx:alpine

# Copy build hasil vite ke nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (opsional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
