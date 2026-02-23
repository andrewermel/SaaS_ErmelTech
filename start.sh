#!/bin/bash

# 🐳 Script de Inicialização do ErmelTech SaaS com Docker
# Uso: bash start.sh

echo "=================================="
echo "🐳 Iniciando ErmelTech SaaS com Docker"
echo "=================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar se Docker está instalado
echo "🔍 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker encontrado${NC}"
echo ""

# 2. Verificar se Docker Compose está instalado
echo "🔍 Verificando Docker Compose..."
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose encontrado${NC}"
echo ""

# 3. Construir as imagens
echo "🔨 Construindo imagens Docker (primeira vez demora mais)..."
docker compose build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao construir imagens!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Imagens construídas com sucesso!${NC}"
echo ""

# 4. Iniciar tudo
echo "🚀 Iniciando containers..."
docker compose up

echo ""
echo "=================================="
echo "✨ Tudo pronto!"
echo "=================================="
echo ""
echo -e "${GREEN}Aplicação rodando em:${NC}"
echo "  🎨 Frontend: http://localhost:5173"
echo "  🔙 Backend:  http://localhost:3000"
echo "  🐘 BD:       localhost:5432"
echo ""
echo -e "${YELLOW}Pressione CTRL+C para parar${NC}"
