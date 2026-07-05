import { Receipt } from 'lucide-react';

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
import { invoices } from '@/mocks/data/dormData';

export function StudentInvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hóa đơn & phí KTX"
        description="Hóa đơn phòng, điện nước và trạng thái thanh toán."
        badges={['US-016', 'US-017']}
        phase2
      />

      <Alert>
        <Receipt className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Tính năng Phase 2</AlertTitle>
        <AlertDescription>
          Thanh toán trực tuyến chưa được kích hoạt trong MVP. Sinh viên vẫn thanh toán trực tiếp
          tại văn phòng KTX; màn hình này chỉ minh họa luồng theo dõi.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Danh sách hóa đơn</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Kỳ</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.period}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.due}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" size="sm" variant="ghost" disabled>
                        Upload biên lai (Phase 2)
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
