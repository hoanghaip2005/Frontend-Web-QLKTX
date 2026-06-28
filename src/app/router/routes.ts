import type { AppRole, NavItem } from '@/types/roles';

export const roleNavItems = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Đăng ký ở KTX', path: '/student/application' },
    { label: 'Phòng hiện tại', path: '/student/room' },
    { label: 'Báo sửa chữa', path: '/student/tickets' },
    { label: 'Hóa đơn', path: '/student/invoices' },
    { label: 'Yêu cầu sinh viên', path: '/student/requests' },
    { label: 'Thông báo', path: '/student/notifications' },
  ],
  staff: [
    { label: 'Dashboard', path: '/staff/dashboard' },
    { label: 'Duyệt hồ sơ', path: '/staff/applications' },
    { label: 'Phân phòng', path: '/staff/allocation' },
    { label: 'Check-in/out', path: '/staff/checkin-checkout' },
    { label: 'Cư dân', path: '/staff/residents' },
    { label: 'Sửa chữa', path: '/staff/maintenance' },
    { label: 'Đối soát phí', path: '/staff/billing' },
    { label: 'Ca trực/Nhiệm vụ', path: '/staff/tasks' },
  ],
  admin: [
    { label: 'Tổng quan', path: '/admin/dashboard' },
    { label: 'Người dùng', path: '/admin/users' },
    { label: 'Tòa phòng', path: '/admin/buildings-rooms' },
    { label: 'Báo cáo', path: '/admin/allocation-rules' },
    { label: 'Hồ sơ', path: '/admin/reports-audit' },
    { label: 'Cài đặt', path: '/admin/settings' },
  ],
} satisfies Record<AppRole, NavItem[]>;
