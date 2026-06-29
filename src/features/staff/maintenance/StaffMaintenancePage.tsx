import { useState } from 'react';
import { Clock3, FileText, Wrench } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  StaffOpsScreen,
  StatusPill,
  type OpsTone,
  type StaffColumn,
} from '@/features/staff/maintenance/components/StaffOpsDesign';

type TicketStatus = 'Quá hạn' | 'Đã lên lịch' | 'Mở' | 'Đã nghiệm thu' | 'Chờ sinh viên' | 'Reopened';

type Ticket = {
  id: string;
  title: string;
  asset: string;
  room: string;
  status: TicketStatus;
  assignee: string;
  due: string;
  priority: string;
  action: string;
  note: string;
};

const initialTickets: Ticket[] = [
  {
    id: 'WO-883',
    title: 'Quạt kêu',
    asset: 'A302-FAN01',
    room: 'A-302',
    status: 'Quá hạn',
    assignee: 'Tuan',
    due: 'Trễ 6h',
    priority: 'High',
    action: 'Nâng SLA',
    note: 'Sinh viên báo quạt kêu lớn vào ban đêm. Cần xử lý trước ca tối.',
  },
  {
    id: 'WO-881',
    title: 'Chốt cửa sổ',
    asset: 'A302-WIN02',
    room: 'A-302',
    status: 'Đã lên lịch',
    assignee: 'Minh',
    due: 'Hôm nay 15:00',
    priority: 'Medium',
    action: 'Mở chi tiết',
    note: 'Đã đặt lịch kỹ thuật viên kiểm tra khung cửa và chốt khóa.',
  },
  {
    id: 'WO-878',
    title: 'Rò bồn rửa',
    asset: 'B110-SINK',
    room: 'B-110',
    status: 'Mở',
    assignee: 'Lan',
    due: 'Còn 1 ngày',
    priority: 'Medium',
    action: 'Phân công',
    note: 'Cần triage nguyên nhân rò nước, kiểm tra vật tư thay thế.',
  },
  {
    id: 'WO-870',
    title: 'Thay bóng đèn',
    asset: 'A302-LIGHT',
    room: 'A-302',
    status: 'Đã nghiệm thu',
    assignee: 'Hoa',
    due: 'Đã xong',
    priority: 'Low',
    action: 'Đóng phiếu',
    note: 'Kỹ thuật đã thay bóng, chờ lưu lịch sử tài sản.',
  },
  {
    id: 'WO-864',
    title: 'Thẻ phòng',
    asset: 'CARD-4021',
    room: 'C-210',
    status: 'Chờ sinh viên',
    assignee: 'An',
    due: 'Chờ xác nhận',
    priority: 'Low',
    action: 'Nhắc xác nhận',
    note: 'Đã cấp lại thẻ phòng, sinh viên cần xác nhận trên app.',
  },
  {
    id: 'WO-859',
    title: 'Ổ cắm lỏng',
    asset: 'D104-PLUG',
    room: 'D-104',
    status: 'Reopened',
    assignee: 'Tuan',
    due: 'Còn 4h',
    priority: 'High',
    action: 'Xử lý lại',
    note: 'Sinh viên reopen vì lỗi xuất hiện lại sau nghiệm thu.',
  },
];

const tone: Record<TicketStatus, OpsTone> = {
  'Quá hạn': 'red',
  'Đã lên lịch': 'amber',
  Mở: 'cyan',
  'Đã nghiệm thu': 'green',
  'Chờ sinh viên': 'slate',
  Reopened: 'rose',
};

export function StaffMaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const columns: StaffColumn<Ticket>[] = [
    {
      key: 'ticket',
      label: 'Phiếu sửa chữa',
      className: 'px-4',
      render: (row) => (
        <div className="font-semibold text-[#101828]">
          {row.id} {row.title}
          <span className="mt-1 block text-xs font-normal text-[#667085]">{row.room}</span>
        </div>
      ),
    },
    { key: 'asset', label: 'Tài sản', render: (row) => row.asset },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>,
    },
    { key: 'assignee', label: 'Kỹ thuật', render: (row) => row.assignee },
    {
      key: 'action',
      label: 'Thao tác',
      render: (row) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-[#667085] hover:bg-[#fff1f5] hover:text-[#a72c3a]"
          onClick={() =>
            setTickets((current) =>
              current.map((item) =>
                item.id === row.id
                  ? {
                      ...item,
                      status: item.status === 'Mở' ? 'Đã lên lịch' : item.status === 'Quá hạn' ? 'Reopened' : item.status,
                      action: 'Đã cập nhật',
                    }
                  : item,
              ),
            )
          }
        >
          {row.action}
        </Button>
      ),
    },
  ];

  return (
    <StaffOpsScreen
      eyebrow="NV / Sửa chữa"
      title="Phiếu sửa chữa"
      description="Phạm vi: NV / Sửa chữa. Theo dõi SLA, ticket quá hạn, phân công kỹ thuật viên, vật tư, xử lý và nghiệm thu."
      primaryAction="Phân công"
      metrics={[
        { label: 'Phiếu mở', value: String(tickets.filter((ticket) => ticket.status !== 'Đã nghiệm thu').length), hint: 'Tất cả tòa', tone: 'cyan' },
        { label: 'Quá hạn', value: String(tickets.filter((ticket) => ticket.status === 'Quá hạn').length), hint: 'Rủi ro SLA', tone: 'red' },
        { label: 'Kỹ thuật viên', value: '12', hint: 'Đang trực', tone: 'green' },
        { label: 'TB xử lý', value: '1.8d', hint: '30 ngày qua', tone: 'rose' },
      ]}
      searchPlaceholder="Tìm phiếu sửa chữa"
      chips={['Trạng thái: Tất cả', 'Kỳ: 2026']}
      rows={tickets}
      columns={columns}
      searchText={(row) => `${row.id} ${row.title} ${row.asset} ${row.room} ${row.status} ${row.assignee}`}
      workflowTitle="Luồng phiếu sửa chữa"
      workflow={[
        { title: 'Tiếp nhận', description: 'Danh mục, tài sản, mức độ và SLA.', tone: 'green' },
        { title: 'Phân công', description: 'Kỹ thuật viên và lịch xử lý.', tone: 'green' },
        { title: 'Vật tư', description: 'Theo dõi yêu cầu vật tư và lý do trễ.', tone: 'amber' },
        { title: 'Xử lý', description: 'Ghi chú xử lý và cư dân xác nhận.', tone: 'amber' },
        { title: 'Nghiệm thu', description: 'Lịch sử tài sản ghi nhận lỗi lặp.', tone: 'amber' },
      ]}
      decisionDescription="Màn hình phiếu sửa chữa ưu tiên SLA, phân công kỹ thuật viên, vật tư, xử lý và nghiệm thu."
      decisionTag="Sửa chữa"
      detailTitle={(row) => `${row.id} ${row.title}`}
      detailDescription={(row) => `${row.room} · ${row.asset}`}
      renderDetails={(row) => (
        <>
          <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <Wrench className="h-4 w-4 text-[#a72c3a]" />
              Ticket status
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>
              <StatusPill tone="slate">Priority {row.priority}</StatusPill>
            </div>
          </div>

          <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <Clock3 className="h-4 w-4 text-[#b54708]" />
              SLA / assignee
            </div>
            <p className="mt-2 text-sm text-[#667085]">
              {row.assignee} · {row.due}
            </p>
          </div>

          <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <FileText className="h-4 w-4 text-[#087e82]" />
              Ghi chú xử lý
            </div>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{row.note}</p>
          </div>
        </>
      )}
    />
  );
}