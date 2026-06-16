# Módulo: Calendario

Vista mensual de calendario. Muestra las tareas con fecha de vencimiento como puntos de color. Panel derecho con el detalle del día seleccionado.

## Archivos

```
src/modules/calendario/
  types.ts                    — MESES, DIAS_SEMANA, toKey(), todayKey()
  queries.ts                  — re-exporta escucharTareas desde módulo Tareas
  index.ts                    — barrel export
src/app/calendario/page.tsx   — toda la UI: grid mensual + panel de día
```

## Datos

- **No tiene colección propia en Firestore.** Consume `tareas` a través del módulo de Tareas.
- Filtra por `t.fechaVencimiento` para construir el `tareasPorDia` record.
- Tareas sin `fechaVencimiento` no aparecen en el calendario.

## Puntos de color por prioridad

```
alta  → bg-red-400
media → bg-amber-400
baja  → bg-emerald-500
```

## Patrones clave

- `toKey(año, mes, dia)` genera el string `YYYY-MM-DD` que sirve como key del record
- El grid calcula `startDow` con lunes como primer día: `(primerDia.getDay() + 6) % 7`
- Alertas de tareas vencidas: `AlertCircle` visible si hay tarea no completada con fecha < hoy

## Agregar al proyecto

1. Agregar `"calendario"` al array `modulos` en `milpa.config.ts`
2. Este módulo no tiene migración SQL propia (depende de tareas)
