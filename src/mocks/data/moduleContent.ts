type Metric = {
  label: string;
  value: string;
  hint: string;
};

type ModuleRecord = {
  name: string;
  status: 'Ready' | 'UI draft';
  source: string;
};

type ModuleContent = {
  owner: string;
  title: string;
  description: string;
  actions: string[];
  metrics: Metric[];
  records: ModuleRecord[];
};

const defaultMetrics: Metric[] = [
  { label: 'Scope', value: 'UI', hint: 'Frontend-only, dùng mock data' },
  { label: 'Backend', value: '0', hint: 'Chưa gọi API/Supabase' },
  { label: 'Merge risk', value: 'Low', hint: 'Mỗi module có owner riêng' },
];

const records = (source: string): ModuleRecord[] => [
  { name: 'Layout chính', status: 'UI draft', source },
  { name: 'Empty/loading/error state', status: 'UI draft', source },
  { name: 'Responsive behavior', status: 'Ready', source: 'Frontend rule' },
];

export const moduleContent = {
  'auth-profile': {
    owner: 'Member 2',
    title: 'Profile',
    description: 'Màn hồ sơ dùng chung cho student, staff và admin. Giai đoạn này chỉ dựng UI profile, avatar, liên hệ và preference mock.',
    actions: ['Chỉnh sửa', 'Xem quyền'],
    metrics: defaultMetrics,
    records: records('profiles'),
  },
  'student-dashboard': {
    owner: 'Member 3',
    title: 'Student Dashboard',
    description: 'Trang chủ sinh viên với phòng hiện tại, hồ sơ mới nhất, ticket mở, hóa đơn chưa thanh toán và thông báo chưa đọc.',
    actions: ['Tạo yêu cầu', 'Xem phòng'],
    metrics: [
      { label: 'Room', value: 'A-304', hint: 'Mock current room' },
      { label: 'Tickets', value: '2', hint: 'Open maintenance tickets' },
      { label: 'Invoices', value: '1', hint: 'Unpaid statement' },
    ],
    records: records('v_student_current_room, invoices, notifications'),
  },
  'student-application': {
    owner: 'Member 3',
    title: 'Housing Application',
    description: 'Luồng đăng ký ở KTX, upload giấy tờ, theo dõi trạng thái duyệt và xác nhận gợi ý phòng.',
    actions: ['Tạo hồ sơ', 'Upload giấy tờ'],
    metrics: defaultMetrics,
    records: records('applications, semesters, dormcare-documents'),
  },
  'student-room': {
    owner: 'Member 3',
    title: 'Current Room',
    description: 'Thông tin phòng hiện tại, bạn cùng phòng, tài sản, QR/check-in info và trạng thái lưu trú.',
    actions: ['Xem tài sản', 'Yêu cầu đổi phòng'],
    metrics: defaultMetrics,
    records: records('student_rooms, rooms, buildings, room_assets'),
  },
  'student-tickets': {
    owner: 'Member 4',
    title: 'Maintenance Tickets',
    description: 'Sinh viên tạo ticket sửa chữa, upload ảnh minh chứng, theo dõi trạng thái, xác nhận hoặc mở lại ticket.',
    actions: ['Tạo ticket', 'Upload ảnh'],
    metrics: defaultMetrics,
    records: records('maintenance_tickets, room_assets, dormcare-ticket-photos'),
  },
  'student-invoices': {
    owner: 'Member 4',
    title: 'Invoices',
    description: 'Danh sách hóa đơn, chi tiết số dư, upload biên lai và trạng thái đối soát phí.',
    actions: ['Upload biên lai', 'Xem chi tiết'],
    metrics: defaultMetrics,
    records: records('invoices, v_invoice_balance, dormcare-receipts'),
  },
  'student-requests': {
    owner: 'Member 4',
    title: 'Student Requests',
    description: 'Các yêu cầu đổi phòng, gia hạn, checkout, tạm trú, phản ánh và về muộn.',
    actions: ['Tạo yêu cầu', 'Lọc trạng thái'],
    metrics: defaultMetrics,
    records: records('student_requests, student_rooms, rooms, semesters'),
  },
  'student-notifications': {
    owner: 'Member 4',
    title: 'Notifications',
    description: 'Inbox thông báo cá nhân và broadcast, trạng thái đã đọc/chưa đọc.',
    actions: ['Đánh dấu đã đọc', 'Lọc thông báo'],
    metrics: defaultMetrics,
    records: records('notifications'),
  },
  'staff-dashboard': {
    owner: 'Member 5',
    title: 'Staff Dashboard',
    description: 'Tổng quan vận hành: pending applications, SLA risk, ticket urgent, ca trực và task queue.',
    actions: ['Xem SLA', 'Nhận ca'],
    metrics: defaultMetrics,
    records: records('staff_shifts, applications, maintenance_tickets, v_ticket_sla'),
  },
  'staff-applications': {
    owner: 'Member 5',
    title: 'Application Review',
    description: 'Staff kiểm tra hồ sơ, yêu cầu bổ sung, approve/reject và ghi chú duyệt.',
    actions: ['Duyệt hồ sơ', 'Yêu cầu bổ sung'],
    metrics: defaultMetrics,
    records: records('applications, profiles, semesters, dormcare-documents'),
  },
  'staff-allocation': {
    owner: 'Member 5',
    title: 'Room Allocation',
    description: 'Bảng sức chứa, gợi ý phòng/giường, lý do phân phòng và đọc allocation rules.',
    actions: ['Gợi ý phòng', 'Ghi override'],
    metrics: defaultMetrics,
    records: records('rooms, student_rooms, applications, allocation_rules'),
  },
  'staff-checkin-checkout': {
    owner: 'Member 5',
    title: 'Check-in / Check-out',
    description: 'Luồng quét QR, checklist tài sản, ảnh minh chứng và ghi nhận check-in/out.',
    actions: ['Check-in', 'Check-out'],
    metrics: defaultMetrics,
    records: records('student_rooms, room_assets, rooms'),
  },
  'staff-residents': {
    owner: 'Member 6',
    title: 'Resident Management',
    description: 'Tìm kiếm cư dân, room roster, snapshot hồ sơ và trạng thái lưu trú.',
    actions: ['Tìm cư dân', 'Xem roster'],
    metrics: defaultMetrics,
    records: records('profiles, student_rooms, v_student_current_room'),
  },
  'staff-maintenance': {
    owner: 'Member 6',
    title: 'Maintenance Ops',
    description: 'Gán ticket, cập nhật SLA/status, ghi chú hoàn thành và trạng thái xác nhận từ sinh viên.',
    actions: ['Gán ticket', 'Cập nhật SLA'],
    metrics: defaultMetrics,
    records: records('maintenance_tickets, room_assets, v_ticket_sla'),
  },
  'staff-billing': {
    owner: 'Member 6',
    title: 'Billing Reconciliation',
    description: 'Review biên lai, cập nhật payment status và đối soát số dư.',
    actions: ['Duyệt biên lai', 'Lọc nợ'],
    metrics: defaultMetrics,
    records: records('invoices, v_invoice_balance, dormcare-receipts'),
  },
  'staff-tasks': {
    owner: 'Member 6',
    title: 'Tasks & Shifts',
    description: 'Ca trực, task queue, risk alerts và report/export task.',
    actions: ['Nhận task', 'Xuất danh sách'],
    metrics: defaultMetrics,
    records: records('staff_shifts, tasks'),
  },
  'admin-dashboard': {
    owner: 'Member 7',
    title: 'Admin Dashboard',
    description: 'Global KPIs, occupancy, finance, ticket, audit và system health.',
    actions: ['Xem báo cáo', 'Kiểm tra audit'],
    metrics: defaultMetrics,
    records: records('summary repositories, views'),
  },
  'admin-users': {
    owner: 'Member 7',
    title: 'User RBAC',
    description: 'Danh sách user, role, trạng thái tài khoản và scope quản trị.',
    actions: ['Gán role', 'Khóa tài khoản'],
    metrics: defaultMetrics,
    records: records('profiles, auth admin API later'),
  },
  'admin-buildings-rooms': {
    owner: 'Member 7',
    title: 'Building & Room Management',
    description: 'Quản lý tòa, phòng, tài sản, trạng thái, giá và QR metadata.',
    actions: ['Thêm phòng', 'Khóa bảo trì'],
    metrics: defaultMetrics,
    records: records('buildings, rooms, room_assets, v_room_occupancy'),
  },
  'admin-allocation-rules': {
    owner: 'Member 7',
    title: 'Allocation Rules',
    description: 'Cấu hình rule bắt buộc, ưu tiên, constraint, trọng số và enable/disable.',
    actions: ['Tạo rule', 'Bật/tắt rule'],
    metrics: defaultMetrics,
    records: records('allocation_rules'),
  },
  'admin-reports-audit': {
    owner: 'Member 7',
    title: 'Reports & Audit',
    description: 'Báo cáo, export, audit log filtering và lịch sử thao tác nhạy cảm.',
    actions: ['Tạo report', 'Lọc audit'],
    metrics: defaultMetrics,
    records: records('audit_logs, tasks, report endpoints later'),
  },
  'admin-settings': {
    owner: 'Member 7',
    title: 'System Settings',
    description: 'Học kỳ, notification defaults, app config và các placeholder tích hợp sau này.',
    actions: ['Cập nhật học kỳ', 'Cấu hình thông báo'],
    metrics: defaultMetrics,
    records: records('semesters, notifications, config endpoint later'),
  },
} as const satisfies Record<string, ModuleContent>;
