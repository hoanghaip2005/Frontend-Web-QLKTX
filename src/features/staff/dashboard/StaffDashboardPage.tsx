import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BedDouble, ClipboardList, LogIn, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import {
  fetchApplications,
  fetchStaffDashboard,
  fetchTickets,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StaffDashboardPage() {
  const { data: kpi, loading, error, reload } = useAsyncData(fetchStaffDashboard);
  const { data: applications } = useAsyncData(fetchApplications);
  const { data: tickets } = useAsyncData(fetchTickets);

  if (loading) return <LoadingState />;
  if (error || !kpi) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Không tải được dashboard</AlertTitle>
        <AlertDescription className="flex items-center gap-3">
          {error}
          <Button type="button" size="sm" variant="secondary" onClick={() => void reload()}>
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const pendingApps = (applications ?? []).filter(
    (app) => app.status === 'pending' || app.status === 'reviewing',
  );
  const waitingCheckin = (applications ?? []).filter(
    (app) => app.status === 'waiting-checkin' || app.status === 'suggested',
  );
  const riskTickets = (tickets ?? []).filter(
    (ticket) => ticket.overdue || ticket.status === 'new' || ticket.status === 'reopened',
  );

  const kpiCards = [
    {
      label: 'Hồ sơ chờ duyệt',
      value: String(kpi.pendingApplications),
      hint: `${pendingApps.length} hồ sơ trong hàng chờ hiển thị`,
      to: '/staff/applications',
      icon: ClipboardList,
    },
    {
      label: 'Ticket đang mở',
      value: String(kpi.openTickets),
      hint: `${kpi.urgentTickets} ticket khẩn cấp`,
      to: '/staff/maintenance',
      icon: AlertTriangle,
    },
    {
      label: 'Giường',
      value: `${kpi.bedsOccupied}/${kpi.bedsTotal}`,
      hint: `Tỷ lệ lấp đầy ${kpi.bedsTotal ? Math.round((kpi.bedsOccupied / kpi.bedsTotal) * 100) : 0}%`,
      to: '/staff/allocation',
      icon: BedDouble,
    },
    {
      label: 'Chờ check-in',
      value: String(waitingCheckin.length),
      hint: 'Sinh viên đã được phân giường',
      to: '/staff/checkin-checkout',
      icon: LogIn,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng điều hành KTX"
        description="Mỗi KPI dẫn thẳng tới danh sách cần xử lý."
        badges={['US-014']}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.label}>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50"><card.icon className="h-4 w-4 text-brand-700" aria-hidden="true" /></span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.hint}</p>
              <Link
                to={card.to}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700"
              >
                Xử lý ngay <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">Hồ sơ cần duyệt</h2>
              <Link to="/staff/applications" className="text-sm font-medium text-brand-700">
                Tất cả
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApps.length === 0 && (
              <p className="text-sm text-slate-500">Không còn hồ sơ chờ duyệt.</p>
            )}
            {pendingApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-app border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {app.id} - {app.studentName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Ưu tiên: {app.priority} - Nộp {app.submittedAt}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">Ticket rủi ro SLA</h2>
              <Link to="/staff/maintenance" className="text-sm font-medium text-brand-700">
                SLA board
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskTickets.length === 0 && (
              <p className="text-sm text-slate-500">Không có ticket rủi ro.</p>
            )}
            {riskTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-app border border-slate-200 p-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Wrench className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {ticket.id} - {ticket.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {ticket.room} - Hạn {ticket.dueAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {ticket.overdue && <StatusBadge status="overdue" />}
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
