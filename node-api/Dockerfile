# 1. Definimos la imagen base de Node.js
FROM node:20-alpine

# 2. Creamos y establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias de Node
RUN npm install

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Exponemos el puerto interno de la app
EXPOSE 3000

# 7. Comando para iniciar la aplicación
CMD ["npm", "start"]
