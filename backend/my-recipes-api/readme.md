# Backend - MyRecipes API

## Requisitos previos

- JDK 17
- Maven (o usa el wrapper `./mvnw` incluido en el proyecto, no hace falta instalarlo aparte)
- Una cuenta y proyecto en [Supabase](https://supabase.com) (o acceso al proyecto de desarrollo del equipo)

## Configuración del entorno

El backend no requiere ninguna infraestructura local (no hay Docker ni servicios que levantar): se conecta directamente a la instancia de PostgreSQL gestionada por Supabase.

### Variables de entorno

Copia el archivo de ejemplo y rellénalo con tus propios valores:

```bash
cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml
```

Variables necesarias:

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `DB_URL` | URL de conexión JDBC a PostgreSQL | Panel de Supabase → Project Settings → Database → Connection string (modo JDBC) |
| `DB_USERNAME` | Usuario de la base de datos | Panel de Supabase → Project Settings → Database |
| `DB_PASSWORD` | Contraseña de la base de datos | Panel de Supabase → Project Settings → Database |
| `JWT_SECRET` | Clave para firmar los JWT | Generar una cadena aleatoria segura (mínimo 256 bits) |
| `SUPABASE_STORAGE_URL` | URL del bucket de Supabase Storage | Panel de Supabase → Storage |
| `SUPABASE_STORAGE_KEY` | API key de Supabase Storage | Panel de Supabase → Project Settings → API |

### Esquema de base de datos

El proyecto **no usa Flyway todavía** (fase temprana, el modelo de datos aún cambia con frecuencia). El esquema se gestiona con Hibernate mediante:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

Esto significa que Hibernate crea/actualiza tablas automáticamente al arrancar, pero **no elimina columnas obsoletas**. Si necesitas limpiar el esquema, hazlo manualmente contra la base de Supabase de desarrollo.

Cuando el modelo de datos se estabilice, se migrará a Flyway (ver roadmap/ADRs en `docs/`).

## Cómo arrancar el backend

```bash
cd backend/my-recipes-api
./mvnw spring-boot:run
```

Por defecto arrancará en `http://localhost:8080`.

## Verificar que funciona

- Comprueba en consola que Hibernate ha creado/actualizado las tablas sin errores.
- Llama a un endpoint básico (por ejemplo, un health-check o el de listar recetas) y confirma que responde 200.