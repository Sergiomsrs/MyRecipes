# 1. Introducción

## 1.1 El problema

Todos tenemos una receta especial. Puede ser el guiso de nuestra abuela, las lentejas de nuestra madre o la tarta que siempre prepara un familiar.

Muchas veces conocemos los ingredientes y los pasos, pero aun así no conseguimos reproducir exactamente el mismo resultado. La cocina no consiste únicamente en seguir una lista de instrucciones.

Pequeños detalles como el tiempo de cocción, el tipo de recipiente, la intensidad del fuego, el orden en el que se incorporan los ingredientes o incluso la marca de un producto pueden cambiar por completo el resultado. Esos matices rara vez aparecen escritos en una receta; se aprenden cocinando.

Cada intento enseña algo nuevo: quizá cinco minutos menos de horno, un poco más de caldo o añadir el pimentón unos segundos antes. Con el tiempo, la receta deja de ser la receta de otra persona para convertirse en una versión propia.

Sin embargo, ese aprendizaje suele perderse. Semanas o meses después, recordamos que una receta salió especialmente bien, pero somos incapaces de reproducir exactamente qué hicimos. La experiencia desaparece tras cada plato.

---

## 1.2 Propósito del proyecto

MyRecipes es una aplicación web Full Stack diseñada para conservar ese aprendizaje.

A diferencia de la mayoría de aplicaciones de recetas, cuyo objetivo principal es descubrir nuevas recetas o consultar elaboraciones publicadas por otros usuarios, MyRecipes se centra en un problema distinto: documentar la evolución de las recetas personales.

La aplicación permite registrar cada receta como un elemento vivo que evoluciona con la experiencia del usuario. Cada vez que una receta se cocina, el usuario puede registrar un nuevo intento indicando qué cambios ha realizado, cómo ha salido el resultado, qué mejoraría la próxima vez y fotografías del plato final.

La aplicación no pretende convertirse en una red social gastronómica ni competir con grandes plataformas de recetas. Su objetivo es ayudar al usuario a recordar exactamente cómo consiguió que una receta saliera bien.

No guarda únicamente recetas: guarda el conocimiento adquirido mientras se cocinan.

---

## 1.3 Visión del proyecto

La visión de MyRecipes es convertir cada receta en un historial de aprendizaje.

Cada receta representa un punto de partida. Cada cocinado representa una nueva versión. Cada versión incorpora la experiencia obtenida en el intento anterior.

De forma similar a como un desarrollador utiliza un sistema de control de versiones para registrar la evolución de un proyecto software, MyRecipes registra la evolución de una receta desde su primera elaboración hasta la versión que el usuario considera definitiva.

Las recetas dejan de ser documentos estáticos para convertirse en conocimiento que evoluciona con cada preparación.

---

## 1.4 Solución propuesta

La aplicación permite:

- Crear recetas personales.
- Registrar cada vez que una receta es cocinada.
- Anotar los cambios realizados respecto al intento anterior.
- Añadir observaciones personales.
- Guardar fotografías del resultado.
- Valorar el resultado obtenido.
- Consultar el historial completo de evolución de una receta.

Gracias a este enfoque, el usuario puede responder preguntas como:

- ¿Qué cambió para que esta tortilla saliera perfecta?
- ¿Cuándo empecé a utilizar seis huevos en lugar de cinco?
- ¿Qué versión del guiso gustó más en casa?
- ¿Qué tiempo de cocción funcionó mejor?

La aplicación convierte la experiencia en información reutilizable.

---

## 1.5 Objetivos del proyecto

### Objetivo funcional

Desarrollar una aplicación que permita gestionar recetas personales mediante un sistema de versionado basado en intentos de cocinado, facilitando el aprendizaje continuo y la conservación de la experiencia adquirida.

### Objetivo técnico

Construir un proyecto Full Stack moderno que demuestre conocimientos profesionales en tecnologías ampliamente utilizadas en el desarrollo de aplicaciones empresariales.

El proyecto utilizará:

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL
- React
- Tailwind CSS
- TanStack Query
- Docker
- OpenAPI
- Testing automatizado

---

## 1.6 Público objetivo

La aplicación está dirigida a personas que disfrutan cocinando y desean perfeccionar sus propias recetas.

Especialmente a usuarios que:

- Adaptan recetas heredadas de familiares.
- Experimentan con nuevos ingredientes.
- Ajustan tiempos y cantidades hasta conseguir el resultado deseado.
- Quieren recordar exactamente qué hicieron cuando una receta salió especialmente bien.

---

## 1.7 Diferenciación

La mayoría de aplicaciones de recetas responden a la pregunta:

> ¿Qué puedo cocinar hoy?

MyRecipes responde a una pregunta mucho más personal:

> ¿Cómo conseguí que esta receta saliera tan bien la última vez?

Ese cambio de enfoque convierte la aplicación en una herramienta de aprendizaje personal y no en un simple catálogo de recetas. Su principal valor no reside en almacenar ingredientes y pasos, sino en preservar la experiencia obtenida durante cada preparación.

---

## 1.8 Principios del proyecto

### La experiencia tiene valor

Cada vez que una receta se cocina se genera conocimiento. Ese conocimiento debe conservarse.

### Las recetas evolucionan

Ninguna receta es definitiva. Cada intento puede mejorar el anterior.

### Simplicidad

La aplicación incorporará únicamente funcionalidades que aporten valor real al usuario.

### Calidad

Cada funcionalidad deberá quedar completamente implementada, probada y documentada antes de comenzar la siguiente.

### Enfoque profesional

El proyecto se desarrollará siguiendo una metodología similar a la utilizada en equipos profesionales. La documentación formará parte del repositorio y evolucionará junto con el código.

---

## 1.9 Alcance del documento

Este documento introduce la visión general del proyecto y define el problema que la aplicación pretende resolver.

Los aspectos relacionados con la arquitectura, modelo de datos, API REST, frontend, seguridad, testing y despliegue se desarrollan en los documentos específicos incluidos en la carpeta docs.
