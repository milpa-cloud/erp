---
name: vercel-design-guidelines
description: Vercel / Geist design system principles for building web interfaces. Reference when making decisions about typography, color, spacing, motion, and component design.
---

# Vercel Design Guidelines (Geist System)

Reference: geist.vercel.sh — Vercel's public design system. Apply these when building UI for any Milpa project or client.

## Typography

**Typefaces**
- Display / UI: **Geist Sans** — geometric, clean, neutral. Available via `next/font/google` as `Geist`.
- Code / data: **Geist Mono** — for terminal output, code blocks, file paths, IDs, numbers.
- Do not mix more than two typefaces. Geist Sans handles both display and body; Geist Mono handles everything machine-readable.

**Type scale** (Vercel's actual production scale)
```
12px / 0.75rem   — captions, labels, metadata
14px / 0.875rem  — body, UI text, descriptions
16px / 1rem      — comfortable body, form inputs
20px / 1.25rem   — section headings
24px / 1.5rem    — page titles
32px / 2rem      — hero subheadings
48px / 3rem      — hero headlines
```

**Letter spacing**
- Headings (24px+): `-0.02em` to `-0.03em` — tight tracking on large type
- Body: `0` (default) — never add positive tracking to body text
- All-caps labels: `+0.06em` to `+0.1em` — small label text only

**Font weight**
- 400 — body, descriptions
- 500 — UI labels, navigation, table headers
- 600 — headings, emphasis, bold UI states
- 700 — hero headlines only

## Color System

**Core palette** (true black / true white, no softening)
```
Black:     #000000   — primary text, borders (dark mode bg)
White:     #ffffff   — primary text (light mode bg)
Gray 50:   #fafafa
Gray 100:  #f4f4f5
Gray 200:  #e4e4e7
Gray 300:  #d4d4d8
Gray 400:  #a1a1aa
Gray 500:  #71717a
Gray 600:  #52525b
Gray 700:  #3f3f46
Gray 800:  #27272a
Gray 900:  #18181b
Gray 950:  #09090b
```

**Accent / status colors**
```
Blue:      #0070f3  — primary actions, links, focus rings
Green:     #10b981  — success, live, ready
Orange:    #f97316  — warning, pending, building
Red:       #ef4444  — error, destructive, critical
Purple:    #8b5cf6  — experimental, AI features
```

**Usage rules**
- Use true black/white for primary surfaces. Never soften to off-black or warm-white unless the brand specifically requires it.
- Status colors appear sparingly — badges, indicators, alert borders. They do not color entire sections.
- For dark mode: background is `#000`, not `#0d1117` or `#1a1a1a`. True black.
- Hover states: shift one gray step lighter/darker. No color changes on hover, only lightness.

## Spacing & Layout

**Base unit: 4px**
All spacing is multiples of 4. The most used values:
```
4px   — gap between inline elements, icon-to-text
8px   — component internal padding (sm)
12px  — component internal padding (base)
16px  — section padding, card padding
24px  — between components
32px  — between sections (mobile)
48px  — between sections (desktop)
64px  — major layout gaps
96px  — page-level padding top/bottom
```

**Page width**
- Content max-width: `1200px` centered
- Narrow content (prose, forms): `672px` max-width
- Wide content (dashboards, tables): `1440px` max-width

**Grid**
- 12-column grid, `24px` gutters
- Mobile: single column, `16px` side padding
- Content areas respect the grid — avoid full-bleed sections unless intentional

## Border Radius

```
2px   — tags, badges, small indicators
6px   — inputs, buttons, cards (default)
8px   — modals, panels, dropdowns
12px  — large cards, featured items
16px  — hero cards
9999px — pill badges, toggles, avatar chips
```

Do not mix radii inconsistently within a component family. Pick one scale and stick to it.

## Elevation & Borders

Vercel uses borders, not shadows, for structure. Shadows appear only for floating elements.

**Borders**
```
Light mode: 1px solid #e4e4e7 (Gray 200)
Dark mode:  1px solid #27272a (Gray 800)
```

**Shadows** (floating elements only: modals, dropdowns, tooltips)
```
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)
lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)
```

Never use box shadows on static cards or sections. Use borders instead.

## Motion & Animation

**Timing**
```
Micro (hover, focus): 100–150ms ease-out
Transitions (panel, drawer): 200ms ease-out
Page transitions: 300ms ease-in-out
Complex sequences: 400–500ms, stagger children by 50–80ms
```

**Easing**
- Default: `ease-out` (enters fast, decelerates — feels responsive)
- Enter: `cubic-bezier(0, 0, 0.2, 1)` — decelerate
- Exit: `cubic-bezier(0.4, 0, 1, 1)` — accelerate out
- Never `linear` for UI motion — always ease

**What to animate**
- opacity and transform (GPU-composited, always smooth)
- height/width only when necessary — prefer max-height with overflow:hidden
- Never animate border, background-color, box-shadow as primary motion — combine with opacity

**Reduced motion**
Always include `@media (prefers-reduced-motion: reduce)` — remove transitions, keep instant state changes.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Components

**Buttons**
```
Primary:   bg-black text-white hover:bg-gray-800           (dark mode: inverted)
Secondary: bg-white text-black border border-gray-200 hover:bg-gray-50
Ghost:     bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900
Danger:    bg-red-600 text-white hover:bg-red-700
```
- Height: 32px (sm), 36px (default), 40px (lg)
- Padding: `px-3 py-1.5` (sm), `px-4 py-2` (default)
- Border radius: 6px (matches Vercel default)
- Focus ring: `ring-2 ring-offset-2 ring-blue-500`

**Inputs**
```
Height: 36px default
Border: 1px solid #e4e4e7
Radius: 6px
Focus:  border-blue-500 + ring-2 ring-blue-500/30
Bg:     white (light) / transparent with dark border (dark)
Font:   14px, Geist Sans
```

**Cards**
```
Border: 1px solid #e4e4e7
Radius: 8–12px
Bg:     white (light) / #0a0a0a (dark)
Padding: 16–24px
Hover:  darken border one step, add subtle shadow
```

**Badges / Status indicators**
```
Sizes:   text-xs (11–12px), px-2 py-0.5, rounded-full
Live:    bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400
Pending: bg-orange-100 text-orange-700
Error:   bg-red-100 text-red-700
Info:    bg-blue-100 text-blue-700
Neutral: bg-gray-100 text-gray-600
```

## Dark Mode

Vercel implements dark mode as true inversion, not just dimming:
- Background: `#000000` (true black)
- Surface: `#0a0a0a` to `#111111` (barely-there lift)
- Borders: `#27272a` (Gray 800)
- Text primary: `#fafafa`
- Text muted: `#a1a1aa` (Gray 400)
- Accents: slightly lighter/more saturated versions of light mode accents

Implement with CSS `prefers-color-scheme` and a `data-theme` attribute toggle. In Tailwind: `darkMode: 'class'` with `dark:` utilities.

## Information Density

Vercel interfaces are **dense but readable** — they pack information without cluttering.

Rules:
- Tables and lists: 40–48px row height
- Dashboards: show the most actionable metric first, full-width, then supporting data in a grid
- Never show more than 3–4 data points on a primary metric card
- Progressive disclosure: show the summary, reveal details on hover/click
- Empty states are not blank — they explain what would appear and offer a primary action

## What Vercel Doesn't Do

- No gradient backgrounds (except very subtle, purposeful ones)
- No drop shadows on static layout elements
- No decorative dividers — use spacing instead
- No multiple font families
- No large icon illustrations in UI (use minimal, consistent icon sets — Lucide or similar)
- No centered hero text with a background image — content-first layouts
- No full-bleed dark sections with white text as decoration — use them only when content demands it
