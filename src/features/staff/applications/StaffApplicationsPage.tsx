import { useState } from 'react';
import { CheckCircle2, FileText, Search, XCircle } from 'lucide-react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { fetchApplications, reviewApplication } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Application, ApplicationStatus } from '@/mocks/data/dormData';

type Decision = { kind: 'approved' | 'rejected' | 'needs-update'; target: Application } | null;

export function StaffApplicationsPage() {
  const { data: rows, loading, error, reload } = useAsyncData(fetchApplications);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [decision, setDecision] = useState<Decision>(null);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = (rows ?? []).filter((row) => {
    const matchesQuery =
      row.id.toLowerCase().includes(query.toLowerCase()) ||
      row.studentName.toLowerCase().includes(query.toLowerCase()) ||
      row.studentId.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  const selected = (rows ?? []).find((row) => row.id === selectedId) ?? null;

  const applyDecision = async () => {
    if (!decision || !reason.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await reviewApplication(decision.target, decision.kind, reason);
      setDecision(null);
      setReason('');
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không lưu được quyết định');
    } finally {
      setSaving(false);
    }
  };

  const decisionTitle =
    decision?.kind === 'approved'
      ? 'Duyệt hồ sơ'
      : decision?.kind === 'rejected'
        ? 'Từ chối hồ sơ'
        : 'Yêu cầu bổ sung';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyệt hồ sơ đăng ký"
        description="Kiểm tra minh chứng và duyệt/từ chối kèm lý do."
        badges={['US-005']}
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Không tải được danh sách hồ sơ</AlertTitle>
          <AlertDescription className="flex items-center gap-3">
            {error}
            <Button type="button" size="sm" variant="secondary" onClick={() => void reload()}>
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {actionError && (
        <Alert variant="destructive">
          <AlertTitle>Thao tác thất bại</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Tìm theo mã hồ sơ, tên hoặc MSSV..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm kiếm hồ sơ"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
        >
          <SelectTrigger className="w-full sm:w-48" aria-label="Lọc theo trạng thái">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="reviewing">Đang xem xét</SelectItem>
            <SelectItem value="needs-update">Cần bổ sung</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
            <SelectItem value="waiting-checkin">Chờ check-in</SelectItem>
            <SelectItem value="checked-in">Đã check-in</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-950">
                Hàng chờ duyệt ({filtered.length})
              </h2>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <EmptyState
                  title="Không có hồ sơ khớp bộ lọc"
                  description="Thử đổi từ khóa hoặc trạng thái lọc."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hồ sơ</TableHead>
                        <TableHead>Sinh viên</TableHead>
                        <TableHead>Ưu tiên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((row) => (
                        <TableRow
                          key={row.id}
                          className={selectedId === row.id ? 'bg-brand-50/50' : undefined}
                        >
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>
                            <p>{row.studentName}</p>
                            <p className="text-xs text-slate-500">{row.studentId}</p>
                          </TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>
                            <StatusBadge status={row.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedId(row.id)}
                            >
                              Xem chi tiết
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

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-950">Chi tiết hồ sơ</h2>
            </CardHeader>
            <CardContent>
              {!selected ? (
                <EmptyState
                  title="Chưa chọn hồ sơ"
                  description="Chọn một hồ sơ trong hàng chờ để xem minh chứng và ra quyết định."
                />
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-base font-semibold text-slate-950">{selected.id}</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-slate-500">Sinh viên</dt>
                      <dd className="font-medium text-slate-900">{selected.studentName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">MSSV</dt>
                      <dd className="font-medium text-slate-900">{selected.studentId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Nộp lúc</dt>
                      <dd className="font-medium text-slate-900">{selected.submittedAt}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Diện ưu tiên</dt>
                      <dd className="font-medium text-slate-900">{selected.priority}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs text-slate-500">Nguyện vọng</dt>
                      <dd className="font-medium text-slate-900">{selected.preference || '-'}</dd>
                    </div>
                  </dl>
                  <div>
                    <p className="text-xs text-slate-500">Minh chứng</p>
                    {selected.evidence.length === 0 ? (
                      <p className="mt-1 rounded-app bg-amber-50 p-2 text-amber-800">
                        Chưa có minh chứng đính kèm.
                      </p>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {selected.evidence.map((file) => (
                          <li key={file} className="flex items-center gap-2 text-slate-700">
                            <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            {file}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {selected.note && (
                    <p className="rounded-app bg-slate-50 p-3 text-slate-600">
                      <span className="font-medium text-slate-800">Ghi chú duyệt:</span>{' '}
                      {selected.note}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => setDecision({ kind: 'approved', target: selected })}
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Duyệt
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setDecision({ kind: 'needs-update', target: selected })}
                    >
                      Yêu cầu bổ sung
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDecision({ kind: 'rejected', target: selected })}
                    >
                      <XCircle className="h-4 w-4" aria-hidden="true" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={decision !== null} onOpenChange={(open) => !open && setDecision(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decisionTitle} {decision?.target.id}
            </DialogTitle>
            <DialogDescription>
              Lý do là bắt buộc và sẽ hiển thị cho sinh viên, đồng thời được lưu vào audit log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={
              decision?.kind === 'approved'
                ? 'Ví dụ: hồ sơ đầy đủ, đúng diện ưu tiên...'
                : 'Ví dụ: thiếu minh chứng CCCD, hết chỉ tiêu...'
            }
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setDecision(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!reason.trim() || saving}
              onClick={() => void applyDecision()}
            >
              {saving ? 'Đang lưu...' : `Xác nhận ${decisionTitle.toLowerCase()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
