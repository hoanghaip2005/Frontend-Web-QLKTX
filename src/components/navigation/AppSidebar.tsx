import { NavLink } from 'react-router-dom';
import { Building2, Shield, UserRound, UsersRound } from 'lucide-react';

import { appConfig } from '@/config/app';
import { cn } from '@/lib/utils/cn';
import type { AppRole, NavItem } from '@/types/roles';

type AppSidebarProps = {
  role: AppRole;
  items: NavItem[];
};

const roleIcon = {
  student: UserRound,
  staff: UsersRound,
  admin: Shield,
} satisfies Record<AppRole, typeof UserRound>;

const roleLabel = {
  student: 'Student Portal',
  staff: 'Staff Console',
  admin: 'Admin Governance',
} satisfies Record<AppRole, string>;

export function AppSidebar({ role, items }: AppSidebarProps) {
  const Icon = roleIcon[role];

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-app bg-brand-600 text-white">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">{appConfig.name}</p>
          <p className="text-xs text-slate-500">{appConfig.product}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-4 text-sm font-medium text-slate-700">
        <Icon className="h-4 w-4 text-brand-600" aria-hidden="true" />
        {roleLabel[role]}
      </div>

      <nav className="grid gap-1 px-3 pb-4 lg:pb-0" aria-label={`${roleLabel[role]} navigation`}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'rounded-app px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950',
                isActive && 'bg-brand-50 text-brand-700',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
