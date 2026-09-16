# Agents

## Compilación y tests

Las compilaciones y pruebas de funcionamiento se realizan de forma manual por el desarrollador. No ejecutar `npm run build`, `npm run lint`, `npm run dev` ni comandos similares automáticamente.

## Ejecución de comandos

Antes de solicitar permiso para ejecutar cualquier comando bash, el agente debe explicar brevemente:
- **Para qué sirve** el comando que va a ejecutar
- **Por qué es necesario** en el contexto de la tarea actual

Ejemplo correcto:
> Necesito ejecutar `npm run build` para verificar que los cambios no rompen la compilación. Quieres que lo ejecute?

Ejemplo incorrecto:
> Ejecuto `npm run build`.
