import { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Clock3,
  History,
  MapPin,
  Plus,
  QrCode,
  RotateCcw,
  UserRound,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  confirmTicket,
  createTicket,
  fetchCurrentRoom,
  fetchTickets,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Ticket } from '@/mocks/data/dormData';

export function StudentTicketsPage() {
  const { data: rows, loading, error, reload } = useAsyncData(fetchTickets);
  const { data: currentRoom } = useAsyncData(fetchCurrentRoom);
  const [creating, setCreating] = useState(false);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [formError, setFormError] = useState<string | null>(null);
  const [reopenTarget, setReopenTarget] = useState<Ticket | null>(null);
  const [reopenReason, setReopenReason] = useState('');
  const [saving, setSaving] = useState(false);

  const myTickets = rows ?? [];

  const run = async (action: () => Promise<void>, onError: (message: string) => void) => {
    setSaving(true);
    try {
      await action();
      await reload();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const submitTicket = () => {
    if (!description.trim()) {
      setFormError('Vui lòng mô tả sự cố trước khi gửi.');
      return;
    }
    setFormError(null);
    void run(async () => {
      await createTicket({
        title: description.slice(0, 60),
        description,
        priority,
      });
      setDescription('');
      setCreating(false);
    }, setFormError);
  };

  const applyConfirm = (ticket: Ticket) =>
    run(() => confirmTicket(ticket, true), setFormError);

  const applyReopen = () => {
    if (!reopenTarget || !reopenReason.trim()) return;
    void run(async () => {
      await confirmTicket(reopenTarget, false, reopenReason);
      setReopenTarget(null);
      setReopenReason('');
    }, setFormError);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo sửa chữa"
        description="Báo sự cố, theo dõi SLA, xác nhận hoặc mở lại."
        badges={['US-011', 'US-013']}
        actions={
          <Button type="button" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tạo ticket mới
          </Button>
        }
      />

      {(error || formError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription>{error ?? formError}</AlertDescription>
        </Alert>
      )}

      {creating && (
        <Card className="max-w-3xl">
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Ticket mới</h2>
            <div className="mt-2 flex items-center gap-2 rounded-app bg-slate-50 p-3 text-sm text-slate-600">
              <QrCode className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Ngữ cảnh: phòng {currentRoom?.roomCode ?? 'chưa nhận phòng'} (quét QR tài sản để gắn đúng thiết bị)
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Phòng / vị trí
                <Input value={currentRoom?.roomCode ?? 'Chưa nhận phòng'} readOnly />
              </label>
              <div className="grid gap-2 text-sm font-medium text-slate-700">
                Mức độ khẩn cấp
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger aria-label="Mức độ khẩn cấp">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Khẩn cấp (SLA 12h)</SelectItem>
                    <SelectItem value="high">Cao (SLA 24h)</SelectItem>
                    <SelectItem value="normal">Bình thường (SLA 48h)</SelectItem>
                    <SelectItem value="low">Thấp (SLA 72h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Mô tả sự cố *
              <Textarea
                placeholder="Mô tả hiện tượng, thời điểm xảy ra..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <div className="rounded-app border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              <Camera className="mb-2 h-5 w-5 text-slate-400" aria-hidden="true" />
              Ảnh minh chứng - kéo thả hoặc chọn tệp JPG/PNG tối đa 5 MB.
            </div>
            <div className="flex gap-2">
              <Button type="button" disabled={saving} onClick={submitTicket}>
                {saving ? 'Đang gửi...' : 'Gửi ticket'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <LoadingState />
      ) : myTickets.length === 0 ? (
        <EmptyState
          title="Chưa có ticket nào"
          description="Khi bạn báo sự cố, ticket sẽ hiển thị tại đây kèm trạng thái SLA."
        />
      ) : (
        <div className="grid gap-4">
          {myTickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-white">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium text-slate-500">
                        {ticket.id}
                      </span>
                      <StatusBadge status={ticket.status} />
                      <StatusBadge status={ticket.priority} />
                      {ticket.overdue && <StatusBadge status="overdue" />}
                    </div>
                    <h2 className="text-base font-semibold leading-6 text-slate-950">
                      {ticket.title}
                    </h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-app bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    Hạn xử lý: {ticket.dueAt}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-start gap-2 rounded-app bg-slate-50 p-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-brand-600" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase text-slate-400">Vị trí</p>
                      <p className="truncate text-sm font-medium text-slate-800">
                        {ticket.room}
                        {ticket.asset ? ` - ${ticket.asset}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-app bg-slate-50 p-3 md:col-span-2">
                    <UserRound className="mt-0.5 h-4 w-4 text-brand-600" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase text-slate-400">Phụ trách</p>
                      <p className="truncate text-sm font-medium text-slate-800">
                        {ticket.assignee ?? 'Chờ phân loại'}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="rounded-app border border-slate-100 bg-white p-3 text-sm leading-6 text-slate-700">
                  {ticket.description}
                </p>
                {ticket.history.length > 0 && (
                  <div className="rounded-app border border-slate-100 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
                      <History className="h-4 w-4" aria-hidden="true" />
                      Lịch sử xử lý
                    </div>
                    <ol className="grid gap-2 sm:grid-cols-2">
                      {ticket.history.map((item, index) => (
                        <li
                          key={`${item.at}-${index}`}
                          className="rounded-app bg-slate-50 px-3 py-2 text-xs text-slate-600"
                        >
                          <span className="font-medium text-slate-800">{item.at}</span>
                          <span className="mx-1 text-slate-300">•</span>
                          {item.event}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {ticket.status === 'resolved' && (
                  <div className="flex flex-wrap gap-2 rounded-app bg-emerald-50 p-3">
                    <p className="w-full text-sm text-emerald-800">
                      Đơn vị bảo trì đã đánh dấu xử lý xong. Bạn xác nhận kết quả?
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      disabled={saving}
                      onClick={() => void applyConfirm(ticket)}
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Xác nhận đã sửa xong
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setReopenTarget(ticket)}
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Chưa được, mở lại
                    </Button>
                  </div>
                )}
                {ticket.status === 'closed' && (
                  <p className="rounded-app bg-slate-50 p-3 text-sm text-slate-600">
                    Ticket đã đóng. Cảm ơn phản hồi của bạn.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={reopenTarget !== null} onOpenChange={(open) => !open && setReopenTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mở lại ticket {reopenTarget?.id}</DialogTitle>
            <DialogDescription>
              Cho biết lý do sự cố chưa được khắc phục. Lý do sẽ gửi tới bộ phận bảo trì và lưu vào
              lịch sử ticket.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: quạt quay được 10 phút rồi dừng lại..."
            value={reopenReason}
            onChange={(event) => setReopenReason(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setReopenTarget(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={!reopenReason.trim() || saving} onClick={applyReopen}>
              {saving ? 'Đang lưu...' : 'Mở lại ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
