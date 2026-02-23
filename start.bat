@echo off
REM 🐳 Script de Inicialização do ErmelTech SaaS com Docker para Windows
REM Uso: start.bat

cls
echo ==================================
echo 🐳 Iniciando ErmelTech SaaS com Docker
echo ==================================
echo.

REM 1. Verificar se Docker está instalado
echo 🔍 Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está instalado!
    pause
    exit /b 1
)
echo ✅ Docker encontrado
echo.

REM 2. Verificar se Docker Compose está instalado
echo 🔍 Verificando Docker Compose...
docker compose version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose não está instalado!
    pause
    exit /b 1
)
echo ✅ Docker Compose encontrado
echo.

REM 3. Construir as imagens
echo 🔨 Construindo imagens Docker (primeira vez demora mais)...
docker compose build
if errorlevel 1 (
    echo ❌ Erro ao construir imagens!
    pause
    exit /b 1
)
echo ✅ Imagens construídas com sucesso!
echo.

REM 4. Iniciar tudo
echo 🚀 Iniciando containers...
docker compose up

echo.
echo ==================================
echo ✨ Tudo pronto!
echo ==================================
echo.
echo Aplicação rodando em:
echo   🎨 Frontend: http://localhost:5173
echo   🔙 Backend:  http://localhost:3000
echo   🐘 BD:       localhost:5432
echo.
echo Pressione CTRL+C para parar
echo.
pause
