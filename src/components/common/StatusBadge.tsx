import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneClass: Record<Tone, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-800',
  neutral: 'bg-slate-100 text-slate-700',
};

const statusMap: Record<string, { label: string; tone: Tone }> = {
  draft: { label: 'Nháp', tone: 'neutral' },
  submitted: { label: 'Đã gửi', tone: 'info' },
  pending: { label: 'Chờ duyệt', tone: 'warning' },
  reviewing: { label: 'Đang xem xét', tone: 'info' },
  approved: { label: 'Đã duyệt', tone: 'success' },
  rejected: { label: 'Từ chối', tone: 'danger' },
  'needs-update': { label: 'Cần bổ sung', tone: 'warning' },
  suggested: { label: 'Đã gợi ý phòng', tone: 'info' },
  'waiting-checkin': { label: 'Chờ check-in', tone: 'info' },
  cancelled: { label: 'Đã hủy', tone: 'neutral' },
  completed: { label: 'Hoàn tất', tone: 'success' },

  new: { label: 'Mới', tone: 'info' },
  assigned: { label: 'Đã gán', tone: 'info' },
  'in-progress': { label: 'Đang xử lý', tone: 'warning' },
  resolved: { label: 'Đã xử lý', tone: 'success' },
  reopened: { label: 'Mở lại', tone: 'danger' },
  closed: { label: 'Đã đóng', tone: 'neutral' },
  overdue: { label: 'Quá hạn', tone: 'danger' },
  open: { label: 'Mở', tone: 'info' },
  in_progress: { label: 'Đang xử lý', tone: 'warning' },
  done: { label: 'Hoàn tất', tone: 'success' },
  ignored: { label: 'Bỏ qua', tone: 'neutral' },

  available: { label: 'Còn chỗ', tone: 'success' },
  full: { label: 'Đầy', tone: 'neutral' },
  occupied: { label: 'Đang ở', tone: 'neutral' },
  reserved: { label: 'Đã giữ chỗ', tone: 'info' },
  'maintenance-hold': { label: 'Khóa bảo trì', tone: 'warning' },

  urgent: { label: 'Khẩn cấp', tone: 'danger' },
  high: { label: 'Cao', tone: 'warning' },
  normal: { label: 'Bình thường', tone: 'info' },
  low: { label: 'Thấp', tone: 'neutral' },

  'checked-in': { label: 'Đã check-in', tone: 'success' },
  'pending-checkin': { label: 'Chờ check-in', tone: 'warning' },
  'pending-checkout': { label: 'Chờ trả phòng', tone: 'warning' },
  'checked-out': { label: 'Đã check-out', tone: 'neutral' },

  unpaid: { label: 'Chưa thanh toán', tone: 'warning' },
  paid: { label: 'Đã thanh toán', tone: 'success' },
  partial: { label: 'Thanh toán một phần', tone: 'info' },
  active: { label: 'Hoạt động', tone: 'success' },
  locked: { label: 'Đã khóa', tone: 'danger' },
  invited: { label: 'Đã mời', tone: 'info' },
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const entry = statusMap[status] ?? { label: status, tone: 'neutral' as Tone };
  return (
    <Badge variant="secondary" className={cn(toneClass[entry.tone], className)}>
      {entry.label}
    </Badge>
  );
}
