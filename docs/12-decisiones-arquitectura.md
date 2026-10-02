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

---

# ADR-016
## Cuenta demo con columna `role` y comprobación manual en el servicio

### Estado

Aceptada.

### Contexto

El registro de usuarios es solo por invitación, así que ninguna persona externa a la aplicación puede verla por dentro. Para poder enseñar MyRecipes hace falta una **cuenta demo pública**: credenciales visibles, recetas de ejemplo ya cargadas y restricciones para que nadie pueda estropear la cuenta ni abusar de ella.

Las restricciones necesarias son de dos tipos:

- **Bloquear** lo que toca la identidad de la cuenta (cambio de contraseña, cambio de email o de perfil, borrado de cuenta, invitaciones, subida de ficheros).
- **Limitar** lo que hace crecer los datos, sin impedir el uso normal de la aplicación (cuota de recetas y de versiones por receta), porque el objetivo es que quien la prueba vea la app funcionando de verdad.

### Alternativas consideradas

- **Roles de Spring Security con `@PreAuthorize`** (`@EnableMethodSecurity`, anotaciones `@PreAuthorize("hasRole('DEMO')")`). Es la vía habitual, pero obliga a montar el sistema de authorities y a decidir dónde va cada anotación, mezclando autorización con lógica de negocio. Además es una superficie de error silencioso: si se olvida una anotación, el endpoint queda abierto sin que nadie se entere.
- **El rol como claim del JWT** y leerlo de la petición para autorizar. Se descartó porque el claim queda obsoleto hasta que el token caduca: si se degrada a `USER` a un usuario demo, seguiría pudiendo saltarse las restricciones hasta 1 hora después (o hasta que se revocara el token). El rol se lee siempre del `User` cargado desde la base de datos.
- **Reseteo automático de los datos de la demo** (`@Scheduled` que restaura las recetas cada cierto tiempo, o un endpoint de reset). Se descartó por ahora: es código que hay que mantener y que además borra cambios mientras alguien está mirando, y la demo se puede restaurar a mano con `sql/seed-dev.sql`.
- **Una tabla de roles / authorities propia** en lugar de una columna `role`. Desproporcionado para dos valores.

### Decisión

Una columna `role` en la tabla `users`, mapeada con el enum `org.mendez.mr.myrecipesapi.enums.Role` (`USER`, `DEMO`) y `@Enumerated(EnumType.STRING)`, con valor por defecto `USER`.

La comprobación se hace **manualmente en la capa de servicio**, en un componente único, `DemoGuard`, con tres métodos:

- `assertNotDemo(User)`: lanza `DemoAccountException` (403) si el usuario es `DEMO`. Se usa en todo lo que toca la identidad de la cuenta.
- `assertRecipeQuota(User)` y `assertVersionQuota(User, recipeId)`: solo aplican a `DEMO` y lanzan la misma excepción cuando se supera el límite.

Los límites viven en la configuración (`app.demo.max-recipes`, `app.demo.max-versions-per-recipe`) y el rol viaja al frontend en la respuesta del login y de `GET /api/users/me`, para que la interfaz pueda avisar y ocultar las acciones bloqueadas.

No se usa `@PreAuthorize`, no se activa `@EnableMethodSecurity` y no se añaden authorities `ROLE_*` para tomar decisiones de autorización. El claim `role` del JWT y la authority que ya existían en el código se mantienen porque no forman parte del contrato de la API, pero **no se usan para autorizar**: la protección real está en el servicio, leyendo el `User` de la BD.

El rol nunca viene del cliente: ningún DTO de entrada lo acepta y el registro público crea siempre `USER`. El usuario demo se crea a mano y se le asigna `DEMO` con un `UPDATE` en SQL (`backend/my-recipes-api/sql/demo-role.sql`).

### Motivos

- Una comprobación explícita en el servicio se lee igual que la regla de negocio y no depende de configuración de Spring Security.
- El rol leído de la BD siempre es el valor real: cambiarlo surte efecto en la siguiente petición, sin esperar a que caduquen los tokens.
- Un único componente (`DemoGuard`) evita repartir `if` por el código y concentra los límites en un sitio.
- El enum evita valores de rol sueltos que no compilen.

### Consecuencias

- **A favor:** las restricciones son visibles en el código de cada operación; no hay superficie de autorización implícita que se pueda olvidar; el frontend recibe el rol y puede explicarle al usuario por qué una acción no está disponible.
- **En contra:** cada endpoint nuevo que toque la identidad de la cuenta tiene que llamar a `assertNotDemo` a mano (es el precio de no usar `@PreAuthorize`, y conviene vigilarlo en el code review).
- **En contra:** `RecipeService` recibe `userId`, no `User`, así que para las cuotas hay que cargar el `User` desde la BD (una consulta extra al crear una receta o una versión).
- **Operativa:** el SQL que añade la columna y el que asigna `DEMO` están en `backend/my-recipes-api/sql/demo-role.sql` y su ejecución es un paso manual.
- **Pendiente:** el reseteo de los datos de la demo no está resuelto. Si hace falta, será una decisión nueva (no un `@Scheduled` improvisado).