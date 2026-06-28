import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const overviewMetrics = [
  {
    value: '1,482',
    label: 'Người dùng',
    hint: 'TK đang dùng',
    accent: 'bg-[#c9354f]',
    hintClassName: 'text-[#c9354f]',
  },
  {
    value: '12',
    label: 'Tòa nhà',
    hint: '412 Phòng',
    accent: 'bg-[#26c6c9]',
    hintClassName: 'text-[#26a6a9]',
  },
  {
    value: '4',
    label: 'Sửa quy định',
    hint: 'Tuần này',
    accent: 'bg-[#e6b84a]',
    hintClassName: 'text-[#d99500]',
  },
  {
    value: '2',
    label: 'Cảnh báo audit',
    hint: 'Cần rà soát',
    accent: 'bg-[#f21f45]',
    hintClassName: 'text-[#c9354f]',
  },
];

const overviewRows = [
  {
    signal: 'Cấp quyền chờ duyệt',
    module: 'RBAC',
    status: 'Rà soát',
    tone: 'warning',
    level: 'Trung bình',
    action: 'Mở',
  },
  {
    signal: 'Sức chứa tòa C',
    module: 'Phòng ở',
    status: 'Theo dõi',
    tone: 'info',
    level: 'Thấp',
    action: 'Xem',
  },
  {
    signal: 'Quy định xếp phòng đã đổi',
    module: 'Quy định',
    status: 'Hoàn tất',
    tone: 'success',
    level: 'Thông tin',
    action: 'Audit',
  },
  {
    signal: 'Xuất báo cáo trễ',
    module: 'Báo cáo',
    status: 'Mở',
    tone: 'info',
    level: 'Trung bình',
    action: 'Chạy',
  },
  {
    signal: 'Mẫu phí KTX',
    module: 'Cài đặt',
    status: 'Nháp',
    tone: 'draft',
    level: 'Thấp',
    action: 'Sửa',
  },
];

const healthItems = [
  {
    title: 'Truy cập',
    description: 'Chờ cấp quyền và khóa tài khoản.',
    dot: 'bg-[#20a676]',
  },
  {
    title: 'Sức chứa',
    description: 'Sức khỏe tòa/phòng.',
    dot: 'bg-[#20a676]',
  },
  {
    title: 'Quy định',
    description: 'Thay đổi quy định xếp phòng.',
    dot: 'bg-[#e6b84a]',
  },
  {
    title: 'Audit',
    description: 'Hàng việc rà soát thao tác nhạy cảm.',
    dot: 'bg-[#e6b84a]',
  },
  {
    title: 'Cài đặt',
    description: 'Kỳ và mẫu form đã sẵn sàng.',
    dot: 'bg-[#e6b84a]',
  },
];

const statusClassName = {
  warning: 'bg-[#fff4cc] text-[#8a5a00]',
  info: 'bg-[#e9fbfb] text-[#0b7174]',
  success: 'bg-[#e3f6ec] text-[#147a59]',
  draft: 'bg-[#fff1f5] text-[#c9354f]',
};

export function AdminDashboardPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-[35px] text-[#101828]">
            Quản trị / Tổng quan
          </h1>
          <p className="mt-1 text-sm text-[#7a8194]">Phạm vi: QT / Tổng quan</p>
        </div>
        <Button className="h-10 bg-[#a72c3a] px-5 text-sm font-bold text-white hover:bg-[#8f2434]">
          Rà soát cảnh báo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <Card
            key={metric.label}
            className="relative overflow-hidden rounded-lg border border-[#f2b8c8] bg-white py-0 shadow-[0_14px_30px_rgba(122,22,50,0.08)] ring-0"
          >
            <div className={`h-1 w-full ${metric.accent}`} />
            <CardContent className="px-4 py-4">
              <p className="text-[29px] font-bold leading-8 text-[#101828]">{metric.value}</p>
              <p className="mt-1 text-sm font-semibold text-[#7a8194]">{metric.label}</p>
              <p className={`mt-1 text-xs font-bold ${metric.hintClassName}`}>{metric.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <Card className="rounded-lg border border-[#f2b8c8] bg-white py-3 shadow-[0_10px_24px_rgba(122,22,50,0.06)] ring-0">
            <CardContent className="flex flex-col gap-3 px-4 md:flex-row md:items-center">
              <Input
                aria-label="Tìm kiếm tổng quan"
                placeholder="Tìm kiếm tổng quan"
                className="h-10 border-[#f2b8c8] bg-white text-sm placeholder:text-[#9aa1b2] md:max-w-72"
              />
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#7a8194]">
                <span className="rounded-md bg-[#f7f4f8] px-3 py-2">Trạng thái: Tất cả</span>
                <span className="rounded-md bg-[#f7f4f8] px-3 py-2">Kỳ: 2026</span>
              </div>
              <Button className="ml-auto h-10 bg-[#a72c3a] px-5 text-sm font-bold text-white hover:bg-[#8f2434]">
                Rà soát cảnh báo
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-[#f2b8c8] bg-white py-0 shadow-[0_10px_24px_rgba(122,22,50,0.06)] ring-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#f2b8c8] bg-[#fff7fa] hover:bg-[#fff7fa]">
                    <TableHead className="h-11 px-4 text-xs font-bold text-[#7a8194]">
                      Tín hiệu
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold text-[#7a8194]">
                      Phân hệ
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold text-[#7a8194]">
                      Trạng thái
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold text-[#7a8194]">
                      Mức độ
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-bold text-[#7a8194]">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewRows.map((row) => (
                    <TableRow key={row.signal} className="border-[#f2b8c8] hover:bg-[#fff7fa]">
                      <TableCell className="px-4 py-4 text-sm font-bold text-[#32121d]">
                        {row.signal}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm font-medium text-[#8a91a3]">
                        {row.module}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <span
                          className={`inline-flex h-7 min-w-20 items-center justify-center rounded-md px-3 text-xs font-bold ${
                            statusClassName[row.tone as keyof typeof statusClassName]
                          }`}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm font-medium text-[#8a91a3]">
                        {row.level}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm font-medium text-[#7a8194]">
                        {row.action}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-[#f2b8c8] bg-white shadow-[0_10px_24px_rgba(122,22,50,0.06)] ring-0">
            <CardContent className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-[#32121d]">Thao tác tiếp theo</p>
                <p className="mt-1 text-sm text-[#8a91a3]">
                  Tổng quan quản trị gồm quyền, sức chứa, quy định, audit và cài đặt theo rủi ro.
                </p>
              </div>
              <span className="inline-flex h-7 w-fit items-center rounded-md bg-[#e9fbfb] px-3 text-xs font-bold text-[#0b7174]">
                Quản trị
              </span>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg border border-[#f2b8c8] bg-white shadow-[0_14px_30px_rgba(122,22,50,0.08)] ring-0">
          <CardContent className="flex h-full flex-col px-5 py-5">
            <h2 className="text-lg font-bold text-[#32121d]">Sức khỏe quản trị</h2>
            <div className="mt-5 space-y-6">
              {healthItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.dot}`} />
                  <div>
                    <p className="text-sm font-bold text-[#32121d]">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[#8a91a3]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-auto h-10 w-28 border-[#f2b8c8] bg-white text-sm font-bold text-[#c9354f]"
            >
              Mở bảng
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
