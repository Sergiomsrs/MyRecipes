# 9. Testing

## 9.1 Objetivo

El objetivo de la estrategia de testing de MyRecipes es garantizar la calidad del software durante todo el desarrollo.

Las pruebas permitirán detectar errores de forma temprana, facilitar la evolución del proyecto y aumentar la confianza en futuras modificaciones.

La estrategia combinará distintos niveles de pruebas, priorizando aquellas que aporten un mayor valor al proyecto.

---

# 9.2 Estrategia

La estrategia de testing se basa en cuatro niveles.

```
Pruebas unitarias

↓

Pruebas de integración

↓

Pruebas de la API

↓

Pruebas funcionales
```

Cada nivel valida un aspecto distinto de la aplicación.

---

# 9.3 Pruebas unitarias

Las pruebas unitarias verificarán el comportamiento de las clases de forma aislada.

Principalmente se aplicarán sobre:

- Servicios.
- Validaciones.
- Mappers.
- Utilidades.

El objetivo será comprobar que la lógica de negocio funciona correctamente independientemente de la base de datos o de otros componentes.

---

# 9.4 Pruebas de integración

Las pruebas de integración verificarán la interacción entre los distintos componentes del backend.

Entre otras:

- Repositorios JPA.
- Persistencia de entidades.
- Relaciones entre entidades.
- Consultas personalizadas.

Estas pruebas garantizarán que la aplicación funciona correctamente con la base de datos.

---

# 9.5 Pruebas de la API

La API REST será validada mediante pruebas automáticas.

Se comprobarán aspectos como:

- Códigos HTTP.
- Validaciones.
- Serialización de datos.
- Autenticación.
- Autorización.
- Gestión de errores.

El objetivo será asegurar que el contrato entre frontend y backend se mantiene estable.

---

# 9.6 Pruebas del frontend

El frontend dispondrá de pruebas para verificar el comportamiento de los componentes más importantes.

Entre ellas:

- Renderizado de componentes.
- Interacción del usuario.
- Formularios.
- Navegación.
- Estados de carga.
- Gestión de errores.

Estas pruebas ayudarán a evitar regresiones durante el desarrollo.

---

# 9.7 Casos críticos

Algunas funcionalidades serán consideradas críticas y deberán estar especialmente cubiertas mediante pruebas.

Entre ellas:

- Registro de usuarios.
- Inicio de sesión.
- Creación de recetas.
- Creación de nuevas versiones.
- Actualización de la versión actual.
- Historial de versiones.
- Control de acceso a recursos.

---

# 9.8 Datos de prueba

Las pruebas utilizarán datos independientes del entorno de producción.

Siempre que sea posible:

- Cada prueba será independiente.
- No existirá dependencia entre pruebas.
- Los datos se crearán automáticamente antes de cada ejecución.

Esto permitirá obtener resultados repetibles y predecibles.

---

# 9.9 Automatización

Todas las pruebas podrán ejecutarse automáticamente.

Durante el desarrollo será posible lanzar la batería completa de tests para verificar que los cambios no introducen errores en funcionalidades existentes.

En el futuro estas pruebas podrán integrarse en un pipeline de integración continua.

---

# 9.10 Herramientas

## Backend

- JUnit 5
- Mockito
- Spring Boot Test
- MockMvc

---

## Frontend

- Vitest
- React Testing Library

---

# 9.11 Cobertura

El objetivo del proyecto no será alcanzar un porcentaje concreto de cobertura.

Se priorizará cubrir mediante pruebas aquellas funcionalidades que aportan mayor valor al usuario y contienen mayor lógica de negocio.

La calidad de las pruebas será más importante que la cantidad.

---

# 9.12 Escenarios de negocio

Además de las pruebas técnicas, el proyecto verificará que las principales reglas del dominio se cumplen correctamente.

Entre los escenarios de negocio que deberán validarse se encuentran:

## Creación de una receta

Al crear una nueva receta:

- Se crea automáticamente una entidad `Recipe`.
- Se genera la versión inicial (`v1`).
- `currentVersionId` apunta a dicha versión.

---

## Creación de una nueva versión

Al evolucionar una receta:

- Se crea una nueva `RecipeVersion`.
- El número de versión se incrementa automáticamente.
- La nueva versión pasa a ser la versión actual.
- Las versiones anteriores permanecen inmutables.

---

## Historial de versiones

El historial de una receta deberá:

- Mantener todas las versiones creadas.
- Mostrar el orden correcto.
- Permitir consultar cualquier versión anterior.

---

## Control de acceso

Cada usuario únicamente podrá acceder a sus propias recetas.

La aplicación impedirá:

- Consultar recetas ajenas.
- Modificar recetas ajenas.
- Crear versiones sobre recetas ajenas.
- Eliminar recetas ajenas.

---

## Integridad del modelo

Se verificará que:

- Toda receta tenga al menos una versión.
- Toda versión pertenezca a una única receta.
- `currentVersionId` siempre apunte a una versión válida.
- No existan versiones huérfanas.

---

# 9.13 Evolución futura

La estrategia de testing permitirá incorporar nuevos tipos de pruebas conforme evolucione el proyecto.

Entre ellas:

- Pruebas End-to-End con Playwright.
- Pruebas de rendimiento.
- Pruebas de carga.
- Pruebas de accesibilidad.
- Integración continua mediante GitHub Actions.