---
trigger: always_on
---

# agent.md — Developer Guidelines & Project Reference

> **Optimised for Claude Opus 4.6** — Read this file fully before touching any code. It is the single source of truth for architecture, constraints, and conventions.

---

## 1. Project Overview

**MeisterUp** is an AI-native adaptive learning platform for engineers.
The current codebase is the **Senior Review Gym** — an interactive Code Comprehension Gym with a swiping-deck UI for code review practice.

**Core value proposition**: MeisterUp models existing knowledge, finds exact skill gaps, and generates a personalized curriculum for any technical skill — from Rust to system design to prompt engineering.

---

## 2. Tech Stack

| Layer            | Technology & Version                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Language         | TypeScript 5 (`^5.8.3`)                                                           |
| Runtime / PM     | [Bun](https://bun.sh) (package manager + runtime)                                 |
| UI Library       | [React 19](https://react.dev) (`^19.2.0`)                                         |
| Meta-Framework   | [TanStack Start](https://tanstack.com/start) (`^1.168.26`) — SSR-enabled          |
| Routing          | [TanStack Router](https://tanstack.com/router) (`^1.170.16`) — file-based         |
| Bundler          | [Vite 8](https://vite.dev) (`^8.0.16`) via `@lovable.dev/vite-tanstack-config`    |
| Server Engine    | Nitro (`3.0.x-beta`) — Cloudflare target                                          |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com) (`^4.2.1`)                             |
| UI Primitives    | [Radix UI](https://www.radix-ui.com) (full suite — see package.json)              |
| UI Pattern       | shadcn/ui (`src/components/ui/`)                                                  |
| Animation        | [Framer Motion](https://www.framer-motion.com) (`^12.42.2`)                       |
| Icons            | [Lucide React](https://lucide.dev) (`^0.575.0`)                                   |
| Forms            | [React Hook Form](https://react-hook-form.com) (`^7.71.2`) + [Zod](https://zod.dev) (`^3.24.2`) |
| Data Fetching    | [TanStack Query](https://tanstack.com/query) (`^5.101.1`)                         |
| Charts           | [Recharts](https://recharts.org) (`^2.15.4`)                                      |
| Backend / Auth   | [Supabase](https://supabase.com) (`@supabase/supabase-js ^2.48.0`) — PostgreSQL + Auth + RLS |
| Notifications    | [Sonner](https://sonner.emilkowal.ski) (`^2.0.7`) toast system                    |
| Class Utilities  | `clsx ^2.1.1` + `tailwind-merge ^3.5.0` → `cn()` helper                          |
| Carousel         | `embla-carousel-react ^8.6.0`                                                     |
| Date utilities   | `date-fns ^4.1.0`                                                                 |
| Animations (CSS) | `tw-animate-css ^1.3.4`                                                           |

---

## 3. Directory Structure (current)

```
senior-review-gym-main/
├── .agents/
│   └── rules/
│       └── agent.md              # ← THIS FILE (always-on agent rules)
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── ui/                   # Radix + Tailwind shadcn/ui components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── auth.tsx              # Auth provider & hooks (Supabase session)
│   │   ├── error-capture.ts      # Error capture utilities
│   │   ├── error-page.ts         # Error page helper
│   │   ├── lovable-error-reporting.ts  # Lovable sandbox error reporting
│   │   ├── supabase.ts           # Supabase client initialisation
│   │   └── utils.ts              # cn() helper (clsx + tailwind-merge)
│   ├── routes/
│   │   ├── README.md             # Route documentation
│   │   ├── __root.tsx            # Root shell — providers, fonts, error/404 boundaries
│   │   ├── _authenticated.tsx    # Auth guard layout (wraps all protected routes)
│   │   ├── _authenticated.dashboard.tsx   # Main dashboard (large: 27KB)
│   │   ├── _authenticated.leaderboard.tsx # Leaderboard page
│   │   ├── _authenticated.profile.tsx     # User profile page
│   │   ├── _authenticated.settings.tsx    # Settings page
│   │   ├── _authenticated.skills.tsx      # Skills list (search, categories, progress)
│   │   ├── faq.tsx               # FAQ page
│   │   ├── index.tsx             # Landing page + Swiping Gym (large: 62KB)
│   │   ├── onboarding.tsx        # New user onboarding flow
│   │   ├── pricing.tsx           # Pricing page
│   │   ├── signin.tsx            # Sign-in with form validation & OAuth
│   │   └── skills_.$skillId.tsx  # Individual skill detail/gym (large: 58KB)
│   ├── routeTree.gen.ts          # AUTO-GENERATED — do NOT edit manually
│   ├── router.tsx                # TanStack Router instance setup
│   ├── server.ts                 # SSR server entry (Nitro/Cloudflare)
│   ├── start.ts                  # Client-side hydration entry
│   └── styles.css                # Tailwind v4 source + design tokens
├── supabase/
│   └── migrations/               # SQL migration files
├── AGENTS.md                     # Lovable git rules (DO NOT DELETE/REWRITE)
├── TECH_STACK.md                 # Human-readable tech stack reference
├── bunfig.toml                   # Bun execution and lockfile config
├── components.json               # shadcn/ui CLI configuration
├── eslint.config.js              # ESLint flat config
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript compiler settings
└── vite.config.ts                # Vite configuration (minimal — see §4)
```

---

## 4. Critical Architectural Constraints

### 4.1 Vite Config — Do NOT add plugins manually

`@lovable.dev/vite-tanstack-config` already bundles:
- `tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`, TanStack devtools
- Nitro (build-only, Cloudflare target), `VITE_*` env injection, `@` path alias
- React/TanStack dedupe, error logger, sandbox detection

**Adding any of these again will break the build.**

### 4.2 Routing — File-Based, Auto-Generated

- `__root.tsx` — root shell with global providers, fonts (Inter + JetBrains Mono), error/404 boundaries
- `_authenticated.tsx` — auth guard layout; all `_authenticated.*` routes require a live Supabase session
- `index.tsx` — landing page + the core Swiping Gym component
- `skills_.$skillId.tsx` — dynamic route for skill detail; param is `$skillId`
- **Never edit `routeTree.gen.ts`** — it is auto-generated on `bun run dev`
- To add a new route, create a new file under `src/routes/`; route tree regenerates automatically

### 4.3 Authentication — Supabase

- Supabase client: `src/lib/supabase.ts`
- Auth provider + hooks: `src/lib/auth.tsx`
- Session state is consumed via the auth provider wrapped in `__root.tsx`
- Protected routes sit under the `_authenticated` layout which redirects unauthenticated users
- Database schema managed via `supabase/migrations/`

### 4.4 Styling System

- **Dark mode only** — `<html class="dark">` is set globally; never add a light mode toggle
- Base body: `bg-black text-gray-100`
- Google Fonts via `__root.tsx`: **Inter** (UI text) + **JetBrains Mono** (code blocks)
- Design tokens live in `src/styles.css`
- Always use the `cn()` helper from `src/lib/utils.ts` for conditional class merging

### 4.5 Animation & Interaction

- All animations: **Framer Motion** (`motion.*`, `AnimatePresence`)
- Swipe/drag gestures: `useMotionValue` + `useTransform` pattern
- Icons: **Lucide React only** — no other icon libraries

### 4.6 SSR

- Server entry: `src/server.ts` (wraps Nitro/Cloudflare with error reporting)
- Client hydration: `src/start.ts`
- Avoid browser-only APIs at module level — guard with `typeof window !== 'undefined'`

---

## 5. Common Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (also regenerates routeTree.gen.ts)
bun run build        # Production build
bun run build:dev    # Development build
bun run preview      # Preview production build locally
bun run lint         # Run ESLint
bun run format       # Run Prettier
```

---

## 6. Lovable / Git Rules

> [!CAUTION]
> **Never** force-push, rebase, amend, or squash commits that are already pushed.
> This project syncs with Lovable — rewriting published history will corrupt the user's project on Lovable's side.
> Always keep the connected branch in a working state.

---

## 7. Code Conventions

### Component Patterns
- Follow the **shadcn/ui pattern**: Radix UI primitives + Tailwind CSS styling in `src/components/ui/`
- Use `class-variance-authority` (`cva`) for variant-driven component APIs
- Keep components focused and reusable; co-locate component-specific logic

### TypeScript
- Strict TypeScript throughout — avoid `any`; use `unknown` + type narrowing
- Prefer interfaces for object shapes, `type` aliases for unions/intersections
- Use Zod schemas for all form validation and runtime data parsing

### State & Data Fetching
- Server state: **TanStack Query** (`useQuery`, `useMutation`, `useQueryClient`)
- Form state: **React Hook Form** + **Zod** resolvers
- Local/UI state: `useState`, `useReducer`, or Framer Motion values

### Toast Notifications
- Use **Sonner** (`import { toast } from 'sonner'`) for all toast/notification UI

### File Size Awareness
- `index.tsx` (62KB) and `skills_.$skillId.tsx` (58KB) are large files
- When editing them, prefer targeted, surgical edits over full rewrites
- Consider extracting reusable sub-components to `src/components/` when adding significant new UI

---

## 8. Claude-Specific Guidance

### Before Making Any Change
1. **Read the relevant route file(s)** to understand existing state, hooks, and component structure
2. **Check `src/lib/`** for existing utilities before writing new ones
3. **Check `src/components/ui/`** for existing UI primitives before building from scratch

### When Adding Features
- Auth-gated features → add to `_authenticated.*` routes or a new `_authenticated.<feature>.tsx` file
- Public features → add to `index.tsx`, `faq.tsx`, `pricing.tsx`, or a new top-level route
- New Supabase tables → add a migration file in `supabase/migrations/`
- New reusable UI → add to `src/components/ui/` following the shadcn/ui pattern

### Dangerous Patterns to Avoid
- ❌ Editing `routeTree.gen.ts` directly
- ❌ Adding Vite plugins already bundled by `@lovable.dev/vite-tanstack-config`
- ❌ Using browser APIs (`window`, `document`, `localStorage`) at module level without SSR guard
- ❌ Force-pushing or rewriting git history
- ❌ Introducing a light mode — the design is dark mode only
- ❌ Using icon libraries other than `lucide-react`
- ❌ Importing from `src/routes/index.tsx`'s local `cn()` — always import from `src/lib/utils.ts`
