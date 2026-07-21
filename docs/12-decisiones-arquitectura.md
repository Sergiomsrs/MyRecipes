# 12. Decisiones de arquitectura (ADR)

## 12.1 Objetivo

Este documento recoge las principales decisiones de arquitectura tomadas durante el diseño de MyRecipes.

Su objetivo es explicar el razonamiento detrás de cada decisión, las alternativas consideradas y los motivos por los que finalmente se eligió una determinada solución.

Las decisiones descritas en este documento podrán revisarse en el futuro si cambian los requisitos del proyecto.

---

# ADR-001
## Spring Boot como backend

### Estado

Aceptada.

### Contexto

La aplicación necesita una API REST que gestione la autenticación, la lógica de negocio, el acceso a la base de datos y el almacenamiento de las recetas.

Se valoró utilizar directamente Supabase como Backend as a Service (BaaS), eliminando la necesidad de desarrollar un backend propio.

### Alternativas consideradas

- Supabase como backend completo.
- Node.js + Express.
- Spring Boot.

### Decisión

Se utilizará Spring Boot.

### Motivos

- Permite desarrollar una arquitectura backend completa.
- Se ajusta al objetivo formativo del proyecto.
- Facilita la implementación de reglas de negocio complejas.
- Permite aplicar buenas prácticas habituales en aplicaciones empresariales.
- Refuerza el perfil profesional como desarrollador Java.

---

# ADR-002
## React como frontend

### Estado

Aceptada.

### Contexto

Se necesita una aplicación web moderna que consuma la API REST.

### Alternativas consideradas

- Angular.
- Vue.
- React.

### Decisión

React.

### Motivos

- Amplia adopción en el mercado.
- Excelente integración con TypeScript.
- Ecosistema maduro.
- Experiencia previa con la tecnología.
- Ideal para aplicaciones SPA.

---

# ADR-003
## Java 17 como versión de Java

### Estado

Aceptada.

### Contexto

Spring Boot soporta varias versiones de Java.

### Alternativas consideradas

- Java 21.
- Java 17.

### Decisión

Java 17.

### Motivos

- Es una versión LTS.
- Gran adopción en entornos empresariales.
- Excelente compatibilidad con Spring Boot.
- Mayor probabilidad de coincidir con el entorno utilizado por las empresas.

---

# ADR-004
## PostgreSQL como base de datos

### Estado

Aceptada.

### Contexto

La aplicación necesita una base de datos relacional.

### Alternativas consideradas

- MySQL.
- PostgreSQL.
- MariaDB.

### Decisión

PostgreSQL.

### Motivos

- Excelente integración con Supabase.
- Gran rendimiento.
- Amplio soporte de funcionalidades SQL.
- Muy utilizada en proyectos modernos.

---

# ADR-005
## Versionado completo de recetas

### Estado

Aceptada.

### Contexto

La principal característica de la aplicación consiste en conservar la evolución de una receta.

Se estudiaron distintas formas de almacenar el historial.

### Alternativas consideradas

- Sobrescribir la receta.
- Guardar únicamente las diferencias.
- Almacenar versiones completas.

### Decisión

Cada modificación generará una copia completa de la receta.

### Motivos

- Modelo mucho más sencillo.
- Historial completamente inmutable.
- Consultas muy simples.
- Recuperación inmediata de cualquier versión.
- La duplicación de información es asumible para este tipo de aplicación.

---

# ADR-006
## Una receta mantiene una referencia a la versión actual

### Estado

Aceptada.

### Contexto

Era necesario decidir cómo identificar la versión vigente de una receta.

### Alternativas consideradas

- Calcular siempre la última versión.
- Añadir un indicador de versión activa.
- Mantener un campo currentVersionId.

### Decisión

La entidad Recipe almacenará currentVersionId.

### Motivos

- Consultas mucho más rápidas.
- Modelo sencillo.
- Facilita el acceso a la versión actual.
- Evita cálculos innecesarios.

---

# ADR-007
## Organización del repositorio

### Estado

Aceptada.

### Contexto

Frontend y backend evolucionarán de forma independiente.

### Alternativas consideradas

- Dos repositorios.
- Monorepo.

### Decisión

Monorepo.

### Motivos

- Un único punto de entrada al proyecto.
- Documentación centralizada.
- Gestión más sencilla.
- Ideal para un proyecto de portfolio.

---

# ADR-008
## Arquitectura REST

### Estado

Aceptada.

### Contexto

Era necesario definir cómo se comunicarían frontend y backend.

### Alternativas consideradas

- GraphQL.
- REST.

### Decisión

REST.

### Motivos

- Simplicidad.
- Amplia adopción.
- Excelente integración con Spring Boot.
- Suficiente para las necesidades del proyecto.

---

# ADR-009
## Autenticación mediante JWT

### Estado

Aceptada.

### Contexto

La aplicación requiere autenticar usuarios.

### Alternativas consideradas

- Sesiones tradicionales.
- JWT.

### Decisión

JWT.

### Motivos

- Arquitectura stateless.
- Ideal para APIs REST.
- Fácil integración con Spring Security.
- Escalable.

---

# ADR-010
## Despliegue del backend en un VPS

### Estado

Aceptada.

### Contexto

Era necesario decidir dónde publicar la API REST.

### Alternativas consideradas

- Render.
- Railway.
- VPS.

### Decisión

Servidor VPS con Ubuntu.

### Motivos

- Aprendizaje de administración de servidores.
- Configuración manual del entorno.
- Uso de Nginx.
- Gestión de servicios Linux.
- Mayor control sobre la infraestructura.

---

# ADR-011
## GitHub Pages para el frontend

### Estado

Aceptada.

### Contexto

El frontend es una SPA estática.

### Alternativas consideradas

- Vercel.
- Netlify.
- GitHub Pages.

### Decisión

GitHub Pages.

### Motivos

- Ya utilizado en otros proyectos.
- Integración con GitHub.
- Hosting gratuito.
- Fácil mantenimiento.
- Posibilidad de asociar un dominio propio.

---

# ADR-012
## Organización del frontend por funcionalidades

### Estado

Aceptada.

### Contexto

Era necesario definir la estructura del proyecto React.

### Alternativas consideradas

- Organización por tipo de archivo.
- Organización por funcionalidades.

### Decisión

Arquitectura Feature First.

### Motivos

- Mayor escalabilidad.
- Mejor mantenimiento.
- Mejor encapsulación.
- Facilita el crecimiento del proyecto.

---

# ADR-013
## No utilizar Redux

### Estado

Aceptada.

### Contexto

La aplicación necesita gestionar estado local y remoto.

### Alternativas consideradas

- Redux.
- TanStack Query + Context API.

### Decisión

TanStack Query y Context API.

### Motivos

- Menor complejidad.
- Excelente gestión del estado del servidor.
- Menos código.
- Arquitectura más sencilla.

---

# ADR-014
## DTOs en lugar de exponer entidades JPA

### Estado

Aceptada.

### Contexto

Era necesario definir cómo intercambiar información entre backend y frontend.

### Alternativas consideradas

- Exponer entidades.
- Utilizar DTOs.

### Decisión

DTOs.

### Motivos

- Desacoplamiento.
- Mayor seguridad.
- API más estable.
- Evolución independiente del dominio.

---

# ADR-015
## Documentar antes de desarrollar

### Estado

Aceptada.

### Contexto

Antes de comenzar la implementación se decidió dedicar tiempo a definir el producto, la arquitectura y las decisiones técnicas.

### Alternativas consideradas

- Comenzar directamente a programar.
- Diseñar previamente el proyecto.

### Decisión

Documentar primero.

### Motivos

- Reduce cambios durante el desarrollo.
- Permite validar el diseño antes de escribir código.
- Facilita mantener una visión global del proyecto.
- Simula el proceso seguido en equipos de desarrollo profesionales.