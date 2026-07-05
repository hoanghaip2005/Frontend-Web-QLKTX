import { useState } from 'react';
import { ArrowRight, BedDouble, ClipboardList, FileClock, Home, ReceiptText, Wrench } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  StudentPageShell,
  StudentSectionCard,
  StudentStatePanel,
  StudentStateTabs,
  StudentStatusPill,
  StudentTimeline,
} from '@/features/student/dashboard/components/StudentCoreDesign';

type DemoState = 'data' | 'loading' | 'empty' | 'error';

type ActionItem = {
  title: string;
  description: string;
  status: string;
  tone: 'rose' | 'cyan' | 'green' | 'amber' | 'red' | 'slate' | 'plum';
  icon: typeof ClipboardList;
};

const actionItems: ActionItem[] = [
  {
    title: 'Hoàn tất hồ sơ đăng ký KTX',
    description: 'Cập nhật số điện thoại người giám hộ và xác nhận điều khoản cư trú.',
    status: 'Cần bổ sung',
    tone: 'amber',
    icon: ClipboardList,
  },
  {
    title: 'Theo dõi kết quả duyệt đơn',
    description: 'Hồ sơ APP-204 đang ở bước Staff review, dự kiến phản hồi trong 24h.',
    status: 'Đang xử lý',
    tone: 'cyan',
    icon: FileClock,
  },
  {
    title: 'Xác nhận phòng được phân',
    description: 'Sau khi duyệt, sinh viên xác nhận giường và xem checklist check-in.',
    status: 'Chờ duyệt',
    tone: 'slate',
    icon: BedDouble,
  },
];

export function StudentDashboardPage() {
  const [demoState, setDemoState] = useState<DemoState>('data');

  return (
    <StudentPageShell
      eyebrow="SV / Dashboard"
      title="Trang chủ sinh viên"
      description="Theo dõi nhanh hồ sơ đăng ký KTX, trạng thái xét duyệt, phòng/giường dự kiến và các việc sinh viên cần xử lý tiếp."
      primaryAction="Tiếp tục hồ sơ"
      secondaryAction="Xem phòng"
      metrics={[
        { label: 'Application', value: '78%', hint: 'Draft gần hoàn tất', tone: 'rose' },
        { label: 'Status', value: 'Review', hint: 'Staff đang kiểm tra', tone: 'cyan' },
        { label: 'Room fit', value: 'A-302', hint: 'Gợi ý ưu tiên', tone: 'green' },
        { label: 'Checklist', value: '5/7', hint: 'Cần bổ sung 2 mục', tone: 'amber' },
      ]}
    >
      <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
        <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-[#101828]">Demo state</p>
            <p className="text-xs text-[#667085]">Bấm để kiểm tra Data / Loading / Empty / Error.</p>
          </div>
          <StudentStateTabs value={demoState} onChange={setDemoState} />
        </CardContent>
      </Card>

      <StudentStatePanel
        state={demoState}
        emptyTitle="Chưa có hồ sơ sinh viên"
        emptyDescription="Khi sinh viên bắt đầu đăng ký, trạng thái hồ sơ và phòng dự kiến sẽ hiển thị tại đây."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <StudentSectionCard
              title="Việc cần làm"
              description="Các hành động quan trọng để đi từ draft sang submitted, review và approved room."
            >
              <div className="space-y-3">
                {actionItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex flex-col gap-3 rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f5] text-[#a72c3a]">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#101828]">{item.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-[#667085]">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <StudentStatusPill tone={item.tone}>{item.status}</StudentStatusPill>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Mở ${item.title}`}
                          className="text-[#a72c3a] hover:bg-[#fff1f5]"
                        >
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </StudentSectionCard>

            <div className="grid gap-4 lg:grid-cols-2">
              <StudentSectionCard title="Phòng/giường dự kiến" description="Thông tin student side của room/bed ledger.">
                <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                    <Home className="h-4 w-4 text-[#a72c3a]" aria-hidden="true" />
                    Building A · Room A-302 · Bed B4
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Phòng 4 người, tầng 3, gần khu tự học. Phù hợp ưu tiên yên tĩnh và lịch học ca tối.
                  </p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-[#667085]">
                    <span>Độ sẵn sàng check-in</span>
                    <span className="font-semibold text-[#a72c3a]">72%</span>
                  </div>
                  <Progress value={72} className="bg-[#fff1f5] [&_[data-slot=progress-indicator]]:bg-[#a72c3a]" />
                </div>
              </StudentSectionCard>

              <StudentSectionCard title="Dịch vụ liên quan" description="Các module Member 4 có thể nối tiếp sau flow core.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    { label: 'Sửa chữa', value: '0 ticket mở', icon: Wrench },
                    { label: 'Hóa đơn', value: '1 khoản chờ', icon: ReceiptText },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.label} className="rounded-xl border border-[#f2cdd4] bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                          <Icon className="h-4 w-4 text-[#087e82]" aria-hidden="true" />
                          {item.label}
                        </div>
                        <p className="mt-2 text-sm text-[#667085]">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </StudentSectionCard>
            </div>
          </div>

          <StudentSectionCard
            title="Application timeline"
            description="Sinh viên theo dõi draft → submitted → review → approved/rejected."
          >
            <StudentTimeline
              items={[
                {
                  title: 'Draft hồ sơ',
                  description: 'Thông tin cá nhân, nguyện vọng phòng và giấy tờ đã nhập 78%.',
                  meta: 'Hoàn tất trước 30/06',
                  done: true,
                  tone: 'green',
                },
                {
                  title: 'Submitted',
                  description: 'Hồ sơ sẽ khóa chỉnh sửa sau khi sinh viên xác nhận gửi.',
                  done: false,
                  tone: 'amber',
                },
                {
                  title: 'Staff review',
                  description: 'Nhân viên kiểm tra điều kiện, ưu tiên và minh chứng.',
                  tone: 'slate',
                },
                {
                  title: 'Room approved',
                  description: 'Hiển thị phòng/giường và checklist xác nhận cư trú.',
                  tone: 'slate',
                },
              ]}
            />
          </StudentSectionCard>
        </div>
      </StudentStatePanel>
    </StudentPageShell>
  );
}