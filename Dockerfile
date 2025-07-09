# Imagen base oficial de Node con soporte para TypeScript
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto (ajustalo si usás otro)
EXPOSE 3000

# Compila TypeScript a JS
RUN npm run build || true

# Comando para desarrollo con ts-node-dev
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]