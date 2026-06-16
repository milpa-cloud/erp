@AGENTS.md
@skills/vercel-design-guidelines/SKILL.md
@skills/milpa-brand/SKILL.md

# milpa-erp — Template público del ERP (futura base de milpa-cloud/erp)

Este directorio es el **ERP genérico** de Milpa: el código que cualquier negocio puede clonar para montar su propio sistema. Todo lo que está aquí debe ser público y sin datos reales.

**Estado actual:** es también la instancia de desarrollo del equipo (temporal). Cuando se publique como `github.com/milpa-cloud/erp`, el equipo Milpa operará desde un fork privado (`milpa-cloud/milpa-erp`) con su `milpa.config.ts` real.

**Regla crítica:** `milpa.config.ts` en este directorio solo tiene valores de ejemplo — nombre, colores, módulos. Nunca valores de un cliente real. El equipo Milpa es un cliente como cualquier otro.

## Por qué es público

El código es MIT. Cualquiera puede montarlo. Milpa cobra por setup, soporte y personalización — no por el código.

## Stack

- Next.js 16.2.9, App Router, `output: "export"` (genera `out/` para Firebase static hosting)
- TypeScript + Tailwind CSS v4
- Firebase Firestore (tiempo real con `onSnapshot`)
- lucide-react para iconos
- Firebase Hosting → site: `milpa-erp`

## Estructura de archivos

```
src/
  app/
    layout.tsx          — root layout, sidebar incluido
    page.tsx            — dashboard / home
    tareas/page.tsx     — módulo de tareas (Kanban)
    calendario/page.tsx — módulo de calendario
    wiki/page.tsx       — base de conocimiento
    proyectos/page.tsx  — gestión de proyectos (Basecamp-style)
  components/
    Sidebar.tsx         — nav lateral con iconos, marca Milpa
  lib/
    firebase.ts         — init de Firebase + todas las funciones CRUD + listeners
  types/
    index.ts            — interfaces TypeScript de todos los modelos
```

## Firestore — colecciones existentes

| Colección | Modelo | Descripción |
|-----------|--------|-------------|
| `tareas` | `Tarea` | Tareas del equipo (estado: pendiente / en_progreso / completada) |
| `eventos` | `Evento` | Eventos del calendario |
| `wiki` | `PaginaWiki` | Páginas de la wiki interna |
| `proyectos` | `Proyecto` | Proyectos (nombre, cliente, estado) |
| `puntos_proyecto` | `PuntoProyecto` | Checklist de puntos por proyecto |
| `modulos_proyecto` | `ModuloProyecto` | Módulos asignados a un proyecto |

Las tareas con `proyectoId` pertenecen a un proyecto. Las tareas sin `proyectoId` son del kanban general.

## Patrones de código

### Listeners en tiempo real (Firestore)

```typescript
// Siempre retorna la función de limpieza para useEffect
const unsub = escucharTareas((tareas) => setTareas(tareas));
return () => unsub();
```

### Queries con filtro

```typescript
// Sin orderBy para evitar índices compuestos — ordenar en el cliente
const q = query(collection(db, "tareas"), where("proyectoId", "==", id));
// Luego: tareas.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
```

### Patrones en lib/firebase.ts

Toda función CRUD sigue esta nomenclatura:
- `escuchar<Colección>(callback)` — listener en tiempo real
- `crear<Modelo>(data)` — addDoc
- `actualizar<Modelo>(id, data)` — updateDoc
- `eliminar<Modelo>(id)` — deleteDoc

## Design system del ERP

El ERP usa la paleta stone con acento emerald, igual que la landing. Diferencias clave del ERP vs la landing:

- Layout: sidebar fijo izquierda (256px) + contenido principal
- Sin DM Serif Display — todo DM Sans (es una app, no marketing)
- Densidad alta: rows de 40-48px, tablas compactas
- Estado de items: badges con colores (emerald=completado, amber=en progreso, stone=pendiente)
- Formularios inline o modales, no páginas separadas

### Paleta del sidebar

```tsx
// Sidebar
bg-stone-900 text-stone-400
// Item activo
bg-stone-800 text-stone-50
// Hover
hover:bg-stone-800 hover:text-stone-200
```

### Patrones de UI comunes

```tsx
// Modal overlay
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">

// Confirmación destructiva (dos pasos)
{confirmDelete === item.id ? (
  <button onClick={() => handleDelete(item.id)}>Confirmar</button>
  <button onClick={() => setConfirmDelete(null)}>Cancelar</button>
) : (
  <button onClick={() => setConfirmDelete(item.id)}>Eliminar</button>
)}

// Panel dos columnas (lista + detalle)
<div className="flex h-screen">
  <aside className="w-64 border-r border-stone-200 overflow-y-auto">
  <main className="flex-1 overflow-y-auto">
```

## Variables de entorno

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Ver `.env.local.example` para la estructura. El archivo `.env.local` real no se sube a git.

## Deploy

```bash
npm run build       # genera out/
firebase deploy --only hosting
```

Firestore rules: `firebase deploy --only firestore:rules`  
Las reglas están en `firestore.rules`. Actualmente `allow read, write: if true` (modo demo).

## Módulos pendientes (próximos a construir)

- Auth real (Supabase Auth — email + Google OAuth)
- CRM & Contactos
- Password Manager (AES-256)
- Dashboard con widgets configurables
- Sistema de notificaciones (in-app + email via Resend)
- Export de datos (CSV + JSON por módulo)
