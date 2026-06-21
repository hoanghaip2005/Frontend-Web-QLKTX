# Team Work Rules - QLKTX Web Frontend

## Mục tiêu phân công

Nhóm 7 người có thể code song song, ít conflict khi merge. Mỗi người sở hữu một vùng rõ ràng. Shared code đi qua Member 1 để tránh nhiều người cùng sửa root config, router, UI primitive hoặc dependency.

## Phân công 7 người

| Thành viên | Vai trò | Folder sở hữu | Công việc chính |
| --- | --- | --- | --- |
| Member 1 | Frontend base / UI system lead | `src/app`, `src/components`, `src/config`, `src/lib`, `src/styles`, root config, docs | App shell, router, layout, shared primitives, dependencies, docs/rules |
| Member 2 | Auth/shared | `src/features/auth` | Login UI, profile UI, role gate mock |
| Member 3 | Student core | `src/features/student/dashboard`, `src/features/student/application`, `src/features/student/room` | Trang chủ sinh viên, đăng ký KTX, phòng hiện tại |
| Member 4 | Student services | `src/features/student/tickets`, `src/features/student/invoices`, `src/features/student/requests`, `src/features/student/notifications` | Ticket sửa chữa, hóa đơn, yêu cầu, thông báo |
| Member 5 | Staff operations A | `src/features/staff/dashboard`, `src/features/staff/applications`, `src/features/staff/allocation`, `src/features/staff/checkin_checkout` | Dashboard staff, duyệt hồ sơ, phân phòng, check-in/out |
| Member 6 | Staff operations B | `src/features/staff/residents`, `src/features/staff/maintenance`, `src/features/staff/billing`, `src/features/staff/tasks` | Cư dân, sửa chữa, đối soát phí, ca trực/task |
| Member 7 | Admin | `src/features/admin` | Dashboard admin, RBAC, tòa/phòng, rules, reports/audit, settings |

## Rule tránh conflict

- Không sửa folder của thành viên khác nếu chưa thống nhất.
- Không tự thêm dependency. Nếu cần thư viện mới, ghi lý do và để Member 1 cập nhật `package.json`.
- Không tự sửa `src/app/router` để thêm route lớn. Gửi route request cho Member 1.
- Không sửa `src/components/ui` nếu không phải Member 1.
- Mỗi PR chỉ chạm một vùng ownership. Nếu cần shared UI, tách PR riêng.
- Không đổi tên route/folder đã chốt nếu không thông báo cả nhóm.
- Không đưa mock data riêng lẻ vào nhiều feature trùng nhau. Data dùng chung đặt ở `src/mocks/data`.

## Rule viết component

- Page chính đặt tên theo pattern `<Role><Feature>Page.tsx`, ví dụ `StudentDashboardPage.tsx`.
- Component chỉ dùng trong một feature đặt cạnh page, ví dụ `src/features/student/room/components/RoomAssetList.tsx`.
- Component dùng chung 2+ feature đặt trong `src/components/common` sau khi thống nhất.
- Primitive như Button, Card, Badge, Input, Table, Modal, Tabs, EmptyState, LoadingState đặt trong `src/components/ui`.

## Rule UI state

Mỗi màn nên có đủ trạng thái khi làm UI thật:

- Default/data state.
- Empty state.
- Loading state.
- Error state.
- Form validation state nếu có form.
- Mobile responsive state.

## Rule backend trong phase này

- Không import Supabase.
- Không gọi `fetch` tới API thật.
- Không lưu service key/env thật.
- Không hard-code RLS/security assumption trong component.
- Chỉ mô phỏng bằng mock data đủ để dựng UI.

## Quy trình làm việc đề xuất

1. Pull latest `main`.
2. Tạo branch theo pattern `member-x/<feature-name>`.
3. Chỉ sửa folder mình sở hữu.
4. Chạy `npm run typecheck`, `npm run lint`, `npm run build`.
5. Tạo PR, ghi rõ màn đã làm và ảnh preview nếu có.
6. Resolve conflict bằng cách giữ ownership rule, không tự overwrite code người khác.

## Definition of Ready cho một màn UI

- Có route hoặc page stub sẵn.
- Có owner rõ ràng.
- Có DB/view tham chiếu trong docs hoặc mock content.
- Có mô tả trạng thái UI cần dựng.

## Definition of Done cho một màn UI

- Render không blank page.
- Không console error.
- Responsive ở desktop và mobile.
- Dùng shared primitives khi phù hợp.
- Không thêm backend/Supabase code.
- Typecheck, lint và build pass.
