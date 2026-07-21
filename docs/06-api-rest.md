# 6. API REST

## 6.1 Objetivo

MyRecipes seguirá una arquitectura cliente-servidor donde toda la comunicación entre el frontend y el backend se realizará mediante una API REST.

El backend será el único responsable de la lógica de negocio y del acceso a la base de datos.

El frontend nunca accederá directamente a PostgreSQL y toda la información se intercambiará utilizando JSON.

La API será stateless y utilizará JWT para autenticar las peticiones de los usuarios.

La documentación técnica de todos los endpoints se generará automáticamente mediante OpenAPI.

---

# 6.2 Principios de diseño

La API se desarrollará siguiendo los siguientes principios.

- Recursos claramente identificables.
- Uso correcto de los verbos HTTP.
- URLs sencillas y predecibles.
- Respuestas consistentes.
- Separación entre entidades y DTOs.
- Validación de datos en el servidor.
- Autenticación mediante JWT.
- Versionado preparado para futuras ampliaciones.

---

# 6.3 Convenciones

## URL base

```
/api/v1
```

---

## Formato

Todas las peticiones y respuestas utilizarán JSON.

```
Content-Type: application/json
```

---

## Autenticación

Los endpoints protegidos requerirán el siguiente encabezado.

```
Authorization: Bearer <jwt>
```

---

## Códigos de respuesta

La API utilizará los códigos HTTP estándar.

| Código | Significado |
|---------|-------------|
| 200 | Operación correcta |
| 201 | Recurso creado |
| 204 | Sin contenido |
| 400 | Petición incorrecta |
| 401 | No autenticado |
| 403 | Acceso prohibido |
| 404 | Recurso no encontrado |
| 409 | Conflicto |
| 500 | Error interno |

---

# 6.4 Recursos principales

La API estará organizada en cuatro recursos principales.

```
Authentication

Users

Recipes

Recipe Versions
```

Cada recurso tendrá una responsabilidad claramente definida.

---

# 6.5 Autenticación

## Registro

```
POST /api/v1/auth/register
```

Permite crear una nueva cuenta de usuario.

---

## Inicio de sesión

```
POST /api/v1/auth/login
```

Devuelve un JWT válido para autenticarse en el resto de la aplicación.

---

## Usuario autenticado

```
GET /api/v1/auth/me
```

Devuelve la información del usuario autenticado.

---

# 6.6 Usuarios

## Obtener perfil

```
GET /api/v1/users/me
```

---

## Actualizar perfil

```
PUT /api/v1/users/me
```

---

## Eliminar cuenta

```
DELETE /api/v1/users/me
```

---

# 6.7 Recetas

La entidad **Recipe** representa únicamente la información general de una receta.

El contenido completo de la receta se encuentra en su versión actual.

## Obtener todas las recetas

```
GET /api/v1/recipes
```

Devuelve el listado de recetas del usuario autenticado.

---

## Obtener una receta

```
GET /api/v1/recipes/{id}
```

Devuelve únicamente los metadatos de la receta.

Ejemplo:

- id
- title
- description
- category
- currentVersionId
- createdAt
- updatedAt

---

## Crear receta

```
POST /api/v1/recipes
```

Crea una nueva receta junto con su primera versión.

---

## Actualizar receta

```
PUT /api/v1/recipes/{id}
```

Permite modificar únicamente la información propia de la receta.

No modifica ingredientes ni pasos.

---

## Eliminar receta

```
DELETE /api/v1/recipes/{id}
```

Elimina la receta junto con todas sus versiones.

---

# 6.8 Versiones de receta

Las versiones representan la evolución de una receta.

Cada versión almacena una fotografía completa de la receta en un momento determinado.

---

## Obtener la versión actual

```
GET /api/v1/recipes/{id}/current-version
```

Devuelve la versión actual completa de la receta, incluyendo:

- Ingredientes.
- Pasos.
- Fotografías.
- Notas.
- Valoración.
- Resumen de cambios.

---

## Obtener historial

```
GET /api/v1/recipes/{id}/versions
```

Devuelve todas las versiones de una receta ordenadas por número de versión.

---

## Obtener una versión concreta

```
GET /api/v1/recipes/{id}/versions/{versionId}
```

Devuelve todos los datos de una versión específica.

---

## Crear una nueva versión

```
POST /api/v1/recipes/{id}/versions
```

El frontend enviará la receta completa ya modificada.

El backend será responsable de:

- Crear una nueva versión.
- Incrementar el número de versión.
- Actualizar `currentVersionId`.
- Mantener intactas todas las versiones anteriores.

---

# 6.9 Fotografías

Las fotografías pertenecen siempre a una versión concreta de una receta.

## Añadir fotografía

```
POST /api/v1/recipes/{id}/versions/{versionId}/photos
```

---

## Eliminar fotografía

```
DELETE /api/v1/recipes/{id}/versions/{versionId}/photos/{photoId}
```

---

# 6.10 DTOs

La API nunca expondrá directamente las entidades JPA.

Toda la comunicación entre cliente y servidor se realizará mediante DTOs.

Esta decisión permite:

- Desacoplar la API del modelo interno.
- Evitar referencias circulares.
- Controlar la información expuesta.
- Evolucionar el dominio sin romper la API.

---

# 6.11 Validaciones

Toda la lógica de validación se ejecutará en el backend.

Entre otras:

- Nombre obligatorio.
- Al menos un ingrediente.
- Al menos un paso.
- Longitud máxima de textos.
- Valoración dentro del rango permitido.

Las respuestas de error seguirán un formato uniforme para facilitar su tratamiento desde el frontend.

---

# 6.12 Documentación

Toda la API estará documentada mediante OpenAPI.

Springdoc generará automáticamente la especificación y la interfaz Swagger UI durante el desarrollo.

Esto permitirá probar todos los endpoints sin necesidad de utilizar el frontend.

---

# 6.13 Evolución futura

La estructura de la API permitirá incorporar nuevos recursos sin modificar los existentes.

Entre las posibles ampliaciones se encuentran:

- Compartición de recetas.
- Comparación entre versiones.
- Restauración de versiones anteriores.
- Exportación de recetas.
- Estadísticas.
- Integración con IA.