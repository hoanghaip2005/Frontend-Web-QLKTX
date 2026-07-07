import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Bell, FileText, Inbox, Receipt, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import {
  fetchInvoices,
  fetchNotifications,
  fetchStudentDashboard,
  fetchTickets,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getSession } from '@/config/app';

export function StudentDashboardPage() {
  const session = getSession();
  const displayName = session?.name ?? 'Sinh viên';
  const displayInfo = [session?.code, session?.email].filter(Boolean).join(' - ');
  const { data, loading, error, reload } = useAsyncData(fetchStudentDashboard);
  const { data: tickets } = useAsyncData(fetchTickets);
  const { data: notifications } = useAsyncData(fetchNotifications);
  const { data: invoices } = useAsyncData(fetchInvoices);

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
  const unpaidInvoices = (invoices ?? []).filter((invoice) => invoice.status !== 'paid');
  const unpaidInvoiceCount = data.unpaidInvoices || unpaidInvoices.length;
  const quickActions = [
    {
      to: '/student/application',
      label: data.application ? 'Theo dõi hồ sơ' : 'Đăng ký KTX',
      detail: data.application ? data.application.id : 'Nộp hồ sơ ở ký túc xá',
      icon: FileText,
    },
    {
      to: '/student/tickets',
      label: 'Báo sửa chữa',
      detail: 'Gắn phòng, tài sản, SLA',
      icon: Wrench,
    },
    {
      to: '/student/requests',
      label: 'Tạo yêu cầu',
      detail: 'Đổi phòng, về muộn, gia hạn',
      icon: Inbox,
    },
    {
      to: '/student/invoices',
      label: 'Thanh toán phí',
      detail:
        unpaidInvoiceCount > 0 ? `${unpaidInvoiceCount} hóa đơn cần xử lý` : 'Không có nợ phí',
      icon: Receipt,
    },
    {
      to: '/student/room',
      label: 'Phòng hiện tại',
      detail: data.roomLabel ? `${data.roomLabel} - ${data.bedLabel}` : 'Chưa nhận phòng',
      icon: BedDouble,
    },
  ];
  const nextItems = [
    !data.application && {
      to: '/student/application',
      title: 'Nộp hồ sơ đăng ký KTX',
      detail: 'Bắt đầu từ đồng ý dữ liệu và tải minh chứng.',
    },
    data.application?.status === 'suggested' && {
      to: '/student/application',
      title: 'Xác nhận giường được gợi ý',
      detail: 'Giữ chỗ để chuyển sang bước check-in.',
    },
    data.application?.status === 'waiting-checkin' && {
      to: '/student/application',
      title: 'Chuẩn bị check-in',
      detail: 'Đến văn phòng KTX để nhận phòng.',
    },
    unpaidInvoiceCount > 0 && {
      to: '/student/invoices',
      title: 'Thanh toán hóa đơn đến hạn',
      detail: unpaidInvoices[0]?.code
        ? `${unpaidInvoices[0].code} - ${unpaidInvoices[0].balance}`
        : `${unpaidInvoiceCount} hóa đơn chưa thanh toán`,
    },
    data.openTickets > 0 && {
      to: '/student/tickets',
      title: 'Theo dõi ticket sửa chữa',
      detail: `${data.openTickets} ticket đang mở hoặc chờ xác nhận.`,
    },
    data.unreadNotifications > 0 && {
      to: '/student/notifications',
      title: 'Đọc thông báo mới',
      detail: `${data.unreadNotifications} thông báo chưa đọc.`,
    },
  ].filter((item): item is { to: string; title: string; detail: string } => Boolean(item));

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

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Thao tác nhanh</h2>
            <p className="mt-1 text-sm text-slate-500">
              Các việc sinh viên thường dùng trong cổng KTX.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="group flex min-h-24 flex-col justify-between rounded-app border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50 text-brand-700 group-hover:bg-white">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-slate-300 group-hover:text-brand-700"
                        aria-hidden="true"
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-950">
                        {action.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {action.detail}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Cần xử lý</h2>
            <p className="mt-1 text-sm text-slate-500">Việc đang chờ bạn thao tác.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextItems.length === 0 ? (
              <p className="rounded-app bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Chưa có việc cần xử lý ngay.
              </p>
            ) : (
              nextItems.slice(0, 4).map((item) => (
                <Link
                  key={`${item.to}-${item.title}`}
                  to={item.to}
                  className="flex items-start justify-between gap-3 rounded-app border border-slate-200 px-3 py-2 text-sm transition hover:border-brand-300 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span>
                    <span className="block font-medium text-slate-900">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                      {item.detail}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-300"
                    aria-hidden="true"
                  />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Hồ sơ KTX
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50">
                <FileText className="h-4 w-4 text-brand-700" aria-hidden="true" />
              </span>
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
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50">
                <BedDouble className="h-4 w-4 text-brand-700" aria-hidden="true" />
              </span>
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
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50">
                <Wrench className="h-4 w-4 text-brand-700" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-2 text-xl font-semibold text-slate-950">{data.openTickets} đang mở</p>
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
              <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50">
                <Bell className="h-4 w-4 text-brand-700" aria-hidden="true" />
              </span>
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
