import { Receipt, WalletCards } from 'lucide-react';

import {
  StaffOpsScreen,
  StatusPill,
  type OpsTone,
  type StaffColumn,
} from '@/features/staff/maintenance/components/StaffOpsDesign';

type BillingStatus = 'Matched' | 'Rà soát' | 'Quá hạn' | 'Nháp';

type BillingRecord = {
  id: string;
  student: string;
  status: BillingStatus;
  amount: string;
  action: string;
  source: string;
  note: string;
};

const records: BillingRecord[] = [
  {
    id: 'PAY-6021',
    student: 'Pham Hoang Hai',
    status: 'Matched',
    amount: 'VND 850K',
    action: 'Biên nhận',
    source: 'Bank statement',
    note: 'Đã khớp sinh viên, kỳ thanh toán và số tiền.',
  },
  {
    id: 'PAY-6018',
    student: 'Tran Minh Anh',
    status: 'Rà soát',
    amount: 'VND 850K',
    action: 'Khớp',
    source: 'Manual upload',
    note: 'Tên người chuyển khoản thiếu MSSV, cần nhân viên xác minh.',
  },
  {
    id: 'INV-0626',
    student: 'Le Bao Chau',
    status: 'Quá hạn',
    amount: 'VND 850K',
    action: 'Remind',
    source: 'Invoice queue',
    note: 'Quá hạn 3 ngày, cần tạo nhắc thanh toán.',
  },
  {
    id: 'PAY-6004',
    student: 'Nguyen Gia Huy',
    status: 'Matched',
    amount: 'VND 850K',
    action: 'Xem',
    source: 'Bank statement',
    note: 'Record đã khóa biên nhận, chỉ cho phép xem.',
  },
  {
    id: 'ADJ-210',
    student: 'Do Thanh Tam',
    status: 'Nháp',
    amount: 'VND 120K',
    action: 'Duyệt',
    source: 'Manual adjustment',
    note: 'Điều chỉnh phí giữ xe, cần duyệt trước khi ghi ledger.',
  },
];

const tone: Record<BillingStatus, OpsTone> = {
  Matched: 'green',
  'Rà soát': 'amber',
  'Quá hạn': 'red',
  Nháp: 'rose',
};

const columns: StaffColumn<BillingRecord>[] = [
  {
    key: 'record',
    label: 'Record',
    className: 'px-4',
    render: (row) => <span className="font-semibold text-[#101828]">{row.id}</span>,
  },
  { key: 'student', label: 'Sinh viên', render: (row) => row.student },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row) => <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>,
  },
  { key: 'amount', label: 'Amount', render: (row) => row.amount },
  { key: 'action', label: 'Thao tác', render: (row) => row.action },
];

export function StaffBillingPage() {
  return (
    <StaffOpsScreen
      eyebrow="NV / Đối soát"
      title="Đối soát thanh toán"
      description="Phạm vi: NV / Đối soát. UI mock cho matched/unmatched records, exception, reminder và batch xuất file."
      primaryAction="Match receipt"
      metrics={[
        { label: 'Đã thu', value: 'VND 1.2B', hint: 'This term', tone: 'green' },
        { label: 'Outstanding', value: 'VND 84M', hint: '98 students', tone: 'amber' },
        { label: 'Mismatches', value: '6', hint: 'Cần rà soát', tone: 'red' },
        { label: 'Batches', value: '3', hint: 'Sẵn sàng xuất file', tone: 'cyan' },
      ]}
      searchPlaceholder="Tìm kiếm thanh toán"
      chips={['Trạng thái: Tất cả', 'Kỳ: 2026']}
      rows={records}
      columns={columns}
      searchText={(row) => `${row.id} ${row.student} ${row.status} ${row.amount}`}
      workflowTitle="Thanh toán workflow"
      workflow={[
        { title: 'Import batch', description: 'Statement rows mapped to invoices.', tone: 'green' },
        { title: 'Khớp', description: 'Sinh viên, invoice period và amount.', tone: 'green' },
        { title: 'Exception', description: 'Mismatch requires nhân viên note.', tone: 'amber' },
        { title: 'Reminder', description: 'Quá hạn reminders created from queue.', tone: 'amber' },
        { title: 'Ledger', description: 'Finalized record locks receipt view.', tone: 'amber' },
      ]}
      decisionDescription="Thanh toán reconciliation screen shows matched/unmatched records, exceptions, reminders, and export-ready batches."
      decisionTag="Thanh toán"
      detailTitle={(row) => row.id}
      detailDescription={(row) => `${row.student} · ${row.amount}`}
      renderDetails={(row) => (
        <>
          <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <WalletCards className="h-4 w-4 text-[#a72c3a]" />
              Payment status
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusPill tone={tone[row.status]}>{row.status}</StatusPill>
              <StatusPill tone="slate">{row.source}</StatusPill>
            </div>
          </div>

          <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
              <Receipt className="h-4 w-4 text-[#087e82]" />
              Đối soát thủ công
            </div>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{row.note}</p>
          </div>
        </>
      )}
    />
  );
}