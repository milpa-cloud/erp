# Milpa — Brief del proyecto
*Para la reunión del equipo · Junio 2026*

---

## Qué es Milpa

Milpa es un **estudio de software** que construye herramientas internas para negocios en crecimiento.

No somos una agencia web. No somos una empresa SaaS. Somos el punto intermedio: construimos software que se siente como un producto, funciona exactamente como el cliente lo necesita, y el cliente termina siendo el dueño de todo.

---

## El problema que resolvemos

Un negocio de 10 a 50 empleados en crecimiento hoy vive así:

- **Comunicación**: WhatsApp
- **Inventario**: una hoja de Excel que nadie entiende
- **Pedidos**: papel o un grupo de Telegram
- **Documentos internos**: carpetas de Google Drive sin orden
- **Tareas del equipo**: listas en papel o de cabeza

Saben que necesitan algo mejor. Pero tienen dos opciones malas:

1. **Herramientas genéricas** (Notion, Trello, Monday) → no encajan en cómo trabajan, el equipo no las adopta, los datos quedan dispersos en tres plataformas distintas.
2. **Software a medida tradicional** → $15,000 - $50,000 USD de una agencia, meses de desarrollo, y el día que terminan ya cambió lo que necesitaban.

Milpa es la tercera opción que no existía.

---

## Cómo lo resolvemos

Tenemos una **biblioteca de módulos**: pedazos de software ya construidos que cubren las necesidades más comunes de un negocio:

| Módulo | Qué hace |
|--------|----------|
| **Proyectos** | Gestión de proyectos estilo Basecamp — tareas, hitos, equipo |
| **Tareas / Kanban** | Tablero de trabajo del equipo |
| **Wiki** | Base de conocimiento interna |
| **Calendario** | Agenda compartida del equipo |
| **CRM** | Contactos, clientes, proveedores con historial |
| **Password Manager** | Credenciales compartidas del equipo, encriptadas |

Para cada cliente, seleccionamos los módulos que necesita, los configuramos a su flujo de trabajo, los diseñamos con su identidad visual, y los desplegamos como **su propio sistema**.

El cliente recibe:
- Una URL propia (`herramientas.sunegocio.com`)
- Su logo, sus colores, su idioma
- Solo los módulos que usa — sin funciones que no entiende
- **El código fuente completo** — es suyo, para siempre
- **Sus datos completos** — puede exportarlos en cualquier momento

Si mañana dejan de trabajar con Milpa, se llevan todo. Cero lock-in.

---

## Por qué Milpa, no una agencia normal

Tres cosas juntas que nadie más ofrece a este precio:

**1. Software que encaja, no software que "sirve"**
No es una plantilla de Notion con otro color. Es un sistema construido con su forma de trabajar, sus nombres para las cosas, su proceso.

**2. El cliente es dueño de todo**
El código es open source (MIT). El cliente tiene acceso a su propia base de datos. Si quieren cambiar de proveedor, llevan sus datos en un archivo y se van. No hay costo de salida.

**3. Nosotros manejamos toda la complejidad técnica**
El carpintero no sabe qué es Firestore ni Next.js y no tiene que saberlo. Nosotros lo instalamos, lo configuramos, lo mantenemos. Ellos solo lo usan.

---

## Dónde estamos hoy

### Clientes en portfolio
| Cliente | Ubicación | Módulos | Estado |
|---------|-----------|---------|--------|
| Carpintería Huayapam | Oaxaca, México | TBD | En exploración |
| Tomates La Era | México | TBD | En exploración |
| Sprachenmehr e.V. | Viena, Austria | Newsletter, Web | En desarrollo |

### Lo que ya está construido
- **ERP interno de Milpa** — el sistema que usamos nosotros para gestionar el equipo: tareas, calendario, wiki, proyectos
- **Módulos funcionales**: Tareas/Kanban, Calendario, Wiki, Proyectos
- **Landing page** de milpa.cloud
- **Infraestructura base**: Next.js, Firebase, dominios configurados

### Lo que falta para el primer cliente de pago
- [ ] Módulo de Proyectos estilo Basecamp (en desarrollo)
- [ ] Auth real (login con email / Google)
- [ ] Sistema de setup por cliente (el script que genera un cliente nuevo)
- [ ] Export de datos (el botón "descargar todo")

---

## El modelo de negocio

### Ingresos

**Setup fee** — cobro único al comenzar con un cliente nuevo:
> $500 – $1,000 USD por cliente

Cubre: instalación, configuración, diseño con la identidad del cliente, migración de datos existentes, capacitación inicial.

**Suscripción mensual** — recurrente mientras el cliente use el sistema:
> $30 – $80 USD / mes

Cubre: hosting, actualizaciones de seguridad, soporte técnico, acceso a nuevos módulos cuando salgan.

**Horas de personalización** — cuando el cliente pide cambios fuera del scope estándar:
> $40 – $80 USD / hora

### Proyecciones

| Mes | Clientes activos | MRR | Ingresos setup | Total del mes |
|-----|-----------------|-----|----------------|---------------|
| 3 | 2 | ~$100 | $1,000 | ~$1,100 |
| 6 | 5 | ~$300 | $1,000 | ~$1,300 |
| 9 | 8 | ~$480 | $1,000 | ~$1,480 |
| 12 | 12 | ~$720 | $1,000 | ~$1,720 |

*Asumiendo 1 cliente nuevo por mes y precio promedio de $60/mes.*

**La honestidad del número**: a precio bajo y volumen moderado, en 12 meses llegamos a ~$1,700/mes de ingreso. Split en 3 personas, eso es ~$560/persona/mes — complementario, no suficiente para vivir de esto solo.

**Cómo crece**:
- Cada cliente nuevo sube el MRR de forma permanente
- A 30 clientes: ~$1,800/mes MRR estable + setup fees
- El modelo escala cuando el costo de agregar un cliente nuevo es bajo (porque los módulos ya están)

**El camino alternativo** — subir precio:
Negocios de 10-50 empleados gastan $100-300/mes en herramientas SaaS que no les encajan. Un sistema a medida vale más. Precio real de mercado: $100-200/mes. Si llegamos a 12 clientes a $150/mes: $1,800/mes MRR.

---

## Cómo nos dividimos el trabajo

Tres roles que se complementan:

### Tech Lead
- Desarrollo de módulos nuevos
- Setup e infraestructura por cliente
- Mantenimiento del sistema
- Arquitectura del producto

### Diseño / UX
- Diseño de UI de cada módulo
- Branding por cliente (colores, logo, tipografía)
- Experiencia de usuario del sistema
- Material visual de ventas (landing, demos)

### Ventas / Ops / Project Management
- Conseguir clientes nuevos
- Onboarding y comunicación con clientes
- Gestión de proyectos activos
- Soporte y relación a largo plazo

---

## El stack técnico (para los técnicos de la reunión)

```
Frontend:    Next.js (App Router) + TypeScript + Tailwind CSS v4
Fuente:      Geist Sans / DM Sans
Backend:     Supabase (PostgreSQL) → migrando de Firebase
Auth:        Supabase Auth (email+contraseña + Google OAuth)
Deploy:      Firebase Hosting → Vercel
Dominio:     milpa.cloud (landing) + equipo.milpa.cloud (ERP)
Licencia:    MIT (open source)
Repositorio: github.com/milpa-cloud/erp (próximamente)
```

**Por qué open source + negocio de servicio funciona:**
El código es gratis. La implementación, configuración, personalización y soporte no lo son. Es el modelo de RedHat, Cal.com, Ghost, Supabase. El 95% de los clientes no pueden ni quieren hacer la instalación solos.

---

## La visión

Un negocio chico o mediano en LATAM (o en cualquier parte) debería poder acceder al mismo nivel de herramientas internas que tiene una empresa grande — sin pagar lo que paga una empresa grande.

Hoy, el carpintero de Oaxaca tiene que elegir entre Excel y gastar $30,000 en un sistema. Milpa es la tercera opción: software real, a su medida, a un precio que tiene sentido para él.

Y cuando tenga las herramientas correctas, puede crecer.

---

## Próximos pasos concretos

1. **Definir roles del equipo** — quién asume qué área
2. **Primer cliente de pago** — convertir uno de los prospectos actuales
3. **Módulo de Proyectos** — completar el módulo más pedido
4. **Migración a Supabase** — base técnica sólida para escalar
5. **Repositorio público en GitHub** — base de la estrategia open source
6. **Reescribir la landing page** — con este brief como base

---

*milpa.cloud · equipo.milpa.cloud · hola@milpa.cloud*
