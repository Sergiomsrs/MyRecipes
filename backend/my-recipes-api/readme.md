# Backend - MyRecipes API

## Requisitos previos

- JDK 17
- Maven (o usa el wrapper `./mvnw` incluido en el proyecto, no hace falta instalarlo aparte)
- Una cuenta y proyecto en [Supabase](https://supabase.com) (o acceso al proyecto de desarrollo del equipo)

## Configuración del entorno

El backend no requiere ninguna infraestructura local (no hay Docker ni servicios que levantar): se conecta directamente a una instancia de PostgreSQL.

### Variables de entorno

La configuración se lee de variables de entorno (ver `.env.example`). Las variables sin valor por defecto son **obligatorias**: si faltan, la aplicación no arranca.

| Variable | Descripción | Por defecto |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL (Supabase) | — (obligatoria) |
| `DB_PORT` | Puerto (5432 sesión / 6543 pooler de Supabase) | — (obligatoria) |
| `DB_NAME` | Nombre de la base de datos | — (obligatoria) |
| `DB_USERNAME` | Usuario de la base de datos | — (obligatoria) |
| `DB_PASSWORD` | Contraseña de la base de datos | — (obligatoria) |
| `DB_POOL_SIZE` | Tamaño del pool Hikari | `5` |
| `JWT_SECRET` | Clave secreta JWT, mínimo 32 bytes (`openssl rand -base64 48`) | — (obligatoria) |
| `JWT_EXPIRATION` | Expiración del token en ms | `3600000` (1 hora) |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos, separados por coma (sin path ni `/` final) | `http://localhost:5173,http://localhost:4200,https://sergiomsrs.github.io` |
| `LOG_LEVEL_ROOT` / `LOG_LEVEL_APP` | Nivel de logging | `INFO` |
| `RATE_LIMIT_AUTH_ENABLED` / `RATE_LIMIT_AUTH_LIMIT` / `RATE_LIMIT_AUTH_WINDOW_MS` | Rate limit de `/api/auth/**` (10 peticiones/min por IP) | `true` / `10` / `60000` |

Para desarrollo local, exporta las variables antes de arrancar:

```bash
export DB_HOST="db.xxxx.supabase.co"
export DB_PORT="5432"
export DB_NAME="postgres"
export DB_USERNAME="postgres"
export DB_PASSWORD="<password>"
export JWT_SECRET="$(openssl rand -base64 48)"
```

### Esquema de base de datos

El esquema se gestiona **manualmente** sobre Supabase: `spring.jpa.hibernate.ddl-auto=none`, así que la aplicación **no crea ni modifica tablas al arrancar**.

- Si cambias una entidad, aplica el cambio con SQL en el editor de Supabase.
- Para comprobar que el esquema coincide con las entidades, ejecuta `docs/verify-schema.sql` en el SQL Editor (solo lectura).
- Cuando el modelo se estabilice, se migrará a Flyway (ver roadmap/ADRs en `docs/`).

## Autenticación

El backend incluye Spring Security con JWT. Los endpoints de recetas y usuarios requieren un header `Authorization: Bearer <token>`.

Los endpoints de autenticación (`/api/auth/**`) son públicos.

## Cómo arrancar el backend

```bash
cd backend/my-recipes-api
./mvnw spring-boot:run
```

Por defecto arrancará en `http://localhost:8080`.

## Verificar que funciona

- Llama a `GET /health` (público): devuelve `{"status":"UP"}` si la BD responde, `503` si no.
- Registra un usuario y haz login: `POST /api/auth/register` → `POST /api/auth/login`.
- Con el token, lista tus recetas: `GET /api/v1/recipes`.

## Despliegue (Dokploy)

- **Imagen**: `Dockerfile` multi-etapa; expone el puerto `8080` e incluye un `HEALTHCHECK` contra `/actuator/health`.
- **Healthcheck en Dokploy**: ruta `/health` o `/actuator/health` (ambos públicos; comprueban la conexión a la BD).
- **Variables**: configurar en Dokploy las de `.env.example`. Las que ya estén dadas de alta no cambian de nombre.
- **HTTPS**: Traefik de Dokploy se encarga del TLS; `server.forward-headers-strategy=framework` está activo para que la app conozca el esquema real.
- **Supabase**: `sslmode=require` está fijado en la URL JDBC. Usa el pooler de Supabase (`DB_PORT=6543` en modo transacción) o el modo sesión (`5432`), nunca el directo desde un VPS.
- **Rate limit**: `/api/auth/**` limita a 10 peticiones por minuto y IP (configurable).

## API - Endpoints

### Autenticación (públicos)

Base URL: `http://localhost:8080` · Prefijo: `/api/auth` · `Content-Type: application/json`

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password }` | Registrar usuario → token + role + userId |
| POST | `/api/auth/login` | `{ email, password }` | Iniciar sesión → token + role + userId |

### Usuarios (requieren JWT)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/api/users/me` | — | Obtener perfil del usuario autenticado |
| PUT | `/api/users/me/password` | `{ currentPassword, newPassword }` | Cambiar contraseña |

### Recetas (requieren JWT)

Base URL: `http://localhost:8080` · Prefijo: `/api/v1/recipes` · `Content-Type: application/json`

El `userId` se obtiene automáticamente del token JWT.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/recipes` | Listar recetas del usuario |
| GET | `/api/v1/recipes/{id}` | Detalle de una receta |
| POST | `/api/v1/recipes` | Crear receta (con ingredientes, pasos, fotos) |
| PUT | `/api/v1/recipes/{id}` | Actualizar receta |
| DELETE | `/api/v1/recipes/{id}` | Eliminar receta → 204 |
| GET | `/api/v1/recipes/{id}/versions/current` | Versión actual |

### Categorías

El campo `category` acepta uno de estos valores: `STARTER`, `MAIN_COURSE`, `DESSERT`, `DRINK`, `SAUCE`, `OTHER`.

### Ejemplos para Postman

**1. Registrar usuario (POST `/api/auth/register`) → 200**
```json
{
    "email": "test@email.com",
    "password": "password123"
}
```

**2. Iniciar sesión (POST `/api/auth/login`) → 200**
```json
{
    "email": "test@email.com",
    "password": "password123"
}
```

Respuesta: `{ "token": "eyJhbGci...", "role": "USER", "userId": "uuid" }`

A partir de aquí, todas las peticiones requieren el header:
```
Authorization: Bearer eyJhbGci...
```

**3. Obtener perfil (GET `/api/users/me`) → 200**

**4. Crear receta (POST `/api/v1/recipes`) → 201**
```json
{
    "title": "Spaghetti a la carbonara",
    "description": "Pasta con salsa de huevo, queso y panceta",
    "category": "MAIN_COURSE",
    "summaryChanges": "Versión inicial",
    "notes": "Servir bien caliente",
    "rating": 9,
    "ingredients": [
        { "name": "Spaghetti", "quantity": 500, "unit": "g", "orderIndex": 1 },
        { "name": "Panceta", "quantity": 200, "unit": "g", "orderIndex": 2 }
    ],
    "steps": [
        { "order": 1, "description": "Hervir el agua y cocinar la pasta" },
        { "order": 2, "description": "Saltear la panceta y mezclar con la salsa" }
    ],
    "photos": [
        { "url": "https://ejemplo.com/plato.jpg", "caption": "Plato servido" }
    ]
}
```

**5. Listar (GET `/api/v1/recipes`) → 200**

**6. Actualizar (PUT `/api/v1/recipes/{id}`) → 200**
```json
{
    "title": "Carbonara clásica",
    "description": "Receta tradicional romana",
    "category": "MAIN_COURSE"
}
```

**7. Eliminar (DELETE `/api/v1/recipes/{id}`) → 204** (sin body)

**8. Versión actual (GET `/api/v1/recipes/{id}/versions/current`) → 200**

### Validaciones del body

- `title`: obligatorio, máx 150 · `description`: máx 1000 · `notes`: máx 1000 · `summaryChanges`: máx 500
- `rating`: entre 1 y 10
- `ingredients` (mín 1): `name` máx 150, `quantity` decimal obligatorio, `unit` máx 50, `orderIndex` int obligatorio
- `steps` (mín 1): `order` int obligatorio, `description` máx 2000
- `photos` (opcional): `url` máx 1000 obligatorio, `caption` máx 255
- El `userId` se obtiene del token JWT, no se envía en el body

### Errores

Formato: `{ timestamp, status, error, message, path }`.

| Código | Cuándo |
|---|---|
| `400` | Validación de campos, cuerpo malformado, email ya registrado |
| `401` | Token ausente, expirado o malformado; credenciales incorrectas |
| `403` | Usuario autenticado sin permiso sobre el recurso |
| `404` | Receta/versión inexistente, de otro usuario, o endpoint inexistente |
| `405` | Método HTTP no soportado por el endpoint |
| `406` | Cabecera `Accept` no soportada |
| `415` | Cabecera `Content-Type` distinta de `application/json` |
| `429` | Rate limit superado en `/api/auth/**` (cabecera `Retry-After`) |
| `500` | Error no controlado (se registra con stacktrace en los logs) |