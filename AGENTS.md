# QLKTX Web Frontend Rules

## Current phase

- Build UI only with React, TypeScript, Vite, Tailwind CSS and mock data.
- Do not add Supabase, API clients, backend adapters, database migrations or real auth in this phase.
- Keep backend assumptions in docs or mock data, not inside screen code.

## Architecture boundary

- Screens live in `src/features/<role>/<feature>`.
- Shared primitives live in `src/components/ui` and are owned by Member 1.
- Cross-feature components live in `src/components/common` only after they are reused by at least two features.
- Navigation, route maps, layouts and providers live in `src/app` and are owned by Member 1.
- Mock data lives in `src/mocks/data`; screens may read mock data but must not call network services.

## Team ownership

- Member 1: `src/app`, `src/components`, `src/config`, `src/lib`, `src/styles`, docs, root config and dependencies.
- Member 2: `src/features/auth`.
- Member 3: `src/features/student/dashboard`, `src/features/student/application`, `src/features/student/room`.
- Member 4: `src/features/student/tickets`, `src/features/student/invoices`, `src/features/student/requests`, `src/features/student/notifications`.
- Member 5: `src/features/staff/dashboard`, `src/features/staff/applications`, `src/features/staff/allocation`, `src/features/staff/checkin_checkout`.
- Member 6: `src/features/staff/residents`, `src/features/staff/maintenance`, `src/features/staff/billing`, `src/features/staff/tasks`.
- Member 7: `src/features/admin`.

## Merge rules

- Do not edit another member's feature folder without agreement.
- Do not add dependencies without Member 1 updating `package.json`.
- Do not edit route constants casually. Ask Member 1 to add new top-level routes.
- Keep one PR limited to one ownership area unless it is the base scaffold PR.
- Run `npm run typecheck`, `npm run lint` and `npm run build` before merge.
