import { useState } from 'react';
import { CheckCircle2, UserCog } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  assignTicket,
  fetchStaffAssignees,
  fetchTickets,
  setTicketResolved,
} from '@/lib/api/repositories';
import { formatStatusLabel } from '@/lib/formatters/status';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Ticket, TicketPriority } from '@/mocks/data/dormData';

const slaByPriority: Record<TicketPriority, string> = {
  urgent: '12 giờ',
  high: '24 giờ',
  normal: '48 giờ',
  low: '72 giờ',
};

export function StaffMaintenancePage() {
  const { data: rows, loading, error, reload } = useAsyncData(fetchTickets);
  const { data: assignees } = useAsyncData(fetchStaffAssignees);
  const [assigning, setAssigning] = useState<Ticket | null>(null);
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [resolving, setResolving] = useState<Ticket | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const tickets = rows ?? [];
  const columns: { key: string; title: string; filter: (ticket: Ticket) => boolean }[] = [
    { key: 'new', title: 'Mới / Chờ phân loại', filter: (t) => t.status === 'new' },
    {
      key: 'active',
      title: 'Đang xử lý',
      filter: (t) => t.status === 'assigned' || t.status === 'in-progress',
    },
    { key: 'reopened', title: 'Bị mở lại', filter: (t) => t.status === 'reopened' },
    {
      key: 'done',
      title: 'Chờ xác nhận / Đóng',
      filter: (t) => t.status === 'resolved' || t.status === 'closed',
    },
  ];

  const run = async (action: () => Promise<void>) => {
    setSaving(true);
    setActionError(null);
    try {
      await action();
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const applyAssign = () =>
    run(async () => {
      if (!assigning || !assigneeId) return;
      const assignee = (assignees ?? []).find((item) => item.id === assigneeId);
      await assignTicket(assigning, {
        assigneeId,
        assigneeName: assignee?.name ?? assigneeId,
        priority,
      });
      setAssigning(null);
      setAssigneeId('');
      setPriority('normal');
    });

  const applyResolve = () =>
    run(async () => {
      if (!resolving || !resolveNote.trim()) return;
      await setTicketResolved(resolving, resolveNote);
      setResolving(null);
      setResolveNote('');
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sửa chữa & SLA board"
        description="Phân loại, gán người xử lý và theo dõi SLA."
        badges={['US-012', 'US-013']}
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription className="flex items-center gap-3">
            {error ?? actionError}
            <Button type="button" size="sm" variant="secondary" onClick={() => void reload()}>
              Tải lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">SLA board</TabsTrigger>
            <TabsTrigger value="table">Danh sách chi tiết</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {columns.map((column) => {
                const items = tickets.filter(column.filter);
                return (
                  <div key={column.key} className="rounded-app bg-slate-100/60 p-3">
                    <p className="px-1 text-sm font-semibold text-slate-700">
                      {column.title} ({items.length})
                    </p>
                    <div className="mt-3 space-y-3">
                      {items.map((ticket) => (
                        <Card key={ticket.id}>
                          <CardContent className="space-y-2 p-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="text-sm font-semibold text-slate-950">{ticket.id}</p>
                              <StatusBadge status={ticket.priority} />
                              {ticket.overdue && <StatusBadge status="overdue" />}
                            </div>
                            <p className="text-sm text-slate-700">{ticket.title}</p>
                            <p className="text-xs text-slate-500">
                              {ticket.room} - Hạn {ticket.dueAt}
                            </p>
                            <p className="text-xs text-slate-500">
                              {ticket.assignee ?? 'Chưa gán người xử lý'}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {(ticket.status === 'new' || ticket.status === 'reopened') && (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    setAssigning(ticket);
                                    setPriority(ticket.priority);
                                  }}
                                >
                                  <UserCog className="h-4 w-4" aria-hidden="true" />
                                  {ticket.status === 'reopened' ? 'Gán lại' : 'Phân loại & gán'}
                                </Button>
                              )}
                              {(ticket.status === 'assigned' ||
                                ticket.status === 'in-progress') && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setResolving(ticket)}
                                >
                                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                  Đánh dấu đã xử lý
                                </Button>
                              )}
                              {ticket.status === 'resolved' && (
                                <p className="text-xs text-slate-500">Chờ sinh viên xác nhận</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Phòng</TableHead>
                        <TableHead>Người báo</TableHead>
                        <TableHead>Ưu tiên</TableHead>
                        <TableHead>Phụ trách</TableHead>
                        <TableHead>Hạn SLA</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <p className="font-medium">{ticket.id}</p>
                            <p className="text-xs text-slate-500">{ticket.title}</p>
                          </TableCell>
                          <TableCell>{ticket.room}</TableCell>
                          <TableCell>{ticket.reporter}</TableCell>
                          <TableCell>
                            <StatusBadge status={ticket.priority} />
                          </TableCell>
                          <TableCell>{ticket.assignee ?? '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {ticket.dueAt}
                              {ticket.overdue && <StatusBadge status="overdue" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={ticket.status} />
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
      )}

      <Dialog open={assigning !== null} onOpenChange={(open) => !open && setAssigning(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phân loại {assigning?.id}</DialogTitle>
            <DialogDescription>
              {assigning?.title} - {assigning?.room}. Chọn mức ưu tiên để hệ thống đặt hạn SLA và
              gán đơn vị xử lý.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            Mức ưu tiên (quyết định SLA)
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TicketPriority)}
            >
              <SelectTrigger aria-label="Mức ưu tiên">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(slaByPriority) as TicketPriority[]).map((level) => (
                  <SelectItem key={level} value={level}>
                    {formatStatusLabel(level)} - SLA {slaByPriority[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            Đơn vị xử lý *
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger aria-label="Đơn vị xử lý">
                <SelectValue placeholder="Chọn tổ bảo trì" />
              </SelectTrigger>
              <SelectContent>
                {(assignees ?? []).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAssigning(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!assigneeId || saving}
              onClick={() => void applyAssign()}
            >
              {saving ? 'Đang lưu...' : 'Gán & đặt SLA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resolving !== null} onOpenChange={(open) => !open && setResolving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh dấu đã xử lý {resolving?.id}</DialogTitle>
            <DialogDescription>
              Ghi chú kết quả xử lý là bắt buộc; sinh viên sẽ nhận yêu cầu xác nhận hoặc mở lại.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: đã thay tụ quạt, chạy ổn định 30 phút..."
            value={resolveNote}
            onChange={(event) => setResolveNote(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setResolving(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!resolveNote.trim() || saving}
              onClick={() => void applyResolve()}
            >
              {saving ? 'Đang lưu...' : 'Xác nhận đã xử lý'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
