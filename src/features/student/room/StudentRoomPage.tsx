import { useState } from 'react';
import { BedDouble, ClipboardCheck, DoorOpen, Home, PackageCheck, UsersRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  StudentPageShell,
  StudentSectionCard,
  StudentStatePanel,
  StudentStateTabs,
  StudentStatusPill,
  StudentTimeline,
} from '@/features/student/dashboard/components/StudentCoreDesign';

type DemoState = 'data' | 'loading' | 'empty' | 'error';

type Roommate = {
  id: string;
  name: string;
  bed: string;
  major: string;
  status: 'Đã check-in' | 'Chờ check-in' | 'Tạm vắng';
};

type Asset = {
  id: string;
  name: string;
  condition: 'Tốt' | 'Cần theo dõi' | 'Báo sửa chữa';
  lastCheck: string;
  note: string;
};

const roommates: Roommate[] = [
  { id: 'SV2302700188', name: 'Tran Minh Anh', bed: 'B1', major: 'Marketing', status: 'Đã check-in' },
  { id: 'SV2302700199', name: 'Le Bao Chau', bed: 'B2', major: 'Thiết kế đồ họa', status: 'Chờ check-in' },
  { id: 'SV2302700108', name: 'Nguyen Gia Huy', bed: 'B3', major: 'Công nghệ thông tin', status: 'Tạm vắng' },
  { id: 'SV2302700118', name: 'Trần Mộng Tuyền', bed: 'B4', major: 'Công nghệ thông tin', status: 'Chờ check-in' },
];

const assets: Asset[] = [
  {
    id: 'A302-FAN01',
    name: 'Quạt trần',
    condition: 'Cần theo dõi',
    lastCheck: '28 Jun',
    note: 'Có ticket WO-883 về tiếng ồn, staff đang xử lý SLA.',
  },
  {
    id: 'A302-DESK04',
    name: 'Bàn học B4',
    condition: 'Tốt',
    lastCheck: '25 Jun',
    note: 'Đã kiểm kê, không có hư hỏng.',
  },
  {
    id: 'A302-WIN02',
    name: 'Chốt cửa sổ',
    condition: 'Báo sửa chữa',
    lastCheck: '29 Jun',
    note: 'Đã lên lịch kỹ thuật kiểm tra chốt cửa sổ.',
  },
  {
    id: 'A302-LIGHT',
    name: 'Đèn phòng',
    condition: 'Tốt',
    lastCheck: '27 Jun',
    note: 'Ticket WO-870 đã nghiệm thu.',
  },
];

const checkinItems = [
  { title: 'Xác nhận phòng/giường', done: true },
  { title: 'Kiểm kê tài sản', done: true },
  { title: 'Xem nội quy cư trú', done: true },
  { title: 'Ký biên bản check-in', done: false },
  { title: 'Nhận thẻ phòng', done: false },
];

const roommateTone = {
  'Đã check-in': 'green',
  'Chờ check-in': 'amber',
  'Tạm vắng': 'slate',
} as const;

const assetTone = {
  Tốt: 'green',
  'Cần theo dõi': 'amber',
  'Báo sửa chữa': 'red',
} as const;

export function StudentRoomPage() {
  const [demoState, setDemoState] = useState<DemoState>('data');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <StudentPageShell
      eyebrow="SV / Phòng hiện tại"
      title="Phòng và giường hiện tại"
      description="Student side của US-006: hiển thị room/bed ledger, roommate list, asset condition và checklist check-in bằng mock data."
      primaryAction="Xác nhận phòng"
      secondaryAction="Báo sửa chữa"
      metrics={[
        { label: 'Room', value: 'A-302', hint: 'Building A · Floor 3', tone: 'rose' },
        { label: 'Bed', value: 'B4', hint: 'Assigned to SV2302700118', tone: 'cyan' },
        { label: 'Roommates', value: '4/4', hint: 'Đủ số lượng', tone: 'green' },
        { label: 'Check-in', value: '60%', hint: '3/5 bước hoàn tất', tone: 'amber' },
      ]}
    >
      <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
        <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-[#101828]">Room ledger state</p>
            <p className="text-xs text-[#667085]">Data / Loading / Empty / Error để reviewer kiểm thử nhanh.</p>
          </div>
          <StudentStateTabs value={demoState} onChange={setDemoState} />
        </CardContent>
      </Card>

      <StudentStatePanel
        state={demoState}
        emptyTitle="Chưa có phòng được phân"
        emptyDescription="Khi hồ sơ chuyển sang Approved, thông tin phòng/giường sẽ xuất hiện ở màn hình này."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <StudentSectionCard title="Current assignment" description="Thông tin phòng/giường được phân sau khi hồ sơ approved.">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { label: 'Building', value: 'Building A', icon: Home },
                  { label: 'Room', value: 'A-302', icon: DoorOpen },
                  { label: 'Bed', value: 'B4', icon: BedDouble },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                        <Icon className="h-4 w-4 text-[#a72c3a]" aria-hidden="true" />
                        {item.label}
                      </div>
                      <p className="mt-2 text-lg font-bold text-[#101828]">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#101828]">Mức độ sẵn sàng check-in</p>
                    <p className="mt-1 text-sm text-[#667085]">3/5 bước đã hoàn tất, còn ký biên bản và nhận thẻ phòng.</p>
                  </div>
                  <StudentStatusPill tone="amber">60%</StudentStatusPill>
                </div>
                <Progress value={60} className="mt-4 bg-[#fff1f5] [&_[data-slot=progress-indicator]]:bg-[#a72c3a]" />
              </div>
            </StudentSectionCard>

            <StudentSectionCard title="Roommates" description="Danh sách người ở cùng phòng để sinh viên nắm ngữ cảnh cư trú.">
              <Table>
                <TableHeader className="bg-[#fff9fb]">
                  <TableRow className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                    <TableHead className="text-xs font-semibold text-[#667085]">Sinh viên</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Bed</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Ngành</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roommates.map((roommate) => (
                    <TableRow key={roommate.id} className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                      <TableCell>
                        <div className="font-semibold text-[#101828]">{roommate.name}</div>
                        <div className="mt-1 text-xs text-[#667085]">{roommate.id}</div>
                      </TableCell>
                      <TableCell className="text-[#667085]">{roommate.bed}</TableCell>
                      <TableCell className="text-[#667085]">{roommate.major}</TableCell>
                      <TableCell>
                        <StudentStatusPill tone={roommateTone[roommate.status]}>{roommate.status}</StudentStatusPill>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StudentSectionCard>

            <StudentSectionCard title="Room assets" description="Sinh viên xem tài sản trong phòng và mở chi tiết để tạo ticket sau này.">
              <Table>
                <TableHeader className="bg-[#fff9fb]">
                  <TableRow className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                    <TableHead className="text-xs font-semibold text-[#667085]">Tài sản</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Tình trạng</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Lần kiểm tra</TableHead>
                    <TableHead className="text-xs font-semibold text-[#667085]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id} className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                      <TableCell>
                        <div className="font-semibold text-[#101828]">{asset.name}</div>
                        <div className="mt-1 text-xs text-[#667085]">{asset.id}</div>
                      </TableCell>
                      <TableCell>
                        <StudentStatusPill tone={assetTone[asset.condition]}>{asset.condition}</StudentStatusPill>
                      </TableCell>
                      <TableCell className="text-[#667085]">{asset.lastCheck}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-[#667085] hover:bg-[#fff1f5] hover:text-[#a72c3a]"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          Mở
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StudentSectionCard>
          </div>

          <div className="space-y-4">
            <StudentSectionCard title="Check-in checklist" description="Sinh viên biết cần làm gì trước khi nhận phòng.">
              <StudentTimeline
                items={checkinItems.map((item) => ({
                  title: item.title,
                  description: item.done ? 'Đã hoàn tất trong mock flow.' : 'Còn cần thực hiện trước ngày check-in.',
                  done: item.done,
                  tone: item.done ? 'green' : 'amber',
                }))}
              />
            </StudentSectionCard>

            <StudentSectionCard title="Room context">
              <div className="space-y-3">
                <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                    <UsersRound className="h-4 w-4 text-[#a72c3a]" aria-hidden="true" />
                    Quy mô phòng
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">Phòng 4 giường, 1 phòng tắm chung, gần khu tự học tầng 3.</p>
                </div>
                <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                    <ClipboardCheck className="h-4 w-4 text-[#087e82]" aria-hidden="true" />
                    Ghi chú phân phòng
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Match theo ưu tiên tòa A, lịch học tối và nhóm ngành. Nếu cần đổi phòng, gửi request sau check-in.
                  </p>
                </div>
              </div>
            </StudentSectionCard>
          </div>
        </div>
      </StudentStatePanel>

      <Sheet open={Boolean(selectedAsset)} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <SheetContent className="border-[#f2cdd4] sm:max-w-md">
          {selectedAsset && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedAsset.name}</SheetTitle>
                <SheetDescription>{selectedAsset.id} · {selectedAsset.lastCheck}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-4">
                <div className="rounded-xl border border-[#f2cdd4] bg-[#fff9fb] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
                    <PackageCheck className="h-4 w-4 text-[#a72c3a]" aria-hidden="true" />
                    Tình trạng tài sản
                  </div>
                  <div className="mt-3">
                    <StudentStatusPill tone={assetTone[selectedAsset.condition]}>{selectedAsset.condition}</StudentStatusPill>
                  </div>
                </div>

                <div className="rounded-xl border border-[#f2cdd4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#101828]">Ghi chú</p>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{selectedAsset.note}</p>
                </div>

                <Button type="button" className="w-full bg-[#a72c3a] text-white hover:bg-[#8f2633]">
                  Tạo ticket sửa chữa
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </StudentPageShell>
  );
}