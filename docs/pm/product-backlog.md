# Product Backlog

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-BACKLOG |
| Version | 1.0 |
| Status | Draft for review |
| Owner | Group 3 |
| Updated | 2026-06-02 |
| Source files | `Group3_DormCare_Hub_Product_Backlog.docx`; `Group3 _DormCare_Hub Tầm Nhìn & Phạm Vi Dự Án.docx` |

## Tóm tắt

Backlog 24 item / 117 SP, chia theo MoSCoW: 13 Must (74 SP) cho MVP, 7 Should (38 SP) cho Phase 2, 1 Could (5 SP), 3 Won't (deferred). Hai luồng demo-critical: hồ sơ (US-001→US-010) và sửa chữa + dashboard (US-011→US-014). Mỗi story có traceability tới màn hình prototype và điều kiện vào sprint (acceptance criteria + test data rõ).

## Backlog Summary

The backlog contains 24 items and 117 story points. The MVP is scoped around two demo-critical flows:

1. Student application -> approval -> assignment -> check-in/out.
2. Maintenance ticket -> SLA handling -> dashboard visibility.

| Classification | Count | Story Points | MVP Meaning |
| --- | ---: | ---: | --- |
| Must Have | 13 | 74 | Required for MVP demo and core course scope. |
| Should Have | 7 | 38 | Useful for pilot readiness but can move to Phase 2. |
| Could Have | 1 | 5 | Nice-to-have reporting/export enhancement. |
| Won't Have in MVP | 3 | 0 | Explicitly deferred to Phase 3 or separate integration. |
| Total | 24 | 117 | Full backlog baseline. |

## MVP Backlog

| ID | Epic | User Story | Priority | SP | Sprint | Traceability |
| --- | --- | --- | --- | ---: | --- | --- |
| US-001 | Platform & RBAC | As a system user, I want to log in with the correct role so I only access authorized data and functions. | M | 5 | Sprint 1 | Login/RBAC prototype; DoD access-control checks. |
| US-002 | Platform & RBAC | As a student, I want to understand how my personal data is collected and processed before submitting an application. | M | 3 | Sprint 1 | Consent screen; privacy DoD. |
| US-003 | Application & Approval | As a student, I want to create a dormitory application, enter required information, choose preferences, and upload evidence. | M | 8 | Sprint 1 | Student Application screen. |
| US-004 | Application & Approval | As a student, I want to view my application status, approval result, and assigned room/bed information. | M | 5 | Sprint 1 | Application Status screen. |
| US-005 | Application & Approval | As dormitory staff, I want to review evidence and update approval status so students can track the result. | M | 5 | Sprint 2 | Admin Review screen. |
| US-006 | Room/Bed Ledger | As dormitory staff, I want one room/bed ledger to track each building, floor, room, and bed status. | M | 8 | Sprint 1 | Room/Bed Ledger screen; PoC ledger dataset. |
| US-008 | Room Assignment | As dormitory staff, I want the system to suggest suitable room/bed placement using transparent rules. | M | 8 | Sprint 2 | Assignment Suggestion screen; PoC rule engine. |
| US-009 | Room Assignment | As dormitory staff, I want to override a suggested room/bed and record the reason for real-world exceptions. | M | 3 | Sprint 2 | Override modal; DoD evidence. |
| US-010 | Room/Bed Ledger | As dormitory staff, I want to record check-in and check-out so the ledger reflects reality. | M | 5 | Sprint 2 | Check-in/out state in ledger. |
| US-011 | Maintenance & SLA | As a student, I want to submit an issue with photo/description tied to the correct room or equipment. | M | 8 | Sprint 3 | Maintenance Ticket screen; QR PoC. |
| US-012 | Maintenance & SLA | As dormitory staff, I want to classify, assign, and set due dates so tickets are not lost. | M | 5 | Sprint 3 | SLA Board screen. |
| US-013 | Maintenance & SLA | As a student, I want to confirm resolution or reopen the issue if it is not fixed. | M | 3 | Sprint 3 | Ticket detail status flow. |
| US-014 | Dashboard | As dormitory management or Student Affairs, I want an operations dashboard to detect overload, pending applications, and overdue tickets. | M | 8 | Sprint 4 | Operations Dashboard screen; dashboard PoC. |

## Should/Could Backlog

| ID | Epic | User Story | Priority | SP | Target |
| --- | --- | --- | --- | ---: | --- |
| US-007 | Room/Bed Ledger | QR lookup for room, bed, or equipment. | S | 5 | Sprint 3 if QR is needed beyond ticket creation. |
| US-015 | Dashboard | Drill down from KPI to related records and act immediately. | S | 5 | Sprint 4 or Phase 2. |
| US-016 | Fees & Debt | Record utility readings and calculate/share fees. | S | 8 | Phase 2. |
| US-017 | Fees & Debt | Track debt and manual payment status. | S | 5 | Phase 2. |
| US-018 | Notification | Notify students when application, room, fee, or ticket status changes. | S | 5 | Phase 2. |
| US-019 | Import/Export | Import building, room, bed, and student data from Excel. | S | 5 | Phase 2. |
| US-020 | Audit & Security | Store sensitive operation history for access and export control. | S | 5 | Phase 2. |
| US-021 | Reporting | Export summary reports to PDF/Excel. | C | 5 | Phase 2. |

## Explicitly Deferred

| ID | Epic | Item | Reason |
| --- | --- | --- | --- |
| US-022 | External Integration | Sync real SIS data. | Requires institutional integration and permissions beyond MVP. |
| US-023 | External Integration | Real payment gateway. | Legal, financial, and security complexity is outside MVP. |
| US-024 | Mobile | Native mobile app. | MVP prioritizes responsive web for faster delivery. |

## Backlog Rules

- A user story cannot enter Sprint Planning unless its acceptance criteria and test data are clear.
- Must Have stories must be demoable with sample dormitory data.
- Security-sensitive stories must include negative cases, especially cross-role data access.
- Dashboard stories are accepted only when each KPI links to a concrete action or record list.
- Any scope expansion must be logged through the change-control flow in the Vision & Scope document.

