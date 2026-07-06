# Proof of Concept

| Field | Value |
| --- | --- |
| Project | DormCare Hub - School Dormitory Management System |
| Document ID | DCH-PMO-POC |
| Version | 1.0 |
| Status | Draft - ready to execute |
| Owner | Group 3 |
| Updated | 2026-06-02 |
| Source files | `Group3_DormCare_Hub_Báo Cáo Nghiên Cứu Khả Thi.docx`; `Group3_DormCare_Hub_Product_Backlog.docx`; instructor PoC example |

## PoC Goal

The PoC validates whether the MVP's riskiest operational assumptions can be implemented with a simple, explainable, student-project-friendly approach before the full build begins.

The PoC focuses on three risks:

1. Rule-based room/bed assignment can produce useful and explainable suggestions.
2. QR-based maintenance ticket creation can reliably bind a ticket to the correct room/bed/equipment and SLA.
3. The dashboard can calculate action-oriented KPIs from the same data used by application, ledger, and ticket workflows.

## Hypotheses

| ID | Hypothesis | Pass Threshold |
| --- | --- | --- |
| H1 | A rule-based assignment engine can suggest suitable rooms/beds from a sample ledger and student application dataset. | At least 80 percent of generated suggestions are acceptable for the sample scenario. |
| H2 | Every assignment suggestion can show clear reasons and constraints. | 100 percent of suggestions include reason codes and disqualifying constraints. |
| H3 | A QR code that stores only a business identifier can open the correct ticket form context. | At least 95 percent of QR scans map to the correct room/bed/equipment record in test data. |
| H4 | SLA status can be computed from ticket priority, assignment time, and due time. | 100 percent of sample tickets show correct New/Assigned/In Progress/Overdue/Resolved/Closed state. |
| H5 | Dashboard KPIs can be calculated from application, ledger, and ticket records without duplicate manual entry. | All selected MVP KPIs calculate correctly from the sample dataset. |

## Questions to Answer

- Which assignment rules are sufficient for MVP without becoming a complex optimization project?
- Can the room/bed ledger stay consistent after assignment, override, check-in, check-out, and maintenance hold?
- What QR payload format is safe for MVP without exposing sensitive data?
- Which SLA thresholds are simple enough for demo but still meaningful to dormitory staff?
- Which dashboard KPIs lead to concrete action instead of decorative charts?

## PoC Scope

| In Scope | Out of Scope |
| --- | --- |
| Sample student applications with gender, cohort, major, priority/policy flag, and preference. | Real SIS integration. |
| Sample building/floor/room/bed ledger with status and capacity. | AI or advanced optimization. |
| Rule-based suggestion with reason codes. | Automatic final assignment without staff review. |
| Override with reason. | Complex multi-objective scheduling. |
| QR payload containing only business identifier. | QR that exposes student data or secret tokens. |
| Maintenance ticket workflow and SLA state calculation. | Real push notification or SMS/Zalo integration. |
| Dashboard KPI calculation from sample data. | Production-scale analytics or predictive reporting. |

## Proposed Technical Stack

| Component | Technology | Reason |
| --- | --- | --- |
| PoC runtime | TypeScript or JavaScript script | Fast to build, easy for group members to understand and demo. |
| Rule engine | Deterministic rule functions | Explainable, testable, and aligned with MVP constraints. |
| Sample data | JSON or CSV | Easy to inspect and modify during review. |
| QR simulation | Static QR values mapped to room/bed/equipment IDs | Enough to validate workflow without hardware dependency. |
| Dashboard metrics | Simple aggregation functions | Confirms KPI definitions before building UI. |
| Prototype | Figma | Validates flow and screen structure before code. |

## Sample Data Requirements

| Dataset | Minimum Records | Required Fields |
| --- | ---: | --- |
| Student applications | 30 | Student ID, gender, cohort, major, priority flag, preferences, application status. |
| Buildings and rooms | 3 buildings, 20 rooms | Building, floor, room number, gender policy, capacity, current occupancy, status. |
| Beds | 80 | Bed ID, room ID, availability, maintenance hold flag. |
| Maintenance assets | 30 | Asset ID, room/bed/equipment type, QR code, status. |
| Tickets | 40 | Ticket ID, reporter, asset, priority, status, assignee, created time, due time, resolved time. |

## Test Scenarios

| Test Case | Scenario | Input | Expected Result | Pass Threshold |
| --- | --- | --- | --- | --- |
| TC-01 | Suggest room for standard student application. | 20 normal applications and available ledger. | Suggestion respects gender, capacity, and room availability. | At least 80 percent acceptable. |
| TC-02 | Suggest room for priority/policy student. | Applications with policy priority. | Priority student receives suitable available bed before lower-priority conflict. | 100 percent rule compliance. |
| TC-03 | Exclude unavailable bed. | Ledger contains full rooms and maintenance-held beds. | Engine never suggests full or maintenance-held bed. | 100 percent exclusion. |
| TC-04 | Explain suggestion. | Each generated suggestion. | Suggestion returns reason codes such as capacity match, policy priority, cohort/major fit. | 100 percent have reasons. |
| TC-05 | Override suggestion. | Staff chooses a different bed. | Override stores original suggestion, chosen bed, actor, timestamp, and reason. | 100 percent recorded. |
| TC-06 | QR ticket context. | Scan 30 QR values. | Ticket form opens with correct room/bed/equipment context. | At least 95 percent correct mapping. |
| TC-07 | SLA workflow. | 40 sample tickets across statuses. | SLA state and overdue flag match ticket timestamps and priority. | 100 percent correct. |
| TC-08 | Dashboard occupancy KPI. | Ledger with check-in/out and maintenance hold. | Occupancy and available bed counts match source data. | 100 percent correct. |
| TC-09 | Dashboard action KPI. | Pending applications and overdue tickets. | KPI links to the correct record list for action. | 100 percent correct list membership. |

## Metrics

| Metric | Unit | Minimum Acceptance |
| --- | --- | --- |
| Useful assignment suggestion rate | Percent | At least 80 percent. |
| Rule violation count | Count | 0 critical violations. |
| Suggestion explainability coverage | Percent | 100 percent. |
| QR context mapping accuracy | Percent | At least 95 percent. |
| SLA state accuracy | Percent | 100 percent. |
| Dashboard KPI calculation accuracy | Percent | 100 percent for selected KPI definitions. |
| PoC script runtime on sample data | Seconds | Under 5 seconds for the sample dataset. |

## Decision Criteria

| Result | Decision |
| --- | --- |
| All thresholds pass. | Continue MVP build with rule-based assignment, QR ticket context, and dashboard KPI approach. |
| Assignment usefulness fails but rule violations are low. | Keep rule engine but reduce MVP rule set and require more staff review. |
| QR mapping fails. | Use manual room/equipment selection in MVP and move QR to Phase 2. |
| Dashboard KPI calculation fails. | Simplify KPI set and delay drill-down until data model stabilizes. |
| Security/privacy issue is found. | Stop affected flow and redesign payload/access rules before Sprint implementation. |

## Expected PoC Deliverables

- Sample data files for applications, room/bed ledger, assets, and tickets.
- Rule-engine script or pseudocode with deterministic output.
- Test result table for TC-01 to TC-09.
- Dashboard KPI definition table.
- Recommendation: continue, continue with constraints, or defer risky feature.

## Traceability

| PoC Area | Backlog IDs | Prototype Screens |
| --- | --- | --- |
| Role-based access and consent | US-001, US-002 | Login/RBAC, Consent |
| Student application and approval | US-003, US-004, US-005 | Student Application, Application Status, Admin Review |
| Room/bed ledger and assignment | US-006, US-008, US-009, US-010 | Room/Bed Ledger, Assignment Suggestion/Override |
| Maintenance and SLA | US-011, US-012, US-013 | Maintenance Ticket, SLA Board |
| Dashboard | US-014, US-015 | Operations Dashboard |

