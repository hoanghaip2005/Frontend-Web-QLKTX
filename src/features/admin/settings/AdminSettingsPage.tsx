import { useState } from 'react';
import { CalendarRange, Save, ShieldAlert } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  { name: 'Đồng bộ SIS', status: 'Chưa bật', tone: 'bg-slate-100 text-slate-600' },
  { name: 'Cổng thanh toán MoMo', status: 'UAT', tone: 'bg-sky-100 text-sky-800' },
  { name: 'Import Excel', status: 'Sẵn sàng cấu hình', tone: 'bg-emerald-100 text-emerald-800' },
];

type SettingsForm = {
  semester: string;
  registrationOpen: string;
  registrationClose: string;
  normalSlaHours: string;
};

const initialSettings: SettingsForm = {
  semester: '2026-1',
  registrationOpen: '2026-06-25',
  registrationClose: '2026-08-15',
  normalSlaHours: '48',
};

export function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const patch = (value: Partial<SettingsForm>) => {
    setForm((current) => ({ ...current, ...value }));
    setSavedAt(null);
    setError(null);
  };

  const saveSettings = () => {
    if (form.registrationOpen > form.registrationClose) {
      setError('Ngày mở đăng ký phải trước ngày đóng đăng ký.');
      return;
    }
    localStorage.setItem('qlktx-admin-settings', JSON.stringify(form));
    setSavedAt(new Date().toLocaleString('vi-VN'));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt hệ thống"
        description="Học kỳ, đợt đăng ký, SLA mặc định và trạng thái tích hợp vận hành."
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Không lưu được cấu hình</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {savedAt && (
        <Alert>
          <AlertTitle>Đã lưu cấu hình</AlertTitle>
          <AlertDescription>Cập nhật gần nhất lúc {savedAt}.</AlertDescription>
        </Alert>
      )}

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
              <Select value={form.semester} onValueChange={(semester) => patch({ semester })}>
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
                <Input
                  type="date"
                  value={form.registrationOpen}
                  onChange={(event) => patch({ registrationOpen: event.target.value })}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Đóng đăng ký
                <Input
                  type="date"
                  value={form.registrationClose}
                  onChange={(event) => patch({ registrationClose: event.target.value })}
                />
              </label>
            </div>
            <Separator />
            <div className="grid gap-2 text-sm font-medium text-slate-700">
              SLA mặc định cho ticket Normal
              <Select
                value={form.normalSlaHours}
                onValueChange={(normalSlaHours) => patch({ normalSlaHours })}
              >
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
            <Button type="button" onClick={saveSettings}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Lưu cấu hình
            </Button>
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
                  <Badge variant="secondary" className={item.tone}>
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
