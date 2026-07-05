import { CalendarRange, ShieldAlert } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const integrations = [
  { name: 'Đồng bộ SIS', status: 'Chờ cấu hình' },
  { name: 'Cổng thanh toán MoMo', status: 'UAT' },
  { name: 'Import Excel', status: 'Chờ cấu hình' },
];

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt hệ thống"
        description="Học kỳ, SLA mặc định và trạng thái tích hợp vận hành."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Học kỳ & đợt đăng ký</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm font-medium text-slate-700">
              Học kỳ hiện hành
              <Select defaultValue="2026-1">
                <SelectTrigger aria-label="Học kỳ hiện hành">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026-1">Học kỳ 1, 2026-2027</SelectItem>
                  <SelectItem value="2025-2">Học kỳ 2, 2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Mở đăng ký từ
                <Input type="date" defaultValue="2026-06-25" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Đóng đăng ký
                <Input type="date" defaultValue="2026-08-15" />
              </label>
            </div>
            <Separator />
            <div className="grid gap-2 text-sm font-medium text-slate-700">
              SLA mặc định cho ticket Normal
              <Select defaultValue="48">
                <SelectTrigger aria-label="SLA mặc định">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 giờ</SelectItem>
                  <SelectItem value="48">48 giờ</SelectItem>
                  <SelectItem value="72">72 giờ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button">Lưu cấu hình</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Tích hợp</h2>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {integrations.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-app border border-slate-200 p-3"
                >
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {item.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
