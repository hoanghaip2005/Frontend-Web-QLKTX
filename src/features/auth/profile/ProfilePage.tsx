import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { currentStudent } from '@/mocks/data/dormData';

export function ProfilePage() {
  return (
    <main className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Button asChild variant="ghost" className="-ml-2">
          <Link to="/student/dashboard">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Về trang chính
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-brand-600 text-lg text-white">PH</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-950">{currentStudent.name}</h1>
                  <Badge variant="outline">Sinh viên</Badge>
                  <StatusBadge status="active" />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {currentStudent.id} - {currentStudent.cohort} {currentStudent.major}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Email
                <Input value={currentStudent.email} readOnly />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Số điện thoại
                <Input value={currentStudent.phone} readOnly />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Phòng / Giường
                <Input value={`${currentStudent.room} / ${currentStudent.bed}`} readOnly />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Diện ưu tiên
                <Input value={currentStudent.priority} readOnly />
              </label>
            </div>
            <Separator />
            <div className="rounded-app bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
                Quyền truy cập của bạn
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Xem và nộp hồ sơ đăng ký KTX của chính mình.</li>
                <li>Xem phòng/giường được phân và bạn cùng phòng.</li>
                <li>Tạo và theo dõi ticket sửa chữa.</li>
                <li>Không truy cập được dữ liệu của sinh viên khác (RBAC).</li>
              </ul>
            </div>
            <Button type="button" variant="secondary">
              Yêu cầu cập nhật thông tin
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
