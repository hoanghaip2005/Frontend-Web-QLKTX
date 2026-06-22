# Definition of Done

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-DOD |
| Version | 1.0 |
| Status | Draft for review |
| Owner | Group 3 |
| Updated | 2026-06-02 |
| Source files | `Group3_DormCare_Hub _ Định nghĩa quy trình phần mềm.docx`; instructor Software Process example |

## Purpose

Definition of Done defines the minimum quality bar for a DormCare Hub task or user story. A story is not Done because the UI exists or the code compiles. It is Done only when it is implemented, reviewed, tested, documented, and demo-ready with realistic sample data.

## Workflow State

| State | Meaning | Exit Condition |
| --- | --- | --- |
| Backlog | Item is recorded but not ready for sprint execution. | Acceptance criteria and sample data are defined. |
| Ready | Item can be selected for a sprint. | PO/BA and Tech Lead agree scope is clear. |
| In Progress | Implementation is underway. | Code and related assets are ready for review. |
| Review | PR, UI, API, and data changes are being reviewed. | No blocker comments remain. |
| QA Testing | QA verifies acceptance criteria and negative cases. | No Critical or High bug remains. |
| Done | Story meets the checklist below. | Demo-ready and evidence is recorded. |
| Released to Staging | Story is available in staging or demo environment. | Sprint Review can run the flow end-to-end. |

## Story-Level Checklist

| Area | Done Criteria | Checked By | Evidence |
| --- | --- | --- | --- |
| Requirement | User story, role, business value, and acceptance criteria are clear. | Product Owner / BA | Backlog item or story note. |
| Scope | Work matches MVP boundary and does not add unapproved Phase 2/3 scope. | PM / Scrum Master | Sprint board and change log. |
| UI/UX | Screen follows approved prototype or documented deviation. | UI/UX Designer + QA | Screenshot or Figma reference. |
| Code | Code is merged into the agreed branch after PR review. | Tech Lead | Pull request link and reviewer approval. |
| CI | Lint, test, and build pass in CI. | Developer | CI run link or screenshot. |
| Tests | Unit or integration tests cover new module behavior; target module coverage is at least 70 percent. | Developer + QA | Test output or coverage report. |
| QA | QA verifies acceptance criteria and no Critical/High bug remains. | QA | Test case result and bug list. |
| Security | RBAC and data visibility are checked for the affected roles. | Tech Lead + QA | Negative test result. |
| Data | Demo/sample data exists and can reproduce the user flow. | Developer + QA | Seed data or test data note. |
| Documentation | API, schema, environment variable, or operational docs are updated if changed. | Developer + BA | Updated doc or README section. |
| Demo | The feature can be demonstrated in Sprint Review. | PM / Scrum Master | Sprint Review script or demo checklist. |

## Security and Privacy Requirements

These checks are mandatory for any story touching student data, room assignment, billing, maintenance history, or dashboard records.

| Requirement | Minimum Check |
| --- | --- |
| Student access | A student can view only their own application, stay, room/bed assignment, ticket, and notifications. |
| Dormitory staff access | Staff can view operational data needed for dormitory management but cannot bypass Admin-only configuration. |
| Maintenance access | Maintenance users can see assigned ticket context without unnecessary student personal data. |
| Leadership dashboard | Leadership can view aggregate and operational drill-down data without editing protected configuration. |
| Admin access | Admin-only operations are separated from normal staff workflows. |
| Export or broad data access | Any broad export is outside MVP unless explicitly approved and logged. |

## Story-Specific Additions

| Story Group | Additional Done Criteria |
| --- | --- |
| Application and approval | Includes approval, rejection with reason, status history, and student-visible result. |
| Room/bed ledger | Room/bed status changes are consistent after check-in, check-out, maintenance hold, and manual update. |
| Assignment suggestion | Suggestion explains the rule reasons; override requires a reason. |
| Maintenance ticket | Ticket has location/equipment, priority, assignee, due time, status history, and resolution confirmation/reopen path. |
| Dashboard | Each KPI has a definition, source data, threshold, and drill-down target or action. |

## Evidence Package Per Sprint

At Sprint Review, the team should keep a compact evidence package:

- Sprint goal and completed user stories.
- PR or change list for completed stories.
- CI/test result summary.
- QA test case summary and open bug list.
- Screenshots or Figma links for UI changes.
- Demo script and sample accounts.
- Any unresolved risk or scope decision.

## Not Done Examples

- Screen is built but does not match accepted flow or cannot be demoed with sample data.
- Code is merged but CI fails or tests were skipped without approval.
- Student can access another student's application, room, or ticket.
- Staff can override assignment without recording a reason.
- Dashboard shows a chart but staff cannot identify what action to take.
- API or environment changes are made but documentation is missing.

