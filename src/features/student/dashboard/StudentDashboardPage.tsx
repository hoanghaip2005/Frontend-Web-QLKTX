import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Bell, FileText, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import {
  fetchNotifications,
  fetchStudentDashboard,
  fetchTickets,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getSession } from '@/config/app';
import { currentStudent } from '@/mocks/data/dormData';

export function StudentDashboardPage() {
  const session = getSession();
  const displayName = session?.name ?? currentStudent.name;
  const displayInfo = session
    ? [session.code, session.email].filter(Boolean).join(' - ')
    : `${currentStudent.id} - ${currentStudent.cohort} ${currentStudent.major}`;
  const { data, loading, error, reload } = useAsyncData(fetchStudentDashboard);
  const { data: tickets } = useAsyncData(fetchTickets);
  const { data: notifications } = useAsyncData(fetchNotifications);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Không tải được dữ liệu dashboard</AlertTitle>
        <AlertDescription className="flex items-center gap-3">
          {error}
          <Button type="button" size="sm" variant="secondary" onClick={() => void reload()}>
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const recentTickets = (tickets ?? []).slice(0, 3);
  const recentNotifications = (notifications ?? []).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${displayName}`}
        description={displayInfo}
        actions={
          <Button asChild>
            <Link to="/student/tickets">
              <Wrench className="h-4 w-4" aria-hidden="true" />
              Báo sửa chữa
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Hồ sơ KTX
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50"><FileText className="h-4 w-4 text-brand-700" aria-hidden="true" /></span>
            </div>
            {data.application ? (
              <>
                <p className="mt-2 text-xl font-semibold text-slate-950">{data.application.id}</p>
                <div className="mt-2">
                  <StatusBadge status={data.application.status} />
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Chưa có hồ sơ. Đăng ký ngay!</p>
            )}
            <Link
              to="/student/application"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700"
            >
              {data.application ? 'Xem trạng thái' : 'Đăng ký ở KTX'}{' '}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Phòng / Giường
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50"><BedDouble className="h-4 w-4 text-brand-700" aria-hidden="true" /></span>
            </div>
            {data.roomLabel ? (
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {data.roomLabel} - {data.bedLabel}
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Chưa được phân phòng</p>
            )}
            <Link
              to="/student/room"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700"
            >
              Chi tiết phòng <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Ticket sửa chữa
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50"><Wrench className="h-4 w-4 text-brand-700" aria-hidden="true" /></span>
            </div>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {data.openTickets} đang mở
            </p>
            <Link
              to="/student/tickets"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700"
            >
              Xem ticket <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Thông báo
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50"><Bell className="h-4 w-4 text-brand-700" aria-hidden="true" /></span>
            </div>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {data.unreadNotifications} chưa đọc
            </p>
            <Link
              to="/student/notifications"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700"
            >
              Hộp thông báo <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Ticket gần đây</h2>
            <p className="mt-1 text-sm text-slate-500">Trạng thái yêu cầu sửa chữa của bạn.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTickets.length === 0 && (
              <p className="text-sm text-slate-500">Chưa có ticket nào.</p>
            )}
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-app border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {ticket.id} - {ticket.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ticket.room} - Hạn {ticket.dueAt}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Thông báo mới</h2>
            <p className="mt-1 text-sm text-slate-500">
              Cập nhật về hồ sơ, phòng ở và ticket của bạn.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotifications.length === 0 && (
              <p className="text-sm text-slate-500">Chưa có thông báo.</p>
            )}
            {recentNotifications.map((item) => (
              <div key={item.id} className="rounded-app border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  {!item.read && (
                    <span className="rounded-4xl bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      Mới
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {item.detail} - {item.at}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
