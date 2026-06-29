import { DoorOpen, FileText, UserRoundCheck } from 'lucide-react';

import {
  StaffOpsScreen,
  StatusPill,
  type OpsTone,
  type StaffColumn,
} from '@/features/staff/maintenance/components/StaffOpsDesign';

type ResidentStatus = 'Đang dùng' | 'Transfer' | 'Watch' | 'Leaving';

type Resident = {
  id: string;
  name: string;
  room: string;
  status: ResidentStatus;
  contract: string;
  action: string;
  note: string;
  history: string[];
};

const residents: Resident[] = [
  {
    id: 'SV2302700162',
    name: 'Pham Hoang Hai',
    room: 'A-402 B2',
    status: 'Đang dùng',
    contract: '30 Sep',
    action: 'Mở',
    note: 'Ưu tiên khu A, phòng yên tĩnh, không có cảnh báo tài sản.',
    history: ['APP-204 đã duyệt', 'Check-in CIN-0821', 'PAY-6021 matched'],
  },
  {
    id: 'SV2302700188',
    name: 'Tran Minh Anh',
    room: 'A-302 B4',
    status: 'Đang dùng',
    contract: '30 Sep',
    action: 'Mở',
    note: 'Có yêu cầu hỗ trợ accessibility khi đổi phòng.',
    history: ['APP-203 bổ sung giấy tờ', 'PAY-6018 đang rà soát'],
  },
  {
    id: 'SV2302700199',
    name: 'Le Bao Chau',
    room: 'B-112 B1',
    status: 'Transfer',
    contract: '30 Sep',
    action: 'Rà soát',
    note: 'Đang chờ duyệt chuyển phòng do lịch học ca tối.',
    history: ['Room change request', 'Ticket WO-870 closed'],
  },
  {
    id: 'SV2302700108',
    name: 'Nguyen Gia Huy',
    room: 'D-104 B4',
    status: 'Watch',
    contract: '30 Sep',
    action: 'Mở',
    note: 'Theo dõi vì có 2 ticket sửa chữa lặp trong 30 ngày.',
    history: ['WO-864 keycard', 'WO-878 sink leak'],
  },
  {
    id: 'SV2302700134',
    name: 'Do Thanh Tam',
    room: 'C-210 B3',
    status: 'Leaving',
    contract: '30 Jun',
    action: 'Checkout',
    note: 'Chuẩn bị checklist check-out và đối soát tài sản.',
    history: ['COUT-0309 draft', 'INV-0626 overdue'],
  },
];

const tone: Record<ResidentStatus, OpsTone> = {
  'Đang dùng': 'green',
  Transfer: 'amber',
  Watch: 'cyan',
  Leaving: 'rose',
};

const columns: StaffColumn<Resident>[] = [
  {
    key: 'resident',
    label: 'Resident',
    className: 'px-4',
    render: (row) => (
      <div className="font-semibold text-[#101828]">
        {row.name}
        <span className="mt-1 block text-xs font-normal text-[#667085]">{row.id}</span>
      </div>
    ),
  },
  { key: 'room', label: 'Phòng', render: (row) => row.room },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row) => <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>,
  },
  { key: 'contract', label: 'Contract', render: (row) => row.contract },
  { key: 'action', label: 'Thao tác', render: (row) => row.action },
];

export function StaffResidentsPage() {
  return (
    <StaffOpsScreen
      eyebrow="NV / Cư trú"
      title="Cư trú"
      description="Phạm vi: NV / Cư trú. Tra cứu resident roster, phòng giường, trạng thái hợp đồng và các ghi chú vận hành cần theo dõi."
      primaryAction="Mở record"
      metrics={[
        { label: 'Đang dùng', value: '1,248', hint: 'Current term', tone: 'rose' },
        { label: 'Contracts', value: '36', hint: 'Expiring soon', tone: 'amber' },
        { label: 'Needs notes', value: '14', hint: 'Accessibility', tone: 'cyan' },
        { label: 'Room changes', value: '8', hint: 'Chờ', tone: 'red' },
      ]}
      searchPlaceholder="Tìm kiếm residents"
      chips={['Trạng thái: Tất cả', 'Kỳ: 2026']}
      rows={residents}
      columns={columns}
      searchText={(row) => `${row.id} ${row.name} ${row.room} ${row.status}`}
      workflowTitle="Resident Hồ sơ"
      workflow={[
        { title: 'Tổng quan', description: 'Identity, phòng, contract và trạng thái hiện tại.', tone: 'green' },
        { title: 'Lịch sử', description: 'Duyệt đơn, yêu cầu, check-in/out và phiếu sửa chữa.', tone: 'green' },
        { title: 'Care notes', description: 'Ghi chú nội bộ cho nhân viên, có quyền xem phù hợp.', tone: 'amber' },
        { title: 'Move workflow', description: 'Liên kết đổi phòng, checkout và room ledger.', tone: 'amber' },
        { title: 'Lượt xuất', description: 'Bảng roster sẵn sàng để lọc và xuất file.', tone: 'amber' },
      ]}
      decisionDescription="Residents page là staff directory: có filter trạng thái, ngữ cảnh phòng ở, care notes, và link tới các flow vận hành liên quan."
      decisionTag="Cư trú"
      detailTitle={(row) => row.name}
      detailDescription={(row) => `${row.id} · ${row.room}`}
      renderDetails={(row) => (
        <>
          <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <UserRoundCheck className="h-4 w-4 text-[#a72c3a]" />
              Trạng thái cư trú
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>
              <StatusPill tone="slate">Contract {row.contract}</StatusPill>
            </div>
          </div>

          <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <DoorOpen className="h-4 w-4 text-[#087e82]" />
              Room context
            </div>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{row.note}</p>
          </div>

          <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <FileText className="h-4 w-4 text-[#b54708]" />
              Lịch sử gần đây
            </div>
            <ul className="mt-3 space-y-2 text-sm text-[#667085]">
              {row.history.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    />
  );
}