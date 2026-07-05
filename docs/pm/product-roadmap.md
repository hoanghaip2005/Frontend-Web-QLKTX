# Product Roadmap

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-ROADMAP |
| Version | 1.0 |
| Status | Draft for review |
| Owner | Group 3 |
| Updated | 2026-06-21 |
| Source files | `docs/project-overview.md`; `docs/product-backlog.md`; `docs/proof-of-concept.md`; [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2) |

## Purpose

Product roadmap mô tả chuỗi các bản phát hành để đạt tầm nhìn sản phẩm DormCare Hub. Theo [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2), mỗi bản phát hành nên tập trung vào một nhóm Minimum Releasable Features (MRFs) có giá trị rõ ràng và được stakeholder đồng thuận.

Roadmap này không phải deadline cứng cho toàn bộ backlog. Nó chia sản phẩm thành các release tăng dần: MVP để demo core dormitory lifecycle, Phase 2 để tăng readiness cho pilot, và Phase 3 cho tích hợp ngoài hệ thống.

## Product Vision Alignment

DormCare Hub hướng tới một nền tảng quản lý ký túc xá tập trung thay thế Excel, giấy tờ, Zalo messages và báo cáo thủ công. MVP ưu tiên một room/bed ledger đáng tin cậy, application status minh bạch, assignment rule có thể giải thích, maintenance ticket có SLA, và dashboard KPI có hành động.

## Roadmap Overview

| Release | Target Window | MRF Theme | Backlog IDs | SP | Business Goal |
| --- | --- | --- | --- | ---: | --- |
| Release 1 - MVP | 2026-06-10 to 2026-08-05 | Core dormitory lifecycle | `US-001` to `US-006`, `US-008` to `US-014` | 74 | Demo được luồng student application -> approval -> assignment -> check-in/out và maintenance -> SLA -> dashboard. |
| Release 2 - Pilot Readiness | After MVP validation | Operational readiness and reporting | `US-007`, `US-015` to `US-021` | 43 | Tăng khả năng chạy pilot bằng QR lookup, KPI drilldown, fees/debt, notification, import/export, audit/reporting. |
| Release 3 - External Expansion | After institutional approval | External integrations and native app | `US-022`, `US-023`, `US-024` | 0 in MVP backlog | Chuẩn bị SIS sync, payment gateway và native mobile app khi có quyền, pháp lý và ngân sách. |

## Release 1 - MVP MRFs

| MRF | Backlog IDs | Value Delivered | Decision Gate |
| --- | --- | --- | --- |
| Role-based access and privacy consent | `US-001`, `US-002` | Người dùng vào đúng portal; student biết cách dữ liệu cá nhân được xử lý. | RBAC negative cases pass. |
| Student application and approval | `US-003`, `US-004`, `US-005` | Sinh viên nộp hồ sơ, staff duyệt, kết quả hiển thị minh bạch. | Application flow demoable with sample data. |
| Room/bed ledger and stay status | `US-006`, `US-010` | Có một source of truth cho phòng, giường, check-in/out. | Ledger consistency after state changes. |
| Assignment suggestion and override | `US-008`, `US-009` | Staff có gợi ý phân phòng kèm lý do và override có trace. | PoC rule engine meets explainability threshold. |
| Maintenance and SLA | `US-011`, `US-012`, `US-013` | Sinh viên báo lỗi; staff/maintenance xử lý theo SLA; sinh viên confirm/reopen. | SLA state correctness passes PoC tests. |
| Operations dashboard | `US-014` | Management thấy occupancy, pending applications, overdue tickets và risks. | Every KPI links to actionable record list. |

## Release 2 - Pilot Readiness MRFs

| MRF | Backlog IDs | Value Delivered | Risk/Dependency |
| --- | --- | --- | --- |
| QR and KPI drilldown | `US-007`, `US-015` | QR lookup và dashboard drill-down giúp thao tác nhanh hơn. | QR payload must avoid sensitive data exposure. |
| Fees and debt tracking | `US-016`, `US-017` | Ghi chỉ số tiện ích, tính phí, statement và payment tracking thủ công. | Fee rules and access control need stakeholder review. |
| Notification center | `US-018` | Student nhận thông báo khi application, room, fee hoặc ticket thay đổi. | Notification content must respect privacy. |
| Data import and audit | `US-019`, `US-020` | Import sample/pilot data từ Excel và ghi lại thao tác nhạy cảm. | Import validation and audit retention rules required. |
| Export reporting | `US-021` | Xuất PDF/Excel report phục vụ quản lý và lưu trữ. | Broad export requires permission review. |

## Release 3 - Deferred Integrations

| Deferred Item | Backlog ID | Reason for Deferral | Roadmap Decision |
| --- | --- | --- | --- |
| Real SIS sync | `US-022` | Requires institutional integration and permissions beyond MVP. | Treat as separate integration project. |
| Real payment gateway | `US-023` | Legal, financial, and security complexity is outside MVP. | Keep manual payment tracking in Phase 2 first. |
| Native mobile app | `US-024` | MVP prioritizes responsive web for faster delivery. | Revisit after responsive student portal is validated. |

## Roadmap Review Cadence

| Review Point | Timing | Questions |
| --- | --- | --- |
| PoC review | Before or during Sprint 1 | Are assignment, QR context, SLA, and dashboard assumptions viable? |
| Sprint review | End of every sprint | Which MRFs are demonstrably complete? What scope changed? |
| MVP release review | 2026-08-05 | Is Release 1 demo-ready? Which Phase 2 items are justified by feedback? |
| Phase 2 planning | After MVP | Should QR/drilldown become first Phase 2 slice? Are fees/debt/reporting still priority? |

## Roadmap Governance

- Product Owner / BA owns priority and acceptance criteria.
- Scrum Master tracks sprint/release progress and scope changes.
- Tech Lead validates architecture, data model, RBAC, and integration risk.
- QA verifies Definition of Done and evidence package per sprint.
- Stakeholders approve moving Phase 2 or deferred items into active release scope.

## Summary

The roadmap protects the MVP by keeping Release 1 focused on 74 SP of Must Have work. Release 2 contains 43 SP of pilot-readiness features that improve operations but are not required for the first demo. Release 3 keeps SIS, payment gateway, and native mobile explicit but deferred so the team does not silently expand MVP scope.
