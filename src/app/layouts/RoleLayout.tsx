import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, LogOut, Search } from 'lucide-react';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { roleNavItems } from '@/app/router/routes';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function RoleLayout({ role }: RoleLayoutProps) {
  const location = useLocation();
  const items = roleNavItems[role];
  const current = items.find((item) => location.pathname.startsWith(item.path));
  const session = getSession();

  if (appConfig.apiMode === 'live') {
    if (!session) return <Navigate to="/login" replace />;
    if (session.role !== role) return <Navigate to={roleHome[session.role]} replace />;
  }

  const meta = session
    ? { label: roleMeta[role].label, initials: session.initials, user: session.name }
    : roleMeta[role];

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

            <div className="relative ml-auto hidden w-64 md:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <Input
                className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm"
                placeholder="Tìm nhanh phòng, hồ sơ, ticket..."
                aria-label="Tìm kiếm nhanh"
              />
            </div>

            <Badge
              variant="secondary"
              className={
                appConfig.apiMode === 'live'
                  ? 'shrink-0 bg-emerald-100 text-emerald-800'
                  : 'shrink-0 bg-slate-100 text-slate-600'
              }
            >
              {appConfig.apiMode === 'live' ? 'Live API' : 'Mock data'}
            </Badge>

            <div className="flex shrink-0 items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-brand-600 text-xs font-semibold text-white">
                  {meta.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-slate-700 xl:inline">
                {meta.user}
              </span>
              <Button asChild size="sm" variant="ghost" className="text-slate-500">
                <Link to="/login" aria-label="Đăng xuất" onClick={() => clearSession()}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
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
