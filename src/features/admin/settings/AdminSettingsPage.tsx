import { FigmaAdminPage } from '@/features/admin/_components/AdminShell';

const metrics = [
  {
    value: '2026',
    label: 'Học kỳ',
    hint: 'Đợt đang mở',
    accent: 'primary',
  },
  {
    value: '14',
    label: 'Mẫu biểu',
    hint: 'Thông báo',
    accent: 'cyan',
  },
  {
    value: '9',
    label: 'Danh mục',
    hint: 'Sửa chữa',
    accent: 'green',
  },
  {
    value: '3',
    label: 'Bản nháp',
    hint: 'Cần rà soát',
    accent: 'amber',
  },
] as const;

const tableHeaders = [
  { label: 'Thiết lập', className: 'w-[29%]' },
  { label: 'Nhóm', className: 'w-[16%]' },
  { label: 'Trạng thái', className: 'w-[17%]' },
  { label: 'Cập nhật', className: 'w-[17%]' },
  { label: 'Thao tác', className: 'w-[21%]' },
];

const tableRows = [
  ['Mốc học kỳ', 'Học kỳ', { text: 'Đang dùng', tone: 'green' }, '20 Jun', 'Sửa'],
  ['Mẫu phí KTX', 'Thanh toán', { text: 'Nháp', tone: 'pink' }, '18 Jun', 'Rà soát'],
  ['Danh mục sửa chữa', 'Vận hành', { text: 'Đang dùng', tone: 'green' }, '14 Jun', 'Sửa'],
  ['Mẫu thông báo', 'Truyền thông', { text: 'Rà soát', tone: 'amber' }, '12 Jun', 'Mở'],
  ['Thời hạn lưu dữ liệu', 'Quản trị', { text: 'Đang dùng', tone: 'green' }, '01 Jun', 'Xem'],
] as const;

const contextItems = [
  {
    title: 'Tạo bản nháp',
    description: 'Quản trị chỉnh trong trạng thái nháp.',
    tone: 'green',
  },
  {
    title: 'Rà soát',
    description: 'Thiết lập nhạy cảm cần duyệt.',
    tone: 'green',
  },
  {
    title: 'Kích hoạt',
    description: 'Áp dụng cho bản ghi sau này.',
    tone: 'amber',
  },
  {
    title: 'Xem trước mẫu',
    description: 'Kiểm tra mẫu thông báo và phí.',
    tone: 'amber',
  },
  {
    title: 'Lịch sử',
    description: 'Phiên bản trước vẫn xem được.',
    tone: 'amber',
  },
] as const;

export function AdminSettingsPage() {
  return (
    <FigmaAdminPage
      title="Cài đặt hệ thống"
      scope="Cài đặt"
      primaryActionLabel="Lưu cài đặt"
      metrics={metrics}
      searchPlaceholder="Tìm cài đặt"
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      contextTitle="Luồng cài đặt"
      contextItems={contextItems}
      footerDescription="Màn cài đặt giữ kỳ, mẫu form, danh mục, lưu trữ và rà soát thiết lập nhạy cảm."
      footerChip="Cài đặt"
    />
  );
}
