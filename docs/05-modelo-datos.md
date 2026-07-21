# 5. Modelo de datos

## 5.1 Objetivo

El modelo de datos de MyRecipes se ha diseñado con un objetivo claro: representar la evolución de una receta a lo largo del tiempo.

A diferencia de la mayoría de aplicaciones de recetas, donde una receta es un documento estático que se modifica continuamente, MyRecipes considera que cada mejora realizada sobre una receta constituye una nueva versión.

Este enfoque permite conservar todo el conocimiento adquirido durante el proceso de aprendizaje, manteniendo un historial completo de la evolución de cada receta.

---

# 5.2 Filosofía del modelo

El concepto central de la aplicación es que una receta nunca se sobrescribe.

Cada vez que el usuario decide mejorar una receta se crea una nueva versión.

La versión anterior permanece almacenada para poder consultarla en cualquier momento.

De esta forma, el usuario siempre dispone de:

- Una versión actual de la receta.
- Un historial completo de todas las versiones anteriores.
- Un resumen de los cambios realizados en cada evolución.

Este modelo convierte las recetas en documentos vivos que evolucionan con la experiencia del usuario.

---

# 5.3 Modelo conceptual

El dominio principal de la aplicación está formado por las siguientes entidades.

```
User
│
└── Recipe
      │
      ├── currentVersionId
      │
      └── RecipeVersion
              │
              ├── RecipeIngredient
              ├── RecipeStep
              └── Photo
```

Cada entidad tiene una responsabilidad claramente definida.

---

# 5.4 Entidades

## User

Representa un usuario registrado en la aplicación.

Cada usuario únicamente tendrá acceso a sus propias recetas.

### Atributos principales

- id
- name
- email
- password
- createdAt

---

## Recipe

Representa la identidad de una receta.

No almacena ingredientes ni pasos.

Su responsabilidad es identificar la receta y mantener la referencia a la versión actual.

### Atributos principales

- id
- userId
- title
- description
- category
- currentVersionId
- createdAt
- updatedAt

---

## RecipeVersion

Representa una fotografía completa de una receta en un momento determinado.

Cada nueva versión sustituye a la versión actual como referencia principal, pero las versiones anteriores permanecen almacenadas.

### Atributos principales

- id
- recipeId
- versionNumber
- summaryChanges
- notes
- rating
- createdAt

Cada versión contiene además:

- Ingredientes.
- Pasos.
- Fotografías.

---

## RecipeIngredient

Representa un ingrediente perteneciente a una versión concreta de una receta.

### Atributos principales

- id
- recipeVersionId
- name
- quantity
- unit
- order

---

## RecipeStep

Representa uno de los pasos necesarios para preparar una versión concreta de una receta.

### Atributos principales

- id
- recipeVersionId
- order
- description

---

## Photo

Representa una fotografía asociada a una versión concreta de una receta.

Permite documentar visualmente el resultado obtenido.

### Atributos principales

- id
- recipeVersionId
- url
- caption

---

# 5.5 Relaciones

## User → Recipe

Relación uno a muchos.

Un usuario puede crear múltiples recetas.

Cada receta pertenece únicamente a un usuario.

---

## Recipe → RecipeVersion

Relación uno a muchos.

Una receta puede tener múltiples versiones.

Cada versión pertenece únicamente a una receta.

La entidad Recipe mantiene una referencia a la versión actual mediante el atributo `currentVersionId`.

---

## RecipeVersion → RecipeIngredient

Relación uno a muchos.

Cada versión contiene su propia colección de ingredientes.

---

## RecipeVersion → RecipeStep

Relación uno a muchos.

Cada versión contiene su propia secuencia de pasos.

---

## RecipeVersion → Photo

Relación uno a muchos.

Cada versión puede contener varias fotografías del resultado obtenido.

---

# 5.6 Flujo de creación de versiones

Cuando el usuario crea una receta se genera automáticamente la primera versión.

```
Recipe

↓

RecipeVersion v1
```

Cuando el usuario desea mejorar una receta:

1. La aplicación carga la versión actual.
2. El usuario modifica ingredientes, pasos o cualquier otro dato.
3. Introduce un resumen de los cambios realizados.
4. Puede añadir notas y una valoración.
5. Se crea una nueva versión.
6. La receta pasa a apuntar a esa nueva versión mediante `currentVersionId`.

Las versiones anteriores nunca se modifican.

---

# 5.7 Historial de evolución

Cada receta mantiene un historial completo de versiones.

Ejemplo:

```
Tortilla de patatas

v4 ⭐⭐⭐⭐⭐

↓

v3 ⭐⭐⭐⭐☆

↓

v2 ⭐⭐⭐☆☆

↓

v1 ⭐⭐☆☆☆
```

Cada versión almacena:

- Los ingredientes utilizados.
- Los pasos seguidos.
- Las fotografías.
- El resumen de cambios.
- Las notas personales.
- La valoración obtenida.

Esto permite reconstruir en cualquier momento cualquier estado anterior de la receta.

---

# 5.8 Decisiones de diseño

Durante el diseño del modelo de datos se valoraron distintas alternativas.

## Intentos de cocina

Inicialmente se consideró modelar cada preparación como un intento independiente.

Finalmente se descartó esta opción porque el objetivo principal de la aplicación no es registrar todas las veces que un usuario cocina una receta, sino conservar únicamente aquellas modificaciones que aportan aprendizaje.

Cada nueva versión representa una mejora sobre la receta anterior.

---

## Versiones completas

Cada versión almacena una copia completa de la receta.

Aunque este enfoque implica cierta duplicación de información, ofrece importantes ventajas:

- Simplicidad de implementación.
- Consultas más rápidas.
- Historial completamente inmutable.
- Posibilidad de recuperar cualquier versión sin reconstruir diferencias.

Esta decisión prioriza la claridad del modelo sobre la optimización prematura del almacenamiento.

---

# 5.9 Evolución futura

El modelo se ha diseñado para facilitar futuras ampliaciones.

Entre ellas:

- Restaurar versiones anteriores creando una nueva versión basada en una existente.
- Comparar dos versiones de una misma receta.
- Compartir versiones concretas.
- Estadísticas de evolución.
- Exportación del historial completo.

La estructura actual permite incorporar estas funcionalidades sin modificar el diseño fundamental del dominio.