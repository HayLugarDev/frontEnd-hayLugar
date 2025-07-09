# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuraci¢n y dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del c¢digo fuente
COPY . .

# Expone el puerto en el que se ejecutar  la aplicaci¢n
EXPOSE 5173

# Comando para iniciar la aplicaci¢n
CMD ["npm", "run", "dev"]