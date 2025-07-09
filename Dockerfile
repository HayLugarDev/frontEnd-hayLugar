# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos package.json y lock
COPY package*.json ./

RUN npm install && \
    npm install --save @googlemaps/markerclusterer@^1.0.6 && \
    npm install --save-dev @types/google.maps
    
# Copiamos el resto del proyecto
COPY . .

# Build del frontend
RUN npm run build

# Etapa final con nginx
FROM nginx:alpine AS runner

# Copiamos el build al directorio estático de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos una configuración custom si la tenés
COPY nginx.conf /etc/nginx/nginx.conf

# Exponemos el puerto típico HTTP
EXPOSE 5371

# Iniciamos nginx
CMD ["nginx", "-g", "daemon off;"]
