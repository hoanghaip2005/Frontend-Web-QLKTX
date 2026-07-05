import { Banknote } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const reconciliationRows = [
  { student: 'Phạm Hoàng Hải', invoice: 'INV-2026-06', amount: '450.000đ', receipt: 'Chưa nộp', status: 'unpaid' },
  { student: 'Trần Thị Thu', invoice: 'INV-2026-06', amount: '432.000đ', receipt: 'BL-0612.jpg', status: 'reviewing' },
  { student: 'Ngô Đức Anh', invoice: 'INV-2026-06', amount: '450.000đ', receipt: 'BL-0610.jpg', status: 'paid' },
];

export function StaffBillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Đối soát phí"
        description="Đối soát biên lai thủ công và theo dõi công nợ."
        phase2
      />

      <Alert>
        <Banknote className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Tính năng Phase 2</AlertTitle>
        <AlertDescription>
          MVP không bao gồm cổng thanh toán. Luồng dưới đây minh họa đối soát biên lai thủ công cho
          giai đoạn pilot.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Hàng chờ đối soát</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Hóa đơn</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Biên lai</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliationRows.map((row) => (
                  <TableRow key={`${row.student}-${row.invoice}`}>
                    <TableCell className="font-medium">{row.student}</TableCell>
                    <TableCell>{row.invoice}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.receipt}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" size="sm" variant="ghost" disabled>
                        Duyệt (Phase 2)
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
