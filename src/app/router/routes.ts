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
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'User/RBAC', path: '/admin/users' },
    { label: 'Tòa/Phòng', path: '/admin/buildings-rooms' },
    { label: 'Luật phân phòng', path: '/admin/allocation-rules' },
    { label: 'Báo cáo/Audit', path: '/admin/reports-audit' },
    { label: 'Cài đặt', path: '/admin/settings' },
  ],
} satisfies Record<AppRole, NavItem[]>;
