# Backend - MyRecipes API

## Requisitos previos

- JDK 17
- Maven (o usa el wrapper `./mvnw` incluido en el proyecto, no hace falta instalarlo aparte)
- Una cuenta y proyecto en [Supabase](https://supabase.com) (o acceso al proyecto de desarrollo del equipo)

## Configuración del entorno

El backend no requiere ninguna infraestructura local (no hay Docker ni servicios que levantar): se conecta directamente a una instancia de PostgreSQL.

### Variables de entorno

La configuración se realiza mediante variables de entorno en `src/main/resources/application.properties`. Cada variable tiene un valor por defecto válido para desarrollo local:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DB_URL` | URL de conexión JDBC a PostgreSQL | `jdbc:postgresql://localhost:5432/recipes` |
| `DB_USERNAME` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `postgres` |
| `jwt.secret` | Clave secreta para JWT | valor por defecto para dev |
| `jwt.expiration` | Expiración del token en ms | `3600000` (1 hora) |

Para usar una base distinta (por ejemplo, la de Supabase), exporta las variables antes de arrancar:

```bash
export DB_URL="jdbc:postgresql://<host>:5432/postgres"
export DB_USERNAME="postgres"
export DB_PASSWORD="<password>"
```

### Esquema de base de datos

El proyecto **no usa Flyway todavía** (fase temprana, el modelo de datos aún cambia con frecuencia). El esquema se gestiona con Hibernate mediante:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Esto significa que Hibernate crea/actualiza tablas automáticamente al arrancar, pero **no elimina columnas obsoletas**. Si necesitas limpiar el esquema, hazlo manualmente contra tu base de datos.

Cuando el modelo de datos se estabilice, se migrará a Flyway (ver roadmap/ADRs en `docs/`).

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

- Comprueba en consola que Hibernate ha creado/actualizado las tablas sin errores.
- Llama a un endpoint básico (por ejemplo, el de crear o listar recetas) y confirma que responde correctamente.

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

Formato: `{ timestamp, status, error, message, path }`. 404 para receta inexistente, 400 para validaciones.