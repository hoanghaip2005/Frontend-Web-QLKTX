# Implementation Traceability Matrix

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-TRACE |
| Version | 1.0 |
| Status | Synced with implementation |
| Owner | Group 3 |
| Updated | 2026-07-03 |
| Source files | `docs/product-backlog.md`; `docs/prototype-spec.md`; `D:\QLKTX\Frontend-Web-QLKTX`; `D:\QLKTX\Backend-QLKTX` |

## Tóm tắt

Ma trận truy vết 13 Must story → màn hình React (route) → API endpoint → bằng chứng test (E2E-API 30 test + UI-flow có xác minh DB). Kèm trạng thái Should-have/Phase 2/Deferred và known gaps trung thực (dev-auth bypass, bed ledger dạng đếm). Dùng cho review DoD và chuẩn bị vấn đáp.

## Purpose

Bảng truy vết từ user story (Must Have MVP) tới màn hình React, endpoint API và bằng chứng kiểm thử. Dùng để review Definition of Done và chuẩn bị demo.

Chú thích test:

- **E2E-API**: script `e2e.mjs` chạy 26 test qua REST API trên môi trường local (docker postgres + seed), kết quả 26/26 pass.
- **UI-flow**: kiểm thử thủ công có kịch bản qua trình duyệt, xác minh dữ liệu persist vào PostgreSQL sau từng bước.

## Must-Have Stories (Release 1 - 74 SP)

| US | Nội dung | Màn hình (route) | API chính | Test |
| --- | --- | --- | --- | --- |
| US-001 | Login đúng role, RBAC | `/login` (chọn vai trò → đúng portal); `/admin/users` (RBAC, khóa tài khoản) | `GET /api/auth/me`; `PATCH /api/profiles/:id`; middleware `requireRole` | E2E-API: auth/me + 2 negative case 403; UI-flow: đăng nhập 3 role |
| US-002 | Thông báo xử lý dữ liệu cá nhân | `/student/application` bước Consent (bắt buộc trước form) | — (UI gate) | UI-flow: không qua được form khi chưa tick đồng ý |
| US-003 | SV tạo hồ sơ, nguyện vọng, minh chứng | `/student/application` bước Form (validate thiếu minh chứng) | `POST /api/applications` + `POST /:id/submit` | E2E-API + UI-flow: nộp hồ sơ, validate lỗi |
| US-004 | SV xem trạng thái, kết quả, phòng/giường | `/student/application` (timeline 5 bước + nút xác nhận giường); `/student/dashboard` | `GET /api/dashboard/student`; `GET /api/applications`; `POST /:id/confirm` | E2E-API: confirm → waiting_checkin; UI-flow: badge trạng thái + xác nhận giường |
| US-005 | Staff duyệt hồ sơ kèm lý do | `/staff/applications` (queue + chi tiết + duyệt/từ chối/bổ sung, lý do bắt buộc) | `POST /api/applications/:id/review` | E2E-API: approve; UI-flow: duyệt với lý do, persist `staff_note` |
| US-006 | Sổ tòa/tầng/phòng/giường | `/staff/allocation` tab Sổ phòng/giường (filter tòa + trạng thái); `/admin/buildings-rooms` | `GET /api/rooms` (+`v_room_occupancy`); `PATCH /api/rooms/:id` | E2E-API: rooms catalog; UI-flow: ledger + khóa bảo trì |
| US-008 | Gợi ý phòng/giường theo rule minh bạch | `/staff/allocation` (giường gợi ý + lý do + phương án khác) | `GET /api/applications/:id/suggestions` | E2E-API: suggestions trả reasons; UI-flow: hiển thị lý do rule |
| US-009 | Override kèm lý do | `/staff/allocation` modal Override (giường thay thế + lý do bắt buộc) | `POST /api/applications/:id/assign` với `override_reason` (audit severity high) | E2E-API: assign; UI-flow: modal override |
| US-010 | Check-in / check-out cập nhật sổ | `/staff/checkin-checkout` (check-in theo checklist; check-out kèm ghi chú); `/staff/residents` | `POST /api/applications/:id/check-in`; `POST /api/student-rooms/:id/checkout`; `GET /api/student-rooms` | E2E-API: check-in + checkout; UI-flow: checklist 4 mục → student_rooms active → checked_out |
| US-011 | SV tạo ticket kèm mô tả/mức khẩn | `/student/tickets` (form + mức khẩn cấp/SLA preview + ảnh mock) | `POST /api/tickets`; `POST /api/qr/scan` | E2E-API: create + QR scan; UI-flow: tạo ticket |
| US-012 | Phân loại, gán, đặt hạn SLA | `/staff/maintenance` (SLA board kanban 4 cột + gán tổ + ưu tiên→SLA) | `POST /api/tickets/:id/assign`; `PATCH /api/tickets/:id`; `POST /:id/status`; `v_ticket_sla` | E2E-API: assign + status; UI-flow: board + dialog gán |
| US-013 | SV xác nhận hoặc mở lại | `/student/tickets` (nút xác nhận / mở lại kèm lý do) | `POST /api/tickets/:id/confirm` (`accepted` true/false) | E2E-API: confirm + reopen; UI-flow: reopen với lý do |
| US-014 | Operations dashboard KPI hành động được | `/staff/dashboard`, `/admin/dashboard` (mỗi KPI link tới danh sách) | `GET /api/dashboard/staff`; `GET /api/reports/kpi` | E2E-API: KPI shape; UI-flow: KPI đọc từ DB |

## Should-Have trong MVP (might-have)

| US | Trạng thái | Ghi chú |
| --- | --- | --- |
| US-007 QR lookup | Một phần | Backend `POST /api/qr/scan` hoạt động (E2E-API pass); UI hiển thị ngữ cảnh QR khi tạo ticket. Màn quét QR chuyên dụng chưa làm — đúng phân loại might-have, không chặn MVP. |
| US-015 KPI drilldown | Đáp ứng cơ bản | Mọi KPI card link tới danh sách bản ghi tương ứng. |

## Phase 2 (draft/disabled trong UI)

| US | Màn hình draft | Ghi chú |
| --- | --- | --- |
| US-016/017 Fees & Debt | `/student/invoices`, `/staff/billing` | UI draft, action disabled; backend `/api/invoices` đã sẵn cho Phase 2. |
| US-018 Notification | `/student/notifications` | Inbox trong app hoạt động (đọc/đánh dấu đã đọc); push/email Phase 2. |
| US-019/020/021 Import/Audit/Export | `/admin/reports-audit`, `/admin/settings` | Audit log xem/lọc được; import/export disabled. |

## Deferred (US-022/023/024)

SIS sync, payment gateway, native mobile: không có trong UI/backend theo đúng release plan. Native mobile có repo riêng ngoài phạm vi tài liệu này.

## Known gaps / notes

- Supabase Auth thật chưa nối trên web; môi trường local dùng `DEV_AUTH_BYPASS` (chỉ dev).
- Sổ giường live mode hiển thị giường theo số lượng chiếm dụng (schema không có bảng bed riêng; `bed_code` nằm trên `student_rooms`).
- 2 bug backend phát hiện và sửa trong quá trình test: (1) tham số SQL suy 2 kiểu (`$2` enum vs text) ở review/status/checkout; (2) engine gợi ý so sánh mã giường thiếu chuẩn hóa prefix → gợi ý giường đã chiếm.
