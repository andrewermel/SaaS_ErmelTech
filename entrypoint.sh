#!/bin/sh
set -e

echo "⏳ Aguardando banco de dados..."
sleep 10

echo "🔄 Executando migrações..."
npx prisma migrate deploy

echo "✅ Migrações concluídas!"
echo "🚀 Iniciando servidor..."
npm run dev
