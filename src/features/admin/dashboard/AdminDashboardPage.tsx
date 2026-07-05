import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, ClipboardList, ShieldCheck, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchAuditLogs } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { dashboardKpis } from '@/mocks/data/dormData';

const kpiCards = [
  {
    label: 'Tỷ lệ lấp đầy',
    value: `${dashboardKpis.occupancy}%`,
    hint: `${dashboardKpis.availableBeds} giường trống toàn KTX`,
    to: '/admin/buildings-rooms',
    icon: BedDouble,
  },
  {
    label: 'Hồ sơ chờ duyệt',
    value: String(dashboardKpis.pendingApplications),
    hint: 'Mục tiêu: xử lý trong 3 ngày làm việc',
    to: '/admin/reports-audit',
    icon: ClipboardList,
  },
  {
    label: 'Ticket quá hạn',
    value: String(dashboardKpis.overdueTickets),
    hint: `SLA compliance hiện tại ${dashboardKpis.slaCompliance}%`,
    to: '/admin/reports-audit',
    icon: Wrench,
  },
];

const occupancyByBuilding = [
  { building: 'Tòa A (Nam)', percent: 92 },
  { building: 'Tòa B (Nữ)', percent: 88 },
  { building: 'Tòa C (Nam)', percent: 0 },
];

export function AdminDashboardPage() {
  const { data: auditRows } = useAsyncData(fetchAuditLogs);
  const auditEntries = auditRows ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="KPI toàn hệ thống — mỗi chỉ số dẫn tới danh sách liên quan."
        badges={['US-014']}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ...kpiCards,
          {
            label: 'Thao tác nhạy cảm gần đây',
            value: String(auditEntries.length),
            hint: 'Override, từ chối, đổi role, khóa phòng',
            to: '/admin/reports-audit',
            icon: ShieldCheck,
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {kpi.label}
                </p>
                <span className="grid h-8 w-8 place-items-center rounded-app bg-brand-50"><kpi.icon className="h-4 w-4 text-brand-700" aria-hidden="true" /></span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{kpi.value}</p>
              <p className="mt-1 text-sm text-slate-500">{kpi.hint}</p>
              <Link
                to={kpi.to}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700"
              >
                Xem chi tiết <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Lấp đầy theo tòa nhà</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tòa C đang khóa bảo trì nên tỷ lệ bằng 0.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {occupancyByBuilding.map((row) => (
              <div key={row.building}>
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-slate-800">{row.building}</p>
                  <p className="text-slate-500">{row.percent}%</p>
                </div>
                <Progress className="mt-1.5" value={row.percent} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">Audit gần đây</h2>
              <Link to="/admin/reports-audit" className="text-sm font-medium text-brand-700">
                Toàn bộ audit log
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditEntries.slice(0, 4).map((entry) => (
              <div key={entry.at} className="rounded-app border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">
                  {entry.action} - {entry.target}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {entry.actor} - {entry.at}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
