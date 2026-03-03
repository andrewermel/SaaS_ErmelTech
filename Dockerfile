# 🟢 Node.js base image (versão LTS)
FROM node:20-alpine

# 📁 Define pasta de trabalho
WORKDIR /app/backend

# 📦 Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# 📦 Copia o código-fonte
COPY . .

# 🔧 Gera cliente Prisma
RUN npx prisma generate

# 📝 Copia script de inicialização
COPY entrypoint.sh /app/backend/entrypoint.sh
RUN chmod +x /app/backend/entrypoint.sh

# 🏃 Comando padrão - executa script que roda migrações e inicia servidor
CMD ["/app/backend/entrypoint.sh"]

# 📍 Expõe a porta do servidor
EXPOSE 3000
