export type BadgeTone = 'default' | 'secondary' | 'outline' | 'destructive';

export type AdminMetric = {
  label: string;
  value: string;
  hint: string;
  trend: string;
  tone?: BadgeTone;
};

export type AdminUser = {
  id: string;
  name: string;
  role: 'Admin' | 'Dormitory Staff' | 'Maintenance' | 'Student Affairs' | 'Student';
  scope: string;
  status: 'Active' | 'Pending review' | 'Locked';
  lastActive: string;
  risk: string;
};

export type BuildingSummary = {
  id: string;
  building: string;
  genderPolicy: string;
  rooms: number;
  beds: number;
  occupied: number;
  available: number;
  hold: number;
  risk: string;
  owner: string;
};

export type RoomLedgerRecord = {
  room: string;
  capacity: number;
  occupied: number;
  availableBeds: string;
  status: 'Available' | 'Full' | 'Maintenance hold';
  gender: 'Male' | 'Female';
  assets: string;
  auditHint: string;
};

export type AllocationRule = {
  id: string;
  name: string;
  category: 'Required' | 'Priority' | 'Guardrail';
  status: 'Enabled' | 'Draft' | 'Disabled';
  priority: number;
  explanation: string;
  lastChanged: string;
  auditHint: string;
};

export type AuditRecord = {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  reason: string;
  severity: 'Info' | 'Review' | 'High';
};

export type ReportRecord = {
  id: string;
  name: string;
  owner: string;
  cadence: string;
  source: string;
  status: 'Ready' | 'Draft' | 'Deferred export';
};

export type SystemSetting = {
  name: string;
  value: string;
  owner: string;
  status: 'Active' | 'Needs review' | 'Deferred';
  note: string;
};

export const adminMetrics: AdminMetric[] = [
  {
    label: 'Occupancy',
    value: '87%',
    hint: '348 of 400 beds occupied',
    trend: '+2.4% vs last week',
    tone: 'default',
  },
  {
    label: 'Available beds',
    value: '26',
    hint: '18 male, 8 female',
    trend: 'Drill into ledger',
    tone: 'secondary',
  },
  {
    label: 'Pending role changes',
    value: '5',
    hint: '3 staff, 2 student affairs',
    trend: 'Requires admin reason',
    tone: 'outline',
  },
  {
    label: 'Audit reviews',
    value: '7',
    hint: 'Sensitive actions this week',
    trend: '2 high priority',
    tone: 'destructive',
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: 'USR-ADM-001',
    name: 'Tran Minh Quan',
    role: 'Admin',
    scope: 'All buildings',
    status: 'Active',
    lastActive: '10 minutes ago',
    risk: 'Owner for semester setup and RBAC review',
  },
  {
    id: 'USR-STF-014',
    name: 'Nguyen Thi Lan',
    role: 'Dormitory Staff',
    scope: 'Building A, B',
    status: 'Pending review',
    lastActive: 'Yesterday',
    risk: 'Requested allocation override access',
  },
  {
    id: 'USR-MTN-008',
    name: 'Le Bao Long',
    role: 'Maintenance',
    scope: 'Assigned tickets only',
    status: 'Active',
    lastActive: '2 hours ago',
    risk: 'No student personal data export permission',
  },
  {
    id: 'USR-SAF-003',
    name: 'Pham Thu Ha',
    role: 'Student Affairs',
    scope: 'Dashboard read-only',
    status: 'Active',
    lastActive: 'Today',
    risk: 'Leadership dashboard, no configuration edit',
  },
  {
    id: 'USR-STU-162',
    name: 'Pham Hoang Hai',
    role: 'Student',
    scope: 'Own records only',
    status: 'Locked',
    lastActive: '4 days ago',
    risk: 'Locked after three failed login attempts',
  },
];

export const buildingSummaries: BuildingSummary[] = [
  {
    id: 'BLD-A',
    building: 'Building A',
    genderPolicy: 'Male floors 1-5',
    rooms: 80,
    beds: 320,
    occupied: 279,
    available: 23,
    hold: 18,
    risk: 'A-302 fan asset under maintenance',
    owner: 'North campus team',
  },
  {
    id: 'BLD-B',
    building: 'Building B',
    genderPolicy: 'Female floors 1-6',
    rooms: 64,
    beds: 256,
    occupied: 231,
    available: 8,
    hold: 17,
    risk: 'Low availability for K2023 intake',
    owner: 'South campus team',
  },
  {
    id: 'BLD-C',
    building: 'Building C',
    genderPolicy: 'Mixed by floor',
    rooms: 48,
    beds: 192,
    occupied: 149,
    available: 19,
    hold: 24,
    risk: 'Renovation block pending inspection',
    owner: 'Facilities admin',
  },
];

export const roomLedger: RoomLedgerRecord[] = [
  {
    room: 'A-302',
    capacity: 4,
    occupied: 3,
    availableBeds: 'A-302-B4',
    status: 'Available',
    gender: 'Male',
    assets: 'Fan QR-A302-FAN01, 4 beds, 4 lockers',
    auditHint: 'Last check-in updated by staff with checklist evidence',
  },
  {
    room: 'A-304',
    capacity: 4,
    occupied: 4,
    availableBeds: '-',
    status: 'Full',
    gender: 'Male',
    assets: '4 beds, 4 desks, shared router',
    auditHint: 'No open override in current semester',
  },
  {
    room: 'B-210',
    capacity: 6,
    occupied: 5,
    availableBeds: 'B-210-B6',
    status: 'Available',
    gender: 'Female',
    assets: '6 beds, 6 lockers, water heater',
    auditHint: 'Priority candidate list linked to APP-2026-001',
  },
  {
    room: 'C-118',
    capacity: 4,
    occupied: 0,
    availableBeds: '-',
    status: 'Maintenance hold',
    gender: 'Male',
    assets: 'Electrical inspection pending',
    auditHint: 'Hold reason required before assignment suggestions resume',
  },
];

export const allocationRules: AllocationRule[] = [
  {
    id: 'RULE-001',
    name: 'Gender policy must match room floor',
    category: 'Required',
    status: 'Enabled',
    priority: 1,
    explanation: 'Rejects rooms whose configured gender policy conflicts with student profile.',
    lastChanged: '2026-06-24 by Admin',
    auditHint: 'Cannot be disabled without governance approval',
  },
  {
    id: 'RULE-002',
    name: 'Open capacity and active semester only',
    category: 'Required',
    status: 'Enabled',
    priority: 2,
    explanation: 'Suggest only beds marked available in the current semester ledger.',
    lastChanged: '2026-06-23 by Admin',
    auditHint: 'Linked to US-006 room/bed ledger',
  },
  {
    id: 'RULE-003',
    name: 'Prefer same cohort and major',
    category: 'Priority',
    status: 'Enabled',
    priority: 3,
    explanation: 'Ranks rooms with matching K2023 and IT cohort roommates higher.',
    lastChanged: '2026-06-21 by Dormitory Staff',
    auditHint: 'Weight can change, reason is recorded',
  },
  {
    id: 'RULE-004',
    name: 'Maintenance hold blocks suggestions',
    category: 'Guardrail',
    status: 'Draft',
    priority: 4,
    explanation: 'Excludes rooms or assets with unresolved safety tickets.',
    lastChanged: 'Draft for Sprint 2 review',
    auditHint: 'Deferred until maintenance handoff confirms statuses',
  },
];

export const auditRecords: AuditRecord[] = [
  {
    id: 'AUD-2026-091',
    time: '2026-06-27 09:12',
    actor: 'Nguyen Thi Lan',
    action: 'Requested role upgrade',
    target: 'USR-STF-014',
    reason: 'Temporary assignment support for Building B intake',
    severity: 'Review',
  },
  {
    id: 'AUD-2026-088',
    time: '2026-06-26 16:45',
    actor: 'Tran Minh Quan',
    action: 'Put room on maintenance hold',
    target: 'C-118',
    reason: 'Electrical inspection pending after facilities report',
    severity: 'High',
  },
  {
    id: 'AUD-2026-083',
    time: '2026-06-26 11:30',
    actor: 'System mock',
    action: 'Generated dashboard snapshot',
    target: 'Operations dashboard',
    reason: 'Daily KPI refresh for leadership review',
    severity: 'Info',
  },
  {
    id: 'AUD-2026-079',
    time: '2026-06-25 14:08',
    actor: 'Dormitory Staff',
    action: 'Edited allocation rule weight',
    target: 'RULE-003',
    reason: 'Balance cohort preference with available capacity',
    severity: 'Review',
  },
];

export const reports: ReportRecord[] = [
  {
    id: 'RPT-001',
    name: 'Occupancy and available bed summary',
    owner: 'Student Affairs',
    cadence: 'Daily',
    source: 'v_room_occupancy, rooms, student_rooms',
    status: 'Ready',
  },
  {
    id: 'RPT-002',
    name: 'Pending applications by priority',
    owner: 'Dormitory Staff',
    cadence: 'Twice weekly',
    source: 'applications, profiles',
    status: 'Ready',
  },
  {
    id: 'RPT-003',
    name: 'Sensitive admin action audit',
    owner: 'Admin',
    cadence: 'Weekly',
    source: 'audit_logs',
    status: 'Draft',
  },
  {
    id: 'RPT-004',
    name: 'PDF/Excel export package',
    owner: 'Leadership',
    cadence: 'Phase 2',
    source: 'report endpoints later',
    status: 'Deferred export',
  },
];

export const systemSettings: SystemSetting[] = [
  {
    name: 'Active semester',
    value: '2026 Summer Pilot',
    owner: 'Admin',
    status: 'Active',
    note: 'Used by applications, room ledger, and dashboard snapshots.',
  },
  {
    name: 'Privacy notice version',
    value: 'DCH-CONSENT-2026-01',
    owner: 'Member 2 sync',
    status: 'Active',
    note: 'Students must accept before submitting an application.',
  },
  {
    name: 'SIS sync',
    value: 'Disabled',
    owner: 'Phase 3 integration',
    status: 'Deferred',
    note: 'No real SIS integration in this frontend-only MVP.',
  },
  {
    name: 'Audit export',
    value: 'Read-only placeholder',
    owner: 'Phase 2 reporting',
    status: 'Needs review',
    note: 'Broad export is deferred; screen keeps scope visible.',
  },
];

export const dashboardQueues = [
  {
    label: 'Room/bed ledger',
    count: '4 records need review',
    action: 'Resolve C-118 maintenance hold before assignment',
    source: 'US-006',
  },
  {
    label: 'RBAC governance',
    count: '5 pending role changes',
    action: 'Approve or reject with admin reason',
    source: 'US-001 / US-020 draft',
  },
  {
    label: 'Reports',
    count: '2 leadership snapshots ready',
    action: 'Review occupancy and pending applications',
    source: 'US-014 / US-015',
  },
];
