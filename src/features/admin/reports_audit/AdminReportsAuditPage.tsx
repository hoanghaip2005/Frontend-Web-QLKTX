import { useState } from 'react';
import { Download, Search, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAuditLogs } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { dashboardKpis } from '@/mocks/data/dormData';

const reportRows = [
  { name: 'Báo cáo lấp đầy theo tòa', scope: 'Occupancy, giường trống', status: 'Xem trong dashboard' },
  { name: 'Báo cáo SLA sửa chữa', scope: `SLA compliance ${dashboardKpis.slaCompliance}%`, status: 'Xem trong SLA board' },
  { name: 'Xuất PDF/Excel', scope: 'Báo cáo tổng hợp', status: 'Sẵn sàng cấu hình' },
];

export function AdminReportsAuditPage() {
  const { data: auditRows, loading } = useAsyncData(fetchAuditLogs);
  const [query, setQuery] = useState('');

  const filtered = (auditRows ?? []).filter(
    (entry) =>
      entry.actor.toLowerCase().includes(query.toLowerCase()) ||
      entry.action.toLowerCase().includes(query.toLowerCase()) ||
      entry.target.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo & Audit"
        description="Lịch sử thao tác nhạy cảm và danh mục báo cáo."
        badges={['US-020', 'US-021']}
      />

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-4 space-y-4">
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
              {loading ? (
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((entry) => (
                        <TableRow key={entry.at}>
                          <TableCell className="whitespace-nowrap">{entry.at}</TableCell>
                          <TableCell className="font-mono text-xs">{entry.actor}</TableCell>
                          <TableCell className="font-medium">{entry.action}</TableCell>
                          <TableCell>{entry.target}</TableCell>
                          <TableCell className="max-w-sm text-sm text-slate-600">
                            {entry.reason}
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

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-950">Danh mục báo cáo</h2>
              <p className="mt-1 text-sm text-slate-500">
                Xuất báo cáo cần quyền quản trị và được ghi lại trong audit log.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Báo cáo</TableHead>
                      <TableHead>Phạm vi</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportRows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.scope}</TableCell>
                        <TableCell className="text-sm text-slate-600">{row.status}</TableCell>
                        <TableCell className="text-right">
                          <Button type="button" size="sm" variant="ghost" disabled>
                            <Download className="h-4 w-4" aria-hidden="true" />
                            Xuất
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
