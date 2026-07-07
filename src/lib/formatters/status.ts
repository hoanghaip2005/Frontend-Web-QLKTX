export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type StatusMeta = {
  label: string;
  tone: StatusTone;
};

export const statusMeta: Record<string, StatusMeta> = {
  draft: { label: 'Nháp', tone: 'neutral' },
  submitted: { label: 'Đã gửi', tone: 'info' },
  pending: { label: 'Chờ duyệt', tone: 'warning' },
  reviewing: { label: 'Đang xem xét', tone: 'info' },
  verifying: { label: 'Đang xác minh', tone: 'info' },
  in_review: { label: 'Đang xem xét', tone: 'info' },
  approved: { label: 'Đã duyệt', tone: 'success' },
  rejected: { label: 'Từ chối', tone: 'danger' },
  'needs-update': { label: 'Cần bổ sung', tone: 'warning' },
  need_more_info: { label: 'Cần bổ sung', tone: 'warning' },
  suggested: { label: 'Đã gợi ý phòng', tone: 'info' },
  'waiting-checkin': { label: 'Chờ check-in', tone: 'info' },
  waiting_checkin: { label: 'Chờ check-in', tone: 'info' },
  cancelled: { label: 'Đã hủy', tone: 'neutral' },
  completed: { label: 'Hoàn tất', tone: 'success' },

  new: { label: 'Mới', tone: 'info' },
  created: { label: 'Đã tạo', tone: 'info' },
  assigned: { label: 'Đã phân công', tone: 'info' },
  'in-progress': { label: 'Đang xử lý', tone: 'warning' },
  in_progress: { label: 'Đang xử lý', tone: 'warning' },
  waiting_student_confirm: { label: 'Chờ sinh viên xác nhận', tone: 'success' },
  student_confirmed: { label: 'Sinh viên đã xác nhận', tone: 'success' },
  resolved: { label: 'Chờ xác nhận kết quả', tone: 'success' },
  reopened: { label: 'Mở lại', tone: 'danger' },
  closed: { label: 'Đã đóng', tone: 'neutral' },
  overdue: { label: 'Quá hạn', tone: 'danger' },
  open: { label: 'Mở', tone: 'info' },
  done: { label: 'Hoàn tất', tone: 'success' },
  ignored: { label: 'Bỏ qua', tone: 'neutral' },

  available: { label: 'Còn chỗ', tone: 'success' },
  full: { label: 'Đầy', tone: 'neutral' },
  occupied: { label: 'Đang ở', tone: 'neutral' },
  reserved: { label: 'Đã giữ chỗ', tone: 'info' },
  'maintenance-hold': { label: 'Khóa bảo trì', tone: 'warning' },
  maintenance: { label: 'Bảo trì', tone: 'warning' },
  locked: { label: 'Đã khóa', tone: 'danger' },

  urgent: { label: 'Khẩn cấp', tone: 'danger' },
  high: { label: 'Cao', tone: 'warning' },
  normal: { label: 'Bình thường', tone: 'info' },
  low: { label: 'Thấp', tone: 'neutral' },

  'checked-in': { label: 'Đã check-in', tone: 'success' },
  checked_in: { label: 'Đã check-in', tone: 'success' },
  'pending-checkin': { label: 'Chờ check-in', tone: 'warning' },
  pending_checkin: { label: 'Chờ check-in', tone: 'warning' },
  'pending-checkout': { label: 'Chờ trả phòng', tone: 'warning' },
  pending_checkout: { label: 'Chờ trả phòng', tone: 'warning' },
  'checked-out': { label: 'Đã check-out', tone: 'neutral' },
  checked_out: { label: 'Đã check-out', tone: 'neutral' },

  unpaid: { label: 'Chưa thanh toán', tone: 'warning' },
  paid: { label: 'Đã thanh toán', tone: 'success' },
  partial: { label: 'Thanh toán một phần', tone: 'info' },
  pending_reconciliation: { label: 'Chờ đối soát', tone: 'warning' },
  verified: { label: 'Đã xác thực', tone: 'success' },
  failed: { label: 'Thất bại', tone: 'danger' },
  success: { label: 'Thành công', tone: 'success' },

  active: { label: 'Hoạt động', tone: 'success' },
  invited: { label: 'Đã mời', tone: 'info' },
  error: { label: 'Có lỗi', tone: 'danger' },
};

const rawStatusPattern =
  /\b(created|new|assigned|in_progress|in-progress|waiting_student_confirm|student_confirmed|resolved|completed|closed|reopened|cancelled|submitted|pending|reviewing|verifying|approved|rejected|need_more_info|waiting_checkin|checked_in|pending_reconciliation|verified|failed|success)\b/g;

function humanizeStatus(status: string) {
  return status.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getStatusMeta(status: string): StatusMeta {
  return statusMeta[status] ?? { label: humanizeStatus(status), tone: 'neutral' };
}

export function formatStatusLabel(status: string) {
  return getStatusMeta(status).label;
}

export function formatTimelineEvent(event: string) {
  return event.replace(rawStatusPattern, (status) => formatStatusLabel(status));
}
