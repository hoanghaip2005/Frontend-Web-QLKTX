# DormCare Hub / QLKTX - Nội Dung Render 45 Slide

| Field | Value |
| --- | --- |
| Project | DormCare Hub / QLKTX |
| Document ID | DCH-PMO-RENDER-45 |
| Purpose | Nội dung chữ trên từng slide để dựng ảnh/PPT bằng GPT Plus |
| Format | 45 slide, mỗi slide gồm tiêu đề, nội dung hiển thị, thông điệp chốt |
| Updated | 2026-07-07 |

## Cách Dùng File Này

- Mỗi slide bên dưới là một khối nội dung hoàn chỉnh để chuyển thành ảnh trực quan.
- Trọng tâm là chữ hiển thị trên slide: tiêu đề, luận điểm, số liệu, bảng, kết luận.
- Không đưa toàn bộ câu chữ lên slide nếu thiết kế bị chật; ưu tiên giữ số liệu, keyword, bảng chính.
- Workflow deck: Product/khách hàng -> feasibility/core/business -> backlog/DoD/PoC/demo readiness -> nhân sự -> tiến độ/vận hành -> rủi ro A/B -> storyboard/demo.
- Phân bổ nói: TV1 slide 01-06, TV2 slide 07-13, TV3 slide 14-21, TV4 slide 22-27, TV5 slide 28-33, TV6 slide 34-39, TV7 slide 40-45.

---

## Slide 01 - Cover

**Tiêu đề:** DormCare Hub / QLKTX  
**Nội dung hiển thị:**

- Báo cáo tiến độ tuần 10 - Group 3
- Sản phẩm: hệ thống quản lý ký túc xá web-responsive
- Luồng giá trị: Hồ sơ -> Duyệt -> Phân phòng -> Check-in/out -> Ticket SLA -> Dashboard
- Trọng tâm báo cáo: khách hàng cần gì, nhóm đã triển khai đến đâu, rủi ro còn gì, demo đã đủ dùng chưa
- Mốc cập nhật: 07/07/2026
- Kết luận mở đầu: MVP đã đủ dùng cho demo/first release, chưa gọi là production-ready cho pilot thật

**Thông điệp chốt:** DormCare Hub không chỉ là bộ màn hình CRUD; đây là một flow vận hành KTX có rule, SLA, RBAC và audit.

---

## Slide 02 - Lộ Trình Trình Bày

**Tiêu đề:** Workflow trình bày theo yêu cầu thầy  
**Nội dung hiển thị:**

| Phần | Nội dung | Câu hỏi cần trả lời |
| --- | --- | --- |
| 1 | Tóm tắt dự án dưới góc nhìn khách hàng | Sản phẩm là gì, giải quyết đau điểm nào, có đúng báo cáo khả thi không? |
| 2 | Nhân sự & phân công | 7 thành viên chia ownership ra sao, tracking từng người thế nào? |
| 3 | Tiến độ & vận hành | Dự án sớm/trễ/đúng tiến độ, vận hành đã OK chưa, thiếu gì? |
| 4 | Rủi ro & storyboard | Hướng A/B rủi ro gì, nhóm chọn hướng nào, user flow ra sao? |
| 5 | Demo readiness | Demo hiện tại đủ dùng chưa, chứng minh bằng flow nào? |

- Deck gồm 45 slide, đủ cho 7 người thuyết trình.
- Mỗi người phụ trách 6-7 slide theo cụm nội dung, tránh nói trùng.
- Slide đi từ business/customer trước, kỹ thuật và demo đặt sau để không loãng.

**Thông điệp chốt:** Cấu trúc bám đúng đề, nhưng kể theo logic sản phẩm: vấn đề -> giải pháp -> chứng cứ -> tiến độ -> rủi ro -> demo.

---

## Slide 03 - Product Là Gì?

**Tiêu đề:** DormCare Hub: nền tảng quản lý KTX tập trung  
**Nội dung hiển thị:**

- DormCare Hub là web app quản lý vòng đời ký túc xá cho sinh viên, nhân viên KTX, bảo trì, lãnh đạo/CTSV và admin.
- Hệ thống thay thế cách vận hành rời rạc bằng Excel, Zalo, giấy tờ, file báo cáo thủ công.
- Dữ liệu lõi được gom về một nguồn: hồ sơ sinh viên, phòng, giường, trạng thái lưu trú, ticket sửa chữa, KPI vận hành.
- MVP tập trung vào hai luồng critical:
  - Hồ sơ KTX: đăng nhập -> consent -> nộp hồ sơ -> duyệt -> phân phòng -> check-in/out.
  - Vận hành sửa chữa: tạo ticket -> phân loại SLA -> xử lý -> xác nhận/reopen -> dashboard.
- Product không nhắm làm "siêu app campus" ngay; mục tiêu là first release đủ tin cậy cho nghiệp vụ KTX cốt lõi.

**Thông điệp chốt:** Một hệ thống quản lý KTX tốt phải giữ được state thật của phòng/giường/hồ sơ, không chỉ hiển thị form.

---

## Slide 04 - Bài Toán Khách Hàng

**Tiêu đề:** Nỗi đau vận hành KTX hiện tại  
**Nội dung hiển thị:**

| Khách hàng/người dùng | Nỗi đau hiện tại | Tác động | DormCare Hub xử lý |
| --- | --- | --- | --- |
| Sinh viên | Không rõ hồ sơ đang ở bước nào | Hỏi lại nhiều lần, mất thời gian | Timeline trạng thái, kết quả duyệt, phòng/giường hiển thị rõ |
| Staff KTX | Dữ liệu phòng/giường nằm rải rác | Dễ lệch sổ, khó phân phòng | Ledger phòng/giường tập trung |
| Người phân phòng | Quyết định thủ công, khó giải thích | Dễ tranh cãi, thiếu trace | Rule suggestion có reason codes và override reason |
| Bảo trì | Ticket thất lạc, không rõ deadline | Chậm xử lý, khó đo SLA | Ticket có priority, assignee, due time, reopen |
| Lãnh đạo/Admin | Báo cáo chậm, thiếu bằng chứng | Quyết định dựa trên cảm tính | Dashboard KPI + audit log |

- Điểm chung của nỗi đau: thiếu nguồn dữ liệu đúng và thiếu quy trình có trạng thái.
- Vì vậy MVP ưu tiên ledger, state machine, SLA, dashboard hành động được.

**Thông điệp chốt:** Khách hàng không chỉ cần nhập liệu nhanh hơn; họ cần giảm sai lệch và nhìn thấy việc nào đang kẹt.

---

## Slide 05 - Giá Trị Cho Khách Hàng

**Tiêu đề:** Giá trị DormCare Hub tạo ra  
**Nội dung hiển thị:**

| Giá trị | Trong sản phẩm thể hiện bằng gì | Lợi ích thực tế |
| --- | --- | --- |
| Minh bạch | Sinh viên thấy trạng thái hồ sơ, phòng, ticket | Giảm hỏi thủ công qua Zalo/điện thoại |
| Chính xác | Ledger cập nhật sau assign, check-in, check-out, maintenance hold | Giảm lệch sổ phòng/giường |
| Giải thích được | Suggestion có reason codes, override có lý do | Dễ bảo vệ quyết định phân phòng |
| Trách nhiệm | Thao tác nhạy cảm ghi actor, timestamp, reason | Có audit khi cần truy vết |
| Hành động được | KPI link tới danh sách hồ sơ/ticket/phòng cần xử lý | Dashboard không chỉ để xem biểu đồ |
| Triển khai tiết kiệm | Responsive web thay native app trong MVP | Giảm chi phí và thời gian release |

- Giá trị cốt lõi không nằm ở UI đẹp, mà ở việc chuẩn hóa quy trình KTX.
- Những phần tốn chi phí/pháp lý cao như SIS, payment, native mobile được defer.

**Thông điệp chốt:** MVP tạo giá trị bằng dữ liệu đúng, quy trình rõ, quyết định nhanh.

---

## Slide 06 - Project Charter & Scope

**Tiêu đề:** Ủy nhiệm dự án và ranh giới MVP  
**Nội dung hiển thị:**

| Yếu tố | Nội dung |
| --- | --- |
| Mục tiêu | Số hóa vòng đời quản lý KTX từ hồ sơ đến vận hành |
| Đối tượng | Sinh viên, staff KTX, bảo trì, CTSV/lãnh đạo, admin |
| Phạm vi MVP | 13 Must-have user stories, 74 story points |
| Team | 7 thành viên, chia ownership theo role/module |
| Release target | Fixed date 05/08/2026 |
| Phạm vi loại trừ | SIS sync, payment gateway thật, native mobile, predictive analytics |

**KPI định hướng từ báo cáo ban đầu:**

- >=90% hồ sơ pilot được xử lý trong hệ thống.
- >=95% trạng thái phòng/giường đúng với ledger.
- >=80% gợi ý phân phòng được staff chấp nhận hoặc thấy hữu ích.
- >=95% ticket được assign trong ngày, >=80% ticket thường xử lý trong SLA.
- Dashboard có KPI lõi và dẫn được tới danh sách hành động.

**Thông điệp chốt:** Nhóm giữ MVP hẹp để bảo vệ release date, thay vì mở rộng sang tích hợp trường học/phí/mobile quá sớm.

---

## Slide 07 - Đối Chiếu Báo Cáo Khả Thi

**Tiêu đề:** Sản phẩm hiện tại có đi đúng hướng không?  
**Nội dung hiển thị:**

| Tiêu chí khả thi | Kỳ vọng ban đầu | Hiện trạng tuần 10 | Đánh giá |
| --- | --- | --- | --- |
| Kỹ thuật | Web app, rule engine, SLA, dashboard có thể demo | React frontend + backend REST + PostgreSQL/Supabase + Azure; 2 flow critical chạy được | Pass |
| Kinh tế | Tối ưu chi phí, tránh làm native/payment quá sớm | MVP dùng responsive web, cloud tier, mock/live mode | Pass |
| Luận pháp/pháp lý | Kiểm soát dữ liệu cá nhân, phân quyền, consent | Có consent, RBAC, audit hint; còn `DEV_AUTH_BYPASS` | Pass có cảnh báo |
| Vận hành | Staff xử lý được hồ sơ/phòng/ticket bằng flow rõ | 13/13 Must demo được; dashboard có KPI hành động | Pass |
| Tiến độ | 4 sprint, release 05/08/2026 | Must-have xong sớm cuối Sprint 2, còn buffer hardening | Pass |

- Kết luận: sản phẩm đi đúng hướng so với báo cáo khả thi.
- Nhưng không được nói quá: bản hiện tại đủ first release/demo môn học, chưa đủ pilot thật nếu chưa hardening auth, coverage, UAT.

**Thông điệp chốt:** Feasibility đã được chứng minh bằng hệ thống chạy thật, nhưng vẫn cần hardening trước khi có người dùng thật.

---

## Slide 08 - Khả Thi Kỹ Thuật

**Tiêu đề:** Kiến trúc đã đủ chứng minh MVP có thể chạy thật  
**Nội dung hiển thị:**

| Lớp | Công nghệ/quyết định | Ý nghĩa |
| --- | --- | --- |
| Frontend | Vite + React + TypeScript | UI responsive, dễ chia module cho 7 người |
| UI system | shadcn components + lucide icons | Đồng nhất giao diện, giảm tự chế component |
| Data boundary | `screen -> useAsyncData -> repositories -> mock/live` | Màn hình không gọi API trực tiếp, dễ đổi mock/live |
| Backend | REST API Express | Hỗ trợ flow hồ sơ, phòng, ticket, dashboard |
| Database | PostgreSQL/Supabase | Dữ liệu quan hệ phù hợp ledger, assignment, audit |
| Deploy demo | Azure App Service | Có môi trường thật cho demo, không chỉ localhost |

**Bằng chứng kỹ thuật đã có:**

- 13/13 Must-have story có màn hình/flow.
- Backend integration được nối qua repository layer.
- Mock mode dùng offline; live mode gọi backend Azure.
- PoC chạy trên backend production, không chỉ script giả lập.
- E2E/negative tests đã bắt được lỗi thật như TC-03.

**Thông điệp chốt:** Rủi ro kỹ thuật lớn nhất không còn là "có làm được không", mà là "hardening đủ chưa".

---

## Slide 09 - Khả Thi Kinh Tế

**Tiêu đề:** MVP tối ưu chi phí bằng cách chọn đúng phạm vi  
**Nội dung hiển thị:**

| Quyết định kinh tế | Lý do | Tác động |
| --- | --- | --- |
| Web-responsive trước | Một codebase phục vụ desktop/mobile browser | Rẻ hơn native mobile |
| Cloud managed API/DB | Không cần tự vận hành server phức tạp | Phù hợp demo/pilot nhỏ |
| Mock/live mode | Demo offline khi backend lỗi, vẫn có live integration | Giảm rủi ro demo |
| 13 Must / 74 SP | Tập trung vòng đời KTX cốt lõi | Không dàn trải full 117 SP |
| Defer payment/SIS/native | Nhiều pháp lý, bảo mật, đối tác | Tránh đội chi phí và trễ release |

**Không làm trong MVP:**

- Real payment gateway/MoMo production.
- SIS sync dữ liệu thật từ trường.
- Native mobile app.
- Export PDF/Excel nâng cao.
- Billing/debt đầy đủ.

**Thông điệp chốt:** Kinh tế của MVP là "làm ít nhưng đúng phần vận hành tạo giá trị", không phải cố nhồi nhiều feature.

---

## Slide 10 - Khả Thi Pháp Lý / Quy Trình

**Tiêu đề:** Dữ liệu sinh viên cần consent, phân quyền và audit  
**Nội dung hiển thị:**

| Yêu cầu | Hiện trạng hệ thống | Mức an toàn |
| --- | --- | --- |
| Consent trước khi nộp hồ sơ | Sinh viên phải đồng ý xử lý dữ liệu cá nhân trước form | Đạt cho MVP |
| RBAC theo vai | Student/Staff/Admin tách menu và quyền API | Đạt, có negative test |
| Không xem dữ liệu người khác | Student chỉ xem hồ sơ/phòng/ticket của mình | Đạt trong test |
| Thao tác nhạy cảm có lý do | Approve/reject/override/check-out/config đều yêu cầu reason | Đạt về quy trình |
| Audit | Ghi actor, action, timestamp, reason cho thao tác nhạy cảm | Đạt mức demo |
| Auth production | `DEV_AUTH_BYPASS` vẫn tồn tại | Cảnh báo bắt buộc xử lý |

**Rủi ro còn lại:**

- `DEV_AUTH_BYPASS` có thể bị lạm dụng nếu public và ai biết header.
- Chưa đo đủ coverage 70% theo DoD.
- Export rộng dữ liệu cá nhân chưa nằm trong MVP.

**Thông điệp chốt:** Hướng pháp lý/quy trình đúng, nhưng điều kiện trước pilot thật là tắt bypass và dùng JWT auth thật.

---

## Slide 11 - Core Feature Map

**Tiêu đề:** Chức năng cốt lõi của hệ thống  
**Nội dung hiển thị:**

| Cụm | Feature | Vai sử dụng | Mục đích |
| --- | --- | --- | --- |
| Platform | Login, RBAC, consent, profile | Tất cả | Vào đúng portal, kiểm soát dữ liệu cá nhân |
| Student | Application form, status timeline, room view | Sinh viên | Nộp hồ sơ, theo dõi duyệt/phòng |
| Staff Review | Review evidence, approve/reject reason | Staff | Xử lý hồ sơ minh bạch |
| Room Ledger | Building/floor/room/bed status | Staff/Admin | Một sổ phòng/giường đúng |
| Assignment | Rule suggestion, alternatives, override reason | Staff | Phân phòng có giải thích |
| Stay Ops | Check-in/check-out checklist | Staff | Ledger phản ánh thực tế lưu trú |
| Maintenance | Ticket, priority, SLA board, resolve/reopen | Student/Staff | Không thất lạc yêu cầu sửa chữa |
| Dashboard | Occupancy, pending, overdue, action lists | Staff/Lãnh đạo | Nhìn nhanh việc cần xử lý |
| Admin | Users/RBAC, rooms, rules, audit/settings | Admin | Governance và cấu hình hệ thống |

**Thông điệp chốt:** Core features xoay quanh state và trách nhiệm, không phải danh sách màn hình rời rạc.

---

## Slide 12 - Hai Luồng Demo-Critical

**Tiêu đề:** MVP bảo vệ 2 luồng có giá trị nhất  
**Nội dung hiển thị:**

| Luồng | Các bước chính | User stories | Giá trị chứng minh |
| --- | --- | --- | --- |
| Hồ sơ KTX | Login/consent -> nộp hồ sơ -> staff duyệt -> gợi ý giường -> override nếu cần -> SV xác nhận -> check-in/out | US-001 -> US-010 | Quản lý trọn vòng đời sinh viên vào KTX |
| Sửa chữa + Dashboard | SV tạo ticket -> staff phân loại/gán SLA -> xử lý -> SV xác nhận/reopen -> KPI hiển thị overdue/action list | US-011 -> US-014 | Vận hành sau khi ở KTX, có SLA và quản trị |

**Điểm không được mất trong demo:**

- Consent và RBAC phải thấy rõ.
- Suggestion phải có reason codes.
- Override/check-in phải bắt reason/checklist.
- Ticket phải có SLA và reopen.
- Dashboard phải dẫn đến record list/action, không chỉ chart.

**Thông điệp chốt:** Nếu hai luồng này chạy end-to-end, MVP đã chứng minh được giá trị vận hành cốt lõi.

---

## Slide 13 - Business Plan

**Tiêu đề:** Mô hình tạo giá trị và vận hành dự án  
**Nội dung hiển thị:**

| Thành phần | Nội dung |
| --- | --- |
| Khách hàng mục tiêu | Ban quản lý KTX, phòng Công tác sinh viên, trường/campus có nhu cầu số hóa KTX |
| Vấn đề trả tiền/đầu tư | Giảm lệch ledger, giảm đối soát thủ công, giảm thất lạc hồ sơ/ticket, tăng minh bạch |
| Giá trị vận hành | Dữ liệu đúng -> quy trình rõ -> quyết định nhanh -> audit được |
| Cách triển khai | Demo môn học -> UAT nội bộ -> pilot một KTX/tòa -> mở rộng Phase 2 |
| Chi phí kiểm soát | Web app, cloud tier, không native/payment/SIS trong MVP |
| Nguyên tắc dữ liệu | Không bán dữ liệu; tích hợp SIS/payment phải qua phê duyệt riêng |

**Phase roadmap:**

- Release 1: core dorm workflow + maintenance SLA + dashboard.
- Phase 2: billing/debt, notifications, import/export, audit export, reporting.
- Phase 3: SIS/payment/native mobile nếu có tài trợ và pháp lý.

**Thông điệp chốt:** Business plan của nhóm là tạo giá trị bằng giảm lỗi vận hành trước, sau đó mới mở rộng tiện ích.

---

## Slide 14 - Backlog Theo MoSCoW

**Tiêu đề:** Backlog được ưu tiên để bảo vệ MVP  
**Nội dung hiển thị:**

| Nhóm MoSCoW | Số item | Story points | Ý nghĩa với release |
| --- | ---: | ---: | --- |
| Must Have | 13 | 74 | Bắt buộc cho MVP và demo-critical flows |
| Should Have | 7 | 38 | Tốt cho pilot readiness, chuyển Phase 2 được |
| Could Have | 1 | 5 | Nice-to-have report/export |
| Won't Have in MVP | 3 | 0 | SIS, payment, native mobile, cần dự án riêng |
| Total | 24 | 117 | Full backlog baseline, không cam kết hết trong MVP |

**Nguyên tắc ưu tiên:**

- Must-have phải có acceptance criteria và sample data rõ.
- Story nhạy cảm dữ liệu phải có negative RBAC.
- Dashboard chỉ Done khi KPI dẫn tới action/list.
- Scope expansion phải vào change-control, không tự kéo vào Sprint.

**Thông điệp chốt:** Nhóm không làm tràn lan; full backlog 117 SP nhưng MVP chỉ cam kết 74 SP cốt lõi.

---

## Slide 15 - Ước Lượng 2 Phương Pháp

**Tiêu đề:** Ước lượng hội tụ -> đủ cơ sở cam kết fixed date  
**Nội dung hiển thị:**

| Phương pháp | Cách tính | Kết quả | Ý nghĩa |
| --- | --- | --- | --- |
| Story point + velocity | 74 SP / 18.5 SP per sprint | 4 sprint = 8 tuần | Dùng cho sprint planning |
| Three-point PERT | E = (O + 4M + P) / 6 theo epic | 60 ngày-người ~= 7.5-8.5 tuần | Kiểm chứng độc lập effort |
| So sánh | Hai kết quả lệch <10% | Cùng chỉ về khoảng 8 tuần | Tăng độ tin cậy estimate |

**Chi tiết nền:**

- Thang story point: 1, 2, 3, 5, 8, 13.
- Baseline 3 SP: story hẹp như consent/override/confirm resolution.
- 5 SP: workflow có trạng thái/quyền như login, review, SLA classify.
- 8 SP: module nhiều dữ liệu/trạng thái như application, ledger, assignment, dashboard.

**Thông điệp chốt:** Fixed date 05/08/2026 không phải đoán cảm tính; được kiểm tra chéo bằng hai cách estimate.

---

## Slide 16 - Release Strategy

**Tiêu đề:** Fixed-date release: giữ ngày, linh hoạt scope ngoài Must  
**Nội dung hiển thị:**

| Sprint | Ngày | Kế hoạch SP | Mục tiêu gốc |
| --- | --- | ---: | --- |
| S1 | 10/06 - 24/06 | 29 | RBAC, consent, application, status, room/bed ledger |
| S2 | 24/06 - 08/07 | 21 | Staff review, assignment, override, check-in/out |
| S3 | 08/07 - 22/07 | 16 | Maintenance ticket, SLA board, confirm/reopen |
| S4 | 22/07 - 05/08 | 8 | Operations dashboard, stabilize |
| Total | 8 tuần | 74 | MVP release |

**Release logic:**

- Fixed date: 05/08/2026.
- Will-have: 13 Must stories.
- Might-have: QR lookup, KPI drilldown nếu còn capacity.
- Won't-have: fees/debt, notification, import/export, audit export, SIS, payment, native mobile.
- Nếu velocity thấp: cắt might-have trước, không cắt 2 luồng demo-critical.

**Thông điệp chốt:** Ngày release cố định; scope ngoài Must mới là biến linh hoạt.

---

## Slide 17 - Quy Trình Phần Mềm

**Tiêu đề:** Scrum + workflow rõ để 7 người làm song song  
**Nội dung hiển thị:**

| State | Ý nghĩa | Điều kiện ra khỏi state |
| --- | --- | --- |
| Backlog | Có ý tưởng/story nhưng chưa sẵn sàng | AC + sample data rõ |
| Ready | Có thể kéo vào sprint | PO/BA + Tech Lead thống nhất scope |
| In Progress | Đang triển khai | Code/UI/data sẵn sàng review |
| Review | Review PR, UI, API, dữ liệu | Không còn blocker |
| QA Testing | QA kiểm AC và negative cases | Không còn bug Critical/High |
| Done | Đủ DoD | Demo-ready, có evidence |
| Released | Có trên staging/demo env | Sprint Review chạy được end-to-end |

**Cách nhóm giảm conflict:**

- Chia ownership theo folder/role.
- Shared UI/router/API layer do Member 1 quản.
- Feature member chỉ sửa vùng phụ trách.
- Mọi thay đổi scope phải qua PM/change log.

**Thông điệp chốt:** Process không phải hình thức; nó giúp 7 người không dẫm chân nhau và vẫn trace được story -> UI -> API -> test.

---

## Slide 18 - Definition of Done

**Tiêu đề:** "Xong" không có nghĩa là chỉ có UI  
**Nội dung hiển thị:**

| Nhóm tiêu chí | Done cần có |
| --- | --- |
| Requirement | User story, role, business value, acceptance criteria rõ |
| Scope | Đúng MVP, không thêm Phase 2 chưa duyệt |
| UI/UX | Theo prototype hoặc có deviation được ghi nhận |
| Code/CI | PR review, lint/test/build pass |
| Tests/QA | Test module, target coverage >=70%, không còn Critical/High |
| Security | RBAC negative, kiểm data visibility |
| Data | Demo/sample data tái hiện được flow |
| Docs | API/schema/env/operation docs cập nhật nếu có đổi |
| Demo | Chạy được trong Sprint Review |

**Ví dụ Not Done:**

- Có màn hình nhưng không demo được với sample data.
- Staff override assignment không cần lý do.
- Student xem được hồ sơ/ticket của người khác.
- Dashboard chỉ có chart nhưng không dẫn tới danh sách cần xử lý.
- Code build pass nhưng coverage/evidence chưa có.

**Thông điệp chốt:** DoD giúp nhóm không nhầm "đã code" với "đã sẵn sàng vận hành".

---

## Slide 19 - Proof of Concept

**Tiêu đề:** PoC kiểm chứng phần rủi ro nhất trước khi build rộng  
**Nội dung hiển thị:**

| Giả thuyết | Ngưỡng pass | Vì sao quan trọng |
| --- | --- | --- |
| H1: Rule engine gợi ý phòng/giường hữu ích | >=80% suggestion acceptable | Nếu fail, phân phòng vẫn thủ công |
| H2: Suggestion giải thích được | 100% có reason codes | Tránh "hộp đen" khi phân phòng |
| H3: QR/ticket đúng ngữ cảnh | >=95% mapping đúng | Tránh ticket gắn nhầm phòng/tài sản |
| H4: SLA state tính đúng | 100% ticket đúng trạng thái | Tránh dashboard và deadline sai |
| H5: KPI dùng cùng nguồn dữ liệu | 100% KPI selected đúng | Tránh dashboard trang trí/sai số |

**PoC scope:**

- Sample applications, building/room/bed ledger, assets, tickets.
- Deterministic rule functions, không dùng AI optimization.
- QR payload chỉ chứa business id, không chứa dữ liệu nhạy cảm.
- Dashboard KPI là aggregation từ dữ liệu thật của flow.

**Thông điệp chốt:** PoC không làm cho có; nó chọn đúng 3 rủi ro kỹ thuật-vận hành lớn nhất: assignment, SLA, dashboard.

---

## Slide 20 - PoC Result

**Tiêu đề:** PoC PASS và bắt được lỗi thật  
**Nội dung hiển thị:**

| Test | Kết quả | Ý nghĩa |
| --- | --- | --- |
| TC-01 | PASS | Gợi ý phòng chuẩn theo giới tính/sức chứa |
| TC-02 | PASS | Ưu tiên chính sách được áp dụng |
| TC-03 | FAIL -> FIXED -> PASS | Engine từng gợi ý giường đã có người |
| TC-04 | PASS | 100% suggestion có reason codes |
| TC-05 | PASS | Override lưu reason/audit |
| TC-06 | PASS | QR scan map đúng asset/context |
| TC-07 | PASS | Ticket SLA/reopen đúng state |
| TC-08 | PASS | Occupancy KPI khớp ledger |
| TC-09 | PASS | KPI link đúng record list |

**Chi tiết TC-03:**

- Lỗi: so mã giường thiếu chuẩn hóa prefix, có thể gợi ý giường đã occupied.
- Cách phát hiện: test trên UI/backend thật, không phải mock.
- Fix: chuẩn hóa occupancy check và regression.
- Giá trị: nếu giữ mock đến cuối kỳ, lỗi này có thể chỉ lộ ở Sprint 4.

**Thông điệp chốt:** PoC đã chứng minh hướng làm đúng và cho thấy testing thật có giá trị hơn demo giả trơn tru.

---

## Slide 21 - Demo Hiện Tại Đủ Dùng Chưa?

**Tiêu đề:** Đủ dùng cho first release/demo; chưa production-ready  
**Nội dung hiển thị:**

| Đã đủ dùng cho demo/first release | Chưa đủ cho pilot thật |
| --- | --- |
| 13/13 Must-have stories demo được | JWT auth thật chưa thay hoàn toàn dev bypass |
| 2 luồng critical chạy end-to-end | Coverage 70% chưa đo đủ bằng report |
| Frontend React nối backend API qua repository layer | QR camera/import/export chưa hoàn chỉnh |
| Backend Azure + PostgreSQL/Supabase chạy thật | Azure free tier có cold start |
| RBAC negative cases pass | UAT với staff thật chưa đủ |
| PoC PASS trên hệ thống thật | MoMo/notification là scope creep cần change log |

**Cách diễn đạt khi thầy hỏi:**

- Nên nói: "Đủ dùng cho demo môn học và first release nội bộ."
- Không nên nói: "Đã production-ready cho người dùng thật."
- Điều kiện trước pilot: tắt `DEV_AUTH_BYPASS`, JWT thật, coverage report, UAT, health-check/warmup.

**Thông điệp chốt:** Nhóm báo cáo trung thực: core flow đã đủ chứng minh, phần hardening vẫn phải làm.

---

## Slide 22 - Sơ Đồ Tổ Chức Nhóm

**Tiêu đề:** 7 thành viên chia ownership theo module  
**Nội dung hiển thị:**

| Thành viên | Ownership | Trách nhiệm chính |
| --- | --- | --- |
| Member 1 | Shell/shared/docs/API layer | App shell, route, shadcn UI, repository layer, mock/live data, docs sync |
| Member 2 | Auth/Profile/RBAC | Login, role gate, consent, profile, RBAC UI |
| Member 3 | Student core | Student dashboard, application form/status, current room |
| Member 4 | Student services | Tickets, requests, invoices draft, notifications draft |
| Member 5 | Staff operations A | Staff dashboard, review queue, allocation, check-in/out |
| Member 6 | Staff operations B | Residents, maintenance/SLA, billing draft, tasks draft |
| Member 7 | Admin governance | Admin dashboard, users/RBAC, buildings/rooms, allocation rules, audit/settings |

**Nguyên tắc tổ chức:**

- Chia theo role nghiệp vụ thay vì chia theo component nhỏ.
- Shared layer tập trung ở Member 1 để giảm conflict.
- Feature folders tách rõ, mỗi thành viên có lane riêng.
- Mọi Must-have đều gắn owner, không có story "vô chủ".

**Thông điệp chốt:** Ownership rõ là lý do 7 người có thể làm song song mà vẫn ghép được một MVP thống nhất.

---

## Slide 23 - Vai Trò Theo RACI

**Tiêu đề:** RACI giúp rõ ai quyết, ai làm, ai kiểm  
**Nội dung hiển thị:**

| Hoạt động | Responsible | Accountable | Consulted | Informed |
| --- | --- | --- | --- | --- |
| Scope/backlog | BA/PO + PM | PM | Tech Lead, QA | Cả nhóm |
| Architecture/API boundary | Tech Lead/Member 1 | Tech Lead | Backend, feature owners | Cả nhóm |
| UI/prototype | UI/UX + feature owner | PM/PO | QA, Tech Lead | Cả nhóm |
| Feature implementation | Member owner | Tech Lead | QA, PM | Cả nhóm |
| QA/negative tests | QA/Risk owner | PM | Feature owner | Cả nhóm |
| Demo script | Demo owner | PM | Các owner | Cả nhóm |
| Risk/change control | PM + Risk owner | PM | Tech Lead, PO | Cả nhóm |

**Vai trò thực tế trong nhóm:**

- PM/Scrum Master: sprint, scope, risk, báo cáo.
- BA/PO: backlog, AC, nghiệp vụ KTX.
- Tech Lead: kiến trúc, API/data boundary, review.
- QA/Risk: test, negative case, risk register.
- Dev owners: triển khai theo module.
- Demo owner: seed data, script, fallback.

**Thông điệp chốt:** RACI giúp tránh câu "ai cũng tưởng người khác làm".

---

## Slide 24 - Tracking Member 1-2

**Tiêu đề:** Foundation & Auth/RBAC  
**Nội dung hiển thị:**

| Member | Phạm vi | Đã hoàn thành | Còn lại / hardening |
| --- | --- | --- | --- |
| M1 | Shell/shared/API/docs | App layout, navigation, route map, shadcn base, repository layer, mock/live mode, docs PM sync | Evidence package, hardening docs, kiểm route/empty/error states |
| M2 | Auth/Profile/RBAC/Consent | Login UI, role gate, profile, consent flow, RBAC UI, cross-role UX guard | JWT auth thật sau demo, bỏ lệ thuộc `DEV_AUTH_BYPASS`, polish error/security copy |

**Tác động đến MVP:**

- M1 tạo nền để các member khác build màn hình không sửa shared lung tung.
- Repository layer giúp cùng một screen chạy mock hoặc live backend.
- M2 bảo vệ điểm pháp lý đầu tiên: consent và role-based access.
- Nếu M1/M2 yếu, mọi flow phía sau đều thiếu nền và thiếu kiểm soát dữ liệu.

**Trạng thái:** Core đã demo được; phần còn lại là hardening trước pilot.

---

## Slide 25 - Tracking Member 3-4

**Tiêu đề:** Student Portal  
**Nội dung hiển thị:**

| Member | Phạm vi | Đã hoàn thành | Còn lại / hardening |
| --- | --- | --- | --- |
| M3 | Student dashboard/application/room | Dashboard sinh viên, form hồ sơ, validation, status timeline, assigned room/bed view | Polish responsive/mobile, empty/error states, evidence upload UX |
| M4 | Student tickets/requests/invoices/notifications | Ticket create/detail, confirm resolution, reopen flow, requests draft, invoices/notifications draft | Giữ invoice/notification ở Phase 2, không để scope creep block MVP |

**Flow student đã có:**

- Đăng nhập đúng vai student.
- Consent trước khi tạo hồ sơ.
- Nộp hồ sơ có validation.
- Xem trạng thái duyệt và phòng/giường.
- Tạo ticket sửa chữa với priority/SLA preview.
- Xác nhận đã sửa hoặc reopen nếu chưa đạt.

**Trạng thái:** Student journey đã đủ cho demo, cần tránh kéo Phase 2 vào câu chuyện chính.

---

## Slide 26 - Tracking Member 5-6

**Tiêu đề:** Staff Operations  
**Nội dung hiển thị:**

| Member | Phạm vi | Đã hoàn thành | Còn lại / hardening |
| --- | --- | --- | --- |
| M5 | Staff dashboard/review/allocation/check-in-out | Review queue, approve/reject reason, assignment suggestion, alternatives, override reason, check-in/out checklist | UAT với staff thật, regression cạnh tranh giường, polish board |
| M6 | Residents/maintenance/billing/tasks | Resident lookup, maintenance SLA board, classify/assign/resolve/reopen, billing/tasks draft | SLA edge cases, overdue runtime, giữ billing/tasks draft ở Phase 2 |

**Flow staff đã có:**

- Xem hồ sơ chờ duyệt.
- Duyệt/reject có lý do.
- Chạy suggestion và xem reason codes.
- Override phải ghi lý do.
- Check-in/out cập nhật ledger.
- Phân loại ticket, gán assignee/due time, xử lý reopen.

**Trạng thái:** Staff operations là phần chứng minh hệ thống không chỉ để sinh viên nhập form.

---

## Slide 27 - Tracking Member 7 & Tổng Hợp

**Tiêu đề:** Admin Governance & tracking tổng  
**Nội dung hiển thị:**

| Member | Phạm vi | Đã hoàn thành | Còn lại / hardening |
| --- | --- | --- | --- |
| M7 | Admin dashboard/RBAC/rooms/rules/audit/settings | User/RBAC, building/room config, room maintenance lock, allocation rules, audit/settings, admin KPIs | Audit export Phase 2, UAT admin rule changes, kiểm quyền nhạy cảm |

**Tracking tổng đến tuần 10:**

- 13/13 Must-have stories có màn hình và flow demo.
- Frontend có mock/live mode, không phụ thuộc một môi trường duy nhất.
- Backend API đã wired cho luồng chính.
- PoC/test đã phát hiện và fix bug thật.
- Known gaps được ghi rõ: bypass, coverage, QR camera/import/export, cold start, UAT.

**Điểm quản trị quan trọng:**

- Admin thay đổi rule/phòng ảnh hưởng trực tiếp suggestion của staff.
- Thao tác nhạy cảm phải có reason và audit.
- Admin không phải "trang cài đặt phụ"; đây là guardrail của vận hành.

**Thông điệp chốt:** Tracking tổng cho thấy Must-have đã đóng, nhưng S3-S4 không rảnh; đó là buffer hardening.

---

## Slide 28 - Tiến Độ Tổng Thể

**Tiêu đề:** Dự án đang sớm hơn kế hoạch Must-have khoảng 1.5 sprint  
**Nội dung hiển thị:**

| Mốc | Kế hoạch | Thực tế |
| --- | --- | --- |
| Tổng MVP | 4 sprint x 2 tuần | Giữ nguyên timeline |
| Hết Sprint 1 | Còn 45 SP | Còn 45 SP, đúng kế hoạch |
| Hết Sprint 2 | Còn 24 SP | Còn 0 SP Must-have |
| Sprint 3-4 | Hoàn thành maintenance/dashboard | Chuyển sang hardening + pilot readiness |
| Release chính thức | 05/08/2026 | Vẫn giữ, có buffer |

**Diễn giải:**

- Kế hoạch gốc: S3 làm maintenance/SLA, S4 làm dashboard.
- Thực tế: US-011 -> US-014 được kéo sớm vào S2.
- First release có từ 05/07 với frontend, backend Azure, Supabase PostgreSQL.
- Nhóm không dùng tiến độ sớm để thêm scope mới bừa bãi.

**Thông điệp chốt:** Dự án sớm hơn ở Must-have, nhưng phần thời gian còn lại phải dùng để làm chắc, không phải nhồi thêm feature.

---

## Slide 29 - Velocity

**Tiêu đề:** Velocity cao ở S2 nhưng không biến thành cam kết mới  
**Nội dung hiển thị:**

| Sprint | Planned | Actual | Nhận định |
| --- | ---: | ---: | --- |
| Sprint 1 | 29 SP | 29 SP | Foundation nặng, đúng kế hoạch |
| Sprint 2 | 21 SP | 45 SP | Kéo sớm S3-S4, tích hợp backend thật |
| Baseline kế hoạch | 18.5 SP/sprint | Giữ nguyên | Không dùng velocity đột biến làm chuẩn Phase 2 |

**Vì sao S2 tăng mạnh:**

- Frontend/backend làm song song.
- Ownership folder rõ, ít conflict.
- Một số màn hình Phase 2 draft đã có sẵn nền.
- AI-assisted dev giúp tăng tốc nhưng không bền vững 100%.
- Tích hợp sớm phát hiện lỗi nhanh, giảm sửa muộn.

**Cảnh báo quản trị:**

- Không được lấy 45 SP/sprint làm lời hứa cho Phase 2.
- Phase 2 vẫn estimate theo baseline 18.5 SP/sprint.
- Velocity bất thường cần phân tích, không dùng để ép scope.

**Thông điệp chốt:** Báo cáo tốt phải trung thực: nhanh hơn kế hoạch, nhưng không tự tạo kỳ vọng phi thực tế.

---

## Slide 30 - Điều Chỉnh Backlog

**Tiêu đề:** Kéo Must-have lên sớm, không cắt luồng critical  
**Nội dung hiển thị:**

| Sprint | Kế hoạch gốc | Điều chỉnh thực tế | Lý do |
| --- | --- | --- | --- |
| S1 | US-001, 002, 003, 004, 006 | Giữ nguyên | Cần nền RBAC, hồ sơ, ledger |
| S2 | US-005, 008, 009, 010 | + US-011, 012, 013, 014 | Có capacity, backend integration sớm |
| S3 | Maintenance/SLA | Hardening, QR lookup UI, KPI drilldown, UAT | Must đã xong |
| S4 | Dashboard | Stabilization, demo package, release buffer | Giữ release 05/08 |

**Quyết định quản trị:**

- Không cắt hai luồng demo-critical.
- Không kéo thêm SIS/payment/native mobile.
- MoMo/notifications nếu đã xuất hiện phải ghi change log và label beyond-MVP.
- S3-S4 ưu tiên auth, coverage, UAT, health-check, demo fallback.

**Thông điệp chốt:** Backlog adjustment đúng không phải là làm thêm thật nhiều, mà là dùng buffer để giảm rủi ro release.

---

## Slide 31 - Vận Hành Đã OK

**Tiêu đề:** Core MVP đã vận hành được trên flow thật  
**Nội dung hiển thị:**

| Bằng chứng | Ý nghĩa |
| --- | --- |
| 13/13 Must story có màn hình và flow demo | Scope cốt lõi đã phủ |
| PoC TC-03 fail -> fix -> pass | Testing bắt được bug nghiệp vụ thật |
| RBAC negative cases pass | Không chỉ ẩn menu ở frontend |
| Traceability story -> UI -> API -> test | Có đường nối từ yêu cầu đến bằng chứng |
| Dashboard KPI có action/list | Không phải biểu đồ trang trí |
| Repository layer mock/live | Demo linh hoạt, code không gọi fetch trực tiếp |
| Audit-first cho thao tác nhạy cảm | Có trách nhiệm và truy vết |
| Backend/database thật | Demo thuyết phục hơn mock-only |

**Những flow đã chạy được:**

- Hồ sơ KTX end-to-end.
- Assignment suggestion + override reason.
- Check-in/out cập nhật ledger.
- Ticket SLA + reopen.
- Admin config ảnh hưởng rule/suggestion.

**Thông điệp chốt:** Vận hành OK ở mức MVP vì hệ thống đã xử lý được state thật và guard thật.

---

## Slide 32 - Những Việc Chưa OK

**Tiêu đề:** Các điểm chưa ổn cần báo cáo thẳng  
**Nội dung hiển thị:**

| Vấn đề | Tác động | Trạng thái | Cách nhìn đúng |
| --- | --- | --- | --- |
| MoMo/notification vào sớm | Scope creep, lệch MVP boundary | Đã xảy ra | Ghi change log, label beyond-MVP |
| `DEV_AUTH_BYPASS` còn bật | Rủi ro mạo danh user nếu public | Đang tồn tại | Chấp nhận tạm cho demo, không cho pilot |
| Coverage 70% chưa đo đủ | DoD thiếu evidence định lượng | Open | Cần report module coverage |
| QR camera/import/export chưa xong | Một số tiện ích chưa hoàn chỉnh | Open/Phase 2 | Không block core demo |
| Azure free tier cold start | Demo có thể chậm 30-60s đầu | Open | Warmup `/health`, video fallback |
| UAT staff thật ít | Adoption risk chưa đo | Open | Mời 1-2 staff thử flow |

**Nguyên tắc báo cáo:**

- Không che rủi ro đã xảy ra.
- Không gọi scope creep là "bonus feature" nếu chưa qua change control.
- Không nâng demo-ready thành production-ready.

**Thông điệp chốt:** Báo cáo tiến độ đáng tin là báo cáo cả phần tốt lẫn phần chưa đạt.

---

## Slide 33 - Giải Pháp Đề Xuất

**Tiêu đề:** Dùng Sprint 3-4 để hardening và pilot readiness  
**Nội dung hiển thị:**

| Vấn đề | Giải pháp | Owner gợi ý | Hạn mục tiêu |
| --- | --- | --- | --- |
| Scope creep | Change log hồi tố, tag beyond-MVP, gate Phase 2 | PM/BA | 15/07 |
| Dev bypass | JWT auth thật, tắt `DEV_AUTH_BYPASS` trên public demo/pilot | Tech Lead/M2 | 18/07 |
| Coverage | Report coverage cho auth/RBAC, assignment, SLA, admin | QA/feature owners | 22/07 |
| Cold start | Warmup `/health`, chuẩn bị video fallback | Demo owner/M1 | Trước demo |
| UAT ít | Mời 1-2 staff thử hồ sơ + ticket SLA | PM/QA | S3-S4 |
| QR/import/export | Chốt cái nào MVP, cái nào Phase 2 | PM/PO | S3 planning |

**Ưu tiên xử lý:**

1. Security/auth trước.
2. Evidence/coverage tiếp theo.
3. UAT và demo fallback.
4. Scope Phase 2 sau khi MVP chắc.

**Thông điệp chốt:** Giải pháp không phải thêm người hay thêm feature; giải pháp là khóa scope và làm chắc các điểm rủi ro.

---

## Slide 34 - Lý Thuyết Quản Trị Rủi Ro

**Tiêu đề:** Risk Exposure = Probability x Impact  
**Nội dung hiển thị:**

| Khái niệm | Áp dụng trong DormCare Hub |
| --- | --- |
| Probability | Xác suất risk xảy ra, ví dụ scope creep 60%, dev bypass 90% vì đang tồn tại |
| Impact | Tác động đo bằng story point, chất lượng, bảo mật, demo/release |
| Risk Exposure | P x Impact, dùng để ưu tiên risk nào xử lý trước |
| Trigger | Dấu hiệu risk bắt đầu xảy ra, ví dụ Phase 2 feature xuất hiện trong MVP |
| Response | Avoid, mitigate, transfer, accept tùy loại risk |
| Owner | Mỗi risk cần người theo dõi, không chỉ ghi trong tài liệu |
| Contingency | Kế hoạch dự phòng khi risk xảy ra, ví dụ video fallback khi Azure cold start |

**Nguyên tắc của nhóm:**

- Risk register phải cập nhật theo thực tế, không giữ bản đẹp ban đầu.
- Risk đã xảy ra phải ghi "materialized".
- Risk mới phát sinh phải bổ sung mã mới.
- Quyết định A/B phải dựa trên risk, không chỉ dựa cảm giác.

**Thông điệp chốt:** Quản trị rủi ro là ra quyết định bằng xác suất/tác động, không chỉ liệt kê điều xấu có thể xảy ra.

---

## Slide 35 - Risk Register Top

**Tiêu đề:** Các rủi ro quan trọng nhất đến tuần 10  
**Nội dung hiển thị:**

| ID | Risk | RE / mức | Trạng thái thực tế | Response |
| --- | --- | --- | --- | --- |
| R-03 | Velocity thấp / Sprint 1 quá tải | 14.70 Critical | Không xảy ra theo chiều xấu; thực tế vượt kế hoạch | Đóng chiều ngược, không đổi baseline |
| R-13 | `DEV_AUTH_BYPASS` public | 14.40 Critical mới | Đang tồn tại | JWT thật, tắt bypass trước pilot |
| R-10 | Phase 2 leak vào MVP | 9.60 High | Đã xảy ra: MoMo/notifications | Change log, gate Phase 2 |
| R-01 | Dữ liệu phòng/giường/SV bẩn | 8.45 High | Mitigated bằng seed/validation | Duy trì sample dataset chuẩn |
| R-02 | RBAC sai phạm vi dữ liệu | 8.40 High | Negative tests pass, nhưng liên quan R-13 | Tiếp tục test server-side |
| R-05 | Ledger lệch sau assign/check-in/out | 7.20 High | Đã gặp bug, đã fix | Regression state machine |
| R-11 | Mock lệch backend | 5.85 Medium | Đã xảy ra một phần | Chọn hướng B, thêm mapper |
| R-15 | AI velocity không bền | 3.20 Medium mới | Theo dõi | Giữ baseline 18.5 SP/sprint |

**Thông điệp chốt:** Top risk thay đổi theo thực tế; R-13 và R-10 là hai điểm cần nói thẳng khi bảo vệ dự án.

---

## Slide 36 - Hướng A: Giữ Mock Đến Cuối MVP

**Tiêu đề:** Hướng A giảm áp lực sớm nhưng dồn rủi ro cuối kỳ  
**Nội dung hiển thị:**

| Rủi ro nếu chọn A | Tác động | Vì sao nguy hiểm |
| --- | --- | --- |
| Big-bang integration ở Sprint 4 | Dồn lỗi ngay trước 05/08 | Không còn buffer sửa contract |
| Mock/backend lệch enum, bed code, status | UI chạy nhưng live fail | Người demo khó giải thích |
| Bug DB/SQL/rule engine lộ muộn | Lỗi nghiệp vụ nghiêm trọng | TC-03 có thể chỉ xuất hiện tuần cuối |
| Demo bị chất vấn "không thật" | Giảm độ tin cậy | Chỉ có mock data, không chứng minh hạ tầng |
| Backend team ít được thử sớm | Lãng phí năng lực song song | Không tận dụng được 7 người |
| Dashboard có thể sai nguồn | KPI đẹp nhưng không ăn dữ liệu thật | Dễ thành dashboard trang trí |

**Ưu điểm của A:**

- UI polish nhanh hơn ban đầu.
- Ít phụ thuộc hạ tầng.
- Dễ dựng demo ngắn hạn.

**Kết luận về A:** Phù hợp nếu chỉ cần prototype, nhưng rủi ro cao nếu thầy hỏi release đầu tiên có chạy thật không.

---

## Slide 37 - Hướng B: Tích Hợp Backend/Azure Sớm

**Tiêu đề:** Hướng B trả rủi ro tích hợp sớm  
**Nội dung hiển thị:**

| Rủi ro khi chọn B | Thực tế/Phòng ngừa | Trạng thái |
| --- | --- | --- |
| Scope creep vì có hạ tầng thật | MoMo/notifications vào sớm -> cần change log | Đã xảy ra |
| Dev bypass trên public env | Tạm chấp nhận cho demo, tắt trước pilot | Đang tồn tại |
| Phụ thuộc Azure/Supabase | Warmup `/health`, video fallback | Có mitigation |
| UI polish bị chia thời gian | S3-S4 chuyển hardening/polish | Đang xử lý |
| Contract thay đổi làm vỡ screen | Mapper DTO -> domain trong API layer | Đã giảm rủi ro |

**Lợi ích của B:**

- Phát hiện sớm lỗi SQL/enum/bed occupancy.
- PoC chạy trên hệ thống thật.
- Demo có API/database thật.
- Giảm R-11 mock/backend mismatch.
- Dashboard tính từ cùng nguồn dữ liệu.

**Kết luận về B:** Rủi ro đến sớm hơn, nhưng nhìn thấy và xử lý được; tốt hơn để bảo vệ release.

---

## Slide 38 - Quyết Định Chọn B

**Tiêu đề:** Nhóm chọn tích hợp sớm để giảm rủi ro release  
**Nội dung hiển thị:**

| Tiêu chí | Hướng A: mock đến cuối | Hướng B: tích hợp sớm |
| --- | --- | --- |
| Rủi ro integration | Thấp đầu kỳ, rất cao cuối kỳ | Cao đầu kỳ, giảm dần |
| Độ thật của demo | Trung bình | Cao hơn vì chạy DB/API |
| Khả năng bắt bug nghiệp vụ | Muộn | Sớm |
| Tác động đến scope creep | Thấp hơn | Cao hơn, đã xảy ra |
| Tác động đến security | Thấp nếu local mock | Cao hơn vì public env có bypass |
| Phù hợp mục tiêu "first release" | Yếu hơn | Mạnh hơn |

**Lý do chọn B:**

- R-11 mock/backend mismatch đã có dấu hiệu thật.
- TC-03 cho thấy bug chỉ lộ khi chạy dữ liệu thật.
- Thầy/khách hàng có thể hỏi "release đầu có dùng được không".
- Demo live thuyết phục hơn prototype.
- S3-S4 còn buffer để hardening.

**Cái giá phải trả:**

- R-10 materialized: Phase 2 leak.
- R-13 phát sinh: dev bypass public.
- Cần discipline cao hơn trong change control.

**Thông điệp chốt:** Chọn B không phải vì B không rủi ro; chọn B vì rủi ro của B có thể quản lý sớm hơn rủi ro của A.

---

## Slide 39 - Mitigation Roadmap

**Tiêu đề:** Kế hoạch phòng ngừa đến release 05/08/2026  
**Nội dung hiển thị:**

| Mốc | Việc cần làm | Risk giảm |
| --- | --- | --- |
| 07/07 - 15/07 | Change log cho MoMo/notifications, tag beyond-MVP | R-10 |
| 07/07 - 18/07 | JWT auth thật, tắt `DEV_AUTH_BYPASS` trên public/pilot | R-13/R-02 |
| 08/07 - 22/07 | Coverage report cho auth/RBAC, assignment, SLA, admin | DoD/test risk |
| 08/07 - 22/07 | UAT 1-2 staff với hồ sơ + ticket SLA | R-09 adoption |
| 22/07 - 05/08 | Demo package, seed data, video fallback, `/health` warmup | R-14 demo infra |
| Sau demo | Phase 2 planning bằng baseline 18.5 SP/sprint | R-15 velocity |

**Definition of success trước release:**

- Không còn bypass trên môi trường có người dùng thật.
- Có coverage/evidence package.
- Demo chạy được cả mock fallback và live path.
- Scope Phase 2 được khóa, không lẫn vào Must.
- UAT feedback được ghi thành issue/action.

**Thông điệp chốt:** Risk mitigation biến S3-S4 thành thời gian làm chắc, không phải thời gian "trống".

---

## Slide 40 - Storyboard Tổng Quan

**Tiêu đề:** Luồng trải nghiệm 3 vai: Student, Staff, Admin  
**Nội dung hiển thị:**

| Frame | Vai | Sự kiện | Giá trị thể hiện |
| --- | --- | --- | --- |
| 1 | Student | Đăng nhập, đồng ý consent | Dữ liệu cá nhân có kiểm soát |
| 2 | Student | Tạo hồ sơ, upload minh chứng | Hồ sơ có validation |
| 3 | Staff | Review evidence, approve/reject | Quyết định có lý do |
| 4 | Staff | Chạy assignment suggestion | Rule engine giải thích được |
| 5 | Staff | Confirm/override bed | Ngoại lệ có reason/audit |
| 6 | Student | Xác nhận nhận giường | Không check-in khi chưa đồng ý |
| 7 | Staff | Check-in bằng checklist | Ledger phản ánh thực tế |
| 8 | Student | Tạo ticket sửa chữa | Sự cố có context và priority |
| 9 | Staff | SLA board xử lý ticket | Deadline và assignee rõ |
| 10 | Student | Confirm hoặc reopen | Vòng lặp chất lượng |
| 11 | Admin | Đổi rule/khóa phòng/xem audit | Governance tác động trực tiếp flow |

**Thông điệp chốt:** Storyboard cho thấy một vòng đời vận hành, không phải các màn hình độc lập.

---

## Slide 41 - Story 1: Application State Machine

**Tiêu đề:** Hồ sơ KTX là state machine có guard  
**Nội dung hiển thị:**

**State chính:**

`draft -> submitted -> approved/rejected -> suggested -> waiting_checkin -> checked_in -> checked_out`

| Transition | Guard/điều kiện | Lý do cần guard |
| --- | --- | --- |
| Vào form | Phải consent | Bảo vệ dữ liệu cá nhân |
| Draft -> Submitted | Đủ thông tin, minh chứng, nguyện vọng | Tránh hồ sơ thiếu dữ liệu |
| Submitted -> Approved/Rejected | Staff review, nhập lý do | Quyết định có trách nhiệm |
| Approved -> Suggested | Có giường khả dụng, rule pass | Tránh phân vào giường sai |
| Suggested -> Waiting check-in | Student xác nhận nhận giường | Tránh check-in đơn phương |
| Waiting -> Checked in | Staff hoàn tất checklist | Ledger phản ánh thực tế |
| Checked in -> Checked out | Có lý do/checklist trả phòng | Tránh lệch trạng thái lưu trú |

**Negative case cần demo:**

- Không tick consent -> không vào form.
- Thiếu minh chứng -> không submit.
- Staff duyệt không lý do -> bị chặn.
- Check-in khi SV chưa xác nhận -> không có action hợp lệ.

**Thông điệp chốt:** State machine làm hệ thống đáng tin hơn một form cập nhật trạng thái tự do.

---

## Slide 42 - Story 2: Review -> Assignment -> Check-in

**Tiêu đề:** Staff phân phòng bằng rule, không chọn thủ công mù  
**Nội dung hiển thị:**

| Bước | Staff làm gì | Hệ thống hỗ trợ gì | Bằng chứng giá trị |
| --- | --- | --- | --- |
| 1 | Mở review queue | Lọc hồ sơ chờ duyệt, hiển thị evidence | Staff biết việc cần xử lý |
| 2 | Review hồ sơ | Xem thông tin, minh chứng, priority | Quyết định dựa trên dữ liệu |
| 3 | Approve/reject | Bắt nhập lý do | Có audit và giải thích |
| 4 | Chạy suggestion | Đề xuất giường + reason codes | Không phân phòng cảm tính |
| 5 | Xem alternatives | Thấy lựa chọn khác và constraint | Có không gian xử lý ngoại lệ |
| 6 | Override nếu cần | Bắt chọn giường + nhập reason | Ngoại lệ có trách nhiệm |
| 7 | Check-in | Checklist bàn giao | Ledger cập nhật đúng |

**Rule MVP nên nhấn mạnh:**

- Giới tính/phòng phù hợp.
- Sức chứa và trạng thái giường.
- Không chọn phòng/giường maintenance hold.
- Ưu tiên chính sách.
- Cohort/major fit nếu có dữ liệu.

**Thông điệp chốt:** Điểm mạnh không phải auto-assign 100%, mà là suggestion giải thích được và override có kiểm soát.

---

## Slide 43 - Story 3: Maintenance SLA

**Tiêu đề:** Ticket sửa chữa có SLA runtime và vòng lặp reopen  
**Nội dung hiển thị:**

**State chính:**

`new -> assigned -> in_progress -> waiting_confirm -> reopened -> completed/closed`

| Bước | Quy tắc | Ý nghĩa |
| --- | --- | --- |
| Student tạo ticket | Phải có mô tả, location/equipment, priority | Không mất context |
| Priority -> SLA | Hệ thống tính due time | Deadline không nhập cảm tính |
| Staff assign | Có assignee/status | Ticket không bị bỏ trôi |
| Staff resolve | Chuyển waiting_confirm | Staff không tự đóng thay SV |
| Student confirm | Đóng ticket | Có xác nhận người báo |
| Student reopen | Bắt nhập lý do | Vòng lặp chất lượng |
| Overdue | Tính runtime từ due time | Dashboard phản ánh chậm thật |

**Negative/edge case cần nhớ:**

- Mô tả trống -> chặn.
- Student scan tài sản phòng khác -> backend chặn.
- Ticket đã closed -> không còn nút reopen.
- Backend lỗi -> UI hiện alert và retry, không trắng trang.

**Thông điệp chốt:** SLA biến ticket từ "tin nhắn báo hỏng" thành quy trình có deadline, owner và xác nhận kết quả.

---

## Slide 44 - Story 4: Admin Governance

**Tiêu đề:** Admin config ảnh hưởng trực tiếp nghiệp vụ  
**Nội dung hiển thị:**

| Admin thao tác | Ảnh hưởng đến hệ thống | Guard cần có |
| --- | --- | --- |
| Khóa phòng bảo trì | Phòng biến mất khỏi assignment suggestion | Bắt nhập lý do |
| Đổi trạng thái giường | Ledger và occupancy KPI thay đổi | Không cho ghi đè vô lý |
| Bật/tắt allocation rule | Kết quả suggestion thay đổi | Rule bắt buộc không tắt tùy ý |
| Khóa user/RBAC | User mất quyền truy cập tương ứng | Audit actor/action/time |
| Xem audit/settings | Truy vết thao tác nhạy cảm | Admin-only access |

**Tại sao Admin quan trọng trong demo:**

- Chứng minh rule engine không hard-code cứng trong UI.
- Chứng minh governance ảnh hưởng vận hành staff.
- Chứng minh thao tác nhạy cảm có audit.
- Chứng minh RBAC không chỉ dành cho login.

**Câu chuyện demo ngắn:**

1. Admin khóa một phòng còn trống vì bảo trì.
2. Staff chạy lại suggestion.
3. Phòng đó không còn được đề xuất.
4. Audit ghi lại ai khóa, lúc nào, lý do gì.

**Thông điệp chốt:** Admin governance là lớp kiểm soát làm cho vận hành an toàn hơn, không phải phần phụ.

---

## Slide 45 - Demo Run & Q&A

**Tiêu đề:** Demo first release: chứng minh "không chỉ CRUD"  
**Nội dung hiển thị:**

| Hồi demo | Thời lượng | Nội dung | Điểm nhấn |
| --- | ---: | --- | --- |
| 1. Hồ sơ KTX | 7 phút | Consent -> application -> review -> suggestion -> override/check-in | State machine, reason, ledger |
| 2. Maintenance SLA | 5 phút | Create ticket -> assign SLA -> resolve -> reopen/close | SLA runtime, owner, confirm |
| 3. Admin governance | 5 phút | Lock room/rule/RBAC -> audit -> suggestion thay đổi | Rule/config/audit |
| Q&A | 5-10 phút | Feasibility, risk, demo readiness, scope creep | Trả lời trung thực |

**Tài khoản demo:**

- Student: `student@edu.vn` / `123456`
- Staff: `staff@edu.vn` / `123456`
- Admin: `admin@edu.vn` / `123456`

**Checklist trước demo:**

- Mở `/health` backend trước 2 phút để tránh Azure cold start.
- Mở sẵn 3 cửa sổ ẩn danh cho 3 vai.
- Chuẩn bị 1 hồ sơ chờ duyệt và 1 ticket mới.
- Có video fallback nếu mạng chậm.
- Nhắc rõ: demo đủ first release, hardening cần làm trước pilot thật.

**6 điểm "không chỉ CRUD":**

- State machine có guard.
- Rule engine có reason codes.
- SLA tính runtime.
- RBAC server-side.
- Override/config có audit.
- Dashboard dẫn tới action/list.

**Thông điệp chốt:** Demo cần kết thúc bằng bằng chứng: hệ thống chạy được flow thật, biết chặn sai, biết ghi vết, biết hiển thị việc cần xử lý.
