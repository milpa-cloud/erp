# Milpa — Playbook de operaciones

Pasos exactos para cada operación estándar. Seguir este playbook garantiza que los cambios sean consistentes sin importar quién los haga — persona o IA, hoy o en seis meses.

Antes de cualquier operación, leer `docs/ARCHITECTURE.md` para entender el por qué.

---

## 0. Estructura de repos en GitHub

```
github.com/milpa-cloud/erp          (PÚBLICO, MIT)  ← colaboradores trabajan aquí
│  Código completo del ERP: módulos, migraciones, docs, SKILL.md.
│  milpa.config.ts solo con valores de ejemplo. Sin datos reales.
│  Cualquiera puede clonar, personalizar y montar su propio ERP.

github.com/milpa-cloud/milpa-erp   (PRIVADO) ← instancia del equipo Milpa
│  Fork de milpa-cloud/erp.
│  milpa.config.ts con valores reales del equipo.
│  cliente/ con personalizaciones internas si las hay.

github.com/milpa-cloud/huayapam-erp  (PRIVADO)
github.com/milpa-cloud/tomates-erp   (PRIVADO)
github.com/milpa-cloud/sprachenmehr  (PRIVADO)
│  Cada cliente = fork privado de milpa-cloud/erp.
│  Solo cambia milpa.config.ts + carpeta cliente/.

github.com/milpa-cloud/dev-studio    (PRIVADO) ← workspace del estudio
   studio-landing/, tools/, skills/
   NO contiene el ERP ni repos de clientes.
```

### Qué clonan los colaboradores

Para trabajar en módulos (trabajo principal):
```bash
git clone https://github.com/milpa-cloud/erp
cd erp
```

Para trabajar en la landing o herramientas del estudio:
```bash
git clone https://github.com/milpa-cloud/dev-studio
cd dev-studio
```

### Por qué el ERP es público

Cualquier negocio debería poder montar su propio sistema sin pagar por software genérico. Milpa construye el sistema libre y cobra por el setup, soporte y personalización. El código abierto es parte del modelo de negocio, no una concesión.

### Diferencia clave: cliente vs. código

- `milpa-cloud/erp` sabe construir cualquier ERP, pero no sabe quién es ningún cliente.
- `milpa-cloud/huayapam-erp` es Huayapam — su nombre, su config, sus datos.
- El código de los módulos siempre fluye del repo público hacia los clientes, nunca al revés.

---

## 1. Onboarding de un cliente nuevo

**Cuándo usar esto:** cuando un cliente nuevo firma y empieza el proyecto.

### Pasos

1. **Crear el repo privado**
   - Ir a GitHub → fork de `github.com/milpa-cloud/erp`
   - Nombre: `[slug-del-cliente]-erp` (ej: `huayapam-erp`)
   - Visibilidad: **privado**
   - Agregar a la organización del cliente si tiene una, o mantener bajo `milpa-cloud`

2. **Configurar el upstream**
   ```bash
   git remote add upstream https://github.com/milpa-cloud/erp
   git fetch upstream
   ```
   Esto permite jalar actualizaciones del repo público en el futuro.

3. **Crear `milpa.config.ts`** a partir del template:
   ```typescript
   export const config = {
     cliente: {
       nombre: "Nombre del Cliente",
       slug: "slug-cliente",          // solo minúsculas y guiones
       locale: "es",                  // "es" | "en" | "de"
       logo: "/logo.png",             // archivo en /public
       colores: {
         primario: "#059669",         // cambiar al color del cliente
         acento: "#047857",
       },
     },
     modulos: [
       // Agregar solo los módulos que el cliente va a usar
       // "tareas",
       // "proyectos",
       // "wiki",
       // "calendario",
       // "crm",
       // "passwords",
     ],
   } as const;
   ```

4. **Definir módulos activos** — hablar con el cliente, entender su operación, elegir módulos. Ver sección "Cómo activar un módulo" abajo.

5. **Configurar variables de entorno**
   - Crear proyecto en Supabase (o Firebase por ahora)
   - Copiar `.env.local.example` → `.env.local`
   - Llenar todas las variables

6. **Correr las migraciones SQL** de los módulos activos:
   ```bash
   # En orden numérico, siempre empezar por el core
   supabase db push supabase/migrations/001_core_schema.sql
   supabase db push supabase/migrations/002_tareas.sql
   # ... solo los módulos activos
   ```

7. **Configurar dominio y deploy**
   - Crear el site en Firebase Hosting (o Vercel)
   - Configurar dominio del cliente si tiene uno
   - Actualizar `firebase.json` con el site name correcto

8. **Primer build y deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

9. **Documentar en `cliente/README.md`**
   ```markdown
   # [Nombre del cliente]

   **Fecha de inicio:** YYYY-MM-DD
   **Módulos activos:** tareas, proyectos, wiki
   **URL:** herramientas.sunegocio.com
   **Contacto:** nombre@email.com

   ## Personalizaciones
   (vacío al inicio — documentar aquí cualquier cambio especial)
   ```

---

## 2. Activar un módulo para un cliente existente

**Cuándo usar esto:** cuando un cliente pide agregar un módulo nuevo.

### Pasos

1. **Agregar al array `modulos` en `milpa.config.ts`**
   ```typescript
   modulos: ["tareas", "proyectos", "wiki", "crm"],  // ← agregar "crm"
   ```

2. **Correr la migración del módulo**
   ```bash
   supabase db push supabase/migrations/006_crm.sql
   ```
   ⚠️ No saltarse este paso. La app puede compilar sin error pero romper en runtime.

3. **Build y deploy**
   ```bash
   npm run build && firebase deploy --only hosting
   ```

4. **Verificar** que el módulo aparece en el sidebar y funciona correctamente.

5. **Actualizar `cliente/README.md`** — agregar la fecha y el módulo activado.

---

## 3. Personalización simple (colores, textos, logo)

**Cuándo usar esto:** cuando el cliente pide cambiar algo visual o de texto.

**Regla:** si cabe en `milpa.config.ts`, siempre va ahí. Nunca editar el código del módulo.

### Qué va en milpa.config.ts

| Qué quiere el cliente | Dónde va |
|----------------------|----------|
| Cambiar colores de marca | `config.cliente.colores` |
| Cambiar el logo | `config.cliente.logo` |
| Que "Tareas" se llame "Pedidos" | `config.modulos.tareas.etiquetas.titulo` |
| Cambiar el idioma | `config.cliente.locale` |
| Activar / desactivar módulos | `config.modulos` array |

### Pasos

1. Editar `milpa.config.ts` en el repo del cliente
2. Commit con mensaje descriptivo: `config: cambiar color primario a #8B4513 (madera)`
3. Build y deploy
4. Verificar en producción

---

## 4. Personalización profunda (código único del cliente)

**Cuándo usar esto:** cuando el cliente necesita algo que no cabe en la configuración y es específico solo de él.

**Antes de hacer esto:** confirmar que no se puede resolver con config. Si hay duda, resolver con config.

### Pasos

1. Crear o usar la carpeta `cliente/` en el repo del cliente:
   ```
   cliente/
     [modulo]/
       ComponenteEspecial.tsx
     README.md
   ```

2. Construir el componente o la función en `cliente/[modulo]/`

3. Importarlo desde la página o módulo correspondiente

4. **Obligatorio:** documentar en `cliente/README.md`:
   ```markdown
   ## Personalizaciones de código

   ### [Nombre del componente] — YYYY-MM-DD
   **Módulo:** tareas
   **Archivo:** cliente/tareas/CampoEspecial.tsx
   **Por qué:** el cliente necesita un campo de "número de orden" en cada tarea,
   específico de su sistema de numeración interno.
   **Quién lo pidió:** [nombre del contacto del cliente]
   ```

5. Build, deploy, verificar.

---

## 5. Aplicar una actualización del repo público

**Cuándo usar esto:** cuando el repo público tiene un bug fix o mejora que queremos llevar a un cliente.

### Pasos

1. **Revisar qué cambió en el repo público**
   ```bash
   git fetch upstream
   git log upstream/main --oneline -20   # ver los últimos commits
   git diff HEAD upstream/main           # ver exactamente qué cambió
   ```

2. **Revisar `cliente/README.md`** — ver si hay personalizaciones de código en los archivos que van a cambiar. Si hay, prepárate para un merge manual.

3. **Hacer el merge**
   ```bash
   git merge upstream/main
   ```

4. **Si hay conflictos:**
   - Los conflictos en `milpa.config.ts` son fáciles — mantener la versión del cliente.
   - Los conflictos en `cliente/` son fáciles — ese código es del cliente, mantenerlo.
   - Los conflictos en `modules/` son señal de que alguien editó el módulo directamente en el repo del cliente. Resolver con cuidado y documentar en `cliente/README.md`.

5. **Test local** — `npm run dev` y verificar que los módulos activos del cliente funcionan.

6. **Build y deploy**
   ```bash
   npm run build && firebase deploy --only hosting
   ```

---

## 6. Construir un módulo nuevo

**Cuándo usar esto:** cuando vamos a construir un módulo que no existe aún (ej: CRM, Password Manager).

### Pasos

1. **Crear la estructura del módulo en el repo público**
   ```
   src/modules/[nombre]/
     components/         ← carpeta vacía por ahora
     queries.ts          ← funciones CRUD del módulo
     types.ts            ← interfaces TypeScript
     index.ts            ← barrel export (exporta todo lo de arriba)
     SKILL.md            ← guía para la IA (VER TEMPLATE ABAJO)
   ```

2. **Crear la página de Next.js**
   ```
   src/app/[nombre]/page.tsx
   ```
   Esta página es un shell — importa componentes del módulo, no contiene lógica.

3. **Crear la migración SQL**
   ```
   supabase/migrations/NNN_[nombre].sql
   ```
   Donde NNN es el siguiente número disponible.

4. **Escribir el `SKILL.md` del módulo** (ver template abajo)

5. **Registrar el módulo en el sidebar** — editar `src/modules/registry.ts`:
   ```typescript
   export const MODULE_REGISTRY = {
     // ... módulos existentes ...
     crm: { href: "/crm", label: "CRM", icon: Users },
   };
   ```
   El sidebar se actualiza automáticamente cuando el slug está en `config.modulos`.
   NO tocar `src/components/Sidebar.tsx`.

6. **No activarlo en ningún cliente todavía** — solo cuando esté listo y un cliente lo pida.

7. **Commit al repo** con el módulo completo o el avance del día.

> **Nota:** La creación de módulos está planificada para ser automatizada con un script `tools/create-module.ts`. Por ahora es manual — seguir los pasos anteriores exactamente.

### Template SKILL.md para módulos nuevos

```markdown
# Módulo: [Nombre]

## Qué hace
[Un párrafo. Qué problema resuelve, quién lo usa, qué datos maneja.]

## Quién lo usa
[Roles del equipo del cliente que interactúan con este módulo.]

## Tablas en la base de datos
- `[tabla_principal]` — [qué contiene]
- `[tabla_secundaria]` — [qué contiene]
Ver `supabase/migrations/NNN_[nombre].sql`

## Queries disponibles
- `get[Entidad]s()` — obtener todos
- `crear[Entidad](data)` — crear uno nuevo
- `actualizar[Entidad](id, data)` — actualizar
- `eliminar[Entidad](id)` — eliminar

## Configuración en milpa.config.ts
[Qué claves de config lee este módulo y qué hacen.]

## Anti-patrones
[Errores comunes al extender este módulo.]

## Cómo testear
[Cómo verificar que el módulo funciona correctamente.]
```

---

## Checklist rápida antes de deployar a un cliente

- [ ] `npm run build` sin errores ni warnings de TypeScript
- [ ] Los módulos activos del cliente aparecen en el sidebar
- [ ] Los módulos inactivos NO aparecen
- [ ] Los colores y logo del cliente se ven correctamente
- [ ] Las migraciones SQL están corridas (no hay errores de "tabla no existe")
- [ ] `cliente/README.md` está actualizado si hubo cambios

---

## Convenciones de commits

Usar prefijos para que el historial sea legible:

| Prefijo | Cuándo usarlo |
|---------|--------------|
| `feat:` | nueva función o módulo |
| `fix:` | corrección de bug |
| `config:` | cambio en milpa.config.ts |
| `cliente:` | cambio en la carpeta cliente/ |
| `deploy:` | cambio de infraestructura o hosting |
| `docs:` | cambio en documentación |
| `merge:` | merge de upstream |
