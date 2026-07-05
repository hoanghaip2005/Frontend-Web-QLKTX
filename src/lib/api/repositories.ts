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
  systemUsers,
  tickets,
} from '@/mocks/data/dormData';
import type {
  AllocationRule,
  Application,
  AssignmentSuggestion,
  AuditEntry,
  Invoice as MockInvoice,
  Room,
  StudentNotification,
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

// Mutable mock stores (deep-copied so page reloads reset state).
const mockState = {
  applications: structuredClone(applications) as Application[],
  tickets: structuredClone(tickets) as Ticket[],
  invoices: structuredClone(invoices) as MockInvoice[],
  rooms: structuredClone(rooms) as Room[],
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

function formatCurrency(value: string | number | null | undefined) {
  return currencyFormatter.format(Number(value ?? 0));
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

function pushMockAudit(action: string, target: string, reason: string) {
  mockState.audit.unshift({
    at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    actor: 'mock.user',
    action,
    target,
    reason,
  });
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
  return {
    roomLabel: data.room?.room_code ?? null,
    bedLabel: data.room?.bed_code ?? null,
    application: data.application ? mapApplication(data.application) : null,
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
      preference: input.lifestyleNeeds.join(', '),
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
    }
    pushMockAudit(`application.review.${decision}`, application.id, reason);
    return;
  }
  await http(`/api/applications/${application.backendId}/review`, {
    method: 'POST',
    body: {
      status: reviewStatusForDecision[decision],
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
  override?: { bed: string; reason: string },
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
      assigned_room_id: suggestion.roomId,
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
    return;
  }
  await http(`/api/applications/${application.backendId}/confirm`, { method: 'POST' });
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

export async function fetchCurrentRoom(): Promise<{
  roomCode: string | null;
  bedCode: string | null;
  roommates: { name: string; bed: string; cohort?: string }[];
}> {
  if (!live()) {
    await delay();
    const myRoom = mockState.rooms.find((room) => room.id === currentStudent.room);
    return {
      roomCode: currentStudent.room,
      bedCode: currentStudent.bed,
      roommates:
        myRoom?.beds
          .filter((bed) => bed.occupant && bed.id !== currentStudent.bed)
          .map((bed) => ({ name: bed.occupant ?? '', bed: bed.id })) ?? [],
    };
  }
  const [current, roommates] = await Promise.all([
    http<{ room_code: string; bed_code: string } | null>('/api/student-rooms/current'),
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
      roomCode,
      bedCode: assignedBed ?? null,
      roommates: [],
    };
  }
  return {
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
}): Promise<Ticket> {
  if (!live()) {
    await delay();
    const created: Ticket = {
      id: `MT-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      title: input.title,
      room: currentStudent.room,
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
      category: 'other',
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

// ---------- admin ----------

export async function fetchSystemUsers(): Promise<SystemUser[]> {
  if (!live()) {
    await delay();
    return [...mockState.users];
  }
  const rows = await http<
    { id: string; email?: string; full_name: string; role: string; status: string; updated_at?: string }[]
  >('/api/profiles?pageSize=50');
  return rows.map((row) => ({
    backendId: row.id,
    email: row.email ?? row.id,
    name: row.full_name,
    role: (['student', 'staff', 'admin'].includes(row.role) ? row.role : 'staff') as SystemUser['role'],
    status: row.status === 'active' ? 'active' : 'locked',
    lastActive: row.updated_at?.slice(0, 16).replace('T', ' ') ?? '-',
  }));
}

export async function setUserLocked(user: SystemUser, locked: boolean, reason: string): Promise<void> {
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
    body: { is_enabled: enabled },
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

// ---------- notifications ----------

export async function fetchNotifications(): Promise<StudentNotification[]> {
  if (!live()) {
    await delay();
    return [...mockState.notifications];
  }
  const rows = await http<
    { id: string; title: string; body: string; type: string; sent_at?: string; read_at?: string | null }[]
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
