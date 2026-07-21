# MyRecipes

> **Las mejores recetas no nacen perfectas. Evolucionan.**

MyRecipes es una aplicación web diseñada para ayudarte a conservar, mejorar y perfeccionar tus propias recetas mediante un sistema de versiones.

A diferencia de la mayoría de aplicaciones de recetas, MyRecipes no pretende ser un repositorio donde copiar recetas de Internet.

Su objetivo es ayudarte a documentar tu propia experiencia en la cocina.

Cada vez que cocinas una receta puedes registrar qué has cambiado, cómo ha salido y conservar esa versión para siempre.

Porque cocinar no consiste únicamente en seguir una receta.

Consiste en aprender, experimentar e iterar.

---

## ¿Por qué MyRecipes?

Seguro que alguna vez te ha pasado algo parecido.

- "La última vez la tortilla salió perfecta, pero no recuerdo qué cambié."
- "Las lentejas de mi madre nunca me salen igual."
- "La lasaña de mi abuela era espectacular y solo tengo una receta escrita que no sabe igual."

La realidad es que cocinar no consiste únicamente en seguir una lista de ingredientes.

Pequeños cambios como el tiempo de cocción, una marca distinta de tomate o una especia diferente pueden cambiar completamente el resultado.

MyRecipes permite conservar toda esa experiencia para que nunca vuelvas a perder tu mejor versión de una receta.

---

# Características principales

## Gestión de recetas

- Crear recetas.
- Editar información general.
- Organizar ingredientes y pasos.
- Eliminar recetas.

## Versionado de recetas

La característica principal del proyecto.

Cada vez que mejoras una receta:

- Se crea una nueva versión.
- La versión anterior permanece intacta.
- Puedes consultar el historial completo.
- Siempre sabes cuál es la versión actual.

---

## Fotografías

Cada versión puede incluir fotografías del resultado obtenido.

Así podrás comparar visualmente la evolución de la receta.

---

## Historial

Cada receta conserva todas las versiones creadas.

Nunca perderás una mejora realizada anteriormente.

---

# Tecnologías

## Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query

## Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT

## Base de datos

- PostgreSQL (Supabase)

## Almacenamiento

- Supabase Storage

---

# Arquitectura

```
React

↓

Spring Boot

↓

PostgreSQL

↓

Supabase Storage
```

Toda la lógica de negocio reside en el backend.

El frontend consume exclusivamente la API REST.

---

# Estado del proyecto

Actualmente el proyecto se encuentra en fase de desarrollo.

En este momento ya se ha completado:

- Diseño funcional.
- Arquitectura.
- Modelo de datos.
- Diseño de la API REST.
- Estrategia de seguridad.
- Estrategia de testing.
- Infraestructura de despliegue.

El siguiente paso será comenzar la implementación del backend y del frontend.

---

# Documentación

Toda la documentación del proyecto puede consultarse en la carpeta [`docs`](./docs).

Incluye:

- Introducción.
- Objetivos.
- Arquitectura.
- Tecnologías.
- Modelo de datos.
- API REST.
- Diseño funcional.
- Seguridad.
- Testing.
- Infraestructura y despliegue.
- Roadmap.
- Decisiones de arquitectura (ADR).

---

# Estructura del proyecto

```
myrecipes/

├── frontend/
├── backend/
└── docs/
```

---

# Despliegue

## Frontend

GitHub Pages

## Backend

Servidor VPS Ubuntu (Ionos)

## Base de datos

Supabase PostgreSQL

## Almacenamiento de imágenes

Supabase Storage

---

# Roadmap

Versión 1.0

- Autenticación.
- Gestión de recetas.
- Sistema de versiones.
- Historial.
- Fotografías.
- Despliegue.

Las futuras versiones incorporarán mejoras como:

- Etiquetas.
- Comparación entre versiones.
- Compartir recetas.
- Exportación.
- Inteligencia artificial.

---

# ¿Por qué este proyecto?

Este proyecto forma parte de mi portfolio como desarrollador de software.

Además de construir una aplicación útil, el objetivo es aplicar prácticas habituales en el desarrollo profesional, como:

- Arquitectura por capas.
- Diseño previo a la implementación.
- API REST.
- Documentación técnica.
- Testing.
- Seguridad.
- Control de versiones.
- Despliegue en producción.

---
