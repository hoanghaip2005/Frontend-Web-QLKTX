import { FigmaAdminPage } from '@/features/admin/_components/AdminShell';

const metrics = [
  {
    value: '12',
    label: 'Tòa nhà',
    hint: 'Tòa đang dùng',
    accent: 'primary',
  },
  {
    value: '412',
    label: 'Phòng ở',
    hint: 'Đã lập',
    accent: 'cyan',
  },
  {
    value: '1,480',
    label: 'Giường',
    hint: '1.248 đã ở',
    accent: 'green',
  },
  {
    value: '7',
    label: 'Phòng tạm ngưng',
    hint: 'Giữ sửa chữa',
    accent: 'danger',
  },
] as const;

const tableHeaders = [
  { label: 'Tòa', className: 'w-[20%]' },
  { label: 'Phòng ở', className: 'w-[15%]' },
  { label: 'Giường', className: 'w-[15%]' },
  { label: 'Trạng thái', className: 'w-[20%]' },
  { label: 'Thao tác', className: 'w-[30%]' },
];

const tableRows = [
  ['Tòa A', '96', '384', { text: 'Gần đầy', tone: 'cyan' }, 'Quản lý phòng'],
  ['Tòa B', '82', '328', { text: 'Trống', tone: 'green' }, 'Quản lý phòng'],
  ['Tòa C', '72', '288', { text: 'Theo dõi', tone: 'amber' }, 'Mở'],
  ['Tòa D', '64', '256', { text: 'Trống', tone: 'green' }, 'Quản lý phòng'],
  ['Tòa E', '18', '72', { text: 'Tạm ngưng', tone: 'danger' }, 'Rà soát giữ'],
] as const;

const contextItems = [
  {
    title: 'Phân cấp',
    description: 'Khu, tòa, tầng, phòng, giường.',
    tone: 'green',
  },
  {
    title: 'Phòng Trạng thái',
    description: 'Trống, đã ở, đang giữ, tạm ngưng.',
    tone: 'green',
  },
  {
    title: 'Liên kết tài sản',
    description: 'Phòng liên kết QR và tài sản.',
    tone: 'amber',
  },
  {
    title: 'Quy định sức chứa',
    description: 'Giới tính và ngành học.',
    tone: 'amber',
  },
  {
    title: 'Audit',
    description: 'Mọi đổi cấu trúc đều ghi nhật ký.',
    tone: 'amber',
  },
] as const;

export function AdminBuildingsRoomsPage() {
  return (
    <FigmaAdminPage
      title="Tòa phòng"
      scope="Tòa phòng"
      primaryActionLabel="Thêm phòng"
      secondaryActionLabel="Quản lý phòng"
      metrics={metrics}
      searchPlaceholder="Tìm tòa/phòng"
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      contextTitle="Mô hình sức chứa"
      contextItems={contextItems}
      footerDescription="Màn tòa/phòng quản lý phân cấp, sức chứa giường, trạng thái phòng và giữ sửa chữa cho kế hoạch phân phòng."
      footerChip="Phòng ở"
    />
  );
}
