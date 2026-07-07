# Project Overview

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-OVERVIEW |
| Version | 1.0 |
| Status | Draft for review |
| Owner | Group 3 |
| Updated | 2026-06-02 |
| Source files | `Group3_DormCare_Hub_Hiến Chương Dự Án.docx`; `Group3 _DormCare_Hub Tầm Nhìn & Phạm Vi Dự Án.docx`; `Group3_DormCare_Hub_Báo Cáo Nghiên Cứu Khả Thi.docx`; `Group3_DormCare_Hub_Project_Idea_SWOT.docx` |

## Tóm tắt

DormCare Hub thay thế Excel/Zalo/giấy tờ bằng một nền tảng quản lý KTX tập trung cho 5 nhóm người dùng (sinh viên, staff, bảo trì, CTSV/lãnh đạo, admin). MVP gói gọn trong vòng đời: đăng ký → duyệt → phân phòng theo rule → check-in/out, cộng với sửa chữa theo SLA và dashboard KPI hành động được. 5 mục tiêu chiến lược có KPI định lượng (≥90% hồ sơ xử lý trong hệ thống, ≥95% sổ giường đúng, ≥80% gợi ý hữu ích...). Phạm vi loại trừ rõ: SIS, payment gateway, native mobile.

## Project Summary

DormCare Hub is a centralized dormitory management platform for schools. It replaces scattered Excel files, paper records, Zalo messages, and manually updated reports with a role-based system for student dormitory applications, approval, room/bed allocation, check-in/out, maintenance tickets, and operational dashboards.

The MVP is designed for a school dormitory pilot. It prioritizes a single reliable room/bed ledger, clear student application status, explainable rule-based room assignment, maintenance ticket tracking with SLA, and action-oriented dashboard KPIs.

## Problems to Solve

| Problem | Current Impact | DormCare Hub Response |
| --- | --- | --- |
| Room, bed, student, billing, and maintenance data are scattered. | Slow reconciliation, duplicated entry, and unreliable reporting. | Create one source of truth for dormitory operations. |
| Students cannot easily track application and room status. | Heavy dependence on manual follow-up with dormitory staff. | Provide a student portal with transparent status tracking. |
| Room assignment is manual and hard to explain. | Slow assignment, inconsistent decisions, and difficult exception handling. | Use rule-based suggestions with visible reasons and controlled override. |
| Maintenance reports lack SLA tracking. | Tickets may be lost, delayed, or hard to analyze later. | Use ticket workflow with assignee, priority, deadline, and history. |
| Management lacks near-real-time dashboard data. | Decisions depend on manual summary reports after the event. | Provide KPI dashboard with drill-down lists for action. |

## Strategic Objectives

| # | Objective | KPI | Target |
| --- | --- | --- | --- |
| 1 | Digitize the core dormitory lifecycle. | Percentage of pilot applications processed in the system. | At least 90 percent. |
| 2 | Maintain a reliable room/bed ledger. | Percentage of pilot rooms/beds with correct status and valid QR code. | At least 95 percent. |
| 3 | Improve assignment efficiency. | Time to prepare assignment list and usefulness of suggestions. | 30 minutes or less; at least 80 percent useful suggestions. |
| 4 | Standardize maintenance workflow. | Tickets assigned in the same day and normal tickets resolved within SLA. | At least 95 percent assigned; at least 80 percent within SLA. |
| 5 | Support management decisions. | Dashboard availability and actionable KPI coverage. | Core KPI dashboard ready for Sprint 4 demo. |

## Main Users

| User Group | Core Need | Expected Benefit |
| --- | --- | --- |
| Dormitory students | Submit application, upload evidence, track status, view room/bed, create maintenance requests. | Fewer manual inquiries, clearer status, faster reporting through QR. |
| Dormitory management staff | Review applications, manage room/bed status, assign rooms, handle check-in/out, coordinate maintenance. | Less duplicate entry, better traceability, lower operational risk. |
| Student Affairs / School leadership | Track occupancy, pending applications, overdue tickets, and operational risks. | Data-based decisions instead of delayed manual reports. |
| Maintenance staff | Receive clear ticket location, equipment, priority, deadline, and resolution confirmation. | Fewer lost reports and better recurring-issue history. |
| System admin | Configure roles, permissions, and operational data. | Controlled access and safer operation of sensitive student data. |

## MVP Boundary

| Included in MVP | Deferred |
| --- | --- |
| Login and role-based access for Student, Dormitory Staff, Maintenance, Student Affairs/Leadership, Admin. | Native mobile app. |
| Personal-data processing notice before student submission. | Real payment gateway. |
| Student dormitory application and status tracking. | Real SIS integration. |
| Dormitory staff application review with approval/rejection reason. | IoT locks, cameras, or access-control hardware. |
| Room/building/floor/bed ledger. | Advanced optimization or AI-based assignment. |
| Rule-based room/bed suggestion with explanation and override reason. | Full audit/export feature set. |
| Check-in/check-out update linked to ledger. | Predictive analytics. |
| Maintenance ticket via portal or QR, SLA assignment, resolution, reopen. | Full PDF/Excel reporting package. |
| Core dashboard for occupancy, pending applications, overdue tickets, and operational status. | Phase 2 billing/cost allocation details. |

## Governance

| Role | Responsibility |
| --- | --- |
| Project Sponsor | Approves major scope decisions and evaluates project outcome. |
| Project Manager / Scrum Master | Plans sprint work, tracks progress, manages risks, coordinates reporting. |
| Product Owner / Business Analyst | Clarifies dormitory operations, prioritizes backlog, defines acceptance criteria. |
| Tech Lead / Architect | Owns technical decisions, database shape, rule engine, security standards, PR review. |
| Developers | Implement frontend, backend, and integration work. |
| QA | Builds test cases, verifies acceptance criteria, reports bugs, supports UAT. |
| UI/UX Designer | Produces prototype, validates flows, supports usability review. |

## Deliverables

| Deliverable | Format | Target Use |
| --- | --- | --- |
| Project-management document set | Markdown and existing Word package | Course review, team alignment, future export to PDF/Word. |
| MVP web-responsive prototype | Figma design file | UI validation before implementation. |
| Product backlog and sprint plan | Markdown, Kanban/GitHub Projects | Sprint planning and traceability. |
| PoC report | Markdown | Validate risky technical assumptions before full build. |
| Demo-ready MVP | Web app source code, README, sample data | Final demo and defense. |

## Key Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Initial room/student data may be dirty. | Assignment and dashboard quality may be misleading. | Define sample data, validation rules, and import checklist before build. |
| Assignment rules may expand too much. | MVP delay and hard-to-test logic. | Limit MVP rules to gender, capacity, status, policy priority, cohort/major when available. |
| Student personal data requires careful access control. | Privacy and compliance risk. | Apply RBAC, minimal access, and no broad export in MVP. |
| Staff may resist switching from Excel/Zalo. | Adoption risk. | Keep operational flows short and dashboard actionable. |
| Dashboard may become decorative. | Low management value. | Require every KPI to link to a list of records that staff can act on. |

