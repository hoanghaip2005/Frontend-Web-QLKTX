import { useState } from 'react';
import { AlertCircle, Eye, Plus, RefreshCw } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import {
  createStudentRequest,
  fetchStudentRequests,
  type CreateStudentRequestInput,
  type StudentServiceRequest,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

const requestTypes: { value: CreateStudentRequestInput['type']; label: string }[] = [
  { value: 'change_room', label: 'Đổi phòng' },
  { value: 'extend_stay', label: 'Gia hạn lưu trú' },
  { value: 'checkout', label: 'Trả phòng' },
  { value: 'temporary_residence', label: 'Tạm trú' },
  { value: 'late_entry', label: 'Về muộn' },
  { value: 'reflection', label: 'Phản ánh' },
  { value: 'other', label: 'Khác' },
];

export function StudentRequestsPage() {
  const { data: requests, loading, error, reload } = useAsyncData(fetchStudentRequests);
  const [creating, setCreating] = useState(false);
  const [type, setType] = useState<CreateStudentRequestInput['type']>('late_entry');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<StudentServiceRequest | null>(null);

  const submit = async () => {
    if (!reason.trim()) {
      setFormError('Vui lòng nhập nội dung yêu cầu.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await createStudentRequest({ type, reason: reason.trim() });
      setCreating(false);
      setReason('');
      setType('late_entry');
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Không tạo được yêu cầu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yêu cầu sinh viên"
        description="Đổi phòng, gia hạn, về muộn, trả phòng và phản ánh vận hành."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={reload}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Làm mới
            </Button>
            <Button type="button" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tạo yêu cầu
            </Button>
          </div>
        }
      />

      {(error || formError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>{error ?? formError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Yêu cầu của bạn</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : !requests?.length ? (
            <EmptyState
              title="Chưa có yêu cầu"
              description="Tạo yêu cầu mới khi bạn cần đổi phòng, gia hạn lưu trú hoặc báo vấn đề vận hành."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Loại yêu cầu</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.code}>
                      <TableCell className="font-medium">{request.code}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell className="max-w-sm text-slate-600">{request.detail}</TableCell>
                      <TableCell>{request.createdAt}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
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

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu sinh viên</DialogTitle>
            <DialogDescription>
              Yêu cầu sẽ được gửi đến ban quản lý KTX và hiển thị trong hàng chờ xử lý.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Loại yêu cầu
              <Select
                value={type}
                onValueChange={(value) => setType(value as CreateStudentRequestInput['type'])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Nội dung
              <Textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ví dụ: Em cần về muộn 22:30 ngày 08/07 vì lịch thực tập..."
              />
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={saving} onClick={() => void submit()}>
              {saving ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedRequest !== null}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu {selectedRequest?.code}</DialogTitle>
            <DialogDescription>Trạng thái xử lý yêu cầu sinh viên.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-app bg-slate-50 px-3 py-2">
                <span className="text-slate-500">Trạng thái</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
              {[
                ['Loại yêu cầu', selectedRequest.type],
                ['Ngày tạo', selectedRequest.createdAt],
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
                <p className="text-xs font-medium uppercase text-slate-400">Nội dung</p>
                <p className="mt-2 text-slate-700">{selectedRequest.detail}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
