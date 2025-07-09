FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Servidor estático NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Reemplaza configuración si tenés un nginx.conf personalizado:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
