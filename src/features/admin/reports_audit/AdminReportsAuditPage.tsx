import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  fetchAdminBillingReport,
  fetchAdminMaintenanceReport,
  fetchAdminReportKpi,
  fetchAuditLogs,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { AuditEntry } from '@/mocks/data/dormData';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const reportPeriods = [
  { value: 'hk1-2026', label: 'HK1 2026-2027' },
  { value: 'month', label: 'Tháng hiện tại' },
  { value: 'rolling-30', label: '30 ngày gần nhất' },
] as const;

function csvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function downloadCsv(filename: string, rows: unknown[][]) {
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function formatMinutes(minutes: number | null | undefined) {
  if (!minutes) return '-';
  if (minutes < 60) return `${Math.round(minutes)} phút`;
  return `${Math.round(minutes / 60)} giờ`;
}

function percent(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

type DrillKey = 'occupancy' | 'applications' | 'maintenance' | 'billing';

export function AdminReportsAuditPage() {
  const navigate = useNavigate();
  const [drill, setDrill] = useState<DrillKey | null>(null);
  const {
    data: auditRows,
    loading: auditLoading,
    error: auditError,
  } = useAsyncData(fetchAuditLogs);
  const { data: kpi, loading: kpiLoading, error: kpiError } = useAsyncData(fetchAdminReportKpi);
  const {
    data: billing,
    loading: billingLoading,
    error: billingError,
  } = useAsyncData(fetchAdminBillingReport);
  const {
    data: maintenance,
    loading: maintenanceLoading,
    error: maintenanceError,
  } = useAsyncData(fetchAdminMaintenanceReport);
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState<(typeof reportPeriods)[number]['value']>('hk1-2026');
  const [selectedAudit, setSelectedAudit] = useState<AuditEntry | null>(null);

  const reportPeriodLabel = reportPeriods.find((item) => item.value === period)?.label ?? period;
  const reportLoading = kpiLoading || billingLoading || maintenanceLoading;
  const reportError = kpiError ?? billingError ?? maintenanceError;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (auditRows ?? []).filter(
      (entry) =>
        !normalized ||
        entry.actor.toLowerCase().includes(normalized) ||
        entry.action.toLowerCase().includes(normalized) ||
        entry.target.toLowerCase().includes(normalized) ||
        entry.reason.toLowerCase().includes(normalized),
    );
  }, [auditRows, query]);

  const summaryRows = useMemo(() => {
    if (!kpi || !billing || !maintenance) return [];
    return [
      {
        name: 'Công suất phòng',
        owner: 'Quản lý phòng',
        primary: `${kpi.occupancy.occupancyRate}%`,
        detail: `${kpi.occupancy.bedsOccupied}/${kpi.occupancy.bedsTotal} giường đang sử dụng`,
        risk:
          kpi.occupancy.occupancyRate >= 95
            ? 'Cần mở thêm phòng hoặc rà soát checkout'
            : 'Còn khả năng tiếp nhận',
      },
      {
        name: 'Hồ sơ đăng ký',
        owner: 'Tuyển sinh KTX',
        primary: `${kpi.applications.pending} chờ xử lý`,
        detail: `${kpi.applications.approved} đã duyệt, ${kpi.applications.checkedIn} đã check-in`,
        risk: kpi.applications.pending > 10 ? 'Cần tăng ca duyệt hồ sơ' : 'Đang kiểm soát',
      },
      {
        name: 'SLA bảo trì',
        owner: 'Tổ vận hành',
        primary: `${maintenance.sla.overdue} quá hạn`,
        detail: `${maintenance.sla.open} ticket mở, TB xử lý ${formatMinutes(maintenance.sla.avgResolutionMinutes)}`,
        risk:
          maintenance.sla.overdue > 0 ? 'Ưu tiên xử lý ticket quá hạn' : 'Không có ticket quá hạn',
      },
      {
        name: 'Công nợ',
        owner: 'Kế toán KTX',
        primary: formatMoney(billing.totals.outstanding),
        detail: `${kpi.billing.unpaidInvoices} hóa đơn còn nợ`,
        risk: billing.totals.outstanding > 0 ? 'Cần nhắc thanh toán/đối soát' : 'Không còn công nợ',
      },
    ];
  }, [billing, kpi, maintenance]);

  const exportAudit = () => {
    downloadCsv('qlktx-audit-log.csv', [
      ['Thời điểm', 'Người thao tác', 'Hành động', 'Đối tượng', 'Lý do'],
      ...filtered.map((entry) => [entry.at, entry.actor, entry.action, entry.target, entry.reason]),
    ]);
  };

  const exportSummary = () => {
    downloadCsv(`qlktx-report-${period}.csv`, [
      ['Kỳ báo cáo', reportPeriodLabel],
      [],
      ['Báo cáo', 'Đơn vị phụ trách', 'Chỉ số chính', 'Chi tiết', 'Khuyến nghị'],
      ...summaryRows.map((row) => [row.name, row.owner, row.primary, row.detail, row.risk]),
      [],
      ['Tháng', 'Đã lập hóa đơn', 'Đã thu'],
      ...(billing?.monthly ?? []).map((row) => [
        row.month,
        formatMoney(row.billed),
        formatMoney(row.collected),
      ]),
      [],
      ['Nhóm bảo trì', 'Số ticket'],
      ...(maintenance?.byCategory ?? []).map((row) => [row.category, row.count]),
    ]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo & Audit"
        description="Theo dõi công suất, hồ sơ, SLA bảo trì, công nợ và lịch sử thao tác nhạy cảm."
        badges={['US-020', 'US-021']}
      />

      {(auditError || reportError) && (
        <Alert variant="destructive">
          <AlertTitle>Không tải được báo cáo</AlertTitle>
          <AlertDescription>{auditError ?? reportError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4 space-y-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={period}
                onValueChange={(value) =>
                  setPeriod(value as (typeof reportPeriods)[number]['value'])
                }
              >
                <SelectTrigger className="w-full sm:w-48" aria-label="Kỳ báo cáo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportPeriods.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={exportSummary}
              disabled={summaryRows.length === 0}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Xuất tổng hợp CSV
            </Button>
          </div>

          {reportLoading ? (
            <LoadingState />
          ) : !kpi || !billing || !maintenance ? (
            <EmptyState
              title="Chưa có dữ liệu báo cáo"
              description="Chạy seed hoặc kiểm tra quyền tài khoản quản trị."
            />
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => setDrill('occupancy')}
                  onKeyDown={(event) => event.key === 'Enter' && setDrill('occupancy')}
                  className="cursor-pointer transition hover:shadow-md hover:ring-1 hover:ring-brand-300"
                >
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Lấp đầy
                      </p>
                      <BedDouble className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {kpi.occupancy.occupancyRate}%
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {kpi.occupancy.bedsOccupied}/{kpi.occupancy.bedsTotal} giường
                    </p>
                    <Progress className="mt-3" value={kpi.occupancy.occupancyRate} />
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                      Xem chi tiết <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </p>
                  </CardContent>
                </Card>
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => setDrill('applications')}
                  onKeyDown={(event) => event.key === 'Enter' && setDrill('applications')}
                  className="cursor-pointer transition hover:shadow-md hover:ring-1 hover:ring-brand-300"
                >
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Hồ sơ chờ xử lý
                      </p>
                      <ClipboardList className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {kpi.applications.pending}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {kpi.applications.total} hồ sơ trong kỳ
                    </p>
                    <Progress
                      className="mt-3"
                      value={percent(kpi.applications.pending, kpi.applications.total)}
                    />
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                      Xem chi tiết <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </p>
                  </CardContent>
                </Card>
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => setDrill('maintenance')}
                  onKeyDown={(event) => event.key === 'Enter' && setDrill('maintenance')}
                  className="cursor-pointer transition hover:shadow-md hover:ring-1 hover:ring-brand-300"
                >
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Ticket quá hạn
                      </p>
                      <Wrench className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {maintenance.sla.overdue}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{maintenance.sla.open} ticket mở</p>
                    <Progress
                      className="mt-3"
                      value={percent(maintenance.sla.overdue, maintenance.sla.open)}
                    />
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                      Xem chi tiết <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </p>
                  </CardContent>
                </Card>
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => setDrill('billing')}
                  onKeyDown={(event) => event.key === 'Enter' && setDrill('billing')}
                  className="cursor-pointer transition hover:shadow-md hover:ring-1 hover:ring-brand-300"
                >
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Công nợ
                      </p>
                      <CreditCard className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {formatMoney(billing.totals.outstanding)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {kpi.billing.unpaidInvoices} hóa đơn chưa tất toán
                    </p>
                    <Progress
                      className="mt-3"
                      value={percent(billing.totals.outstanding, billing.totals.billed)}
                    />
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                      Xem chi tiết <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-slate-950">Tổng hợp vận hành</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Các chỉ số cần theo dõi trong {reportPeriodLabel}.
                      </p>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={exportSummary}>
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Xuất bảng này
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Báo cáo</TableHead>
                          <TableHead>Đơn vị phụ trách</TableHead>
                          <TableHead>Chỉ số chính</TableHead>
                          <TableHead>Chi tiết</TableHead>
                          <TableHead>Khuyến nghị</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryRows.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>{row.owner}</TableCell>
                            <TableCell className="font-semibold text-slate-950">
                              {row.primary}
                            </TableCell>
                            <TableCell>{row.detail}</TableCell>
                            <TableCell className="max-w-sm text-sm text-slate-600">
                              {row.risk}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-slate-950">Dòng tiền theo tháng</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      So sánh số đã lập hóa đơn và số đã thu.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tháng</TableHead>
                            <TableHead>Đã lập hóa đơn</TableHead>
                            <TableHead>Đã thu</TableHead>
                            <TableHead>Tỷ lệ thu</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billing.monthly.map((row) => (
                            <TableRow key={row.month}>
                              <TableCell className="font-medium">{row.month}</TableCell>
                              <TableCell>{formatMoney(row.billed)}</TableCell>
                              <TableCell>{formatMoney(row.collected)}</TableCell>
                              <TableCell>
                                <div className="flex min-w-32 items-center gap-2">
                                  <Progress value={percent(row.collected, row.billed)} />
                                  <span className="w-10 text-right text-xs text-slate-500">
                                    {percent(row.collected, row.billed)}%
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-slate-950">
                      Thanh toán theo trạng thái
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Dùng để rà soát hóa đơn cần nhắc hoặc đối soát.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Số hóa đơn</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billing.byStatus.map((row) => (
                            <TableRow key={row.paymentStatus}>
                              <TableCell>
                                <StatusBadge status={row.paymentStatus} />
                              </TableCell>
                              <TableCell>{row.count}</TableCell>
                              <TableCell>{formatMoney(row.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-slate-950">Bảo trì theo nhóm</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Nhóm phát sinh nhiều ticket để ưu tiên nhân lực.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {maintenance.byCategory.map((row) => (
                        <div
                          key={row.category}
                          className="grid gap-2 rounded-app border border-slate-200 px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-slate-900">{row.category}</p>
                            <p className="text-sm text-slate-600">{row.count} ticket</p>
                          </div>
                          <Progress
                            value={percent(
                              row.count,
                              maintenance.byCategory.reduce((sum, item) => sum + item.count, 0),
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-slate-950">
                      Bảo trì theo trạng thái
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Kiểm tra luồng tiếp nhận, phân công, xử lý và đóng ticket.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Số ticket</TableHead>
                            <TableHead>Tỷ trọng</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {maintenance.byStatus.map((row) => {
                            const total = maintenance.byStatus.reduce(
                              (sum, item) => sum + item.count,
                              0,
                            );
                            return (
                              <TableRow key={row.status}>
                                <TableCell>
                                  <StatusBadge status={row.status} />
                                </TableCell>
                                <TableCell>{row.count}</TableCell>
                                <TableCell>
                                  <div className="flex min-w-32 items-center gap-2">
                                    <Progress value={percent(row.count, total)} />
                                    <span className="w-10 text-right text-xs text-slate-500">
                                      {percent(row.count, total)}%
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="audit" className="mt-4 space-y-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <Input
                className="pl-9"
                placeholder="Lọc theo người thao tác, hành động, đối tượng..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Lọc audit log"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={exportAudit}
              disabled={filtered.length === 0}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Xuất audit CSV
            </Button>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950">
                  Thao tác nhạy cảm ({filtered.length})
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <LoadingState />
              ) : filtered.length === 0 ? (
                <EmptyState
                  title="Không có bản ghi khớp bộ lọc"
                  description="Thử từ khóa khác, ví dụ tên staff hoặc mã hồ sơ."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời điểm</TableHead>
                        <TableHead>Người thao tác</TableHead>
                        <TableHead>Hành động</TableHead>
                        <TableHead>Đối tượng</TableHead>
                        <TableHead>Lý do</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((entry) => (
                        <TableRow key={`${entry.at}-${entry.action}-${entry.target}`}>
                          <TableCell className="whitespace-nowrap">{entry.at}</TableCell>
                          <TableCell className="font-mono text-xs">{entry.actor}</TableCell>
                          <TableCell className="font-medium">{entry.action}</TableCell>
                          <TableCell>{entry.target}</TableCell>
                          <TableCell className="max-w-sm text-sm text-slate-600">
                            {entry.reason}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedAudit(entry)}
                            >
                              <Eye className="h-4 w-4" aria-hidden="true" />
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={selectedAudit !== null}
        onOpenChange={(open) => !open && setSelectedAudit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAudit?.action}</DialogTitle>
            <DialogDescription>Chi tiết bản ghi audit.</DialogDescription>
          </DialogHeader>
          {selectedAudit && (
            <div className="grid gap-3 text-sm">
              {[
                ['Thời điểm', selectedAudit.at],
                ['Người thao tác', selectedAudit.actor],
                ['Đối tượng', selectedAudit.target],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 rounded-app bg-slate-50 px-3 py-2"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-900">{value}</span>
                </div>
              ))}
              <div className="rounded-app border border-slate-200 p-3">
                <p className="text-xs font-medium uppercase text-slate-400">Lý do / metadata</p>
                <p className="mt-2 text-slate-700">{selectedAudit.reason}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={drill !== null} onOpenChange={(open) => !open && setDrill(null)}>
        <DialogContent>
          {drill === 'occupancy' && kpi && (
            <>
              <DialogHeader>
                <DialogTitle>Công suất phòng</DialogTitle>
                <DialogDescription>Chi tiết lấp đầy giường và phòng.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm">
                <DrillRow label="Tỷ lệ lấp đầy" value={`${kpi.occupancy.occupancyRate}%`} />
                <DrillRow
                  label="Giường đang dùng"
                  value={`${kpi.occupancy.bedsOccupied}/${kpi.occupancy.bedsTotal}`}
                />
                <DrillRow
                  label="Phòng đầy / tổng"
                  value={`${kpi.occupancy.roomsFull}/${kpi.occupancy.roomsTotal}`}
                />
              </div>
              <Button
                type="button"
                className="mt-2"
                onClick={() => navigate('/admin/buildings-rooms')}
              >
                Xem tòa & phòng <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}

          {drill === 'applications' && kpi && (
            <>
              <DialogHeader>
                <DialogTitle>Hồ sơ đăng ký</DialogTitle>
                <DialogDescription>Phân bố trạng thái hồ sơ trong kỳ.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm">
                <DrillRow label="Chờ xử lý" value={String(kpi.applications.pending)} />
                <DrillRow label="Đã duyệt" value={String(kpi.applications.approved)} />
                <DrillRow label="Đã check-in" value={String(kpi.applications.checkedIn)} />
                <DrillRow label="Từ chối" value={String(kpi.applications.rejected)} />
                <DrillRow label="Tổng hồ sơ" value={String(kpi.applications.total)} />
              </div>
              <Button type="button" className="mt-2" onClick={() => navigate('/staff/applications')}>
                Xem hàng chờ duyệt <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}

          {drill === 'maintenance' && maintenance && (
            <>
              <DialogHeader>
                <DialogTitle>Bảo trì & SLA</DialogTitle>
                <DialogDescription>Ticket theo trạng thái và mức quá hạn.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm">
                <DrillRow label="Ticket mở" value={String(maintenance.sla.open)} />
                <DrillRow label="Quá hạn SLA" value={String(maintenance.sla.overdue)} />
                <DrillRow
                  label="TB xử lý"
                  value={formatMinutes(maintenance.sla.avgResolutionMinutes)}
                />
                {maintenance.byStatus.map((row) => (
                  <DrillRow key={row.status} label={row.status} value={`${row.count} ticket`} />
                ))}
              </div>
              <Button type="button" className="mt-2" onClick={() => navigate('/staff/maintenance')}>
                Xem SLA board <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}

          {drill === 'billing' && billing && (
            <>
              <DialogHeader>
                <DialogTitle>Công nợ & thanh toán</DialogTitle>
                <DialogDescription>Tổng quan dòng tiền và trạng thái hóa đơn.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm">
                <DrillRow label="Đã lập hóa đơn" value={formatMoney(billing.totals.billed)} />
                <DrillRow label="Đã thu" value={formatMoney(billing.totals.collected)} />
                <DrillRow label="Còn nợ" value={formatMoney(billing.totals.outstanding)} />
                {billing.byStatus.map((row) => (
                  <DrillRow
                    key={row.paymentStatus}
                    label={row.paymentStatus}
                    value={`${row.count} hóa đơn · ${formatMoney(row.amount)}`}
                  />
                ))}
              </div>
              <Button type="button" className="mt-2" onClick={() => navigate('/staff/billing')}>
                Xem đối soát phí <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DrillRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-app bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}
