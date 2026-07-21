# 2. Objetivos y alcance

## 2.1 Objetivo general

MyRecipes nace con un objetivo muy claro: ayudar a las personas a conservar y mejorar sus propias recetas mediante el registro de la experiencia adquirida cada vez que cocinan.

La aplicación no pretende ser un recetario de Internet ni una red social gastronómica.

Su propósito es permitir que el usuario documente la evolución de sus recetas personales para que nunca vuelva a preguntarse:

> "¿Qué hice aquella vez para que saliera tan bien?"

Cada preparación representa una oportunidad para aprender.

MyRecipes convierte ese aprendizaje en información permanente.

---

# 2.2 Filosofía del producto

Antes de definir las funcionalidades del proyecto es importante establecer una regla que guiará todas las decisiones durante el desarrollo.

**Toda funcionalidad deberá responder a una única pregunta:**

> **¿Ayuda al usuario a mejorar y recordar la evolución de sus recetas?**

Si la respuesta es afirmativa, la funcionalidad tiene sentido dentro del proyecto.

Si la respuesta es negativa, probablemente no forme parte de la esencia de MyRecipes y deberá descartarse o posponerse para futuras versiones.

Esta filosofía permitirá mantener una aplicación sencilla, coherente y centrada en resolver un único problema de forma excelente.

---

# 2.3 Objetivos funcionales

La primera versión del proyecto deberá permitir que cualquier usuario pueda:

- Crear sus propias recetas.
- Organizar sus recetas personales.
- Registrar cada vez que cocina una receta.
- Documentar los cambios realizados respecto a preparaciones anteriores.
- Añadir observaciones personales.
- Guardar fotografías del resultado.
- Valorar el resultado obtenido.
- Consultar toda la evolución de una receta desde su primera preparación.

La aplicación debe permitir responder con facilidad preguntas como:

- ¿Qué versión fue la mejor?
- ¿Qué cambios hice respecto a la anterior?
- ¿Qué tiempo de cocción utilicé aquella vez?
- ¿Cuándo empecé a utilizar este ingrediente?

El conocimiento adquirido durante cada preparación será el verdadero valor de la aplicación.

---

# 2.4 Objetivos técnicos

Además del objetivo funcional, el proyecto persigue un objetivo técnico.

MyRecipes se desarrollará como un proyecto Full Stack que sirva como demostración de conocimientos profesionales en el ecosistema Java.

Durante su desarrollo se aplicarán buenas prácticas habituales en aplicaciones empresariales.

Entre ellas:

- Arquitectura en capas.
- API REST.
- Autenticación mediante JWT.
- Persistencia con PostgreSQL.
- Documentación mediante OpenAPI.
- Testing automatizado.
- Control de versiones mediante Git.
- Desarrollo guiado por documentación.

El proyecto priorizará la calidad del código frente a la incorporación de un gran número de funcionalidades.

---

# 2.5 Alcance de la primera versión

La versión 1.0 incluirá únicamente aquellas funcionalidades necesarias para cumplir el objetivo principal del proyecto.

## Gestión de usuarios

- Registro.
- Inicio de sesión.
- Gestión del perfil.

## Gestión de recetas

- Crear recetas.
- Editar recetas.
- Eliminar recetas.
- Organizar recetas mediante categorías.

## Evolución de recetas

- Registrar una nueva preparación.
- Registrar modificaciones realizadas.
- Añadir notas personales.
- Guardar fotografías.
- Valorar el resultado.
- Consultar el historial completo de evolución.

## Consulta

- Buscar recetas.
- Filtrar recetas.
- Ordenar recetas.
- Consultar las últimas preparaciones.

Todas estas funcionalidades están directamente relacionadas con el propósito principal del proyecto: ayudar al usuario a aprender de su propia experiencia.

---

# 2.6 Funcionalidades fuera del alcance

Con el objetivo de mantener un alcance controlado, la primera versión no incluirá funcionalidades que no aporten valor directo al problema que se pretende resolver.

Entre ellas:

- Compartir recetas públicamente.
- Red social.
- Comentarios entre usuarios.
- Sistema de seguidores.
- Chat.
- Vídeos.
- Planificación semanal de comidas.
- Lista de la compra.
- Inteligencia artificial.
- Aplicación móvil nativa.

Estas funcionalidades no se consideran prioritarias y podrán evaluarse en futuras versiones.

---

# 2.7 Requisitos de calidad

Durante todo el desarrollo se perseguirán los siguientes objetivos de calidad.

## Simplicidad

Cada funcionalidad deberá aportar un beneficio claro al usuario.

Se evitará incorporar características que aumenten la complejidad del sistema sin aportar valor.

---

## Mantenibilidad

La arquitectura deberá facilitar futuras modificaciones sin afectar al resto del sistema.

---

## Seguridad

Cada usuario únicamente podrá acceder a su propia información.

La autenticación se realizará mediante JWT y las contraseñas se almacenarán cifradas.

---

## Rendimiento

La aplicación deberá ofrecer tiempos de respuesta adecuados incluso cuando el número de recetas y preparaciones aumente.

---

## Escalabilidad

La arquitectura deberá permitir incorporar nuevas funcionalidades sin necesidad de rediseñar completamente el sistema.

---

# 2.8 Criterios de éxito

Se considerará que la primera versión del proyecto ha alcanzado sus objetivos cuando un usuario pueda:

- Crear una cuenta.
- Gestionar sus recetas.
- Registrar múltiples preparaciones de una misma receta.
- Consultar la evolución completa de cualquier receta.
- Recordar exactamente qué cambios produjeron los mejores resultados.

Desde el punto de vista técnico, el proyecto también deberá demostrar una arquitectura limpia, una documentación completa y un código fácilmente mantenible.

---

# 2.9 Evolución futura

Aunque la primera versión tendrá un alcance reducido, la arquitectura se diseñará pensando en futuras ampliaciones.

Entre las posibles líneas de evolución destacan:

- Compartir recetas.
- Recetas colaborativas.
- Estadísticas de cocina.
- Exportación e importación de recetas.
- Planificación de menús.
- Lista de la compra.
- Aplicación móvil.
- Integración con asistentes de voz.

Estas funcionalidades no forman parte de la primera versión porque no resultan necesarias para validar la idea principal del proyecto.

El objetivo inicial es construir una aplicación sólida, bien diseñada y centrada en resolver un único problema de forma excelente antes de ampliar su alcance.