# supabase/ — Migraciones SQL para Supabase

Esquema de base de datos PostgreSQL para la migración Firebase → Supabase. Cada archivo es una migración incremental.

**Estado:** Preparadas y listas, pendientes de ejecutar cuando se active Supabase como backend.

## Migraciones

| Archivo | Qué crea |
|---------|----------|
| `001_core_schema.sql` | Schema base: extensiones, tipos enum, tablas de usuarios y permisos |
| `002_tareas.sql` | Tabla `tareas` con estados, prioridades y relación a proyectos |
| `003_wiki.sql` | Tabla `wiki_paginas` con contenido HTML y árbol de categorías |
| `004_proyectos.sql` | Tablas `proyectos`, `puntos_proyecto`, `modulos_proyecto` |
| `005_calendario.sql` | Tabla `eventos` con recurrencia y asistentes |

## Cómo correr las migraciones

```bash
# Con Supabase CLI (cuando esté configurado)
supabase db push

# O directamente en el SQL Editor de supabase.com
# Pegar el contenido de cada archivo en orden (001 → 005)
```

## Referencia

Ver `docs/DESIGN-supabase.md` para el esquema completo con relaciones, índices y políticas RLS.

## Regla

Las migraciones son **incremetales y numeradas**. Nunca editar un archivo ya ejecutado en producción — crear una nueva migración para cualquier cambio. El número siguiente sería `006_[descripcion].sql`.
