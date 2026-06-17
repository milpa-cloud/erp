/**
 * seed-wiki.mjs
 * Puebla la wiki del ERP con contenido HTML rico.
 * Uso: node tools/seed-wiki.mjs   (desde dentro de milpa-erp/)
 */

const PROJECT_ID = "milpa-studio-landing";
const API_KEY    = "AIzaSyAchIbM2QykBHHol_5l_e4rpAj1Tvmyyuk";
const BASE_URL   = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function field(value) {
  if (typeof value === "string")  return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number")  return { integerValue: String(value) };
  return { stringValue: String(value) };
}

async function limpiarWiki() {
  const res  = await fetch(`${BASE_URL}/wiki?key=${API_KEY}`);
  const data = await res.json();
  if (!data.documents) { console.log("  (wiki vacía, nada que limpiar)"); return; }
  for (const doc of data.documents) {
    const id = doc.name.split("/").pop();
    await fetch(`${BASE_URL}/wiki/${id}?key=${API_KEY}`, { method: "DELETE" });
    process.stdout.write("  ✗ " + (doc.fields?.titulo?.stringValue || id) + "\n");
  }
}

async function crearPagina({ titulo, contenido, categoria }) {
  const body = {
    fields: {
      titulo:      field(titulo),
      contenido:   field(contenido),
      categoria:   field(categoria),
      autor:       field("Sistema"),
      actualizadoEn: { timestampValue: new Date().toISOString() },
    },
  };
  const res = await fetch(`${BASE_URL}/wiki?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error creando "${titulo}": ${await res.text()}`);
  console.log(`  ✓  [${categoria}] ${titulo}`);
}

// ─── Páginas ──────────────────────────────────────────────────────────────────

const paginas = [

// ══════════════════════════════════════════════════════
//  VISIÓN
// ══════════════════════════════════════════════════════

{
  titulo: "Índice y Glosario",
  categoria: "Visión",
  contenido:
`<span class="w-label">Plan de negocio y documentación técnica</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.5rem">Esta es la wiki de Milpa</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Aquí vive todo: la visión del negocio, cómo funciona el software, los clientes activos, y las guías de operación. Si eres nuevo en el equipo, empieza por <strong>Qué es Milpa</strong> y luego <strong>Arquitectura del ERP</strong>.</p>

<span class="w-label">Mapa de páginas</span>
<div class="w-grid2" style="margin-bottom:1.5rem">
  <div class="w-card">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Visión</div>
    <div style="font-size:0.875rem;color:#1c1917;line-height:2">→ Qué es Milpa</div>
  </div>
  <div class="w-card">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Negocio</div>
    <div style="font-size:0.875rem;color:#1c1917;line-height:2">→ Modelo de negocio<br>→ Roles del equipo</div>
  </div>
  <div class="w-card">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Técnico</div>
    <div style="font-size:0.875rem;color:#1c1917;line-height:2">→ Arquitectura del ERP<br>→ El stack tecnológico<br>→ Qué es un módulo</div>
  </div>
  <div class="w-card">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Producto · Operaciones</div>
    <div style="font-size:0.875rem;color:#1c1917;line-height:2">→ Módulos disponibles<br>→ Cómo hacer un deploy<br>→ Onboarding de cliente nuevo</div>
  </div>
</div>

<span class="w-label">Glosario de términos clave</span>

<details>
  <summary>Milpa — el estudio</summary>
  <div class="details-body">
    <strong>Milpa</strong> es un estudio de software basado en Oaxaca, México. El nombre viene del sistema agrícola mesoamericano donde maíz, frijol y calabaza crecen juntos — cultivos distintos que se complementan. El logomark (tres barras) representa exactamente eso.<br><br>
    Construimos herramientas de gestión internas para negocios de 10 a 50 personas. No somos agencia web, no revendemos plataformas. El código que entregamos es MIT — el cliente se lo lleva si quiere.
  </div>
</details>

<details>
  <summary>ERP — qué significa y por qué el nuestro es diferente</summary>
  <div class="details-body">
    ERP es <em>Enterprise Resource Planning</em>: un sistema que centraliza las operaciones de un negocio (tareas, proyectos, clientes, inventario, etc.). Los ERPs genéricos como SAP u Odoo son enormes y cubren todo — lo cual los hace complejos, caros, y difíciles de adoptar para un negocio mediano.<br><br>
    El ERP de Milpa es deliberadamente pequeño. Solo tiene los módulos que el negocio realmente usa. Cada cliente tiene su propia instancia, con su código y sus datos.
  </div>
</details>

<details>
  <summary>Módulo — la unidad funcional del sistema</summary>
  <div class="details-body">
    Un módulo es una función completa y autocontenida del ERP: <em>Tareas</em>, <em>Calendario</em>, <em>Wiki</em>, <em>Proyectos</em>. Cada uno vive en <code>src/modules/nombre/</code>, tiene su propia lógica y componentes, y se activa o desactiva por cliente desde <code>milpa.config.ts</code>.<br><br>
    Si un cliente no necesita wiki, simplemente no la tiene activa. El código existe pero no aparece en su interfaz.
  </div>
</details>

<details>
  <summary>Fork — cómo cada cliente tiene su propio código</summary>
  <div class="details-body">
    Un fork es una copia del repositorio base (<code>milpa-cloud/erp</code>) en GitHub. Cada cliente tiene su fork privado con su <code>milpa.config.ts</code> personalizado y, si necesita algo único, su carpeta <code>cliente/</code>.<br><br>
    Cuando Milpa lanza mejoras al repo base, el cliente puede recibirlas con un <code>git merge</code>. O no. El código es suyo.
  </div>
</details>

<details>
  <summary>milpa.config.ts — el único archivo que diferencia clientes</summary>
  <div class="details-body">
    Define nombre del negocio, colores, logo, y qué módulos están activos. Es el único lugar donde se personaliza la instancia de un cliente.<br><br>
    <strong>Regla crítica:</strong> Nunca se editan los módulos para personalizar. Todo va en <code>milpa.config.ts</code>. Así las actualizaciones del repo base llegan sin conflictos.
  </div>
</details>

<details>
  <summary>Firebase y Supabase — los dos backends</summary>
  <div class="details-body">
    <strong>Firebase</strong> es el backend actual: Firestore para base de datos en tiempo real, Firebase Auth para autenticación, Firebase Hosting para el sitio.<br><br>
    <strong>Supabase</strong> es a donde migramos. Es PostgreSQL gestionado con autenticación incluida, Row Level Security (permisos por fila), y Edge Functions. PostgreSQL permite relaciones reales y consultas más potentes.
  </div>
</details>

<details>
  <summary>SKILL.md — instrucciones para Claude</summary>
  <div class="details-body">
    Cada módulo incluye un <code>SKILL.md</code>: un documento que le explica a Claude (la IA que usamos) cómo está construido el módulo, qué patrones sigue, y qué no debe hacer.<br><br>
    Sin <code>SKILL.md</code>, Claude no tiene contexto y puede introducir bugs o romper convenciones. Es un requisito antes de construir cualquier módulo nuevo.
  </div>
</details>`
},

{
  titulo: "Qué es Milpa",
  categoria: "Visión",
  contenido:
`<span class="w-label">Visión</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Construimos el software que las empresas medianas merecen</h2>
<p style="color:#78716c;margin-bottom:1.5rem">La mayoría del software de gestión está diseñado para empresas grandes. Para una carpintería de 15 personas o una asociación sin fines de lucro en Austria, esas herramientas son demasiado complejas, caras, o simplemente no encajan.</p>

<div class="w-grid3" style="margin-bottom:1.5rem">
  <div class="w-card" style="border-top:3px solid #059669">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Lo que somos</div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65">Un estudio que construye herramientas internas a medida para negocios de 10 a 50 personas.</div>
  </div>
  <div class="w-card" style="border-top:3px solid #059669">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Lo que entregamos</div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65">Su propio sistema: código MIT (tuyo), datos en tu infraestructura, sin suscripción por usuario.</div>
  </div>
  <div class="w-card" style="border-top:3px solid #059669">
    <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#059669;margin-bottom:0.5rem">Lo que NO somos</div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65">No somos agencia web, no revendemos Salesforce, no cobramos por asiento.</div>
  </div>
</div>

<span class="w-label">En números</span>
<div class="w-card" style="margin-bottom:1.5rem;background:#f5f5f4;border:none">
  <div style="display:flex;gap:2.5rem;flex-wrap:wrap;justify-content:center">
    <div style="text-align:center">
      <div style="font-size:2.25rem;font-weight:700;color:#1c1917;line-height:1">3</div>
      <div style="font-size:0.75rem;color:#78716c;margin-top:0.25rem">Clientes activos</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:2.25rem;font-weight:700;color:#1c1917;line-height:1">4</div>
      <div style="font-size:0.75rem;color:#78716c;margin-top:0.25rem">Módulos disponibles</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:2.25rem;font-weight:700;color:#1c1917;line-height:1">MIT</div>
      <div style="font-size:0.75rem;color:#78716c;margin-top:0.25rem">Licencia del código</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:2.25rem;font-weight:700;color:#1c1917;line-height:1">$0</div>
      <div style="font-size:0.75rem;color:#78716c;margin-top:0.25rem">Costo por usuario adicional</div>
    </div>
  </div>
</div>

<span class="w-label">Personalidad de la marca</span>
<div class="w-grid2">
  <div class="w-card">
    <div style="font-weight:600;color:#1c1917;margin-bottom:0.25rem">Directa</div>
    <div style="font-size:0.875rem;color:#78716c">Sin relleno, sin buzzwords. Dice exactamente lo que hace en las menos palabras posibles.</div>
  </div>
  <div class="w-card">
    <div style="font-weight:600;color:#1c1917;margin-bottom:0.25rem">Humana</div>
    <div style="font-size:0.875rem;color:#78716c">Cálida pero no casual. Como personas que resuelven problemas, no como corporaciones.</div>
  </div>
  <div class="w-card">
    <div style="font-weight:600;color:#1c1917;margin-bottom:0.25rem">Disruptiva</div>
    <div style="font-size:0.875rem;color:#78716c">Cuestiona por qué las empresas pagan por software genérico inflado que no les queda.</div>
  </div>
  <div class="w-card">
    <div style="font-weight:600;color:#1c1917;margin-bottom:0.25rem">Segura</div>
    <div style="font-size:0.875rem;color:#78716c">No usa términos vagos. Si lo construimos, funciona. Si algo falla, lo arreglamos.</div>
  </div>
</div>`
},

// ══════════════════════════════════════════════════════
//  NEGOCIO
// ══════════════════════════════════════════════════════

{
  titulo: "Modelo de negocio",
  categoria: "Negocio",
  contenido:
`<span class="w-label">Negocio</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Tres fuentes de ingreso, un cliente a la vez</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Setup fee inicial, cuota mensual de soporte, y horas adicionales cuando el cliente pide algo nuevo. Sin cobros por usuario, sin lock-in, sin sorpresas.</p>

<span class="w-label">Las tres fuentes de ingreso</span>
<div class="w-grid3" style="margin-bottom:1.5rem">
  <div class="w-card" style="text-align:center">
    <svg width="56" height="44" viewBox="0 0 56 44" style="margin:0 auto 0.875rem;display:block">
      <rect x="4"  y="4"  width="14" height="36" rx="4" fill="#059669"/>
      <rect x="22" y="16" width="14" height="24" rx="4" fill="#a7f3d0"/>
      <rect x="40" y="28" width="14" height="12" rx="4" fill="#d1fae5"/>
    </svg>
    <div style="font-size:1.5rem;font-weight:700;color:#1c1917">$500–1,000</div>
    <div style="font-size:0.85rem;font-weight:600;color:#1c1917;margin:0.3rem 0">Setup fee</div>
    <div style="font-size:0.8rem;color:#78716c">Único, al inicio. Cubre onboarding, configuración inicial y primer deploy en producción.</div>
  </div>
  <div class="w-card" style="text-align:center">
    <svg width="56" height="44" viewBox="0 0 56 44" style="margin:0 auto 0.875rem;display:block">
      <rect x="4"  y="24" width="14" height="16" rx="4" fill="#059669"/>
      <rect x="22" y="20" width="14" height="20" rx="4" fill="#059669"/>
      <rect x="40" y="16" width="14" height="24" rx="4" fill="#059669"/>
    </svg>
    <div style="font-size:1.5rem;font-weight:700;color:#1c1917">$30–80 /mes</div>
    <div style="font-size:0.85rem;font-weight:600;color:#1c1917;margin:0.3rem 0">Soporte mensual</div>
    <div style="font-size:0.8rem;color:#78716c">Hosting, mantenimiento, actualizaciones de seguridad, respuesta a bugs.</div>
  </div>
  <div class="w-card" style="text-align:center">
    <svg width="56" height="44" viewBox="0 0 56 44" style="margin:0 auto 0.875rem;display:block">
      <rect x="4"  y="12" width="14" height="28" rx="4" fill="#059669"/>
      <rect x="22" y="4"  width="14" height="36" rx="4" fill="#a7f3d0"/>
      <rect x="40" y="20" width="14" height="20" rx="4" fill="#d1fae5"/>
    </svg>
    <div style="font-size:1.5rem;font-weight:700;color:#1c1917">$40–80 /hr</div>
    <div style="font-size:0.85rem;font-weight:600;color:#1c1917;margin:0.3rem 0">Personalización</div>
    <div style="font-size:0.8rem;color:#78716c">Módulos nuevos, integraciones, reportes personalizados, horas de desarrollo.</div>
  </div>
</div>

<span class="w-label">Por qué funciona este modelo</span>
<div class="w-card" style="margin-bottom:1.25rem">
  <div style="display:flex;flex-direction:column;gap:0.875rem">
    <div style="display:grid;grid-template-columns:8px 1fr;gap:0.875rem;align-items:start">
      <div style="width:8px;height:8px;background:#059669;border-radius:100px;margin-top:5px"></div>
      <div style="font-size:0.875rem;color:#44403c"><strong>El costo no escala con el equipo.</strong> Si el cliente crece de 10 a 30 personas, su cuota mensual no cambia. Eso es un diferenciador enorme vs. SaaS que cobra por usuario.</div>
    </div>
    <div style="display:grid;grid-template-columns:8px 1fr;gap:0.875rem;align-items:start">
      <div style="width:8px;height:8px;background:#059669;border-radius:100px;margin-top:5px"></div>
      <div style="font-size:0.875rem;color:#44403c"><strong>El cliente es dueño del código.</strong> En cualquier momento puede llevarse el código y los datos. Sin lock-in. Esto genera confianza y facilita cerrar el trato inicial.</div>
    </div>
    <div style="display:grid;grid-template-columns:8px 1fr;gap:0.875rem;align-items:start">
      <div style="width:8px;height:8px;background:#059669;border-radius:100px;margin-top:5px"></div>
      <div style="font-size:0.875rem;color:#44403c"><strong>El soporte mensual es predecible.</strong> Con 10 clientes a $50/mes son $500/mes de base sin hacer nada nuevo. Escala sin complejidad.</div>
    </div>
    <div style="display:grid;grid-template-columns:8px 1fr;gap:0.875rem;align-items:start">
      <div style="width:8px;height:8px;background:#059669;border-radius:100px;margin-top:5px"></div>
      <div style="font-size:0.875rem;color:#44403c"><strong>Las horas adicionales son el crecimiento.</strong> Cada módulo nuevo que pide un cliente es ingreso inmediato, y la mejora queda disponible para todos los demás.</div>
    </div>
  </div>
</div>

<span class="w-label">Ciclo de vida de un cliente</span>
<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem">
  <div class="w-card" style="flex:1;min-width:100px;text-align:center;padding:0.875rem">
    <div style="font-size:1.1rem;margin-bottom:0.25rem">🌱</div>
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">Descubrimiento</div>
    <div style="font-size:0.7rem;color:#78716c;margin-top:0.2rem">Demo y propuesta</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:100px;text-align:center;padding:0.875rem">
    <div style="font-size:1.1rem;margin-bottom:0.25rem">⚙️</div>
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">Setup</div>
    <div style="font-size:0.7rem;color:#78716c;margin-top:0.2rem">Fork, config, deploy</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:100px;text-align:center;padding:0.875rem">
    <div style="font-size:1.1rem;margin-bottom:0.25rem">🚀</div>
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">Producción</div>
    <div style="font-size:0.7rem;color:#78716c;margin-top:0.2rem">Soporte mensual</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:100px;text-align:center;padding:0.875rem">
    <div style="font-size:1.1rem;margin-bottom:0.25rem">📈</div>
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">Expansión</div>
    <div style="font-size:0.7rem;color:#78716c;margin-top:0.2rem">Módulos nuevos</div>
  </div>
</div>`
},

{
  titulo: "Roles del equipo",
  categoria: "Negocio",
  contenido:
`<span class="w-label">Equipo</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Quién hace qué en Milpa</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Milpa opera como equipo pequeño y ágil. Claude actúa como co-desarrollador leyendo los SKILL.md de cada módulo — no toma decisiones de producto, ejecuta las instrucciones del equipo.</p>

<div class="w-grid2" style="margin-bottom:1.5rem">
  <div class="w-card">
    <span class="w-badge w-green" style="margin-bottom:0.75rem;display:inline-block">Fundador / Tech Lead</span>
    <div style="font-weight:600;color:#1c1917;margin-bottom:0.35rem">Pablo Spada</div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65">Arquitectura, desarrollo de módulos, relación con clientes, deployments. Punto de contacto en todos los proyectos.</div>
  </div>
  <div class="w-card">
    <span class="w-badge w-blue" style="margin-bottom:0.75rem;display:inline-block">Co-desarrollador IA</span>
    <div style="font-weight:600;color:#1c1917;margin-bottom:0.35rem">Claude (Anthropic)</div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65">Lee los SKILL.md de cada módulo, escribe código siguiendo los patrones del proyecto, arregla bugs, genera contenido. No reemplaza la decisión humana.</div>
  </div>
</div>

<span class="w-label">Cómo trabajamos con IA</span>
<div class="w-card" style="background:#f5f5f4;border:none;margin-bottom:1rem">
  <div style="font-size:0.875rem;color:#44403c;line-height:1.75">
    <strong>El flujo de trabajo típico:</strong><br><br>
    <span style="display:flex;gap:0.75rem;margin-bottom:0.5rem"><span style="background:#1c1917;color:#fafaf9;border-radius:100px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">1</span> Pablo describe qué necesita en lenguaje natural</span>
    <span style="display:flex;gap:0.75rem;margin-bottom:0.5rem"><span style="background:#1c1917;color:#fafaf9;border-radius:100px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">2</span> Claude lee el contexto del módulo vía SKILL.md y CLAUDE.md</span>
    <span style="display:flex;gap:0.75rem;margin-bottom:0.5rem"><span style="background:#1c1917;color:#fafaf9;border-radius:100px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">3</span> Claude escribe el código siguiendo los patrones del proyecto</span>
    <span style="display:flex;gap:0.75rem;margin-bottom:0.5rem"><span style="background:#1c1917;color:#fafaf9;border-radius:100px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">4</span> Pablo revisa, ajusta y hace commit</span>
    <span style="display:flex;gap:0.75rem"><span style="background:#1c1917;color:#fafaf9;border-radius:100px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">5</span> Si hay un patrón nuevo aprendido, se actualiza el SKILL.md</span>
  </div>
</div>

<div class="w-card" style="background:#ecfdf5;border-color:#a7f3d0">
  <div style="font-size:0.875rem;color:#065f46;line-height:1.65">
    <strong>Por qué funciona:</strong> La IA es rápida en la implementación pero necesita contexto preciso. Los archivos SKILL.md, CLAUDE.md y esta wiki son ese contexto. Sin ellos, Claude toma decisiones arbitrarias que pueden romper convenciones del proyecto.
  </div>
</div>`
},

// ══════════════════════════════════════════════════════
//  CLIENTES
// ══════════════════════════════════════════════════════

{
  titulo: "Clientes activos",
  categoria: "Clientes",
  contenido:
`<span class="w-label">Clientes</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">3 clientes, 3 contextos distintos</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Cada cliente tiene su propio fork privado del ERP, su propia base de datos, y su propio dominio. Milpa solo tiene acceso durante el soporte activo.</p>

<div style="display:flex;flex-direction:column;gap:1rem">

  <div class="w-card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:0.75rem">
      <div>
        <div style="font-weight:700;font-size:1rem;color:#1c1917">Carpintería Huayapam</div>
        <div style="font-size:0.8rem;color:#78716c;margin-top:0.1rem">Oaxaca, México · primer cliente</div>
      </div>
      <span class="w-badge w-green">En producción</span>
    </div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65;margin-bottom:0.875rem">Carpintería artesanal. Usan el ERP para gestionar pedidos, coordinar el taller, y dar seguimiento a proyectos de clientes.</div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <span class="w-badge w-stone">Tareas</span>
      <span class="w-badge w-stone">Proyectos</span>
      <span class="w-badge w-stone">Calendario</span>
    </div>
  </div>

  <div class="w-card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:0.75rem">
      <div>
        <div style="font-weight:700;font-size:1rem;color:#1c1917">Tomates La Era</div>
        <div style="font-size:0.8rem;color:#78716c;margin-top:0.1rem">México</div>
      </div>
      <span class="w-badge w-green">En producción</span>
    </div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65;margin-bottom:0.875rem">Productora agrícola. El ERP les ayuda a coordinar el equipo de campo, dar seguimiento a lotes y temporadas, y documentar procesos internos.</div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <span class="w-badge w-stone">Tareas</span>
      <span class="w-badge w-stone">Wiki</span>
      <span class="w-badge w-stone">Calendario</span>
    </div>
  </div>

  <div class="w-card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:0.75rem">
      <div>
        <div style="font-weight:700;font-size:1rem;color:#1c1917">Sprachenmehr e.V.</div>
        <div style="font-size:0.8rem;color:#78716c;margin-top:0.1rem">Austria · proyecto pro bono</div>
      </div>
      <span class="w-badge w-amber">En desarrollo</span>
    </div>
    <div style="font-size:0.875rem;color:#44403c;line-height:1.65;margin-bottom:0.875rem">Asociación de educación lingüística. Proyecto pro bono en el portafolio de Milpa. Necesitan gestión de miembros, voluntarios, y eventos.</div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <span class="w-badge w-stone">Tareas</span>
      <span class="w-badge w-stone">Proyectos</span>
      <span class="w-badge w-amber">CRM (pendiente)</span>
    </div>
  </div>

</div>`
},

// ══════════════════════════════════════════════════════
//  TÉCNICO
// ══════════════════════════════════════════════════════

{
  titulo: "Arquitectura del ERP",
  categoria: "Técnico",
  contenido:
`<span class="w-label">Técnico</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Cómo está organizado el código</h2>
<p style="color:#78716c;margin-bottom:1rem">El ERP es una app Next.js con tres capas claras: las páginas son envolturas vacías, la lógica vive en los módulos, y la configuración del cliente vive en un solo archivo.</p>

<span class="w-label">Estructura de carpetas</span>
<pre class="w-tree">milpa-erp/
├── <span class="g">src/</span>
│   ├── <span class="g">app/</span>                   <span class="m">← Páginas de Next.js (solo shells)</span>
│   │   ├── layout.tsx         <span class="m">← Layout raíz: sidebar + contenido</span>
│   │   ├── page.tsx           <span class="m">← Dashboard / inicio</span>
│   │   ├── tareas/            <span class="m">← Ruta /tareas</span>
│   │   ├── calendario/        <span class="m">← Ruta /calendario</span>
│   │   ├── wiki/              <span class="m">← Ruta /wiki  ← estás aquí</span>
│   │   └── proyectos/         <span class="m">← Ruta /proyectos</span>
│   ├── <span class="g">components/</span>            <span class="m">← Componentes compartidos</span>
│   │   └── Sidebar.tsx        <span class="m">← Nav lateral, construida desde config</span>
│   ├── <span class="g">lib/</span>
│   │   └── firebase.ts        <span class="m">← Toda la lógica de base de datos</span>
│   ├── <span class="g">modules/</span>               <span class="m">← La carne del sistema</span>
│   │   ├── tareas/            <span class="m">← Módulo Kanban</span>
│   │   ├── calendario/        <span class="m">← Módulo de eventos</span>
│   │   ├── wiki/              <span class="m">← Módulo de base de conocimiento</span>
│   │   ├── proyectos/         <span class="m">← Módulo Basecamp-style</span>
│   │   └── registry.ts        <span class="m">← Lista de todos los módulos</span>
│   └── <span class="g">types/</span>
│       └── index.ts           <span class="m">← Interfaces TypeScript globales</span>
├── <span class="g">milpa.config.ts</span>            <span class="m">← TODO lo que diferencia este cliente</span>
├── tools/                     <span class="m">← Scripts (seed, migraciones)</span>
└── skills/                    <span class="m">← Documentación para Claude</span></pre>

<span class="w-label">Principio: páginas como shells</span>
<div class="w-card" style="margin-bottom:1rem">
  <div style="font-size:0.875rem;color:#44403c;line-height:1.65">
    Las páginas en <code>src/app/</code> son deliberadamente vacías — solo importan y renderizan el módulo correspondiente. Toda la lógica real (queries, tipos, componentes) vive en <code>src/modules/</code>.<br><br>
    <strong>¿Por qué?</strong> Para que los módulos sean portables. Si mañana un cliente necesita la wiki en dos rutas, no hay que duplicar lógica — solo montar el módulo dos veces.
  </div>
</div>

<span class="w-label">Flujo de datos</span>
<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem">
  <div class="w-card" style="flex:1;min-width:90px;text-align:center;padding:0.75rem">
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">Base de datos</div>
    <div style="font-size:0.65rem;color:#78716c;margin-top:0.15rem">Firebase / Supabase</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:90px;text-align:center;padding:0.75rem">
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">lib/firebase.ts</div>
    <div style="font-size:0.65rem;color:#78716c;margin-top:0.15rem">Queries y listeners</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:90px;text-align:center;padding:0.75rem">
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">modules/X/queries</div>
    <div style="font-size:0.65rem;color:#78716c;margin-top:0.15rem">Funciones del módulo</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:90px;text-align:center;padding:0.75rem">
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">modules/X/components</div>
    <div style="font-size:0.65rem;color:#78716c;margin-top:0.15rem">UI del módulo</div>
  </div>
  <div style="color:#d6d3d1;font-size:1.25rem;flex-shrink:0">→</div>
  <div class="w-card" style="flex:1;min-width:90px;text-align:center;padding:0.75rem">
    <div style="font-size:0.75rem;font-weight:600;color:#1c1917">app/X/page.tsx</div>
    <div style="font-size:0.65rem;color:#78716c;margin-top:0.15rem">Shell / ruta</div>
  </div>
</div>`
},

{
  titulo: "El stack tecnológico",
  categoria: "Técnico",
  contenido:
`<span class="w-label">Técnico</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Qué usamos y por qué</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Cada decisión de stack tiene una razón concreta. No usamos tecnología por moda — la elegimos porque resuelve un problema específico para este tipo de producto.</p>

<div style="display:flex;flex-direction:column;gap:0.5rem">

<details>
  <summary>Next.js 16 — Framework de frontend</summary>
  <div class="details-body">
    <strong>Por qué:</strong> App Router da una estructura de carpetas clara. Con <code>output: "export"</code> genera un sitio 100% estático que se sirve desde Firebase Hosting sin servidor.<br><br>
    <strong>Restricción clave:</strong> <code>output: "export"</code> significa sin servidor en producción. No se pueden usar API Routes de Next.js ni Server Components con fetch. Toda la lógica de datos corre en el cliente. Esto es intencional: mantiene el hosting barato y simple.
  </div>
</details>

<details>
  <summary>TypeScript — Lenguaje</summary>
  <div class="details-body">
    <strong>Por qué:</strong> Con IA escribiendo partes del código, TypeScript es el guardia de seguridad. Si Claude genera código con el tipo incorrecto, el compilador lo detecta antes de que llegue a producción.<br><br>
    Los tipos de los módulos se definen en <code>modules/X/types.ts</code> — son la fuente de verdad de lo que puede vivir en la base de datos.
  </div>
</details>

<details>
  <summary>Tailwind CSS v4 — Estilos</summary>
  <div class="details-body">
    <strong>Por qué:</strong> Los estilos viven junto al markup, no hay que saltar entre archivos. La v4 tiene configuración más simple vía <code>@theme</code> en CSS.<br><br>
    <strong>Regla de paleta:</strong> Solo la escala <code>stone</code> de Tailwind. Nunca <code>gray</code> ni <code>neutral</code>. El acento es <code>emerald-600</code>.
  </div>
</details>

<details>
  <summary>Firebase Firestore — Base de datos actual</summary>
  <div class="details-body">
    <strong>Por qué está aquí:</strong> Permite listeners en tiempo real (<code>onSnapshot</code>) sin infraestructura propia. Para el MVP fue la opción más rápida.<br><br>
    <strong>Limitaciones:</strong> No soporta relaciones reales entre documentos, las queries son limitadas, y el modelo de precios escala mal con muchas lecturas.<br><br>
    <strong>Patrón actual:</strong> <code>escuchar[Colección](callback)</code> retorna la función de limpieza para <code>useEffect</code>. Nunca se llama a Firestore directamente desde los componentes.
  </div>
</details>

<details>
  <summary>Supabase — Base de datos destino (migración en progreso)</summary>
  <div class="details-body">
    <strong>Por qué migramos:</strong> PostgreSQL permite relaciones reales con foreign keys, consultas con JOIN, índices, y Row Level Security (permisos por fila sin código adicional en el cliente).<br><br>
    <strong>Lo que ganamos:</strong>
    <ul>
      <li>Auth completo (email + Google OAuth) sin código propio</li>
      <li>Permisos por módulo via RLS — la base de datos rechaza accesos no autorizados</li>
      <li>Triggers de PostgreSQL → Edge Functions → Resend (notificaciones por email)</li>
      <li>Tiempo real via Supabase Realtime, similar a Firestore onSnapshot</li>
    </ul>
  </div>
</details>

<details>
  <summary>Firebase Hosting — Dónde vive el sitio</summary>
  <div class="details-body">
    Sirve sitios estáticos gratis o muy barato. El build de Next.js (<code>out/</code>) se sube directamente. Cada cliente tiene su propio Firebase project con su propio dominio.<br><br>
    <code>firebase.json</code> en la raíz del proyecto define qué carpeta se sube y el site de destino.
  </div>
</details>

<details>
  <summary>lucide-react — Iconos</summary>
  <div class="details-body">
    Librería de iconos SVG consistente, ligera, con tipado TypeScript. Todos los iconos del ERP vienen de aquí. No mezclar con otras librerías de iconos.
  </div>
</details>

</div>`
},

{
  titulo: "Qué es un módulo",
  categoria: "Técnico",
  contenido:
`<span class="w-label">Técnico</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">El módulo: la unidad básica del ERP</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Un módulo es una función completa del sistema, autocontenida en su propia carpeta. Todo lo que necesita para funcionar está ahí adentro: tipos, base de datos, componentes de interfaz, y documentación.</p>

<span class="w-label">Anatomía de un módulo</span>
<pre class="w-tree">src/modules/<span class="g">nombre-del-modulo</span>/
├── <span class="g">types.ts</span>         <span class="m">← Interfaces TypeScript + constantes del módulo</span>
├── <span class="g">queries.ts</span>       <span class="m">← Funciones CRUD y listeners de base de datos</span>
├── <span class="g">components/</span>      <span class="m">← Componentes React del módulo</span>
│   ├── ListaItems.tsx
│   ├── FormModal.tsx
│   └── ItemCard.tsx
├── <span class="g">index.ts</span>         <span class="m">← Re-exporta lo que la página necesita</span>
└── <span class="g">SKILL.md</span>         <span class="m">← Instrucciones para Claude</span></pre>

<span class="w-label">Qué hace cada archivo</span>
<div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.5rem">
  <div class="w-card" style="display:grid;grid-template-columns:110px 1fr;gap:1rem;align-items:start;padding:0.875rem 1rem">
    <code style="background:#f5f5f4;padding:3px 7px;border-radius:5px;font-size:0.8rem;display:block;width:fit-content">types.ts</code>
    <div style="font-size:0.875rem;color:#44403c">Define la forma de los datos. Si el módulo guarda tareas, aquí está la interfaz <code>Tarea</code> con todos sus campos y tipos. También define constantes como los estados posibles ("pendiente", "en_progreso", "completada").</div>
  </div>
  <div class="w-card" style="display:grid;grid-template-columns:110px 1fr;gap:1rem;align-items:start;padding:0.875rem 1rem">
    <code style="background:#f5f5f4;padding:3px 7px;border-radius:5px;font-size:0.8rem;display:block;width:fit-content">queries.ts</code>
    <div style="font-size:0.875rem;color:#44403c">Contiene todas las funciones que hablan con la base de datos: crear, leer, actualizar, eliminar, y los listeners de tiempo real. Los componentes <strong>nunca</strong> llaman a Firebase directamente — siempre pasan por aquí.</div>
  </div>
  <div class="w-card" style="display:grid;grid-template-columns:110px 1fr;gap:1rem;align-items:start;padding:0.875rem 1rem">
    <code style="background:#f5f5f4;padding:3px 7px;border-radius:5px;font-size:0.8rem;display:block;width:fit-content">components/</code>
    <div style="font-size:0.875rem;color:#44403c">Los componentes React que forman la interfaz del módulo. Solo viven aquí — no en la carpeta global de components. Así cada módulo es autónomo y portable.</div>
  </div>
  <div class="w-card" style="display:grid;grid-template-columns:110px 1fr;gap:1rem;align-items:start;padding:0.875rem 1rem">
    <code style="background:#f5f5f4;padding:3px 7px;border-radius:5px;font-size:0.8rem;display:block;width:fit-content">index.ts</code>
    <div style="font-size:0.875rem;color:#44403c">El punto de entrada público. Re-exporta solo lo que la página necesita. Evita que las páginas tengan que conocer la estructura interna del módulo.</div>
  </div>
  <div class="w-card" style="display:grid;grid-template-columns:110px 1fr;gap:1rem;align-items:start;padding:0.875rem 1rem">
    <code style="background:#f5f5f4;padding:3px 7px;border-radius:5px;font-size:0.8rem;display:block;width:fit-content">SKILL.md</code>
    <div style="font-size:0.875rem;color:#44403c">Documentación en formato especial para Claude. Explica qué hace el módulo, qué patrones usa, y qué NO debe hacer. Requerido antes de construir cualquier módulo nuevo.</div>
  </div>
</div>

<span class="w-label">Cómo se activa un módulo por cliente</span>
<div class="w-card" style="margin-bottom:1rem">
  <p style="font-size:0.875rem;color:#44403c;margin-bottom:0.75rem;margin-top:0">En <code>milpa.config.ts</code>, el cliente declara qué módulos quiere activos:</p>
  <pre style="background:#1c1917;color:#fafaf9;padding:1rem 1.25rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.8rem;line-height:1.75;margin:0;overflow-x:auto">modulos: [
  "tareas",
  "proyectos",
  "calendario",
  // "wiki"  ← comentado = no aparece en este cliente
]</pre>
  <p style="font-size:0.8rem;color:#78716c;margin-top:0.75rem;margin-bottom:0">El sidebar se construye dinámicamente desde esta lista más el <code>MODULE_REGISTRY</code>. El código del módulo de wiki existe, pero si no está en la lista, el cliente nunca lo ve.</p>
</div>

<div class="w-card" style="background:#ecfdf5;border-color:#a7f3d0">
  <div style="font-size:0.875rem;color:#065f46;line-height:1.65">
    <strong>Regla de oro:</strong> Nunca edites el código de un módulo para personalizar a un cliente. Si necesita algo diferente, se configura en <code>milpa.config.ts</code> o se crea en su carpeta <code>cliente/</code>. Así las actualizaciones del repo base llegan sin conflictos.
  </div>
</div>`
},

// ══════════════════════════════════════════════════════
//  PRODUCTO
// ══════════════════════════════════════════════════════

{
  titulo: "Módulos disponibles",
  categoria: "Producto",
  contenido:
`<span class="w-label">Producto</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Los 4 módulos que existen hoy</h2>
<p style="color:#78716c;margin-bottom:1.5rem">Cada módulo es una función completa probada en producción. Los nuevos se construyen cuando un cliente los necesita — así el producto crece con demanda real.</p>

<div style="display:flex;flex-direction:column;gap:0.875rem;margin-bottom:1.5rem">

  <div class="w-card">
    <div style="display:flex;align-items:flex-start;gap:1rem">
      <div style="width:42px;height:42px;background:#f5f5f4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.35rem">
          <strong style="color:#1c1917">Tareas</strong>
          <span class="w-badge w-green">Disponible</span>
        </div>
        <div style="font-size:0.875rem;color:#44403c;line-height:1.6;margin-bottom:0.5rem">Tablero Kanban con columnas Pendiente / En progreso / Completada. Las tareas pueden pertenecer a un proyecto o ser independientes. Soporta prioridad, fecha de vencimiento y asignación.</div>
        <code style="font-size:0.72rem;color:#78716c">src/modules/tareas/</code>
      </div>
    </div>
  </div>

  <div class="w-card">
    <div style="display:flex;align-items:flex-start;gap:1rem">
      <div style="width:42px;height:42px;background:#f5f5f4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.35rem">
          <strong style="color:#1c1917">Calendario</strong>
          <span class="w-badge w-green">Disponible</span>
        </div>
        <div style="font-size:0.875rem;color:#44403c;line-height:1.6;margin-bottom:0.5rem">Vista mensual de eventos del equipo. Permite crear, editar y eliminar eventos con título, fecha, hora de inicio/fin, y descripción.</div>
        <code style="font-size:0.72rem;color:#78716c">src/modules/calendario/</code>
      </div>
    </div>
  </div>

  <div class="w-card" style="border-color:#059669;border-width:1.5px">
    <div style="display:flex;align-items:flex-start;gap:1rem">
      <div style="width:42px;height:42px;background:#ecfdf5;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.35rem">
          <strong style="color:#1c1917">Wiki</strong>
          <span class="w-badge w-green">Disponible</span>
          <span style="font-size:0.72rem;color:#059669;font-weight:600">← estás aquí</span>
        </div>
        <div style="font-size:0.875rem;color:#44403c;line-height:1.6;margin-bottom:0.5rem">Base de conocimiento interno. Páginas organizadas por categorías, búsqueda full-text, y editor de contenido con vista previa. El contenido puede ser Markdown o HTML rico.</div>
        <code style="font-size:0.72rem;color:#78716c">src/modules/wiki/</code>
      </div>
    </div>
  </div>

  <div class="w-card">
    <div style="display:flex;align-items:flex-start;gap:1rem">
      <div style="width:42px;height:42px;background:#f5f5f4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.35rem">
          <strong style="color:#1c1917">Proyectos</strong>
          <span class="w-badge w-green">Disponible</span>
        </div>
        <div style="font-size:0.875rem;color:#44403c;line-height:1.6;margin-bottom:0.5rem">Gestión de proyectos estilo Basecamp. Cada proyecto agrupa tareas, puntos de checklist, y módulos asignados. Panel con pestañas: Info, Tareas, Puntos, Módulos.</div>
        <code style="font-size:0.72rem;color:#78716c">src/modules/proyectos/</code>
      </div>
    </div>
  </div>

</div>

<span class="w-label">En el roadmap</span>
<div class="w-grid2">
  <div class="w-card" style="opacity:0.55">
    <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.25rem">CRM &amp; Contactos</div>
    <div style="font-size:0.8rem;color:#78716c">Clientes, proveedores, historial de interacciones.</div>
  </div>
  <div class="w-card" style="opacity:0.55">
    <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.25rem">Password Manager</div>
    <div style="font-size:0.8rem;color:#78716c">Contraseñas del equipo con AES-256.</div>
  </div>
  <div class="w-card" style="opacity:0.55">
    <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.25rem">Dashboard</div>
    <div style="font-size:0.8rem;color:#78716c">Widgets configurables con métricas clave.</div>
  </div>
  <div class="w-card" style="opacity:0.55">
    <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.25rem">Notificaciones</div>
    <div style="font-size:0.8rem;color:#78716c">In-app + email via Resend. Triggers de base de datos.</div>
  </div>
</div>`
},

// ══════════════════════════════════════════════════════
//  OPERACIONES
// ══════════════════════════════════════════════════════

{
  titulo: "Cómo hacer un deploy",
  categoria: "Operaciones",
  contenido:
`<span class="w-label">Operaciones</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Subir cambios a producción</h2>
<p style="color:#78716c;margin-bottom:1.5rem">El deploy es manual y tiene dos pasos: construir el sitio estático y subirlo a Firebase Hosting. No hay CI/CD todavía — todo se hace desde la terminal dentro del directorio del cliente.</p>

<span class="w-label">Pasos para deployar</span>
<div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem">

  <div class="w-step">
    <div class="w-step-num">1</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.35rem">Entra al directorio del proyecto</div>
      <pre style="background:#1c1917;color:#fafaf9;padding:0.6rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.8rem;margin:0">cd milpa-erp</pre>
    </div>
  </div>

  <div class="w-step">
    <div class="w-step-num">2</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.35rem">Construye el sitio estático</div>
      <pre style="background:#1c1917;color:#fafaf9;padding:0.6rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.8rem;margin:0 0 0.5rem">npm run build</pre>
      <div style="font-size:0.8rem;color:#78716c">Genera la carpeta <code>out/</code>. Si hay errores de TypeScript, el build falla aquí — corrígelos antes de continuar.</div>
    </div>
  </div>

  <div class="w-step">
    <div class="w-step-num">3</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.35rem">Sube a Firebase Hosting</div>
      <pre style="background:#1c1917;color:#fafaf9;padding:0.6rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.8rem;margin:0 0 0.5rem">firebase deploy --only hosting</pre>
      <div style="font-size:0.8rem;color:#78716c">Sube <code>out/</code> al sitio configurado en <code>firebase.json</code>. Tarda ~30 segundos.</div>
    </div>
  </div>

  <div class="w-step">
    <div class="w-step-num">4</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem;margin-bottom:0.35rem">Verifica en producción</div>
      <div style="font-size:0.8rem;color:#78716c">Abre el URL del cliente. Si el navegador muestra versión cacheada, presiona <code>Cmd+Shift+R</code> (Mac) para forzar recarga.</div>
    </div>
  </div>

</div>

<span class="w-label">Comandos adicionales</span>
<div class="w-grid2" style="margin-bottom:1rem">
  <div class="w-card">
    <div style="font-weight:600;color:#1c1917;font-size:0.8rem;margin-bottom:0.5rem">Solo reglas de Firestore</div>
    <pre style="background:#1c1917;color:#fafaf9;padding:0.6rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.75rem;margin:0">firebase deploy --only firestore:rules</pre>
  </div>
  <div class="w-card">
    <div style="font-weight:600;color:#1c1917;font-size:0.8rem;margin-bottom:0.5rem">Deploy completo (hosting + reglas)</div>
    <pre style="background:#1c1917;color:#fafaf9;padding:0.6rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.75rem;margin:0">firebase deploy</pre>
  </div>
</div>

<div class="w-card" style="background:#fffbeb;border-color:#fde68a">
  <div style="font-size:0.875rem;color:#92400e;line-height:1.65"><strong>⚠ Importante:</strong> Cada cliente tiene su propio proyecto Firebase. Antes de deployar, verifica que <code>.firebaserc</code> apunta al proyecto correcto con <code>firebase use --list</code>.</div>
</div>`
},

{
  titulo: "Onboarding de cliente nuevo",
  categoria: "Operaciones",
  contenido:
`<span class="w-label">Operaciones</span>
<h2 style="font-size:1.5rem;font-weight:700;color:#1c1917;margin:0 0 0.75rem">Del contrato firmado al sistema en producción</h2>
<p style="color:#78716c;margin-bottom:1.5rem">El proceso completo de onboarding. De principio a fin suele tomar 2 a 3 días hábiles.</p>

<span class="w-label" style="margin-top:0.5rem">Fase 1 — Infraestructura (día 1)</span>
<div style="display:flex;flex-direction:column;gap:0.625rem;margin-bottom:1.25rem">
  <div class="w-step">
    <div class="w-step-num">1</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Crear proyecto Firebase</div>
      <div style="font-size:0.8rem;color:#78716c;margin-top:0.2rem">console.firebase.google.com → New Project. Nombre: <code>[cliente]-erp</code>. Habilitar Firestore, Authentication y Hosting.</div>
    </div>
  </div>
  <div class="w-step">
    <div class="w-step-num">2</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Hacer fork del repo público</div>
      <pre style="background:#1c1917;color:#fafaf9;padding:0.5rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.75rem;margin:0.35rem 0 0.2rem">gh repo fork milpa-cloud/erp --org milpa-cloud --fork-name [cliente]-erp</pre>
      <div style="font-size:0.8rem;color:#78716c">Crear privado. El cliente recibe acceso de lectura a su repo.</div>
    </div>
  </div>
  <div class="w-step">
    <div class="w-step-num">3</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Configurar variables de entorno</div>
      <div style="font-size:0.8rem;color:#78716c;margin-top:0.2rem">Copiar <code>.env.local.example</code> → <code>.env.local</code> y llenar con las credenciales del nuevo Firebase project.</div>
    </div>
  </div>
</div>

<span class="w-label">Fase 2 — Personalización (día 1–2)</span>
<div style="display:flex;flex-direction:column;gap:0.625rem;margin-bottom:1.25rem">
  <div class="w-step">
    <div class="w-step-num">4</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Editar milpa.config.ts</div>
      <div style="font-size:0.8rem;color:#78716c;margin-top:0.2rem">Nombre del negocio, colores, logo, y lista de módulos activos. Este es el único archivo que se personaliza por cliente.</div>
    </div>
  </div>
  <div class="w-step">
    <div class="w-step-num">5</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Correr las migraciones SQL (si usa Supabase)</div>
      <div style="font-size:0.8rem;color:#78716c;margin-top:0.2rem">Cada módulo activo tiene su SQL de creación de tablas. Sin esto, la app puede compilar pero falla en runtime sin que sea obvio.</div>
    </div>
  </div>
</div>

<span class="w-label">Fase 3 — Entrega (día 2–3)</span>
<div style="display:flex;flex-direction:column;gap:0.625rem;margin-bottom:1.25rem">
  <div class="w-step">
    <div class="w-step-num">6</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Primer deploy</div>
      <pre style="background:#1c1917;color:#fafaf9;padding:0.5rem 0.875rem;border-radius:8px;font-family:ui-monospace,monospace;font-size:0.75rem;margin:0.35rem 0 0">npm run build && firebase deploy --only hosting</pre>
    </div>
  </div>
  <div class="w-step">
    <div class="w-step-num">7</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Sesión de capacitación</div>
      <div style="font-size:0.8rem;color:#78716c;margin-top:0.2rem">Videollamada de 30–60 min. Mostrar cómo usar cada módulo activado, cómo crear usuarios, y a quién contactar para soporte.</div>
    </div>
  </div>
  <div class="w-step">
    <div class="w-step-num">8</div>
    <div class="w-step-body">
      <div style="font-weight:600;color:#1c1917;font-size:0.875rem">Documentar en la wiki interna</div>
      <div style="font-size:0.8rem;color:#78716c;margin-top:0.2rem">Crear una página en la categoría Clientes con el contexto del cliente: módulos activos, personalizaciones, fecha de inicio, y persona de contacto.</div>
    </div>
  </div>
</div>

<div class="w-card" style="background:#ecfdf5;border-color:#a7f3d0">
  <div style="font-size:0.875rem;color:#065f46;line-height:1.65">
    <strong>Regla:</strong> Si el cliente necesita algo único que no cabe en <code>milpa.config.ts</code>, se crea una carpeta <code>cliente/</code> en su fork con un <code>README.md</code> que documenta qué es, por qué existe, y quién lo pidió. Nunca se editan los módulos.
  </div>
</div>`
},

];

// ─── Runner ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Limpiando wiki anterior…");
  await limpiarWiki();
  console.log(`\nCreando ${paginas.length} páginas…\n`);
  for (const p of paginas) {
    await crearPagina(p);
  }
  console.log(`\n✅  Wiki lista — ${paginas.length} páginas en 7 categorías.`);
}

main().catch(console.error);
