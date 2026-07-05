# Frontend Architecture - QLKTX Web

## Mục tiêu

`Frontend-Web-QLKTX` là web frontend React cho DormCare Hub / QLKTX. Toàn bộ màn hình MVP đã triển khai và nối với `Backend-QLKTX` REST API qua tầng repositories; chế độ dữ liệu chuyển bằng `VITE_API_MODE=mock|live` nên vẫn demo offline được bằng mock data. Supabase Auth thật, payment gateway, SIS sync và native mobile chưa triển khai trong repo này (live mode local dùng backend `DEV_AUTH_BYPASS`).

Data boundary hiện tại:

```text
screen -> useAsyncData hook -> repositories (src/lib/api/repositories.ts)
       -> datasource: mock (src/mocks/data) | http (src/lib/api/http.ts -> Backend-QLKTX)
```

DTO -> domain mapping nằm ở `src/lib/api/mappers.ts` để màn hình không thấy enum thô của backend.

Architecture này đồng bộ với bộ tài liệu kỹ thuật/project-management đã copy vào `docs/pm/` từ nguồn gốc `D:\NGONGOCDANGKHOA\docs`, đặc biệt:

- `docs/pm/project-overview.md`: MVP boundary, role/stakeholder, risks.
- `docs/pm/product-backlog.md`: user stories, priorities, sprint targets.
- `docs/pm/prototype-spec.md`: screen list, flow, sample data, acceptance criteria.
- `docs/pm/definition-of-done.md`: quality/evidence checklist.
- `docs/pm/release-plan-fixed-date.md`: fixed-date Release 1 guardrail.

Các file trên là bản snapshot local để members không cần clone hoặc mở repo `D:\NGONGOCDANGKHOA`. Trong công việc hằng ngày, feature members đọc docs local trong repo này, đặc biệt `docs/frontend-architecture.md`, `docs/team-work-rules.md`, và file liên quan trong `docs/pm/` khi cần acceptance criteria. Member 1/PM chịu trách nhiệm refresh snapshot từ upstream khi scope thay đổi hoặc có mâu thuẫn.

## Stack

| Layer               | Quyết định                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| App framework       | Vite + React + TypeScript                                                  |
| Routing             | `react-router-dom`                                                         |
| Styling             | Tailwind CSS                                                               |
| UI primitives       | shadcn components in `src/components/ui`                                   |
| shadcn config       | `components.json`, style `radix-nova`, base `radix`, icon library `lucide` |
| Icons               | `lucide-react` only                                                        |
| Utility class merge | `clsx`, `tailwind-merge`, `class-variance-authority`                       |
| Headless primitives | `radix-ui`                                                                 |
| Data access         | Repositories (`src/lib/api`), `VITE_API_MODE=mock\|live`, no Supabase client |

## shadcn Setup

The project uses a local shadcn CLI dev dependency because `npx shadcn@latest` can fail on the current Windows toolchain.

```bash
node ./node_modules/shadcn/dist/index.js info
node ./node_modules/shadcn/dist/index.js add <component> --yes
```

Installed base components:

```text
button, card, badge, input, table, tabs, dialog, sheet,
dropdown-menu, select, checkbox, textarea, skeleton,
separator, avatar, progress, alert
```

Support files:

- `components.json`: shadcn registry/alias config.
- `tsconfig.json` and `tsconfig.app.json`: both expose `@/* -> src/*` so CLI and app agree.
- `src/lib/utils.ts`: compatibility export for shadcn imports from `@/lib/utils`.
- `src/lib/utils/cn.ts`: actual `cn()` helper.
- `tailwind.config.ts`: semantic shadcn tokens + existing DormCare brand tokens.
- `src/styles/index.css`: CSS variables for shadcn semantic colors.

## Folder Structure

```text
src/
  app/
    router/       # route map, role routing
    providers/    # app-level providers
    layouts/      # role shell layouts
  components/
    ui/           # shadcn primitives, Member 1 owned
    common/       # component reused by 2+ features
    navigation/   # sidebar/nav components
  config/         # app constants
  features/
    auth/         # login, profile, role gate mock
    student/      # student-facing modules
    staff/        # staff operations modules
    admin/        # admin governance modules
  lib/
    utils/        # helper implementation files
    utils.ts      # shadcn-compatible export
  mocks/
    data/         # mock data for UI only
  styles/         # Tailwind entry and global CSS
  types/          # shared TS types
```

## Data Boundary Hiện Tại

Frontend-only phase:

```text
screens -> mock data/local state -> UI
```

Rules:

- Screens use mock data or local state.
- No Supabase, REST API, RPC, storage, payment, SIS, or real auth calls.
- No SQL/table policy logic in components.
- No `@supabase/supabase-js` until backend integration phase.

Future backend integration boundary:

```text
screens -> feature hooks/state -> repositories -> datasource -> Supabase/API
```

Do not implement the future datasource/repository layer during the current UI-only phase.

## Route Map

| Role    | Routes                                                                                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth    | `/login`, `/profile`                                                                                                                                                  |
| Student | `/student/dashboard`, `/student/application`, `/student/room`, `/student/tickets`, `/student/invoices`, `/student/requests`, `/student/notifications`                 |
| Staff   | `/staff/dashboard`, `/staff/applications`, `/staff/allocation`, `/staff/checkin-checkout`, `/staff/residents`, `/staff/maintenance`, `/staff/billing`, `/staff/tasks` |
| Admin   | `/admin/dashboard`, `/admin/users`, `/admin/buildings-rooms`, `/admin/allocation-rules`, `/admin/reports-audit`, `/admin/settings`                                    |

## MVP Feature Map

| Backlog                        | UI area                                                                                | Owner                          |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------ |
| `US-001` Login/RBAC            | `features/auth/login`, role layout/router                                              | Member 2 + Member 1            |
| `US-002` Consent               | `features/auth` or student application entry                                           | Member 2                       |
| `US-003` Application form      | `features/student/application`                                                         | Member 3                       |
| `US-004` Application status    | `features/student/application`, `features/student/room`                                | Member 3                       |
| `US-005` Staff review          | `features/staff/applications`                                                          | Member 5                       |
| `US-006` Room/bed ledger       | `features/admin/buildings_rooms`, `features/staff/allocation`, `features/student/room` | Member 7 + Member 5 + Member 3 |
| `US-008` Assignment suggestion | `features/staff/allocation`                                                            | Member 5                       |
| `US-009` Override reason       | `features/staff/allocation`                                                            | Member 5                       |
| `US-010` Check-in/out          | `features/staff/checkin_checkout`                                                      | Member 5                       |
| `US-011` Maintenance ticket    | `features/student/tickets`                                                             | Member 4                       |
| `US-012` SLA board             | `features/staff/maintenance`                                                           | Member 6                       |
| `US-013` Confirm/reopen        | `features/student/tickets`, `features/staff/maintenance`                               | Member 4 + Member 6            |
| `US-014` Operations dashboard  | `features/staff/dashboard`, `features/admin/dashboard`                                 | Member 5 + Member 7            |

## DB/View Reference Map

| Table/View               | Feature owner                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `profiles`               | `auth/profile`, `admin/users`, `staff/residents`                                     |
| `semesters`              | `admin/settings`, `student/application`, `staff/applications`                        |
| `buildings`, `rooms`     | `admin/buildings_rooms`, `staff/allocation`, `student/room`                          |
| `room_assets`            | `admin/buildings_rooms`, `staff/checkin_checkout`, `student/room`, `student/tickets` |
| `staff_shifts`           | `staff/tasks`, `staff/dashboard`                                                     |
| `applications`           | `student/application`, `staff/applications`, `staff/allocation`                      |
| `student_rooms`          | `staff/checkin_checkout`, `student/room`, `staff/residents`                          |
| `maintenance_tickets`    | `student/tickets`, `staff/maintenance`, `staff/dashboard`                            |
| `invoices`               | `student/invoices`, `staff/billing`                                                  |
| `student_requests`       | `student/requests`, `staff/residents`                                                |
| `notifications`          | `student/notifications`, `admin/settings`                                            |
| `tasks`                  | `staff/tasks`, `admin/reports_audit`                                                 |
| `allocation_rules`       | `admin/allocation_rules`, `staff/allocation`                                         |
| `audit_logs`             | `admin/reports_audit`                                                                |
| `v_room_occupancy`       | `staff/allocation`, `admin/buildings_rooms`                                          |
| `v_student_current_room` | `student/room`, `staff/residents`                                                    |
| `v_student_roommates`    | `student/room`, `staff/residents`                                                    |
| `v_invoice_balance`      | `student/invoices`, `staff/billing`                                                  |
| `v_ticket_sla`           | `staff/maintenance`, `staff/dashboard`                                               |

## UI Reuse Rules

- Generic primitive: `src/components/ui`.
- Project reusable component used by 2+ features: `src/components/common`.
- Navigation component: `src/components/navigation`.
- Feature-specific component: beside the page in its feature folder.
- No large global barrel export. Import the file you need.

## Accessibility and UX Bar

- All interactive elements keyboard accessible.
- Icon-only actions need `aria-label`.
- Decorative lucide icons use `aria-hidden="true"`.
- Tables support horizontal overflow on mobile.
- Forms show label, required state, validation/error copy, and clear action.
- Empty/loading/error states are required for screens that display remote-like data.
- Dashboard KPI cards must connect to actionable lists.

## Build Quality Bar

Before merge or handoff:

```bash
npm run typecheck
npm run lint
npm run build
```

Notes:

- `npm run typecheck` uses `tsc -b --noEmit` so project references are checked like production build.
- shadcn files may produce React Refresh warnings when exporting variant helpers; warnings are acceptable unless they block CI.

## Future Backend Integration

When backend work opens, add layers instead of editing pages directly:

```text
src/features/<role>/<feature>/application
src/features/<role>/<feature>/domain
src/features/<role>/<feature>/data
src/data/datasources
src/data/repositories
```

Supabase/API clients belong in shared datasource infrastructure, not in page components.
