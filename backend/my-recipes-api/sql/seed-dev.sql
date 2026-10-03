
--SELECT seeds.seed_example_recipes('6199706b-aed7-4d14-b5b4-6fa014f7b714');


-- =============================================================================
-- Datos de prueba para desarrollo — my-recipes-api
-- =============================================================================
-- 2 recetas con 3 versiones cada una (6 versiones en total).
--
-- CÓMO USARLO
--   1. Abre el SQL Editor de Supabase.
--   2. Edita UNA sola vez v_user_id al principio de este archivo con tu UUID.
--      Si no lo cambias, el script aborta con un error explicito.
--   3. Ejecuta este archivo entero.
--   4. Al final hay dos SELECT de verificacion con las URLs de las recetas.
--
-- ES RE-EJECUTABLE
--   Cada ejecucion borra las 2 recetas de prueba (identificadas por sus UUID
--   fijos) y las vuelve a crear. No duplica nada y no falla al releerlo.
--   OJO: si editas estas recetas desde la app y relanzas el script, se pierden
--   esos cambios. Es intencionado: el script tambien sirve para resetear.
--   No toca ninguna otra receta que tengas en la base de datos.
--
-- NOTAS DEL ESQUEMA QUE ESTE SCRIPT TIENE EN CUENTA
--   - PostgreSQL (Supabase). spring.jpa.hibernate.ddl-auto=none: el esquema
--     se gestiona a mano, asi que este script debe mantener la forma exacta
--     de las entidades.
--   - Los 6 IDs son GenerationType.UUID. NO hay secuencia ni default en la
--     BD, asi que hay que inventar cada UUID a mano (ver tabla de IDs abajo).
--   - recipes.user_id y recipes.current_version_id NO tienen FK. Un valor
--     equivocado no lo detecta la BD y se manifiesta como 404 en la API.
--     Por eso el script valida v_user_id al principio.
--   - Las 4 FKs reales son: recipe_versions.recipe_id y los tres
--     recipe_version_id (ingredients, steps, photos). Sin ON DELETE CASCADE,
--     por eso el reset borra en orden inverso.
--   - created_at / updated_at son NOT NULL y los rellena JPA auditing, que
--     el SQL no ejecuta: los aporta este script.
--   - Asimetria de nombres: ingredientes usan "order_index", pasos usan
--     "step_order" (no "order", que es palabra reservada).
--   - quantity es numeric(38,2): maximo 2 decimales.
--   - photos.url es varchar(255) en la BD aunque la API admita 1000.
--   - recipes.favorite es boolean y recipes.status es varchar(20). Las dos
--     columnas las anade sql/recipe-status.sql, que hay que ejecutar ANTES que
--     este script. STATUS validos: EVOLUCION, DEFINITIVA (el enum Java es
--     org.mendez.mr.myrecipesapi.enums.RecipeStatus). Aqui se siembran con
--     valores distintos a proposito, para que los filtros del listado tengan
--     algo que enseñar: una definitiva y favorita, otra en evolucion.
--
-- TABLA DE UUIDS (patron <N>a000000-...-0000000<vv><ii>)
--   Receta 1  ....... 11111111-1111-4111-8111-000000000001
--   Receta 2  ....... 22222222-2222-4222-8222-000000000002
--   Version   ....... <N>a000000-0000-4000-8000-0000000000<vv>
--   Ingrediente ...... <N>a000000-0000-4000-9000-00000000<vv><ii>
--   Paso      ....... <N>a000000-0000-4000-a000-00000000<vv><ss>
--   <N> = 1 o 2 (receta), <vv> = numero de version (01..03), <ii>/<ss>
--   = indice dentro de esa version (01..). Los digitos altos codifican la
--   version para que cada hijo tenga UUID propio y no colisione al reiniciar.
--
-- NOTA: este script NO siembra fotos. La tabla photos y su lectura por la API
-- ya funcionan, pero la funcionalidad todavia no esta desplegada, asi que aqui
-- se deja vacia a proposito.
--
-- CATEGORIAS VALIDAS: STARTER, MAIN_COURSE, DESSERT, DRINK, SAUCE, OTHER
-- =============================================================================


DO $$
DECLARE
    -- =======================================================================
    --  >>>  UNICO PUNTO A EDITAR  <<<
    --  Tu UUID de users.id. Consiguuelo con:  select id, email from users;
    -- =======================================================================
    v_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;

    v_recetas integer;
    v_vers    integer;
    v_ing     integer;
    v_steps   integer;
BEGIN

    -- -------------------------------------------------------------------------
    -- 0) Validacion del usuario (importante: recipes.user_id no tiene FK)
    -- -------------------------------------------------------------------------
    IF v_user_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
        RAISE EXCEPTION
            'Edita v_user_id al principio de este script con tu UUID de users.id';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_user_id) THEN
        RAISE EXCEPTION
            'No existe ningun usuario con id %.', v_user_id
            USING HINT = 'Ejecuta SELECT id, email FROM users; y copia el id correcto en v_user_id.';
    END IF;


    -- -------------------------------------------------------------------------
    -- 1) RESET de las 2 recetas de prueba (idempotencia)
    --    Solo se borran las recetas con UUID fijo de este script.
    --    Orden inverso al de las FKs: ingredients, steps, versions, recipes.
    --
    --    El DELETE de photos es preventivo: este script no crea fotos, pero si
    --    alguna vez se le anaden a mano a estas recetas, sin esta linea el
    --    borrado de recipe_versions fallaria por violacion de FK.
    --    Se puede quitar sin mas si prefieres el script minimo.
    -- -------------------------------------------------------------------------
    DELETE FROM photos p
        USING recipe_versions v
        WHERE p.recipe_version_id = v.id
          AND v.recipe_id IN ('11111111-1111-4111-8111-000000000001',
                              '22222222-2222-4222-8222-000000000002');

    DELETE FROM recipe_ingredients i
        USING recipe_versions v
        WHERE i.recipe_version_id = v.id
          AND v.recipe_id IN ('11111111-1111-4111-8111-000000000001',
                              '22222222-2222-4222-8222-000000000002');

    DELETE FROM recipe_steps s
        USING recipe_versions v
        WHERE s.recipe_version_id = v.id
          AND v.recipe_id IN ('11111111-1111-4111-8111-000000000001',
                              '22222222-2222-4222-8222-000000000002');

    DELETE FROM recipe_versions
        WHERE recipe_id IN ('11111111-1111-4111-8111-000000000001',
                            '22222222-2222-4222-8222-000000000002');

    DELETE FROM recipes
        WHERE id IN ('11111111-1111-4111-8111-000000000001',
                     '22222222-2222-4222-8222-000000000002');


    -- -------------------------------------------------------------------------
    -- 2) RECETAS
    --    current_version_id se deja NULL y se fija en el paso 4 (la v3), igual
    --    que hace RecipeServiceImpl tras crear la version.
    --    updated_at va escalonado porque el listado se ordena updated_at DESC.
    -- -------------------------------------------------------------------------
    INSERT INTO recipes (id, user_id, title, description, category,
                         favorite, status,
                         current_version_id, created_at, updated_at) VALUES
        ('11111111-1111-4111-8111-000000000001', v_user_id,
         'Tortilla de patatas',
         'Tortilla de patatas española, jugosa por dentro y dorada por fuera. Ración para 4 personas.',
         'MAIN_COURSE',
         true, 'DEFINITIVA',
         NULL,
         now() - interval '45 days', now() - interval '2 days'),

        ('22222222-2222-4222-8222-000000000002', v_user_id,
         'Salsa verde',
         'Salsa verde de perejil y alcaparras. Perfecta para pescado a la plancha o patatas fritas.',
         'SAUCE',
         false, 'EVOLUCION',
         NULL,
         now() - interval '60 days', now() - interval '10 days');


    -- -------------------------------------------------------------------------
    -- 3) VERSIONES
    --    version_number arranca en 1 y sube de uno en uno.
    --    Cada version guarda una copia COMPLETA de sus ingredientes y pasos
    --    (no son delta), con order_index / step_order 1-based y contiguos.
    --    El rating se deja a NULL hasta la v3: el DTO valida rango 1..10.
    -- -------------------------------------------------------------------------
    INSERT INTO recipe_versions (id, recipe_id, version_number, summary_changes,
                                 notes, rating, created_at) VALUES
        -- Receta 1
        ('a1000000-0000-4000-8000-000000000001',
         '11111111-1111-4111-8111-000000000001', 1,
         'Versión inicial', NULL, NULL,
         now() - interval '45 days'),

        ('a1000000-0000-4000-8000-000000000002',
         '11111111-1111-4111-8111-000000000001', 2,
         'Más patatas y se añade el paso de reposo para que quede más jugosa',
         NULL, NULL,
         now() - interval '30 days'),

        ('a1000000-0000-4000-8000-000000000003',
         '11111111-1111-4111-8111-000000000001', 3,
         'Ración ajustada a 4 personas y notas de cocción',
         'Usar fuego medio-bajo al cuajar. Si aprietas con la sartén queda seca.',
         9,
         now() - interval '2 days'),

        -- Receta 2
        ('a2000000-0000-4000-8000-000000000001',
         '22222222-2222-4222-8222-000000000002', 1,
         'Versión inicial', NULL, NULL,
         now() - interval '60 days'),

        ('a2000000-0000-4000-8000-000000000002',
         '22222222-2222-4222-8222-000000000002', 2,
         'Se añaden las alcaparras para el punto salado',
         NULL, NULL,
         now() - interval '45 days'),

        ('a2000000-0000-4000-8000-000000000003',
         '22222222-2222-4222-8222-000000000002', 3,
         'Sustituido parte del aceite por vinagre para emulsionar',
         'Triturar en vaso alto: con batidora de vaso emulsiona bastante mejor.',
         8,
         now() - interval '10 days');


    -- -------------------------------------------------------------------------
    -- 4) Apuntar current_version_id a la ultima version (la v3)
    -- -------------------------------------------------------------------------
    UPDATE recipes SET current_version_id = 'a1000000-0000-4000-8000-000000000003'
        WHERE id = '11111111-1111-4111-8111-000000000001';

    UPDATE recipes SET current_version_id = 'a2000000-0000-4000-8000-000000000003'
        WHERE id = '22222222-2222-4222-8222-000000000002';


    -- -------------------------------------------------------------------------
    -- 5) INGREDIENTES
    --    unit es texto libre: no hay tabla de unidades ni enum.
    -- -------------------------------------------------------------------------
    INSERT INTO recipe_ingredients (id, recipe_version_id, name, quantity, unit, order_index) VALUES
        -- Receta 1 · v1 (4 ingredientes, version escueta)
        ('a1000000-0000-4000-9000-000000000101', 'a1000000-0000-4000-8000-000000000001', 'Patatas',            500.00, 'g',  1),
        ('a1000000-0000-4000-9000-000000000102', 'a1000000-0000-4000-8000-000000000001', 'Huevos',             5.00, 'ud', 2),
        ('a1000000-0000-4000-9000-000000000103', 'a1000000-0000-4000-8000-000000000001', 'Cebolla',            1.00, 'ud', 3),
        ('a1000000-0000-4000-9000-000000000104', 'a1000000-0000-4000-8000-000000000001', 'Aceite de oliva',  150.00, 'ml', 4),

        -- Receta 1 · v2 (6 ingredientes, anade sal y perejil)
        ('a1000000-0000-4000-9000-000000000201', 'a1000000-0000-4000-8000-000000000002', 'Patatas',            500.00, 'g',  1),
        ('a1000000-0000-4000-9000-000000000202', 'a1000000-0000-4000-8000-000000000002', 'Huevos',             6.00, 'ud', 2),
        ('a1000000-0000-4000-9000-000000000203', 'a1000000-0000-4000-8000-000000000002', 'Cebolla',            1.00, 'ud', 3),
        ('a1000000-0000-4000-9000-000000000204', 'a1000000-0000-4000-8000-000000000002', 'Aceite de oliva',  150.00, 'ml', 4),
        ('a1000000-0000-4000-9000-000000000205', 'a1000000-0000-4000-8000-000000000002', 'Sal',                5.00, 'g',  5),
        ('a1000000-0000-4000-9000-000000000206', 'a1000000-0000-4000-8000-000000000002', 'Perejil picado',    10.00, 'g',  6),

        -- Receta 1 · v3 (6 ingredientes, racion ajustada)
        ('a1000000-0000-4000-9000-000000000301', 'a1000000-0000-4000-8000-000000000003', 'Patatas',            600.00, 'g',  1),
        ('a1000000-0000-4000-9000-000000000302', 'a1000000-0000-4000-8000-000000000003', 'Huevos',             6.00, 'ud', 2),
        ('a1000000-0000-4000-9000-000000000303', 'a1000000-0000-4000-8000-000000000003', 'Cebolla',            1.00, 'ud', 3),
        ('a1000000-0000-4000-9000-000000000304', 'a1000000-0000-4000-8000-000000000003', 'Aceite de oliva',  150.00, 'ml', 4),
        ('a1000000-0000-4000-9000-000000000305', 'a1000000-0000-4000-8000-000000000003', 'Sal',                5.00, 'g',  5),
        ('a1000000-0000-4000-9000-000000000306', 'a1000000-0000-4000-8000-000000000003', 'Perejil picado',    10.00, 'g',  6),

        -- Receta 2 · v1 (2 ingredientes)
        ('a2000000-0000-4000-9000-000000000101', 'a2000000-0000-4000-8000-000000000001', 'Perejil fresco',    30.00, 'g',  1),
        ('a2000000-0000-4000-9000-000000000102', 'a2000000-0000-4000-8000-000000000001', 'Aceite de oliva',  150.00, 'ml', 2),

        -- Receta 2 · v2 (3 ingredientes, anade alcaparras)
        ('a2000000-0000-4000-9000-000000000201', 'a2000000-0000-4000-8000-000000000002', 'Perejil fresco',    30.00, 'g',  1),
        ('a2000000-0000-4000-9000-000000000202', 'a2000000-0000-4000-8000-000000000002', 'Alcaparras',        20.00, 'g',  2),
        ('a2000000-0000-4000-9000-000000000203', 'a2000000-0000-4000-8000-000000000002', 'Aceite de oliva',  150.00, 'ml', 3),

        -- Receta 2 · v3 (3 ingredientes, parte del aceite pasa a vinagre)
        ('a2000000-0000-4000-9000-000000000301', 'a2000000-0000-4000-8000-000000000003', 'Perejil fresco',    30.00, 'g',  1),
        ('a2000000-0000-4000-9000-000000000302', 'a2000000-0000-4000-8000-000000000003', 'Alcaparras',        20.00, 'g',  2),
        ('a2000000-0000-4000-9000-000000000303', 'a2000000-0000-4000-8000-000000000003', 'Vinagre de vino',   15.00, 'ml', 3);
    GET DIAGNOSTICS v_ing = ROW_COUNT;


    -- -------------------------------------------------------------------------
    -- 6) PASOS
    --    OJO: la columna es step_order, no order.
    -- -------------------------------------------------------------------------
    INSERT INTO recipe_steps (id, recipe_version_id, step_order, description) VALUES
        -- Receta 1 · v1
        ('a1000000-0000-4000-a000-000000000101', 'a1000000-0000-4000-8000-000000000001',
         1, 'Pelar las patatas y la cebolla y cortarlas en láminas finas.'),
        ('a1000000-0000-4000-a000-000000000102', 'a1000000-0000-4000-8000-000000000001',
         2, 'Pochar las patatas y la cebolla en el aceite a fuego medio durante 15 minutos.'),
        ('a1000000-0000-4000-a000-000000000103', 'a1000000-0000-4000-8000-000000000001',
         3, 'Escurrir, mezclar con el huevo batido y cuajar en la sartén.'),

        -- Receta 1 · v2
        ('a1000000-0000-4000-a000-000000000201', 'a1000000-0000-4000-8000-000000000002',
         1, 'Pelar las patatas y la cebolla y cortarlas en láminas finas.'),
        ('a1000000-0000-4000-a000-000000000202', 'a1000000-0000-4000-8000-000000000002',
         2, 'Pochar las patatas y la cebolla en el aceite a fuego medio durante 15 minutos.'),
        ('a1000000-0000-4000-a000-000000000203', 'a1000000-0000-4000-8000-000000000002',
         3, 'Escurrir muy bien el refrito y dejar templar 5 minutos.'),
        ('a1000000-0000-4000-a000-000000000204', 'a1000000-0000-4000-8000-000000000002',
         4, 'Batir los huevos con la sal y mezclar con las patatas.'),
        ('a1000000-0000-4000-a000-000000000205', 'a1000000-0000-4000-8000-000000000002',
         5, 'Cuajar en sartén antiadherente a fuego medio-bajo, 3 minutos por cara.'),

        -- Receta 1 · v3
        ('a1000000-0000-4000-a000-000000000301', 'a1000000-0000-4000-8000-000000000003',
         1, 'Pelar las patatas y la cebolla y cortarlas en láminas finas.'),
        ('a1000000-0000-4000-a000-000000000302', 'a1000000-0000-4000-8000-000000000003',
         2, 'Pochar las patatas y la cebolla en el aceite a fuego medio durante 15 minutos.'),
        ('a1000000-0000-4000-a000-000000000303', 'a1000000-0000-4000-8000-000000000003',
         3, 'Escurrir muy bien el refrito y dejar templar 5 minutos.'),
        ('a1000000-0000-4000-a000-000000000304', 'a1000000-0000-4000-8000-000000000003',
         4, 'Batir los huevos con la sal y mezclar con las patatas y el perejil.'),
        ('a1000000-0000-4000-a000-000000000305', 'a1000000-0000-4000-8000-000000000003',
         5, 'Cuajar en sartén antiadherente a fuego medio-bajo, 3 minutos por cara.'),
        ('a1000000-0000-4000-a000-000000000306', 'a1000000-0000-4000-8000-000000000003',
         6, 'Dejar reposar 10 minutos antes de servir.'),

        -- Receta 2 · v1
        ('a2000000-0000-4000-a000-000000000101', 'a2000000-0000-4000-8000-000000000001',
         1, 'Limpiar el perejil y escurrirlo bien.'),
        ('a2000000-0000-4000-a000-000000000102', 'a2000000-0000-4000-8000-000000000001',
         2, 'Triturar el perejil con el aceite hasta obtener una salsa fina.'),

        -- Receta 2 · v2
        ('a2000000-0000-4000-a000-000000000201', 'a2000000-0000-4000-8000-000000000002',
         1, 'Limpiar el perejil y escurrirlo bien.'),
        ('a2000000-0000-4000-a000-000000000202', 'a2000000-0000-4000-8000-000000000002',
         2, 'Escurrir las alcaparras para que no aporten demasiada sal.'),
        ('a2000000-0000-4000-a000-000000000203', 'a2000000-0000-4000-8000-000000000002',
         3, 'Triturar el perejil con las alcaparras y el aceite.'),

        -- Receta 2 · v3
        ('a2000000-0000-4000-a000-000000000301', 'a2000000-0000-4000-8000-000000000003',
         1, 'Limpiar el perejil y escurrirlo bien.'),
        ('a2000000-0000-4000-a000-000000000302', 'a2000000-0000-4000-8000-000000000003',
         2, 'Escurrir las alcaparras para que no apporten demasiada sal.'),
        ('a2000000-0000-4000-a000-000000000303', 'a2000000-0000-4000-8000-000000000003',
         3, 'Triturar todo con el vinagre y el aceite hasta emulsionar.');
    GET DIAGNOSTICS v_steps = ROW_COUNT;


    -- -------------------------------------------------------------------------
    -- 7) Resumen (contadores leidos del propio script, no escritos a mano)
    -- -------------------------------------------------------------------------
    SELECT count(*) INTO v_recetas
      FROM recipes WHERE id IN ('11111111-1111-4111-8111-000000000001',
                                '22222222-2222-4222-8222-000000000002');

    SELECT count(*) INTO v_vers
      FROM recipe_versions WHERE recipe_id IN ('11111111-1111-4111-8111-000000000001',
                                               '22222222-2222-4222-8222-000000000002');

    RAISE NOTICE 'Seed OK para el usuario %: % recetas, % versiones, % ingredientes, % pasos.',
                 v_user_id, v_recetas, v_vers, v_ing, v_steps;

END $$;


-- =============================================================================
-- VERIFICACION
-- Ejecuta esto por separado (o junto al script) para comprobar el resultado.
-- Sustituye <TU_UUID> por el mismo v_user_id que pusiste arriba.
-- =============================================================================

-- 8.1 Contenido por receta (debe ser: 2 filas, 3 versiones cada una)
SELECT r.title,
       r.category,
       (r.current_version_id IS NOT NULL)         AS tiene_version_actual,
       COUNT(DISTINCT v.id)                       AS versiones,
       COUNT(DISTINCT i.id)                       AS ingredientes,
       COUNT(DISTINCT s.id)                       AS pasos
  FROM recipes r
  LEFT JOIN recipe_versions     v ON v.recipe_id          = r.id
  LEFT JOIN recipe_ingredients i ON i.recipe_version_id  = v.id
  LEFT JOIN recipe_steps        s ON s.recipe_version_id  = v.id
 WHERE r.user_id = '<TU_UUID>'::uuid
 GROUP BY r.id, r.title, r.category, r.current_version_id
 ORDER BY r.title;

-- 8.2 URLs para probar la API a mano
SELECT r.id            AS recipe_id,
       r.title,
       r.category,
       r.current_version_id,
       r.created_at,
       r.updated_at
  FROM recipes r
 WHERE r.user_id = '<TU_UUID>'::uuid
 ORDER BY r.updated_at DESC;

-- Con esos dos UUID puedes probar directamente:
--   GET /api/v1/recipes
--   GET /api/v1/recipes/{recipe_id}/versions/current
--   GET /api/v1/recipes/{recipe_id}/versions