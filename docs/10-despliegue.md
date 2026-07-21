# 10. Despliegue

## 10.1 Objetivo

El objetivo de la estrategia de despliegue es publicar MyRecipes en un entorno accesible desde Internet utilizando una arquitectura sencilla, segura y fácilmente mantenible.

Además de poner la aplicación en producción, esta estrategia tiene un objetivo formativo: adquirir experiencia práctica en el despliegue y administración de aplicaciones Java sobre un servidor Linux, reproduciendo un escenario similar al utilizado en muchas pequeñas y medianas empresas.

---

# 10.2 Arquitectura de despliegue

La aplicación estará formada por los siguientes componentes.

```
Usuario

↓

GitHub Pages
(Frontend React)

↓

HTTPS

↓

VPS Ubuntu 

↓

Spring Boot

↓

Supabase PostgreSQL

↓

Supabase Storage
```

Cada componente será independiente, facilitando su mantenimiento y evolución.

---

# 10.3 Componentes

## Frontend

El frontend estará desarrollado con React y Vite.

Se desplegará mediante GitHub Pages.

Esta solución ofrece:

- Despliegue sencillo mediante GitHub Actions o gh-pages.
- Hosting gratuito.
- Integración con el repositorio del proyecto.
- HTTPS.
- Excelente rendimiento para aplicaciones SPA.

En caso de adquirir un dominio propio, GitHub Pages permitirá asociarlo fácilmente al proyecto.

---

## Backend

La API REST desarrollada con Spring Boot se desplegará en un servidor VPS con Ubuntu.

El backend será responsable de:

- Autenticación de usuarios.
- Lógica de negocio.
- Acceso a la base de datos.
- Gestión de imágenes.
- Exposición de la API REST.

La elección de un VPS permitirá adquirir experiencia práctica en:

- Administración básica de Linux.
- Configuración de servidores.
- Publicación de aplicaciones Java.
- Gestión de procesos.
- Configuración de servicios.
- Despliegue manual de aplicaciones.

---

## Base de datos

La aplicación utilizará PostgreSQL gestionado mediante Supabase.

El backend será el único componente con acceso directo a la base de datos.

Supabase proporcionará:

- PostgreSQL administrado.
- Copias de seguridad.
- Alta disponibilidad.
- Escalabilidad.

---

## Almacenamiento de imágenes

Las fotografías se almacenarán mediante Supabase Storage.

Cada imagen estará asociada a una versión concreta de una receta.

Las imágenes no se almacenarán dentro de la base de datos.

---

## Repositorio

Todo el código fuente del proyecto se alojará en GitHub.

La estructura del repositorio será:

```
myrecipes/

├── frontend/
├── backend/
└── docs/
```

GitHub actuará como origen único del código fuente.

---

# 10.4 Infraestructura del servidor

El VPS alojará la API de Spring Boot.

La infraestructura prevista será la siguiente.

```
Ubuntu Server

↓

Nginx

↓

Spring Boot

↓

Supabase PostgreSQL
```

Nginx actuará como servidor web y reverse proxy, redirigiendo las peticiones HTTP/HTTPS hacia la aplicación Spring Boot.

---

# 10.5 Flujo de despliegue

Cada cambio seguirá el siguiente proceso.

```
Desarrollador

↓

Git Commit

↓

GitHub

↓

Actualización del servidor

↓

Aplicación desplegada
```

Inicialmente el despliegue se realizará manualmente.

En futuras versiones podrá automatizarse mediante GitHub Actions.

---

# 10.6 Variables de entorno

Toda la información sensible se almacenará mediante variables de entorno.

Entre ellas:

- URL de PostgreSQL.
- Usuario de la base de datos.
- Contraseña de la base de datos.
- Clave secreta JWT.
- Credenciales de Supabase.
- Configuración del entorno.

Estas variables nunca formarán parte del repositorio.

---

# 10.7 Entornos

## Desarrollo

Durante el desarrollo se utilizará:

- React ejecutándose en local.
- Spring Boot ejecutándose en local.
- PostgreSQL de Supabase.
- Supabase Storage.

---

## Producción

En producción se utilizará:

- GitHub Pages para el frontend.
- VPS Ubuntu para el backend.
- PostgreSQL gestionado por Supabase.
- Supabase Storage para las imágenes.

---

# 10.8 HTTPS

Toda la comunicación entre el navegador y la API utilizará HTTPS.

El certificado TLS podrá obtenerse mediante Let's Encrypt.

Esto garantizará:

- Confidencialidad de los datos.
- Integridad de las comunicaciones.
- Protección frente a ataques de interceptación.

---

# 10.9 Seguridad del servidor

El servidor seguirá unas medidas básicas de seguridad.

Entre ellas:

- Firewall configurado mediante UFW.
- Acceso remoto mediante SSH.
- Actualización periódica del sistema.
- Variables sensibles fuera del código.
- Acceso únicamente mediante HTTPS.

Estas medidas proporcionarán un entorno seguro para el despliegue de la aplicación.

---

# 10.10 Monitorización y registros

Durante el desarrollo se utilizarán los registros generados por Spring Boot y por el propio servidor para detectar errores.

En futuras versiones podrán incorporarse herramientas específicas de monitorización y observabilidad.

---

# 10.11 Copias de seguridad

La persistencia de los datos dependerá de PostgreSQL gestionado por Supabase.

Las fotografías permanecerán almacenadas en Supabase Storage.

En futuras versiones podrán incorporarse mecanismos adicionales de exportación y restauración de datos.

---

# 10.12 Escalabilidad

La arquitectura se ha diseñado para que cada componente pueda evolucionar de forma independiente.

Será posible, entre otras opciones:

- Sustituir GitHub Pages por otro proveedor.
- Migrar el backend a otro servidor.
- Cambiar el proveedor de PostgreSQL.
- Incorporar balanceadores de carga.
- Añadir nuevos servicios sin modificar el resto de la arquitectura.

---

# 10.13 Evolución futura

La estrategia de despliegue permitirá incorporar nuevas mejoras conforme evolucione el proyecto.

Entre ellas:

- Automatización mediante GitHub Actions.
- Contenerización mediante Docker.
- Docker Compose para el entorno de desarrollo.
- Despliegues automáticos.
- Monitorización avanzada.
- Métricas de rendimiento.
- Despliegue de múltiples aplicaciones en el mismo VPS.
- Adquisición de un dominio propio para centralizar el portfolio y los distintos proyectos.