FROM node:18-alpine
# Instalar pnpm globalmente en el sistema operativo del contenedor
RUN npm install -g pnpm
WORKDIR /app

# Copiar manifiestos y el archivo de bloqueo de pnpm si existe
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .
EXPOSE 3001

# Ejecución del servidor de desarrollo usando pnpm
CMD ["pnpm", "dev", "--", "-p", "3001"]
