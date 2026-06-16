# Módulo: Proyectos

Gestión de proyectos con vista de panel izquierdo (lista) + panel derecho (detalle en tabs). Cada proyecto tiene Info, Módulos, Puntos y Tareas.

## Archivos

```
src/modules/proyectos/
  types.ts                    — Proyecto, PuntoProyecto, ModuloProyecto, constantes, helpers
  queries.ts                  — CRUD para proyectos, puntos_proyecto, modulos_proyecto
  components/
    ProyectoModal.tsx         — modal crear/editar proyecto
    InfoTab.tsx               — tab de información general
    ModulosTab.tsx            — tab de módulos requeridos (con toggle de estado)
    PuntosTab.tsx             — tab de checklist de puntos
    TareasTab.tsx             — tab de tareas del proyecto (importa desde módulo Tareas)
  index.ts                    — barrel export público
src/app/proyectos/page.tsx    — shell: layout dos paneles, tabs, confirmación de eliminación
```

## Colecciones Firestore

### `proyectos`
| Campo | Tipo |
|-------|------|
| `nombre`, `cliente`, `ubicacion`, `industria`, `descripcion` | string |
| `estado` | "activo" \| "en_desarrollo" \| "completado" \| "pausado" |
| `creadoPor`, `creadoEn` | string, Timestamp |

### `puntos_proyecto`
| Campo | Tipo |
|-------|------|
| `proyectoId` | string — FK al proyecto |
| `titulo`, `descripcion` | string |
| `completado` | boolean |
| `creadoPor`, `creadoEn` | string, Timestamp |

### `modulos_proyecto`
| Campo | Tipo |
|-------|------|
| `proyectoId` | string — FK al proyecto |
| `nombre`, `descripcion` | string |
| `estado` | "pendiente" \| "en_desarrollo" \| "completado" |

## Patrones clave

- Las queries de puntos y módulos usan `where("proyectoId", "==", id)` SIN `orderBy` (evita índice compuesto); se ordenan en cliente
- `TareasTab` importa queries y tipos directamente desde `@/modules/tareas/` — las tareas de proyecto son del módulo Tareas con `proyectoId` asignado
- `PuntoItem` y `TareaProyectoCard` son sub-componentes privados dentro de sus Tab files
- Confirmación de eliminación: dos pasos (estado `confirmDelete` en la página)

## Agregar al proyecto

1. Agregar `"proyectos"` al array `modulos` en `milpa.config.ts`
2. Migración SQL: `supabase/migrations/004_proyectos.sql`
