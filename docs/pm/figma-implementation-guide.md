# Figma Implementation Guide

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-FIGMA-RUNBOOK |
| Version | 1.0 |
| Status | Ready for Figma execution |
| Owner | Group 3 |
| Updated | 2026-06-03 |
| Related docs | `prototype-spec.md`; `product-backlog.md`; `proof-of-concept.md`; `definition-of-done.md` |

## Purpose

This guide is the execution runbook for drawing the DormCare Hub MVP prototype in Figma. It turns the product and prototype documents into a concrete canvas plan, so the implementer does not need to decide screen order, dimensions, visual tokens, component set, or validation steps.

The expected output is a new Figma design file named `DormCare Hub - MVP Prototype` with a page named `MVP Prototype`, containing the desktop admin flow and mobile student flow described below.

## Connector Requirements

| Requirement | Status / Rule |
| --- | --- |
| Figma write tool | Required: `create_new_file` and `use_figma` must be available in Codex tools. |
| Token type | Figma MCP write flow requires the Codex/Figma OAuth connector. A personal access token that only works with `X-Figma-Token` is not enough for `use_figma`. |
| Local shell PAT | `FIGMA_API_KEY` / `X-Figma-Token` can help read files through REST-style tools, but it cannot create or mutate canvas through the remote Figma MCP write flow. |
| Skill order | Load `figma-use` before every `use_figma` call; use `figma-generate-design` for full-screen composition. |
| Security | Do not write any Figma token into project docs, scripts, screenshots, or commit history. |

## Source Inputs

Use these files as the source of truth:

| Source | Use |
| --- | --- |
| `docs/prototype-spec.md` | Screen list, acceptance criteria, sample data, flow intent. |
| `docs/product-backlog.md` | User-story traceability for every screen. |
| `docs/project-overview.md` | MVP boundary, roles, risks, stakeholder language. |
| `docs/proof-of-concept.md` | PoC scenarios and rule/SLA concepts to show in UI. |
| Original `.docx` files | Only for resolving conflicts or checking course submission language. |

## Figma Build Sequence

Follow this order exactly.

| Step | Action | Tool | Required Output |
| --- | --- | --- | --- |
| 1 | Confirm authenticated Figma account and plan. | `whoami` | User identity and selected plan key. |
| 2 | Create design file. | `create_new_file` | File URL and file key for `DormCare Hub - MVP Prototype`. |
| 3 | Inspect blank file. | `use_figma` or metadata tool | Page list and confirmation that the file is writable. |
| 4 | Create page wrapper and local tokens. | `use_figma` | Page `MVP Prototype`, color styles, text styles, spacing tokens if supported. |
| 5 | Create reusable components. | `use_figma` | Buttons, badges, cards, tables, sidebar, mobile header. |
| 6 | Draw desktop frames. | `use_figma`, one or two screens per call | Frames 01, 05, 06, 07, 09, 10. |
| 7 | Draw mobile frames. | `use_figma`, one or two screens per call | Frames 02, 03, 04, 08. |
| 8 | Add prototype links or visible flow arrows. | `use_figma` | End-to-end navigable flow or labeled connector layer. |
| 9 | Validate structure. | `get_metadata` or `use_figma` read call | Frame names, counts, dimensions, hierarchy. |
| 10 | Validate visuals. | `get_screenshot` | No text clipping, overlap, or unreadable dense areas. |

## Canvas Layout

Place top-level frames on a single page using fixed positions so the canvas is easy to inspect.

| Frame | Size | X | Y |
| --- | ---: | ---: | ---: |
| 01 Login - Role Access | 1440 x 1024 | 0 | 0 |
| 05 Admin Review Queue | 1440 x 1024 | 1600 | 0 |
| 06 Room Bed Ledger | 1440 x 1024 | 3200 | 0 |
| 07 Assignment Suggestion | 1440 x 1024 | 4800 | 0 |
| 09 SLA Board | 1440 x 1024 | 6400 | 0 |
| 10 Operations Dashboard | 1440 x 1024 | 8000 | 0 |
| 02 Student Consent | 390 x 844 | 0 | 1220 |
| 03 Student Application Form | 390 x 844 | 520 | 1220 |
| 04 Application Status | 390 x 844 | 1040 | 1220 |
| 08 Maintenance Ticket | 390 x 844 | 1560 | 1220 |

Use frame names exactly as listed. Prefixing with the screen number keeps prototype ordering stable.

## Visual System

The interface should feel like a practical dormitory operations system, not a landing page.

| Token | Value | Use |
| --- | --- | --- |
| Font | Inter, fallback Arial | All UI text. |
| Page background | `#F5F7FA` | Desktop and mobile canvas background. |
| Surface | `#FFFFFF` | Panels, tables, mobile cards. |
| Primary | `#0F766E` | Main actions, selected nav, success emphasis. |
| Primary dark | `#115E59` | Hover/pressed or strong header accents. |
| Info | `#2563EB` | Links, drill-down actions, neutral operational highlights. |
| Warning | `#D97706` | Pending, due soon, review attention. |
| Danger | `#DC2626` | Rejected, overdue, critical ticket. |
| Success | `#16A34A` | Approved, resolved, available. |
| Text primary | `#111827` | Primary labels and headings. |
| Text secondary | `#6B7280` | Metadata and helper text. |
| Border | `#E5E7EB` | Table lines, panel separators. |
| Radius | 8 px | Cards, inputs, table containers. |
| Desktop sidebar | 248 px | Admin navigation. |
| Desktop top bar | 72 px | Search, term selector, profile. |
| Mobile safe padding | 20 px | Mobile frame inner padding. |

Typography:

| Role | Size | Weight | Line Height |
| --- | ---: | ---: | ---: |
| Page title | 28 | 700 | 36 |
| Section title | 20 | 700 | 28 |
| Card/KPI value | 28 | 700 | 34 |
| Table header | 12 | 700 | 16 |
| Body | 14 | 400 | 20 |
| Helper text | 12 | 400 | 16 |
| Mobile title | 22 | 700 | 30 |

## Reusable Components

Create these as reusable component-like frames even if the final implementation uses simple Figma nodes instead of formal components.

| Component | Required Variants / States |
| --- | --- |
| Button | Primary, secondary, ghost, danger; enabled and disabled. |
| Status Badge | Pending, approved, rejected, available, occupied, maintenance hold, assigned, overdue, resolved. |
| KPI Card | Neutral, warning, danger, success; includes value, label, trend, drill-down affordance. |
| Data Table | Header, row, selected row, row action, empty state. |
| Sidebar Nav Item | Default, active, warning count. |
| Stepper | Pending, current, done, blocked. |
| Form Field | Input, select, textarea, file upload, validation message. |
| Rule Reason Pill | Positive match, warning constraint, disqualified option. |
| Ticket Priority Chip | Low, normal, high, urgent. |
| Mobile Header | Back action, title, optional status/action. |

## Desktop Frame Blueprint

All desktop app frames except Login use this base layout:

| Region | Position / Size | Content |
| --- | --- | --- |
| Sidebar | `x=0`, `w=248`, full height | Logo, main navigation, role indicator. |
| Top bar | `x=248`, `y=0`, `w=1192`, `h=72` | Page title, search, term/building selector, profile. |
| Content | `x=248`, `y=72`, `w=1192`, `h=952` | Screen-specific panels and tables. |
| Main content padding | 32 px | Keep all body content aligned. |

### 01 Login - Role Access

| Region | Content |
| --- | --- |
| Brand block | DormCare Hub logo text, short subtitle: `School Dormitory Management System`. |
| Login panel | Email, password, role selector, login button. |
| Role cards | Student, Dormitory Staff, Maintenance, Student Affairs, Admin. |
| Trust note | `Role-based access keeps student and dormitory data separated.` |

Primary interaction: login as Student goes to `02 Student Consent`; login as Dormitory Staff goes to `05 Admin Review Queue`; login as Student Affairs goes to `10 Operations Dashboard`.

### 05 Admin Review Queue

| Region | Content |
| --- | --- |
| KPI strip | Pending applications, priority cases, approved today, rejected today. |
| Filter row | Term, building preference, priority, status, search. |
| Main table | Application ID, student, gender, cohort, priority, preference, submitted date, status, action. |
| Detail panel | Selected application summary, evidence list, notes, approve/reject buttons. |

Use selected row `APP-2026-001` with student `SV2302700162 - Pham Hoang Hai`.

### 06 Room Bed Ledger

| Region | Content |
| --- | --- |
| KPI strip | Occupancy, available beds, maintenance hold, rooms at risk. |
| Building tabs | A, B, C, All. |
| Room table | Building, floor, room, gender policy, capacity, occupied, available, status, action. |
| Bed detail panel | A-302 beds B1-B4, status, QR asset, last update. |

Show room `A-302` as capacity 4, occupied 3, one available bed `A-302-B4`.

### 07 Assignment Suggestion

| Region | Content |
| --- | --- |
| Candidate panel | Application and student constraints. |
| Suggestion panel | Recommended bed `A-302-B4`, confidence/usefulness label, confirm button. |
| Reason panel | Gender policy match, available capacity, same cohort preference, not maintenance-held. |
| Disqualified list | Full room, gender mismatch, maintenance hold examples. |
| Override area | Secondary action `Override with reason`, with modal or inline reason box. |

The override UI must require a reason before confirmation.

### 09 SLA Board

| Region | Content |
| --- | --- |
| KPI strip | New tickets, assigned today, due soon, overdue. |
| Board/table | Ticket ID, context, priority, assignee, due time, status, SLA state. |
| Ticket detail | `MT-2026-011`, QR context `A-302 - FAN01`, photo preview slot, timeline. |
| Actions | Assign, mark in progress, resolve, reopen. |

Show at least one overdue ticket and one normal ticket due in 48 hours.

### 10 Operations Dashboard

| Region | Content |
| --- | --- |
| KPI cards | Occupancy 87 percent, pending applications 18, overdue tickets 4, available beds 26. |
| Chart area | Occupancy by building, ticket SLA trend. |
| Action lists | Pending priority applications, overdue maintenance tickets, rooms near full capacity. |
| Drill-down hint | Every KPI card has a visible `View list` action. |

Avoid decorative charts that do not connect to action lists.

## Mobile Frame Blueprint

All mobile screens use a 390 x 844 frame with 20 px side padding and a simple header.

### 02 Student Consent

| Region | Content |
| --- | --- |
| Header | `Data processing notice`. |
| Summary card | Why data is collected: dormitory application, room assignment, maintenance, reporting. |
| Checklist | Personal info, evidence files, room preference, maintenance ticket history. |
| Consent controls | Checkbox and primary `Continue application` button. |

### 03 Student Application Form

| Region | Content |
| --- | --- |
| Stepper | Personal info -> Preference -> Evidence -> Review. |
| Form | Name/student ID, gender, cohort, major, priority flag, building preference, quiet room request. |
| Upload area | Evidence file upload slot. |
| Footer action | `Review and submit`. |

Use a long-form layout but keep sections visually separated.

### 04 Application Status

| Region | Content |
| --- | --- |
| Status badge | Pending review or Approved. |
| Timeline | Submitted, under review, approved, assigned, check-in. |
| Assignment card | Room `A-302`, bed `B4`, check-in next step. |
| Action | `Report room issue` leading to `08 Maintenance Ticket`. |

### 08 Maintenance Ticket

| Region | Content |
| --- | --- |
| QR context card | `A-302 - FAN01`, Building A, Room 302. |
| Form | Issue type, description, urgency, photo upload. |
| SLA preview | Normal priority: expected response within 48 hours. |
| Submit action | `Create ticket`. |

## Prototype Links

If Figma prototype interactions are available, wire these links:

| From | Trigger | To |
| --- | --- | --- |
| 01 Login - Role Access | Student login | 02 Student Consent |
| 01 Login - Role Access | Dormitory Staff login | 05 Admin Review Queue |
| 01 Login - Role Access | Student Affairs login | 10 Operations Dashboard |
| 02 Student Consent | Continue application | 03 Student Application Form |
| 03 Student Application Form | Review and submit | 04 Application Status |
| 04 Application Status | Report room issue | 08 Maintenance Ticket |
| 05 Admin Review Queue | Approve selected application | 07 Assignment Suggestion |
| 06 Room Bed Ledger | Assign available bed | 07 Assignment Suggestion |
| 07 Assignment Suggestion | Confirm assignment | 06 Room Bed Ledger |
| 08 Maintenance Ticket | Create ticket | 09 SLA Board |
| 09 SLA Board | View dashboard impact | 10 Operations Dashboard |

If prototype wiring is not available through the tool, add a top-level `Prototype Flow` connector layer with labeled arrows using the same mapping.

## `use_figma` Execution Rules

Every write call must follow these rules:

- Use plain JavaScript with top-level `await`.
- Return all created or mutated node IDs.
- Do not use `figma.notify()`.
- Load fonts before setting text.
- Use colors in 0-1 RGB values.
- Reassign fills and strokes instead of mutating arrays in place.
- Switch pages with `await figma.setCurrentPageAsync(page)`.
- Work in small batches: tokens, components, desktop frames, mobile frames, prototype links.
- Validate with metadata and screenshots after each major batch.

Recommended return shape:

```js
return {
  success: true,
  pageId,
  createdNodeIds,
  mutatedNodeIds,
  frameNames,
  notes: []
};
```

## Validation Checklist

| Check | Pass Criteria |
| --- | --- |
| File | File name is `DormCare Hub - MVP Prototype`. |
| Page | Page `MVP Prototype` exists. |
| Frames | All 10 frames exist with exact names and expected sizes. |
| Layout | Desktop frames have sidebar, top bar, and aligned content. |
| Mobile | Mobile frames fit within 390 x 844 without clipped primary actions. |
| Text | No text is visibly clipped, overlapped, or too small to read. |
| Traceability | Each screen has backlog ID visible in a small spec label or hidden note layer. |
| Prototype | Primary flow can be followed from login to dashboard. |
| Privacy | No token, real private student data, or secret appears on the canvas. |
| Visual quality | UI reads as operational SaaS, not a landing page or decorative mockup. |

## Handoff Output

After Figma creation, record these in `docs/prototype-spec.md` or a short follow-up note:

- Figma file URL.
- Page name.
- Created frame names.
- Any deviations from this runbook.
- Screenshot/metadata validation result.
- Remaining blockers, if any.
