# LaunchKit — Module Design Reference

> **Purpose:** Internal reference for Milpa. Documents how LaunchKit (launchkit.getdesign.md) structures its modules and agent-readable design system, so we can draw inspiration for how to organize our own open-source module library.

---

## What is LaunchKit?

LaunchKit is a SaaS starter kit that ships pre-built modules (auth, billing, AI, growth tools, etc.) alongside a parallel layer of documentation written specifically for AI coding agents. Their premise: code is not enough — agents need context about *why* things are wired together, not just *how*.

They build on the **DESIGN.md** specification from Google, extending it to cover not just visual design but also integration architecture.

---

## Core Module Areas

LaunchKit organizes its work into five domains:

| Domain | What it covers |
|---|---|
| **App Foundation** | Auth, user management, database schema, routing conventions |
| **AI Features** | Chat interfaces, model switching, streaming, tool use |
| **Growth Tools** | Waitlists, referral links, analytics events, onboarding flows |
| **Design System** | Color tokens, typography, spacing, component library |
| **Agent Workflow** | The DESIGN.md files, skill documents, and agent-readable wiring guides |

---

## The "Agent-Readable Skill" Pattern

This is the most distinctive thing LaunchKit does. Each integration ships with a **skill document** — a markdown file that tells an AI coding agent:

1. **What this module does** — plain-language description of the capability
2. **What it connects to** — inputs, outputs, and external services
3. **How to wire it** — exact file paths, config keys, and code patterns to use
4. **What NOT to do** — common mistakes and anti-patterns
5. **How to test it** — verification steps

This is separate from the code itself. The skill document lives next to the module and is referenced from a central `DESIGN.md`.

### Skill Document Structure (from what we observed)

```markdown
# Skill: [Module Name]

## What this does
One paragraph.

## Dependencies
- List of packages, services, env vars

## How to integrate
Step-by-step with exact code snippets

## Config
Key-value pairs the agent must set

## Anti-patterns
What not to do

## Testing
How to verify it works
```

---

## How Modules Connect

LaunchKit uses four patterns for module connections:

1. **Hosted page model** — each module has a canonical route. Other modules link to it rather than embedding logic.
2. **Webhook listeners** — async events flow between modules via webhooks, not direct function calls.
3. **Provider-agnostic interfaces** — e.g., "email provider" is an abstract interface; Resend, SendGrid, etc. are implementations. Swap the provider by changing one config line.
4. **Per-agent config files** — each AI tool (Cursor, GitHub Copilot, Claude Code) gets its own config file that references the same DESIGN.md.

---

## What We're Borrowing for Milpa

| LaunchKit concept | Milpa equivalent |
|---|---|
| Skill documents | Module README per GitHub repo, describing what the module does and how to extend it |
| Agent-readable DESIGN.md | `DESIGN.md` in the studio-landing repo — our design system for agents |
| Provider-agnostic interfaces | Our modules expose config points (e.g., "email provider", "storage provider") |
| Per-agent config | We'll write a `CLAUDE.md` per module so AI coding assistants understand context |
| Hosted page model | Each Milpa module is its own Next.js app — other modules link to it, not embed it |

---

## Key Difference from Milpa's Approach

LaunchKit sells the kit itself (the SaaS boilerplate). Milpa's value is **customization** — we take open-source modules and adapt them to each client's workflow. So our "skill documents" will describe not just how the module works, but how to personalize it for a new client without breaking the core.

---

*Saved: June 2026 — based on research of launchkit.getdesign.md and the getdesign.md format.*
