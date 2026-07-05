import { Bell, CheckCheck } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { fetchNotifications, markAllNotificationsRead } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

const kindLabel: Record<string, string> = {
  application: 'Hồ sơ',
  room: 'Phòng ở',
  ticket: 'Sửa chữa',
  fee: 'Phí',
  broadcast: 'Thông báo chung',
};

export function StudentNotificationsPage() {
  const { data, loading, reload } = useAsyncData(fetchNotifications);
  const items = data ?? [];

  const markAllRead = () => {
    void markAllNotificationsRead().then(() => reload());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thông báo"
        description="Cập nhật về hồ sơ, phòng ở, phí và ticket."
        badges={['US-018']}
        actions={
          <Button type="button" variant="secondary" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            Đánh dấu tất cả đã đọc
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="Không có thông báo"
          description="Thông báo về hồ sơ, phòng ở và ticket sẽ hiển thị tại đây."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className={item.read ? 'opacity-70' : ''}>
              <CardContent className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-app bg-brand-50">
                  <Bell className="h-4 w-4 text-brand-700" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <span className="rounded-4xl bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {kindLabel[item.kind]}
                    </span>
                    {!item.read && (
                      <span className="rounded-4xl bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                        Mới
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.at}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
