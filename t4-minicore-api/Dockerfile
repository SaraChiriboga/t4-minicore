FROM crystallang/crystal:1.20.0

WORKDIR /app

# Instalar cliente de PostgreSQL y utilidades de zona horaria
RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client tzdata ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Configurar zona horaria local (Ecuador UTC-5)
ENV TZ=America/Guayaquil

# Instalar shards de dependencias
COPY shard.yml shard.lock ./
RUN shards install --production --without-development

# Copiar el codigo fuente
COPY . ./

# Compilar binario de la aplicacion y de las tareas de migracion
RUN crystal build src/t4_minicore_api.cr --release --no-debug -o bin/app && \
    crystal build tasks.cr --release --no-debug -o bin/tasks

# Copiar y dar permisos al script de inicio
RUN chmod +x docker/start.sh bin/app bin/tasks

ENV LUCKY_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["docker/start.sh"]
