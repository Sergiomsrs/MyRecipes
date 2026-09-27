-- =============================================================================
-- Verificación del esquema de Supabase frente a las entidades JPA
-- Solo lectura. Ejecutar en el SQL Editor de Supabase y pegar la salida.
-- =============================================================================

-- 1) Tablas existentes del esquema público
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

-- 2) Columnas, tipos y nulabilidad de las tablas de la API
select c.table_name,
       c.column_name,
       c.data_type,
       c.character_maximum_length,
       c.numeric_precision,
       c.numeric_scale,
       c.is_nullable,
       c.column_default
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name in ('users', 'recipes', 'recipe_versions', 'recipe_ingredients',
                       'recipe_steps', 'photos')
order by c.table_name, c.ordinal_position;

-- 3) Restricciones (PK, FK, UNIQUE, CHECK)
select tc.table_name,
       tc.constraint_name,
       tc.constraint_type,
       string_agg(kcu.column_name, ', ' order by kcu.ordinal_position) as columns,
       ccu.table_name  as references_table,
       ccu.column_name as references_column,
       pg_get_constraintdef(con.oid) as definition
from information_schema.table_constraints tc
         left join information_schema.key_column_usage kcu
                   on tc.constraint_name = kcu.constraint_name
                       and tc.table_schema = kcu.table_schema
         left join information_schema.constraint_column_usage ccu
                   on tc.constraint_name = ccu.constraint_name
                       and tc.table_schema = ccu.table_schema
         left join pg_constraint con
                   on con.conname = tc.constraint_name
                       and con.connamespace = tc.table_schema::regnamespace
where tc.table_schema = 'public'
  and tc.table_name in ('users', 'recipes', 'recipe_versions', 'recipe_ingredients',
                        'recipe_steps', 'photos')
group by tc.table_name, tc.constraint_name, tc.constraint_type, ccu.table_name,
         ccu.column_name, con.oid
order by tc.table_name, tc.constraint_type, tc.constraint_name;

-- 4) Índices (incluidos los únicos)
select tablename,
       indexname,
       indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('users', 'recipes', 'recipe_versions', 'recipe_ingredients',
                    'recipe_steps', 'photos')
order by tablename, indexname;

-- 5) Volumen por tabla. Si una tabla no existe se avisa en lugar de fallar.
do $$
declare
    t text;
    n bigint;
begin
    foreach t in array array['users', 'recipes', 'recipe_versions',
                             'recipe_ingredients', 'recipe_steps', 'photos']
        loop
            if exists (select 1
                       from information_schema.tables
                       where table_schema = 'public' and table_name = t)
            then
                execute format('select count(*) from %I', t) into n;
                raise notice 'tabla %: % filas', t, n;
            else
                raise notice 'tabla %: NO EXISTE', t;
            end if;
        end loop;
end $$;
