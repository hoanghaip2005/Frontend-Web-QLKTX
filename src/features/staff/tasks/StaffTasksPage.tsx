import { CalendarDays, ClipboardCheck, MessageSquareText } from 'lucide-react';

import {
  StaffOpsScreen,
  StatusPill,
  type OpsTone,
  type StaffColumn,
} from '@/features/staff/maintenance/components/StaffOpsDesign';

type TaskStatus = 'Mở' | 'Chờ' | 'Nháp' | 'Quá hạn' | 'Hoàn tất';

type ShiftTask = {
  id: string;
  task: string;
  shift: string;
  building: string;
  status: TaskStatus;
  owner: string;
  action: string;
  due: string;
  handover: string;
};

const tasks: ShiftTask[] = [
  {
    id: 'TSK-401',
    task: 'Inspect Building A exits',
    shift: 'Morning',
    building: 'Building A',
    status: 'Mở',
    owner: 'Lan',
    action: 'Start',
    due: '09:30',
    handover: 'Kiểm tra lối thoát hiểm, khóa cửa và camera tầng trệt.',
  },
  {
    id: 'TSK-402',
    task: 'Call quá hạn residents',
    shift: 'Afternoon',
    building: 'Billing',
    status: 'Chờ',
    owner: 'An',
    action: 'Mở',
    due: '14:00',
    handover: 'Gọi danh sách sinh viên quá hạn phí, ghi lại phản hồi.',
  },
  {
    id: 'TSK-403',
    task: 'Front desk closeout',
    shift: 'Night',
    building: 'Reception',
    status: 'Nháp',
    owner: 'Unassigned',
    action: 'Phân công',
    due: '22:00',
    handover: 'Cần người trực quầy để đóng sổ và kiểm kê thẻ phòng.',
  },
  {
    id: 'TSK-404',
    task: 'WO-883 escalation',
    shift: 'Morning',
    building: 'Maintenance',
    status: 'Quá hạn',
    owner: 'Tuan',
    action: 'Nâng mức',
    due: 'Late',
    handover: 'Ticket quạt kêu quá hạn, cần supervisor review và lịch xử lý mới.',
  },
  {
    id: 'TSK-405',
    task: 'Daily handover note',
    shift: 'Night',
    building: 'Ops',
    status: 'Hoàn tất',
    owner: 'Hoa',
    action: 'Xem',
    due: 'Done',
    handover: 'Đã ghi chú bàn giao: 3 task còn pending, 1 ticket reopen.',
  },
];

const tone: Record<TaskStatus, OpsTone> = {
  Mở: 'cyan',
  Chờ: 'amber',
  Nháp: 'rose',
  'Quá hạn': 'red',
  'Hoàn tất': 'green',
};

const columns: StaffColumn<ShiftTask>[] = [
  {
    key: 'task',
    label: 'Task',
    className: 'px-4',
    render: (row) => (
      <div className="font-semibold text-[#101828]">
        {row.task}
        <span className="mt-1 block text-xs font-normal text-[#667085]">
          {row.id} · {row.building}
        </span>
      </div>
    ),
  },
  { key: 'shift', label: 'Shift', render: (row) => row.shift },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row) => (
      <div>
        <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>
        <span className="mt-1 block text-xs text-[#667085]">{row.due}</span>
      </div>
    ),
  },
  { key: 'owner', label: 'Phụ trách', render: (row) => row.owner },
  { key: 'action', label: 'Thao tác', render: (row) => row.action },
];

export function StaffTasksPage() {
  return (
    <StaffOpsScreen
      eyebrow="NV / Tác vụ"
      title="Tasks & Shifts"
      description="Phạm vi: NV / Tác vụ. Quản lý ca trực, task queue, người phụ trách, handover note và cảnh báo task trễ hạn."
      primaryAction="Phân công shift"
      metrics={[
        { label: 'Shifts today', value: '16', hint: '3 teams', tone: 'cyan' },
        { label: 'Unassigned', value: '3', hint: 'Need phụ trách', tone: 'red' },
        { label: 'Late tasks', value: '5', hint: 'Past due', tone: 'amber' },
        { label: 'Handover', value: '9', hint: 'New notes', tone: 'rose' },
      ]}
      searchPlaceholder="Tìm kiếm tasks"
      chips={['Trạng thái: Tất cả', 'Kỳ: 2026']}
      rows={tasks}
      columns={columns}
      searchText={(row) => `${row.id} ${row.task} ${row.shift} ${row.status} ${row.owner} ${row.building}`}
      workflowTitle="Shift workflow"
      workflow={[
        { title: 'Roster', description: 'Phân công nhân sự vào từng shift block.', tone: 'green' },
        { title: 'Ca trực', description: 'Queue theo tòa nhà, khu vực và mức độ ưu tiên.', tone: 'green' },
        { title: 'Handover', description: 'Notes carry giữa các ca để không mất ngữ cảnh.', tone: 'amber' },
        { title: 'Escalation', description: 'Task trễ hạn kích hoạt supervisor review.', tone: 'amber' },
        { title: 'Completion', description: 'Đóng task với ghi chú và timestamp rõ ràng.', tone: 'amber' },
      ]}
      decisionDescription="Tasks and shifts page gắn công việc vận hành với roster ownership, handover notes và late-task escalation."
      decisionTag="Ca trực"
      detailTitle={(row) => row.task}
      detailDescription={(row) => `${row.id} · ${row.shift} · ${row.building}`}
      renderDetails={(row) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                <CalendarDays className="h-4 w-4 text-[#a72c3a]" />
                Shift
              </div>
              <p className="mt-2 text-sm font-semibold text-[#101828]">{row.shift}</p>
            </div>

            <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                <ClipboardCheck className="h-4 w-4 text-[#b54708]" />
                Due
              </div>
              <p className="mt-2 text-sm font-semibold text-[#101828]">{row.due}</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <MessageSquareText className="h-4 w-4 text-[#087e82]" />
              Handover note
            </div>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{row.handover}</p>
          </div>
        </>
      )}
    />
  );
}