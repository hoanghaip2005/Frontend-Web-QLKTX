import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CreditCard, Receipt } from 'lucide-react';
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
import { createMomoPayment, fetchInvoices, type BillingInvoice } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StudentInvoicesPage() {
  const [searchParams] = useSearchParams();
  const { data: invoices, loading, error, reload } = useAsyncData(fetchInvoices);
  const [payingCode, setPayingCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const paymentResult = searchParams.get('payment');

  const payWithMomo = async (invoice: BillingInvoice) => {
    setActionError(null);
    setPayingCode(invoice.code);
    try {
      const { payUrl } = await createMomoPayment(invoice);
      window.location.assign(payUrl);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không tạo được giao dịch MoMo');
      setPayingCode(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hóa đơn & phí KTX"
        description="Theo dõi tiền phòng, điện nước và thanh toán trực tuyến qua MoMo."
      />

      {paymentResult === 'success' && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>Thanh toán đã ghi nhận. Trạng thái hóa đơn sẽ cập nhật sau khi MoMo xác nhận.</AlertDescription>
        </Alert>
      )}
      {paymentResult === 'failed' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>Giao dịch chưa hoàn tất. Bạn có thể thử lại hoặc liên hệ văn phòng KTX.</AlertDescription>
        </Alert>
      )}
      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-950">Danh sách hóa đơn</h2>
          <Button type="button" variant="secondary" size="sm" onClick={reload}>
            Làm mới
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : !invoices?.length ? (
            <EmptyState title="Chưa có hóa đơn" description="Các khoản phí sẽ hiển thị khi KTX phát hành." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Kỳ</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead>Hạn nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thanh toán</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.code}>
                      <TableCell className="font-medium">{invoice.code}</TableCell>
                      <TableCell>{invoice.period}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.balance}</TableCell>
                      <TableCell>{invoice.due}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant={invoice.status === 'paid' ? 'secondary' : 'default'}
                          disabled={invoice.status === 'paid' || payingCode === invoice.code}
                          onClick={() => void payWithMomo(invoice)}
                        >
                          <CreditCard className="mr-1.5 h-4 w-4" aria-hidden="true" />
                          {invoice.status === 'paid'
                            ? 'Đã thanh toán'
                            : payingCode === invoice.code
                              ? 'Đang mở MoMo...'
                              : 'Thanh toán MoMo'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4 flex items-start gap-2 rounded-app bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <Receipt className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Giao dịch MoMo UAT dùng cho kiểm thử. Hóa đơn chỉ được chuyển sang đã thanh toán khi cổng thanh toán gửi xác nhận hợp lệ.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
