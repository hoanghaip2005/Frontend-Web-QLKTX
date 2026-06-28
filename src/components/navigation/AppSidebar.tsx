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
  const isAdmin = role === 'admin';

  return (
    <aside
      className={cn(
        'flex w-full flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r',
        isAdmin && 'border-[#5e1027] bg-[#2a0f1a] text-white lg:w-[248px]',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 border-b border-slate-100 px-5 py-4',
          isAdmin && 'border-transparent px-6 pb-7 pt-6',
        )}
      >
        <div
          className={cn(
            'grid h-10 w-10 place-items-center rounded-app bg-brand-600 text-white',
            isAdmin && 'hidden',
          )}
        >
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p
            className={cn('text-sm font-semibold text-slate-950', isAdmin && 'text-lg text-white')}
          >
            {isAdmin ? 'DormCare Hub' : appConfig.name}
          </p>
          <p className={cn('text-xs text-slate-500', isAdmin && 'mt-1 text-[#e6b84a]')}>
            {isAdmin ? 'Bảng quản trị' : appConfig.product}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-2 px-5 py-4 text-sm font-medium text-slate-700',
          isAdmin && 'hidden',
        )}
      >
        <Icon
          className={cn('h-4 w-4 text-brand-600', isAdmin && 'text-[#ffdce6]')}
          aria-hidden="true"
        />
        {roleLabel[role]}
      </div>

      <nav
        className={cn('grid gap-1 px-3 pb-4 lg:pb-0', isAdmin && 'gap-2 px-4')}
        aria-label={`${roleLabel[role]} navigation`}
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'rounded-app px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950',
                isActive && 'bg-brand-50 text-brand-700',
                isAdmin &&
                  'border border-transparent bg-[#341321] px-4 py-2.5 text-[13px] text-white/85 hover:border-[#5e1027] hover:bg-[#44182a] hover:text-white',
                isAdmin && isActive && 'border-[#c9354f] bg-[#c9354f] text-white',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {isAdmin ? (
        <div className="mt-auto px-4 pb-5">
          <div className="rounded-lg bg-[#3a1624] px-4 py-4">
            <p className="text-sm font-semibold text-white">Quản trị</p>
            <p className="mt-1 text-xs text-[#ffdce6]">Thành viên 7</p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
