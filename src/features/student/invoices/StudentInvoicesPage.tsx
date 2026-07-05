import { useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { AlertCircle, CheckCircle2, CreditCard, ExternalLink, Eye, Receipt } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  createMomoPayment,
  fetchInvoices,
  type BillingInvoice,
  type MomoPaymentSession,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

type MomoDialogState = {
  invoice: BillingInvoice;
  payment: MomoPaymentSession;
  qrDataUrl: string;
};

function paymentRecordLabel(record: Record<string, unknown>) {
  const method = String(record.method ?? record.payType ?? record.partnerCode ?? 'Giao dịch');
  const status = String(record.status ?? record.resultCode ?? 'đã ghi nhận');
  const amount =
    typeof record.amount === 'number' ? `${record.amount.toLocaleString('vi-VN')}đ` : null;
  const time = String(record.at ?? record.created_at ?? record.transTime ?? '')
    .slice(0, 19)
    .replace('T', ' ');
  return {
    title: amount ? `${method} - ${amount}` : method,
    meta: [status, time].filter(Boolean).join(' - '),
    note: String(record.note ?? record.message ?? record.orderId ?? ''),
  };
}

function PaymentHistory({ records }: { records: Record<string, unknown>[] }) {
  if (!records.length) {
    return <p className="mt-2 text-sm text-slate-500">Chưa có giao dịch.</p>;
  }
  return (
    <ol className="mt-2 space-y-2">
      {records.map((record, index) => {
        const item = paymentRecordLabel(record);
        return (
          <li key={index} className="rounded-app bg-slate-50 px-3 py-2">
            <p className="font-medium text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500">{item.meta}</p>
            {item.note && <p className="mt-1 text-xs text-slate-600">{item.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}

export function StudentInvoicesPage() {
  const [searchParams] = useSearchParams();
  const { data: invoices, loading, error, reload } = useAsyncData(fetchInvoices);
  const [payingCode, setPayingCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [momoDialog, setMomoDialog] = useState<MomoDialogState | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

  const paymentResult = searchParams.get('payment');

  const payWithMomo = async (invoice: BillingInvoice) => {
    setActionError(null);
    setPayingCode(invoice.code);
    try {
      const payment = await createMomoPayment(invoice);
      const qrPayload = payment.qrCodeUrl ?? payment.deeplink ?? payment.payUrl;
      const qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 280,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      setMomoDialog({ invoice, payment, qrDataUrl });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không tạo được giao dịch MoMo');
    } finally {
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
          <AlertDescription>
            Thanh toán đã ghi nhận. Trạng thái hóa đơn sẽ cập nhật sau khi MoMo xác nhận.
          </AlertDescription>
        </Alert>
      )}
      {paymentResult === 'failed' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>
            Giao dịch chưa hoàn tất. Bạn có thể thử lại hoặc liên hệ văn phòng KTX.
          </AlertDescription>
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
            <EmptyState
              title="Chưa có hóa đơn"
              description="Các khoản phí sẽ hiển thị khi KTX phát hành."
            />
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
                    <TableHead className="text-right">Thao tác</TableHead>
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
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Chi tiết
                          </Button>
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
                                ? 'Đang tạo QR...'
                                : 'MoMo'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4 flex items-start gap-2 rounded-app bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <Receipt className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Giao dịch MoMo UAT dùng cho kiểm thử. Hóa đơn chỉ được chuyển sang đã thanh toán khi
              cổng thanh toán gửi xác nhận hợp lệ.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={momoDialog !== null} onOpenChange={(open) => !open && setMomoDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quét QR MoMo</DialogTitle>
            <DialogDescription>
              Hóa đơn {momoDialog?.invoice.code}. Mở MoMo trên điện thoại rồi quét mã này để thanh
              toán.
            </DialogDescription>
          </DialogHeader>
          {momoDialog && (
            <div className="grid justify-items-center gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <img
                  src={momoDialog.qrDataUrl}
                  alt={`QR MoMo cho hóa đơn ${momoDialog.invoice.code}`}
                  className="h-64 w-64"
                />
              </div>
              <div className="grid gap-1 text-center text-sm">
                <p className="font-medium text-slate-950">{momoDialog.invoice.balance}</p>
                {momoDialog.payment.orderId && (
                  <p className="text-xs text-slate-500">
                    Mã giao dịch: {momoDialog.payment.orderId}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setMomoDialog(null)}>
              Đóng
            </Button>
            {momoDialog && (
              <Button type="button" onClick={() => window.location.assign(momoDialog.payment.payUrl)}>
                <ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Mở trang MoMo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedInvoice !== null} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn {selectedInvoice?.code}</DialogTitle>
            <DialogDescription>Thông tin thanh toán và đối soát từ backend.</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-3 text-sm">
              {[
                ['Kỳ phí', selectedInvoice.period],
                ['Tổng tiền', selectedInvoice.amount],
                ['Đã thu', selectedInvoice.paidAmount],
                ['Còn lại', selectedInvoice.balance],
                ['Hạn nộp', selectedInvoice.due],
                ['Mã backend', selectedInvoice.backendId ?? '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-app bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-900">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-app bg-slate-50 px-3 py-2">
                <span className="text-slate-500">Trạng thái</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="rounded-app border border-slate-200 p-3">
                <p className="text-xs font-medium uppercase text-slate-400">Lịch sử thanh toán</p>
                <PaymentHistory records={selectedInvoice.paymentRecords} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
