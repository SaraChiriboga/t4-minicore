#!/bin/sh
set -e

echo "=== Iniciando T4-Minicore API en Render ==="

# Ejecutar migraciones pendientes
echo "Ejecutando migraciones de base de datos..."
./bin/tasks db.migrate

# Ejecutar semillas de datos iniciales si no existen
echo "Verificando y aplicando datos iniciales..."
./bin/tasks db.seed.sample_data || true

# Iniciar el servidor web de Lucky
echo "Iniciando servidor web en el puerto ${PORT:-3000}..."
exec ./bin/app

