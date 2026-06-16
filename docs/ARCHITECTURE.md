# Milpa — Arquitectura del sistema

Este documento explica las decisiones de diseño del sistema. No es una descripción de lo que hay — es una explicación del **por qué**, para que quien llegue después (persona o IA) entienda las razones y no las revierta sin entenderlas.

---

## El modelo de negocio dicta la arquitectura

Milpa construye software personalizado para clientes no técnicos. Esto tiene tres consecuencias directas:

1. **El cliente no toca el código.** Nosotros hacemos todos los cambios.
2. **Cada cliente tiene su propia instancia.** No es un SaaS multi-tenant — cada cliente tiene su propio repo, su propia base de datos, su propio deploy.
3. **El cliente es dueño de su código y sus datos.** Si deja de trabajar con nosotros, se lleva todo. Esto es un diferenciador de negocio, no solo una decisión técnica.

---

## Por qué un repo público + forks privados

El repo público (`github.com/milpa-cloud/erp`, licencia MIT) contiene los módulos base. Cualquiera puede descargarlo.

Por qué esto funciona como modelo de negocio: el código es gratis. La implementación, configuración, personalización y soporte no lo son. El 95% de los clientes no pueden ni quieren hacer la instalación solos. (Ver: RedHat, Cal.com, Ghost, Supabase.)

Cada cliente nuevo recibe un **fork privado** del repo público. Ese fork:
- Contiene el código base de los módulos (idéntico al público al momento del fork)
- Contiene `milpa.config.ts` con todas las personalizaciones del cliente
- Puede contener una carpeta `cliente/` con componentes únicos de ese cliente
- Se puede actualizar jalando cambios del repo público cuando sale una mejora

---

## El principio fundamental: config sobre código

**El código de los módulos no debe cambiar entre clientes. Solo la configuración.**

Si el cliente quiere que "Tareas" se llame "Pedidos", eso va en `milpa.config.ts`:
```typescript
modulos: { tareas: { etiquetas: { titulo: "Pedidos" } } }
```

Si el cliente quiere sus colores de marca, eso va en `milpa.config.ts`:
```typescript
cliente: { colores: { primario: "#8B4513" } }
```

Si el cliente quiere activar solo tres módulos de los ocho disponibles, eso va en `milpa.config.ts`:
```typescript
modulos: ["tareas", "proyectos", "wiki"]
```

**Por qué esto importa:** cuando el repo público actualiza un módulo (bug fix, nueva función), el cliente puede aplicar esa actualización con un `git merge upstream/main`. Si el cliente nunca tocó el código del módulo — solo `milpa.config.ts` — el merge es limpio y sin conflictos.

Si en cambio alguien editó el módulo directamente en el repo del cliente, ese merge va a tener conflictos cada vez. Con el tiempo, el cliente queda desconectado de las mejoras del repo público.

---

## Cuándo sí se puede editar el código en el repo del cliente

Solo en una situación: cuando el cliente necesita algo tan específico y único que no tiene sentido en ningún otro cliente, y que no cabe en la configuración.

En ese caso, el código va en la carpeta `cliente/`, que **nunca existe en el repo público**:

```
cliente/
  tareas/
    CampoEspecial.tsx     ← componente que solo este cliente usa
  README.md               ← qué se personalizó, por qué, cuándo
```

Esto mantiene el módulo base intacto y los cambios únicos aislados. El `cliente/README.md` es obligatorio — documenta qué se cambió y la razón, para que quien lo lea después entienda.

---

## Estructura de un módulo

Cada módulo es una carpeta autocontenida bajo `src/modules/`:

```
src/modules/tareas/
  components/       — componentes de UI del módulo
  queries.ts        — todas las queries a la base de datos de este módulo
  types.ts          — interfaces TypeScript de este módulo
  index.ts          — exports del módulo
  SKILL.md          — guía para la IA sobre este módulo
```

La página de Next.js (`src/app/tareas/page.tsx`) es solo un shell que importa del módulo. La lógica vive en el módulo, no en la página.

---

## Base de datos

Cada módulo tiene su propia migración SQL:

```
supabase/migrations/
  001_core_schema.sql     — contacts, auth, module_permissions (compartido)
  002_tareas.sql          — tabla tareas
  003_proyectos.sql       — tablas proyectos, puntos_proyecto, modulos_proyecto
  004_wiki.sql            — tabla wiki
  ...
```

Los módulos se comunican a través de la base de datos (foreign keys a tablas compartidas como `contacts`). No hay llamadas directas de un módulo a otro en código.

---

## Qué NO debe pasar nunca

- **No editar el código de un módulo en el repo de un cliente** para personalizarlo. Usar `milpa.config.ts` o `cliente/`.
- **No meter código específico de un cliente en el repo público.** El repo público es genérico.
- **No crear un módulo nuevo sin su `SKILL.md`.** La IA no sabrá cómo trabajar con él.
- **No activar un módulo para un cliente sin correr su migración SQL.** La app rompe silenciosamente.
- **No hacer cambios en `cliente/` sin documentarlos en `cliente/README.md`.** Se convierte en deuda técnica invisible.

---

## Estado actual vs arquitectura objetivo

El sistema actual (milpa-erp) usa Firebase Firestore. La arquitectura objetivo es Supabase (PostgreSQL). La migración es gradual: los módulos nuevos se construyen con Supabase, los existentes se migran cuando haya oportunidad.

El archivo `docs/DESIGN-supabase.md` tiene el esquema de la base de datos objetivo.

---

## Documentos relacionados

- `docs/PLAYBOOK.md` — pasos exactos de cada operación estándar
- `docs/milpa-brief.md` — contexto del negocio y modelo de precios
- `studio-landing/DESIGN.md` — sistema de diseño de la marca
- `milpa-erp/CLAUDE.md` — guía técnica del ERP actual
