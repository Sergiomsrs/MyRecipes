# 4. Tecnologías

## 4.1 Objetivo

La selección de tecnologías para MyRecipes se ha realizado siguiendo tres principios fundamentales:

- Utilizar herramientas ampliamente adoptadas en entornos profesionales.
- Priorizar la simplicidad frente a soluciones innecesariamente complejas.
- Construir una arquitectura fácilmente mantenible y escalable.

El objetivo no es utilizar el mayor número posible de tecnologías, sino escoger aquellas que mejor se adapten a las necesidades del proyecto.

---

# 4.2 Stack tecnológico

| Área | Tecnología |
|-------|------------|
| Lenguaje Backend | Java 17 |
| Framework Backend | Spring Boot 3 |
| Persistencia | Spring Data JPA |
| Base de datos | PostgreSQL |
| Migraciones | Flyway |
| Seguridad | Spring Security + JWT |
| Documentación API | Springdoc OpenAPI |
| Build Backend | Maven |
| Frontend | React |
| Lenguaje Frontend | TypeScript |
| Bundler | Vite |
| Estilos | Tailwind CSS |
| Cliente HTTP | Axios |
| Gestión de estado servidor | TanStack Query |
| Routing | React Router |
| Testing Backend | JUnit + Mockito |
| Testing Frontend | Vitest + React Testing Library |
| Control de versiones | Git + GitHub |
| Gestión del proyecto | GitHub Projects |
| Base de datos alojada | Supabase |
| Contenedores | Docker |

---

# 4.3 Backend

## Java 17

Se utilizará Java 17 por ser una versión LTS (Long Term Support), ampliamente utilizada en entornos empresariales y totalmente compatible con Spring Boot 3.

Su estabilidad y soporte a largo plazo la convierten en una opción adecuada para un proyecto con vocación profesional.

---

## Spring Boot

Spring Boot será el núcleo del backend.

Su elección responde a varios motivos:

- Amplia adopción en el mercado laboral.
- Excelente integración con el ecosistema Spring.
- Gran productividad en el desarrollo.
- Facilidad para construir APIs REST.
- Arquitectura fácilmente escalable.

Aunque MyRecipes podría desarrollarse utilizando soluciones más sencillas, Spring Boot permitirá aplicar patrones y prácticas habituales en proyectos empresariales.

---

## Spring Data JPA

Se utilizará Spring Data JPA para abstraer el acceso a la base de datos.

Esto permitirá reducir código repetitivo y mantener una capa de persistencia limpia y mantenible.

---

## Spring Security

La autenticación y autorización se implementarán mediante Spring Security.

Se utilizarán JWT para construir una API completamente desacoplada del frontend.

---

## Flyway

Todas las modificaciones sobre el esquema de base de datos estarán versionadas mediante migraciones.

Esto permitirá mantener sincronizados el código fuente y la estructura de la base de datos.

---

# 4.4 Base de datos

## PostgreSQL

PostgreSQL será el motor de base de datos principal.

Su elección responde a:

- Fiabilidad.
- Excelente rendimiento.
- Gran compatibilidad con Spring Boot.
- Amplio uso en aplicaciones empresariales.

---

## Supabase

Supabase se utilizará exclusivamente como proveedor de PostgreSQL.

La lógica de negocio permanecerá íntegramente en el backend desarrollado con Spring Boot.

Esta decisión evita depender de funcionalidades específicas del proveedor y facilita una futura migración si fuera necesario.

---

# 4.5 Frontend

## React

React se utilizará para desarrollar la interfaz de usuario.

Su arquitectura basada en componentes facilita la reutilización del código y la construcción de interfaces complejas.

---

## TypeScript

Todo el frontend se desarrollará utilizando TypeScript.

El tipado estático mejora la mantenibilidad del proyecto y reduce errores durante el desarrollo.

---

## Vite

Vite será la herramienta encargada del desarrollo y construcción del frontend.

Su rapidez durante el desarrollo mejora significativamente la productividad.

---

## Tailwind CSS

Se utilizará Tailwind CSS para construir la interfaz.

Su enfoque basado en utilidades permite desarrollar componentes de forma rápida y mantener un diseño consistente.

---

## TanStack Query

La comunicación con el backend se gestionará mediante TanStack Query.

Sus principales ventajas son:

- Cache automática.
- Sincronización de datos.
- Gestión del estado del servidor.
- Reintentos automáticos.
- Mejor experiencia de usuario.

---

# 4.6 Testing

El proyecto incorporará pruebas automatizadas tanto en el backend como en el frontend.

## Backend

- JUnit
- Mockito

## Frontend

- Vitest
- React Testing Library

El objetivo será garantizar el correcto funcionamiento de los componentes críticos de la aplicación.

---

# 4.7 Control de versiones

Todo el desarrollo se gestionará mediante Git.

El repositorio estará alojado en GitHub.

La planificación del trabajo se realizará utilizando:

- Issues
- Projects
- Milestones

Cada funcionalidad importante quedará asociada a una Issue para mantener un historial completo del desarrollo.

---

# 4.8 Contenedores

Docker se utilizará para facilitar el entorno de desarrollo.

Permitirá ejecutar los servicios necesarios de forma aislada y reproducible.

---

# 4.9 Criterios de selección

Todas las tecnologías utilizadas cumplen al menos uno de los siguientes criterios:

- Amplia adopción en el mercado laboral.
- Estabilidad.
- Buen soporte a largo plazo.
- Excelente documentación.
- Comunidad activa.
- Integración con el resto del ecosistema.

# 4.10 Tecnologías consideradas

Durante el diseño del proyecto se valoraron distintas alternativas.

## Backend como servicio (BaaS)

Inicialmente se estudió utilizar Supabase como backend completo.

Finalmente se descartó esta opción para desarrollar la lógica de negocio con Spring Boot, ya que permite aplicar una arquitectura más cercana a la utilizada en entornos empresariales y demostrar conocimientos del ecosistema Java.

## Frameworks Full Stack

También se valoraron alternativas como Next.js.

Se optó por mantener frontend y backend completamente desacoplados mediante una API REST para facilitar la evolución independiente de ambos proyectos.