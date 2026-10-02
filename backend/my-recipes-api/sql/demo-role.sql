-- =============================================================================
-- Cuenta demo: columna role — my-recipes-api
-- =============================================================================
-- Añade el rol a users. Es el unico sitio donde se crea el usuario demo: el
-- registro público (/api/auth/register) SIEMPRE crea usuarios USER, asi que el
-- rol DEMO se asigna a mano.
--
-- CÓMO USARLO
--   1. Ejecuta el BLOQUE 1 en el SQL Editor de Supabase.
--   2. Crea el usuario demo desde la app (login normal) o con un INSERT.
--   3. Descomenta y ajusta el UPDATE del BLOQUE 2 con ese email.
--   4. Asigna a ese usuario las recetas de ejemplo que quieras mostrar.
--
-- NOTAS DEL ESQUEMA
--   - spring.jpa.hibernate.ddl-auto=none: la aplicacion no crea ni modifica
--     tablas, este script es el unico que puede anadir la columna.
--   - El DEFAULT 'USER' deja a las cuentas existentes como USER sin tocarlas:
--     en PostgreSQL anadir una columna NOT NULL con DEFAULT rellena las filas
--     ya presentes con ese valor.
--   - users.role es varchar(20). El enum Java es org.mendez.mr.myrecipesapi.enums.Role
--     (@Enumerated(EnumType.STRING)), asi que el texto de la BD y el del enum
--     tienen que coincidir exactamente. El CHECK lo blinda.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- BLOQUE 1. Esquema (ejecútalo una sola vez)
-- -----------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN role varchar(20) NOT NULL DEFAULT 'USER';
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('USER', 'DEMO'));


-- -----------------------------------------------------------------------------
-- BLOQUE 2. Promover a demo. DESCOMENTA y Pon tu email.
-- -----------------------------------------------------------------------------
-- UPDATE users SET role = 'DEMO' WHERE email = 'demo@myrecipes.app';


-- -----------------------------------------------------------------------------
-- VERIFICACIÓN (solo lectura)
-- -----------------------------------------------------------------------------
-- Los roles que hay ahora mismo:
-- SELECT id, email, role FROM users ORDER BY role, email;

-- Comprobación de que ningún usuario se quedó sin rol (no debe salir ninguna fila):
-- SELECT id, email FROM users WHERE role IS NULL;