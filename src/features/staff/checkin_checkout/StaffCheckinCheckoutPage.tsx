import { useState } from 'react';
import { LogIn, LogOut, Search } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  checkInApplication,
  checkoutStudentRoom,
  fetchApplications,
  fetchStudentRooms,
} from '@/lib/api/repositories';
import type { StudentRoomRecord } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Application } from '@/mocks/data/dormData';

const checkinChecklist = [
  'Đối chiếu CCCD/thẻ sinh viên',
  'Bàn giao chìa khóa/thẻ từ',
  'Kiểm tra tình trạng giường và tài sản phòng',
  'Ký biên bản bàn giao',
];

export function StaffCheckinCheckoutPage() {
  const {
    data: applications,
    loading: appsLoading,
    error: appsError,
    reload: reloadApps,
  } = useAsyncData(fetchApplications);
  const {
    data: studentRooms,
    loading: roomsLoading,
    reload: reloadRooms,
  } = useAsyncData(fetchStudentRooms);

  const [query, setQuery] = useState('');
  const [pendingCheckin, setPendingCheckin] = useState<Application | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [pendingCheckout, setPendingCheckout] = useState<StudentRoomRecord | null>(null);
  const [checkoutNote, setCheckoutNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const matches = (text: string) => text.toLowerCase().includes(query.toLowerCase());

  const checkinQueue = (applications ?? []).filter(
    (app) =>
      ['suggested', 'waiting-checkin'].includes(app.status) &&
      (matches(app.studentName) || matches(app.studentId) || matches(app.id)),
  );
  const residentRows = (studentRooms ?? []).filter(
    (row) =>
      row.status !== 'checked-out' &&
      (matches(row.studentName) || matches(row.studentCode) || matches(row.room)),
  );

  const applyCheckin = async () => {
    if (!pendingCheckin || checkedItems.length < checkinChecklist.length) return;
    setSaving(true);
    setActionError(null);
    try {
      await checkInApplication(pendingCheckin, 'Hoàn thành checklist bàn giao khi check-in');
      setPendingCheckin(null);
      setCheckedItems([]);
      reloadApps();
      reloadRooms();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không ghi nhận được check-in');
    } finally {
      setSaving(false);
    }
  };

  const applyCheckout = async () => {
    if (!pendingCheckout || !checkoutNote.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await checkoutStudentRoom(pendingCheckout, checkoutNote);
      setPendingCheckout(null);
      setCheckoutNote('');
      reloadRooms();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không ghi nhận được check-out');
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = (item: string, checked: boolean) => {
    setCheckedItems((current) =>
      checked ? [...current, item] : current.filter((entry) => entry !== item),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Check-in / Check-out"
        description="Nhận phòng theo checklist; trả phòng kèm ghi chú bàn giao."
        badges={['US-010']}
      />

      {(appsError || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription className="flex items-center gap-3">
            {appsError ?? actionError}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                reloadApps();
                reloadRooms();
              }}
            >
              Tải lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Tìm theo tên, MSSV, mã hồ sơ hoặc phòng..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Tìm sinh viên"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">
              Chờ check-in ({checkinQueue.length})
            </h2>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <LoadingState />
            ) : checkinQueue.length === 0 ? (
              <EmptyState
                title="Không có hồ sơ chờ check-in"
                description="Hồ sơ xuất hiện ở đây sau khi được phân giường."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hồ sơ</TableHead>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkinQueue.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.id}</TableCell>
                        <TableCell>
                          <p className="font-medium">{row.studentName}</p>
                          <p className="text-xs text-slate-500">{row.studentId}</p>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {row.status === 'waiting-checkin' ? (
                            <Button type="button" size="sm" onClick={() => setPendingCheckin(row)}>
                              <LogIn className="h-4 w-4" aria-hidden="true" />
                              Check-in
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">Chờ SV xác nhận</span>
                          )}
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
            <h2 className="text-base font-semibold text-slate-950">
              Đang lưu trú ({residentRows.length})
            </h2>
          </CardHeader>
          <CardContent>
            {roomsLoading ? (
              <LoadingState />
            ) : residentRows.length === 0 ? (
              <EmptyState
                title="Chưa có sinh viên lưu trú"
                description="Danh sách cập nhật sau khi check-in."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>Giường</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {residentRows.map((row) => (
                      <TableRow key={`${row.studentCode}-${row.bed}`}>
                        <TableCell>
                          <p className="font-medium">{row.studentName}</p>
                          <p className="text-xs text-slate-500">{row.studentCode}</p>
                        </TableCell>
                        <TableCell>{row.bed}</TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setPendingCheckout(row)}
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Check-out
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

      <Dialog
        open={pendingCheckin !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingCheckin(null);
            setCheckedItems([]);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-in: {pendingCheckin?.studentName}</DialogTitle>
            <DialogDescription>
              Hồ sơ {pendingCheckin?.id}. Hoàn thành checklist bàn giao trước khi xác nhận.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {checkinChecklist.map((item) => (
              <label key={item} className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox
                  checked={checkedItems.includes(item)}
                  onCheckedChange={(value) => toggleItem(item, value === true)}
                  aria-label={item}
                />
                {item}
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setPendingCheckin(null);
                setCheckedItems([]);
              }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={checkedItems.length < checkinChecklist.length || saving}
              onClick={() => void applyCheckin()}
            >
              {saving ? 'Đang lưu...' : 'Xác nhận check-in'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingCheckout !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingCheckout(null);
            setCheckoutNote('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-out: {pendingCheckout?.studentName}</DialogTitle>
            <DialogDescription>
              Giường {pendingCheckout?.bed}. Ghi chú bàn giao là bắt buộc và được lưu vào sổ
              giường/audit log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: đã kiểm tra tài sản, thu hồi chìa khóa, phòng sạch..."
            value={checkoutNote}
            onChange={(event) => setCheckoutNote(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setPendingCheckout(null);
                setCheckoutNote('');
              }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!checkoutNote.trim() || saving}
              onClick={() => void applyCheckout()}
            >
              {saving ? 'Đang lưu...' : 'Xác nhận check-out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
