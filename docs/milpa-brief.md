# Milpa — Estado del proyecto
*Actualizado: junio 2026 — documento vivo para el equipo*

---

## Qué es Milpa

Milpa es un **estudio de software** con base en Oaxaca, México. Construimos herramientas internas para negocios en crecimiento: sistemas de gestión personalizados que el cliente configura a su flujo, y de los que es dueño para siempre.

**El problema que resolvemos:** un negocio de 10–50 empleados tiene que elegir entre Excel y pagar $30,000 USD a una agencia. Milpa es la tercera opción — software real, a medida, a un precio que tiene sentido.

**Lo que nos diferencia:**
- El cliente paga por el setup y el soporte, no por el código. El código es MIT (open source).
- Cada cliente tiene su propia instancia: su URL, su base de datos, su repositorio de GitHub. Cero lock-in.
- Sin cobro por usuario. El cliente puede agregar a todo su equipo.
- Si el cliente deja de trabajar con Milpa, se lleva todo — código y datos.

---

## Lo que ya existe y funciona (junio 2026)

### Infraestructura confirmada

| URL | Qué es | Hosting | Estado |
|-----|--------|---------|--------|
| `milpa.cloud` | Landing page pública | Firebase (`milpa-studio-landing`) | ✅ Live |
| `equipo.milpa.cloud` | ERP interno del equipo Milpa | Firebase (`milpa-erp-app`) | ✅ Live |
| `hola@milpa.cloud` | Email de contacto | Zoho Mail (EU) | ✅ Funcionando |
| `pablo.spada@milpa.cloud` | Email personal Pablo | Zoho Mail (EU) | ✅ Funcionando |

- **DNS:** dominio registrado en Porkbun, nameservers en **Cloudflare**
- **Deploy:** siempre `npm run build && firebase deploy --only hosting` desde la raíz del proyecto
- **Formulario de contacto:** Cloud Function `contact` → Zoho SMTP (`smtp.zoho.eu`) → `hola@milpa.cloud`
- **Secretos del formulario:** guardados como Firebase Secrets (`ZOHO_USER`, `ZOHO_PASS`)

### Clientes activos

| Cliente | País | Estado | Firebase project |
|---------|------|--------|-----------------|
| Carpintería Huayapam | Oaxaca, México | ✅ En producción | `carpinteria-erp-v2` |
| Tomates La Era | México | ✅ En producción | `tomates-la-era` |
| Sprachenmehr e.V. | Viena, Austria | 🔨 En desarrollo | `milpa-sprachenmehr` |

### Módulos construidos (ERP del equipo en `equipo.milpa.cloud`)

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Dashboard | `/` | Resumen general |
| Tareas & Kanban | `/tareas` | Tareas con estados, filtros, tablero Kanban |
| Calendario | `/calendario` | Eventos del equipo |
| Wiki | `/wiki` | Base de conocimiento interna |
| Proyectos | `/proyectos` | Proyectos con puntos y módulos asignados |

Todos corren sobre **Firebase Firestore** con listeners en tiempo real (`onSnapshot`).

### Landing page (`milpa.cloud`)

- Bilingüe (ES/EN), un solo archivo `src/app/page.tsx`
- Demo interactivo del producto con 4 tipos de negocio: Carpintería, Gym de escalada, Arquitectura, Academia de idiomas
- Formulario de contacto funcionando → llega a `hola@milpa.cloud`
- Design system completo documentado en `landing-milpa/DESIGN.md`

---

## Stack técnico

### Lo que usamos HOY

```
Framework:     Next.js 16.2.9, App Router, output: "export" (static)
Lenguaje:      TypeScript
Estilos:       Tailwind CSS v4
Iconos:        lucide-react
Base de datos: Firebase Firestore (tiempo real, onSnapshot)
Auth:          Firebase Auth — implementado parcialmente, sin login en clientes aún
Hosting:       Firebase Hosting — un site por proyecto
Email:         Zoho Mail (EU) + Cloud Functions + nodemailer
DNS:           Cloudflare
```

### Hacia dónde vamos

```
Base de datos: Supabase (PostgreSQL) — migración gradual
Auth:          Supabase Auth (email + Google OAuth)
```

La migración no es un evento — es gradual. Los módulos nuevos se construyen en Supabase. Los existentes se migran cuando haya oportunidad. No tirar lo que funciona.

**Por qué no nos movemos de Firebase Hosting a Vercel:** Firebase con `output: "export"` funciona, es gratis en el tier actual y la infraestructura ya está configurada. No cambiar por cambiar.

---

## Repositorios

```
github.com/milpa-cloud/dev-studio  (PRIVADO) ← workspace del estudio
  landing-milpa/    — milpa.cloud
  milpa-erp/        — ERP genérico + instancia del equipo
  sprachenmehr/     — mockups cliente Sprachenmehr
  client-template/  — guía de onboarding

github.com/milpa-cloud/erp  (PÚBLICO, MIT) ← PENDIENTE DE PUBLICAR
  El código ya está listo en dev-studio/milpa-erp/
  Publicarlo es un paso pendiente (ver decisiones pendientes)
```

Los repos de clientes (huayapam-erp, tomates-erp, sprachenmehr) serán forks privados del repo público. Aún no existen en GitHub porque el repo público base no está publicado.

---

## Modelo de negocio

| Concepto | Monto |
|----------|-------|
| Setup fee (único) | $500 – $1,000 USD |
| Soporte mensual | $30 – $80 USD/mes |
| Personalización por hora | $40 – $80 USD/hr |

**Setup cubre:** instalación, configuración con identidad del cliente, migración de datos, capacitación.  
**Mensual cubre:** hosting, actualizaciones de seguridad, soporte, acceso a módulos nuevos.

**Proyección honesta a 12 meses** (1 cliente nuevo/mes, $60/mes promedio):

| Mes | Clientes | MRR | Setup ese mes | Total |
|-----|----------|-----|---------------|-------|
| 3 | 2 | ~$120 | $700 | ~$820 |
| 6 | 5 | ~$300 | $700 | ~$1,000 |
| 12 | 12 | ~$720 | $700 | ~$1,420 |

Es ingreso complementario a corto plazo. Escala cuando el costo de agregar un cliente baja porque los módulos ya están construidos.

---

## Roles del equipo

**Tech Lead**
- Desarrollo de módulos y mantenimiento del ERP
- Setup e infraestructura por cliente (Firebase, DNS, deploy)
- Arquitectura del sistema

**Diseño / UX**
- UI de módulos nuevos
- Branding por cliente (colores, logo, tipografía en `milpa.config.ts`)
- Material visual de ventas

**Ventas / Ops / Project Management**
- Conseguir clientes nuevos y onboarding
- Comunicación y soporte con clientes activos
- Gestión de proyectos

---

## Decisiones ya tomadas — no revisitar sin razón fuerte

| Decisión | Por qué |
|----------|---------|
| Un repo por cliente (fork privado) | Los datos y personalizaciones son del cliente; el código genérico se actualiza con merge del upstream |
| Config sobre código (`milpa.config.ts`) | Permite recibir actualizaciones del repo público sin conflictos |
| Módulos autocontenidos en `src/modules/` | Las páginas de Next.js son shells — lógica en el módulo, no en la página |
| Static export + Firebase Hosting | Elimina servidores, simplifica deploy, reduce costo |
| Zoho Mail para email | Plan free, SMTP disponible, EU datacenter — no depende de terceros adicionales |
| Firestore para el ERP actual | En producción con datos reales; migrar requiere tiempo que no es prioridad ahora |
| Un servicio por función (no uno por feature) | Minimiza complejidad operativa y dependencias externas |
| El sidebar se construye dinámicamente | Desde `config.modulos` + `MODULE_REGISTRY` — no se edita a mano |

---

## Decisiones pendientes — hay que tomarlas

### 1. Auth real para los clientes
Actualmente no hay login implementado en los sistemas de Huayapam ni Tomates. Corren sin autenticación — cualquiera con la URL puede acceder.

El plan es Supabase Auth (email + Google OAuth), pero no está construido.

**Hay que decidir:** ¿cuándo priorizamos esto? ¿primero Firebase Auth como puente o directo a Supabase?

### 2. Migración a Supabase
El ERP usa Firestore. El objetivo es PostgreSQL con Supabase (ver `docs/DESIGN-supabase.md`). La migración es gradual.

**Hay que decidir:** ¿cuándo empieza? ¿qué módulo va primero?

### 3. Publicar el repo público en GitHub
`github.com/milpa-cloud/erp` todavía no existe. El código está listo. Es un paso de posicionamiento — base de la estrategia open source.

**Hay que decidir:** ¿cuándo? ¿qué incluir en el README público?

### 4. Crear los repos de clientes en GitHub
Huayapam y Tomates no tienen repos todavía porque el repo público base no está publicado. Por ahora el código vive en local y en Firebase.

**Hay que decidir:** ¿esperamos al repo público o creamos repos privados vacíos ya?

### 5. Qué módulos tiene cada cliente
No está documentado qué módulos están activos para Huayapam y Tomates.

**Hay que hacer:** mapear esto con cada cliente y documentarlo aquí.

---

## Próximos pasos (por prioridad)

1. **Mapear módulos de Huayapam y Tomates** — reunión con cada cliente
2. **Auth básica** — email+contraseña, aunque sea Firebase Auth primero, para que los sistemas tengan login
3. **Publicar `github.com/milpa-cloud/erp`** — base de la estrategia open source
4. **Primer módulo en Supabase** — el próximo que construyamos va sobre PostgreSQL
5. **CRM / Contactos** — el módulo más pedido que no está construido

---

## Cómo trabajar en este proyecto

**Para el día a día:** `docs/PLAYBOOK.md` — pasos exactos de cada operación estándar (onboarding, activar módulo, personalizar, construir módulo nuevo, aplicar updates).

**Para entender las decisiones:** `docs/ARCHITECTURE.md` — el por qué de cada decisión de diseño.

**Para la landing:** `landing-milpa/DESIGN.md` — design system completo.

### Reglas que no se negocian

- **NUNCA editar el código de un módulo** en el repo de un cliente — las personalizaciones van en `milpa.config.ts` o `cliente/`
- **NUNCA meter código de un cliente** en el repo público
- **SIEMPRE documentar** en `cliente/README.md` cualquier código único del cliente
- **SIEMPRE correr la migración SQL** antes de activar un módulo — la app compila sin error y rompe silenciosamente en runtime si no se corre
- **El sidebar NO se edita a mano** — se construye desde `config.modulos` + `MODULE_REGISTRY`
- **NUNCA construir un módulo nuevo sin su `SKILL.md`** — sin él la IA no sabe cómo trabajar con ese módulo

---

## Lecciones aprendidas (operacionales)

- **Eliminar un proyecto de Firebase** — Google permite restaurarlo dentro de los 30 días desde [console.cloud.google.com/cloud-resource-manager](https://console.cloud.google.com/cloud-resource-manager). Después de 30 días los datos se pierden permanentemente.
- **Cloudflare proxy + Firebase custom domain** — al conectar un dominio nuevo, el proxy de Cloudflare (nube naranja) debe estar **apagado** mientras Firebase emite el certificado SSL. Una vez que Firebase muestra "Connected", se puede reactivar.
- **Zoho Mail EU** — el SMTP correcto es `smtp.zoho.eu` (puerto 587). `smtp.zoho.com` no funciona para cuentas en el datacenter EU.
- **Firebase project deletion** — antes de hacer cualquier cambio destructivo en Firebase Console, confirmar dos veces. La restauración existe pero es un proceso de emergencia, no un flujo normal.

---

*milpa.cloud · equipo.milpa.cloud · hola@milpa.cloud*
