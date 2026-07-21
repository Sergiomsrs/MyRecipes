# 3. Arquitectura

## 3.1 Visión general

MyRecipes se desarrollará como una aplicación web Full Stack siguiendo una arquitectura cliente-servidor.

La aplicación estará dividida en dos proyectos independientes:

- Frontend desarrollado con React.
- Backend desarrollado con Spring Boot.

Ambos proyectos compartirán un mismo repositorio Git utilizando una estructura de monorepo, lo que permitirá mantener una única documentación, una gestión centralizada del proyecto y un desarrollo coordinado.

La comunicación entre ambos se realizará mediante una API REST utilizando JSON como formato de intercambio de datos.

La autenticación se implementará mediante JWT (JSON Web Token), permitiendo una separación completa entre cliente y servidor.

La persistencia de los datos se realizará sobre PostgreSQL utilizando Supabase como proveedor de base de datos.

---

# 3.2 Arquitectura general

La arquitectura del sistema puede representarse mediante el siguiente esquema.

```
                Usuario
                    │
                    ▼
          React + TypeScript
                    │
         HTTPS / REST API (JSON)
                    │
                    ▼
      Spring Boot 3 + Java 17
                    │
             Spring Data JPA
                    │
                    ▼
         PostgreSQL (Supabase)
```

Cada componente tendrá una responsabilidad claramente definida.

- El frontend será responsable de la interfaz de usuario.
- El backend contendrá toda la lógica de negocio.
- PostgreSQL almacenará la información persistente.
- Supabase proporcionará la infraestructura de base de datos.

---

# 3.3 Arquitectura del frontend

El frontend será una Single Page Application (SPA) desarrollada con React y TypeScript.

Su responsabilidad será exclusivamente la presentación de información y la interacción con el usuario.

No contendrá lógica de negocio crítica.

Entre sus responsabilidades estarán:

- Navegación.
- Gestión de formularios.
- Validaciones básicas.
- Consumo de la API REST.
- Gestión del estado de autenticación.
- Renderizado de la interfaz.

La comunicación con el backend se realizará siempre mediante peticiones HTTP.

---

# 3.4 Arquitectura del backend

El backend se desarrollará utilizando Spring Boot siguiendo una arquitectura en capas.

Cada capa tendrá una responsabilidad concreta.

```
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database
```

### Controller

Expone los endpoints REST.

Su única responsabilidad será recibir peticiones HTTP y devolver respuestas.

No contendrá lógica de negocio.

---

### Service

Contendrá toda la lógica de negocio de la aplicación.

Será el corazón del sistema.

Aquí se implementarán reglas como:

- Crear recetas.
- Registrar una preparación.
- Validar permisos.
- Gestionar la evolución de una receta.

---

### Repository

Gestionará el acceso a la base de datos utilizando Spring Data JPA.

No contendrá lógica de negocio.

---

### Base de datos

La persistencia se realizará mediante PostgreSQL.

El modelo de datos se diseñará para permitir la evolución futura del proyecto sin realizar cambios estructurales importantes.

---

# 3.5 Organización del repositorio

El proyecto utilizará una estructura de monorepo.

```
myrecipes/

│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│
├── .github/
│
└── README.md
```

Esta organización facilita el desarrollo conjunto del frontend y el backend manteniendo ambos proyectos claramente separados.

---

# 3.6 Comunicación entre componentes

Toda la comunicación entre frontend y backend se realizará mediante una API REST.

El backend nunca generará vistas HTML.

El frontend nunca accederá directamente a la base de datos.

Este desacoplamiento permitirá evolucionar ambos proyectos de forma independiente.

---

# 3.7 Seguridad

La autenticación se implementará mediante JWT.

El flujo general será:

```
Usuario

↓

Login

↓

Backend valida credenciales

↓

Genera JWT

↓

Frontend almacena el token

↓

Cada petición incluye Authorization: Bearer <token>

↓

Backend valida el token
```

Cada usuario únicamente podrá acceder a la información asociada a su cuenta.

---

# 3.8 Persistencia

La aplicación utilizará PostgreSQL alojado en Supabase.

Las migraciones de base de datos se gestionarán mediante Flyway.

Esta estrategia permitirá mantener el esquema versionado junto con el código fuente.

---

# 3.9 Escalabilidad

Aunque MyRecipes nace como un proyecto personal, la arquitectura se diseñará pensando en futuras ampliaciones.

La separación entre frontend, backend y persistencia permitirá incorporar nuevas funcionalidades sin modificar la estructura general del sistema.

Entre las posibles ampliaciones destacan:

- Aplicación móvil.
- Compartición de recetas.
- IA.
- Notificaciones.
- Integraciones externas.

---

# 3.10 Principios de diseño

Durante todo el desarrollo se seguirán los siguientes principios.

- Separación de responsabilidades.
- Bajo acoplamiento.
- Alta cohesión.
- Código limpio.
- Arquitectura fácilmente mantenible.
- Simplicidad antes que complejidad.
- Evolución incremental del sistema.

La prioridad será construir una aplicación sencilla, bien organizada y fácilmente extensible antes que incorporar un gran número de funcionalidades.