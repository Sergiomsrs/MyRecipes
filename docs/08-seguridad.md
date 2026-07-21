# 8. Seguridad

## 8.1 Objetivo

La seguridad constituye uno de los pilares fundamentales de MyRecipes.

Aunque se trata de un proyecto personal, la aplicación se desarrollará siguiendo buenas prácticas habituales en aplicaciones profesionales para garantizar la confidencialidad de la información de los usuarios, proteger la autenticación y minimizar los riesgos más comunes en aplicaciones web.

La seguridad se abordará tanto en el backend como en el frontend.

---

# 8.2 Principios

El diseño de la aplicación seguirá los siguientes principios:

- Autenticación segura.
- Autorización basada en usuario.
- Protección de datos personales.
- Validación de todas las entradas.
- Principio de mínimo privilegio.
- Comunicación cifrada mediante HTTPS.
- No confiar nunca en el cliente.

---

# 8.3 Autenticación

La autenticación se implementará mediante JSON Web Tokens (JWT).

El flujo será el siguiente:

```
Usuario

↓

Login

↓

Spring Security

↓

JWT

↓

Frontend almacena el token

↓

Peticiones autenticadas
```

Cada petición protegida incluirá:

```
Authorization: Bearer <token>
```

El backend validará el token antes de ejecutar cualquier operación.

---

# 8.4 Autorización

Todos los recursos estarán protegidos.

Cada usuario únicamente podrá acceder a sus propias recetas.

Antes de realizar cualquier operación, el backend comprobará que el recurso solicitado pertenece al usuario autenticado.

Por ejemplo:

- Consultar una receta.
- Crear una nueva versión.
- Modificar una receta.
- Eliminar una receta.

Nunca será posible acceder a recursos pertenecientes a otro usuario modificando la URL.

---

# 8.5 Gestión de contraseñas

Las contraseñas nunca se almacenarán en texto plano.

Se utilizará BCrypt para almacenar únicamente su hash.

Durante el proceso de autenticación:

1. El usuario introduce su contraseña.
2. Spring Security compara el hash.
3. Si coincide, genera un JWT.

En ningún momento será posible recuperar la contraseña original.

---

# 8.6 Validación de datos

Todas las entradas recibidas por la API serán validadas en el servidor.

Entre otras:

- Campos obligatorios.
- Longitud máxima de textos.
- Rangos numéricos válidos.
- Formato de correo electrónico.
- Datos nulos.
- Tamaño de listas.

Las validaciones del frontend mejorarán la experiencia del usuario, pero nunca sustituirán las validaciones del backend.

---

# 8.7 Protección de la API

La API seguirá una estrategia de acceso basada en rutas públicas y privadas.

## Endpoints públicos

- Registro.
- Inicio de sesión.

## Endpoints protegidos

Todos los demás.

Spring Security bloqueará cualquier petición que no incluya un JWT válido.

---

# 8.8 Protección frente a ataques comunes

Durante el desarrollo se tendrán en cuenta los riesgos más habituales en aplicaciones web.

## Broken Access Control

Todos los accesos comprobarán la propiedad de los recursos.

---

## SQL Injection

La aplicación utilizará Spring Data JPA.

No se construirán consultas SQL concatenando texto introducido por el usuario.

---

## Cross-Site Scripting (XSS)

Los datos recibidos se tratarán como texto y React escapará automáticamente el contenido renderizado.

No se utilizará `dangerouslySetInnerHTML`.

---

## Cross-Site Request Forgery (CSRF)

La API será completamente stateless mediante JWT.

Spring Security tendrá deshabilitada la protección CSRF al no utilizar sesiones tradicionales.

---

## Fuerza bruta

En futuras versiones podrán añadirse mecanismos de limitación de peticiones para dificultar ataques de fuerza bruta sobre el inicio de sesión.

---

# 8.9 Gestión de errores

Los mensajes de error no revelarán información interna de la aplicación.

Por ejemplo, nunca se devolverán:

- Consultas SQL.
- Stack traces.
- Información del servidor.
- Rutas internas.

Las respuestas de error serán genéricas y consistentes.

---

# 8.10 Protección de datos

Cada usuario únicamente tendrá acceso a su propia información.

Las respuestas de la API devolverán exclusivamente los datos necesarios para cada operación.

No se expondrán:

- Contraseñas.
- Hashes.
- Tokens antiguos.
- Información interna de la base de datos.

---

# 8.11 Subida de imágenes

Las fotografías asociadas a las recetas deberán cumplir determinadas restricciones.

Entre ellas:

- Tamaño máximo.
- Formatos permitidos.
- Nombre generado por la aplicación.
- Almacenamiento seguro.

En futuras versiones podrán incorporarse validaciones adicionales sobre el contenido de los archivos.

---

# 8.12 Dependencias

El proyecto mantendrá sus dependencias actualizadas.

Se revisarán periódicamente las vulnerabilidades detectadas por GitHub Dependabot y otras herramientas de análisis.

Las actualizaciones de seguridad tendrán prioridad sobre la incorporación de nuevas funcionalidades.

---

# 8.13 Buenas prácticas

Durante el desarrollo se seguirán las siguientes recomendaciones:

- Uso de HTTPS en producción.
- Variables sensibles mediante variables de entorno.
- No incluir secretos en el repositorio.
- Separación entre configuración de desarrollo y producción.
- Actualización periódica de dependencias.
- Registro de errores sin exponer información sensible.

---

# 8.14 Evolución futura

La arquitectura permitirá incorporar nuevas medidas de seguridad sin modificar el diseño principal de la aplicación.

Entre las mejoras previstas se encuentran:

- Refresh Tokens.
- Verificación del correo electrónico.
- Recuperación de contraseña.
- Autenticación mediante OAuth2.
- Doble factor de autenticación (2FA).
- Limitación de peticiones (Rate Limiting).
- Auditoría de accesos.