# QLKTX Web Frontend Agent Rules

## Root Sync Rule

Read `D:\QLKTX\AGENTS.md` and `D:\QLKTX\TEAM_ASSIGNMENT.md` before working in this repo. Those root files define cross-source sync rules for Jira, Figma, PM docs, backend API docs, frontend code, and harness structure. This file only adds web-frontend-specific rules.

## Mission

Build the `Frontend-Web-QLKTX` React web frontend for DormCare Hub / QLKTX. This repo is the team workspace for the web-responsive MVP UI. The current phase is frontend-only: build navigable, realistic, demo-ready screens with mock data so 7 members can work in parallel with low merge conflict.

Primary source docs:

- `docs/pm/project-overview.md`
- `docs/pm/product-backlog.md`
- `docs/pm/prototype-spec.md`
- `docs/pm/definition-of-done.md`
- `docs/pm/release-plan-fixed-date.md`
- Local web docs in `docs/`

For feature members, local docs in this repo are the daily working contract. The `docs/pm/` folder is a local snapshot copied from `D:\NGONGOCDANGKHOA\docs`, so members do not need that external repo. Member 1/PM or agents use the external folder only to refresh the snapshot or resolve upstream contradictions.

## Non-Negotiables

- Do not add Supabase client, real auth tokens, storage, payment, SIS sync, service keys, or real env secrets in this repo. Backend REST access goes only through the shared repositories layer in `src/lib/api` (Member 1 owned).
- Screens never call `fetch` directly. Data flows through `src/lib/api/repositories.ts`, which switches between mock data (`src/mocks/data`) and the `Backend-QLKTX` API via `VITE_API_MODE=mock|live`.
- UI primitives must come from `shadcn` components in `src/components/ui`.
- Icons must come from `lucide-react`. Do not add another icon pack. Do not hand-roll SVG icons unless no lucide icon fits.
- Shared UI, route maps, root config, dependency changes, docs, and `src/components/ui` are Member 1 owned.
- Feature members only edit their assigned feature folders unless a shared change is explicitly coordinated.
- Every screen must be responsive, keyboard usable, and include realistic loading/empty/error/form states when relevant.

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS
- shadcn component registry, style `radix-nova`, icon library `lucide`
- `lucide-react` for icons
- `class-variance-authority`, `radix-ui`, `clsx`, `tailwind-merge` for shadcn primitives

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run format
```

Local shadcn CLI is installed as a dev dependency because `npx shadcn@latest` can fail on this Windows toolchain. Use:

```bash
node ./node_modules/shadcn/dist/index.js info
node ./node_modules/shadcn/dist/index.js add <component> --yes
```

Only Member 1 should add or overwrite shared shadcn components.

## Installed shadcn Components

Current installed base:

- `button`
- `card`
- `badge`
- `input`
- `table`
- `tabs`
- `dialog`
- `sheet`
- `dropdown-menu`
- `select`
- `checkbox`
- `textarea`
- `skeleton`
- `separator`
- `avatar`
- `progress`
- `alert`

Keep legacy local primitives only when they are project-specific wrappers, for example `EmptyState`, `LoadingState`, or `Modal`. Prefer shadcn `Dialog` for new modal work.

## Architecture Boundaries

```text
src/
  app/             router, providers, layouts
  components/ui    shadcn primitives, Member 1 only
  components/common reusable components used by 2+ features
  components/navigation app sidebar/nav
  config           app constants
  features         role-owned screens and feature-only components
  lib              pure helpers, e.g. cn()
  mocks/data       mock-only data source
  styles           Tailwind entry and global tokens
  types            shared TypeScript types
```

Data boundary (implemented):

```text
screen -> useAsyncData hook -> repositories (src/lib/api/repositories.ts)
       -> datasource: mock (src/mocks/data) | http (src/lib/api/http.ts -> Backend-QLKTX)
```

- `VITE_API_MODE=mock` (default): repositories serve in-memory mock data, demo offline.
- `VITE_API_MODE=live` + `VITE_API_URL`: repositories call the backend REST API; DTO -> domain mapping lives in `src/lib/api/mappers.ts` so screens never see raw backend enums.
- Real Supabase Auth is still deferred; live mode identifies the active role via the backend `DEV_AUTH_BYPASS` header in local development only.

## Member Ownership

| Member | Owns                                                                                                                                      | Main scope                                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1      | `src/app`, `src/components`, `src/config`, `src/lib`, `src/styles`, root config, docs                                                     | Shell, router, shadcn UI system, dependencies, rules                         |
| 2      | `src/features/auth`                                                                                                                       | Login, profile, role gate mock, consent/RBAC UI                              |
| 3      | `src/features/student/dashboard`, `src/features/student/application`, `src/features/student/room`                                         | Student home, application, current room                                      |
| 4      | `src/features/student/tickets`, `src/features/student/invoices`, `src/features/student/requests`, `src/features/student/notifications`    | Student services                                                             |
| 5      | `src/features/staff/dashboard`, `src/features/staff/applications`, `src/features/staff/allocation`, `src/features/staff/checkin_checkout` | Staff operations A                                                           |
| 6      | `src/features/staff/residents`, `src/features/staff/maintenance`, `src/features/staff/billing`, `src/features/staff/tasks`                | Staff operations B                                                           |
| 7      | `src/features/admin`                                                                                                                      | Admin dashboard, RBAC/users, buildings/rooms, rules, reports/audit, settings |

## UI Rules

- Use operational SaaS density. No marketing landing page, decorative hero, oversized gradients, or generic card grids.
- Use real DormCare sample copy: applications, rooms, beds, tickets, SLA, occupancy, assignment reasons.
- Use shadcn semantic APIs: `Button`, `Card`, `Badge`, `Table`, `Tabs`, `Dialog`, `Select`, `Checkbox`, etc.
- Use lucide icons inside icon buttons and nav items. Add `aria-hidden="true"` for decorative icons.
- Use labels for icon-only buttons through `aria-label` or visible text.
- Keep cards at `8px` radius or the shadcn token equivalent; do not nest cards inside cards.
- Keep tables scan-friendly: compact rows, status badges, row actions, horizontal overflow on mobile.
- Every KPI must point to a record list or action, not just a decorative chart.
- Every override or sensitive operation in mock UI must show a reason/audit hint.

## Feature Page Done Checklist

- Route renders a non-blank page.
- Uses the shared layout/navigation.
- Uses shadcn UI primitives and lucide icons.
- Loads data through `src/lib/api/repositories.ts` (or local constants for static copy); never calls `fetch` directly.
- Shows default state and relevant loading, empty, error, validation, and mobile states.
- Does not import Supabase, call `fetch` to a real API, or introduce secrets.
- Matches MVP backlog/prototype intent in `docs/pm/` and local web docs.
- Passes `npm run typecheck`, `npm run lint`, and `npm run build`.

## Dependency Rules

- New dependency requires Member 1 approval and docs update.
- No UI libraries that compete with shadcn.
- No icon libraries other than `lucide-react`.
- No state-management library unless a concrete cross-feature need appears.
- No data-fetching library until backend integration begins.

## Merge Rules

- One PR should stay inside one ownership area.
- Shared UI changes should be their own PR or coordinated with Member 1.
- Do not rename routes, folders, or role paths without docs/router update.
- Do not edit another member's feature folder to make your page compile. Ask for a shared fix or move shared code to `src/components/common`.
- Before handoff, list changed files, commands run, and any warning left.

## Current MVP Guardrail

Protect Release 1 MVP from scope creep. Must-have flow:

1. Login/RBAC/consent.
2. Student application and status.
3. Staff application review.
4. Room/bed ledger.
5. Assignment suggestion and override reason.
6. Check-in/out.
7. Maintenance ticket and SLA board.
8. Operations dashboard with actionable KPIs.

Phase 2 items such as fees/debt, notifications, import/export, audit export, SIS sync, payment gateway, and native mobile are not part of the active frontend-only MVP unless the team explicitly moves them in.
