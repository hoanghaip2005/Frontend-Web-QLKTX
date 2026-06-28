import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { roleNavItems } from '@/app/router/routes';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ADMIN_EXPORT_EVENT,
  ADMIN_EXPORT_READY_EVENT,
  ADMIN_SEARCH_EVENT,
  type AdminExportDetail,
} from '@/features/admin/_components/AdminShell';
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
        {isAdmin ? <AdminTopbar key={location.pathname} pathname={location.pathname} /> : null}
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

function dispatchAdminSearch(value: string) {
  window.dispatchEvent(new CustomEvent(ADMIN_SEARCH_EVENT, { detail: { value } }));
}

function AdminTopbar({ pathname }: { pathname: string }) {
  const title = adminTopbarTitle[pathname] ?? 'Tổng quan';
  const [search, setSearch] = useState('');
  const [exportLink, setExportLink] = useState<AdminExportDetail | null>(null);

  useEffect(() => {
    dispatchAdminSearch('');
  }, [pathname]);

  useEffect(() => {
    const handleExportReady = (event: Event) => {
      setExportLink((event as CustomEvent<AdminExportDetail>).detail);
    };

    window.addEventListener(ADMIN_EXPORT_READY_EVENT, handleExportReady);

    return () => {
      window.removeEventListener(ADMIN_EXPORT_READY_EVENT, handleExportReady);
    };
  }, []);

  const updateSearch = (nextSearch: string) => {
    setSearch(nextSearch);
    dispatchAdminSearch(nextSearch);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateSearch(event.target.value);
  };

  const handleSearchInput = (event: FormEvent<HTMLInputElement>) => {
    updateSearch(event.currentTarget.value);
  };

  const handleExport = (event: MouseEvent<HTMLAnchorElement>) => {
    const latestExportLink = exportLink ?? window.__adminExportLink;

    if (!latestExportLink) {
      event.preventDefault();
    } else {
      event.currentTarget.href = latestExportLink.href;
      event.currentTarget.download = latestExportLink.fileName;
    }

    window.dispatchEvent(new Event(ADMIN_EXPORT_EVENT));
  };

  return (
    <header className="flex min-h-[72px] flex-col gap-3 border-b border-[#f2b8c8] bg-white px-6 py-3 md:flex-row md:items-center md:justify-between lg:px-8">
      <p className="text-sm font-bold text-[#c9354f]">QT / {title}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          aria-label="Tìm kiếm hồ sơ"
          placeholder="Tìm kiếm hồ sơ"
          value={search}
          onChange={handleSearchChange}
          onInput={handleSearchInput}
          className="h-10 w-64 border-[#f2b8c8] bg-white text-sm text-[#32121d] placeholder:text-[#9b7180]"
        />
        <Button
          asChild
          variant="outline"
          className="h-10 border-[#f2b8c8] bg-white px-5 text-sm font-semibold text-[#c9354f] hover:bg-[#fff1f5]"
        >
          <a
            href={exportLink?.href ?? '#'}
            download={exportLink?.fileName}
            onClick={handleExport}
          >
            Xuất file
          </a>
        </Button>
        <div className="grid h-9 w-9 place-items-center rounded-full border border-[#f2b8c8] bg-[#fff1f5] text-sm font-bold text-[#c9354f]">
          A
        </div>
      </div>
    </header>
  );
}
