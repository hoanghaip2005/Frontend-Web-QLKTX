# High-Level Estimate

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-HLE |
| Version | 1.0 |
| Status | Draft for review |
| Owner | Group 3 |
| Updated | 2026-06-21 |
| Source files | `docs/product-backlog.md`; `docs/project-overview.md`; [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2) |

## Tóm tắt

Ước lượng bằng 2 phương pháp: (1) relative sizing story point thang Fibonacci với baseline 3 SP, tổng 117 SP toàn backlog / 74 SP MVP; (2) three-point PERT theo epic để kiểm chứng chéo (chi tiết mục "Phương pháp 2"). Velocity kế hoạch 18.5 SP/sprint → MVP 8 tuần (4 sprint), full backlog 12-14 tuần. Hai phương pháp cho kết quả lệch nhau <10%, củng cố độ tin cậy ước lượng.

## Purpose

Tài liệu này tạo ước lượng cấp cao cho DormCare Hub dựa trên product backlog hiện có. High-level estimate được dùng để trả lời sớm các câu hỏi: MVP mất khoảng bao lâu, phạm vi nào nằm trong release đầu tiên, phần nào nên chuyển Phase 2, và rủi ro ước lượng nằm ở đâu.

Theo nội dung [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2), high-level estimate không phải cam kết chính xác tuyệt đối. Nhóm dùng ước lượng tương đối bằng story points và dãy Fibonacci để so sánh độ lớn giữa các user stories. Story point phản ánh effort, complexity, risk và uncertainty, không quy đổi cứng thành giờ công.

## Estimation Method

| Item | DormCare Application |
| --- | --- |
| Sizing method | Relative sizing with Fibonacci-like scale `1, 2, 3, 5, 8, 13`. |
| Baseline size | 3 SP stories như `US-002`, `US-009`, `US-013` có phạm vi hẹp và ít trạng thái. |
| Medium stories | 5 SP stories có workflow, quyền truy cập hoặc state transition như `US-001`, `US-005`, `US-012`. |
| Large stories | 8 SP stories có nhiều dữ liệu, nhiều trạng thái hoặc phụ thuộc module như `US-003`, `US-006`, `US-008`, `US-011`, `US-014`, `US-016`. |
| Forecast unit | Team velocity, không phải năng suất cá nhân. |
| Sprint length | 2 weeks per sprint. |

## Backlog Estimate Summary

| Classification | Count | Story Points | Planning Meaning |
| --- | ---: | ---: | --- |
| Must Have | 13 | 74 | Required for MVP release and final demo. |
| Should Have | 7 | 38 | Valuable for pilot readiness, movable to Phase 2. |
| Could Have | 1 | 5 | Optional reporting/export enhancement. |
| Won't Have in MVP | 3 | 0 | Explicitly deferred to Phase 3 or separate integration. |
| Total | 24 | 117 | Full backlog baseline. |

## Estimate by Epic

| Epic | MVP SP | Phase 2 SP | Deferred SP | Total SP | Estimate Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Platform & RBAC | 8 | 0 | 0 | 8 | Foundation for access control and consent. |
| Application & Approval | 18 | 0 | 0 | 18 | Core student application and staff review flow. |
| Room/Bed Ledger | 13 | 5 | 0 | 18 | Ledger is MVP; QR lookup can move to Phase 2. |
| Room Assignment | 11 | 0 | 0 | 11 | Suggestion engine and override reason are required for traceability. |
| Maintenance & SLA | 16 | 0 | 0 | 16 | Ticket creation, SLA board, confirm/reopen flow. |
| Dashboard | 8 | 5 | 0 | 13 | MVP dashboard first; KPI drilldown can move to Phase 2. |
| Fees & Debt | 0 | 13 | 0 | 13 | Utility readings, fee calculation, debt tracking are Phase 2. |
| Notification | 0 | 5 | 0 | 5 | Status notifications are pilot-readiness work. |
| Import/Export | 0 | 5 | 0 | 5 | Excel import supports setup/pilot readiness. |
| Audit & Security | 0 | 5 | 0 | 5 | Sensitive-operation history is Phase 2. |
| Reporting | 0 | 5 | 0 | 5 | PDF/Excel export is Could Have for Phase 2. |
| External Integration | 0 | 0 | 0 | 0 | SIS and payment gateway are deferred without MVP SP. |
| Mobile | 0 | 0 | 0 | 0 | Native mobile app is deferred; MVP uses responsive web. |
| Total | 74 | 43 | 0 | 117 | Matches `docs/product-backlog.md`. |

## MVP Sprint Estimate

| Sprint | User Stories | Story Points | Main Delivery Theme |
| --- | --- | ---: | --- |
| Sprint 1 | `US-001`, `US-002`, `US-003`, `US-004`, `US-006` | 29 | Foundation, consent, application form/status, room-bed ledger. |
| Sprint 2 | `US-005`, `US-008`, `US-009`, `US-010` | 21 | Staff review, assignment suggestion, override, check-in/out. |
| Sprint 3 | `US-011`, `US-012`, `US-013` | 16 | Maintenance ticket, SLA board, confirm/reopen. |
| Sprint 4 | `US-014` | 8 | Operations dashboard for management visibility. |
| Total | 13 Must Have stories | 74 | MVP release baseline. |

## Velocity and Duration Forecast

| Forecast Item | Calculation | Result |
| --- | --- | --- |
| MVP average velocity | `74 SP / 4 sprint` | `18.5 SP/sprint` |
| MVP duration | `4 sprint x 2 weeks` | `8 weeks` |
| Full backlog sprint count | `117 SP / 18.5 SP/sprint` | `6.3 sprint` |
| Full backlog duration | Round up and include planning/review buffer | `12-14 weeks` |
| Phase 2 estimate | `43 SP / 18.5 SP/sprint` | About `2.3 sprint`, rounded to `3 sprint` planning buffer. |

## Phương pháp 2 - Three-Point (PERT) theo epic

Để kiểm chứng chéo kết quả story point, nhóm ước lượng lần hai bằng three-point estimation theo epic MVP, đơn vị **ngày-người** (person-day), công thức `E = (O + 4M + P) / 6`:

| Epic (MVP) | O (lạc quan) | M (khả dĩ) | P (bi quan) | E (ngày-người) |
| --- | ---: | ---: | ---: | ---: |
| Platform & RBAC | 3 | 5 | 8 | 5.2 |
| Application & Approval | 8 | 12 | 18 | 12.3 |
| Room/Bed Ledger | 6 | 9 | 14 | 9.3 |
| Room Assignment | 5 | 8 | 13 | 8.2 |
| Maintenance & SLA | 7 | 11 | 16 | 11.2 |
| Dashboard | 4 | 6 | 9 | 6.2 |
| Tổng thực thi | | | | **52.4** |
| Buffer tích hợp/QA/review 15% | | | | 7.8 |
| **Tổng MVP (PERT)** | | | | **≈ 60 ngày-người** |

Quy đổi lịch: nhóm 7 sinh viên part-time, năng lực thực tế ước ~1.5-1.9 ngày-người/ngày lịch → 60 ngày-người ≈ **7.5-8.5 tuần**.

### So sánh 2 phương pháp

| Phương pháp | Kết quả MVP | Ghi chú |
| --- | --- | --- |
| Story point + velocity (PP1) | 74 SP / 18.5 SP/sprint = **8 tuần** | Chuẩn lập kế hoạch sprint |
| Three-point PERT (PP2) | ≈ 60 ngày-người = **7.5-8.5 tuần** | Kiểm chứng độc lập theo effort |
| Độ lệch | **< 10%** | Hai phương pháp hội tụ → ước lượng 8 tuần đủ tin cậy để cam kết fixed date 2026-08-05 |

## Estimate Confidence

| Area | Confidence | Reason |
| --- | --- | --- |
| MVP scope | Medium-High | Must Have stories are already mapped to prototype and Jira sprint plan. |
| Assignment engine | Medium | PoC must validate rule usefulness and explainability. |
| QR maintenance context | Medium | QR mapping accuracy must pass PoC threshold. |
| Dashboard KPI | Medium | KPI must link to actionable record lists, not decorative charts. |
| Phase 2 fees/debt/reporting | Medium-Low | More rules, data validation, and access control decisions remain. |
| External integrations | Low for MVP | SIS/payment/native app are intentionally deferred. |

## Conclusion

The high-level estimate supports an 8-week MVP release if the team protects the Must Have scope and uses the 4-sprint Jira plan as the baseline. The full 117 SP backlog should not be promised inside the MVP window. Phase 2 adds about 43 SP and should be planned as a later pilot-readiness release after MVP validation.

