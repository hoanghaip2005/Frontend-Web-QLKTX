import { Outlet, useLocation } from 'react-router-dom';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { roleNavItems } from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { AppRole } from '@/types/roles';

type RoleLayoutProps = {
  role: AppRole;
};

export function RoleLayout({ role }: RoleLayoutProps) {
  const location = useLocation();
  const isAdmin = role === 'admin';

  return (
    <div
      className={cn(
        'min-h-screen bg-surface lg:flex',
        isAdmin &&
          'bg-[#fff7fa] [--border:340_75%_84%] [--input:340_75%_84%] [--primary:340_69%_28%] [--ring:340_69%_28%] [--secondary:342_100%_96%] [--secondary-foreground:340_47%_20%]',
      )}
    >
      <AppSidebar role={role} items={roleNavItems[role]} />
      <main className={cn('min-w-0 flex-1 p-4 sm:p-6 lg:p-8', isAdmin && 'p-0 sm:p-0 lg:p-0')}>
        {isAdmin ? <AdminTopbar pathname={location.pathname} /> : null}
        <div className={cn(isAdmin && 'p-6 lg:p-8')}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const adminTopbarTitle: Record<string, string> = {
  '/admin/dashboard': 'Tổng quan',
  '/admin/users': 'Người dùng RBAC',
  '/admin/buildings-rooms': 'Tòa phòng',
  '/admin/allocation-rules': 'Quy định xếp phòng',
  '/admin/reports-audit': 'Báo cáo Audit',
  '/admin/settings': 'Cài đặt',
};

function AdminTopbar({ pathname }: { pathname: string }) {
  const title = adminTopbarTitle[pathname] ?? 'Tổng quan';

  return (
    <header className="flex min-h-[72px] flex-col gap-3 border-b border-[#f2b8c8] bg-white px-6 py-3 md:flex-row md:items-center md:justify-between lg:px-8">
      <p className="text-sm font-bold text-[#c9354f]">QT / {title}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          aria-label="Tìm kiếm hồ sơ"
          placeholder="Tìm kiếm hồ sơ"
          className="h-10 w-64 border-[#f2b8c8] bg-white text-sm text-[#32121d] placeholder:text-[#9b7180]"
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 border-[#f2b8c8] bg-white px-5 text-sm font-semibold text-[#c9354f]"
        >
          Xuất file
        </Button>
        <div className="grid h-9 w-9 place-items-center rounded-full border border-[#f2b8c8] bg-[#fff1f5] text-sm font-bold text-[#c9354f]">
          A
        </div>
      </div>
    </header>
  );
}
