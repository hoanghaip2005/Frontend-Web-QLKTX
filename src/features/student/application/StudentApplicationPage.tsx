import { useMemo, useState } from 'react';
import { AlertTriangle, ClipboardCheck, FileText, SendHorizontal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  StudentPageShell,
  StudentSectionCard,
  StudentStatePanel,
  StudentStateTabs,
  StudentStatusPill,
  StudentTimeline,
} from '@/features/student/dashboard/components/StudentCoreDesign';

type DemoState = 'data' | 'loading' | 'empty' | 'error';
type ApplicationStage = 'draft' | 'submitted' | 'review' | 'approved' | 'rejected';

type ApplicationForm = {
  fullName: string;
  studentId: string;
  major: string;
  phone: string;
  guardian: string;
  priority: string;
  address: string;
  note: string;
  confirmAccuracy: boolean;
  confirmPolicy: boolean;
};

type ValidationErrors = Partial<Record<keyof ApplicationForm, string>>;

const initialForm: ApplicationForm = {
  fullName: 'Trần Mộng Tuyền',
  studentId: 'SV2302700118',
  major: 'Công nghệ thông tin',
  phone: '0909 123 456',
  guardian: 'Trần Văn A · 0912 000 111',
  priority: 'Gần khu tự học, phòng yên tĩnh, ưu tiên tòa A',
  address: 'TP. Hồ Chí Minh',
  note: 'Em học ca chiều, cần giờ tự học buổi tối và muốn ở phòng không quá ồn.',
  confirmAccuracy: false,
  confirmPolicy: false,
};

const stageCopy: Record<ApplicationStage, { label: string; hint: string; tone: 'rose' | 'cyan' | 'green' | 'amber' | 'red' | 'slate' }> = {
  draft: { label: 'Draft', hint: 'Có thể chỉnh sửa', tone: 'amber' },
  submitted: { label: 'Submitted', hint: 'Đã gửi hồ sơ', tone: 'cyan' },
  review: { label: 'Pending review', hint: 'Nhân viên đang kiểm tra', tone: 'slate' },
  approved: { label: 'Approved', hint: 'Đã phân phòng', tone: 'green' },
  rejected: { label: 'Rejected', hint: 'Cần đọc lý do', tone: 'red' },
};

const checklist = [
  { label: 'Thông tin cá nhân', status: 'Hoàn tất', tone: 'green' as const },
  { label: 'Nguyện vọng phòng/giường', status: 'Hoàn tất', tone: 'green' as const },
  { label: 'Số điện thoại người giám hộ', status: 'Đã nhập', tone: 'cyan' as const },
  { label: 'Xác nhận điều khoản cư trú', status: 'Chờ tick', tone: 'amber' as const },
  { label: 'Xác nhận gửi hồ sơ', status: 'Chưa gửi', tone: 'slate' as const },
];

function validateApplication(form: ApplicationForm): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên.';
  if (!/^SV\d{10}$/.test(form.studentId.trim())) errors.studentId = 'MSSV cần có dạng SV + 10 chữ số.';
  if (!form.major.trim()) errors.major = 'Vui lòng nhập ngành học.';
  if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Số điện thoại cần có 10 chữ số và bắt đầu bằng 0.';
  if (!form.guardian.trim()) errors.guardian = 'Cần thông tin người giám hộ.';
  if (!form.priority.trim()) errors.priority = 'Cần ít nhất một nguyện vọng phòng/giường.';
  if (!form.address.trim()) errors.address = 'Vui lòng nhập địa chỉ liên hệ.';
  if (!form.confirmAccuracy) errors.confirmAccuracy = 'Cần xác nhận thông tin chính xác.';
  if (!form.confirmPolicy) errors.confirmPolicy = 'Cần đồng ý nội quy KTX.';

  return errors;
}

export function StudentApplicationPage() {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [stage, setStage] = useState<ApplicationStage>('draft');
  const [demoState, setDemoState] = useState<DemoState>('data');

  const completion = useMemo(() => {
    const fields: Array<keyof ApplicationForm> = [
      'fullName',
      'studentId',
      'major',
      'phone',
      'guardian',
      'priority',
      'address',
      'confirmAccuracy',
      'confirmPolicy',
    ];
    const filled = fields.filter((field) => Boolean(form[field])).length;

    return Math.round((filled / fields.length) * 100);
  }, [form]);

  const handleSubmit = () => {
    const nextErrors = validateApplication(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStage('submitted');
    }
  };

  const currentStage = stageCopy[stage];

  return (
    <StudentPageShell
      eyebrow="SV / Đăng ký ở KTX"
      title="Hồ sơ đăng ký KTX"
      description="US-003 và US-004: sinh viên nhập hồ sơ, kiểm tra validation, gửi đơn và theo dõi trạng thái xét duyệt bằng mock data."
      primaryAction="Gửi hồ sơ"
      secondaryAction="Lưu nháp"
      metrics={[
        { label: 'Hoàn tất form', value: `${completion}%`, hint: completion >= 100 ? 'Sẵn sàng gửi' : 'Còn thiếu thông tin', tone: completion >= 100 ? 'green' : 'amber' },
        { label: 'Trạng thái', value: currentStage.label, hint: currentStage.hint, tone: currentStage.tone },
        { label: 'Mã hồ sơ', value: 'APP-204', hint: 'Kỳ Fall 2026', tone: 'rose' },
        { label: 'Dự kiến xử lý', value: '24h', hint: 'Sau khi submitted', tone: 'cyan' },
      ]}
    >
      <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
        <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['draft', 'submitted', 'review', 'approved', 'rejected'] as const).map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={stage === item ? 'default' : 'outline'}
                className={
                  stage === item
                    ? 'bg-[#a72c3a] text-white hover:bg-[#8f2633]'
                    : 'border-[#f2cdd4] bg-white text-[#667085] hover:bg-[#fff1f5]'
                }
                onClick={() => setStage(item)}
              >
                {stageCopy[item].label}
              </Button>
            ))}
          </div>
          <StudentStateTabs value={demoState} onChange={setDemoState} />
        </CardContent>
      </Card>

      <StudentStatePanel
        state={demoState}
        emptyTitle="Chưa có hồ sơ đăng ký"
        emptyDescription="Sinh viên bấm Tạo hồ sơ để bắt đầu nhập thông tin đăng ký KTX."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {stage === 'rejected' && (
              <Alert variant="destructive" className="border-[#ffcfd7] bg-[#fff1f5]">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Hồ sơ bị từ chối</AlertTitle>
                <AlertDescription>
                  Mock rejected state: thiếu minh chứng ưu tiên hoặc thông tin người giám hộ chưa hợp lệ.
                </AlertDescription>
              </Alert>
            )}

            {stage === 'approved' && (
              <Alert className="border-[#c9f0db] bg-[#e7f8ef] text-[#16845c]">
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Hồ sơ đã được duyệt</AlertTitle>
                <AlertDescription className="text-[#16845c]">
                  Sinh viên được phân Building A · Room A-302 · Bed B4. Vào Phòng hiện tại để xem chi tiết.
                </AlertDescription>
              </Alert>
            )}

            <StudentSectionCard
              title="Application form"
              description="Validation state nằm ngay dưới field; không gọi API thật, chỉ cập nhật local state."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-[#101828]">
                  Họ tên
                  <Input
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    className="border-[#e8d5da] bg-white"
                  />
                  {errors.fullName && <span className="block text-xs text-[#c91d2e]">{errors.fullName}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828]">
                  MSSV
                  <Input
                    value={form.studentId}
                    onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))}
                    className="border-[#e8d5da] bg-white"
                  />
                  {errors.studentId && <span className="block text-xs text-[#c91d2e]">{errors.studentId}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828]">
                  Ngành học
                  <Input
                    value={form.major}
                    onChange={(event) => setForm((current) => ({ ...current, major: event.target.value }))}
                    className="border-[#e8d5da] bg-white"
                  />
                  {errors.major && <span className="block text-xs text-[#c91d2e]">{errors.major}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828]">
                  Số điện thoại
                  <Input
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className="border-[#e8d5da] bg-white"
                  />
                  {errors.phone && <span className="block text-xs text-[#c91d2e]">{errors.phone}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828] md:col-span-2">
                  Người giám hộ
                  <Input
                    value={form.guardian}
                    onChange={(event) => setForm((current) => ({ ...current, guardian: event.target.value }))}
                    className="border-[#e8d5da] bg-white"
                  />
                  {errors.guardian && <span className="block text-xs text-[#c91d2e]">{errors.guardian}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828] md:col-span-2">
                  Địa chỉ liên hệ
                  <Input
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    className="border-[#e8d5da] bg-white"
                  />
                  {errors.address && <span className="block text-xs text-[#c91d2e]">{errors.address}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828] md:col-span-2">
                  Nguyện vọng phòng/giường
                  <Textarea
                    value={form.priority}
                    onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                    className="min-h-24 border-[#e8d5da] bg-white"
                  />
                  {errors.priority && <span className="block text-xs text-[#c91d2e]">{errors.priority}</span>}
                </label>

                <label className="space-y-2 text-sm font-semibold text-[#101828] md:col-span-2">
                  Ghi chú thêm
                  <Textarea
                    value={form.note}
                    onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                    className="min-h-24 border-[#e8d5da] bg-white"
                  />
                </label>
              </div>

              <div className="space-y-3 rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                <label className="flex items-start gap-3 text-sm text-[#667085]">
                  <Checkbox
                    checked={form.confirmAccuracy}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({ ...current, confirmAccuracy: Boolean(checked) }))
                    }
                    className="mt-0.5"
                  />
                  <span>
                    Em xác nhận thông tin đăng ký là chính xác.
                    {errors.confirmAccuracy && <span className="block text-xs text-[#c91d2e]">{errors.confirmAccuracy}</span>}
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm text-[#667085]">
                  <Checkbox
                    checked={form.confirmPolicy}
                    onCheckedChange={(checked) =>
                      setForm((current) => ({ ...current, confirmPolicy: Boolean(checked) }))
                    }
                    className="mt-0.5"
                  />
                  <span>
                    Em đồng ý nội quy KTX và quyền xử lý dữ liệu phục vụ xét duyệt.
                    {errors.confirmPolicy && <span className="block text-xs text-[#c91d2e]">{errors.confirmPolicy}</span>}
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#f2cdd4] bg-white text-[#a72c3a] hover:bg-[#fff1f5]"
                >
                  Lưu nháp
                </Button>
                <Button type="button" className="bg-[#a72c3a] text-white hover:bg-[#8f2633]" onClick={handleSubmit}>
                  <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                  Gửi hồ sơ
                </Button>
              </div>
            </StudentSectionCard>
          </div>

          <div className="space-y-4">
            <StudentSectionCard title="Status timeline" description="US-004 application status: pending/approved/rejected states.">
              <StudentTimeline
                items={[
                  {
                    title: 'Draft',
                    description: 'Sinh viên nhập hồ sơ và có thể lưu nháp.',
                    done: ['submitted', 'review', 'approved', 'rejected'].includes(stage),
                    tone: stage === 'draft' ? 'amber' : 'green',
                  },
                  {
                    title: 'Submitted',
                    description: 'Hồ sơ đã gửi, khóa các field quan trọng.',
                    done: ['review', 'approved', 'rejected'].includes(stage),
                    tone: stage === 'submitted' ? 'cyan' : 'green',
                  },
                  {
                    title: 'Staff review',
                    description: 'Nhân viên rà soát điều kiện và minh chứng.',
                    done: ['approved', 'rejected'].includes(stage),
                    tone: stage === 'review' ? 'amber' : 'slate',
                  },
                  {
                    title: stage === 'rejected' ? 'Rejected' : 'Approved room',
                    description:
                      stage === 'rejected'
                        ? 'Hiển thị lý do từ chối và hướng dẫn bổ sung.'
                        : 'Hiển thị phòng/giường được phân và checklist xác nhận.',
                    done: ['approved', 'rejected'].includes(stage),
                    tone: stage === 'rejected' ? 'red' : stage === 'approved' ? 'green' : 'slate',
                  },
                ]}
              />
            </StudentSectionCard>

            <StudentSectionCard title="Checklist hồ sơ">
              <Table>
                <TableHeader className="bg-[#fff9fb]">
                  <TableRow className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                    <TableHead className="text-xs font-semibold text-[#667085]">Mục</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklist.map((item) => (
                    <TableRow key={item.label} className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                      <TableCell className="text-sm font-semibold text-[#101828]">{item.label}</TableCell>
                      <TableCell>
                        <StudentStatusPill tone={item.tone}>{item.status}</StudentStatusPill>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StudentSectionCard>

            <StudentSectionCard title="Room suggestion preview">
              <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                  <FileText className="h-4 w-4 text-[#a72c3a]" aria-hidden="true" />
                  Building A · Room A-302 · Bed B4
                </div>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Chỉ hiển thị chính thức khi application chuyển sang Approved. Đây là preview để demo flow draft → approved room.
                </p>
              </div>
            </StudentSectionCard>
          </div>
        </div>
      </StudentStatePanel>
    </StudentPageShell>
  );
}