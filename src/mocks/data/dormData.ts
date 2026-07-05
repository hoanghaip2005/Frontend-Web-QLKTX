// Canonical DormCare Hub mock data.
// Single source for cross-member sample entities per docs/handoff-flow-and-assignment.md.
// Mock-only phase: no API, no Supabase.

export type ApplicationStatus =
  | 'draft'
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'needs-update'
  | 'suggested'
  | 'waiting-checkin'
  | 'checked-in'
  | 'cancelled';

export type TicketStatus = 'new' | 'assigned' | 'in-progress' | 'resolved' | 'reopened' | 'closed';

export type TicketPriority = 'urgent' | 'high' | 'normal' | 'low';

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance-hold';

export type RoomStatus = 'available' | 'full' | 'maintenance-hold';

export const currentStudent = {
  id: 'SV2302700162',
  name: 'Phạm Hoàng Hải',
  gender: 'Nam',
  cohort: 'K2023',
  major: 'Công nghệ thông tin',
  email: 'hai.pham@student.edu.vn',
  phone: '0901 234 567',
  priority: 'Không',
  room: 'A-302',
  bed: 'A-302-B4',
} as const;

export type Application = {
  /** Backend UUID when data comes from the API; absent in pure mock rows. */
  backendId?: string;
  id: string;
  studentId: string;
  studentName: string;
  gender: 'Nam' | 'Nữ';
  cohort: string;
  major: string;
  priority: string;
  preference: string;
  evidence: string[];
  status: ApplicationStatus;
  submittedAt: string;
  note?: string;
  /** Bed code assigned by staff (e.g. A-302-B4), present from status 'suggested' onward. */
  assignedBed?: string;
};

export const applications: Application[] = [
  {
    id: 'APP-2026-001',
    studentId: 'SV2302700162',
    studentName: 'Phạm Hoàng Hải',
    gender: 'Nam',
    cohort: 'K2023',
    major: 'Công nghệ thông tin',
    priority: 'Không',
    preference: 'Tòa A, phòng yên tĩnh',
    evidence: ['CCCD_2mat.pdf', 'GiayXacNhanSV.pdf'],
    status: 'pending',
    submittedAt: '2026-06-28 09:12',
  },
  {
    id: 'APP-2026-002',
    studentId: 'SV2302700231',
    studentName: 'Trần Thị Mai',
    gender: 'Nữ',
    cohort: 'K2024',
    major: 'Kế toán',
    priority: 'Hộ nghèo',
    preference: 'Tòa B, gần thư viện',
    evidence: ['CCCD_2mat.pdf', 'SoHoNgheo.pdf'],
    status: 'pending',
    submittedAt: '2026-06-28 10:40',
  },
  {
    id: 'APP-2026-003',
    studentId: 'SV2302700305',
    studentName: 'Lê Văn Nam',
    gender: 'Nam',
    cohort: 'K2023',
    major: 'Cơ khí',
    priority: 'Không',
    preference: 'Tòa A, cùng phòng bạn cùng lớp',
    evidence: ['CCCD_2mat.pdf'],
    status: 'reviewing',
    submittedAt: '2026-06-27 15:02',
  },
  {
    id: 'APP-2026-004',
    studentId: 'SV2302700412',
    studentName: 'Nguyễn Thu Hà',
    gender: 'Nữ',
    cohort: 'K2025',
    major: 'Ngôn ngữ Anh',
    priority: 'Con thương binh',
    preference: 'Tòa B, tầng thấp',
    evidence: ['CCCD_2mat.pdf', 'GiayUuTien.pdf'],
    status: 'approved',
    submittedAt: '2026-06-25 08:20',
    note: 'Đã phân giường B-105-B2.',
  },
  {
    id: 'APP-2026-005',
    studentId: 'SV2302700518',
    studentName: 'Hoàng Minh Tuấn',
    gender: 'Nam',
    cohort: 'K2024',
    major: 'Điện tử viễn thông',
    priority: 'Không',
    preference: 'Tòa C',
    evidence: [],
    status: 'needs-update',
    submittedAt: '2026-06-26 11:55',
    note: 'Thiếu minh chứng CCCD, yêu cầu bổ sung.',
  },
  {
    id: 'APP-2026-006',
    studentId: 'SV2302700620',
    studentName: 'Vũ Quang Dũng',
    gender: 'Nam',
    cohort: 'K2022',
    major: 'Xây dựng',
    priority: 'Không',
    preference: 'Tòa A, tầng 3',
    evidence: ['CCCD_2mat.pdf'],
    status: 'rejected',
    submittedAt: '2026-06-24 14:31',
    note: 'Không còn chỉ tiêu nam Tòa A cho K2022; hướng dẫn đăng ký đợt bổ sung.',
  },
];

export type Bed = {
  id: string;
  status: BedStatus;
  occupant?: string;
};

export type Room = {
  id: string;
  building: string;
  floor: number;
  capacity: number;
  occupied: number;
  gender: 'Nam' | 'Nữ';
  status: RoomStatus;
  beds: Bed[];
};

export const rooms: Room[] = [
  {
    id: 'A-302',
    building: 'Tòa A',
    floor: 3,
    capacity: 4,
    occupied: 3,
    gender: 'Nam',
    status: 'available',
    beds: [
      { id: 'A-302-B1', status: 'occupied', occupant: 'Ngô Đức Anh' },
      { id: 'A-302-B2', status: 'occupied', occupant: 'Đặng Hữu Phước' },
      { id: 'A-302-B3', status: 'occupied', occupant: 'Bùi Nhật Long' },
      { id: 'A-302-B4', status: 'available' },
    ],
  },
  {
    id: 'A-303',
    building: 'Tòa A',
    floor: 3,
    capacity: 4,
    occupied: 4,
    gender: 'Nam',
    status: 'full',
    beds: [
      { id: 'A-303-B1', status: 'occupied', occupant: 'Trịnh Công Sơn' },
      { id: 'A-303-B2', status: 'occupied', occupant: 'Phan Văn Đức' },
      { id: 'A-303-B3', status: 'occupied', occupant: 'Lý Hoàng Nam' },
      { id: 'A-303-B4', status: 'occupied', occupant: 'Đỗ Duy Mạnh' },
    ],
  },
  {
    id: 'A-201',
    building: 'Tòa A',
    floor: 2,
    capacity: 4,
    occupied: 2,
    gender: 'Nam',
    status: 'available',
    beds: [
      { id: 'A-201-B1', status: 'occupied', occupant: 'Nguyễn Tiến Linh' },
      { id: 'A-201-B2', status: 'occupied', occupant: 'Hà Đức Chinh' },
      { id: 'A-201-B3', status: 'available' },
      { id: 'A-201-B4', status: 'reserved' },
    ],
  },
  {
    id: 'B-105',
    building: 'Tòa B',
    floor: 1,
    capacity: 6,
    occupied: 4,
    gender: 'Nữ',
    status: 'available',
    beds: [
      { id: 'B-105-B1', status: 'occupied', occupant: 'Trần Thị Thu' },
      { id: 'B-105-B2', status: 'reserved', occupant: 'Nguyễn Thu Hà' },
      { id: 'B-105-B3', status: 'occupied', occupant: 'Lê Ngọc Ánh' },
      { id: 'B-105-B4', status: 'occupied', occupant: 'Phạm Mỹ Duyên' },
      { id: 'B-105-B5', status: 'occupied', occupant: 'Đinh Khánh Linh' },
      { id: 'B-105-B6', status: 'available' },
    ],
  },
  {
    id: 'B-210',
    building: 'Tòa B',
    floor: 2,
    capacity: 6,
    occupied: 6,
    gender: 'Nữ',
    status: 'full',
    beds: [
      { id: 'B-210-B1', status: 'occupied', occupant: 'Võ Thị Hoa' },
      { id: 'B-210-B2', status: 'occupied', occupant: 'Ngô Thanh Thảo' },
      { id: 'B-210-B3', status: 'occupied', occupant: 'Trương Mỹ Linh' },
      { id: 'B-210-B4', status: 'occupied', occupant: 'Cao Thị Hằng' },
      { id: 'B-210-B5', status: 'occupied', occupant: 'Lưu Diệu Vân' },
      { id: 'B-210-B6', status: 'occupied', occupant: 'Mai Phương Anh' },
    ],
  },
  {
    id: 'C-101',
    building: 'Tòa C',
    floor: 1,
    capacity: 8,
    occupied: 0,
    gender: 'Nam',
    status: 'maintenance-hold',
    beds: [
      { id: 'C-101-B1', status: 'maintenance-hold' },
      { id: 'C-101-B2', status: 'maintenance-hold' },
      { id: 'C-101-B3', status: 'maintenance-hold' },
      { id: 'C-101-B4', status: 'maintenance-hold' },
      { id: 'C-101-B5', status: 'maintenance-hold' },
      { id: 'C-101-B6', status: 'maintenance-hold' },
      { id: 'C-101-B7', status: 'maintenance-hold' },
      { id: 'C-101-B8', status: 'maintenance-hold' },
    ],
  },
];

export type Ticket = {
  /** Backend UUID when data comes from the API; absent in pure mock rows. */
  backendId?: string;
  id: string;
  title: string;
  room: string;
  asset?: string;
  qr?: string;
  reporter: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee?: string;
  createdAt: string;
  dueAt: string;
  overdue: boolean;
  description: string;
  history: { at: string; event: string }[];
};

export const tickets: Ticket[] = [
  {
    id: 'MT-2026-011',
    title: 'Quạt trần không hoạt động',
    room: 'A-302',
    asset: 'Quạt trần',
    qr: 'QR-A302-FAN01',
    reporter: 'Phạm Hoàng Hải',
    priority: 'normal',
    status: 'assigned',
    assignee: 'Tổ điện - Anh Cường',
    createdAt: '2026-06-30 08:15',
    dueAt: '2026-07-02 08:15',
    overdue: false,
    description: 'Quạt trần phòng A-302 bật không quay, có tiếng kêu nhẹ khi bật công tắc.',
    history: [
      { at: '2026-06-30 08:15', event: 'Sinh viên tạo ticket qua QR-A302-FAN01' },
      { at: '2026-06-30 09:00', event: 'Staff phân loại: Điện - Ưu tiên Normal - SLA 48h' },
      { at: '2026-06-30 09:05', event: 'Gán Tổ điện - Anh Cường, hạn 2026-07-02 08:15' },
    ],
  },
  {
    id: 'MT-2026-012',
    title: 'Vòi nước rò rỉ khu vệ sinh',
    room: 'B-105',
    asset: 'Vòi nước WC',
    reporter: 'Trần Thị Thu',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Tổ nước - Anh Bình',
    createdAt: '2026-06-29 14:20',
    dueAt: '2026-06-30 14:20',
    overdue: true,
    description: 'Vòi nước chảy liên tục không khóa được, nước tràn ra sàn.',
    history: [
      { at: '2026-06-29 14:20', event: 'Sinh viên tạo ticket' },
      { at: '2026-06-29 15:00', event: 'Phân loại High - SLA 24h, gán Tổ nước' },
      { at: '2026-06-30 16:00', event: 'Quá hạn SLA, hệ thống đánh dấu Overdue' },
    ],
  },
  {
    id: 'MT-2026-013',
    title: 'Bóng đèn hành lang tầng 3 cháy',
    room: 'A-3F',
    asset: 'Đèn hành lang',
    reporter: 'Bùi Nhật Long',
    priority: 'low',
    status: 'resolved',
    assignee: 'Tổ điện - Anh Cường',
    createdAt: '2026-06-27 19:40',
    dueAt: '2026-06-30 19:40',
    overdue: false,
    description: 'Bóng đèn hành lang trước phòng A-301 - A-303 không sáng.',
    history: [
      { at: '2026-06-27 19:40', event: 'Sinh viên tạo ticket' },
      { at: '2026-06-28 08:30', event: 'Gán Tổ điện - SLA 72h' },
      { at: '2026-06-28 10:00', event: 'Đã thay bóng đèn, chờ sinh viên xác nhận' },
    ],
  },
  {
    id: 'MT-2026-014',
    title: 'Khóa cửa phòng khó mở',
    room: 'A-201',
    asset: 'Khóa cửa chính',
    reporter: 'Nguyễn Tiến Linh',
    priority: 'urgent',
    status: 'reopened',
    assignee: 'Tổ cơ khí - Anh Dũng',
    createdAt: '2026-06-26 07:10',
    dueAt: '2026-06-26 19:10',
    overdue: true,
    description: 'Khóa cửa bị kẹt, sinh viên phải nhờ bảo vệ mở hộ. Đã sửa 1 lần nhưng tái diễn.',
    history: [
      { at: '2026-06-26 07:10', event: 'Sinh viên tạo ticket - Urgent - SLA 12h' },
      { at: '2026-06-26 09:00', event: 'Tổ cơ khí xử lý, đánh dấu Resolved' },
      { at: '2026-06-28 21:15', event: 'Sinh viên mở lại: khóa kẹt trở lại sau 2 ngày' },
    ],
  },
  {
    id: 'MT-2026-015',
    title: 'Ổ cắm điện bàn học lỏng',
    room: 'B-210',
    asset: 'Ổ cắm điện',
    reporter: 'Võ Thị Hoa',
    priority: 'normal',
    status: 'new',
    createdAt: '2026-07-01 20:05',
    dueAt: '2026-07-03 20:05',
    overdue: false,
    description: 'Ổ cắm cạnh bàn học số 2 tiếp xúc kém, sạc laptop chập chờn.',
    history: [{ at: '2026-07-01 20:05', event: 'Sinh viên tạo ticket, chờ phân loại' }],
  },
];

export const dashboardKpis = {
  occupancy: 87,
  pendingApplications: 18,
  overdueTickets: 4,
  availableBeds: 26,
  slaCompliance: 82,
  checkinsToday: 6,
} as const;

export type AssignmentSuggestion = {
  applicationId: string;
  /** Backend UUIDs, only present in live mode. */
  backendApplicationId?: string;
  roomId?: string;
  suggestedBedCode?: string;
  studentName: string;
  suggestedBed: string;
  room: string;
  reasons: string[];
  rejectedOptions: { bed: string; reason: string }[];
};

export const assignmentSuggestions: AssignmentSuggestion[] = [
  {
    applicationId: 'APP-2026-001',
    studentName: 'Phạm Hoàng Hải',
    suggestedBed: 'A-302-B4',
    room: 'A-302',
    reasons: [
      'Đúng chính sách giới tính (phòng Nam)',
      'Phòng còn chỗ trống (3/4)',
      'Cùng khóa K2023 với 2/3 thành viên phòng',
      'Phòng không trong trạng thái bảo trì',
      'Khớp nguyện vọng: Tòa A, phòng yên tĩnh',
    ],
    rejectedOptions: [
      { bed: 'A-303-*', reason: 'Phòng đã đầy (4/4)' },
      { bed: 'C-101-*', reason: 'Phòng đang khóa bảo trì (maintenance hold)' },
      { bed: 'B-105-B6', reason: 'Sai chính sách giới tính (phòng Nữ)' },
    ],
  },
  {
    applicationId: 'APP-2026-002',
    studentName: 'Trần Thị Mai',
    suggestedBed: 'B-105-B6',
    room: 'B-105',
    reasons: [
      'Đúng chính sách giới tính (phòng Nữ)',
      'Diện ưu tiên hộ nghèo: xếp trước theo rule ưu tiên',
      'Phòng còn chỗ trống (4/6)',
      'Gần thư viện theo nguyện vọng',
    ],
    rejectedOptions: [{ bed: 'B-210-*', reason: 'Phòng đã đầy (6/6)' }],
  },
];

export type Resident = {
  studentId: string;
  name: string;
  room: string;
  bed: string;
  cohort: string;
  status: 'checked-in' | 'pending-checkin' | 'checked-out';
  since: string;
};

export const residents: Resident[] = [
  { studentId: 'SV2302700101', name: 'Ngô Đức Anh', room: 'A-302', bed: 'A-302-B1', cohort: 'K2023', status: 'checked-in', since: '2025-09-05' },
  { studentId: 'SV2302700102', name: 'Đặng Hữu Phước', room: 'A-302', bed: 'A-302-B2', cohort: 'K2023', status: 'checked-in', since: '2025-09-05' },
  { studentId: 'SV2302700103', name: 'Bùi Nhật Long', room: 'A-302', bed: 'A-302-B3', cohort: 'K2022', status: 'checked-in', since: '2025-09-06' },
  { studentId: 'SV2302700162', name: 'Phạm Hoàng Hải', room: 'A-302', bed: 'A-302-B4', cohort: 'K2023', status: 'pending-checkin', since: '2026-07-01' },
  { studentId: 'SV2302700412', name: 'Nguyễn Thu Hà', room: 'B-105', bed: 'B-105-B2', cohort: 'K2025', status: 'pending-checkin', since: '2026-07-01' },
  { studentId: 'SV2302700250', name: 'Trần Thị Thu', room: 'B-105', bed: 'B-105-B1', cohort: 'K2024', status: 'checked-in', since: '2025-09-04' },
  { studentId: 'SV2302700333', name: 'Lý Hoàng Nam', room: 'A-303', bed: 'A-303-B3', cohort: 'K2022', status: 'checked-out', since: '2026-06-20' },
];

export type AuditEntry = {
  at: string;
  actor: string;
  action: string;
  target: string;
  reason: string;
};

export const auditLog: AuditEntry[] = [
  { at: '2026-07-01 10:22', actor: 'staff.kyduyen', action: 'Override phân phòng', target: 'APP-2026-004 → B-105-B2', reason: 'Sinh viên diện ưu tiên xin ở cùng chị gái, đã xác minh.' },
  { at: '2026-07-01 09:48', actor: 'admin.hai', action: 'Cập nhật rule phân phòng', target: 'RULE-GENDER-01', reason: 'Chuẩn hóa mô tả rule giới tính theo quy chế mới.' },
  { at: '2026-06-30 16:03', actor: 'staff.kyduyen', action: 'Từ chối hồ sơ', target: 'APP-2026-006', reason: 'Hết chỉ tiêu nam Tòa A cho K2022.' },
  { at: '2026-06-30 14:30', actor: 'admin.hai', action: 'Khóa bảo trì phòng', target: 'C-101', reason: 'Sửa chữa hệ thống điện tổng tầng 1 Tòa C.' },
  { at: '2026-06-29 11:12', actor: 'admin.hai', action: 'Gán role Staff', target: 'user thanhtung@qlktx.local', reason: 'Nhân sự mới của Ban quản lý KTX, có quyết định điều động.' },
];

export type SystemUser = {
  /** Backend UUID when data comes from the API. */
  backendId?: string;
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin' | 'maintenance' | 'leadership';
  status: 'active' | 'locked' | 'invited';
  lastActive: string;
};

export const systemUsers: SystemUser[] = [
  { email: 'admin.hai@qlktx.local', name: 'Hoàng Hải', role: 'admin', status: 'active', lastActive: '2026-07-02 08:30' },
  { email: 'staff.kyduyen@qlktx.local', name: 'Kỳ Duyên', role: 'staff', status: 'active', lastActive: '2026-07-02 07:55' },
  { email: 'thanhtung@qlktx.local', name: 'Thanh Tùng', role: 'staff', status: 'invited', lastActive: '-' },
  { email: 'baotri.cuong@qlktx.local', name: 'Anh Cường (Tổ điện)', role: 'maintenance', status: 'active', lastActive: '2026-07-01 17:20' },
  { email: 'ctsv.lan@qlktx.local', name: 'Cô Lan (CTSV)', role: 'leadership', status: 'active', lastActive: '2026-06-30 09:10' },
  { email: 'hai.pham@student.edu.vn', name: 'Phạm Hoàng Hải', role: 'student', status: 'active', lastActive: '2026-07-02 08:00' },
  { email: 'cu.sinhvien@student.edu.vn', name: 'Tài khoản cũ K2019', role: 'student', status: 'locked', lastActive: '2025-08-01 10:00' },
];

export type AllocationRule = {
  /** Backend UUID when data comes from the API. */
  backendId?: string;
  id: string;
  name: string;
  type: 'Bắt buộc' | 'Ưu tiên';
  description: string;
  weight: number;
  enabled: boolean;
};

export const allocationRules: AllocationRule[] = [
  { id: 'RULE-GENDER-01', name: 'Đúng giới tính phòng', type: 'Bắt buộc', description: 'Sinh viên chỉ được xếp vào phòng đúng giới tính.', weight: 100, enabled: true },
  { id: 'RULE-CAP-01', name: 'Không vượt sức chứa', type: 'Bắt buộc', description: 'Không xếp vào phòng đã đủ số giường.', weight: 100, enabled: true },
  { id: 'RULE-MAINT-01', name: 'Loại phòng đang bảo trì', type: 'Bắt buộc', description: 'Phòng/giường ở trạng thái maintenance-hold không được gợi ý.', weight: 100, enabled: true },
  { id: 'RULE-PRIORITY-01', name: 'Ưu tiên chính sách', type: 'Ưu tiên', description: 'Hộ nghèo, con thương binh... được xếp trước.', weight: 80, enabled: true },
  { id: 'RULE-COHORT-01', name: 'Cùng khóa/ngành', type: 'Ưu tiên', description: 'Ưu tiên xếp cùng phòng với sinh viên cùng khóa hoặc cùng ngành.', weight: 50, enabled: true },
  { id: 'RULE-PREF-01', name: 'Khớp nguyện vọng tòa nhà', type: 'Ưu tiên', description: 'Ưu tiên tòa nhà sinh viên đăng ký trong nguyện vọng.', weight: 40, enabled: false },
];

export type StudentNotification = {
  id: string;
  title: string;
  detail: string;
  at: string;
  read: boolean;
  kind: 'application' | 'room' | 'ticket' | 'fee' | 'broadcast';
};

export const studentNotifications: StudentNotification[] = [
  { id: 'NTF-01', title: 'Hồ sơ APP-2026-001 đang chờ duyệt', detail: 'Ban quản lý sẽ phản hồi trong 3 ngày làm việc.', at: '2026-06-28 09:13', read: false, kind: 'application' },
  { id: 'NTF-02', title: 'Ticket MT-2026-011 đã được tiếp nhận', detail: 'Tổ điện xử lý trong SLA 48 giờ.', at: '2026-06-30 09:05', read: false, kind: 'ticket' },
  { id: 'NTF-03', title: 'Lịch cắt nước Tòa A', detail: 'Cắt nước bảo trì 22:00-24:00 ngày 03/07.', at: '2026-06-29 16:00', read: true, kind: 'broadcast' },
];

export type Invoice = {
  id: string;
  period: string;
  amount: string;
  due: string;
  status: 'unpaid' | 'paid' | 'reviewing';
};

export const invoices: Invoice[] = [
  { id: 'INV-2026-06', period: 'Tháng 06/2026', amount: '450.000đ', due: '2026-07-10', status: 'unpaid' },
  { id: 'INV-2026-05', period: 'Tháng 05/2026', amount: '432.000đ', due: '2026-06-10', status: 'paid' },
  { id: 'INV-2026-04', period: 'Tháng 04/2026', amount: '418.000đ', due: '2026-05-10', status: 'paid' },
];

export type StudentRequest = {
  id: string;
  type: string;
  detail: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};

export const studentRequests: StudentRequest[] = [
  { id: 'REQ-2026-021', type: 'Đăng ký về muộn', detail: 'Về muộn 22:30 ngày 05/07 do lịch thực tập.', createdAt: '2026-07-01 12:00', status: 'pending' },
  { id: 'REQ-2026-015', type: 'Gia hạn lưu trú', detail: 'Gia hạn hè 07-08/2026.', createdAt: '2026-06-20 09:30', status: 'approved' },
];
