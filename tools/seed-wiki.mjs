// Poblar la wiki de Firestore con el conocimiento real del equipo Milpa
// Uso: node tools/seed-wiki.mjs

import { readFileSync } from "fs";
import { homedir } from "os";

const PROJECT_ID = "milpa-erp-app";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/wiki`;

const firebaseCfg = JSON.parse(readFileSync(`${homedir()}/.config/configstore/firebase-tools.json`, "utf8"));
const ACCESS_TOKEN = firebaseCfg.tokens.access_token;

const ahora = new Date().toISOString();

const paginas = [
  // ── VISIÓN ──────────────────────────────────────────────────────────────────
  {
    titulo: "Qué es Milpa",
    categoria: "Visión",
    autor: "Pablo Spada",
    contenido: `## El problema que resolvemos

Un negocio de 10 a 50 empleados en crecimiento vive así:

- **Comunicación**: WhatsApp
- **Inventario**: una hoja de Excel que nadie entiende
- **Pedidos**: papel o un grupo de Telegram
- **Documentos internos**: carpetas de Google Drive sin orden
- **Tareas del equipo**: listas en papel o de cabeza

Saben que necesitan algo mejor. Pero tienen dos opciones malas:

1. **Herramientas genéricas** (Notion, Trello, Monday) — no encajan en cómo trabajan, el equipo no las adopta, los datos quedan dispersos en tres plataformas distintas.
2. **Software a medida tradicional** — $15,000–50,000 USD de una agencia, meses de desarrollo.

Milpa es la tercera opción que no existía.

## Cómo lo resolvemos

Tenemos una biblioteca de módulos — pedazos de software ya construidos que cubren las necesidades más comunes de un negocio. Para cada cliente, seleccionamos los módulos que necesita, los configuramos a su flujo, los diseñamos con su identidad, y los desplegamos como **su propio sistema**.

## Lo que nos diferencia

- El cliente paga por el setup y el soporte, **no por el código**. El código es MIT (open source).
- **Cada cliente tiene su propia instancia**: su URL, su base de datos, su repositorio de GitHub. Cero lock-in.
- **Sin cobro por usuario**. El cliente puede agregar a todo su equipo.
- Si el cliente deja de trabajar con Milpa, se lleva todo — código y datos.

## Lo que Milpa no es

- No es una consultora que revende la plataforma de alguien más
- No es una agencia que hace landing pages
- No es un freelancer solo — es un equipo pequeño y enfocado
- No es premium por el gusto de ser caro — precio accesible para valor real`,
  },
  {
    titulo: "La visión a largo plazo",
    categoria: "Visión",
    autor: "Pablo Spada",
    contenido: `Un negocio chico o mediano en LATAM debería poder acceder al mismo nivel de herramientas internas que tiene una empresa grande — sin pagar lo que paga una empresa grande.

Hoy, el carpintero de Oaxaca tiene que elegir entre Excel y gastar $30,000 en un sistema. Milpa es la tercera opción: software real, a su medida, a un precio que tiene sentido para él.

## La estrategia open source

El código es libre. Cualquiera puede clonarlo y montar su propio ERP. Milpa cobra por el setup, soporte y personalización — no por el código.

Es el modelo de RedHat, Cal.com, Ghost, Supabase. El 95% de los clientes no pueden ni quieren hacer la instalación solos.

El repositorio público \`github.com/milpa-cloud/erp\` (MIT) es la base. Cada cliente recibe un fork privado con su configuración.

## Cómo crece el negocio

El modelo escala cuando el costo de agregar un cliente nuevo baja — porque los módulos ya están construidos. Los primeros meses construimos los módulos. A partir del cliente 5 o 6, el costo marginal de un cliente nuevo es principalmente tiempo de configuración y soporte, no desarrollo.`,
  },

  // ── NEGOCIO ─────────────────────────────────────────────────────────────────
  {
    titulo: "Modelo de precios",
    categoria: "Negocio",
    autor: "Pablo Spada",
    contenido: `## Estructura de precios

| Concepto | Monto |
|----------|-------|
| Setup fee (único) | $500 – $1,000 USD |
| Soporte mensual | $30 – $80 USD/mes |
| Personalización por hora | $40 – $80 USD/hr |

**Setup cubre:** instalación, configuración con identidad del cliente, migración de datos existentes, capacitación inicial.

**Mensual cubre:** hosting, actualizaciones de seguridad, soporte técnico, acceso a módulos nuevos.

**Personalización:** cuando el cliente pide algo fuera del scope estándar.

## Sin cobro por usuario

No cobramos por usuario. El cliente puede agregar a todo su equipo, cambiar de personal, dar accesos temporales — sin costo adicional.

## Proyección a 12 meses

Asumiendo 1 cliente nuevo por mes y $60/mes de precio promedio:

- Mes 3: 2 clientes → ~$820 ese mes
- Mes 6: 5 clientes → ~$1,000 ese mes
- Mes 12: 12 clientes → ~$1,420 ese mes

**La honestidad del número:** ingreso complementario a corto plazo. Escala cuando los módulos ya están construidos y el costo de agregar un cliente baja.`,
  },
  {
    titulo: "Roles del equipo",
    categoria: "Negocio",
    autor: "Pablo Spada",
    contenido: `Tres áreas de responsabilidad. No son puestos fijos todavía.

## Tech Lead

- Desarrollo de módulos nuevos y mantenimiento del ERP
- Setup e infraestructura por cliente (Firebase, DNS, dominio, deploy)
- Arquitectura del sistema y decisiones técnicas

## Diseño / UX

- Diseño de UI para módulos nuevos
- Branding por cliente: colores, logo, tipografía en \`milpa.config.ts\`
- Material visual de ventas (landing, demos)

## Ventas / Ops / Project Management

- Conseguir clientes nuevos
- Onboarding inicial y relación con el cliente
- Gestión de proyectos en curso

## Cómo tomamos decisiones

- Decisiones técnicas → Tech Lead decide, documenta en \`docs/ARCHITECTURE.md\`
- Decisiones de producto → conversación de equipo, documenta en esta wiki
- Decisiones de negocio → Pablo decide, documenta en esta wiki

**Cualquier decisión importante tomada en una llamada debe quedar escrita aquí antes de 24 horas.**`,
  },
  {
    titulo: "Decisiones pendientes",
    categoria: "Negocio",
    autor: "Pablo Spada",
    contenido: `Lista de cosas que aún no están definidas. Actualizar cuando se tome una decisión.

## Auth real para los sistemas de clientes

Actualmente los sistemas corren sin login — cualquiera con la URL puede acceder.

El plan es Supabase Auth (email + Google OAuth), pero no está implementado.

**Hay que decidir:**
- ¿Cuándo priorizamos esto?
- ¿Primero Firebase Auth como solución rápida o directamente Supabase?

## Migración de Firestore a Supabase

El ERP usa Firebase Firestore hoy. El objetivo es PostgreSQL con Supabase. La migración es gradual.

**Hay que decidir:**
- ¿Cuándo empieza?
- ¿Qué módulo va primero?

## Publicar el repo público en GitHub

\`github.com/milpa-cloud/erp\` todavía no existe. El código está listo.

**Hay que decidir:** ¿Cuándo publicamos? ¿Qué incluimos en el README público?

## Repos de clientes en GitHub

Los repos de clientes (forks privados) aún no existen porque el repo público base no está publicado.

**Hay que decidir:** ¿Esperamos al repo público o creamos repos privados vacíos ya?

## Módulos para construir primero

No hay una lista priorizada de los próximos módulos.

**Candidatos:** CRM/Contactos, Password Manager, Dashboard configurable, Export de datos, Notificaciones`,
  },

  // ── TÉCNICO ─────────────────────────────────────────────────────────────────
  {
    titulo: "Infraestructura",
    categoria: "Técnico",
    autor: "Pablo Spada",
    contenido: `## URLs activas

| URL | Qué es | Firebase project |
|-----|--------|-----------------|
| \`milpa.cloud\` | Landing page pública | \`milpa-studio-landing\` |
| \`equipo.milpa.cloud\` | ERP del equipo Milpa | \`milpa-erp-app\` |

## DNS

- Dominio \`milpa.cloud\` registrado en **Porkbun**
- Nameservers apuntando a **Cloudflare**
- \`milpa.cloud\` → A record → Firebase IP, proxy ON
- \`equipo.milpa.cloud\` → CNAME → \`milpa-erp-app.web.app\`, proxy OFF

## Email

- **Zoho Mail** (plan Forever Free), datacenter EU
- \`pablo.spada@milpa.cloud\` — cuenta principal
- \`hola@milpa.cloud\` — alias de contacto
- SMTP: \`smtp.zoho.eu\` puerto 587 — **no usar \`smtp.zoho.com\`** (es para el datacenter US)

## Formulario de contacto

Cloud Function \`contact\` → nodemailer → Zoho SMTP → \`hola@milpa.cloud\`

Secretos en Firebase: \`ZOHO_USER\`, \`ZOHO_PASS\` (App Password de Zoho).

## Lección: Cloudflare proxy + Firebase custom domain

Al conectar un dominio nuevo en Firebase, el proxy de Cloudflare debe estar **apagado** (DNS only) durante la verificación. Firebase necesita emitir su propio certificado SSL. Una vez que Firebase muestra "Connected", se puede reactivar.

## Lección: Firebase project deletion

Si se borra un proyecto de Firebase por error, se puede restaurar dentro de los **30 días** desde \`console.cloud.google.com/cloud-resource-manager\` → buscar "Pending deletion" → Restore. Después de 30 días los datos se pierden.`,
  },
  {
    titulo: "Stack técnico",
    categoria: "Técnico",
    autor: "Pablo Spada",
    contenido: `## Lo que usamos HOY

\`\`\`
Framework:     Next.js 16.2.9, App Router, output: "export" (static)
Lenguaje:      TypeScript
Estilos:       Tailwind CSS v4
Iconos:        lucide-react
Base de datos: Firebase Firestore (tiempo real, onSnapshot)
Auth:          Firebase Auth — parcialmente implementado
Hosting:       Firebase Hosting — un site por proyecto
Email:         Zoho Mail + Cloud Functions + nodemailer
DNS:           Cloudflare
\`\`\`

## Hacia dónde vamos

\`\`\`
Base de datos: Supabase (PostgreSQL)
Auth:          Supabase Auth (email + Google OAuth)
\`\`\`

La migración es **gradual** — no es un evento. Los módulos nuevos se construyen en Supabase. Los existentes se migran cuando haya oportunidad.

## Por qué static export

\`output: "export"\` genera HTML/CSS/JS estático. No hay servidor Node.js corriendo. Firebase Hosting sirve los archivos desde CDN.

**Ventajas:** costo casi cero, sin servidores que mantener, deploy instantáneo.
**Desventaja:** no hay API routes nativas — para el backend usamos Firebase Cloud Functions.

## Por qué Firestore y no SQL todavía

Firestore tiene listeners en tiempo real (\`onSnapshot\`) que actualizan la UI instantáneamente sin polling. La migración a Supabase traerá Supabase Realtime como reemplazo.`,
  },
  {
    titulo: "Cómo deployar",
    categoria: "Técnico",
    autor: "Pablo Spada",
    contenido: `## Deploy estándar

Desde la raíz del proyecto:

\`\`\`
npm run build
firebase deploy --only hosting
\`\`\`

El comando \`build\` genera la carpeta \`out/\` con los archivos estáticos. Firebase sube esos archivos a CDN.

## Deploy de Cloud Functions (solo la landing)

\`\`\`
cd functions
npm run build
cd ..
firebase deploy --only functions
\`\`\`

## Deploy de reglas de Firestore

\`\`\`
firebase deploy --only firestore:rules
\`\`\`

Las reglas están en \`firestore.rules\`. Actualmente en modo demo (\`allow read, write: if true\`). **Cambiar antes de ir a producción real.**

## Variables de entorno necesarias

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
\`\`\`

Ver \`.env.local.example\` para la estructura. El archivo \`.env.local\` nunca se sube a git.

## Si el build falla

1. Revisar errores de TypeScript: \`npx tsc --noEmit\`
2. Verificar que todas las variables de entorno estén en \`.env.local\`
3. Revisar que los imports no referencien paquetes inexistentes`,
  },

  // ── PRODUCTO ────────────────────────────────────────────────────────────────
  {
    titulo: "Módulos disponibles",
    categoria: "Producto",
    autor: "Pablo Spada",
    contenido: `Módulos construidos y funcionando en el ERP:

## Tareas & Kanban (\`/tareas\`)

Tablero de trabajo del equipo. Tareas con estado (pendiente / en progreso / completada), asignación, prioridad y vínculo a proyectos. Vista lista y vista Kanban.

## Calendario (\`/calendario\`)

Agenda compartida del equipo. Eventos con fecha, hora y descripción.

## Wiki (\`/wiki\`)

Base de conocimiento interna. Páginas con markdown, organizadas por categoría. Búsqueda por texto. Esta misma página es parte de la wiki.

## Proyectos (\`/proyectos\`)

Gestión de proyectos estilo Basecamp. Cada proyecto tiene puntos (checklist), módulos asignados, tareas vinculadas y estado general.

---

## Módulos pendientes de construir

| Módulo | Descripción | Prioridad |
|--------|-------------|-----------|
| CRM / Contactos | Clientes, proveedores, historial | Alta |
| Password Manager | Credenciales compartidas, encriptadas | Media |
| Dashboard configurable | Widgets por cliente | Media |
| Export de datos | CSV + JSON por módulo | Media |
| Notificaciones | In-app + email | Baja |`,
  },
  {
    titulo: "Config sobre código — el principio central",
    categoria: "Producto",
    autor: "Pablo Spada",
    contenido: `El principio más importante del sistema: **el código de los módulos no cambia entre clientes. Solo la configuración.**

## milpa.config.ts

Cada cliente tiene su \`milpa.config.ts\` que define todo lo que es único de ese cliente:

\`\`\`typescript
export const config = {
  cliente: {
    nombre: "Nombre del cliente",
    slug: "slug-cliente",
    locale: "es",
    logo: "/logo.png",
    colores: {
      primario: "#059669",
      acento: "#047857",
    },
  },
  modulos: ["tareas", "proyectos", "wiki", "calendario"],
} as const;
\`\`\`

## Qué va en milpa.config.ts

| El cliente quiere | Cómo se resuelve |
|-------------------|-----------------|
| Cambiar colores de marca | \`config.cliente.colores\` |
| Cambiar el logo | \`config.cliente.logo\` |
| Que "Tareas" se llame "Pedidos" | \`config.modulos.tareas.etiquetas.titulo\` |
| Cambiar el idioma | \`config.cliente.locale\` |
| Activar / desactivar módulos | \`config.modulos\` array |

## Por qué esto importa

Cuando el repo público actualiza un módulo, el cliente puede aplicar esa actualización con \`git merge upstream/main\`. Si el cliente nunca tocó el código del módulo — solo \`milpa.config.ts\` — el merge es limpio.

Si alguien editó el módulo directamente en el repo del cliente, ese merge va a tener conflictos cada vez. Con el tiempo, el cliente queda desconectado de las mejoras del repo público.

## Cuándo sí se puede editar código en el repo del cliente

Solo cuando el cliente necesita algo que no cabe en la configuración y es específico solo de él. En ese caso, el código va en \`cliente/\` — nunca en los módulos.`,
  },
  {
    titulo: "Cómo construir un módulo nuevo",
    categoria: "Producto",
    autor: "Pablo Spada",
    contenido: `Pasos exactos para crear un módulo nuevo en el repo público.

## 1. Crear la estructura

\`\`\`
src/modules/[nombre]/
  components/       ← componentes de UI
  queries.ts        ← funciones CRUD a la base de datos
  types.ts          ← interfaces TypeScript
  index.ts          ← barrel export
  SKILL.md          ← guía para la IA (OBLIGATORIO)
\`\`\`

## 2. Crear la página de Next.js

\`\`\`
src/app/[nombre]/page.tsx
\`\`\`

Esta página es solo un shell — importa del módulo, no contiene lógica.

## 3. Crear la migración SQL

\`\`\`
supabase/migrations/NNN_[nombre].sql
\`\`\`

Donde NNN es el siguiente número disponible.

## 4. Registrar en el sidebar

Editar \`src/modules/registry.ts\`:

\`\`\`typescript
export const MODULE_REGISTRY = {
  crm: { href: "/crm", label: "CRM", icon: Users },
};
\`\`\`

El sidebar se actualiza automáticamente. **No tocar \`src/components/Sidebar.tsx\`.**

## 5. Escribir el SKILL.md (obligatorio)

Sin SKILL.md la IA no sabe cómo trabajar con ese módulo en sesiones futuras. Ver template en \`docs/PLAYBOOK.md\`.

## Regla crítica

**NUNCA activar un módulo para un cliente sin correr su migración SQL.** La app compila sin error y rompe silenciosamente en runtime si no se corre.`,
  },

  // ── OPERACIONES ─────────────────────────────────────────────────────────────
  {
    titulo: "Reglas que no se negocian",
    categoria: "Operaciones",
    autor: "Pablo Spada",
    contenido: `Estas reglas aplican a cualquier cambio en cualquier proyecto. No se negocian.

## Sobre repos de clientes

- **NUNCA editar el código de un módulo** en el repo de un cliente. Las personalizaciones van en \`milpa.config.ts\` o en \`cliente/\`.
- **NUNCA meter código específico de un cliente** en el repo público.
- **SIEMPRE documentar** en \`cliente/README.md\` cualquier código único del cliente.

## Sobre módulos

- **NUNCA construir un módulo nuevo sin su \`SKILL.md\`.**
- **NUNCA activar un módulo sin correr su migración SQL.**
- **SIEMPRE agregar módulos en \`src/modules/[nombre]/\`** — no meter lógica en las páginas.

## Sobre la configuración

- **SIEMPRE usar \`milpa.config.ts\`** para colores, logo, módulos activos, labels.
- **NUNCA hardcodear valores de cliente** en componentes.
- **NUNCA cambiar \`milpa.config.ts\` del repo público** con valores de un cliente real.

## Sobre el sidebar

**El sidebar NO se edita a mano.** Se construye dinámicamente desde \`config.modulos\` + \`MODULE_REGISTRY\`.

## Sobre decisiones

Cualquier decisión importante tomada en una llamada debe quedar escrita en la wiki antes de 24 horas.`,
  },
  {
    titulo: "Convenciones de código y commits",
    categoria: "Operaciones",
    autor: "Pablo Spada",
    contenido: `## Convenciones de commits

| Prefijo | Cuándo usarlo |
|---------|--------------|
| \`feat:\` | nueva función o módulo |
| \`fix:\` | corrección de bug |
| \`config:\` | cambio en milpa.config.ts |
| \`cliente:\` | cambio en la carpeta cliente/ |
| \`deploy:\` | cambio de infraestructura o hosting |
| \`docs:\` | cambio en documentación |
| \`merge:\` | merge de upstream |

## Convenciones de código

- Componentes en PascalCase: \`TareaCard.tsx\`
- Funciones CRUD en \`queries.ts\`: \`escuchar*()\`, \`crear*()\`, \`actualizar*()\`, \`eliminar*()\`
- Interfaces en \`types.ts\`, barrel export en \`index.ts\`
- Sin comentarios explicando qué hace el código — los nombres deben ser claros
- Comentarios solo cuando el POR QUÉ no es obvio

## Un servicio por función

Antes de agregar una dependencia externa nueva, verificar si Firebase o Supabase ya lo resuelven. Si es inevitable, usar un servicio para toda esa función — no mezclar proveedores distintos para el mismo tipo de tarea.

## Antes de deployar

- \`npm run build\` sin errores de TypeScript
- Los módulos activos aparecen en el sidebar, los inactivos no
- Las migraciones SQL están corridas
- \`cliente/README.md\` actualizado si hubo cambios de código específico`,
  },

  // ── GUÍAS ───────────────────────────────────────────────────────────────────
  {
    titulo: "Onboarding: cómo empezar a trabajar",
    categoria: "Guías",
    autor: "Pablo Spada",
    contenido: `Guía para alguien nuevo en el equipo.

## Leer primero

1. Esta wiki — empieza por "Qué es Milpa" y "Reglas que no se negocian"
2. \`docs/ARCHITECTURE.md\` — el por qué de las decisiones técnicas
3. \`docs/PLAYBOOK.md\` — pasos exactos de operaciones estándar
4. \`landing-milpa/DESIGN.md\` — design system de la marca

## Configurar el entorno local

\`\`\`bash
# Clonar el workspace
git clone https://github.com/milpa-cloud/dev-studio
cd dev-studio/milpa-erp

# Instalar dependencias
npm install

# Copiar variables de entorno (pedir los valores a Pablo)
cp .env.local.example .env.local
\`\`\`

## Correr el ERP en local

\`\`\`bash
npm run dev
# Abre en http://localhost:3000
\`\`\`

## Estructura de carpetas clave

\`\`\`
milpa-erp/
  src/
    app/            ← páginas Next.js (shells sin lógica)
    modules/        ← lógica real de cada módulo
    components/     ← componentes compartidos (Sidebar, etc.)
    lib/firebase.ts ← init y funciones de Firestore
  docs/             ← documentación del proyecto
  supabase/         ← migraciones SQL
  tools/            ← scripts de utilidad
\`\`\`

## Contacto

- Pablo Spada: pablo.spada@milpa.cloud
- Email general: hola@milpa.cloud`,
  },
  {
    titulo: "Cómo trabajar con la IA (Claude)",
    categoria: "Guías",
    autor: "Pablo Spada",
    contenido: `Este proyecto está configurado para trabajar con Claude como asistente de desarrollo.

## Cómo funciona el contexto

Los archivos \`CLAUDE.md\` en cada directorio le dan instrucciones a Claude cuando trabaja en ese proyecto. Claude los lee al inicio de cada sesión. Hay uno en:

- \`dev-studio/CLAUDE.md\` — reglas del workspace completo
- \`milpa-erp/CLAUDE.md\` — contexto técnico del ERP
- \`landing-milpa/CLAUDE.md\` — contexto de la landing

## Los SKILL.md de los módulos

Cada módulo tiene un \`SKILL.md\` que le dice a Claude exactamente cómo trabaja ese módulo. Por eso es obligatorio crear \`SKILL.md\` para cada módulo nuevo — sin él, Claude empieza cada sesión sin saber cómo funciona el módulo.

## Qué funciona bien con Claude

- Construir módulos siguiendo la estructura existente
- Debug de errores con contexto
- Escribir queries de Firestore/Supabase
- Actualizar el design system de la landing
- Poblar la wiki (como este script)

## Qué NO pedirle

- Que tome decisiones de arquitectura solo — esas se toman en equipo y se documentan
- Que meta código de un cliente en el repo público
- Que edite módulos en el repo de un cliente en vez de usar config
- Que invente nombres para cosas que ya tienen nombre definido en el sistema`,
  },
];

async function crearPagina(pagina) {
  const body = {
    fields: {
      titulo:       { stringValue: pagina.titulo },
      contenido:    { stringValue: pagina.contenido },
      categoria:    { stringValue: pagina.categoria },
      autor:        { stringValue: pagina.autor },
      actualizadoEn: { timestampValue: ahora },
    },
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error creando "${pagina.titulo}": ${err}`);
  }

  console.log(`✓  [${pagina.categoria}] ${pagina.titulo}`);
}

console.log(`\nCreando ${paginas.length} páginas en la wiki de equipo.milpa.cloud...\n`);

for (const pagina of paginas) {
  await crearPagina(pagina);
}

console.log(`\n✅  ${paginas.length} páginas creadas.`);
