import { AlertCircle, CheckCircle2, Eye, RefreshCw } from 'lucide-react';
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
import { fetchInvoices, markInvoicePaid, type BillingInvoice } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

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

export function StaffBillingPage() {
  const { data: invoices, loading, error, reload } = useAsyncData(fetchInvoices);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedInvoice !== null} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn {selectedInvoice?.code}</DialogTitle>
            <DialogDescription>Thông tin sinh viên, số tiền và lịch sử đối soát.</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-3 text-sm">
              {[
                ['Sinh viên', selectedInvoice.studentName ?? '-'],
                ['MSSV', selectedInvoice.studentCode ?? '-'],
                ['Kỳ phí', selectedInvoice.period],
                ['Tổng tiền', selectedInvoice.amount],
                ['Đã thu', selectedInvoice.paidAmount],
                ['Còn lại', selectedInvoice.balance],
                ['Hạn nộp', selectedInvoice.due],
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
