// Backend DTO shapes (snake_case, DB enums) -> UI domain types (src/mocks/data/dormData).
// Keep every enum translation here so screens never see raw backend values.

import type {
  Application,
  ApplicationStatus,
  AssignmentSuggestion,
  Room,
  RoomStatus,
  Ticket,
  TicketPriority,
  TicketStatus,
} from '@/mocks/data/dormData';

// ---------- DTO types (subset of backend columns the UI consumes) ----------

export type ApplicationDto = {
  id: string;
  application_code: string;
  student_id: string;
  student_name?: string;
  student_code?: string;
  status: string;
  priority_note?: string | null;
  priority_score?: number;
  desired_building_code?: string | null;
  desired_room_type?: string | null;
  lifestyle_needs?: string[];
  documents?: { name?: string }[];
  submitted_at?: string | null;
  staff_note?: string | null;
  rejection_reason?: string | null;
  assigned_room_code?: string | null;
  assigned_bed_code?: string | null;
  assignment_reasons?: string[];
  override_reason?: string | null;
};

export type RoomDto = {
  id: string;
  room_code: string;
  building_code: string;
  building_name?: string;
  floor_no: number;
  capacity: number;
  occupied_beds: number;
  available_beds: number;
  gender_policy?: 'male' | 'female' | 'other' | null;
  status: 'available' | 'full' | 'maintenance' | 'locked';
  monthly_price?: string | number;
};

export type TicketDto = {
  id: string;
  ticket_code: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  category?: string;
  room_code?: string | null;
  asset_name?: string | null;
  reporter_name?: string | null;
  assigned_name?: string | null;
  assigned_to?: string | null;
  sla_due_at?: string | null;
  is_overdue?: boolean;
  created_at?: string;
  timeline?: { at?: string; event?: string; status?: string; note?: string | null }[];
};

export type SuggestionDto = {
  application_id: string;
  suggestions: {
    room_id: string;
    room_code: string;
    building_code: string;
    room_type: string;
    available_beds: number;
    suggested_bed_code: string;
    score: number;
    reasons: string[];
  }[];
};

// ---------- enum maps ----------

const applicationStatusMap: Record<string, ApplicationStatus> = {
  draft: 'draft',
  submitted: 'pending',
  verifying: 'reviewing',
  need_more_info: 'needs-update',
  approved: 'approved',
  rejected: 'rejected',
  suggested: 'suggested',
  waiting_checkin: 'waiting-checkin',
  checked_in: 'checked-in',
  cancelled: 'cancelled',
};

// UI keeps a compact ticket lifecycle: waiting_student_confirm renders as "resolved"
// (student sees confirm/reopen actions) and completed renders as "closed".
const ticketStatusMap: Record<string, TicketStatus> = {
  new: 'new',
  assigned: 'assigned',
  in_progress: 'in-progress',
  waiting_student_confirm: 'resolved',
  completed: 'closed',
  reopened: 'reopened',
  closed: 'closed',
  cancelled: 'closed',
};

const roomStatusMap: Record<string, RoomStatus> = {
  available: 'available',
  full: 'full',
  maintenance: 'maintenance-hold',
  locked: 'maintenance-hold',
};

export function toUiApplicationStatus(status: string): ApplicationStatus {
  return applicationStatusMap[status] ?? 'pending';
}

/** Reverse map for staff decisions: UI decision -> backend review status. */
export const reviewStatusForDecision = {
  approved: 'approved',
  rejected: 'rejected',
  'needs-update': 'need_more_info',
} as const;

// ---------- mappers ----------

export function mapApplication(dto: ApplicationDto): Application {
  return {
    backendId: dto.id,
    id: dto.application_code,
    studentId: dto.student_code ?? dto.student_id,
    studentName: dto.student_name ?? 'Sinh viên',
    gender: 'Nam',
    cohort: '',
    major: '',
    priority: dto.priority_note ?? 'Không',
    preference: [dto.desired_building_code ? `Tòa ${dto.desired_building_code}` : null, ...(dto.lifestyle_needs ?? [])]
      .filter(Boolean)
      .join(', '),
    evidence: (dto.documents ?? []).map((doc) => doc.name ?? 'tài liệu'),
    status: toUiApplicationStatus(dto.status),
    submittedAt: dto.submitted_at?.slice(0, 16).replace('T', ' ') ?? '-',
    note: dto.rejection_reason ?? dto.staff_note ?? undefined,
    assignedBed: dto.assigned_bed_code
      ? dto.assigned_room_code && !dto.assigned_bed_code.startsWith(dto.assigned_room_code)
        ? `${dto.assigned_room_code}-${dto.assigned_bed_code}`
        : dto.assigned_bed_code
      : undefined,
  };
}

export function mapRoom(dto: RoomDto): Room {
  const beds = Array.from({ length: dto.capacity }, (_, index) => {
    const bedNo = index + 1;
    const occupied = bedNo <= dto.occupied_beds;
    return {
      id: `${dto.room_code}-B${bedNo}`,
      status: occupied ? ('occupied' as const) : ('available' as const),
      occupant: occupied ? 'Đang ở' : undefined,
    };
  });
  return {
    backendId: dto.id,
    id: dto.room_code,
    building: dto.building_name ?? `Tòa ${dto.building_code}`,
    floor: dto.floor_no,
    capacity: dto.capacity,
    occupied: dto.occupied_beds,
    gender: dto.gender_policy === 'female' ? 'Nữ' : 'Nam',
    status: roomStatusMap[dto.status] ?? 'available',
    beds,
  };
}

export function mapTicket(dto: TicketDto): Ticket {
  return {
    backendId: dto.id,
    id: dto.ticket_code,
    title: dto.title,
    room: dto.room_code ?? '-',
    asset: dto.asset_name ?? undefined,
    reporter: dto.reporter_name ?? '-',
    priority: (dto.priority as TicketPriority) ?? 'normal',
    status: ticketStatusMap[dto.status] ?? 'new',
    assignee: dto.assigned_name ?? undefined,
    createdAt: dto.created_at?.slice(0, 16).replace('T', ' ') ?? '-',
    dueAt: dto.sla_due_at?.slice(0, 16).replace('T', ' ') ?? '-',
    overdue: Boolean(dto.is_overdue),
    description: dto.description ?? '',
    history: (dto.timeline ?? []).map((entry) => ({
      at: entry.at?.slice(0, 16).replace('T', ' ') ?? '-',
      event: entry.event === 'status_changed' ? `Chuyển trạng thái: ${entry.status ?? ''}${entry.note ? ` - ${entry.note}` : ''}` : (entry.note ?? entry.event ?? ''),
    })),
  };
}

export function mapSuggestion(dto: SuggestionDto, studentName: string): AssignmentSuggestion | null {
  const top = dto.suggestions[0];
  if (!top) return null;
  return {
    applicationId: dto.application_id,
    backendApplicationId: dto.application_id,
    roomId: top.room_id,
    suggestedBedCode: top.suggested_bed_code,
    studentName,
    suggestedBed: `${top.room_code}-${top.suggested_bed_code}`,
    room: top.room_code,
    reasons: top.reasons,
    rejectedOptions: dto.suggestions.slice(1).map((option) => ({
      bed: `${option.room_code}-${option.suggested_bed_code}`,
      reason: `Điểm thấp hơn (${option.score} so với ${top.score})`,
    })),
  };
}
