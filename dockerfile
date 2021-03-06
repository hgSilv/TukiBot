# creamos una variable
ARG PORT=8080
# traemos la imagen de node 16 con kernel de alpine
FROM node:16-alpine
# label para agregar metadatos
LABEL autor="Tuki Dev Team"
# cremos el directorio de la app
WORKDIR /usr/src/app
# copiamos el archivo a nuestra carpeta 
COPY package*.json ./
# instalamos las dependencias
RUN npm install
# copiamos todo al directorio de trabajo
COPY . .
# exponemos el puero
EXPOSE ${PORT}
# corremos el comando para nuestra app
CMD [ "node", "chatMod.js" ]