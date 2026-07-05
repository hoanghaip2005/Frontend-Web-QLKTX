# Prototype Spec

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-PROTOTYPE |
| Version | 1.0 |
| Status | Draft - ready for Figma implementation |
| Owner | Group 3 |
| Updated | 2026-06-03 |
| Source files | `Group3_DormCare_Hub_Product_Backlog.docx`; `Group3_DormCare_Hub_Biên Bản Họp.docx`; `Group3 _DormCare_Hub Tầm Nhìn & Phạm Vi Dự Án.docx` |

## Prototype Goal

Create a Figma prototype for the DormCare Hub MVP end-to-end flow. The prototype should validate whether users can understand and move through the core operations before the team implements the web app.

The prototype must cover both Student Portal and Admin Portal, with a smaller maintenance and dashboard flow to show operational continuity.

## Canvas Setup

| Item | Specification |
| --- | --- |
| Figma file name | DormCare Hub - MVP Prototype |
| Page name | MVP Prototype |
| Desktop frame size | 1440 x 1024 |
| Mobile frame size | 390 x 844 (reference-only, xem sync note bên dưới) |
| Main desktop role | Dormitory Staff / Admin / Student Affairs |
| Main mobile role | Student |
| Visual style | Clean operational SaaS, high scanability, restrained color, no decorative marketing hero. |
| Primary accent | Practical green or blue-green for dormitory operations and successful status. |
| Density | Dense enough for management workflows, but not cramped. |

> **Sync note (2026-07-03):** Theo quyết định web-first trong `Frontend-Web-QLKTX/docs/handoff-flow-and-assignment.md` (2026-06-27), Figma prototype cho web chỉ cần desktop `1440x1024`. Các frame mobile `390x844` là tham chiếu responsive, không phải deliverable bắt buộc; React web chịu trách nhiệm responsive cho màn hình sinh viên.

## Information Architecture

| Area | Purpose | Primary Role |
| --- | --- | --- |
| Authentication | Login and role selection. | All users. |
| Consent | Personal-data notice before student submission. | Student. |
| Application | Student submits and tracks dormitory application. | Student, Dormitory Staff. |
| Room/Bed Ledger | Manage buildings, floors, rooms, beds, status, occupancy. | Dormitory Staff. |
| Assignment | Review rule-based suggestion, explanation, and override. | Dormitory Staff. |
| Maintenance | Student submits ticket, staff triages, maintenance resolves. | Student, Dormitory Staff, Maintenance. |
| Dashboard | Monitor occupancy, pending applications, overdue tickets, and operational risk. | Dormitory Staff, Student Affairs, Leadership. |

## Screens

| # | Frame Name | Size | Role | Purpose | Backlog |
| --- | --- | --- | --- | --- | --- |
| 01 | Login - Role Access | Desktop 1440 | All | Select role and authenticate into the correct portal. | US-001 |
| 02 | Student Consent | Mobile 390 | Student | Explain data usage before application submission. | US-002 |
| 03 | Student Application Form | Mobile 390 | Student | Enter personal info, preferences, and evidence upload. | US-003 |
| 04 | Application Status | Mobile 390 | Student | Track status, result, assigned room/bed, and next step. | US-004 |
| 05 | Admin Review Queue | Desktop 1440 | Dormitory Staff | Review applications, evidence, priority, and decision. | US-005 |
| 06 | Room Bed Ledger | Desktop 1440 | Dormitory Staff | View occupancy, status, room/bed availability, and filters. | US-006, US-010 |
| 07 | Assignment Suggestion | Desktop 1440 | Dormitory Staff | Show suggested bed, reason codes, rejected constraints, and override option. | US-008, US-009 |
| 08 | Maintenance Ticket | Mobile 390 | Student | Create ticket from QR context with photo, description, urgency. | US-011 |
| 09 | SLA Board | Desktop 1440 | Dormitory Staff / Maintenance | Classify, assign, track due time, resolve, and reopen. | US-012, US-013 |
| 10 | Operations Dashboard | Desktop 1440 | Student Affairs / Leadership | Monitor KPI cards and drill into pending/overdue records. | US-014, US-015 |

## Primary Flow

1. Student logs in.
2. Student accepts data-processing notice.
3. Student submits dormitory application.
4. Student sees application status as Pending.
5. Dormitory staff opens review queue and approves/rejects with reason.
6. Staff uses room/bed ledger and assignment suggestion.
7. Staff confirms suggested bed or overrides with reason.
8. Student sees approved status and room/bed assignment.
9. Student scans QR or opens room context and submits maintenance ticket.
10. Staff assigns SLA and maintenance handles ticket.
11. Dashboard reflects occupancy, pending applications, and overdue ticket status.

## Component Requirements

| Component | Usage |
| --- | --- |
| Sidebar navigation | Desktop admin frames: Dashboard, Applications, Rooms, Assignment, Maintenance, Reports. |
| Top bar | Role label, current building/term, user menu, quick search. |
| KPI card | Occupancy, pending applications, overdue tickets, maintenance SLA, available beds. |
| Data table | Applications, room/bed ledger, tickets. Must support status badges and row actions. |
| Status badge | Pending, Approved, Rejected, Available, Occupied, Maintenance Hold, Overdue, Resolved. |
| Form section | Student application, consent, ticket creation. |
| Stepper | Application flow and ticket status. |
| Rule explanation panel | Shows why a room/bed is suggested and what constraints were checked. |
| Override modal | Requires alternative bed and reason. |
| Empty/loading/error state | Needed at least for application status and ticket list. |

## Sample Data

| Entity | Example |
| --- | --- |
| Student | SV2302700162 - Pham Hoang Hai - Male - K2023 - IT - Priority: No |
| Application | APP-2026-001 - Pending Review - Preference: Building A, quiet room |
| Room | A-302 - Capacity 4 - Occupied 3 - Gender: Male - Status: Available |
| Bed | A-302-B4 - Available |
| Assignment reason | Matches gender policy; available capacity; same cohort preference; not under maintenance. |
| Override reason | Student requested same room as sibling after staff verification. |
| QR asset | QR-A302-FAN01 - Fan in Room A-302 |
| Ticket | MT-2026-011 - Fan not working - Priority: Normal - Due: 48 hours |
| Dashboard KPI | Occupancy 87 percent; Pending applications 18; Overdue tickets 4; Available beds 26 |

## Screen Acceptance Criteria

| Screen | Acceptance Criteria |
| --- | --- |
| Login - Role Access | Role options are visible; selected role affects destination; no role sees unrelated portal controls. |
| Student Consent | Purpose of data processing is understandable; continue action is explicit. |
| Student Application Form | Required fields, preferences, and evidence upload are visible; form has review/submit action. |
| Application Status | Current state, timeline, assigned room/bed or rejection reason are visible. |
| Admin Review Queue | Staff can inspect application details, evidence, priority, and decision buttons. |
| Room Bed Ledger | Staff can scan building/floor/room/bed status quickly with filters and status badges. |
| Assignment Suggestion | Suggested bed, rule reasons, disqualified options, confirm, and override are all visible. |
| Maintenance Ticket | QR context is visible; student can add photo, description, urgency, submit. |
| SLA Board | Ticket status, assignee, priority, due time, and overdue state are visible. |
| Operations Dashboard | KPI cards are actionable and link visually to record lists. |

## Figma Implementation Notes

- Use `docs/figma-implementation-guide.md` as the execution runbook for canvas positions, visual tokens, component blueprint, tool-call order, and validation.
- Do not create a landing page. The first screen should be the actual login/role workflow.
- Keep desktop admin UI operational and dense; avoid oversized marketing-style hero sections.
- Use stable dimensions for tables, badges, sidebars, and cards so content does not shift.
- Avoid nested cards. Use page bands, table sections, and compact panels instead.
- Use icon buttons for common actions where available in Figma; label unfamiliar controls with nearby text or tooltip treatment.
- Text must not overlap or be clipped on mobile or desktop frames.
- Prototype links should form a navigable path from `Login - Role Access` through the MVP flow to `Operations Dashboard`.

## Figma MCP Status

Figma shell access is configured for `figma-developer-mcp`, and the local MCP server starts successfully with read/download tools. The current PAT authenticates with Figma REST, so reading real Figma files is available after MCP reload. Creating the file and drawing frames still requires the Codex/Figma OAuth connector that provides `create_new_file` and `use_figma`.
