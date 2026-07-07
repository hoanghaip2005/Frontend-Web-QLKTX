import { type FormEvent, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, LogOut, Search, UserRound } from 'lucide-react';

import { roleNavItems } from '@/app/router/routes';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { appConfig, clearSession, getSession } from '@/config/app';
import type { AppRole } from '@/types/roles';

type RoleLayoutProps = {
  role: AppRole;
};

const roleHome: Record<AppRole, string> = {
  student: '/student/dashboard',
  staff: '/staff/dashboard',
  admin: '/admin/dashboard',
};

const roleMeta: Record<AppRole, { label: string; initials: string; user: string }> = {
  student: { label: 'Sinh viên', initials: 'PH', user: 'Phạm Hoàng Hải' },
  staff: { label: 'Nhân viên KTX', initials: 'KD', user: 'Kỳ Duyên' },
  admin: { label: 'Quản trị', initials: 'HH', user: 'Hoàng Hải' },
};

type HeaderAccount = {
  label: string;
  initials: string;
  user: string;
  code?: string;
  email?: string;
};

const searchRules: Record<AppRole, { path: string; keywords: string[] }[]> = {
  student: [
    { path: '/student/application', keywords: ['ho so', 'dang ky', 'ktx', 'app', 'hs'] },
    { path: '/student/room', keywords: ['phong', 'giuong', 'room', 'bed'] },
    { path: '/student/tickets', keywords: ['ticket', 'sua', 'bao sua', 'bao tri', 'tk'] },
    { path: '/student/invoices', keywords: ['hoa don', 'phi', 'thanh toan', 'momo', 'inv'] },
    { path: '/student/requests', keywords: ['yeu cau', 'doi phong', 've muon', 'req'] },
    { path: '/student/notifications', keywords: ['thong bao', 'notification'] },
  ],
  staff: [
    { path: '/staff/applications', keywords: ['ho so', 'duyet', 'application'] },
    { path: '/staff/allocation', keywords: ['phan phong', 'giuong', 'allocation'] },
    { path: '/staff/checkin-checkout', keywords: ['check in', 'check out', 'nhan phong'] },
    { path: '/staff/residents', keywords: ['cu dan', 'sinh vien', 'resident'] },
    { path: '/staff/maintenance', keywords: ['sua', 'bao tri', 'ticket', 'sla'] },
    { path: '/staff/billing', keywords: ['phi', 'hoa don', 'doi soat'] },
    { path: '/staff/tasks', keywords: ['ca truc', 'nhiem vu', 'task'] },
  ],
  admin: [
    { path: '/admin/users', keywords: ['user', 'rbac', 'tai khoan', 'phan quyen'] },
    { path: '/admin/buildings-rooms', keywords: ['toa', 'phong', 'giuong'] },
    { path: '/admin/allocation-rules', keywords: ['luat', 'phan phong', 'rule'] },
    { path: '/admin/reports-audit', keywords: ['bao cao', 'audit', 'nhat ky'] },
    { path: '/admin/settings', keywords: ['cai dat', 'setting'] },
  ],
};

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function findSearchPath(role: AppRole, query: string, items: { label: string; path: string }[]) {
  const normalized = normalizeSearch(query);
  if (!normalized) return null;
  const navMatch = items.find((item) => {
    const label = normalizeSearch(item.label);
    return label.includes(normalized) || normalized.includes(label);
  });
  if (navMatch) return navMatch.path;
  const ruleMatch = searchRules[role].find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return ruleMatch?.path ?? roleHome[role];
}

export function RoleLayout({ role }: RoleLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = roleNavItems[role];
  const current = items.find((item) => location.pathname.startsWith(item.path));
  const session = getSession();
  const [searchQuery, setSearchQuery] = useState('');

  if (appConfig.apiMode === 'live') {
    if (!session) return <Navigate to="/login" replace />;
    if (session.role !== role) return <Navigate to={roleHome[session.role]} replace />;
  }

  const meta: HeaderAccount = session
    ? {
        label: roleMeta[role].label,
        initials: session.initials,
        user: session.name,
        code: session.code,
        email: session.email,
      }
    : roleMeta[role];
  const accountLine = [meta.code, meta.email].filter(Boolean).join(' - ');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const path = findSearchPath(role, searchQuery, items);
    if (!path) return;
    navigate(path);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <AppSidebar role={role} items={items} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs">
          <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              <span className="hidden text-slate-400 sm:inline">{meta.label}</span>
              <ChevronRight
                className="hidden h-3.5 w-3.5 text-slate-300 sm:inline"
                aria-hidden="true"
              />
              <span className="truncate font-medium text-slate-900">
                {current?.label ?? 'Trang'}
              </span>
            </nav>

            <form className="relative ml-auto hidden w-64 md:block" onSubmit={handleSearch}>
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded text-slate-400 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label="Tìm kiếm nhanh"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
              <Input
                className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm"
                placeholder="Tìm phòng, hồ sơ, ticket..."
                aria-label="Tìm kiếm nhanh"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>

            <div className="flex shrink-0 items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 gap-2 px-2 text-slate-700"
                    aria-label="Mở menu tài khoản"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand-600 text-xs font-semibold text-white">
                        {meta.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden min-w-0 text-left lg:block">
                      <span className="block max-w-36 truncate text-sm font-medium leading-4">
                        {meta.user}
                      </span>
                      <span className="block max-w-36 truncate text-[11px] leading-4 text-slate-500">
                        {meta.label}
                      </span>
                    </span>
                    <ChevronDown
                      className="hidden h-4 w-4 text-slate-400 sm:block"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="px-2 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{meta.user}</p>
                    <p className="mt-0.5 truncate text-xs font-normal text-slate-500">
                      {[meta.label, accountLine].filter(Boolean).join(' - ')}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                      Hồ sơ cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                      clearSession();
                      navigate('/login');
                    }}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
