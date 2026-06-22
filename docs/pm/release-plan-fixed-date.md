# Release Plan - Fixed Date

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-RELEASE-FD |
| Version | 1.0 |
| Status | Draft for review |
| Owner | Group 3 |
| Updated | 2026-06-21 |
| Source files | `docs/product-backlog.md`; `docs/definition-of-done.md`; `docs/proof-of-concept.md`; Jira board `SLMBOCDQKN`; [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2) |

## Purpose

This document defines the fixed-date release plan for DormCare Hub MVP. Theo [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2), fixed-date planning giữ ngày phát hành cố định và để scope linh hoạt. Nhóm dùng velocity range để phân loại will-have, might-have và won't-have thay vì cam kết toàn bộ backlog.

## Release Constraint

| Constraint | Decision |
| --- | --- |
| Release type | Fixed-date release plan. |
| Fixed date | MVP release target: `2026-08-05`. |
| Start date | `2026-06-10`. |
| Sprint length | 2 weeks. |
| Number of sprints | 4 MVP sprints. |
| Fixed budget/team assumption | Group 3 student team; no scope expansion by adding people mid-release. |
| Flexible variable | Scope beyond Must Have can move out of MVP. |

## Velocity Range

| Velocity Type | Value | Meaning |
| --- | ---: | --- |
| Planned average velocity | 18.5 SP/sprint | `74 SP / 4 sprint`. |
| Slower velocity | 16 SP/sprint | Conservative line based on Sprint 3 capacity. |
| Faster velocity | 21 SP/sprint | Optimistic line based on Sprint 2 capacity; Sprint 1 is foundation-heavy and should not be treated as normal velocity. |
| Will-have capacity | `16 x 4 = 64 SP` | Work safely inside this line is very likely. |
| Might-have capacity | `21 x 4 = 84 SP` | Work between 64 and 84 SP may fit if risk stays low. |

The MVP Must Have scope is 74 SP. It sits between the slower and faster velocity lines, so the plan is feasible but needs active scope control, PoC validation, and no unapproved Phase 2 work during the MVP window.

## Fixed-Date Sprint Map

| Sprint | Dates | Jira Sprint | User Stories | SP | Release Goal |
| --- | --- | --- | --- | ---: | --- |
| Sprint 1 | 2026-06-10 to 2026-06-24 | `DCH MVP Sprint 1` | `US-001`, `US-002`, `US-003`, `US-004`, `US-006` | 29 | Establish RBAC, consent, application form/status, and room-bed ledger. |
| Sprint 2 | 2026-06-24 to 2026-07-08 | `DCH MVP Sprint 2` | `US-005`, `US-008`, `US-009`, `US-010` | 21 | Complete review, assignment suggestion, override reason, and check-in/out. |
| Sprint 3 | 2026-07-08 to 2026-07-22 | `DCH MVP Sprint 3` | `US-011`, `US-012`, `US-013` | 16 | Deliver maintenance ticket, SLA board, and confirm/reopen flow. |
| Sprint 4 | 2026-07-22 to 2026-08-05 | `DCH MVP Sprint 4` | `US-014` | 8 | Deliver operations dashboard and stabilize demo readiness. |
| Total | 8 weeks | Jira board `SLMBOCDQKN` | 13 Must Have stories | 74 | MVP release. |

## Will-Have / Might-Have / Won't-Have

| Category | Backlog IDs | SP | Rationale |
| --- | --- | ---: | --- |
| Will-have for MVP | `US-001`, `US-002`, `US-003`, `US-004`, `US-005`, `US-006`, `US-008`, `US-009`, `US-010`, `US-011`, `US-012`, `US-013`, `US-014` | 74 | Must Have stories required for demo-critical flows. |
| Might-have if capacity remains | `US-007`, `US-015` | 10 | QR lookup and KPI drilldown improve demo, but are Should Have and must not displace MVP scope. |
| Won't-have for MVP | `US-016`, `US-017`, `US-018`, `US-019`, `US-020`, `US-021` | 33 | Phase 2 pilot-readiness scope: fees, debt, notification, import, audit, reporting/export. |
| Deferred from MVP | `US-022`, `US-023`, `US-024` | 0 | SIS sync, payment gateway, and native mobile app require separate approval/integration. |

## Release Readiness Checklist

| Readiness Area | Required Evidence | Source |
| --- | --- | --- |
| Backlog readiness | Must Have stories have acceptance criteria, sample data, and sprint target. | `docs/product-backlog.md` |
| Definition of Done | Requirement, scope, UI/UX, code, tests, QA, security, data, documentation, and demo checks satisfied. | `docs/definition-of-done.md` |
| PoC validation | Assignment suggestion, QR context, SLA state, and dashboard KPI assumptions pass thresholds or are simplified. | `docs/proof-of-concept.md` |
| Prototype alignment | MVP flow is represented in Figma prototype screens. | `docs/prototype-spec.md` |
| Jira execution | 4 MVP sprints exist and include the correct Must Have issues. | Jira board `SLMBOCDQKN` |
| Demo data | Applications, rooms/beds, assignments, tickets, and dashboard KPIs can be reproduced. | Sample data/evidence package per sprint. |

## Release Risk Controls

| Risk | Control |
| --- | --- |
| Sprint 1 is overloaded at 29 SP. | Keep Sprint 1 focused on foundation and sample data; do not add Phase 2 work. |
| Assignment rules expand beyond MVP. | Limit to explainable rules validated by PoC; defer advanced optimization. |
| QR lookup becomes required for maintenance. | Maintenance ticket can still use manual room/equipment selection if QR is not ready. |
| Dashboard becomes decorative. | Each KPI must link to a concrete action or record list. |
| Security/privacy risk appears. | Stop affected flow, fix RBAC/data visibility, and update DoD evidence before release. |

## Release Decision

Proceed with the fixed-date MVP release only if all 13 Must Have stories can be demonstrated with sample data and pass Definition of Done. If the team falls below the planned velocity range, remove might-have scope first and protect the two demo-critical flows: student application -> approval -> assignment -> check-in/out, and maintenance ticket -> SLA -> dashboard visibility.


