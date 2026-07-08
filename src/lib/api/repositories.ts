// Domain repositories: screens call these, never fetch directly.
// Each function serves mock data (default) or the Backend-QLKTX REST API
// depending on appConfig.apiMode. Mock mode mutates in-memory copies so
// flows remain demoable offline.

import { appConfig } from '@/config/app';
import type { AuthSession } from '@/config/app';
import { http } from '@/lib/api/http';
import type { AppRole } from '@/types/roles';
import {
  mapApplication,
  mapRoom,
  mapSuggestion,
  mapTicket,
  reviewStatusForDecision,
  type ApplicationDto,
  type RoomDto,
  type SuggestionDto,
  type TicketDto,
} from '@/lib/api/mappers';
import {
  allocationRules,
  applications,
  assignmentSuggestions,
  auditLog,
  currentStudent,
  dashboardKpis,
  invoices,
  residents,
  rooms,
  studentNotifications,
  studentRequests,
  systemUsers,
  tickets,
} from '@/mocks/data/dormData';
import type {
  AllocationRule,
  Application,
  ApplicationReviewCheck,
  AssignmentSuggestion,
  AuditEntry,
  Invoice as MockInvoice,
  Room,
  StudentNotification,
  StudentRequest as MockStudentRequest,
  SystemUser,
  Ticket,
} from '@/mocks/data/dormData';

const live = () => appConfig.apiMode === 'live';
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- auth ----------

export async function login(account: string, password: string): Promise<AuthSession> {
  if (!live()) {
    await delay(200);
    throw new Error('Mock mode: chọn vai trò để vào thẳng portal.');
  }
  const data = await http<{
    id: string;
    role: AppRole;
    full_name: string;
    initials?: string;
    email?: string;
    student_code?: string | null;
    staff_code?: string | null;
  }>('/api/auth/login', { method: 'POST', body: { account, password } });
  return {
    id: data.id,
    role: data.role,
    name: data.full_name,
    code: data.student_code ?? data.staff_code ?? undefined,
    initials:
      data.initials ??
      data.full_name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join(''),
    email: data.email,
  };
}

export async function fetchProfile(): Promise<UserProfile> {
  const [profile, currentRoom] = await Promise.all([
    http<{
      id: string;
      full_name: string;
      email: string;
      role: AppRole;
      status: string;
      student_code?: string | null;
      staff_code?: string | null;
      department?: string | null;
      class_name?: string | null;
      cohort?: string | null;
      phone_number?: string | null;
    }>('/api/auth/me'),
    http<{ room_code: string; bed_code: string } | null>('/api/student-rooms/current').catch(
      () => null,
    ),
  ]);
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    status: profile.status,
    code: profile.student_code ?? profile.staff_code ?? undefined,
    department: profile.department ?? undefined,
    className: profile.class_name ?? undefined,
    cohort: profile.cohort ?? undefined,
    phone: profile.phone_number ?? undefined,
    room: currentRoom?.room_code,
    bed: currentRoom?.bed_code,
  };
}

// Mutable mock stores (deep-copied so page reloads reset state).
const mockState = {
  applications: structuredClone(applications) as Application[],
  tickets: structuredClone(tickets) as Ticket[],
  invoices: structuredClone(invoices) as MockInvoice[],
  rooms: structuredClone(rooms) as Room[],
  requests: structuredClone(studentRequests) as MockStudentRequest[],
  users: structuredClone(systemUsers) as SystemUser[],
  rules: structuredClone(allocationRules) as AllocationRule[],
  audit: structuredClone(auditLog) as AuditEntry[],
  notifications: structuredClone(studentNotifications) as StudentNotification[],
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export type BillingInvoice = {
  backendId?: string;
  code: string;
  studentName?: string;
  studentCode?: string;
  period: string;
  amount: string;
  paidAmount: string;
  balance: string;
  due: string;
  status: 'unpaid' | 'paid' | 'reviewing' | 'partial' | 'rejected';
  rawStatus?: string;
  paymentRecords: Record<string, unknown>[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: string;
  code?: string;
  department?: string;
  className?: string;
  cohort?: string;
  phone?: string;
  room?: string;
  bed?: string;
};

export type StaffTask = {
  backendId: string;
  code: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'done' | 'cancelled' | 'ignored';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignee?: string;
  dueAt?: string;
};

export type AdminDashboard = {
  occupancy: number;
  availableBeds: number;
  pendingApplications: number;
  overdueTickets: number;
  slaCompliance: number;
  auditCount: number;
};

export type AdminReportKpi = {
  occupancy: {
    bedsTotal: number;
    bedsOccupied: number;
    occupancyRate: number;
    roomsTotal: number;
    roomsFull: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    checkedIn: number;
    rejected: number;
  };
  maintenance: {
    open: number;
    overdue: number;
  };
  billing: {
    unpaidInvoices: number;
    outstandingBalance: number;
  };
};

export type AdminBillingReport = {
  totals: {
    billed: number;
    collected: number;
    outstanding: number;
  };
  byStatus: { paymentStatus: string; count: number; amount: number }[];
  monthly: { month: string; billed: number; collected: number }[];
};

export type AdminMaintenanceReport = {
  sla: {
    open: number;
    overdue: number;
    avgResolutionMinutes: number | null;
  };
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
};

export type MomoPaymentSession = {
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
  orderId?: string;
  requestId?: string;
};

type InvoiceDto = {
  id: string;
  invoice_code: string;
  student_name?: string | null;
  student_code?: string | null;
  period_start: string;
  period_end: string;
  total_amount: string | number;
  paid_amount?: string | number | null;
  balance_amount?: string | number | null;
  due_date?: string | null;
  payment_status: string;
  status: string;
  payment_records?: Record<string, unknown>[];
};

export type Building = {
  backendId?: string;
  code: string;
  name: string;
  address?: string;
  genderPolicy?: 'male' | 'female' | 'other';
  status: 'active' | 'maintenance' | 'closed';
  floorsCount?: number;
  roomsCount?: number;
  bedsCount?: number;
  managerName?: string;
};

type BuildingDto = {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  gender_policy?: 'male' | 'female' | 'other' | null;
  status?: 'active' | 'maintenance' | 'closed';
  floors_count?: number | null;
  rooms_count?: number | null;
  beds_count?: number | null;
  manager_name?: string | null;
};

export type UpsertBuildingInput = {
  code: string;
  name: string;
  address?: string;
  floorsCount?: number;
  genderPolicy?: 'male' | 'female' | 'other';
  status: Building['status'];
  managerId?: string;
  note?: string;
};

export type UpsertRoomInput = {
  buildingId: string;
  roomCode: string;
  roomNo: string;
  floor: number;
  capacity: number;
  gender: 'male' | 'female' | 'other';
  status: 'available' | 'full' | 'maintenance' | 'locked';
  monthlyPrice?: number;
  note?: string;
};

export type RoomAsset = {
  backendId?: string;
  assetCode: string;
  name: string;
  category: string;
  status: 'ok' | 'broken' | 'maintenance' | 'missing' | 'retired';
};

export type CreateSystemUserInput = {
  name: string;
  email: string;
  role: SystemUser['role'];
  code?: string;
};

type SystemUserDto = {
  id: string;
  email?: string;
  full_name: string;
  role: string;
  status: string;
  student_code?: string | null;
  staff_code?: string | null;
  department?: string | null;
  class_name?: string | null;
  cohort?: string | null;
  phone_number?: string | null;
  created_at?: string;
  updated_at?: string;
};

function formatCurrency(value: string | number | null | undefined) {
  return currencyFormatter.format(Number(value ?? 0));
}

function parseMockMoney(value: string | number | null | undefined) {
  if (typeof value === 'number') return value;
  return Number(String(value ?? '0').replace(/[^\d]/g, '')) || 0;
}

function invoiceStatus(status: string): BillingInvoice['status'] {
  if (status === 'paid') return 'paid';
  if (status === 'pending_reconciliation') return 'reviewing';
  if (status === 'partial') return 'partial';
  if (status === 'rejected') return 'rejected';
  return 'unpaid';
}

function mapInvoice(row: InvoiceDto): BillingInvoice {
  return {
    backendId: row.id,
    code: row.invoice_code,
    studentName: row.student_name ?? undefined,
    studentCode: row.student_code ?? undefined,
    period: `${row.period_start.slice(0, 10)} - ${row.period_end.slice(0, 10)}`,
    amount: formatCurrency(row.total_amount),
    paidAmount: formatCurrency(row.paid_amount),
    balance: formatCurrency(row.balance_amount ?? row.total_amount),
    due: row.due_date?.slice(0, 10) ?? '-',
    status: invoiceStatus(row.payment_status),
    rawStatus: row.payment_status,
    paymentRecords: row.payment_records ?? [],
  };
}

function mapBuilding(row: BuildingDto): Building {
  return {
    backendId: row.id,
    code: row.code,
    name: row.name,
    address: row.address ?? undefined,
    genderPolicy: row.gender_policy ?? undefined,
    status: row.status ?? 'active',
    floorsCount: row.floors_count ?? undefined,
    roomsCount: row.rooms_count ?? undefined,
    bedsCount: row.beds_count ?? undefined,
    managerName: row.manager_name ?? undefined,
  };
}

function mapSystemUser(row: SystemUserDto): SystemUser {
  return {
    backendId: row.id,
    email: row.email ?? row.id,
    name: row.full_name,
    role: (['student', 'staff', 'admin'].includes(row.role)
      ? row.role
      : 'staff') as SystemUser['role'],
    status: row.status === 'active' ? 'active' : row.status === 'invited' ? 'invited' : 'locked',
    lastActive: (row.updated_at ?? row.created_at)?.slice(0, 16).replace('T', ' ') ?? '-',
    code: row.student_code ?? row.staff_code ?? undefined,
    cohort: row.cohort ?? undefined,
    unit: row.department ?? row.class_name ?? undefined,
    phone: row.phone_number ?? undefined,
  };
}

function mapReportKpi(row: {
  occupancy: {
    beds_total: number;
    beds_occupied: number;
    occupancy_rate: number;
    rooms_total: number;
    rooms_full: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    checked_in: number;
    rejected: number;
  };
  maintenance: { open: number; overdue: number };
  billing: { unpaid_invoices: number; outstanding_balance: number };
}): AdminReportKpi {
  return {
    occupancy: {
      bedsTotal: row.occupancy.beds_total,
      bedsOccupied: row.occupancy.beds_occupied,
      occupancyRate: row.occupancy.occupancy_rate,
      roomsTotal: row.occupancy.rooms_total,
      roomsFull: row.occupancy.rooms_full,
    },
    applications: {
      total: row.applications.total,
      pending: row.applications.pending,
      approved: row.applications.approved,
      checkedIn: row.applications.checked_in,
      rejected: row.applications.rejected,
    },
    maintenance: row.maintenance,
    billing: {
      unpaidInvoices: row.billing.unpaid_invoices,
      outstandingBalance: row.billing.outstanding_balance,
    },
  };
}

function mapBillingReport(row: {
  totals: { billed: number; collected: number; outstanding: number };
  by_status: { payment_status: string; count: number; amount: number }[];
  monthly: { month: string; billed: number; collected: number }[];
}): AdminBillingReport {
  return {
    totals: row.totals,
    byStatus: row.by_status.map((item) => ({
      paymentStatus: item.payment_status,
      count: item.count,
      amount: item.amount,
    })),
    monthly: row.monthly,
  };
}

function monthFromInvoice(invoice: Pick<BillingInvoice, 'period' | 'code'>) {
  const iso = invoice.period.match(/(\d{4})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}`;
  const vi = invoice.period.match(/(\d{2})\/(\d{4})/);
  if (vi) return `${vi[2]}-${vi[1]}`;
  return invoice.code.replace(/^INV-/, '');
}

function billingReportFromInvoices(rows: BillingInvoice[]): AdminBillingReport {
  const totals = rows.reduce(
    (current, invoice) => {
      current.billed += parseMockMoney(invoice.amount);
      current.collected += parseMockMoney(invoice.paidAmount);
      current.outstanding += parseMockMoney(invoice.balance);
      return current;
    },
    { billed: 0, collected: 0, outstanding: 0 },
  );
  const byStatus = Object.values(
    rows.reduce<Record<string, { paymentStatus: string; count: number; amount: number }>>(
      (current, invoice) => {
        const status = invoice.rawStatus ?? invoice.status;
        current[status] ??= { paymentStatus: status, count: 0, amount: 0 };
        current[status].count += 1;
        current[status].amount += parseMockMoney(invoice.amount);
        return current;
      },
      {},
    ),
  );
  const monthly = Object.values(
    rows.reduce<Record<string, { month: string; billed: number; collected: number }>>(
      (current, invoice) => {
        const month = monthFromInvoice(invoice);
        current[month] ??= { month, billed: 0, collected: 0 };
        current[month].billed += parseMockMoney(invoice.amount);
        current[month].collected += parseMockMoney(invoice.paidAmount);
        return current;
      },
      {},
    ),
  ).sort((a, b) => b.month.localeCompare(a.month));
  return { totals, byStatus, monthly };
}

function mapMaintenanceReport(row: {
  sla: { open: number; overdue: number; avg_resolution_minutes: number | null };
  by_category: { category: string; count: number }[];
  by_status: { status: string; count: number }[];
}): AdminMaintenanceReport {
  return {
    sla: {
      open: row.sla.open,
      overdue: row.sla.overdue,
      avgResolutionMinutes: row.sla.avg_resolution_minutes,
    },
    byCategory: row.by_category,
    byStatus: row.by_status,
  };
}

const mockCreatedBuildings: Building[] = [];
const mockBuildingOverrides = new Map<string, Partial<Building>>();

function mockBuildingKey(building: Pick<Building, 'backendId' | 'code'>) {
  return building.backendId ?? building.code;
}

function deriveMockBuildings(): Building[] {
  const derived = [...new Set(mockState.rooms.map((room) => room.building))].map((building) => {
    const buildingRooms = mockState.rooms.filter((room) => room.building === building);
    const code = building.replace(/^Tòa\s+/i, '');
    const base: Building = {
      code,
      name: building,
      status: 'active',
      floorsCount: Math.max(...buildingRooms.map((room) => room.floor), 1),
      roomsCount: buildingRooms.length,
      bedsCount: buildingRooms.reduce((sum, room) => sum + room.capacity, 0),
      genderPolicy: buildingRooms.every((room) => room.gender === 'Nam')
        ? 'male'
        : buildingRooms.every((room) => room.gender === 'Nữ')
          ? 'female'
          : 'other',
    };
    return { ...base, ...mockBuildingOverrides.get(code) };
  });
  const existingCodes = new Set(derived.map((building) => building.code));
  return [
    ...derived,
    ...mockCreatedBuildings.filter((building) => !existingCodes.has(building.code)),
  ];
}

function findMockBuilding(idOrCode: string) {
  return deriveMockBuildings().find(
    (building) => building.backendId === idOrCode || building.code === idOrCode,
  );
}

function toBackendGender(gender: Room['gender']): UpsertRoomInput['gender'] {
  return gender === 'Nữ' ? 'female' : 'male';
}

function toBackendRoomStatus(status: Room['status']): UpsertRoomInput['status'] {
  if (status === 'maintenance-hold') return 'maintenance';
  return status;
}

function roomNoFromCode(code: string) {
  return code.split('-').at(-1)?.trim() || code.trim();
}

function pushMockAudit(action: string, target: string, reason: string) {
  mockState.audit.unshift({
    at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    actor: 'mock.user',
    action,
    target,
    reason,
  });
}

function reviewChecksForDecision(
  decision: 'approved' | 'rejected' | 'needs-update',
  reason: string,
): ApplicationReviewCheck[] {
  if (decision === 'approved') {
    return [
      { label: 'Minh chứng CCCD', result: 'passed' },
      { label: 'Giấy xác nhận sinh viên', result: 'passed' },
      { label: 'Điều kiện đăng ký học kỳ', result: 'passed', note: reason },
    ];
  }
  if (decision === 'needs-update') {
    return [
      { label: 'Minh chứng cần bổ sung', result: 'missing', note: reason },
      { label: 'Hồ sơ được phép nộp lại', result: 'warning' },
    ];
  }
  return [
    { label: 'Điều kiện đăng ký học kỳ', result: 'failed', note: reason },
    { label: 'Kết luận xét duyệt', result: 'failed' },
  ];
}

function progressForReviewDecision(decision: 'approved' | 'rejected' | 'needs-update') {
  if (decision === 'approved') return 70;
  if (decision === 'rejected') return 100;
  return 45;
}

// ---------- dashboards ----------

export type StudentDashboard = {
  roomLabel: string | null;
  bedLabel: string | null;
  application: Application | null;
  openTickets: number;
  unpaidInvoices: number;
  unreadNotifications: number;
};

export async function fetchStudentDashboard(): Promise<StudentDashboard> {
  if (!live()) {
    await delay();
    return {
      roomLabel: currentStudent.room,
      bedLabel: currentStudent.bed,
      application: mockState.applications[0] ?? null,
      openTickets: mockState.tickets.filter(
        (t) => t.reporter === currentStudent.name && !['closed'].includes(t.status),
      ).length,
      unpaidInvoices: 1,
      unreadNotifications: mockState.notifications.filter((n) => !n.read).length,
    };
  }
  const data = await http<{
    room: { room_code?: string; bed_code?: string } | null;
    application: ApplicationDto | null;
    open_tickets: number;
    unpaid_invoices: number;
    unread_notifications: number;
  }>('/api/dashboard/student');
  const dashboardApplication = data.application ? mapApplication(data.application) : null;
  const activeApplication =
    dashboardApplication?.status === 'cancelled'
      ? ((await fetchApplications()).find((application) => application.status !== 'cancelled') ??
        dashboardApplication)
      : dashboardApplication;
  return {
    roomLabel: data.room?.room_code ?? null,
    bedLabel: data.room?.bed_code ?? null,
    application: activeApplication,
    openTickets: data.open_tickets,
    unpaidInvoices: data.unpaid_invoices,
    unreadNotifications: data.unread_notifications,
  };
}

export type StaffDashboard = {
  bedsTotal: number;
  bedsOccupied: number;
  pendingApplications: number;
  openTickets: number;
  urgentTickets: number;
  pendingRequests: number;
};

export async function fetchStaffDashboard(): Promise<StaffDashboard> {
  if (!live()) {
    await delay();
    return {
      bedsTotal: 48,
      bedsOccupied: Math.round((dashboardKpis.occupancy / 100) * 48),
      pendingApplications: dashboardKpis.pendingApplications,
      openTickets: mockState.tickets.filter((t) => t.status !== 'closed').length,
      urgentTickets: mockState.tickets.filter((t) => t.priority === 'urgent').length,
      pendingRequests: 2,
    };
  }
  const data = await http<{
    beds_total: number;
    beds_occupied: number;
    pending_applications: number;
    open_tickets: number;
    urgent_tickets: number;
    pending_requests: number;
  }>('/api/dashboard/staff');
  return {
    bedsTotal: data.beds_total,
    bedsOccupied: data.beds_occupied,
    pendingApplications: data.pending_applications,
    openTickets: data.open_tickets,
    urgentTickets: data.urgent_tickets,
    pendingRequests: data.pending_requests,
  };
}

// ---------- applications ----------

export async function fetchApplications(): Promise<Application[]> {
  if (!live()) {
    await delay();
    return [...mockState.applications];
  }
  return (await http<ApplicationDto[]>('/api/applications?pageSize=50')).map(mapApplication);
}

export async function createAndSubmitApplication(input: {
  desiredBuildingId?: string | null;
  desiredBuildingLabel?: string;
  desiredRoomType?: string;
  lifestyleNeeds: string[];
  priorityNote: string;
  documents: { name: string }[];
}): Promise<Application> {
  if (!live()) {
    await delay();
    const created: Application = {
      id: 'APP-2026-001',
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      gender: 'Nam',
      cohort: currentStudent.cohort,
      major: currentStudent.major,
      priority: input.priorityNote || 'Không',
      preference: [input.desiredBuildingLabel, ...input.lifestyleNeeds].filter(Boolean).join(', '),
      desiredBuildingId: input.desiredBuildingId ?? undefined,
      evidence: input.documents.map((doc) => doc.name),
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    mockState.applications[0] = created;
    return created;
  }
  const draft = await http<ApplicationDto>('/api/applications', {
    method: 'POST',
    body: {
      desired_building_id: input.desiredBuildingId ?? null,
      desired_room_type: input.desiredRoomType,
      lifestyle_needs: input.lifestyleNeeds,
      priority_note: input.priorityNote,
      documents: input.documents,
    },
  });
  return mapApplication(
    await http<ApplicationDto>(`/api/applications/${draft.id}/submit`, { method: 'POST' }),
  );
}

export async function reviewApplication(
  application: Application,
  decision: 'approved' | 'rejected' | 'needs-update',
  reason: string,
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.applications.find((item) => item.id === application.id);
    if (row) {
      row.status = decision;
      row.note = reason;
      row.reviewChecks = reviewChecksForDecision(decision, reason);
      row.progressPercent = progressForReviewDecision(decision);
      row.reviewedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
    pushMockAudit(`application.review.${decision}`, application.id, reason);
    return;
  }
  await http(`/api/applications/${application.backendId}/review`, {
    method: 'POST',
    body: {
      status: reviewStatusForDecision[decision],
      review_checks: reviewChecksForDecision(decision, reason),
      progress_percent: progressForReviewDecision(decision),
      staff_note: reason,
      ...(decision === 'rejected' ? { rejection_reason: reason } : {}),
    },
  });
}

export async function fetchSuggestion(
  application: Application,
): Promise<AssignmentSuggestion | null> {
  if (!live()) {
    await delay();
    return (
      assignmentSuggestions.find((item) => item.applicationId === application.id) ??
      assignmentSuggestions[0] ??
      null
    );
  }
  const dto = await http<SuggestionDto>(`/api/applications/${application.backendId}/suggestions`);
  return mapSuggestion(dto, application.studentName);
}

export async function assignApplication(
  application: Application,
  suggestion: AssignmentSuggestion,
  override?: { bed: string; reason: string; roomId?: string },
): Promise<void> {
  if (!live()) {
    await delay();
    pushMockAudit(
      override ? 'application.assign.override' : 'application.assign',
      `${application.id} → ${override?.bed ?? suggestion.suggestedBed}`,
      override?.reason ?? 'Theo gợi ý rule engine',
    );
    return;
  }
  await http(`/api/applications/${application.backendId}/assign`, {
    method: 'POST',
    body: {
      assigned_room_id: override?.roomId ?? suggestion.roomId,
      assigned_bed_code: override?.bed ?? suggestion.suggestedBed,
      assignment_reasons: suggestion.reasons,
      status: 'suggested',
      ...(override ? { override_reason: override.reason } : {}),
    },
  });
}

export async function confirmAssignment(application: Application): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.applications.find((item) => item.id === application.id);
    if (row) {
      row.status = 'waiting-checkin';
      row.progressPercent = Math.max(row.progressPercent ?? 0, 90);
    }
    return;
  }
  await http(`/api/applications/${application.backendId}/confirm`, { method: 'POST' });
}

export async function verifyCheckinQr(application: Application, code: string): Promise<void> {
  if (!live()) {
    await delay();
    const assignedRoom = application.assignedBed?.replace(/-B\d+$/, '');
    const normalized = code.trim().toUpperCase();
    const expected = assignedRoom ? `ROOM-${assignedRoom.replaceAll('-', '')}` : '';
    if (assignedRoom && ![expected, `ROOM-${assignedRoom}`, assignedRoom].includes(normalized)) {
      throw new Error('Mã QR không khớp phòng được phân.');
    }
    const row = mockState.applications.find((item) => item.id === application.id);
    if (row) {
      row.qrVerified = true;
      row.qrVerifiedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
      row.progressPercent = Math.max(row.progressPercent ?? 0, 95);
    }
    pushMockAudit('application.check_in_qr', application.id, code);
    return;
  }
  await http(`/api/applications/${application.backendId}/check-in-qr`, {
    method: 'POST',
    body: { code },
  });
}

export async function checkInApplication(application: Application, note: string): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.applications.find((item) => item.id === application.id);
    if (row) row.status = 'checked-in';
    pushMockAudit('application.check_in', application.id, note);
    return;
  }
  await http(`/api/applications/${application.backendId}/check-in`, {
    method: 'POST',
    body: { checkin_note: note },
  });
}

// ---------- rooms ----------

export async function fetchRooms(): Promise<Room[]> {
  if (!live()) {
    await delay();
    return [...mockState.rooms];
  }
  return (await http<RoomDto[]>('/api/rooms?pageSize=100')).map(mapRoom);
}

export async function fetchBuildings(): Promise<Building[]> {
  if (!live()) {
    await delay();
    return deriveMockBuildings();
  }
  return (await http<BuildingDto[]>('/api/buildings')).map(mapBuilding);
}

export async function createBuilding(input: UpsertBuildingInput): Promise<void> {
  if (!live()) {
    await delay();
    mockCreatedBuildings.push({
      code: input.code,
      name: input.name,
      address: input.address,
      floorsCount: input.floorsCount,
      genderPolicy: input.genderPolicy,
      status: input.status,
      roomsCount: 0,
      bedsCount: 0,
    });
    pushMockAudit('building.create', input.code, input.note ?? 'Tạo tòa nhà mới');
    return;
  }
  await http('/api/buildings', {
    method: 'POST',
    body: {
      code: input.code,
      name: input.name,
      address: input.address,
      floors_count: input.floorsCount,
      gender_policy: input.genderPolicy,
      manager_id: input.managerId,
      status: input.status,
    },
  });
}

export async function updateBuilding(
  building: Building,
  input: UpsertBuildingInput,
): Promise<void> {
  if (!live()) {
    await delay();
    const key = mockBuildingKey(building);
    const created = mockCreatedBuildings.find((item) => mockBuildingKey(item) === key);
    const patch: Partial<Building> = {
      code: input.code,
      name: input.name,
      address: input.address,
      floorsCount: input.floorsCount,
      genderPolicy: input.genderPolicy,
      status: input.status,
    };
    if (created) {
      Object.assign(created, patch);
    } else {
      mockBuildingOverrides.set(key, patch);
      if (input.name !== building.name) {
        mockState.rooms
          .filter((room) => room.building === building.name)
          .forEach((room) => {
            room.building = input.name;
          });
      }
    }
    pushMockAudit('building.update', input.code, input.note ?? 'Cập nhật tòa nhà');
    return;
  }
  if (!building.backendId) throw new Error('Thiếu mã tòa nhà backend');
  await http(`/api/buildings/${building.backendId}`, {
    method: 'PATCH',
    body: {
      code: input.code,
      name: input.name,
      address: input.address,
      floors_count: input.floorsCount,
      gender_policy: input.genderPolicy,
      manager_id: input.managerId,
      status: input.status,
    },
  });
}

export async function fetchCurrentRoom(): Promise<{
  roomId?: string;
  roomCode: string | null;
  bedCode: string | null;
  roommates: { name: string; bed: string; cohort?: string }[];
}> {
  if (!live()) {
    await delay();
    const myRoom = mockState.rooms.find((room) => room.id === currentStudent.room);
    return {
      roomId: currentStudent.room,
      roomCode: currentStudent.room,
      bedCode: currentStudent.bed,
      roommates:
        myRoom?.beds
          .filter((bed) => bed.occupant && bed.id !== currentStudent.bed)
          .map((bed) => ({ name: bed.occupant ?? '', bed: bed.id })) ?? [],
    };
  }
  const [current, roommates] = await Promise.all([
    http<{ room_id?: string; room_code: string; bed_code: string } | null>(
      '/api/student-rooms/current',
    ),
    http<{ full_name: string; bed_code: string; cohort?: string }[]>(
      '/api/student-rooms/roommates',
    ).catch(() => []),
  ]);
  if (!current) {
    const checkedIn = (await fetchApplications()).find(
      (application) => application.status === 'checked-in' && application.assignedBed,
    );
    const assignedBed = checkedIn?.assignedBed;
    const roomCode = assignedBed?.replace(/-B\d+$/, '') ?? null;
    return {
      roomId: undefined,
      roomCode,
      bedCode: assignedBed ?? null,
      roommates: [],
    };
  }
  const roomId =
    current.room_id ??
    (current.room_code
      ? (await fetchRooms()).find((room) => room.id === current.room_code)?.backendId
      : undefined);
  return {
    roomId,
    roomCode: current.room_code,
    bedCode: current.bed_code,
    roommates: roommates
      .filter((mate) => mate.bed_code !== current.bed_code)
      .map((mate) => ({
        name: mate.full_name,
        bed: mate.bed_code,
        cohort: mate.cohort,
      })),
  };
}

// ---------- student rooms (residency ledger) ----------

export type StudentRoomRecord = {
  backendId?: string;
  studentName: string;
  studentCode: string;
  room: string;
  bed: string;
  status: 'checked-in' | 'pending-checkout' | 'checked-out';
  since: string;
};

const studentRoomStatusMap: Record<string, StudentRoomRecord['status']> = {
  active: 'checked-in',
  pending_checkout: 'pending-checkout',
  checked_out: 'checked-out',
  cancelled: 'checked-out',
};

export async function fetchStudentRooms(): Promise<StudentRoomRecord[]> {
  if (!live()) {
    await delay();
    return residents.map((resident) => ({
      studentName: resident.name,
      studentCode: resident.studentId,
      room: resident.room,
      bed: resident.bed,
      status: resident.status === 'checked-out' ? 'checked-out' : 'checked-in',
      since: resident.since,
    }));
  }
  const rows = await http<
    {
      id: string;
      student_name: string;
      student_code?: string | null;
      room_code: string;
      bed_code: string;
      status: string;
      start_date?: string;
    }[]
  >('/api/student-rooms?pageSize=100');
  return rows.map((row) => ({
    backendId: row.id,
    studentName: row.student_name,
    studentCode: row.student_code ?? '-',
    room: row.room_code,
    bed: row.bed_code.startsWith(row.room_code) ? row.bed_code : `${row.room_code}-${row.bed_code}`,
    status: studentRoomStatusMap[row.status] ?? 'checked-in',
    since: row.start_date?.slice(0, 10) ?? '-',
  }));
}

export async function checkoutStudentRoom(record: StudentRoomRecord, note: string): Promise<void> {
  if (!live()) {
    await delay();
    const row = residents.find((resident) => resident.studentId === record.studentCode);
    if (row) row.status = 'checked-out';
    pushMockAudit('student_room.checkout', `${record.studentCode} - ${record.bed}`, note);
    return;
  }
  await http(`/api/student-rooms/${record.backendId}/checkout`, {
    method: 'POST',
    body: { status: 'checked_out', checkout_note: note },
  });
}

// ---------- tickets ----------

export async function fetchTickets(): Promise<Ticket[]> {
  if (!live()) {
    await delay();
    return [...mockState.tickets];
  }
  return (await http<TicketDto[]>('/api/tickets?pageSize=50')).map(mapTicket);
}

export async function createTicket(input: {
  title: string;
  description: string;
  priority: string;
  roomId?: string;
  assetId?: string;
  assetName?: string;
  category?: string;
}): Promise<Ticket> {
  if (!live()) {
    await delay();
    const created: Ticket = {
      id: `MT-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      title: input.title,
      room: currentStudent.room,
      asset: input.assetName,
      reporter: currentStudent.name,
      priority: input.priority as Ticket['priority'],
      status: 'new',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      dueAt: '-',
      overdue: false,
      description: input.description,
      history: [
        {
          at: new Date().toISOString().slice(0, 16).replace('T', ' '),
          event: 'Sinh viên tạo ticket, chờ phân loại',
        },
      ],
    };
    mockState.tickets.unshift(created);
    return created;
  }
  const dto = await http<TicketDto>('/api/tickets', {
    method: 'POST',
    body: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      room_id: input.roomId,
      asset_id: input.assetId,
      category: input.category ?? 'other',
    },
  });
  return mapTicket(dto);
}

const slaHoursByPriority: Record<string, number> = { urgent: 12, high: 24, normal: 48, low: 72 };

export async function assignTicket(
  ticket: Ticket,
  input: { assigneeName: string; assigneeId?: string; priority: string },
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.tickets.find((item) => item.id === ticket.id);
    if (row) {
      row.status = 'assigned';
      row.assignee = input.assigneeName;
      row.priority = input.priority as Ticket['priority'];
    }
    return;
  }
  await http(`/api/tickets/${ticket.backendId}`, {
    method: 'PATCH',
    body: { priority: input.priority },
  });
  await http(`/api/tickets/${ticket.backendId}/assign`, {
    method: 'POST',
    body: {
      assigned_to: input.assigneeId,
      sla_due_at: new Date(
        Date.now() + (slaHoursByPriority[input.priority] ?? 48) * 3600e3,
      ).toISOString(),
    },
  });
}

export async function setTicketResolved(ticket: Ticket, note: string): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.tickets.find((item) => item.id === ticket.id);
    if (row) {
      row.status = 'resolved';
      row.overdue = false;
      row.history.push({
        at: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: `Đã xử lý: ${note}`,
      });
    }
    return;
  }
  await http(`/api/tickets/${ticket.backendId}/status`, {
    method: 'POST',
    body: { status: 'waiting_student_confirm', staff_note: note },
  });
}

export async function confirmTicket(
  ticket: Ticket,
  accepted: boolean,
  note?: string,
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.tickets.find((item) => item.id === ticket.id);
    if (row) row.status = accepted ? 'closed' : 'reopened';
    return;
  }
  await http(`/api/tickets/${ticket.backendId}/confirm`, {
    method: 'POST',
    body: { accepted, ...(note ? { note } : {}) },
  });
}

export async function fetchStaffAssignees(): Promise<{ id: string; name: string }[]> {
  if (!live()) {
    await delay(100);
    return [
      { id: 'mock-1', name: 'Tổ điện - Anh Cường' },
      { id: 'mock-2', name: 'Tổ nước - Anh Bình' },
      { id: 'mock-3', name: 'Tổ cơ khí - Anh Dũng' },
    ];
  }
  const rows = await http<{ id: string; full_name: string }[]>(
    '/api/profiles?role=staff&pageSize=50',
  );
  return rows.map((row) => ({ id: row.id, name: row.full_name }));
}

// ---------- invoices / billing ----------

export async function fetchInvoices(): Promise<BillingInvoice[]> {
  if (!live()) {
    await delay();
    return mockState.invoices.map((invoice) => ({
      code: invoice.id,
      period: invoice.period,
      amount: invoice.amount,
      paidAmount: invoice.status === 'paid' ? invoice.amount : '0đ',
      balance: invoice.status === 'paid' ? '0đ' : invoice.amount,
      due: invoice.due,
      status: invoice.status,
      paymentRecords: [],
    }));
  }
  return (await http<InvoiceDto[]>('/api/invoices?pageSize=100')).map(mapInvoice);
}

export async function createMomoPayment(invoice: BillingInvoice): Promise<MomoPaymentSession> {
  if (!live()) {
    await delay();
    return {
      payUrl: '/student/invoices?payment=success',
      qrCodeUrl: '/student/invoices?payment=success',
      orderId: `MOCK-${invoice.code}`,
    };
  }
  if (!invoice.backendId) throw new Error('Thiếu mã hóa đơn');
  return http<MomoPaymentSession>(`/api/invoices/${invoice.backendId}/momo`, { method: 'POST' });
}

export async function markInvoicePaid(invoice: BillingInvoice, note: string): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.invoices.find((item) => item.id === invoice.code);
    if (row) row.status = 'paid';
    return;
  }
  if (!invoice.backendId) throw new Error('Thiếu mã hóa đơn');
  await http(`/api/invoices/${invoice.backendId}/reconcile`, {
    method: 'POST',
    body: {
      payment_records: [
        ...invoice.paymentRecords,
        {
          id: `manual-${Date.now()}`,
          method: 'manual',
          amount: Number(invoice.balance.replace(/\D/g, '')) || 0,
          status: 'verified',
          note,
          created_at: new Date().toISOString(),
        },
      ],
      payment_status: 'paid',
      status: 'paid',
      paid_at: new Date().toISOString(),
      note,
    },
  });
}

// ---------- student requests ----------

export type StudentServiceRequest = {
  backendId?: string;
  code: string;
  type: string;
  detail: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'cancelled' | 'completed';
};

export type CreateStudentRequestInput = {
  type:
    | 'change_room'
    | 'extend_stay'
    | 'checkout'
    | 'temporary_residence'
    | 'reflection'
    | 'late_entry'
    | 'other';
  reason: string;
};

type StudentRequestDto = {
  id: string;
  request_code: string;
  type: CreateStudentRequestInput['type'];
  status: string;
  reason?: string | null;
  created_at: string;
  current_room_code?: string | null;
  target_room_code?: string | null;
};

const requestTypeLabel: Record<CreateStudentRequestInput['type'], string> = {
  change_room: 'Đổi phòng',
  extend_stay: 'Gia hạn lưu trú',
  checkout: 'Trả phòng',
  temporary_residence: 'Tạm trú',
  reflection: 'Phản ánh',
  late_entry: 'Về muộn',
  other: 'Khác',
};

function requestStatus(status: string): StudentServiceRequest['status'] {
  if (status === 'in_review') return 'reviewing';
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'completed') return 'completed';
  if (status === 'submitted') return 'submitted';
  return 'draft';
}

function mapStudentRequest(row: StudentRequestDto): StudentServiceRequest {
  return {
    backendId: row.id,
    code: row.request_code,
    type: requestTypeLabel[row.type] ?? row.type,
    detail: row.reason ?? '-',
    createdAt: row.created_at.slice(0, 16).replace('T', ' '),
    status: requestStatus(row.status),
  };
}

export async function fetchStudentRequests(): Promise<StudentServiceRequest[]> {
  if (!live()) {
    await delay();
    return mockState.requests.map((request) => ({
      code: request.id,
      type: request.type,
      detail: request.detail,
      createdAt: request.createdAt,
      status: request.status === 'pending' ? 'submitted' : request.status,
    }));
  }
  return (await http<StudentRequestDto[]>('/api/requests?pageSize=100')).map(mapStudentRequest);
}

export async function createStudentRequest(
  input: CreateStudentRequestInput,
): Promise<StudentServiceRequest> {
  if (!live()) {
    await delay();
    const created: MockStudentRequest = {
      id: `REQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${String(mockState.requests.length + 1).padStart(3, '0')}`,
      type: requestTypeLabel[input.type],
      detail: input.reason,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'pending',
    };
    mockState.requests.unshift(created);
    return {
      code: created.id,
      type: created.type,
      detail: created.detail,
      createdAt: created.createdAt,
      status: 'submitted',
    };
  }

  const draft = await http<StudentRequestDto>('/api/requests', {
    method: 'POST',
    body: { type: input.type, reason: input.reason },
  });
  const submitted = await http<StudentRequestDto>(`/api/requests/${draft.id}/submit`, {
    method: 'POST',
  });
  return mapStudentRequest(submitted);
}

// ---------- admin ----------

export async function fetchSystemUsers(): Promise<SystemUser[]> {
  if (!live()) {
    await delay();
    return [...mockState.users];
  }
  return (await http<SystemUserDto[]>('/api/profiles?pageSize=100')).map(mapSystemUser);
}

export async function setUserLocked(
  user: SystemUser,
  locked: boolean,
  reason: string,
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.users.find((item) => item.email === user.email);
    if (row) row.status = locked ? 'locked' : 'active';
    pushMockAudit(locked ? 'profile.lock' : 'profile.unlock', user.email, reason);
    return;
  }
  await http(`/api/profiles/${user.backendId}`, {
    method: 'PATCH',
    body: { status: locked ? 'locked' : 'active', metadata: { reason } },
  });
}

export async function setUserRole(
  user: SystemUser,
  role: SystemUser['role'],
  reason: string,
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.users.find((item) => item.email === user.email);
    if (row) row.role = role;
    pushMockAudit('profile.role_update', user.email, reason);
    return;
  }
  if (!user.backendId) throw new Error('Thiếu mã tài khoản backend');
  if (!['student', 'staff', 'admin'].includes(role)) {
    throw new Error('Backend hiện chỉ hỗ trợ role student/staff/admin.');
  }
  await http(`/api/profiles/${user.backendId}`, {
    method: 'PATCH',
    body: { role, metadata: { reason } },
  });
}

export async function createSystemUser(input: CreateSystemUserInput): Promise<SystemUser> {
  if (!live()) {
    await delay();
    const created: SystemUser = {
      email: input.email,
      name: input.name,
      role: input.role,
      status: 'invited',
      lastActive: '-',
      code: input.code || undefined,
    };
    mockState.users.unshift(created);
    pushMockAudit('profile.invite', input.email, `Mời ${input.name}`);
    return created;
  }
  const created = await http<SystemUserDto>('/api/profiles', {
    method: 'POST',
    body: {
      full_name: input.name,
      email: input.email,
      role: input.role,
      ...(input.role === 'student'
        ? { student_code: input.code || undefined }
        : { staff_code: input.code || undefined }),
    },
  });
  return mapSystemUser(created);
}

export async function fetchAllocationRules(): Promise<AllocationRule[]> {
  if (!live()) {
    await delay();
    return [...mockState.rules];
  }
  const rows = await http<
    {
      id: string;
      code: string;
      group_name: 'required' | 'priority' | 'constraint';
      label: string;
      is_enabled: boolean;
      is_required: boolean;
      weight: number;
      config?: { description?: string };
    }[]
  >('/api/allocation-rules');
  return rows.map((row) => ({
    backendId: row.id,
    id: row.code,
    name: row.label,
    type:
      row.is_required || row.group_name === 'required'
        ? ('Bắt buộc' as const)
        : ('Ưu tiên' as const),
    description: row.config?.description ?? row.label,
    weight: row.weight,
    enabled: row.is_enabled,
  }));
}

export async function setRuleEnabled(
  rule: AllocationRule,
  enabled: boolean,
  reason: string,
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.rules.find((item) => item.id === rule.id);
    if (row) row.enabled = enabled;
    pushMockAudit(enabled ? 'rule.enable' : 'rule.disable', rule.id, reason);
    return;
  }
  await http(`/api/allocation-rules/${rule.backendId}`, {
    method: 'PATCH',
    body: { is_enabled: enabled, config: { description: rule.description, reason } },
  });
}

export async function updateAllocationRule(
  rule: AllocationRule,
  input: { weight: number; description: string; reason: string },
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.rules.find((item) => item.id === rule.id);
    if (row) {
      row.weight = input.weight;
      row.description = input.description;
    }
    pushMockAudit('rule.update', rule.id, input.reason);
    return;
  }
  if (!rule.backendId) throw new Error('Thiếu mã rule backend');
  await http(`/api/allocation-rules/${rule.backendId}`, {
    method: 'PATCH',
    body: {
      weight: input.weight,
      config: { description: input.description, reason: input.reason },
    },
  });
}

export async function fetchAuditLogs(): Promise<AuditEntry[]> {
  if (!live()) {
    await delay();
    return [...mockState.audit];
  }
  const rows = await http<
    {
      created_at: string;
      actor_name?: string | null;
      actor_id?: string | null;
      action: string;
      target_table?: string | null;
      target_id?: string | null;
      metadata?: Record<string, unknown>;
    }[]
  >('/api/audit-logs?pageSize=50');
  return rows.map((row) => ({
    at: row.created_at.slice(0, 16).replace('T', ' '),
    actor: row.actor_name ?? row.actor_id ?? 'system',
    action: row.action,
    target: [row.target_table, row.target_id?.slice(0, 8)].filter(Boolean).join(' / ') || '-',
    reason:
      (row.metadata?.note as string) ??
      (row.metadata?.reason as string) ??
      JSON.stringify(row.metadata ?? {}),
  }));
}

export async function fetchAdminReportKpi(): Promise<AdminReportKpi> {
  if (!live()) {
    await delay();
    const bedsTotal = mockState.rooms.reduce((sum, room) => sum + room.capacity, 0);
    const bedsOccupied = mockState.rooms.reduce((sum, room) => sum + room.occupied, 0);
    const unpaidInvoices = mockState.invoices.filter((invoice) => invoice.status !== 'paid');
    return {
      occupancy: {
        bedsTotal,
        bedsOccupied,
        occupancyRate: bedsTotal ? Number(((bedsOccupied / bedsTotal) * 100).toFixed(1)) : 0,
        roomsTotal: mockState.rooms.length,
        roomsFull: mockState.rooms.filter((room) => room.status === 'full').length,
      },
      applications: {
        total: mockState.applications.length,
        pending: mockState.applications.filter((item) =>
          ['pending', 'reviewing', 'needs-update'].includes(item.status),
        ).length,
        approved: mockState.applications.filter((item) =>
          ['approved', 'suggested', 'waiting-checkin'].includes(item.status),
        ).length,
        checkedIn: mockState.applications.filter((item) => item.status === 'checked-in').length,
        rejected: mockState.applications.filter((item) => item.status === 'rejected').length,
      },
      maintenance: {
        open: mockState.tickets.filter((ticket) => !['closed'].includes(ticket.status)).length,
        overdue: mockState.tickets.filter((ticket) => ticket.overdue).length,
      },
      billing: {
        unpaidInvoices: unpaidInvoices.length,
        outstandingBalance: unpaidInvoices.reduce(
          (sum, invoice) => sum + parseMockMoney(invoice.amount),
          0,
        ),
      },
    };
  }
  return mapReportKpi(await http('/api/reports/kpi'));
}

export async function fetchAdminBillingReport(): Promise<AdminBillingReport> {
  if (!live()) {
    return billingReportFromInvoices(await fetchInvoices());
  }
  try {
    return mapBillingReport(await http('/api/reports/billing'));
  } catch {
    return billingReportFromInvoices(await fetchInvoices());
  }
}

export async function fetchAdminMaintenanceReport(): Promise<AdminMaintenanceReport> {
  if (!live()) {
    await delay();
    const openTickets = mockState.tickets.filter((ticket) => !['closed'].includes(ticket.status));
    const byCategory = Object.values(
      mockState.tickets.reduce<Record<string, { category: string; count: number }>>(
        (current, ticket) => {
          const category = ticket.asset ?? 'Khác';
          current[category] ??= { category, count: 0 };
          current[category].count += 1;
          return current;
        },
        {},
      ),
    );
    const byStatus = Object.values(
      mockState.tickets.reduce<Record<string, { status: string; count: number }>>(
        (current, ticket) => {
          current[ticket.status] ??= { status: ticket.status, count: 0 };
          current[ticket.status].count += 1;
          return current;
        },
        {},
      ),
    );
    return {
      sla: {
        open: openTickets.length,
        overdue: mockState.tickets.filter((ticket) => ticket.overdue).length,
        avgResolutionMinutes: 680,
      },
      byCategory,
      byStatus,
    };
  }
  return mapMaintenanceReport(await http('/api/reports/maintenance'));
}

// ---------- notifications ----------

export async function fetchNotifications(): Promise<StudentNotification[]> {
  if (!live()) {
    await delay();
    return [...mockState.notifications];
  }
  const rows = await http<
    {
      id: string;
      title: string;
      body: string;
      type: string;
      sent_at?: string;
      read_at?: string | null;
    }[]
  >('/api/notifications?pageSize=50');
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    detail: row.body,
    at: row.sent_at?.slice(0, 16).replace('T', ' ') ?? '-',
    read: Boolean(row.read_at),
    kind: (['application', 'room', 'ticket', 'fee', 'broadcast'].includes(row.type)
      ? row.type
      : 'broadcast') as StudentNotification['kind'],
  }));
}

export async function markAllNotificationsRead(): Promise<void> {
  if (!live()) {
    await delay(100);
    mockState.notifications = mockState.notifications.map((item) => ({ ...item, read: true }));
    return;
  }
  await http('/api/notifications/read-all', { method: 'POST' });
}

// ---------- staff tasks ----------

export async function fetchStaffTasks(): Promise<StaffTask[]> {
  const rows = await http<
    {
      id: string;
      task_code: string;
      title: string;
      description?: string | null;
      status: StaffTask['status'];
      priority: StaffTask['priority'];
      assigned_name?: string | null;
      due_at?: string | null;
    }[]
  >('/api/tasks?pageSize=100');
  return rows.map((row) => ({
    backendId: row.id,
    code: row.task_code,
    title: row.title,
    description: row.description ?? '',
    status: row.status,
    priority: row.priority,
    assignee: row.assigned_name ?? undefined,
    dueAt: row.due_at?.slice(0, 16).replace('T', ' '),
  }));
}

export async function setTaskStatus(task: StaffTask, status: StaffTask['status']): Promise<void> {
  await http(`/api/tasks/${task.backendId}`, {
    method: 'PATCH',
    body: { status },
  });
}

// ---------- admin live ops ----------

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const [staff, audit] = await Promise.all([fetchStaffDashboard(), fetchAuditLogs()]);
  const occupancy =
    staff.bedsTotal > 0 ? Math.round((staff.bedsOccupied / staff.bedsTotal) * 100) : 0;
  return {
    occupancy,
    availableBeds: Math.max(staff.bedsTotal - staff.bedsOccupied, 0),
    pendingApplications: staff.pendingApplications,
    overdueTickets: staff.urgentTickets,
    slaCompliance:
      staff.openTickets > 0
        ? Math.max(
            0,
            Math.round(((staff.openTickets - staff.urgentTickets) / staff.openTickets) * 100),
          )
        : 100,
    auditCount: audit.length,
  };
}

export async function setRoomMaintenance(
  room: Room,
  hold: boolean,
  reason?: string,
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.rooms.find((item) => item.id === room.id);
    if (row) row.status = hold ? 'maintenance-hold' : 'available';
    pushMockAudit(
      hold ? 'room.maintenance_hold' : 'room.maintenance_release',
      room.id,
      reason ?? '-',
    );
    return;
  }
  await http(`/api/rooms/${room.backendId ?? room.id}`, {
    method: 'PATCH',
    body: { status: hold ? 'maintenance' : 'available', note: reason },
  });
}

export async function createRoom(input: UpsertRoomInput): Promise<void> {
  if (!live()) {
    await delay();
    const building = findMockBuilding(input.buildingId);
    const buildingName =
      building?.name ??
      (input.roomCode.split('-')[0] ? `Tòa ${input.roomCode.split('-')[0]}` : 'Tòa mới');
    const room: Room = {
      buildingId: input.buildingId,
      id: input.roomCode,
      building: buildingName,
      floor: input.floor,
      capacity: input.capacity,
      occupied: 0,
      gender: input.gender === 'female' ? 'Nữ' : 'Nam',
      status:
        input.status === 'maintenance' || input.status === 'locked'
          ? 'maintenance-hold'
          : 'available',
      beds: Array.from({ length: input.capacity }, (_, index) => ({
        id: `${input.roomCode}-B${index + 1}`,
        status: 'available' as const,
      })),
    };
    mockState.rooms.push(room);
    pushMockAudit('room.create', input.roomCode, input.note ?? 'Tạo phòng mới');
    return;
  }
  await http('/api/rooms', {
    method: 'POST',
    body: {
      building_id: input.buildingId,
      floor_no: input.floor,
      room_no: input.roomNo,
      room_code: input.roomCode,
      room_type: `${input.capacity} giường`,
      capacity: input.capacity,
      monthly_price: input.monthlyPrice,
      gender_policy: input.gender,
      status: input.status,
      note: input.note,
    },
  });
}

export async function updateRoomDetails(
  room: Room,
  input: Partial<UpsertRoomInput> & { reason: string },
): Promise<void> {
  if (!live()) {
    await delay();
    const row = mockState.rooms.find((item) => item.id === room.id);
    if (row) {
      const nextId = input.roomCode?.trim() || row.id;
      const building = input.buildingId ? findMockBuilding(input.buildingId) : undefined;
      row.buildingId = input.buildingId ?? row.buildingId;
      row.building = building?.name ?? row.building;
      row.id = nextId;
      row.floor = input.floor ?? row.floor;
      row.capacity = input.capacity ?? row.capacity;
      row.gender = input.gender === 'female' ? 'Nữ' : input.gender === 'male' ? 'Nam' : row.gender;
      row.status =
        input.status === 'maintenance' || input.status === 'locked'
          ? 'maintenance-hold'
          : input.status === 'available'
            ? 'available'
            : row.status;
      row.beds = Array.from({ length: row.capacity }, (_, index) => {
        const existing = row.beds[index];
        return existing
          ? { ...existing, id: `${row.id}-B${index + 1}` }
          : { id: `${row.id}-B${index + 1}`, status: 'available' as const };
      });
    }
    pushMockAudit('room.update', room.id, input.reason);
    return;
  }
  if (!room.backendId) throw new Error('Thiếu mã phòng backend');
  await http(`/api/rooms/${room.backendId}`, {
    method: 'PATCH',
    body: {
      floor_no: input.floor,
      room_no: input.roomNo ?? roomNoFromCode(input.roomCode ?? room.id),
      room_code: input.roomCode,
      capacity: input.capacity,
      gender_policy: input.gender ?? toBackendGender(room.gender),
      status: input.status ?? toBackendRoomStatus(room.status),
      note: input.reason,
    },
  });
}

export async function fetchRoomAssets(room: Room): Promise<RoomAsset[]> {
  if (!live()) {
    await delay(100);
    return [
      { assetCode: `${room.id}-FAN-01`, name: 'Quạt trần', category: 'electric', status: 'ok' },
      { assetCode: `${room.id}-DESK-01`, name: 'Bàn học', category: 'furniture', status: 'ok' },
    ];
  }
  if (!room.backendId) return [];
  const rows = await http<
    {
      id: string;
      asset_code: string;
      name: string;
      category: string;
      status: RoomAsset['status'];
    }[]
  >(`/api/rooms/${room.backendId}/assets`);
  return rows.map((row) => ({
    backendId: row.id,
    assetCode: row.asset_code,
    name: row.name,
    category: row.category,
    status: row.status,
  }));
}

export async function fetchRoomAssetsByRoomId(roomId?: string | null): Promise<RoomAsset[]> {
  if (!roomId) return [];
  if (!live()) {
    await delay(100);
    return [
      {
        assetCode: `${currentStudent.room}-FAN-01`,
        name: 'Quạt trần',
        category: 'electric',
        status: 'ok',
      },
      {
        assetCode: `${currentStudent.room}-DESK-01`,
        name: 'Bàn học',
        category: 'furniture',
        status: 'ok',
      },
      {
        assetCode: `${currentStudent.room}-LOCK-01`,
        name: 'Khóa cửa',
        category: 'security',
        status: 'ok',
      },
    ];
  }
  const rows = await http<
    {
      id: string;
      asset_code: string;
      name: string;
      category: string;
      status: RoomAsset['status'];
    }[]
  >(`/api/rooms/${roomId}/assets`);
  return rows.map((row) => ({
    backendId: row.id,
    assetCode: row.asset_code,
    name: row.name,
    category: row.category,
    status: row.status,
  }));
}
