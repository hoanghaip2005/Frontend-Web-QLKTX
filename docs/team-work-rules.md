# Team Work Rules - QLKTX Web Frontend

## Mục tiêu

Nhóm 7 người code song song trong `Frontend-Web-QLKTX` nhưng vẫn giữ route, shared UI, mock data và docs đồng bộ. Repo này đang ở phase dựng UI web-responsive bằng mock data, bám MVP trong `docs/pm/`.

## Root Rule

`D:\QLKTX\AGENTS.md` và `D:\QLKTX\TEAM_ASSIGNMENT.md` là nguồn quy tắc gốc cho đồng bộ Jira, Figma, docs, backend, frontend và harness. File này chỉ là bản web-repo local; nếu có mâu thuẫn thì root rule thắng.

Feature members không cần clone hoặc đọc trực tiếp folder `D:\NGONGOCDANGKHOA\docs` khi làm task hằng ngày. Member 1/PM dùng folder đó như upstream source rồi refresh snapshot trong `docs/pm/` khi cần.

## Source of Truth

| Nguồn                                                | Dùng để                                             |
| ---------------------------------------------------- | --------------------------------------------------- |
| `docs/pm/project-overview.md`                       | MVP boundary, user groups, risks                    |
| `docs/pm/product-backlog.md`                        | User story, priority, sprint target                 |
| `docs/pm/prototype-spec.md`                         | Screen list, flow, sample data, acceptance criteria |
| `docs/pm/definition-of-done.md`                     | Quality bar và evidence checklist                   |
| `docs/pm/release-plan-fixed-date.md`                | 4 sprint MVP scope guardrail                        |
| `docs/frontend-architecture.md`                      | Cấu trúc repo web, route map, data boundary         |
| `AGENTS.md`                                          | Quy tắc cho agent/AI khi sửa code                   |

Daily working contract cho members 2-7: đọc `docs/frontend-architecture.md`, `docs/team-work-rules.md`, `README.md`, folder feature mình sở hữu, và file liên quan trong `docs/pm/` khi task cần backlog/prototype/DoD chi tiết. Không cần truy cập `D:\NGONGOCDANGKHOA\docs`.

Nếu docs mâu thuẫn và cần quyết định scope, ưu tiên theo thứ tự: `docs/pm/` -> `docs/frontend-architecture.md` -> `AGENTS.md` -> code hiện tại. Nếu cần kiểm chứng upstream, Member 1/PM đối chiếu `D:\NGONGOCDANGKHOA\docs`, rồi cập nhật lại `docs/pm/` và docs local.

## Phase Hiện Tại

- Chỉ build frontend UI bằng Vite + React + TypeScript + Tailwind CSS.
- Dùng shadcn components trong `src/components/ui`.
- Icon dùng `lucide-react`.
- Dữ liệu dùng mock-only trong `src/mocks/data` hoặc local constants.
- Chưa dùng Supabase, REST API thật, real auth, payment gateway, SIS sync, database migration, native mobile.

## Phân Công 7 Thành Viên

| Member   | Vai trò                        | Folder sở hữu                                                                                                                             | User stories / scope chính                                                                                                   |
| -------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Member 1 | Frontend base / UI system lead | `src/app`, `src/components`, `src/config`, `src/lib`, `src/styles`, root config, docs                                                     | App shell, router, role layout, shadcn setup, lucide icon standard, shared primitives, dependency review, mock content shape |
| Member 2 | Auth/shared access             | `src/features/auth`                                                                                                                       | `US-001`, `US-002`: login, profile, role gate mock, consent/privacy notice                                                   |
| Member 3 | Student core                   | `src/features/student/dashboard`, `src/features/student/application`, `src/features/student/room`                                         | `US-003`, `US-004`, student-facing part of `US-006`: dashboard, application form/status, current room/bed                    |
| Member 4 | Student services               | `src/features/student/tickets`, `src/features/student/invoices`, `src/features/student/requests`, `src/features/student/notifications`    | `US-011`, `US-013`, Phase 2 UI drafts: ticket creation, confirm/reopen, invoices, requests, notifications                    |
| Member 5 | Staff operations A             | `src/features/staff/dashboard`, `src/features/staff/applications`, `src/features/staff/allocation`, `src/features/staff/checkin_checkout` | `US-005`, `US-008`, `US-009`, `US-010`, staff dashboard shell: review, assignment, override, check-in/out                    |
| Member 6 | Staff operations B             | `src/features/staff/residents`, `src/features/staff/maintenance`, `src/features/staff/billing`, `src/features/staff/tasks`                | `US-012`, staff support flows: residents, SLA board, billing draft, staff tasks                                              |
| Member 7 | Admin                          | `src/features/admin`                                                                                                                      | Admin dashboard, users/RBAC, buildings/rooms, allocation rules, reports/audit, settings                                      |

## Member 1 Checklist

- Maintain route constants and role layout.
- Maintain `src/components/ui` shadcn primitives.
- Add new shadcn components only through the local CLI:

```bash
node ./node_modules/shadcn/dist/index.js add <component> --yes
```

- Approve new dependencies and update `package.json`, `package-lock.json`, README/docs.
- Keep `components.json`, `tailwind.config.ts`, `src/styles/index.css`, and `src/lib/utils.ts` in sync with shadcn.
- Keep shared mock data stable enough for other members to build screens.

## Feature Member Checklist

- Work only inside your owned folders.
- Use shared `ModulePage`, `MetricCard`, navigation, and `src/components/ui` primitives when enough.
- Put feature-only components beside the page, e.g. `src/features/student/room/components/RoomAssetList.tsx`.
- Move reusable components to `src/components/common` only after at least 2 features need them and Member 1 agrees.
- Do not edit router/shared components directly. Request Member 1 to add route/shared primitive changes.

## UI Build Rules

- Use operational SaaS style: dense, readable, restrained, no landing-page hero.
- Each page needs realistic sample data related to rooms, beds, applications, tickets, invoices, SLA, or dashboard KPIs.
- Use shadcn components for buttons, forms, dialogs, tables, tabs, badges, cards, skeletons, selects, checkboxes.
- Use lucide icons only. Put icons inside buttons/nav where helpful.
- Button/icon-only controls need `aria-label` or visible text.
- Tables must handle mobile overflow.
- Forms must show required fields, validation states, and clear submit/review actions.
- Dashboards must show actionable KPI cards and linked record lists.
- Assignment override UI must require a reason.

## Backend/Data Rules Trong Phase Này

- Không import Supabase.
- Không gọi `fetch` tới API thật.
- Không thêm `.env` thật hoặc secret.
- Không hard-code RLS/security policy trong component.
- Không tự tạo repository/datasource layer trước thời điểm backend integration.
- Mock data dùng chung đặt ở `src/mocks/data` để tránh mỗi feature một kiểu data.

## Quy Trình Làm Việc

1. Pull/update code mới nhất.
2. Chọn task đúng folder ownership.
3. Tạo branch theo pattern `member-x/<feature-name>`.
4. Build screen với mock data và shared UI.
5. Chạy kiểm tra:

```bash
npm run typecheck
npm run lint
npm run build
```

6. Tạo PR hoặc handoff note gồm: màn đã làm, file đã sửa, trạng thái UI, lệnh đã chạy, screenshot/preview nếu có.
7. Không tự resolve conflict bằng cách overwrite code của member khác.

## Definition of Ready Cho Một Màn UI

- Route hoặc page stub đã tồn tại.
- Owner rõ ràng theo bảng phân công.
- Có backlog/prototype reference hoặc mô tả flow rõ.
- Có mock data tối thiểu.
- Biết screen cần trạng thái nào: default, loading, empty, error, validation, mobile.

## Definition of Done Cho Một Màn UI

- Page render không blank.
- Không console error rõ ràng.
- Responsive ở mobile và desktop.
- Dùng shadcn primitives và lucide icons.
- Không thêm backend/Supabase/API thật.
- Có state UI phù hợp.
- Có text/sample data thực tế, không dùng lorem ipsum.
- `npm run typecheck` pass.
- `npm run lint` không có error. Warning shadcn fast-refresh helper có thể chấp nhận nếu chưa tách variant helpers.
- `npm run build` pass.

## Merge Conflict Rules

- Không sửa folder member khác nếu chưa thống nhất.
- Không sửa `src/app/router` để tự thêm route lớn.
- Không sửa `src/components/ui` nếu không phải Member 1.
- Không đổi tên route/folder đã chốt nếu chưa báo nhóm.
- Không thêm dependency vì một màn riêng lẻ nếu có thể dùng shadcn/Tailwind hiện có.

## MVP Guardrail

Protect Release 1 MVP: login/RBAC/consent, application/status/review, room-bed ledger, assignment suggestion/override, check-in/out, maintenance/SLA, operations dashboard.

Phase 2 items như fees/debt, notifications, import/export, audit export, SIS sync, payment gateway, native mobile chỉ dựng UI draft khi không ảnh hưởng Must Have scope.
