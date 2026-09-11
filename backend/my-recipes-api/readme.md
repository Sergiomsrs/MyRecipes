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

> **Nota sobre autenticación**: de momento no hay Spring Security ni JWT. Las peticiones identifican al usuario mediante el campo `userId` (uuid) que ya envían los DTOs. Se integrará la autenticación real en un paso posterior.

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

Base URL: `http://localhost:8080` · Prefijo: `/api/v1/recipes` · Sin autenticación · `Content-Type: application/json`

| Método | Ruta | Params/Query | Descripción |
|---|---|---|---|
| GET | `/api/v1/recipes` | `userId` (UUID, query) | Lista recetas del usuario |
| GET | `/api/v1/recipes/{id}` | `userId` (UUID, query) | Detalle de una receta |
| POST | `/api/v1/recipes` | body | Crear receta (con ingredientes, pasos, fotos) |
| PUT | `/api/v1/recipes/{id}` | body | Actualizar receta |
| GET | `/api/v1/recipes/{id}/versions/current` | `userId` (UUID, query) | Versión actual (ingredientes, pasos, fotos) |
| DELETE | `/api/v1/recipes/{id}` | `userId` (UUID, query) | Eliminar receta → 204 |

### Categorías

El campo `category` acepta uno de estos valores: `STARTER`, `MAIN_COURSE`, `DESSERT`, `DRINK`, `SAUCE`, `OTHER`.

### Ejemplos para Postman

**1. Crear receta (POST `/api/v1/recipes`) → 201**
```json
{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
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

**2. Listar (GET `/api/v1/recipes?userId=550e8400-e29b-41d4-a716-446655440000`) → 200**

Devuelve un array con objetos: `{ id, userId, title, description, category, currentVersionId, createdAt, updatedAt }`

**3. Detalle (GET `/api/v1/recipes/{id}?userId=...`) → 200**

Devuelve la versión actual completa: `{ id, recipeId, versionNumber, summaryChanges, notes, rating, createdAt, ingredients[], steps[], photos[] }`

**4. Actualizar (PUT `/api/v1/recipes/{id}`) → 200**
```json
{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Carbonara clásica",
    "description": "Receta tradicional romana",
    "category": "MAIN_COURSE"
}
```

**5. Eliminar (DELETE `/api/v1/recipes/{id}?userId=...`) → 204** (sin body)

**6. Versión actual (GET `/api/v1/recipes/{id}/versions/current?userId=...`) → 200**

Devuelve la versión actual completa: `{ id, recipeId, versionNumber, summaryChanges, notes, rating, createdAt, ingredients[], steps[], photos[] }`.

### Validaciones del body

- `userId`: obligatorio, UUID
- `title`: obligatorio, máx 150 · `description`: máx 1000 · `notes`: máx 1000 · `summaryChanges`: máx 500
- `rating`: entre 1 y 10
- `ingredients` (mín 1): `name` máx 150, `quantity` decimal obligatorio, `unit` máx 50, `orderIndex` int obligatorio
- `steps` (mín 1): `order` int obligatorio, `description` máx 2000
- `photos` (opcional): `url` máx 1000 obligatorio, `caption` máx 255

### Errores

Formato: `{ timestamp, status, error, message, path }`. 404 para receta inexistente, 400 para validaciones.