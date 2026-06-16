---
name: milpa-brand
description: Milpa's brand design system — palette, typography, components, and tone. Apply when building any Milpa-branded surface (landing, ERP, client sites). Full reference in studio-landing/DESIGN.md.
---

# Milpa Brand & Design System

## Personalidad de la marca

- **Directa** — sin relleno, sin buzzwords. Dice exactamente lo que hace en las menos palabras posibles.
- **Humana** — cálida pero no casual. Como personas, no como corporaciones.
- **Disruptiva** — cuestiona por qué las empresas pagan por software genérico inflado.
- **Segura** — no se cubre con términos vagos. Si lo construimos, funciona.

Milpa NO es: una agencia de páginas web, una consultora que revende otra plataforma, un freelancer solo, ni premium por el gusto de serlo.

## Paleta de colores

```
Canvas soft (fondo principal):  #fafaf9  — off-white cálido, NUNCA blanco puro
Canvas white (interiors):       #ffffff  — interior de cards, modales
Canvas warm (alt sections):     #f5f5f4  — bandas alternadas, filas muted
Canvas night (secciones dark):  #1c1917  — stone-900, el mismo que el texto principal
Canvas night soft:              #292524  — cards dentro de secciones dark

Ink (texto principal):          #1c1917  — near-black cálido, NUNCA negro puro
Ink mute (texto secundario):    #78716c
Ink mute 2 (meta / captions):  #a8a29e
On dark (texto en dark bg):     #fafaf9

Emerald (único acento):         #059669  — CTAs, labels de sección, estados activos
Emerald deep (hover):           #047857
Emerald light (tint bg):        #ecfdf5

Warm orange (acento editorial): #E8893A  — máximo UNA vez por viewport, NUNCA en botones

Hairline (bordes):              #e7e5e4  — light
Hairline strong:                #d6d3d1
Hairline dark:                  #44403c  — en secciones night
```

**Reglas de color:**
- El emerald aparece UNA VEZ como botón filled por viewport. No colorear secciones enteras.
- El warm orange es solo acento editorial. Nunca interactivo.
- Usar solo la paleta stone de Tailwind — NUNCA `gray` o `neutral`.
- Dark sections = `canvas-night` (#1c1917), no inventes dark colors nuevos.

## Tipografía

Dos fuentes exactas. Sin excepciones.

| Rol | Fuente | Variable CSS | Peso |
|-----|--------|-------------|------|
| Display / Headings | DM Serif Display | `--font-display` | 400 ÚNICAMENTE |
| Body / UI / Botones | DM Sans | `--font-sans` | 400, 600, 700 |

```
text-xs font-bold tracking-widest uppercase text-emerald-600  → section labels
text-3xl / text-5xl (font-display)                            → h2 de sección
text-5xl / text-7xl (font-display)                            → hero h1
text-lg text-stone-500 leading-relaxed                        → subheading / sub
text-sm text-stone-500 leading-relaxed                        → body copy
text-sm font-semibold                                         → botones
```

- DM Serif Display SOLO en display headings. NUNCA en body, labels, o botones.
- No usar `font-bold` en DM Serif Display — solo existe en weight 400.
- Tracking negativo en headings grandes: `tracking-tight` en `text-3xl`+.

## Componentes

### Botones — siempre pill-shaped (`rounded-full`)

```tsx
// Primary dark (default CTA en fondos claros)
className="bg-stone-900 text-stone-50 px-6 py-3 rounded-full text-sm font-semibold hover:bg-stone-800 transition-colors duration-150"

// Accent emerald (énfasis máximo, una vez por sección)
className="bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors duration-150"

// Secondary outline
className="border border-stone-300 text-stone-600 px-6 py-3 rounded-full text-sm font-semibold hover:border-stone-400 hover:text-stone-800 transition-colors duration-150"

// Botón en sección dark (fondo claro, contraste)
className="bg-white text-stone-900 px-8 py-4 rounded-full font-semibold hover:bg-stone-100 transition-colors duration-150"
```

**Regla crítica:** `rounded-full` en TODOS los botones. Es la forma más distintiva de la marca.

### Cards

```tsx
// Light
className="bg-white border border-stone-200 rounded-xl p-6"

// Dark (dentro de sección night)
className="bg-stone-800 border border-stone-700 rounded-xl p-6"

// Hover
className="hover:border-stone-300 transition-colors duration-150"
```

### Section label pattern (obligatorio al inicio de cada sección)

```tsx
<p className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-4">
  Cómo trabajamos
</p>
<h2 className="text-stone-900 text-3xl md:text-5xl leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
  Proceso simple. Resultados reales.
</h2>
```

### Inputs

```tsx
className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:border-stone-900 outline-none transition-colors"
```

## Layout

- Max width: `max-w-5xl mx-auto px-6`
- Secciones: `py-20 md:py-28`
- Grid principal: `grid md:grid-cols-3 gap-5`
- Módulos: `grid grid-cols-2 md:grid-cols-4 gap-3`
- Base de espaciado: 8px

## Elevación

Milpa usa bordes, NO sombras en elementos estáticos.

```
Cards estáticas: border border-stone-200 (sin shadow)
Hover:           hover:border-stone-300 (un paso más oscuro)
Floating only:   shadow-sm / shadow-md para dropdowns, modales
```

## Animaciones

```
Hover / focus:    150ms ease-out  →  duration-150
Panel / drawer:   200ms ease-out
Nunca linear en UI. Siempre ease-out.
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## El LogoMark (tres barras SVG)

Tres cultivos de una milpa: frijol (media), maíz (alto), calabaza (bajo). También lee como gráfica de barras.

```tsx
function LogoMark({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  // Fixed 18×18 viewBox. bw=4, gap=3 → 3×4 + 2×3 = 18 (fills exactly).
  // Heights: 11 (medium/bean), 18 (tall/corn), 7 (short/squash).
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x={0}  y={7}  width={4} height={11} rx={2} fill={color} />
      <rect x={7}  y={0}  width={4} height={18} rx={2} fill={color} />
      <rect x={14} y={11} width={4} height={7}  rx={2} fill={color} />
    </svg>
  );
}
```

**IMPORTANTE:** ViewBox fijo `"0 0 18 18"` — no calcular posiciones dinámicamente. El cálculo anterior producía `x3=18`, en el borde del viewBox, dejando la tercera barra invisible.

Favicon SVG (`src/app/icon.svg`) — mismo logo sobre fondo redondeado stone-900:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#1c1917"/>
  <rect x="5"    y="14" width="5" height="13" rx="2.5" fill="#fafaf9"/>
  <rect x="13.5" y="5"  width="5" height="22" rx="2.5" fill="#fafaf9"/>
  <rect x="22"   y="19" width="5" height="8"  rx="2.5" fill="#fafaf9"/>
</svg>
```

## Qué NO hace Milpa

- Sin gradientes de fondo
- Sin sombras en cards estáticas
- Sin ilustraciones decorativas
- Sin más de dos fuentes
- Sin paleta `gray` o `neutral` de Tailwind — solo `stone`
- Sin `#000000` o `#ffffff` puros — siempre variantes stone
- Sin botones con radio menor a `rounded-full`

## Referencia completa

`landing-milpa/DESIGN.md` — sistema de diseño completo con todos los tokens, componentes y ejemplos de código.
