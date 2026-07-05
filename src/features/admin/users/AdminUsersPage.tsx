import { useState } from 'react';
import { Eye, Lock, ShieldCheck, UserPlus } from 'lucide-react';

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
import { fetchSystemUsers, setUserLocked } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { SystemUser } from '@/mocks/data/dormData';

const roleLabel: Record<SystemUser['role'], string> = {
  student: 'Sinh viên',
  staff: 'Nhân viên KTX',
  admin: 'Quản trị',
  maintenance: 'Bảo trì',
  leadership: 'CTSV / Lãnh đạo',
};

const rolePermissions = [
  { permission: 'Xem hồ sơ đăng ký của mình', student: true, staff: false, admin: true },
  { permission: 'Duyệt / từ chối hồ sơ', student: false, staff: true, admin: true },
  { permission: 'Phân phòng & override', student: false, staff: true, admin: true },
  { permission: 'Cấu hình rule phân phòng', student: false, staff: false, admin: true },
  { permission: 'Gán role, khóa tài khoản', student: false, staff: false, admin: true },
  { permission: 'Xem audit log', student: false, staff: false, admin: true },
];

export function AdminUsersPage() {
  const { data: users, loading, error, reload } = useAsyncData(fetchSystemUsers);
  const [locking, setLocking] = useState<SystemUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [lockReason, setLockReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const applyLock = async () => {
    if (!locking || !lockReason.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await setUserLocked(locking, locking.status !== 'locked', lockReason);
      setLocking(null);
      setLockReason('');
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không cập nhật được tài khoản');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người dùng & RBAC"
        description="Tài khoản, role và khóa truy cập. Mọi thay đổi được ghi audit."
        badges={['US-001']}
        actions={
          <Button type="button" variant="secondary" disabled>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Mời người dùng
          </Button>
        }
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Tài khoản hệ thống</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hoạt động gần nhất</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(users ?? []).map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </TableCell>
                      <TableCell>{roleLabel[user.role]}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Chi tiết
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setLocking(user)}
                          >
                            <Lock className="h-4 w-4" aria-hidden="true" />
                            {user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Ma trận quyền theo role</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Role không có quyền bị chặn ở cả UI và API.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quyền</TableHead>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Quản trị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolePermissions.map((row) => (
                  <TableRow key={row.permission}>
                    <TableCell className="font-medium">{row.permission}</TableCell>
                    {[row.student, row.staff, row.admin].map((allowed, index) => (
                      <TableCell key={index}>
                        <span
                          className={
                            allowed
                              ? 'inline-flex items-center rounded-4xl bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'
                              : 'inline-flex items-center rounded-4xl bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'
                          }
                        >
                          {allowed ? 'Có quyền' : 'Không'}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={locking !== null} onOpenChange={(open) => !open && setLocking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locking?.status === 'locked' ? 'Mở khóa' : 'Khóa'} tài khoản {locking?.name}
            </DialogTitle>
            <DialogDescription>
              Lý do là bắt buộc và được ghi vào audit log kèm người thực hiện.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: sinh viên đã tốt nghiệp, tài khoản không còn sử dụng..."
            value={lockReason}
            onChange={(event) => setLockReason(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setLocking(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!lockReason.trim() || saving}
              onClick={() => void applyLock()}
            >
              {saving ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}</DialogTitle>
            <DialogDescription>Thông tin tài khoản và role hiện tại.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-3 text-sm">
              {[
                ['Email', selectedUser.email],
                ['Role', roleLabel[selectedUser.role]],
                ['Hoạt động gần nhất', selectedUser.lastActive],
                ['Mã backend', selectedUser.backendId ?? '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-app bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-900">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-app bg-slate-50 px-3 py-2">
                <span className="text-slate-500">Trạng thái</span>
                <StatusBadge status={selectedUser.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
