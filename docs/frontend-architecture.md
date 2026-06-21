# Frontend Architecture - QLKTX Web

## Mục tiêu

Repo `Frontend-Web-QLKTX` là web frontend React cho DormCare Hub / QLKTX. Giai đoạn hiện tại chỉ dựng UI để 7 thành viên làm song song. Backend, Supabase, real auth và API adapter chưa được triển khai.

Nguồn tham chiếu kiến trúc đến từ `D:\QLKTX\Frontend-QLKTX\docs` và skeleton Flutter hiện có. Phần React giữ cùng ý tưởng role-based feature ownership, nhưng đổi sang cấu trúc web frontend.

## Stack

| Layer | Quyết định |
| --- | --- |
| App framework | Vite + React + TypeScript |
| Routing | `react-router-dom` |
| Styling | Tailwind CSS |
| Icons | `lucide-react` |
| Utility class merge | `clsx`, `tailwind-merge` |
| Backend phase | Mock-only, chưa dùng Supabase |

## Cấu trúc thư mục

```text
src/
  app/
    router/       # route map, role routing
    providers/    # app-level providers
    layouts/      # role shell layouts
  components/
    ui/           # primitive UI: Button, Card, Input, Badge, Table, Modal, Tabs
    common/       # component dùng lại bởi 2+ feature
    navigation/   # sidebar/nav components
  config/         # app constants
  features/
    auth/         # login, profile, role gate mock
    student/      # student-facing modules
    staff/        # staff operations modules
    admin/        # admin governance modules
  lib/
    utils/        # pure helpers
  mocks/
    data/         # mock data for UI only
  styles/         # Tailwind entry and global CSS
  types/          # shared TS types
```

## Data boundary hiện tại

Trong phase frontend-only:

- Screen dùng mock data hoặc local state.
- Không gọi Supabase, REST API, RPC, storage hoặc auth thật.
- Không để SQL/table policy logic trong component.
- Không thêm `@supabase/supabase-js` cho tới phase backend integration.

Khi backend được mở sau này, data flow bắt buộc là:

```text
screens -> feature hooks/state -> repositories -> datasource -> Supabase/API
```

Screen không gọi datasource trực tiếp. Cách này giúp UI không bị đổi khi backend chuyển từ mock sang Supabase hoặc REST.

## Route map

| Role | Routes |
| --- | --- |
| Auth | `/login`, `/profile` |
| Student | `/student/dashboard`, `/student/application`, `/student/room`, `/student/tickets`, `/student/invoices`, `/student/requests`, `/student/notifications` |
| Staff | `/staff/dashboard`, `/staff/applications`, `/staff/allocation`, `/staff/checkin-checkout`, `/staff/residents`, `/staff/maintenance`, `/staff/billing`, `/staff/tasks` |
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/buildings-rooms`, `/admin/allocation-rules`, `/admin/reports-audit`, `/admin/settings` |

## Feature map theo DB/schema docs

| Table/View | Feature owner |
| --- | --- |
| `profiles` | `auth/profile`, `admin/users`, `staff/residents` |
| `semesters` | `admin/settings`, `student/application`, `staff/applications` |
| `buildings`, `rooms` | `admin/buildings_rooms`, `staff/allocation`, `student/room` |
| `room_assets` | `admin/buildings_rooms`, `staff/checkin_checkout`, `student/room`, `student/tickets` |
| `staff_shifts` | `staff/tasks`, `staff/dashboard` |
| `applications` | `student/application`, `staff/applications`, `staff/allocation` |
| `student_rooms` | `staff/checkin_checkout`, `student/room`, `staff/residents` |
| `maintenance_tickets` | `student/tickets`, `staff/maintenance`, `staff/dashboard` |
| `invoices` | `student/invoices`, `staff/billing` |
| `student_requests` | `student/requests`, `staff/residents` |
| `notifications` | `student/notifications`, `admin/settings` |
| `tasks` | `staff/tasks`, `admin/reports_audit` |
| `allocation_rules` | `admin/allocation_rules`, `staff/allocation` |
| `audit_logs` | `admin/reports_audit` |
| `v_room_occupancy` | `staff/allocation`, `admin/buildings_rooms` |
| `v_student_current_room` | `student/room`, `staff/residents` |
| `v_student_roommates` | `student/room`, `staff/residents` |
| `v_invoice_balance` | `student/invoices`, `staff/billing` |
| `v_ticket_sla` | `staff/maintenance`, `staff/dashboard` |

## UI reuse rule

- Primitive generic để trong `src/components/ui`.
- Component có nghiệp vụ feature để trong chính feature đó.
- Component được ít nhất 2 feature dùng thì đề xuất chuyển vào `src/components/common`.
- Không tạo global barrel export lớn. Feature tự import trực tiếp file cần dùng.

## Future backend integration

Khi bắt đầu Supabase/backend, tạo lớp mới thay vì sửa screen trực tiếp:

```text
src/features/<role>/<feature>/application
src/features/<role>/<feature>/domain
src/features/<role>/<feature>/data
src/data/datasources
src/data/repositories
```

Supabase client nếu có sẽ đặt ở shared datasource layer, không đặt trong page component.
