FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instalamos dependencias incluyendo los tipos
RUN npm install && \
    npm install --save-dev @types/google.maps

COPY . .

RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]

