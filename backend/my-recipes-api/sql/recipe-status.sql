-- =============================================================================
-- Recetas: columnas favorite y status — my-recipes-api
-- =============================================================================
-- Añade los dos campos que sostienen los filtros del listado (Todas / En
-- evolución / Versión definitiva / Favoritas) y el selector de estado del
-- editor. Antes de este script los filtros noTenian backing: seapproximaban
-- por categoría y por subcadena del título.
--
-- CÓMO USERLO
--   1. Ejecuta el BLOQUE 1 en el SQL Editor de Supabase ANTES de desplegar
--      el backend. Es el orden obligatorio, ver la nota de ddl-auto abajo.
--   2. Si ya lo has ejecutado, vuelve a lanzarlo: la segunda vez falla con
--      "columna ya existe". Eso es inofensivo, la primera parte ya esta hecha.
--
-- NOTAS DEL ESQUEMA
--   - spring.jpa.hibernate.ddl-auto=update (application.properties:10). Con
--     ddl-auto=update, Hibernate tambien puede anadir las columnas el solo, y
--     sus ALTER llevan el DEFAULT dentro del columnDefinition de Recipe.java
--     precisamente para que eso funcione sobre una tabla con filas.
--     Este script sigue siendo la via recomendada: deja las recetas en un estado
--     conocido y no depende de que Hibernate haya arrancado bien.
--   - Por que el DEFAULT es obligatorio en cualquier caso: en PostgreSQL un
--     ALTER TABLE ADD COLUMN NOT NULL sin DEFAULT aborta si la tabla tiene
--     filas, y recipes ya tiene recetas. Con DEFAULT, las filas existentes
--     quedan en false / EVOLUCION, que es el estado inicial correcto.
--   - Si Hibernate fallo al actualizar el esquema, lo loguea como WARNING y la
--     aplicacion arranca igual. El error solo aflora en el primer SELECT sobre
--     recipes, como un 500 con "Internal server error". Si te pasa eso, mira la
--     linea "Error no controlado" en la consola del backend: ahi sale la
--     excepcion de verdad, porque server.error.include-message=never oculta el
--     mensaje al cliente.
--   - favorite es boolean: no necesita CHECK, PostgreSQL solo admite true/false.
--   - recipes.status es varchar(20). El enum Java es
--     org.mendez.mr.myrecipesapi.enums.RecipeStatus (@Enumerated(EnumType.STRING)),
--     asi que el texto de la BD y el del enum tienen que coincidir exactamente.
--     El CHECK lo blinda. Los valores validos son EVOLUCION y DEFINITIVA.
--   - favorite y status son ortogonales: una receta puede ser definitiva y
--     favorita a la vez. Por eso son dos columnas y no un unico enum.
--   - Cuando se crea una version nueva de una receta, RecipeServiceImpl la
--     devuelve a EVOLUCION. No hace falta ningun trigger: lo hace la aplicacion.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- BLOQUE 1. Esquema (ejecútalo una sola vez)
-- -----------------------------------------------------------------------------
ALTER TABLE recipes ADD COLUMN favorite boolean NOT NULL DEFAULT false;
ALTER TABLE recipes ADD COLUMN status varchar(20) NOT NULL DEFAULT 'EVOLUCION';
ALTER TABLE recipes ADD CONSTRAINT recipes_status_check CHECK (status IN ('EVOLUCION', 'DEFINITIVA'));


-- -----------------------------------------------------------------------------
-- VERIFICACIÓN (solo lectura)
-- -----------------------------------------------------------------------------
-- Las recetas que hay ahora mismo y como quedaron clasificadas:
-- SELECT title, category, favorite, status FROM recipes ORDER BY updated_at DESC;

-- Reparto por estado (deberia coincidir con los contadores de los filtros):
-- SELECT status, count(*) FROM recipes GROUP BY status ORDER BY status;

-- Cuantas favoritas hay:
-- SELECT count(*) AS favoritas FROM recipes WHERE favorite;