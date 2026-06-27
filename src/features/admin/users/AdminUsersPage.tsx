import { useMemo, useState } from 'react';
import { KeyRound, LockKeyhole, Search, ShieldPlus, UserCog } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  AdminActionButton,
  AdminPageHeader,
  AuditHint,
  EmptyStateLine,
  SectionPanel,
  StatusBadge,
} from '@/features/admin/_components/AdminShell';
import { adminUsers } from '@/features/admin/data';

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [reason, setReason] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const filteredUsers = useMemo(
    () =>
      adminUsers.filter((user) => {
        const matchesSearch = `${user.name} ${user.id} ${user.scope}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesRole = role === 'all' || user.role === role;

        return matchesSearch && matchesRole;
      }),
    [role, search],
  );

  const submitMockRoleChange = () => {
    setShowValidation(reason.trim().length < 12);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="User RBAC"
        title="Users, roles, and admin-only access"
        description="Review user role scope, lock risk, and sensitive permission changes without calling real auth or backend services."
        icon={UserCog}
        primaryAction={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <ShieldPlus className="h-4 w-4" aria-hidden="true" />
                Assign role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Mock role assignment</DialogTitle>
                <DialogDescription>
                  Admin changes require a business reason so the audit trail can explain who changed
                  access and why.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-medium text-[#76525f]">
                  Target user
                  <Select defaultValue="USR-STF-014">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {adminUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.id} - {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-[#76525f]">
                  Requested scope
                  <Input defaultValue="Building B allocation override until 2026-07-08" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-[#76525f]">
                  Required admin reason
                  <Textarea
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value);
                      setShowValidation(false);
                    }}
                    placeholder="Example: temporary Sprint 2 allocation support approved by dorm manager"
                  />
                </label>
                {showValidation ? (
                  <p className="text-sm text-destructive">
                    Add a clear reason with at least 12 characters before saving this mock change.
                  </p>
                ) : null}
              </div>
              <DialogFooter showCloseButton>
                <Button type="button" onClick={submitMockRoleChange}>
                  Save mock change
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
        secondaryAction={<AdminActionButton icon={LockKeyhole}>Lock account</AdminActionButton>}
      />

      <Alert>
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>RBAC boundary</AlertTitle>
        <AlertDescription>
          Admin can configure roles and scopes. Staff and student portals stay separate, and broad
          export permissions remain deferred for MVP.
        </AlertDescription>
      </Alert>

      <SectionPanel
        title="Role review queue"
        description="Filter by user, role, or scope. Empty state appears when filters remove all rows."
        action={
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-2 h-4 w-4 text-[#9b7180]"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users"
                className="w-52 pl-8"
                aria-label="Search users"
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Dormitory Staff">Dormitory Staff</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Student Affairs">Student Affairs</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filteredUsers.length === 0 ? (
          <EmptyStateLine
            title="No users match this filter"
            description="Clear search or switch role filter to review mock RBAC rows."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Risk / reason</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium text-[#32121d]">{user.name}</div>
                    <div className="text-xs text-[#76525f]">{user.id}</div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="max-w-52 whitespace-normal">{user.scope}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="max-w-72 whitespace-normal text-[#76525f]">
                    {user.risk}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="outline" size="sm">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionPanel>

      <AuditHint>
        Loading state: role updates are mocked locally. Error state: missing reason blocks the save
        action in the dialog. Locked accounts stay visible for admin review.
      </AuditHint>
    </div>
  );
}
