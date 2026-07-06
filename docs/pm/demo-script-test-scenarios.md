# Demo Script & Test Scenarios

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-DEMO |
| Version | 1.0 |
| Status | Ready for demo/UAT |
| Owner | Group 3 |
| Updated | 2026-07-06 |
| Môi trường | Frontend local `http://localhost:5173` → Backend Azure `https://qlktx-backend-2302700155.azurewebsites.net` (Supabase production) |

## Tài khoản demo

| Vai | Tài khoản | Mật khẩu | Vào portal |
| --- | --- | --- | --- |
| Sinh viên | `student@edu.vn` | `123456` | `/student/dashboard` |
| Nhân viên KTX | `staff@edu.vn` | `123456` | `/staff/dashboard` |
| Quản trị | `admin@edu.vn` | `123456` | `/admin/dashboard` |

Mẹo demo 2-3 vai cùng lúc: mở mỗi vai một **cửa sổ ẩn danh riêng** (session lưu theo trình duyệt).

---

## Kịch bản 1 - Vòng đời hồ sơ ở KTX (SV ↔ Staff, ~7 phút)

Câu chuyện: tân sinh viên nộp hồ sơ, ban quản lý duyệt và phân giường bằng rule engine, sinh viên xác nhận, check-in nhận phòng.

| # | Vai | Thao tác | Kết quả mong đợi (điểm cần chỉ cho người xem) |
| --- | --- | --- | --- |
| 1 | SV | Đăng nhập → menu **Đăng ký ở KTX** | Nếu chưa có hồ sơ: bước 1 là **đồng ý xử lý dữ liệu cá nhân** — không tick không đi tiếp được (US-002, không phải form thường) |
| 2 | SV | Điền nguyện vọng, bấm Nộp **khi chưa tải minh chứng** | Bị chặn với thông báo thiếu minh chứng → tải minh chứng → nộp thành công, trạng thái **Chờ duyệt** |
| 3 | Staff | **Duyệt hồ sơ** → mở chi tiết → bấm Duyệt **để trống lý do** | Nút xác nhận **disabled** — lý do là bắt buộc (audit-first). Nhập lý do → hồ sơ sang **Đã duyệt** |
| 4 | Staff | **Phân phòng** → chọn hồ sơ vừa duyệt | Hệ thống **gợi ý giường kèm danh sách lý do rule** (đúng giới tính, còn chỗ, cùng khóa...) + các phương án khác và điểm số — đây là rule engine, không phải dropdown chọn tay |
| 5 | Staff | Thử **Override** thay vì nhận gợi ý | Modal bắt chọn giường thay thế **và lý do** — override được ghi audit mức cao |
| 6 | SV | Quay lại **Đăng ký ở KTX** (refresh) | Timeline nhảy bước, hiện nút **"Xác nhận nhận giường"** kèm mã giường → bấm xác nhận → trạng thái **Chờ check-in** |
| 7 | Staff | **Check-in/out** → hồ sơ xuất hiện ở hàng chờ → Check-in | Dialog **checklist 4 mục bàn giao** — chưa tick đủ không xác nhận được. Xong: hồ sơ **Đã check-in**, sinh viên xuất hiện ở panel "Đang lưu trú" |
| 8 | SV | Mở **Phòng hiện tại** | Thấy phòng/giường thật + danh sách bạn cùng phòng từ database |

> Điểm nhấn: đây là **máy trạng thái 8 bước có guard** (`draft → submitted → approved → suggested → waiting_checkin → checked_in`), mỗi chuyển trạng thái bị backend kiểm tra — không phải update field tự do.

## Kịch bản 2 - Sự cố & SLA với vòng lặp reopen (SV ↔ Staff, ~5 phút)

Câu chuyện: quạt phòng hỏng, sửa lần 1 không đạt, sinh viên mở lại, sửa lần 2 mới xong.

| # | Vai | Thao tác | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | SV | **Báo sửa chữa** → tạo ticket, chọn mức **Khẩn cấp** | Form hiện **SLA preview theo mức ưu tiên** (12h/24h/48h/72h); mô tả trống thì bị chặn |
| 2 | Staff | **Sửa chữa** (SLA board) → cột "Mới" có ticket → **Phân loại & gán** | Chọn ưu tiên là hệ thống **tự đặt hạn SLA**; gán tổ bảo trì; ticket nhảy sang cột "Đang xử lý" |
| 3 | Staff | **Đánh dấu đã xử lý** (bắt buộc ghi chú kết quả) | Ticket sang "Chờ xác nhận" — staff không tự đóng được, phải chờ sinh viên |
| 4 | SV | Vào ticket → bấm **"Chưa được, mở lại"** + nhập lý do | Ticket quay lại board staff ở cột **"Bị mở lại"** — vòng lặp chất lượng, lý do lưu vào lịch sử |
| 5 | Staff → SV | Gán lại → xử lý → SV **Xác nhận đã sửa xong** | Ticket **Đã đóng**; toàn bộ timeline sự kiện xem được trên ticket |
| 6 | Cả hai | Nhìn ticket có hạn SLA đã qua | Badge **Quá hạn** đỏ — trạng thái này **tính runtime từ giờ hệ thống**, không phải cột lưu sẵn |

## Kịch bản 3 - Quản trị ảnh hưởng trực tiếp nghiệp vụ (Admin ↔ Staff, ~5 phút)

Câu chuyện: quyết định của admin thay đổi hành vi rule engine và phạm vi truy cập ngay lập tức.

| # | Vai | Thao tác | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Admin | **Tòa/Phòng** → khóa bảo trì một phòng còn trống (nhập lý do) | Phòng sang **Khóa bảo trì** |
| 2 | Staff | Mở **Phân phòng** → xem gợi ý cho một hồ sơ | Phòng vừa khóa **biến mất khỏi gợi ý** — rule `not_maintenance` là rule bắt buộc |
| 3 | Admin | **Luật phân phòng** → thử tắt rule Bắt buộc | Không có nút tắt ("Không thể tắt"); tắt rule **Ưu tiên** thì bắt buộc nhập lý do |
| 4 | Admin | **User/RBAC** → khóa một tài khoản (nhập lý do) | Tài khoản sang **Đã khóa**; tài khoản đó đăng nhập sẽ bị chặn |
| 5 | Admin | **Báo cáo/Audit** | Mọi thao tác nhạy cảm vừa làm (duyệt, override, khóa phòng, khóa user, đổi rule) **đều có dòng audit** kèm người thực hiện + lý do |
| 6 | Admin | Mở lại khóa bảo trì phòng (dọn hiện trường demo) | Phòng quay lại gợi ý của staff |

---

## Tình huống test (negative & edge cases)

Dùng để kiểm thử có chủ đích hoặc trả lời chất vấn "hệ thống có chặn không?".

| # | Tình huống | Cách tạo | Kết quả đúng |
| --- | --- | --- | --- |
| T1 | Sinh viên gõ thẳng URL trang staff | Đăng nhập SV → gõ `/staff/applications` | UI không có menu; API trả **403** — dữ liệu staff không tải được (RBAC chặn server-side, đã có E2E test) |
| T2 | Đăng nhập email ngoài trường | `abc@gmail.com` + mật khẩu bất kỳ | Bị từ chối: chỉ chấp nhận email `edu.vn` |
| T3 | Sai mật khẩu | `student@edu.vn` + `sai123` | "Invalid account or password", không lộ tài khoản tồn tại hay không |
| T4 | Nộp hồ sơ thiếu minh chứng / thiếu nguyện vọng | Bỏ trống rồi bấm Nộp | Chặn kèm thông báo cụ thể từng lỗi |
| T5 | Duyệt/từ chối/override/check-out **không nhập lý do** | Để trống textarea | Nút xác nhận disabled — không ghi được thao tác nhạy cảm thiếu lý do |
| T6 | Phân giường vào giường đã có người | Override và gõ tay mã giường đang chiếm | Backend trả **"Bed is already occupied"** — UI hiện lỗi, không ghi đè (chính là bug đã bắt được và fix bằng test) |
| T7 | Check-in khi sinh viên chưa xác nhận giường | Hồ sơ ở trạng thái "Đã gợi ý phòng" | Không có nút Check-in, chỉ ghi "Chờ SV xác nhận" — không nhảy cóc trạng thái |
| T8 | Checklist check-in tick thiếu 1 mục | Tick 3/4 | Nút xác nhận disabled |
| T9 | Check-out xong, sinh viên xem phòng | Staff check-out → SV mở "Phòng hiện tại" | Hiện trạng thái **chưa có phòng** (bản ghi lưu trú đã đóng), không còn dữ liệu cũ |
| T10 | SV quét/tra tài sản phòng không phải của mình | Gọi QR asset phòng khác | Backend chặn "not in your active room" (đã có E2E test) |
| T11 | Ticket đã đóng, SV mở lại lần nữa | Vào ticket closed | Không còn nút reopen — chỉ reopen được khi đang "Chờ xác nhận" |
| T12 | Mất mạng / backend lỗi giữa chừng | Tắt mạng rồi thao tác | Trang hiện Alert lỗi + nút **Thử lại**, không trắng trang |
| T13 | Hai staff cùng phân giường một hồ sơ | 2 cửa sổ staff cùng assign | Người sau bị chặn nếu giường đã chiếm; trạng thái cuối theo lần ghi hợp lệ cuối |
| T14 | Refresh giữa flow | F5 ở bất kỳ bước nào | Trạng thái đọc lại từ database, không mất bước (không phụ thuộc state trình duyệt) |

---

## Vì sao hệ thống không chỉ là CRUD (dùng khi thuyết trình/chất vấn)

1. **Máy trạng thái có guard 2 chiều**: hồ sơ 8 trạng thái, ticket 7 trạng thái với vòng lặp reopen — backend từ chối chuyển trạng thái sai thứ tự (T7, T11), UI chỉ hiện action hợp lệ theo trạng thái.
2. **Rule engine giải thích được** (US-008): gợi ý giường tính điểm theo bộ rule bật/tắt được trong admin, trả về **lý do từng ứng viên** — thay đổi cấu hình admin đổi ngay kết quả nghiệp vụ (Kịch bản 3).
3. **SLA là dữ liệu suy diễn runtime**: hạn xử lý đặt theo mức ưu tiên, trạng thái quá hạn tính từ thời gian thực qua view `v_ticket_sla`, không phải flag lưu tay.
4. **RBAC thực thi ở server**: mỗi endpoint kiểm tra role; các negative case (SV gọi API staff/admin → 403) nằm trong bộ E2E 30 test tự động.
5. **Audit-first cho thao tác nhạy cảm**: duyệt/từ chối, override, khóa phòng, đổi rule, khóa tài khoản, check-out — tất cả **bắt buộc lý do** và ghi `audit_logs` kèm actor, xem được ở Báo cáo/Audit.
6. **Toàn bộ chạy trên hạ tầng thật**: Azure App Service + Supabase PostgreSQL, login thật theo email trường, CI deploy từ GitHub — không phải demo mock.

## Checklist trước giờ demo

- [ ] `https://qlktx-backend-2302700155.azurewebsites.net/health` trả `"ok"` (App Service free tier có thể ngủ — mở trước 2 phút).
- [ ] Đăng nhập thử 3 tài khoản demo.
- [ ] Có sẵn 1 hồ sơ ở trạng thái "Chờ duyệt" và 1 ticket "Mới" (nếu đã dùng hết, đóng vai SV tạo lại — mất 1 phút).
- [ ] Mở sẵn 2-3 cửa sổ ẩn danh cho từng vai.
