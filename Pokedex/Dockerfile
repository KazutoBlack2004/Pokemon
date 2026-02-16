# Usamos una imagen ligera de Node
FROM node:20-alpine

# Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json primero
# Así Docker puede cachear las dependencias si no cambian
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Exponemos el puerto que usa Vite por defecto
EXPOSE 5173

# Ejecutamos Vite en modo desarrollo
# --host es importante para que sea accesible fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]
