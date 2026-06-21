import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { roleNavItems } from '@/app/router/routes';
import type { AppRole } from '@/types/roles';

type RoleLayoutProps = {
  role: AppRole;
};

export function RoleLayout({ role }: RoleLayoutProps) {
  return (
    <div className="min-h-screen bg-surface lg:flex">
      <AppSidebar role={role} items={roleNavItems[role]} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
