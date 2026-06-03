FROM node:20-alpine

# Instalar pnpm globalmente en el contenedor
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de configuración e instalar dependencias con pnpm
COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
