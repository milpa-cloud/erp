# ADR-000: Project History & Decision Log

**Studio:** Milpa  
**Owner:** Pablo Spada  
**Domain:** milpa.cloud  
**Started:** June 2025  

---

## What is this document?

A chronological log of every significant decision made while building Milpa and its client apps. Anyone — human or AI — reading this should be able to understand:

- Why the studio exists and what it does
- What was built, in what order, and why
- What was explicitly rejected and why
- How to continue development without losing context

---

## The Vision

Pablo Spada owns a woodworking company (Carpintería Huayapam, Oaxaca, Mexico). While building his own ERP, he realized he could offer the same hyper-personalized software to other small and medium businesses at a fraction of Odoo/SAP prices.

**The model:**
- Build reusable modules once
- Deploy per client with minor configuration changes
- Charge a fixed price — no per-user fees, no surprises
- Use AI (Claude Code) to accelerate development

**Inspirations:** 37signals / Basecamp — small team, opinionated software, calm methodology, open source as marketing.

---

## Studio Structure

```
~/Programming Projects/dev-studio/
├── studio-landing/    ← Milpa public marketing site (Next.js)
├── client-template/   ← Base React app to clone per client (Fase 1)
├── beekeeper-libre/   ← Open-source PWA for field workers (Fase 3)
├── skills/            ← Claude Code slash commands
└── docs/              ← This folder — ADRs and history
```

---

## Decision Log

---

### 2025-06 — Studio naming

**Decision:** Studio name is **Milpa**, domain **milpa.cloud**

**Rejected names (50+ explored):**
- Oficio, Fragua, Taller, Campo — too generic or taken
- Brújula — brujula.app is a compass app, conflict
- Gild — gild.studio taken
- Multiple .io/.dev options — conflicts found via domain check

**Why Milpa:** Milpa is a traditional Mexican intercropping system (corn + beans + squash grown together). Perfect metaphor: different businesses, same ecosystem, each supporting the others. Unique internationally, rooted in Oaxaca.

---

### 2025-06 — Landing page tech stack

**Decision:** Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui

**Why Next.js over plain HTML or other options:**
- Same framework can power the client portal in the future (public + private routes)
- App Router supports static export for Firebase Hosting
- TypeScript from day one prevents class of errors

**Why shadcn/ui:**
- Copy-paste ownership (no black-box npm dependency)
- Accessible by default
- Consistent with the client-template stack

**Why NOT Catppuccin or Carpintería Huayapam design:**
- Explicit decision: studio has its own identity
- No vanilla HTML components ported over

**Typography:** DM Serif Display (headings) + DM Sans (body) via next/font/google  
**Color accent:** Emerald-600  
**Base color:** stone-50 (warm off-white via oklch CSS custom properties)

---

### 2025-06 — Hosting: everything in Google/Firebase

**Decision:** All deployments — landing page AND client apps — go to Firebase Hosting.

**Why not Vercel:**
- Milpa's client apps already use Firebase (Auth, Firestore, Hosting)
- Standardization: one provider for everything
- One console, one billing account, one mental model
- Firebase Hosting is free for static sites at this scale

**Implementation:**
- `next.config.ts`: `output: "export"` → generates static HTML to `/out` folder
- `firebase.json`: points public dir to `out`, SPA rewrite to `index.html`
- `.firebaserc`: links to Firebase project ID
- Deploy: `npm run build && firebase deploy --only hosting`

**Firebase project for landing:** `milpa-studio-landing`  
**Live URL:** https://milpa-studio-landing.web.app  
**Custom domain (pending):** milpa.cloud

---

### 2025-06 — One Firebase project per client

**Decision:** Each client gets their own isolated Firebase project.

```
milpa-studio-landing        ← Milpa marketing site
carpinteria-erp-v2          ← Carpintería Huayapam (first client, existing)
[future-client-id]          ← next client
```

**Why isolated projects (not one shared project):**
- Data isolation: clients' data never mixes
- Simple Firestore security rules per project (no tenant filtering needed)
- Portability: hand a client their entire Firebase project if they ever leave
- Cost clarity: each project's usage is independently trackable
- Failure containment: a bug in one client doesn't affect others

**Precedent:** Basecamp uses a separate MySQL database per customer account — same principle.

---

### 2025-06 — Client app tech stack

**Decision:** Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui + Firebase

**Why Vite over Next.js for client apps:**
- Client apps are SPAs behind login — no need for SSR or public SEO
- Faster development server
- Simpler config for Firebase Hosting static deploy
- Next.js reserved for the landing page (which may eventually have SSR)

**Why NOT the old Carpintería ERP stack (vanilla JS + HTML):**
- Not reusable or scalable
- No TypeScript — hard to maintain across clients
- Replaced entirely with the new `client-template/`

---

### 2025-06 — Landing page → app connection strategy

**Decision:** Milpa's landing page and future client portal will live at `milpa.cloud`. Client apps live at per-client subdomains or separate domains.

**Pattern (like Basecamp):**
```
milpa.cloud/            → public landing page
milpa.cloud/login       → future: client portal login
milpa.cloud/dashboard   → future: where Pablo's clients track their projects
[client].milpa.cloud    → the client's actual business app
```

**Two separate systems:**
1. `studio-landing` — Milpa's own marketing + future client portal (Next.js, milpa.cloud)
2. `client-template` — the business app deployed per client (Vite + React, client's domain)

---

## Existing Clients

| Client | Firebase Project | Status |
|---|---|---|
| Carpintería Huayapam | `carpinteria-erp-v2` | Production, 44+ modules |

---

## URLs & Repos

| Resource | URL |
|---|---|
| GitHub (landing) | https://github.com/pablo-spa/milpa-studio-landing |
| Firebase console (landing) | https://console.firebase.google.com/project/milpa-studio-landing |
| Live site | https://milpa-studio-landing.web.app |
| Custom domain (pending) | milpa.cloud |

---

## Methodology Notes

**Shape Up (37signals):** When scoping a client project, ask "what's the most painful problem you have today?" — not "what features do you want?" Design the minimum solution that fixes that specific pain in a fixed timeframe.

**AI-assisted development:** This studio uses Claude Code (Anthropic) as a development partner. Every decision, rejection, and rationale is documented here so any AI agent can pick up context without re-deriving it.

---

## What's Next

See [plan file](../../.claude/plans/i-want-to-become-buzzing-fiddle.md) for implementation phases.

**Fase 1 (next):** Initialize `client-template/` — Vite + React + Firebase core (auth, db hooks, layout shell, module template).
