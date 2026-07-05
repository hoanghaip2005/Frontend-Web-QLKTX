import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchInvoices, markInvoicePaid, type BillingInvoice } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StaffBillingPage() {
  const { data: invoices, loading, error, reload } = useAsyncData(fetchInvoices);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const markPaid = async (invoice: BillingInvoice) => {
    setActionError(null);
    setSavingCode(invoice.code);
    try {
      await markInvoicePaid(invoice, 'Đối soát thủ công tại quầy KTX');
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không cập nhật được hóa đơn');
    } finally {
      setSavingCode(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đối soát phí"
        description="Theo dõi công nợ, xác nhận thanh toán MoMo và ghi nhận khoản thu tại quầy."
        actions={
          <Button type="button" variant="secondary" onClick={reload}>
            <RefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Làm mới
          </Button>
        }
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Hàng chờ đối soát</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : !invoices?.length ? (
            <EmptyState title="Chưa có hóa đơn" description="Các hóa đơn mới sẽ xuất hiện tại đây." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sinh viên</TableHead>
                    <TableHead>Hóa đơn</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Đã thu</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead>Hạn nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.code}>
                      <TableCell>
                        <div className="font-medium">{invoice.studentName ?? '-'}</div>
                        <div className="text-xs text-slate-500">{invoice.studentCode ?? '-'}</div>
                      </TableCell>
                      <TableCell>{invoice.code}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.paidAmount}</TableCell>
                      <TableCell>{invoice.balance}</TableCell>
                      <TableCell>{invoice.due}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={invoice.status === 'paid' || savingCode === invoice.code}
                          onClick={() => void markPaid(invoice)}
                        >
                          <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                          {invoice.status === 'paid'
                            ? 'Đã xong'
                            : savingCode === invoice.code
                              ? 'Đang lưu...'
                              : 'Xác nhận thu'}
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
    </div>
  );
}
