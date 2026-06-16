# Módulo: Tareas

Vista Kanban de tareas del equipo. Tres columnas: Pendiente / En progreso / Completada.

## Archivos

```
src/modules/tareas/
  types.ts                    — interface Tarea, ESTADOS_TAREA, PRIORIDADES_TAREA, helpers
  queries.ts                  — escucharTareas, crearTarea, actualizarTarea, eliminarTarea, escucharTareasDeProyecto
  components/
    TareaModal.tsx            — modal para crear/editar tarea
    TareaCard.tsx             — tarjeta de tarea en el kanban
    KanbanColumn.tsx          — columna del kanban (recibe estado + tareas)
  index.ts                    — barrel export público
src/app/tareas/page.tsx       — shell: orquesta estado y compone componentes del módulo
```

## Colección Firestore: `tareas`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `titulo` | string | Obligatorio |
| `descripcion` | string | Opcional |
| `estado` | "pendiente" \| "en_progreso" \| "completada" | |
| `prioridad` | "alta" \| "media" \| "baja" | |
| `asignado` | string | Nombre del responsable |
| `creadoPor` | string | Nombre de quien creó (localStorage) |
| `fechaVencimiento` | string \| null | Formato YYYY-MM-DD |
| `proyectoId` | string \| null | Si pertenece a un proyecto |
| `creadoEn` | Timestamp | serverTimestamp() |

## Patrones clave

- `escucharTareasDeProyecto` usa `where` sin `orderBy` (evita índice compuesto); ordena en cliente
- La página NO importa desde `@/lib/firebase` — solo desde `@/modules/tareas/queries`
- `KanbanColumn` define los iconos por estado localmente; `types.ts` no tiene JSX
- Cambiar estado de una tarea: `actualizarTarea(id, { estado })`

## Agregar al proyecto

1. Tarea ya está activa en `milpa.config.ts → modulos`
2. Para nuevo cliente: agregar `"tareas"` al array `modulos` en `milpa.config.ts`
3. Migración SQL: `supabase/migrations/002_tareas.sql`
