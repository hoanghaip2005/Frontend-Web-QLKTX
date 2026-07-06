# DormCare Hub Project Documentation

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-DOC-INDEX |
| Version | 1.1 |
| Status | Synced with implementation |
| Owner | Group 3 |
| Updated | 2026-07-03 |
| Source files | Original `.docx` files in workspace; instructor examples at `https://nndkhoa.github.io/project-management-docs/` |

## Purpose

This `docs/` folder is the Markdown source of truth for project-management materials that are easier to review, version, and reuse than the original Word files. The existing `.docx` files remain unchanged and are treated as the source documents for the first version of this folder.

DormCare Hub is a web-responsive dormitory management system for schools. The MVP focuses on the end-to-end dormitory operations flow: student application, approval, room/bed ledger, rule-based room assignment, check-in/out, maintenance ticket with SLA, and operations dashboard.

## Document Map

| Document | Purpose | Primary Source |
| --- | --- | --- |
| [Project Overview](project-overview.md) | Summarizes charter, vision, scope, stakeholders, MVP boundary, deliverables, risks. | Project Charter, Vision & Scope, Feasibility Study |
| [Product Backlog](product-backlog.md) | Normalizes the MVP backlog, epic structure, priority, sprint target, and traceability. | Product Backlog |
| [High-Level Estimate](high-level-estimate.md) | Estimates MVP, Phase 2, and full backlog effort using story points and velocity. | [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2), Product Backlog |
| [Product Roadmap](product-roadmap.md) | Groups releases and Minimum Releasable Features from MVP to Phase 2 and deferred integrations. | [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2), Project Overview, Backlog |
| [Release Plan - Fixed Date](release-plan-fixed-date.md) | Defines the fixed-date MVP release plan, sprint map, and will-have/might-have/won't-have scope. | [D07 Agile Planning](https://nndkhoa.github.io/project-management-docs/d07/index.html#2), Jira Sprint Plan, Backlog |
| [Definition of Done](definition-of-done.md) | Converts the existing DoD into a checklist with owners and evidence. | Software Process Definition |
| [Proof of Concept](proof-of-concept.md) | Defines the PoC for room assignment rules, QR maintenance/SLA, and dashboard KPI. | Instructor PoC example, Feasibility Study, Backlog |
| [Prototype Spec](prototype-spec.md) | Defines the Figma prototype screens, flows, components, sample data, and acceptance criteria. | Backlog, Vision & Scope, Meeting Minutes |
| [Figma Implementation Guide](figma-implementation-guide.md) | Execution runbook for creating the Figma file, canvas layout, components, prototype links, and QA checks. | Prototype Spec, Figma workflow rules |
| [Implementation Traceability](implementation-traceability.md) | Truy vết US → màn hình React → API → bằng chứng test cho review DoD và demo. | Product Backlog, Prototype Spec, mã nguồn 2 repo |
| [Demo Script & Test Scenarios](demo-script-test-scenarios.md) | Kịch bản đóng vai SV/Staff/Admin theo timeline, 14 tình huống test negative/edge, luận điểm "không chỉ CRUD". | Traceability, môi trường Azure production |

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Original Word documents | Preserved | No `.docx` file is modified by this docs pass. |
| Markdown docs | Ready for review | These files consolidate and fill gaps for project-management submission. |
| Agile planning docs | Added | High-level estimate, product roadmap, and fixed-date release plan are aligned with backlog and Jira sprints. |
| DoD | Expanded | Existing DoD from Software Process Definition is converted into actionable review criteria. |
| PoC | Added | The project has no separate PoC document in the workspace; this file defines a concrete PoC plan and pass/fail thresholds. |
| Prototype | Spec added; web-first | Figma web prototype dùng desktop `1440x1024` theo handoff 2026-06-27; mobile frames là reference-only (xem sync note trong `prototype-spec.md`). |
| Figma MCP | Local read connected | `figma-developer-mcp` starts successfully, exposes read/download tools, and the current PAT authenticates with Figma REST. Canvas write tools such as `use_figma` and `create_new_file` still require the Codex/Figma OAuth connector. |
| Web UI MVP | Implemented | Toàn bộ 13 Must-Have story có màn hình React trong `D:\QLKTX\Frontend-Web-QLKTX` (student/staff/admin portals, mock + live mode). |
| Backend API | Implemented & tested | `D:\QLKTX\Backend-QLKTX` (Express + PostgreSQL): application lifecycle, tickets/SLA, RBAC, audit. E2E API test 26/26 pass trên môi trường local (docker postgres + `database/local-dev-bootstrap.sql`). |
| Frontend-Backend integration | Wired | Frontend gọi API qua repositories (`src/lib/api`), chuyển `mock`/`live` bằng `VITE_API_MODE`; luồng duyệt hồ sơ từ UI đã persist vào database. Supabase Auth thật vẫn deferred (dev bypass trong môi trường local). |

## Submission Guidance

Use the Markdown files for planning, review, and team alignment. If the course requires Word/PDF deliverables, export from these Markdown files or copy the finalized content into the existing `.docx` package after review.

Recommended review order:

1. Read [Project Overview](project-overview.md) to align project scope.
2. Review [Product Backlog](product-backlog.md) to confirm MVP items.
3. Review [High-Level Estimate](high-level-estimate.md) to understand story point sizing, velocity, and forecast.
4. Review [Product Roadmap](product-roadmap.md) to align MVP, Phase 2, and deferred release scope.
5. Review [Release Plan - Fixed Date](release-plan-fixed-date.md) to confirm dates, sprint scope, and will-have/might-have/won't-have decisions.
6. Approve [Definition of Done](definition-of-done.md) before Sprint 1 execution.
7. Execute [Proof of Concept](proof-of-concept.md) before committing to detailed build decisions.
8. Use [Prototype Spec](prototype-spec.md) to build and validate the Figma prototype.
9. Follow [Figma Implementation Guide](figma-implementation-guide.md) when the Figma write tools are available.

