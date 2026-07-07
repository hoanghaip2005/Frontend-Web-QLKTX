# Risk Management (Digest & Trạng thái thực tế)

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-RISK-MD |
| Version | 1.1 |
| Status | Updated with actuals |
| Owner | Group 3 |
| Updated | 2026-07-06 |
| Source files | `Risk Management Plan.docx` (bản đầy đủ, 2026-06-30); D08 Software Risk Management |

## Tóm tắt

Bản digest của Risk Management Plan: 12 rủi ro R-01→R-12 xếp hạng theo Risk Exposure (RE = P × Impact SP), top 3 là R-03 velocity (RE 14.7), R-10 Phase 2 leak (9.6), R-01 dữ liệu bẩn (8.45). Tài liệu này bổ sung 2 phần bản docx chưa có: **trạng thái thực tế từng rủi ro đến 2026-07-06** (rủi ro nào đã xảy ra, xử lý ra sao — báo trung thực) và **phân tích rủi ro theo 2 hướng A/B** mà nhóm đã phải chọn giữa dự án.

## 1. Risk Register rút gọn (từ bản docx)

| ID | Risk | P | Impact | RE | Ưu tiên | Response chính |
| --- | --- | ---: | ---: | ---: | --- | --- |
| R-03 | Velocity thấp hơn kế hoạch, Sprint 1 quá tải 29 SP | 70% | 21 | 14.70 | Critical | Scope freeze, WIP control, cắt might-have trước |
| R-10 | Phase 2 leak vào MVP | 60% | 16 | 9.60 | High | Release gate: Phase 2 không vào MVP nếu PM chưa duyệt |
| R-01 | Dữ liệu phòng/giường/SV ban đầu bẩn hoặc thiếu | 65% | 13 | 8.45 | High | Import checklist, validation, sample dataset chuẩn |
| R-02 | RBAC/truy cập dữ liệu cá nhân sai phạm vi | 35% | 24 | 8.40 | High | RBAC matrix, negative tests, không export rộng |
| R-05 | Ledger lệch sau assignment/override/check-in-out | 45% | 16 | 7.20 | High | State machine, regression tests |
| R-04 | Luật xếp phòng phình quá mức | 55% | 13 | 7.15 | High | Giới hạn 5 rule giải thích được, không AI/optimization |
| R-11 | Frontend-mock không khớp backend sau này | 45% | 13 | 5.85 | Medium | Monitor mỗi sprint (xem mục 3 - hướng A/B) |
| R-09 | Staff tiếp tục dùng Excel/Zalo | 50% | 10 | 5.00 | Medium | Flow ngắn, dashboard hành động được |
| R-06 | QR không ổn định / payload lộ dữ liệu | 45% | 8 | 3.60 | Medium | Payload chỉ chứa business id; fallback chọn tay |
| R-07 | SLA state sai / thiếu reopen | 40% | 8 | 3.20 | Medium | Test vòng đời ticket đầy đủ |
| R-08 | Dashboard trang trí, không hành động được | 35% | 8 | 2.80 | Low | Mỗi KPI phải link record list |
| R-12 | Figma/Jira/docs/code lệch nhau (7 người) | 45% | 5 | 2.25 | Low | Ownership folder + sync định kỳ |

## 2. Trạng thái thực tế đến 2026-07-06 (giữa Sprint 2)

Nguyên tắc báo cáo: **rủi ro đã xảy ra thì ghi nhận là đã xảy ra**, kèm cách xử lý và bằng chứng — không làm đẹp số liệu.

| ID | Thực tế | Kết cục | Bằng chứng |
| --- | --- | --- | --- |
| R-03 | **Không xảy ra theo chiều xấu — ngược lại**: velocity thực tế vượt kế hoạch, scope Sprint 3-4 (US-011→US-014) hoàn thành ngay trong Sprint 2 nhờ dev có AI hỗ trợ + tách backend/frontend song song | ✅ Đóng (chiều ngược) | Traceability matrix: 13/13 US demo được; E2E 30/30 |
| R-10 | **ĐÃ XẢY RA**: tích hợp MoMo payment (thuộc US-023 deferred!) và notification in-app (US-018 Phase 2) được đưa vào sớm không qua change control | ⚠️ Materialized — cần PM hồi tố vào change log; không ảnh hưởng fixed date vì Must Have đã xong | Commit `feat: add momo payment integration` |
| R-01 | Không xảy ra: dùng seed dataset chuẩn theo data contract ngay từ đầu | ✅ Mitigated | `database/local-dev-seed.sql`, seed demo prod |
| R-02 | Kiểm soát tốt ở tầng RBAC (negative tests 403 pass). **Phát sinh rủi ro mới R-13**: `DEV_AUTH_BYPASS` đang bật trên production | ⚠️ Một phần — xem R-13 | E2E: 4 negative case pass |
| R-05 | **ĐÃ XẢY RA đúng dự báo**: 2 bug thật — (a) SQL param suy 2 kiểu enum/text làm review/status/checkout lỗi 500; (b) engine gợi ý so mã giường thiếu chuẩn hóa → gợi ý giường đã có người | ✅ Phát hiện qua test, đã fix, có regression test | Commit `fix(api): SQL param type conflicts...`; E2E T6 |
| R-04 | Giữ đúng 5 rule (giới tính, sức chứa, bảo trì, ưu tiên, khóa/ngành) | ✅ Kiểm soát | `/api/allocation-rules` |
| R-11 | **ĐÃ XẢY RA một phần**: mock contract lệch backend thật (enum, bed code) → nhóm quyết định chuyển hướng B (tích hợp sớm), thêm tầng mapper cách ly | ✅ Giải quyết bằng pivot — xem mục 3 | `src/lib/api/mappers.ts` |
| R-06 | QR scan hoạt động + chặn đúng phạm vi (SV không quét được tài sản phòng khác) | ✅ Pass | E2E T10 |
| R-07 | Vòng đời ticket gồm reopen chạy đúng end-to-end | ✅ Pass | Demo run KB2: 6/6 bước |
| R-08 | Mọi KPI dẫn tới danh sách xử lý | ✅ Mitigated | UI dashboard 3 role |
| R-09 | Chưa đo được (chưa pilot với staff thật) | 🟡 Open — giữ nguyên | — |
| R-12 | **ĐÃ XẢY RA nhẹ**: docs mô tả "mock-only" trong khi code đã nối backend; prototype-spec lệch handoff về mobile frame | ✅ Đã đồng bộ + lập traceability matrix làm neo | Sync notes 2026-07-03/06 |

### Rủi ro mới phát sinh (bổ sung register)

| ID | Risk | P | Impact | RE | Response |
| --- | --- | ---: | ---: | ---: | --- |
| R-13 | `DEV_AUTH_BYPASS` bật trên Azure production — ai biết header có thể mạo danh user | 90% (đang tồn tại) | 16 | 14.4 | Trước khi có người dùng thật: phát hành JWT thật từ `/auth/login`, tắt bypass. Chấp nhận tạm cho demo môn học |
| R-14 | Azure App Service (free tier) ngủ → demo trước lớp bị treo 30-60s đầu | 50% | 5 | 2.5 | Mở `/health` trước giờ demo 2 phút (đã ghi vào demo checklist) |
| R-15 | Velocity hiện tại dựa vào AI-assisted dev — không bền vững nếu quay về thủ công 100% | 40% | 8 | 3.2 | Không dùng velocity đột biến làm baseline Phase 2; ước lượng Phase 2 giữ 18.5 SP/sprint |

## 3. Phân tích rủi ro theo 2 hướng A/B

Giữa dự án (đầu Sprint 2) nhóm đứng trước lựa chọn thực sự, gắn với R-11:

### Hướng A — Giữ kế hoạch gốc: frontend mock đến hết MVP, nối backend sau release

| Rủi ro nếu đi hướng A | P | Impact | Nhận định |
| --- | --- | ---: | --- |
| Big-bang integration cuối kỳ: contract mock lệch backend, dồn sửa vào Sprint 4 | Cao (đã thấy lệch enum/bed-code thật) | 13-16 SP | Chính là R-11 ở mức xấu nhất |
| Demo "không thật": thầy/khách hàng chất vấn dữ liệu giả, khó chứng minh PoC hạ tầng | Trung bình | 8 | Ảnh hưởng điểm vấn đáp |
| Bug backend (SQL enum, suggestion) chỉ lộ khi chạy DB thật → phát hiện quá muộn | Cao | 13 | 2 bug này có thật — hướng A sẽ gặp chúng ở tuần cuối |
| Ít việc tích hợp cho thành viên backend trong giai đoạn giữa | Trung bình | 5 | Lãng phí năng lực song song |

### Hướng B — Tích hợp backend + deploy Azure sớm (nhóm ĐÃ CHỌN, từ 2026-07-03)

| Rủi ro nếu đi hướng B | P | Impact | Thực tế đã xảy ra? |
| --- | --- | ---: | --- |
| Scope creep: có hạ tầng thật dễ "tiện tay" kéo Phase 2/deferred vào (MoMo, notifications) | Cao | 16 | **Đã xảy ra** (R-10) — cần change control hồi tố |
| Lỗ hổng bảo mật tạm (dev bypass) tồn tại trên môi trường public | Chắc chắn | 16 | **Đang tồn tại** (R-13) — chấp nhận có thời hạn |
| Phụ thuộc hạ tầng ngoài (Azure ngủ, Supabase latency) khi demo | Trung bình | 5 | Ghi nhận (R-14), có checklist |
| Thời gian polish UI bị chia cho việc tích hợp | Trung bình | 5 | Có — UI phải làm 2 pass |

### Kết luận A/B

Nhóm chọn **hướng B**: trả trước rủi ro tích hợp (R-11 từ RE 5.85 → ~0 sau khi mapper + E2E chạy), phát hiện sớm 2 bug chỉ lộ trên DB thật, và có bản phát hành chạy thật đúng yêu cầu "release đầu tiên đủ xài". Cái giá phải trả — R-10 materialized và R-13 mới — được ghi nhận công khai kèm kế hoạch xử lý, thay vì che đi. Nếu đi hướng A, 2 bug backend và độ lệch contract sẽ dồn vào Sprint 4 ngay trước ngày chốt 2026-08-05, rủi ro trễ release cao hơn đáng kể.

## 4. Theo dõi tiếp (tuần 10 → release 2026-08-05)

- R-13: quyết định thời điểm tắt bypass (đề xuất: ngay sau vấn đáp, trước pilot).
- R-10: PM lập change log hồi tố cho MoMo/notifications; quyết định giữ ở nhánh demo hay gate lại.
- R-09: lên kịch bản UAT với 1-2 staff thật trong tuần đệm trước release.
- R-15: chốt velocity baseline Phase 2 = 18.5 SP/sprint (không dùng số đột biến).
