import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { roleNavItems } from '@/app/router/routes';
import { cn } from '@/lib/utils';
import type { AppRole } from '@/types/roles';

type RoleLayoutProps = {
  role: AppRole;
};

export function RoleLayout({ role }: RoleLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-surface lg:flex',
        role === 'admin' &&
          'bg-[#fff7fa] [--border:340_75%_84%] [--input:340_75%_84%] [--primary:340_69%_28%] [--ring:340_69%_28%] [--secondary:342_100%_96%] [--secondary-foreground:340_47%_20%]',
      )}
    >
      <AppSidebar role={role} items={roleNavItems[role]} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
