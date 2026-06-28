import { FigmaAdminPage } from '@/features/admin/_components/AdminShell';

const metrics = [
  {
    value: '1,482',
    label: 'Đang dùng người dùng',
    hint: 'Sinh viên + Nhân viên',
    accent: 'primary',
  },
  {
    value: '7',
    label: 'Vai trò',
    hint: 'Hồ sơ chuẩn',
    accent: 'cyan',
  },
  {
    value: '12',
    label: 'Chờ cấp quyền',
    hint: 'Cần duyệt',
    accent: 'amber',
  },
  {
    value: '3',
    label: 'Khóa',
    hint: 'Rà soát bảo mật',
    accent: 'danger',
  },
] as const;

const tableHeaders = [
  { label: 'Người dùng', className: 'w-[23%]' },
  { label: 'Vai trò', className: 'w-[16%]' },
  { label: 'Trạng thái', className: 'w-[17%]' },
  { label: 'Phạm vi', className: 'w-[19%]' },
  { label: 'Thao tác', className: 'w-[25%]' },
];

const tableRows = [
  ['Lan Nguyen', 'Nhân viên', { text: 'Đang dùng', tone: 'green' }, 'Tòa A', 'Sửa'],
  ['Minh Tran', 'Nhân viên', { text: 'Chờ', tone: 'amber' }, 'Sửa chữa', 'Duyệt'],
  ['Hoa Pham', 'Quản trị', { text: 'Đang dùng', tone: 'green' }, 'Tất cả dorms', 'Rà soát'],
  ['An Do', 'Thanh toán', { text: 'Khóa', tone: 'danger' }, 'Thanh toán', 'Mở khóa'],
  ['SV-2026-392', 'Sinh viên', { text: 'Đang dùng', tone: 'green' }, 'Cá nhân', 'Xem'],
] as const;

const contextItems = [
  {
    title: 'Yêu cầu quyền',
    description: 'Quản trị rà soát phạm vi yêu cầu.',
    tone: 'green',
  },
  {
    title: 'Quyền tối thiểu',
    description: 'Phạm vi giới hạn theo vai trò và tòa.',
    tone: 'green',
  },
  {
    title: 'Ghi chú duyệt',
    description: 'Bắt buộc lý do khi nâng quyền.',
    tone: 'amber',
  },
  {
    title: 'Rà soát khóa',
    description: 'Tài khoản khóa cần xác minh.',
    tone: 'amber',
  },
  {
    title: 'Vết audit',
    description: 'Mọi đổi vai trò đều được ghi nhật ký.',
    tone: 'amber',
  },
] as const;

export function AdminUsersPage() {
  return (
    <FigmaAdminPage
      title="Người dùng / RBAC"
      scope="Người dùng RBAC"
      primaryActionLabel="Cấp quyền"
      metrics={metrics}
      searchPlaceholder="Tìm kiếm Người dùng / RBAC"
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      contextTitle="Luồng truy cập"
      contextItems={contextItems}
      footerDescription="Màn RBAC có ma trận quyền, phạm vi truy cập, yêu cầu chờ, tài khoản khóa và lý do audit."
      footerChip="RBAC"
    />
  );
}
