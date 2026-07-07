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

## Tóm tắt

Runbook này chuyển `prototype-spec.md` thành hướng dẫn dựng Figma: quy ước file/page/frame, canvas layout, visual tokens, component blueprint, prototype links và checklist QA. Figma prototype dùng web-first desktop `1440x1024`; mobile frame chỉ là reference responsive cho flow sinh viên.

## Purpose

This guide is the execution runbook for drawing the DormCare Hub MVP prototype in Figma. It turns the product and prototype documents into a concrete canvas plan, so the implementer does not need to decide screen order, dimensions, visual tokens, component set, or validation steps.

The expected output is a Figma design file named `DormCare Hub - MVP Prototype` with a page named `MVP Prototype`, containing the desktop admin flow and mobile student flow described below.

## Connector Requirements

| Requirement | Status / Rule |
| --- | --- |
| Figma write tool | Required: `create_new_file` and `use_figma` must be available in Codex tools. |
| Token type | Figma MCP write flow requires the Codex/Figma OAuth connector. A personal access token that only works with `X-Figma-Token` is not enough for `use_figma`. |
| Local shell PAT | `FIGMA_API_KEY` / `X-Figma-Token` can help read files through REST-style tools, but it cannot create or mutate canvas through the remote Figma MCP write flow. |
| Skill order | Load `figma-use` before every `use_figma` call; use `figma-generate-design` for full-screen composition. |
| Security | Do not write any Figma token into project docs, scripts, screenshots, or commit history. |

## Source Inputs

| Source | Use |
| --- | --- |
| `prototype-spec.md` | Screen list, acceptance criteria, sample data, flow intent. |
| `product-backlog.md` | User-story traceability for every screen. |
| `project-overview.md` | MVP boundary, roles, risks, stakeholder language. |
| `proof-of-concept.md` | PoC scenarios and rule/SLA concepts to show in UI. |
| Original `.docx` files | Only for resolving conflicts or checking course submission language. |

## Figma Build Sequence

| Step | Action | Required Output |
| --- | --- | --- |
| 1 | Confirm authenticated Figma account and plan. | User identity and selected plan key. |
| 2 | Create or open design file. | File URL and file key for `DormCare Hub - MVP Prototype`. |
| 3 | Inspect blank/current file. | Page list and writable confirmation. |
| 4 | Create page wrapper and local tokens. | Page `MVP Prototype`, color/text/spacing tokens. |
| 5 | Create reusable components. | Buttons, badges, cards, tables, sidebar, mobile header. |
| 6 | Draw desktop frames. | Frames 01, 05, 06, 07, 09, 10. |
| 7 | Draw mobile/reference frames. | Frames 02, 03, 04, 08. |
| 8 | Add prototype links or flow arrows. | Navigable flow or labeled connector layer. |
| 9 | Validate structure. | Frame names, counts, dimensions, hierarchy. |
| 10 | Validate visuals. | No text clipping, overlap, unreadable dense areas. |

## Canvas Layout

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

## Visual System

| Token | Value | Use |
| --- | --- | --- |
| Font | Inter, fallback Arial | All UI text. |
| Page background | `#F5F7FA` | Desktop and mobile canvas background. |
| Surface | `#FFFFFF` | Panels, tables, mobile cards. |
| Primary | `#0F766E` | Main actions, selected nav, success emphasis. |
| Info | `#2563EB` | Links and drill-down actions. |
| Warning | `#D97706` | Pending, due soon, review attention. |
| Danger | `#DC2626` | Rejected, overdue, critical ticket. |
| Success | `#16A34A` | Approved, resolved, available. |
| Text primary | `#111827` | Primary labels and headings. |
| Text secondary | `#6B7280` | Metadata and helper text. |
| Border | `#E5E7EB` | Table lines, panel separators. |
| Radius | 8 px | Cards, inputs, table containers. |

## Reusable Components

| Component | Required variants/states |
| --- | --- |
| Button | Primary, secondary, ghost, danger; enabled/disabled. |
| Status Badge | Pending, approved, rejected, available, occupied, maintenance hold, overdue, resolved. |
| KPI Card | Neutral, warning, danger, success; value, label, trend, drill-down affordance. |
| Data Table | Header, row, selected row, row action, empty state. |
| Sidebar Nav Item | Default, active, warning count. |
| Stepper | Pending, current, done, blocked. |
| Form Field | Input, select, textarea, file upload, validation message. |
| Rule Reason Pill | Positive match, warning constraint, disqualified option. |
| Ticket Priority Chip | Low, normal, high, urgent. |

## Desktop Frame Blueprint

All desktop app frames except Login use this base layout:

| Region | Position / Size | Content |
| --- | --- | --- |
| Sidebar | `x=0`, `w=248`, full height | Logo, main navigation, role indicator. |
| Top bar | `x=248`, `y=0`, `w=1192`, `h=72` | Page title, search, term/building selector, profile. |
| Content | `x=248`, `y=72`, `w=1192`, `h=952` | Screen-specific panels and tables. |
| Main content padding | 32 px | Keep all body content aligned. |

## Prototype Links

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

## Validation Checklist

| Check | Pass Criteria |
| --- | --- |
| File | File name is `DormCare Hub - MVP Prototype`. |
| Page | Page `MVP Prototype` exists. |
| Frames | All 10 frames exist with exact names and expected sizes. |
| Layout | Desktop frames have sidebar, top bar, aligned content. |
| Mobile | Mobile frames fit within 390 x 844 without clipped primary actions. |
| Text | No text is visibly clipped, overlapped, or too small. |
| Traceability | Each screen maps to backlog ID. |
| Prototype | Primary flow can be followed from login to dashboard. |
| Privacy | No token, real private student data, or secret appears on canvas. |
| Visual quality | UI reads as operational SaaS, not landing page. |

## Handoff Output

After Figma creation, record:

- Figma file URL.
- Page name.
- Created frame names.
- Any deviations from this runbook.
- Screenshot/metadata validation result.
- Remaining blockers, if any.
