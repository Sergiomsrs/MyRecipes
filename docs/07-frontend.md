# 7. Diseño funcional

## 7.1 Objetivo

El objetivo de MyRecipes es ayudar al usuario a conservar y mejorar sus propias recetas mediante un sistema de versiones.

La aplicación se ha diseñado para que el flujo de trabajo resulte sencillo e intuitivo, permitiendo centrarse en cocinar y aprender de la experiencia sin añadir complejidad innecesaria.

Todas las funcionalidades de la aplicación giran alrededor de una única idea:

> Las recetas evolucionan con el tiempo.

Cada vez que el usuario descubre una mejora, puede crear una nueva versión de la receta conservando todas las versiones anteriores.

---

# 7.2 Flujo principal

El flujo principal de la aplicación puede resumirse en el siguiente diagrama.

```
Iniciar sesión

↓

Dashboard

↓

Listado de recetas

↓

Seleccionar receta

↓

Consultar versión actual

↓

¿Quieres mejorar la receta?

↓

Crear nueva versión

↓

Guardar cambios

↓

La nueva versión pasa a ser la actual
```

Este flujo representa el funcionamiento habitual de la aplicación.

---

# 7.3 Navegación

La primera versión de MyRecipes estará formada por las siguientes pantallas.

```
/

Login

Registro

Dashboard

Listado de recetas

Nueva receta

Detalle de receta

Nueva versión

Historial de versiones

Detalle de versión

Perfil de usuario
```

Cada pantalla tendrá una única responsabilidad claramente definida.

---

# 7.4 Registro e inicio de sesión

El usuario podrá:

- Crear una cuenta.
- Iniciar sesión.
- Cerrar sesión.

Una vez autenticado accederá directamente al Dashboard.

Las sesiones se mantendrán mediante JWT.

---

# 7.5 Dashboard

El Dashboard será la pantalla principal de la aplicación.

Desde aquí el usuario podrá:

- Acceder rápidamente a sus recetas.
- Crear una nueva receta.
- Consultar las recetas modificadas recientemente.

El Dashboard no pretende mostrar estadísticas complejas.

Su objetivo es servir como punto de entrada a la aplicación.

---

# 7.6 Gestión de recetas

Cada usuario podrá gestionar exclusivamente sus propias recetas.

Las operaciones disponibles serán:

- Crear receta.
- Consultar receta.
- Editar información general.
- Eliminar receta.

La edición de una receta únicamente afectará a su información general.

Los ingredientes y pasos evolucionarán mediante versiones.

---

# 7.7 Crear una receta

Cuando el usuario crea una receta deberá introducir:

- Nombre.
- Descripción.
- Categoría.
- Ingredientes.
- Pasos.

Al guardar la receta se generarán automáticamente:

- La entidad Recipe.
- La versión 1 de la receta.

Toda receta tendrá siempre al menos una versión.

---

# 7.8 Consultar una receta

Al abrir una receta el usuario visualizará siempre su versión actual.

La pantalla mostrará:

- Información general.
- Ingredientes.
- Pasos.
- Fotografías.
- Notas.
- Valoración.
- Número de versión.

También ofrecerá acceso al historial completo de versiones.

---

# 7.9 Crear una nueva versión

La funcionalidad principal de la aplicación consiste en evolucionar una receta.

Cuando el usuario decida mejorar una receta pulsará el botón:

```
Nueva versión
```

La aplicación realizará automáticamente una copia de la versión actual.

El usuario podrá modificar libremente:

- Ingredientes.
- Pasos.
- Fotografías.
- Notas.

Además deberá introducir un breve resumen indicando qué ha cambiado respecto a la versión anterior.

Al guardar:

- Se creará una nueva versión.
- La receta pasará a apuntar automáticamente a dicha versión.
- El historial permanecerá intacto.

---

# 7.10 Historial de versiones

Cada receta dispondrá de un historial completo.

Ejemplo:

```
Versión 4 ⭐⭐⭐⭐⭐

↓

Versión 3 ⭐⭐⭐⭐☆

↓

Versión 2 ⭐⭐⭐☆☆

↓

Versión 1 ⭐⭐☆☆☆
```

Cada elemento del historial mostrará:

- Número de versión.
- Fecha.
- Valoración.
- Resumen de cambios.

El usuario podrá consultar cualquier versión anterior.

Las versiones serán inmutables.

---

# 7.11 Consultar una versión

Al seleccionar una versión del historial el usuario podrá visualizar exactamente cómo era la receta en ese momento.

La pantalla mostrará:

- Ingredientes.
- Pasos.
- Fotografías.
- Notas.
- Valoración.
- Resumen de cambios.

No será posible editar versiones antiguas.

---

# 7.12 Fotografías

Cada versión podrá contener una o varias fotografías.

Las imágenes permitirán documentar visualmente la evolución de la receta.

Las fotografías estarán siempre asociadas a una versión concreta.

---

# 7.13 Perfil de usuario

El usuario dispondrá de una pantalla para gestionar su información personal.

Desde ella podrá:

- Modificar su nombre.
- Cambiar su contraseña.
- Eliminar su cuenta.

---

# 7.14 Principios de experiencia de usuario

Toda la interfaz se desarrollará siguiendo los siguientes principios.

## Simplicidad

Cada pantalla tendrá un único objetivo.

Se evitarán elementos innecesarios que distraigan al usuario.

---

## Aprendizaje progresivo

Las funcionalidades más importantes deberán ser evidentes desde el primer uso.

La aplicación no requerirá un proceso de aprendizaje complejo.

---

## Consistencia

Los mismos elementos visuales tendrán siempre el mismo comportamiento.

La navegación será coherente en toda la aplicación.

---

## Rapidez

Las acciones habituales deberán poder realizarse con el menor número posible de clics.

La creación de una nueva versión será el flujo principal de la aplicación.

---

# 7.15 Casos de uso principales

## Caso de uso 1

Crear una nueva receta.

```
Usuario

↓

Nueva receta

↓

Guardar

↓

Versión 1 creada
```

---

## Caso de uso 2

Mejorar una receta.

```
Abrir receta

↓

Nueva versión

↓

Modificar receta

↓

Guardar

↓

Versión actual actualizada
```

---

## Caso de uso 3

Consultar una versión antigua.

```
Abrir receta

↓

Historial

↓

Seleccionar versión

↓

Consultar receta
```

---

# 7.16 Funcionalidades futuras

El diseño funcional permitirá incorporar nuevas capacidades sin modificar el flujo principal de la aplicación.

Entre ellas:

- Compartir recetas.
- Comparar versiones.
- Restaurar versiones anteriores.
- Etiquetas personalizadas.
- Exportación de recetas.
- Estadísticas de evolución.
- Inteligencia artificial.