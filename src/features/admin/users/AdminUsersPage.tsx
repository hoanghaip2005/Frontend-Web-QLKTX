import { useMemo, useState } from 'react';
import { Eye, Lock, Search, ShieldCheck, UserCog, UserPlus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  createSystemUser,
  fetchSystemUsers,
  setUserLocked,
  setUserRole,
  type CreateSystemUserInput,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { SystemUser } from '@/mocks/data/dormData';

type AccountView = 'operators' | 'students';
type OperatorRoleFilter = Extract<SystemUser['role'], 'staff' | 'admin'> | 'all';

const roleLabel: Record<SystemUser['role'], string> = {
  student: 'Sinh viên',
  staff: 'Nhân viên',
  admin: 'Quản trị',
};

const editableRoles: SystemUser['role'][] = ['student', 'staff', 'admin'];
const operatorRoleFilters: OperatorRoleFilter[] = ['all', 'staff', 'admin'];
const statusFilters: Array<SystemUser['status'] | 'all'> = ['all', 'active', 'invited', 'locked'];
const pageSizeOptions = ['10', '20', '50'];

const statusLabel: Record<SystemUser['status'], string> = {
  active: 'Hoạt động',
  invited: 'Đã mời',
  locked: 'Đã khóa',
};

const rolePermissions = [
  {
    permission: 'Xem hồ sơ, phòng, ticket của chính mình',
    student: true,
    staff: false,
    admin: true,
  },
  {
    permission: 'Duyệt hồ sơ, phân phòng, check-in/out',
    student: false,
    staff: true,
    admin: true,
  },
  {
    permission: 'Tiếp nhận và xử lý ticket bảo trì',
    student: false,
    staff: true,
    admin: true,
  },
  {
    permission: 'Cấu hình tòa, phòng, giường và rule phân phòng',
    student: false,
    staff: false,
    admin: true,
  },
  {
    permission: 'Quản trị tài khoản, báo cáo và audit log',
    student: false,
    staff: false,
    admin: true,
  },
];

function permissionPill(allowed: boolean) {
  return (
    <span
      className={
        allowed
          ? 'inline-flex items-center rounded-4xl bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'
          : 'inline-flex items-center rounded-4xl bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'
      }
    >
      {allowed ? 'Có quyền' : 'Không'}
    </span>
  );
}

function roleBadge(user: SystemUser) {
  const className =
    user.role === 'admin'
      ? 'bg-slate-900 text-white'
      : user.role === 'staff'
        ? 'bg-sky-100 text-sky-800'
        : 'bg-emerald-100 text-emerald-800';

  return (
    <Badge variant="secondary" className={className}>
      {roleLabel[user.role]}
    </Badge>
  );
}

function userScope(user: SystemUser) {
  if (user.role === 'student') {
    return [user.cohort, user.unit].filter(Boolean).join(' - ') || 'Chưa có khóa/lớp';
  }
  return user.unit || 'Chưa gán đơn vị';
}

function searchBlob(user: SystemUser) {
  return [user.name, user.email, user.code, user.cohort, user.unit, user.phone]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function AdminUsersPage() {
  const { data: users, loading, error, reload } = useAsyncData(fetchSystemUsers);
  const [query, setQuery] = useState('');
  const [accountView, setAccountView] = useState<AccountView>('operators');
  const [operatorRoleFilter, setOperatorRoleFilter] = useState<OperatorRoleFilter>('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [studentPageSize, setStudentPageSize] = useState('10');
  const [studentPage, setStudentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SystemUser['status'] | 'all'>('all');
  const [locking, setLocking] = useState<SystemUser | null>(null);
  const [roleTarget, setRoleTarget] = useState<SystemUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState<CreateSystemUserInput>({
    name: '',
    email: '',
    role: 'staff',
    code: '',
  });
  const [nextRole, setNextRole] = useState<SystemUser['role']>('staff');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo(() => users ?? [], [users]);

  const filteredBase = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((user) => {
      const matchesQuery = !normalized || searchBlob(user).includes(normalized);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, rows, statusFilter]);

  const operatorUsers = useMemo(
    () =>
      filteredBase
        .filter((user) => user.role !== 'student')
        .filter((user) => operatorRoleFilter === 'all' || user.role === operatorRoleFilter)
        .sort((a, b) => {
          if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
          return a.name.localeCompare(b.name, 'vi');
        }),
    [filteredBase, operatorRoleFilter],
  );

  const studentUsers = useMemo(
    () =>
      filteredBase
        .filter((user) => user.role === 'student')
        .filter((user) => cohortFilter === 'all' || user.cohort === cohortFilter)
        .sort((a, b) => {
          const cohortCompare = (b.cohort ?? '').localeCompare(a.cohort ?? '', 'vi');
          return cohortCompare || a.name.localeCompare(b.name, 'vi');
        }),
    [cohortFilter, filteredBase],
  );

  const studentCohorts = useMemo(
    () =>
      Array.from(
        new Set(rows.filter((user) => user.role === 'student').map((user) => user.cohort)),
      )
        .filter(Boolean)
        .sort((a, b) => String(b).localeCompare(String(a), 'vi')) as string[],
    [rows],
  );

  const counts = useMemo(
    () => ({
      total: rows.length,
      operators: rows.filter((user) => user.role !== 'student').length,
      students: rows.filter((user) => user.role === 'student').length,
      locked: rows.filter((user) => user.status === 'locked').length,
    }),
    [rows],
  );

  const pageSize = Number(studentPageSize);
  const studentPageCount = Math.max(1, Math.ceil(studentUsers.length / pageSize));
  const currentStudentPage = Math.min(studentPage, studentPageCount);
  const studentStartIndex = (currentStudentPage - 1) * pageSize;
  const pagedStudentUsers = studentUsers.slice(studentStartIndex, studentStartIndex + pageSize);
  const studentFrom = studentUsers.length === 0 ? 0 : studentStartIndex + 1;
  const studentTo = Math.min(studentStartIndex + pageSize, studentUsers.length);

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

  const applyLock = () => {
    if (!locking || !reason.trim()) return;
    void run(async () => {
      await setUserLocked(locking, locking.status !== 'locked', reason);
      setLocking(null);
      setReason('');
    });
  };

  const applyRole = () => {
    if (!roleTarget || !reason.trim()) return;
    void run(async () => {
      await setUserRole(roleTarget, nextRole, reason);
      setRoleTarget(null);
      setReason('');
    });
  };

  const applyInvite = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      setActionError('Nhập tên và email trước khi tạo lời mời.');
      return;
    }
    void run(async () => {
      await createSystemUser(inviteForm);
      setInviting(false);
      setInviteForm({ name: '', email: '', role: 'staff', code: '' });
    });
  };

  const openRoleDialog = (user: SystemUser) => {
    setRoleTarget(user);
    setNextRole(user.role);
    setReason('');
  };

  const openLockDialog = (user: SystemUser) => {
    setLocking(user);
    setReason('');
  };

  const renderUserTable = (tableRows: SystemUser[], emptyDescription: string) => {
    if (tableRows.length === 0) {
      return (
        <EmptyState
          title="Không có tài khoản khớp bộ lọc"
          description={emptyDescription}
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Mã</TableHead>
              <TableHead>Phạm vi</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hoạt động gần nhất</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <p className="font-medium text-slate-950">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-700">
                  {user.code || '-'}
                </TableCell>
                <TableCell className="min-w-36 text-sm text-slate-700">{userScope(user)}</TableCell>
                <TableCell>{roleBadge(user)}</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
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
                      onClick={() => openRoleDialog(user)}
                    >
                      <UserCog className="h-4 w-4" aria-hidden="true" />
                      Đổi role
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openLockDialog(user)}
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
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người dùng & RBAC"
        description="Quản trị tài khoản, role, trạng thái truy cập và ma trận quyền."
        badges={['US-001']}
        actions={
          <Button type="button" onClick={() => setInviting(true)}>
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

      <Alert>
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>RBAC hiện vận hành 3 role lõi</AlertTitle>
        <AlertDescription>
          Bảo trì và CTSV chưa có portal riêng. Hai nhóm này dùng giao diện Nhân viên, phân biệt
          bằng đơn vị/phạm vi công việc và audit khi thao tác.
        </AlertDescription>
      </Alert>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Tổng tài khoản', counts.total],
          ['Nhân sự hệ thống', counts.operators],
          ['Sinh viên', counts.students],
          ['Đã khóa', counts.locked],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Tài khoản hệ thống</h2>
              <p className="mt-1 text-sm text-slate-500">
                Mặc định ưu tiên nhân sự vận hành. Sinh viên được tách riêng theo khóa và phân
                trang để rà soát nhanh.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  className="pl-9"
                  placeholder="Tìm tên, email, mã, lớp..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setStudentPage(1);
                  }}
                  aria-label="Tìm tài khoản"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as SystemUser['status'] | 'all');
                  setStudentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40" aria-label="Lọc trạng thái">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'Tất cả trạng thái' : statusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : (
            <Tabs
              value={accountView}
              onValueChange={(value) => setAccountView(value as AccountView)}
            >
              <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
                <TabsTrigger value="operators">Nhân sự ({operatorUsers.length})</TabsTrigger>
                <TabsTrigger value="students">Sinh viên ({studentUsers.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="operators" className="mt-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Gồm quản trị, nhân viên KTX, bảo trì và CTSV đang dùng portal Nhân viên.
                  </p>
                  <Select
                    value={operatorRoleFilter}
                    onValueChange={(value) => setOperatorRoleFilter(value as OperatorRoleFilter)}
                  >
                    <SelectTrigger className="w-full sm:w-40" aria-label="Lọc role nhân sự">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorRoleFilters.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role === 'all' ? 'Tất cả nhân sự' : roleLabel[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderUserTable(
                  operatorUsers,
                  'Thử bỏ lọc trạng thái hoặc tìm theo mã/email khác.',
                )}
              </TabsContent>

              <TabsContent value="students" className="mt-4 space-y-3">
                <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                  <p className="text-sm text-slate-500">
                    Đang xem {studentFrom}-{studentTo} / {studentUsers.length} sinh viên.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Select
                      value={cohortFilter}
                      onValueChange={(value) => {
                        setCohortFilter(value);
                        setStudentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-40" aria-label="Lọc khóa sinh viên">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả khóa</SelectItem>
                        {studentCohorts.map((cohort) => (
                          <SelectItem key={cohort} value={cohort}>
                            {cohort}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={studentPageSize}
                      onValueChange={(value) => {
                        setStudentPageSize(value);
                        setStudentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-32" aria-label="Số dòng mỗi trang">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageSizeOptions.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} dòng
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {renderUserTable(
                  pagedStudentUsers,
                  'Thử đổi khóa, trạng thái hoặc từ khóa tìm kiếm.',
                )}

                <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    Trang {currentStudentPage}/{studentPageCount}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentStudentPage <= 1}
                      onClick={() => setStudentPage(Math.max(1, currentStudentPage - 1))}
                    >
                      Trước
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentStudentPage >= studentPageCount}
                      onClick={() =>
                        setStudentPage(Math.min(studentPageCount, currentStudentPage + 1))
                      }
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Ma trận quyền lõi</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Dùng để rà soát nhanh quyền UI/API của 3 role đang được backend hỗ trợ.
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
                    <TableCell className="min-w-64 font-medium">{row.permission}</TableCell>
                    <TableCell>{permissionPill(row.student)}</TableCell>
                    <TableCell>{permissionPill(row.staff)}</TableCell>
                    <TableCell>{permissionPill(row.admin)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={locking !== null}
        onOpenChange={(open) => {
          if (!open) setLocking(null);
        }}
      >
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
            placeholder="Ví dụ: tài khoản không còn sử dụng, hoặc mở lại sau xác minh..."
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setLocking(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={!reason.trim() || saving} onClick={applyLock}>
              {saving ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={roleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi role cho {roleTarget?.name}</DialogTitle>
            <DialogDescription>
              Backend hiện hỗ trợ role student/staff/admin. Bảo trì/CTSV giữ role staff và phân biệt
              bằng đơn vị.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Role mới
              <Select
                value={nextRole}
                onValueChange={(value) => setNextRole(value as SystemUser['role'])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLabel[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Lý do *
              <Textarea
                placeholder="Ví dụ: điều chuyển nhân sự sang Ban quản lý KTX..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setRoleTarget(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={!reason.trim() || saving} onClick={applyRole}>
              {saving ? 'Đang lưu...' : 'Cập nhật role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inviting} onOpenChange={setInviting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mời người dùng</DialogTitle>
            <DialogDescription>
              Live mode tạo profile qua backend. Email phải hợp lệ theo rule backend và mọi thay đổi
              tiếp theo được ghi audit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Họ tên *
              <Input
                value={inviteForm.name}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email *
              <Input
                type="email"
                value={inviteForm.email}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Role
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) =>
                    setInviteForm((prev) => ({ ...prev, role: value as SystemUser['role'] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {editableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabel[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Mã SV/NV
                <Input
                  value={inviteForm.code}
                  onChange={(event) =>
                    setInviteForm((prev) => ({ ...prev, code: event.target.value }))
                  }
                />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setInviting(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={saving} onClick={applyInvite}>
              {saving ? 'Đang tạo...' : 'Tạo lời mời'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}</DialogTitle>
            <DialogDescription>Thông tin tài khoản và quyền đang áp dụng.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-3 text-sm">
              {[
                ['Email', selectedUser.email],
                ['Mã', selectedUser.code || '-'],
                ['Role', roleLabel[selectedUser.role]],
                ['Phạm vi', userScope(selectedUser)],
                ['Số điện thoại', selectedUser.phone || '-'],
                ['Hoạt động gần nhất', selectedUser.lastActive],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 rounded-app bg-slate-50 px-3 py-2"
                >
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
