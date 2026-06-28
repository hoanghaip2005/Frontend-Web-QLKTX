import { FigmaAdminPage } from '@/features/admin/_components/AdminShell';

const metrics = [
  {
    value: '8',
    label: 'Báo cáo sẵn sàng',
    hint: 'Đã lên lịch',
    accent: 'green',
  },
  {
    value: '430',
    label: 'Sự kiện audit',
    hint: '24h qua',
    accent: 'cyan',
  },
  {
    value: '2',
    label: 'Cần kiểm tra',
    hint: 'Cần rà soát',
    accent: 'danger',
  },
  {
    value: '11',
    label: 'Lượt xuất',
    hint: 'Tuần này',
    accent: 'primary',
  },
] as const;

const tableHeaders = [
  { label: 'Mục', className: 'w-[29%]' },
  { label: 'Loại', className: 'w-[16%]' },
  { label: 'Trạng thái', className: 'w-[17%]' },
  { label: 'Phụ trách', className: 'w-[17%]' },
  { label: 'Thao tác', className: 'w-[21%]' },
];

const tableRows = [
  ['Bổ sung tóm tắt', 'Báo cáo', { text: 'Sẵn sàng', tone: 'green' }, 'Quản trị', 'Tải xuống'],
  ['Vết thay đổi vai trò', 'Audit', { text: 'Rà soát', tone: 'amber' }, 'Quản trị', 'Mở'],
  ['Ngoại lệ thanh toán', 'Báo cáo', { text: 'Sẵn sàng', tone: 'green' }, 'Thanh toán', 'Xem'],
  ['Chênh lệch sức chứa', 'Audit', { text: 'Cần kiểm', tone: 'danger' }, 'Hệ thống', 'Rà soát'],
  ['SLA sửa chữa', 'Báo cáo', { text: 'Sẵn sàng', tone: 'green' }, 'Vận hành', 'Tải xuống'],
] as const;

const contextItems = [
  {
    title: 'Lọc',
    description: 'Mô-đun, người thao tác, ngày, mức độ.',
    tone: 'green',
  },
  {
    title: 'Điều tra',
    description: 'Mở chi tiết sự kiện và thay đổi.',
    tone: 'green',
  },
  {
    title: 'Xuất file',
    description: 'Tải báo cáo đã kiểm soát.',
    tone: 'amber',
  },
  {
    title: 'Lưu trữ',
    description: 'Lưu báo cáo theo học kỳ.',
    tone: 'amber',
  },
  {
    title: 'Bàn giao',
    description: 'Sự kiện gắn cờ liên kết người phụ trách.',
    tone: 'amber',
  },
] as const;

export function AdminReportsAuditPage() {
  return (
    <FigmaAdminPage
      title="Báo cáo & Audit"
      scope="Báo cáo Audit"
      primaryActionLabel="Chạy báo cáo"
      secondaryActionLabel="GĐ 2"
      metrics={metrics}
      searchPlaceholder="Tìm báo cáo"
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      contextTitle="Luồng audit"
      contextItems={contextItems}
      footerDescription="Màn Báo cáo/Audit gom lịch báo cáo, vết sự kiện, bộ lọc, mức độ và thao tác xuất file."
      footerChip="Audit"
    />
  );
}
