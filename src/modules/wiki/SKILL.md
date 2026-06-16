# Módulo: Wiki

Base de conocimiento interna del equipo. Panel izquierdo con lista de páginas por categoría, panel derecho con el contenido renderizado en Markdown básico.

## Archivos

```
src/modules/wiki/
  types.ts                    — interface PaginaWiki, CATEGORIAS_WIKI, renderMarkdown(), formatFechaWiki()
  queries.ts                  — escucharWiki, crearPagina, actualizarPagina, eliminarPagina
  components/
    EditorModal.tsx           — modal con editor de texto y preview de Markdown
  index.ts                    — barrel export público
src/app/wiki/page.tsx         — shell: layout de dos paneles, filtros, estado activo
```

## Colección Firestore: `wiki`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `titulo` | string | Obligatorio |
| `contenido` | string | Markdown libre |
| `categoria` | string | Una de CATEGORIAS_WIKI |
| `autor` | string | Nombre de quien guardó (localStorage) |
| `actualizadoEn` | Timestamp | serverTimestamp() en cada write |

## Categorías disponibles

`General`, `Clientes`, `Procesos`, `Técnico`, `Guías`, `Decisiones`

Para agregar categorías: editar `CATEGORIAS_WIKI` en `types.ts`.

## Patrones clave

- `renderMarkdown()` en `types.ts` — no usa dependencias externas, convierte Markdown básico a HTML
- `actualizarPagina` siempre actualiza `actualizadoEn` con serverTimestamp
- El EditorModal tiene toggle Edit / Vista previa en el mismo modal
- `dangerouslySetInnerHTML` solo sobre contenido interno del equipo (sin XSS externo)

## Agregar al proyecto

1. Agregar `"wiki"` al array `modulos` en `milpa.config.ts`
2. Migración SQL: `supabase/migrations/003_wiki.sql`
