import { FigmaAdminPage } from '@/features/admin/_components/AdminShell';

const metrics = [
  {
    value: '1,482',
    label: 'Người dùng',
    hint: 'TK đang dùng',
    accent: 'primary',
  },
  {
    value: '12',
    label: 'Tòa nhà',
    hint: '412 Phòng',
    accent: 'cyan',
  },
  {
    value: '4',
    label: 'Sửa quy định',
    hint: 'Tuần này',
    accent: 'amber',
  },
  {
    value: '2',
    label: 'Cảnh báo audit',
    hint: 'Cần rà soát',
    accent: 'danger',
  },
] as const;

const tableHeaders = [
  { label: 'Tín hiệu', className: 'w-[28%]' },
  { label: 'Phân hệ', className: 'w-[18%]' },
  { label: 'Trạng thái', className: 'w-[16%]' },
  { label: 'Mức độ', className: 'w-[18%]' },
  { label: 'Thao tác', className: 'w-[20%]' },
];

const tableRows = [
  ['Cấp quyền chờ duyệt', 'RBAC', { text: 'Rà soát', tone: 'amber' }, 'Trung bình', 'Mở'],
  ['Sức chứa tòa C', 'Phòng ở', { text: 'Theo dõi', tone: 'cyan' }, 'Thấp', 'Xem'],
  [
    'Quy định xếp phòng đã đổi',
    'Quy định',
    { text: 'Hoàn tất', tone: 'green' },
    'Thông tin',
    'Audit',
  ],
  ['Xuất báo cáo trễ', 'Báo cáo', { text: 'Mở', tone: 'cyan' }, 'Trung bình', 'Chạy'],
  ['Mẫu phí KTX', 'Cài đặt', { text: 'Nháp', tone: 'pink' }, 'Thấp', 'Sửa'],
] as const;

const contextItems = [
  {
    title: 'Truy cập',
    description: 'Chờ cấp quyền và khóa tài khoản.',
    tone: 'green',
  },
  {
    title: 'Sức chứa',
    description: 'Sức khỏe tòa/phòng.',
    tone: 'green',
  },
  {
    title: 'Quy định',
    description: 'Thay đổi quy định xếp phòng.',
    tone: 'amber',
  },
  {
    title: 'Audit',
    description: 'Hàng việc rà soát thao tác nhạy cảm.',
    tone: 'amber',
  },
  {
    title: 'Cài đặt',
    description: 'Kỳ và mẫu form đã sẵn sàng.',
    tone: 'amber',
  },
] as const;

export function AdminDashboardPage() {
  return (
    <FigmaAdminPage
      title="Quản trị / Tổng quan"
      scope="Tổng quan"
      primaryActionLabel="Rà soát cảnh báo"
      metrics={metrics}
      searchPlaceholder="Tìm kiếm tổng quan"
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      contextTitle="Sức khỏe quản trị"
      contextItems={contextItems}
      footerDescription="Tổng quan quản trị gồm quyền, sức chứa, quy định, audit và cài đặt theo rủi ro."
      footerChip="Quản trị"
    />
  );
}
