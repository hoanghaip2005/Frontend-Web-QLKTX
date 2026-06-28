import { FigmaAdminPage } from '@/features/admin/_components/AdminShell';

const metrics = [
  {
    value: '5',
    label: 'Bộ quy định',
    hint: 'Đang dùng',
    accent: 'primary',
  },
  {
    value: '21',
    label: 'Ngoại lệ',
    hint: 'Kỳ này',
    accent: 'amber',
  },
  {
    value: '73%',
    label: 'Tự động phân công',
    hint: 'Gợi ý phù hợp',
    accent: 'cyan',
  },
  {
    value: '4',
    label: 'Duyệt',
    hint: 'Chờ',
    accent: 'danger',
  },
] as const;

const tableHeaders = [
  { label: 'Quy định', className: 'w-[27%]' },
  { label: 'Phạm vi', className: 'w-[18%]' },
  { label: 'Trạng thái', className: 'w-[17%]' },
  { label: 'Tác động', className: 'w-[17%]' },
  { label: 'Thao tác', className: 'w-[21%]' },
];

const tableRows = [
  ['Tách giới tính', 'Tất cả tòa', { text: 'Đang dùng', tone: 'green' }, 'Cao', 'Xem'],
  ['Nhóm chương trình', 'Tòa A', { text: 'Đang dùng', tone: 'green' }, 'Trung bình', 'Sửa'],
  ['Ưu tiên tiếp cận', 'Tất cả Phòng', { text: 'Đang dùng', tone: 'green' }, 'Cao', 'Xem'],
  ['Ưu tiên học bổng', 'Đợt 2026', { text: 'Nháp', tone: 'pink' }, 'Trung bình', 'Rà soát'],
  ['Quy định tầng yên tĩnh', 'Tòa C', { text: 'Chờ', tone: 'amber' }, 'Thấp', 'Duyệt'],
] as const;

const contextItems = [
  {
    title: 'Nháp',
    description: 'Quản trị sửa quy định và phạm vi.',
    tone: 'green',
  },
  {
    title: 'Mô phỏng',
    description: 'Xem trước giường và hồ sơ bị ảnh hưởng.',
    tone: 'green',
  },
  {
    title: 'Phê duyệt',
    description: 'Đổi quy định cần lý do.',
    tone: 'amber',
  },
  {
    title: 'Kích hoạt',
    description: 'Bộ xếp phòng đọc bộ đang dùng.',
    tone: 'amber',
  },
  {
    title: 'Audit',
    description: 'Mọi thay đổi đều lưu chênh lệch.',
    tone: 'amber',
  },
] as const;

export function AdminAllocationRulesPage() {
  return (
    <FigmaAdminPage
      title="Quy định xếp phòng"
      scope="Quy định xếp phòng"
      primaryActionLabel="Tạo quy định"
      secondaryActionLabel="Sửa quy định"
      metrics={metrics}
      searchPlaceholder="Tìm quy định"
      tableHeaders={tableHeaders}
      tableRows={tableRows}
      contextTitle="Vòng đời quy định"
      contextItems={contextItems}
      footerDescription="Màn quy định xếp phòng hiển thị quy định đang dùng, thay đổi nháp, số ngoại lệ và tác động mô phỏng."
      footerChip="Quy định"
    />
  );
}
