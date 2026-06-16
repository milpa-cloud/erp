/**
 * seed-wiki.mjs
 * Puebla la wiki del ERP de Milpa con toda la documentación del proyecto.
 * Uso: node tools/seed-wiki.mjs
 *
 * Requiere: PROJECT_ID y API_KEY del proyecto Firebase del cliente.
 */

const PROJECT_ID = "milpa-studio-landing";
const API_KEY = "AIzaSyAchIbM2QykBHHol_5l_e4rpAj1Tvmyyuk";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function field(value) {
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return { integerValue: String(value) };
  return { stringValue: String(value) };
}

async function crearPagina({ titulo, contenido, categoria }) {
  const body = {
    fields: {
      titulo: field(titulo),
      contenido: field(contenido),
      categoria: field(categoria),
      autor: field("Sistema"),
      actualizadoEn: { timestampValue: new Date().toISOString() },
    },
  };

  const res = await fetch(`${BASE_URL}/wiki?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error creando "${titulo}": ${err}`);
  }

  console.log(`✓  ${categoria} → ${titulo}`);
}

// ─── Páginas wiki ─────────────────────────────────────────────────────────────

const paginas = [

// ══════════════════════════════════════════════════════
//  VISIÓN
// ══════════════════════════════════════════════════════

{
  titulo: "Qué es Milpa",
  categoria: "Visión",
  contenido: `# Qué es Milpa

Milpa es un estudio de software que construye **herramientas internas para negocios en crecimiento** (10–50 empleados).

No somos una agencia web. No somos una empresa SaaS. Somos el punto intermedio: software que se siente como un producto, funciona exactamente como el cliente lo necesita, y el cliente termina siendo dueño de todo.

---

## El problema que resolvemos

Un negocio mediano en México vive así:

- **Comunicación**: WhatsApp
- **Inventario**: una hoja de Excel que nadie entiende
- **Pedidos**: papel o un grupo de Telegram
- **Documentos**: carpetas de Google Drive sin orden

Tienen dos opciones malas:

1. **Herramientas genéricas** (Notion, Trello, Monday) — no encajan, el equipo no las adopta, los datos quedan dispersos en tres plataformas
2. **Software a medida tradicional** — $15,000–$50,000 USD, meses de espera, y cuando termina ya cambió lo que necesitaban

Milpa es la tercera opción que no existía.

---

## Cómo lo resolvemos

Tenemos una **biblioteca de módulos pre-construidos**. Para cada cliente seleccionamos los que necesita, los configuramos a su flujo de trabajo, los diseñamos con su identidad visual y los desplegamos como su propio sistema.

El cliente recibe:
- Una URL propia (\`herramientas.sunegocio.com\`)
- Solo los módulos que usa — sin funciones que no entiende
- El código fuente completo (es suyo, para siempre)
- Sus datos exportables en cualquier momento

**Si en algún momento dejan de trabajar con Milpa, se llevan todo. Cero lock-in.**

---

## Los tres diferenciadores

1. **Software que encaja** — no es Notion con otro color. Está hecho para cómo trabajan ellos.
2. **El cliente es dueño de todo** — código MIT, datos exportables, cero dependencia de Milpa.
3. **Nosotros manejamos la complejidad técnica** — el carpintero no sabe qué es Supabase y no tiene por qué saberlo.

---

## Mercado objetivo

Negocios de 10–50 empleados en crecimiento en México y Latinoamérica que ya crecieron más allá de WhatsApp y Excel, pero no pueden pagar software a medida tradicional.`,
},

{
  titulo: "Por qué existe Milpa",
  categoria: "Visión",
  contenido: `# Por qué existe Milpa

## La raíz del problema

La mayoría del software empresarial fue diseñado para empresas grandes con equipos dedicados a implementarlo. Cuando llega a un negocio de 20 personas, hay tres resultados comunes:

1. **Lo compran y no lo usan** — demasiado complejo, el equipo vuelve al Excel.
2. **Lo usan parcialmente** — el 20% de las funciones, el resto lo siguen haciendo en WhatsApp.
3. **Lo contratan y se adaptan** — el negocio cambia sus procesos para encajar con el software, no al revés.

Ninguno de los tres es bueno. Pero es lo que existe.

---

## La oportunidad

Hay una brecha enorme entre:
- Las herramientas genéricas ($0–$50/mes que no encajan)
- El software a medida tradicional ($15,000–$50,000 USD que pocos pueden pagar)

En esa brecha caben miles de negocios que necesitan algo que funcione exactamente para ellos, a un precio razonable, con alguien que se haga responsable de que funcione.

---

## Por qué ahora es posible

Tres cosas que cambiaron:

1. **Supabase y servicios modernos** — base de datos, auth y hosting en una fracción del costo de hace cinco años
2. **Next.js y Tailwind** — construir interfaces de calidad producción es más rápido y barato que nunca
3. **IA como co-piloto** — no como reemplazo del developer, sino como multiplicador de velocidad

Milpa puede construir en semanas lo que antes tomaba meses, a un precio que un negocio mediano puede pagar.

---

## El modelo open source

El código es MIT. Cualquiera puede clonarlo y montar su propio ERP.

Esto no es un riesgo — es la estrategia. El 95% de los clientes no pueden ni quieren hacer la instalación solos. El valor está en el servicio: instalación, configuración, personalización, soporte y evolución continua.

El código abierto es el canal de distribución. El servicio es el negocio.`,
},

{
  titulo: "Pitch y respuestas a objeciones",
  categoria: "Visión",
  contenido: `# Pitch y respuestas a objeciones

## Para un cliente potencial (30 segundos)

> "Tu negocio ya creció, pero las herramientas no crecieron contigo — todavía estás en WhatsApp y Excel. Nosotros construimos el sistema interno que necesitas: gestión de proyectos, tareas del equipo, historial de clientes, todo bajo tu propio dominio con tu logo. No es una plantilla genérica — está hecho para cómo trabajas tú. Cuesta menos que las suscripciones que ya pagas y no usas bien. Y si en algún momento quieres cambiar de proveedor, el sistema es tuyo: código y datos incluidos."

---

## Para un colega o posible colaborador (60 segundos)

> "Milpa es un estudio de software que resuelve un problema claro: los negocios de 10 a 50 empleados en México están operando con herramientas que no encajan. Son demasiado grandes para improvisar, demasiado chicos para pagar software a medida. Construimos una biblioteca de módulos open source — gestión de proyectos, tareas, CRM, wiki — y los desplegamos como un sistema a medida para cada cliente. El cliente paga setup más suscripción mensual, es dueño de su código y sus datos, y puede irse cuando quiera. El modelo de ingreso es recurrente. El código abierto es el canal de distribución."

---

## Respuestas a las objeciones más comunes

**"¿Por qué no uso Notion o Monday?"**
> Puedes. Pero vas a terminar con tres herramientas que no se hablan entre sí, y tu equipo va a seguir usando WhatsApp para lo importante. Nosotros construimos un sistema que encaja exactamente con cómo trabajas — y el equipo realmente lo usa.

**"¿Y si mañana Milpa deja de operar?"**
> Eso es exactamente lo que protegemos. El código es tuyo y es open source. Tus datos están en tu propia cuenta. Si mañana desaparecemos, sigues operando normal. No te dejamos atado.

**"¿Es caro?"**
> Menos que lo que ya gastas en herramientas que no te encajan. Y menos que un mes de un empleado dedicado a ordenar Excel.

**"¿En cuánto tiempo lo tienen listo?"**
> Entre 4 y 8 semanas. Los primeros módulos suelen estar listos en 2–3 semanas y los vas usando mientras construimos el resto.

**"¿Qué pasa si quiero agregar algo después?"**
> Es lo que esperamos. Los módulos del catálogo se activan dentro de tu suscripción. Funciones nuevas o personalizadas se cotizan por hora.`,
},

// ══════════════════════════════════════════════════════
//  NEGOCIO
// ══════════════════════════════════════════════════════

{
  titulo: "Modelo de negocio y precios",
  categoria: "Negocio",
  contenido: `# Modelo de negocio y precios

## Estructura de ingresos

### Setup fee — pago único al comenzar
**$500 – $1,000 USD** por cliente nuevo.

Cubre: instalación, configuración, diseño con la identidad del cliente, migración de datos existentes y capacitación inicial.

### Suscripción mensual — recurrente
**$30 – $80 USD / mes** (objetivo real a mediano plazo: $100–150/mes).

Cubre: hosting, actualizaciones de seguridad, soporte técnico y acceso a módulos nuevos cuando estén disponibles.

> Comparación: un negocio de 10–50 empleados gasta $100–300/mes en herramientas SaaS que no encajan. Un sistema a medida a $120/mes es una propuesta de valor muy clara.

### Horas de personalización
**$40 – $80 USD / hora** para cambios fuera del scope estándar.

---

## La unidad económica

### Estado actual (sin automatización):
- Setup de un cliente: 40–60 horas de trabajo
- Costo real del setup: $1,000–$1,500
- Setup fee cobrado: $750 promedio
- Resultado: pérdida en cada cliente nuevo
- Break-even con MRR: 12–25 meses → insostenible

### Con módulos automatizados (objetivo):
- Setup: 10–15 horas
- Costo real: $250–$375
- Setup fee cobrado: $750
- Ganancia en setup: +$375
- MRR: ganancia desde el mes 1

**La automatización del proceso de onboarding no es una mejora técnica. Es el requisito para que el negocio sea sostenible.**

---

## Proyecciones a 12 meses

| Mes | Clientes | MRR | Setup del mes | Ingreso total |
|-----|----------|-----|---------------|---------------|
| 3   | 2        | $150 | $750         | $900  |
| 6   | 5        | $375 | $750         | $1,125|
| 9   | 8        | $600 | $750         | $1,350|
| 12  | 12       | $900 | $750         | $1,650|

*Supone 1 cliente nuevo por mes, $75/mes promedio de suscripción.*

---

## El modelo open source + servicio

El código es MIT (libre). El servicio no lo es.

Esto funciona porque el 95% de los clientes no pueden ni quieren hacer la instalación solos. Lo prueba el mercado: Supabase, Ghost, Cal.com, Plausible, HashiCorp — todos open source, todos con negocios de servicio rentables encima.

El código abierto es el canal de distribución. El servicio es el negocio.`,
},

{
  titulo: "Roles del equipo",
  categoria: "Negocio",
  contenido: `# Roles del equipo

## Tech Lead

**Responsabilidades:**
- Desarrollo de módulos nuevos
- Setup e infraestructura por cliente
- Mantenimiento del sistema en producción
- Arquitectura del producto
- Scripts de automatización (create-client, add-module)

**Skills necesarios:** Next.js, TypeScript, Supabase/PostgreSQL, Firebase/Vercel, Git

**Tiempo estimado:** 15–20h en setup inicial + 2–4h/mes en mantenimiento por cliente activo

---

## Diseño / UX

**Responsabilidades:**
- Diseño de UI de cada módulo
- Branding por cliente (colores, logo, tipografía)
- Experiencia de usuario del sistema completo
- Material visual de ventas (landing, demos, screenshots)

**Skills necesarios:** Figma, principios de UX, Tailwind CSS básico, tipografía y color

**Tiempo estimado:** 8–15h de diseño inicial + ajustes iterativos según feedback

---

## Ventas / Operaciones / Project Management

**Responsabilidades:**
- Conseguir clientes nuevos (networking, referencias, outreach)
- Gestionar el pipeline de ventas
- Onboarding y comunicación con clientes
- Gestión de proyectos activos
- Soporte y relación a largo plazo
- Facturación y cobros

**Skills necesarios:** Ventas consultivas, project management, comunicación clara. No necesita saber programar.

**Tiempo estimado:** 5–10h para cerrar una venta + 3–5h/mes en relación continua

---

## Propuesta de split de ingresos

| Rol | Setup fee | MRR | Justificación |
|-----|-----------|-----|---------------|
| Tech Lead | 40% | 40% | Mayor tiempo en setup y mantenimiento técnico |
| Diseño | 30% | 25% | Intensivo en setup, menor en mantenimiento |
| Ventas/Ops | 30% | 35% | Menor en setup, más en relación continua |

*Milpa como entidad retiene 0% hasta que haya runway suficiente para invertir en el producto como tal.*`,
},

// ══════════════════════════════════════════════════════
//  TÉCNICO
// ══════════════════════════════════════════════════════

{
  titulo: "Arquitectura técnica",
  categoria: "Técnico",
  contenido: `# Arquitectura técnica

## El stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend | Next.js 16 (App Router) + TypeScript | Static export, App Router, type-safe |
| Estilos | Tailwind CSS v4 | Utility-first, personalización rápida por cliente |
| Tipografía | DM Serif Display + DM Sans | Sistema visual Milpa (DM Serif en headings, DM Sans en todo lo demás) |
| Base de datos | Supabase (PostgreSQL) | Open source, self-hosteable, SQL real, auth incluido |
| Auth | Supabase Auth | Email + contraseña, Google OAuth |
| Deploy | Firebase Hosting / Vercel | Edge CDN, gratis en planes pequeños |
| Emails | Resend | Notificaciones transaccionales, API simple |
| Repo | GitHub (MIT) | Open source, fork privado por cliente |

---

## Cómo funciona por cliente

Cada cliente recibe su propio deployment:

\`\`\`
Cliente: Carpintería Huayapam
├── Repo: github.com/milpa-cloud/huayapam-erp (privado)
│   └── Fork de milpa-cloud/erp con:
│       ├── milpa.config.ts  ← colores, logo, módulos activos
│       └── cliente/         ← código exclusivo de este cliente (si aplica)
├── DB: Supabase project (cuenta del cliente)
│   └── Migraciones corridas: 001_core, 002_tareas, 004_proyectos
└── URL: tools.carpinteria-huayapam.com
\`\`\`

---

## Anatomía de un módulo

\`\`\`
src/modules/tareas/
├── types.ts       ← interfaces TypeScript, constantes, helpers
├── queries.ts     ← listeners (onSnapshot) y CRUD
├── components/    ← componentes React del módulo
│   ├── TareaCard.tsx
│   ├── TareaModal.tsx
│   └── KanbanColumn.tsx
├── index.ts       ← barrel de exports públicos
└── SKILL.md       ← instrucciones para la IA
\`\`\`

---

## La config por cliente

\`\`\`typescript
// milpa.config.ts
export const config = {
  cliente: {
    nombre: "Carpintería Huayapam",
    slug: "huayapam",
    locale: "es",
  },
  modulos: ["tareas", "calendario", "wiki", "proyectos"],
} as const;
\`\`\`

El sidebar, el router y el dashboard leen esta config. Nunca se hardcodean módulos en los componentes.

---

## Reglas de código

- **Las páginas son shells** — toda la lógica vive en \`src/modules/[nombre]/\`, nunca en \`src/app/\`
- **El sidebar se construye dinámicamente** — desde \`config.modulos\` + \`MODULE_REGISTRY\`, nunca editando Sidebar.tsx
- **Las personalizaciones van en \`milpa.config.ts\`** — nunca editando los módulos directamente
- **Las queries sin \`orderBy\`** cuando hay un filtro \`where\` — ordenar en el cliente para evitar índices compuestos en Firestore`,
},

{
  titulo: "Esquema de base de datos (Supabase)",
  categoria: "Técnico",
  contenido: `# Esquema de base de datos

## El modelo

Cada cliente tiene su **propio proyecto de Supabase**. Sus datos están completamente aislados de los de otros clientes. El cliente es dueño de su proyecto Supabase.

---

## Tablas por módulo

### Core (todas las migraciones)
\`\`\`sql
-- Función trigger para updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
\`\`\`

### Módulo: Tareas
\`\`\`sql
CREATE TABLE tareas (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            text NOT NULL,
  descripcion       text NOT NULL DEFAULT '',
  estado            text NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente', 'en_progreso', 'completada')),
  prioridad         text NOT NULL DEFAULT 'media'
                    CHECK (prioridad IN ('alta', 'media', 'baja')),
  asignado          text NOT NULL DEFAULT '',
  creado_por        text NOT NULL DEFAULT '',
  fecha_vencimiento text,
  proyecto_id       uuid REFERENCES proyectos(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
\`\`\`

### Módulo: Proyectos
\`\`\`sql
CREATE TABLE proyectos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL,
  cliente     text NOT NULL DEFAULT '',
  descripcion text NOT NULL DEFAULT '',
  estado      text NOT NULL DEFAULT 'en_desarrollo'
              CHECK (estado IN ('activo', 'en_desarrollo', 'completado', 'pausado')),
  creado_por  text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
\`\`\`

### Módulo: Wiki
\`\`\`sql
CREATE TABLE wiki (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo       text NOT NULL,
  contenido    text NOT NULL DEFAULT '',
  categoria    text NOT NULL DEFAULT 'General',
  autor        text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
\`\`\`

---

## Principio de referencias cruzadas

Los módulos se comunican a través de **foreign keys**, no de APIs:

\`\`\`
tareas.proyecto_id → proyectos.id
\`\`\`

Una entidad **pertenece** al módulo que la gestiona. Otros módulos la **referencian**, nunca la duplican.

---

## Cómo correr las migraciones

\`\`\`bash
# En el dashboard de Supabase: SQL Editor → New query → pegar el archivo
# O con supabase CLI:
supabase db push --db-url postgresql://...

# Orden obligatorio:
001_core_schema.sql    # siempre primero
002_tareas.sql
003_wiki.sql
004_proyectos.sql      # proyectos debe existir antes que tareas (FK)
005_calendario.sql     # solo crea un índice en tareas
\`\`\``,
},

{
  titulo: "Sistema de permisos y roles",
  categoria: "Técnico",
  contenido: `# Sistema de permisos y roles

## El modelo: permisos por módulo

Cada usuario puede tener permisos distintos en cada módulo. El contador puede tener acceso de editor en Wiki pero solo de visor en CRM.

---

## Niveles de permiso

| Nivel | Leer | Crear/Editar | Eliminar | Configurar |
|-------|------|-------------|----------|-----------|
| none | ✗ | ✗ | ✗ | ✗ |
| viewer | ✓ | ✗ | ✗ | ✗ |
| editor | ✓ | ✓ | ✗ | ✗ |
| admin | ✓ | ✓ | ✓ | ✓ |

El **Owner** (dueño del negocio) tiene acceso de admin en todos los módulos. No se puede revocar.

---

## Implementación en Supabase (Row Level Security)

\`\`\`sql
CREATE TABLE module_permissions (
  user_id     UUID REFERENCES auth.users,
  module_slug TEXT,   -- 'tareas' | 'proyectos' | 'wiki' | etc.
  nivel       TEXT,   -- 'none' | 'viewer' | 'editor' | 'admin'
  PRIMARY KEY (user_id, module_slug)
);

-- Solo pueden leer tareas los usuarios con permiso
CREATE POLICY "tareas_select" ON tareas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM module_permissions
      WHERE user_id = auth.uid()
        AND module_slug = 'tareas'
        AND nivel IN ('viewer', 'editor', 'admin')
    )
  );
\`\`\`

Los permisos se aplican directamente en la base de datos. El frontend no puede ver filas que no le corresponden, aunque intente.

---

## Gestión de usuarios

El Owner puede:
- Invitar usuarios por email → Supabase envía el link de activación
- Asignar permisos por módulo
- Revocar acceso en cualquier momento

El invitado elige su contraseña en su primer login.`,
},

{
  titulo: "Notificaciones y comunicación entre módulos",
  categoria: "Técnico",
  contenido: `# Notificaciones y comunicación entre módulos

## El modelo: SQL, no APIs

Los módulos no se llaman entre sí. Se comunican a través de **entidades compartidas en la base de datos**.

\`\`\`sql
-- Proyectos mostrando datos de tareas (de otro módulo)
SELECT p.*, COUNT(t.id) AS total_tareas
FROM proyectos p
LEFT JOIN tareas t ON t.proyecto_id = p.id
GROUP BY p.id;
\`\`\`

---

## Sistema de notificaciones (3 capas)

### Capa 1 — Trigger de PostgreSQL

Cuando ocurre un evento en la base de datos, un trigger crea la notificación:

\`\`\`sql
CREATE OR REPLACE FUNCTION notify_task_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.asignado IS NOT NULL AND NEW.asignado != OLD.asignado THEN
    INSERT INTO notifications (user_id, tipo, titulo, link)
    VALUES (
      NEW.asignado,
      'task_assigned',
      'Tarea asignada: ' || NEW.titulo,
      '/tareas/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
\`\`\`

### Capa 2 — Supabase Realtime (in-app)

El frontend se suscribe a la tabla de notificaciones del usuario:

\`\`\`typescript
const channel = supabase
  .channel('notificaciones')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: \`user_id=eq.\${userId}\`,
  }, (payload) => {
    setNotifications(prev => [payload.new, ...prev]);
  })
  .subscribe();
\`\`\`

### Capa 3 — Edge Function (email vía Resend)

\`\`\`typescript
// supabase/functions/send-notification/index.ts
Deno.serve(async (req) => {
  const { record } = await req.json();
  await resend.emails.send({
    from: "Milpa <hola@milpa.cloud>",
    to: userEmail,
    subject: record.titulo,
    html: emailTemplate(record),
  });
});
\`\`\`

---

## Flujo completo

\`\`\`
Usuario A asigna tarea a Usuario B
  → UPDATE en tareas
  → Trigger PostgreSQL → INSERT en notifications
  → Supabase Realtime → campanita de B se actualiza
  → Edge Function → Resend → email a B
\`\`\``,
},

// ══════════════════════════════════════════════════════
//  PRODUCTO
// ══════════════════════════════════════════════════════

{
  titulo: "Catálogo de módulos",
  categoria: "Producto",
  contenido: `# Catálogo de módulos

## Estado actual

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| **Tareas / Kanban** | ✅ v1 lista | Tablero de trabajo del equipo |
| **Wiki** | ✅ v1 lista | Base de conocimiento interna |
| **Calendario** | ✅ v1 lista | Agenda compartida (consume módulo de tareas) |
| **Proyectos** | ✅ v1 lista | Gestión tipo Basecamp |
| **CRM** | 🔴 No iniciado | Clientes, proveedores, historial |
| **Password Manager** | 🔴 No iniciado | Credenciales del equipo, AES-256 |
| **Dashboard** | 🔴 No iniciado | Métricas y widgets configurables |
| **Auth real** | 🔴 No iniciado | Supabase Auth (actualmente el nombre en localStorage) |
| **Notificaciones** | 🔴 No iniciado | In-app + email via Resend |

---

## Módulo de Proyectos

Un **Proyecto** es el contenedor de todo el trabajo alrededor de una entrega o cliente.

\`\`\`
Proyecto: "Remodelación casa Martínez"
├── Información   → cliente, industria, estado, descripción
├── Tareas        → tareas vinculadas a este proyecto (del módulo de Tareas)
├── Checklist     → puntos/hitos con fecha estimada
└── Módulos       → funciones personalizadas del proyecto
\`\`\`

---

## Módulo CRM (siguiente prioridad)

Gestiona contactos: clientes, proveedores, prospectos.

Campos principales: nombre, empresa, email, teléfono, tipo, notas, historial de interacciones.

Integra con: Proyectos (cliente del proyecto), Calendario (reunión con contacto), Tareas (tarea relacionada a contacto).

---

## Módulo Password Manager

Credenciales compartidas del equipo. Requisito de seguridad crítico:
- Las contraseñas se guardan **encriptadas con AES-256**
- Ni Milpa ni Supabase puede leer el contenido sin la clave maestra del cliente
- La clave maestra nunca sale del navegador del usuario

---

## Roadmap de módulos futuros

| Módulo | Descripción |
|--------|-------------|
| Inventario | Stock de productos/materiales, alertas de stock bajo |
| Facturación simple | Cotizaciones y facturas básicas |
| Sistema de reservas | Agenda para que los clientes del negocio reserven |
| Portal de clientes | Vista read-only del estado del proyecto para el cliente externo |
| Nómina | Cálculo y registro de pago semanal/quincenal |`,
},

// ══════════════════════════════════════════════════════
//  OPERACIONES
// ══════════════════════════════════════════════════════

{
  titulo: "Cómo hacer el onboarding de un cliente nuevo",
  categoria: "Operaciones",
  contenido: `# Onboarding de un cliente nuevo

## Paso a paso

### 1. Definición (reunión con el cliente)
- ¿Qué módulos necesita? → elegir del catálogo
- ¿Cuántos usuarios van a usar el sistema? → definir roles
- ¿Tienen datos existentes para migrar? (Excel, otra herramienta)
- Identidad visual: logo en PNG/SVG, colores principales, nombre del sistema

### 2. Setup técnico

\`\`\`bash
# Por ahora manual. El cliente recibe un fork privado del repo público.
# Ver docs/PLAYBOOK.md → Sección 2: Onboarding de cliente

1. Fork de github.com/milpa-cloud/erp → github.com/milpa-cloud/[cliente]-erp
2. Crear archivo milpa.config.ts con datos del cliente
3. Crear cuenta Supabase (o crearla el cliente y darle acceso a Milpa)
4. Correr migraciones SQL según los módulos activos
5. Configurar dominio en Firebase Hosting
6. Push inicial y primer deploy
\`\`\`

### 3. Base de datos del cliente

El cliente crea su cuenta en supabase.com (plan gratuito es suficiente para empezar). Milpa:
- Corre las migraciones de cada módulo activo
- Transfiere la ownership al cliente
- El cliente invita a Milpa como colaborador para soporte

### 4. Migración de datos existentes

- Si tiene Excel → importar vía CSV con script
- Si tiene otra herramienta → exportar y mapear
- Si empieza de cero → documentar el proceso de ingreso inicial

### 5. Usuarios y permisos

1. El Owner (dueño del negocio) crea su cuenta
2. Milpa configura sus permisos de Owner
3. El Owner invita a su equipo por email
4. Cada miembro elige contraseña en su primer login

### 6. Capacitación

- 1 sesión de 1–2h con el equipo del cliente
- Se recorre el sistema, se crean datos de prueba reales
- Se entrega una guía breve (PDF o página de la wiki del cliente)

### 7. Go-live

- Se activa el dominio del cliente
- Milpa hace seguimiento la primera semana
- Check-in a los 30 días

---

## Tiempo estimado por fase

| Fase | Hoy | Con automatización futura |
|------|-----|--------------------------|
| Setup técnico | 20–40h | 5–10h |
| Migración de datos | 5–20h | 5–20h (siempre manual) |
| Capacitación | 2–4h | 2–4h |
| **Total** | **27–64h** | **12–34h** |`,
},

{
  titulo: "Cómo hacer un deploy",
  categoria: "Operaciones",
  contenido: `# Cómo hacer un deploy

## ERP (milpa-erp)

\`\`\`bash
cd milpa-erp
npm run build         # genera la carpeta out/
firebase deploy --only hosting
\`\`\`

El build genera archivos estáticos en \`out/\`. Firebase Hosting los sirve desde el CDN de Google.

---

## Landing (landing-milpa)

\`\`\`bash
cd landing-milpa
npm run build
firebase deploy --only hosting
\`\`\`

---

## Verificar antes de deployar

1. ¿El build termina sin errores TypeScript? (\`npm run build\`)
2. ¿Las variables de entorno en \`.env.local\` están correctas?
3. ¿La versión de la app en producción no va a romper datos existentes en Firestore?

---

## Variables de entorno necesarias

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
\`\`\`

Ver \`.env.local.example\` en la raíz del proyecto.

---

## Reglas de Firestore

\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

Las reglas están en \`firestore.rules\`. Actualmente en modo permisivo (\`allow read, write: if true\`) porque no hay auth implementado todavía. **Cambiar antes de dar acceso a clientes reales.**

---

## Si el build falla

Los errores más comunes:
- **TypeScript error** — revisar el output de \`npm run build\`, la línea exacta y el archivo
- **Import faltante** — algún componente importa algo que no existe
- **Variable de entorno** — \`process.env.NEXT_PUBLIC_*\` undefined en build

\`\`\`bash
# Ver errores de TypeScript sin compilar
npx tsc --noEmit
\`\`\``,
},

// ══════════════════════════════════════════════════════
//  CLIENTES
// ══════════════════════════════════════════════════════

{
  titulo: "Carpintería Huayapam",
  categoria: "Clientes",
  contenido: `# Carpintería Huayapam

## Quiénes son

Empresa de carpintería artesanal con más de 20 trabajadores en Oaxaca, México. Fabrican muebles y acabados de madera para proyectos de construcción y diseño de interiores.

**Estado:** En producción · uso diario

---

## El problema que tenían

Operaban con hojas de cálculo, papel y WhatsApp. El control de proyectos, inventario, nómina y cotizaciones era manual y disperso. A medida que crecieron, el caos aumentó.

---

## Lo que construimos

| Módulo | Descripción |
|--------|-------------|
| Gestión de proyectos | Control de proyectos activos por cliente |
| Inventario | Stock de materiales, alertas de stock bajo |
| Compras | Registro y seguimiento de compras a proveedores |
| Nómina semanal | Cálculo y registro de pago semanal por trabajador |
| Cotizaciones | Generación de presupuestos para clientes |
| Control de asistencia | Registro diario de entrada/salida |
| Dashboard financiero | Resumen de ingresos, gastos y utilidad |

---

## Datos técnicos

- **Repo:** \`github.com/milpa-cloud/huayapam-erp\` (privado)
- **Deploy:** Firebase Hosting
- **DB:** Firebase Firestore (primer cliente, antes de la migración a Supabase)
- **Módulos:** personalizados para carpintería, no son los módulos estándar del catálogo

---

## Notas importantes

Este cliente fue el primero. El código es muy específico de su operación y está acoplado — no sigue la arquitectura modular nueva. Es técnicamente deuda.

Si en algún momento piden cambios grandes, evaluar si conviene refactorizar hacia la arquitectura estándar.`,
},

{
  titulo: "Tomates La Era",
  categoria: "Clientes",
  contenido: `# Tomates La Era

## Quiénes son

Empresa productora y comercializadora de tomate en Oaxaca, México. Controlan el ciclo completo: desde la siembra en invernadero hasta la distribución y venta.

**Estado:** En producción

---

## El problema que tenían

Seguimiento de producción, inventario de producto y nómina en papel o Excel. Sin visibilidad del ciclo completo de producción ni de las finanzas del negocio.

---

## Lo que construimos

| Módulo | Descripción |
|--------|-------------|
| Seguimiento de producción | Control por ciclo: siembra, crecimiento, cosecha |
| Inventario | Registro de entradas y salidas de producto |
| Movimientos de producto | Trazabilidad de dónde va cada lote |
| Contabilidad básica | Registro de ingresos y egresos |
| Nómina | Cálculo de pago del equipo de campo |

---

## Datos técnicos

- **Repo:** \`github.com/milpa-cloud/tomates-erp\` (privado)
- **Deploy:** Firebase Hosting
- **DB:** Firebase Firestore

---

## Notas importantes

Similar a Huayapam: código específico de su operación, anterior a la arquitectura modular. Funciona bien, pero no reutilizable directamente.`,
},

{
  titulo: "Sprachenmehr e.V.",
  categoria: "Clientes",
  contenido: `# Sprachenmehr e.V.

## Quiénes son

Asociación sin fines de lucro con sede en Viena, Austria, dedicada al fomento del multilingüismo y la enseñanza de lenguas minoritarias. Operan con un equipo pequeño de voluntarios y profesionales.

**Estado:** En desarrollo

---

## El alcance del proyecto

Este proyecto es diferente a los anteriores: es **sitio web público + herramientas internas**.

| Componente | Descripción | Estado |
|-----------|-------------|--------|
| Sitio web institucional | Presentación pública de la asociación (alemán/inglés) | En desarrollo |
| Newsletter | Sistema de envío a suscriptores | Pendiente |
| Gestión de proyectos | Herramientas internas del equipo | Pendiente |

---

## Por qué es un proyecto de portafolio

Sprachenmehr es un proyecto pro bono / a precio reducido. El objetivo principal es:
1. Demostrar que Milpa puede trabajar con clientes europeos en idiomas distintos al español
2. Tener un caso de uso en sector social/educativo
3. Servir como portafolio de diseño web (el sitio tiene identidad visual propia, no Milpa)

---

## Datos técnicos

- **Repo:** \`github.com/milpa-cloud/sprachenmehr\` (privado)
- **Stack del sitio web:** HTML/CSS estático por ahora (mockups), migrar a Next.js
- **Idiomas:** Alemán (primario), inglés
- **Deploy:** Firebase Hosting

---

## Notas importantes

La dirección de contacto principal es Wien, Austria. Las comunicaciones son en inglés y alemán. El presupuesto es limitado — ser eficiente con el tiempo.`,
},

// ══════════════════════════════════════════════════════
//  GUÍAS
// ══════════════════════════════════════════════════════

{
  titulo: "Cómo usar el módulo de Tareas",
  categoria: "Guías",
  contenido: `# Cómo usar el módulo de Tareas

El módulo de Tareas es el tablero Kanban del equipo. Sirve para organizar el trabajo del día a día en columnas por estado.

---

## Las columnas del tablero

| Columna | Significado |
|---------|-------------|
| **Pendiente** | Tarea registrada pero no iniciada |
| **En progreso** | Alguien está trabajando en esto ahora |
| **Completada** | Terminada |

---

## Crear una tarea

1. Haz clic en **"Nueva tarea"** (botón verde arriba a la derecha)
2. Llena el título — hazlo descriptivo, no solo "revisar"
3. Asigna a alguien del equipo (opcional)
4. Define la prioridad: Alta / Media / Baja
5. Agrega una fecha de vencimiento si aplica
6. Escribe una descripción si el título no es suficiente
7. Haz clic en **Guardar**

La tarea aparece automáticamente en la columna **Pendiente**.

---

## Mover una tarea entre columnas

Haz clic en la tarea para abrir el panel de detalle, luego cambia el estado en el menú desplegable. O usa los botones de acción rápida en la tarjeta.

---

## Tareas de un proyecto

Las tareas que pertenecen a un proyecto específico se ven en la sección **Tareas** dentro del proyecto (módulo de Proyectos). Las tareas sin proyecto asignado aparecen en el tablero general.

---

## Prioridades

- **Alta** — urgente, necesita atención hoy
- **Media** — importante pero no urgente
- **Baja** — cuando haya tiempo

---

## Buenas prácticas

- Mantén el tablero actualizado — si terminas algo, marca como completada ese mismo día
- No acumules tareas sin fecha. Si no tiene fecha, probablemente no es una tarea sino una idea
- Las tareas completadas se pueden ver filtrando por estado`,
},

{
  titulo: "Cómo usar el módulo de Proyectos",
  categoria: "Guías",
  contenido: `# Cómo usar el módulo de Proyectos

El módulo de Proyectos es para gestionar el trabajo entregable a tus clientes. Un Proyecto agrupa toda la información y el trabajo relacionado con una entrega.

---

## Crear un proyecto

1. Haz clic en **"Nuevo proyecto"**
2. Llena el nombre del proyecto (ej: "Remodelación oficina Martínez")
3. Agrega el nombre del cliente
4. Define el estado inicial: **En desarrollo**
5. Agrega una descripción breve del alcance
6. Guarda

---

## Las secciones de un proyecto

### Información general
- Datos del cliente, industria, estado del proyecto, descripción

### Tareas
- Todas las tareas vinculadas a este proyecto
- Puedes crear tareas directamente desde aquí — quedan vinculadas automáticamente

### Checklist (Puntos del proyecto)
- Lista de entregables o hitos con estado (completado / pendiente)
- Útil para llevar un control de avance claro

### Módulos del proyecto
- Funciones o características específicas que tiene este proyecto
- Cada una tiene su propio estado: Pendiente / En desarrollo / Completado

---

## Estados del proyecto

| Estado | Cuándo usarlo |
|--------|---------------|
| En desarrollo | Trabajo activo en curso |
| Activo | En producción, soporte continuo |
| Completado | Entrega terminada |
| Pausado | En espera por causa externa |

---

## Buenas prácticas

- Un proyecto = un cliente o una entrega. No mezcles proyectos de clientes distintos.
- Actualiza el estado de los módulos conforme avanzas — te da visibilidad del progreso.
- Usa el checklist para los entregables que el cliente puede ver y aprobar.`,
},

{
  titulo: "Cómo usar la Wiki",
  categoria: "Guías",
  contenido: `# Cómo usar la Wiki

La Wiki es la base de conocimiento interna del equipo. Aquí va todo lo que el equipo necesita saber para hacer su trabajo: procesos, decisiones, guías, información de clientes.

---

## Para qué sirve la Wiki

- Documentar cómo se hacen las cosas (procesos repetibles)
- Guardar información de clientes (contactos, contratos, notas)
- Registrar decisiones importantes y su justificación
- Crear guías para miembros nuevos del equipo
- Cualquier cosa que no quieres tener que explicar dos veces

---

## Crear una página

1. Haz clic en **"Nueva página"**
2. Escribe el título — tiene que ser claro y descriptivo
3. Elige la categoría que mejor describe el contenido
4. Escribe el contenido usando Markdown:
   - \`# Título\` para encabezados
   - \`**texto**\` para **negritas**
   - \`- ítem\` para listas
   - \`---\` para separadores
5. Guarda con el botón **Guardar**

---

## Categorías disponibles

| Categoría | Para qué |
|-----------|---------|
| Visión | Qué es Milpa, por qué existimos |
| Negocio | Precios, roles, modelo económico |
| Técnico | Stack, arquitectura, base de datos |
| Producto | Módulos, roadmap |
| Operaciones | Procesos del equipo, cómo hacer las cosas |
| Clientes | Información de cada cliente activo |
| Guías | Cómo usar cada parte del sistema |

---

## Editar una página

Abre la página, haz clic en **"Editar"**, modifica el contenido y guarda. La fecha de última actualización se registra automáticamente.

---

## Buenas prácticas

- Si tuviste que preguntarle a alguien cómo se hace algo, ese proceso debería estar en la Wiki.
- Actualiza las páginas cuando los procesos cambien — una Wiki desactualizada confunde más que ayuda.
- Usa encabezados (\`##\`) para estructurar páginas largas.`,
},

{
  titulo: "Cómo usar el Calendario",
  categoria: "Guías",
  contenido: `# Cómo usar el Calendario

El módulo de Calendario muestra las tareas con fecha de vencimiento en una vista de calendario mensual. No es una agenda de eventos — es una forma de ver cuándo vencen las tareas del equipo.

---

## Lo que muestra el Calendario

- **Tareas con fecha de vencimiento** del módulo de Tareas
- Organizadas en la fecha en que vencen
- Con colores que indican el estado: verde (completada), amarillo (en progreso), gris (pendiente)

---

## Navegar entre meses

Usa las flechas ← → en la parte superior para moverte entre meses. El mes actual está resaltado.

---

## Ver el detalle de una tarea

Haz clic en cualquier tarea en el calendario para ver sus detalles: título, estado, prioridad, a quién está asignada.

---

## Importante

El Calendario no tiene su propia base de datos. Consume las tareas del módulo de Tareas. Esto significa:
- Para que una tarea aparezca en el Calendario, debe tener fecha de vencimiento
- Si cambias el estado de una tarea desde el Calendario, el cambio se refleja en el módulo de Tareas y viceversa

---

## Para agregar una tarea con fecha

Ve al módulo de **Tareas**, crea o edita una tarea y asigna una fecha de vencimiento. Aparecerá automáticamente en el Calendario.`,
},

];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nSubiendo ${paginas.length} páginas a la wiki de Milpa...\n`);
  let ok = 0;
  let errores = 0;

  for (const pagina of paginas) {
    try {
      await crearPagina(pagina);
      ok++;
    } catch (e) {
      console.error(`✗  ERROR en "${pagina.titulo}": ${e.message}`);
      errores++;
    }
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\n✅ ${ok} páginas subidas | ❌ ${errores} errores`);
  console.log("→ Abre el ERP en /wiki para verlas\n");
}

main();
