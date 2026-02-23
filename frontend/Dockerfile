# 🟢 Node.js base image
FROM node:20-alpine

# 📁 Define pasta de trabalho
WORKDIR /app

# 📦 Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# 📦 Copia o código-fonte
COPY . .

# 🚀 Comando para rodar em desenvolvimento com Vite
CMD ["npm", "run", "dev"]

# 📍 Expõe porta do frontend
EXPOSE 5173
