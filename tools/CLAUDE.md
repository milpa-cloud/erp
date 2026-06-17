# tools/ — Scripts de CLI para datos y mantenimiento

Scripts de Node.js para operaciones de datos que no tienen UI. Se corren manualmente desde dentro de `milpa-erp/`.

## Scripts

### `seed-wiki.mjs`

Puebla la colección `wiki` de Firestore con contenido inicial HTML rico.

```bash
# Desde milpa-erp/
node tools/seed-wiki.mjs
```

**Cuándo usarlo:**
- Al configurar una nueva instancia del ERP para un cliente
- Después de cambiar de proyecto Firebase (resetea y re-puebla la wiki)

**Ojo:** El script actualmente apunta al proyecto `milpa-studio-landing` (legacy). Actualizar las variables `PROJECT_ID` y `API_KEY` al tope del archivo cuando se use con el nuevo proyecto `milpa-erp-app`.

## Cómo agregar un script nuevo

1. Crear `tools/[nombre].mjs` (ES modules, sin build step)
2. Documentarlo aquí con: qué hace, cuándo usarlo, cómo correrlo
3. Si el script necesita credenciales, leerlas de `.env.local` — nunca hardcodear
