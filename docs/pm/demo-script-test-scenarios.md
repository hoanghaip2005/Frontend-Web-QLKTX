# Demo Script & Test Scenarios

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-DEMO |
| Version | 1.0 |
| Status | Ready for demo/UAT |
| Owner | Group 3 |
| Updated | 2026-07-06 |
| Môi trường | Frontend local `http://localhost:5173` -> Backend Azure `https://qlktx-backend-2302700155.azurewebsites.net` |

## Tóm tắt

Kịch bản demo gồm 3 hồi: vòng đời hồ sơ KTX, ticket sửa chữa theo SLA, và admin governance. Mục tiêu là chứng minh hệ thống không chỉ là CRUD: có state machine, guard backend, rule engine giải thích được, SLA runtime, RBAC server-side và audit-first. Bộ test kèm 14 tình huống negative/edge để trả lời câu hỏi "hệ thống có chặn không?".

## Tài khoản demo

| Vai | Tài khoản | Mật khẩu | Vào portal |
| --- | --- | --- | --- |
| Sinh viên | `student@edu.vn` | `123456` | `/student/dashboard` |
| Nhân viên KTX | `staff@edu.vn` | `123456` | `/staff/dashboard` |
| Quản trị | `admin@edu.vn` | `123456` | `/admin/dashboard` |

Mẹo demo 2-3 vai cùng lúc: mở mỗi vai một cửa sổ ẩn danh riêng vì session lưu theo trình duyệt.

## Kịch bản 1 - Vòng đời hồ sơ KTX

Câu chuyện: sinh viên nộp hồ sơ, staff duyệt, hệ thống gợi ý giường bằng rule engine, sinh viên xác nhận, staff check-in.

| # | Vai | Thao tác | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | SV | Đăng nhập -> menu Đăng ký ở KTX | Nếu chưa có hồ sơ thì bước đầu là đồng ý xử lý dữ liệu cá nhân; không tick thì không đi tiếp được. |
| 2 | SV | Điền form, bấm Nộp khi thiếu minh chứng | Bị chặn với thông báo thiếu minh chứng; tải minh chứng rồi nộp thành công, trạng thái Chờ duyệt. |
| 3 | Staff | Mở Duyệt hồ sơ, bấm duyệt nhưng để trống lý do | Nút xác nhận disabled; lý do là bắt buộc cho thao tác nhạy cảm. |
| 4 | Staff | Nhập lý do và duyệt | Hồ sơ sang Đã duyệt, lưu staff note/audit. |
| 5 | Staff | Mở Phân phòng cho hồ sơ vừa duyệt | Hệ thống gợi ý giường kèm reason codes và phương án thay thế. |
| 6 | Staff | Thử Override | Modal bắt chọn giường thay thế và nhập lý do override. |
| 7 | SV | Refresh Đăng ký ở KTX | Timeline nhảy bước, hiện nút Xác nhận nhận giường. |
| 8 | Staff | Check-in | Checklist bàn giao bắt buộc; xong thì ledger chuyển sinh viên sang đang lưu trú. |

Điểm nhấn: đây là state machine có guard (`draft -> submitted -> approved -> suggested -> waiting_checkin -> checked_in`), không phải update field tự do.

## Kịch bản 2 - Sự cố & SLA với vòng lặp reopen

Câu chuyện: quạt phòng hỏng, sửa lần đầu chưa đạt, sinh viên mở lại, sửa lần hai mới đóng.

| # | Vai | Thao tác | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | SV | Tạo ticket sửa chữa, chọn mức khẩn cấp | Form hiện SLA preview theo ưu tiên; mô tả trống bị chặn. |
| 2 | Staff | SLA board -> Phân loại & gán | Chọn priority thì hệ thống đặt due time; ticket sang đang xử lý. |
| 3 | Staff | Đánh dấu đã xử lý | Ticket sang Chờ xác nhận; staff không tự đóng thay sinh viên. |
| 4 | SV | Bấm Chưa được, mở lại + nhập lý do | Ticket quay lại board staff ở trạng thái reopened, lý do lưu vào history. |
| 5 | Staff -> SV | Xử lý lại -> SV xác nhận đã sửa xong | Ticket đóng, timeline đủ sự kiện. |
| 6 | Cả hai | Xem ticket quá hạn | Badge Quá hạn tính runtime từ due time, không phải flag nhập tay. |

## Kịch bản 3 - Admin governance ảnh hưởng nghiệp vụ

Câu chuyện: admin thay đổi cấu hình, kết quả gợi ý và quyền truy cập thay đổi ngay.

| # | Vai | Thao tác | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Admin | Tòa/Phòng -> khóa bảo trì một phòng còn trống | Phòng sang Khóa bảo trì, bắt buộc nhập lý do. |
| 2 | Staff | Chạy lại gợi ý phân phòng | Phòng vừa khóa biến mất khỏi suggestion vì rule `not_maintenance`. |
| 3 | Admin | Luật phân phòng -> thử tắt rule bắt buộc | Rule bắt buộc không cho tắt; rule ưu tiên nếu tắt phải có lý do. |
| 4 | Admin | User/RBAC -> khóa tài khoản | Tài khoản sang Đã khóa; đăng nhập sẽ bị chặn. |
| 5 | Admin | Báo cáo/Audit | Thao tác nhạy cảm có actor, action, timestamp, reason. |

## Tình huống test negative & edge

| # | Tình huống | Kết quả đúng |
| --- | --- | --- |
| T1 | Sinh viên gõ thẳng URL staff/admin | UI không có menu; API trả 403. |
| T2 | Đăng nhập email ngoài trường | Bị từ chối, không vào portal. |
| T3 | Sai mật khẩu | Báo lỗi chung, không lộ tài khoản tồn tại hay không. |
| T4 | Nộp hồ sơ thiếu minh chứng/nguyện vọng | Chặn với thông báo cụ thể. |
| T5 | Duyệt/reject/override/check-out không có lý do | Nút xác nhận disabled hoặc API từ chối. |
| T6 | Phân giường vào giường đã có người | Backend trả lỗi, không ghi đè. |
| T7 | Check-in khi sinh viên chưa xác nhận giường | Không có action check-in hợp lệ. |
| T8 | Checklist check-in thiếu mục | Không xác nhận được. |
| T9 | Check-out xong, sinh viên xem phòng | Hiện chưa có phòng đang ở. |
| T10 | Sinh viên scan tài sản phòng khác | Backend chặn vì không thuộc phòng active. |
| T11 | Ticket đã đóng nhưng sinh viên reopen lại | Không còn nút reopen. |
| T12 | Backend lỗi/mất mạng | UI hiện alert lỗi và nút thử lại, không trắng trang. |
| T13 | Hai staff cùng assign một giường | Người sau bị chặn nếu giường đã bị chiếm. |
| T14 | Refresh giữa flow | Trạng thái đọc lại từ database, không mất bước. |

## Vì sao hệ thống không chỉ là CRUD

1. State machine có guard cho hồ sơ và ticket.
2. Rule engine trả reason codes và disqualified options.
3. SLA được tính runtime từ priority/due time.
4. RBAC thực thi ở server, không chỉ ẩn menu ở UI.
5. Audit-first cho thao tác nhạy cảm.
6. Demo có thể chạy với backend/database thật, không chỉ mock.

## Checklist trước giờ demo

- Mở `/health` của backend trước demo 2 phút để tránh cold start.
- Đăng nhập thử 3 tài khoản demo.
- Chuẩn bị sẵn 1 hồ sơ chờ duyệt và 1 ticket mới.
- Mở sẵn 2-3 cửa sổ ẩn danh cho từng vai.
- Chuẩn bị video fallback nếu mạng hoặc Azure free tier chậm.
