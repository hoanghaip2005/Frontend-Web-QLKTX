# Project Documentation Review

| Field | Value |
| --- | --- |
| Project | DormCare Hub / QLKTX |
| Session title | Project documentation review |
| Status | Completed after interrupted Claude session |
| Owner | Group 3 |
| Updated | 2026-07-07 |

## Tóm tắt

Phiên Claude trước đã bổ sung nhiều tài liệu PM nhưng bị gián đoạn, để lại trạng thái chưa khép kín: một số file được README tham chiếu bị thiếu, hai file tracked bị xóa khỏi working tree, và bộ slide mới cần một index rõ để nhóm dùng tiếp. Review này hoàn thiện lại bộ tài liệu theo hướng: giữ các nội dung bổ sung hữu ích, phục hồi link gãy, thêm deck plan 45 slide và ghi rõ các điểm còn phải hardening trước pilot.

## Kết quả rà soát

| Nhóm tài liệu | Trạng thái sau review | Ghi chú |
| --- | --- | --- |
| Core PM docs | OK | `project-overview`, backlog, estimate, roadmap, release plan, DoD đều có phần Tóm tắt. |
| PoC / Traceability | OK | PoC đã chuyển sang executed PASS; traceability bám 13 Must story. |
| Demo / Figma | Restored | `demo-script-test-scenarios.md` và `figma-implementation-guide.md` bị xóa trong working tree, đã thêm lại. |
| Progress / Risk | OK | `risk-management.md` có R-13/R-15; `progress-report-week10.md` ghi tiến độ, velocity, phần chưa OK. |
| Presentation | OK | `presentation-deck-plan-45-slides.md` là bản kế hoạch; `presentation-render-content-45-slides.md` là bản chỉ chứa nội dung hiển thị để render ảnh/PPTX. |
| README index | Updated | Loại link thừa/trùng, thêm review doc và deck 45 slide. |

## Những quyết định nội dung đã chốt

- Deck chính là `presentation-deck-plan-45-slides.md`, 45 slide, chia theo 7 thành viên và vẫn nằm trong yêu cầu 30-50 slide.
- First release được mô tả là "đủ dùng cho demo/first release", không gọi là production-ready.
- Known gaps phải nói thẳng: `DEV_AUTH_BYPASS`, coverage 70% chưa đo, QR camera/import/export chưa làm, scope creep MoMo/notification.
- Risk A/B dùng quyết định thật: chọn hướng B (tích hợp backend/Azure sớm) để trả rủi ro integration trước.
- Các PM docs vẫn là Markdown source of truth; Word/PDF nếu cần sẽ export từ bộ này.

## Link quan trọng

| Nhu cầu | File |
| --- | --- |
| Đọc tổng quan dự án | `project-overview.md` |
| Xem backlog và release scope | `product-backlog.md`, `release-plan-fixed-date.md` |
| Chứng minh tiến độ | `progress-report-week10.md`, `assets/*.svg` |
| Chứng minh test/PoC | `proof-of-concept.md`, `implementation-traceability.md` |
| Chuẩn bị demo | `demo-script-test-scenarios.md` |
| Chuẩn bị thuyết trình | `presentation-deck-plan-45-slides.md`, `presentation-render-content-45-slides.md` |
| Trả lời risk | `risk-management.md` |

## Remaining follow-up

- Nếu nhóm muốn render ảnh/PPTX bằng GPT Plus, dùng `presentation-render-content-45-slides.md`; nếu cần phân công/nói nhịp, dùng `presentation-deck-plan-45-slides.md`.
- Nếu muốn chốt release/pilot thật, xử lý trước `DEV_AUTH_BYPASS`, coverage report, UAT staff thật và change log cho scope creep.
- Nếu cần Figma write thật, dùng `figma-implementation-guide.md` sau khi có connector OAuth phù hợp.
