import { NavLink } from 'react-router-dom';
import {
  BedDouble,
  Bell,
  Building2,
  CalendarClock,
  ClipboardList,
  FileText,
  Inbox,
  LayoutDashboard,
  LogIn,
  Receipt,
  Scale,
  Settings,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
  UsersRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

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
} satisfies Record<AppRole, LucideIcon>;

const roleLabel = {
  student: 'Student Portal',
  staff: 'Staff Console',
  admin: 'Admin Governance',
} satisfies Record<AppRole, string>;

const iconRules: [string, LucideIcon][] = [
  ['dashboard', LayoutDashboard],
  ['application', FileText],
  ['applications', ClipboardList],
  ['buildings-rooms', Building2],
  ['allocation-rules', Scale],
  ['allocation', BedDouble],
  ['room', BedDouble],
  ['tickets', Wrench],
  ['maintenance', Wrench],
  ['invoices', Receipt],
  ['billing', Receipt],
  ['requests', Inbox],
  ['notifications', Bell],
  ['checkin-checkout', LogIn],
  ['residents', Users],
  ['tasks', CalendarClock],
  ['users', ShieldCheck],
  ['reports-audit', FileText],
  ['settings', Settings],
];

function iconForPath(path: string): LucideIcon {
  const match = iconRules.find(([keyword]) => path.includes(keyword));
  return match?.[1] ?? LayoutDashboard;
}

export function AppSidebar({ role, items }: AppSidebarProps) {
  const RoleIcon = roleIcon[role];

  return (
    <aside className="flex w-full flex-col bg-brand-900 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
      <div className="flex items-center gap-3 px-5 pb-4 pt-5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-app bg-white/10 ring-1 ring-white/15">
          <Building2 className="h-4.5 w-4.5 text-emerald-300" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">
            {appConfig.product}
          </p>
          <p className="truncate text-[11px] text-emerald-200/70">{appConfig.name}</p>
        </div>
      </div>

      <div className="mx-5 mb-3 flex items-center gap-2 rounded-app bg-white/5 px-3 py-2 ring-1 ring-white/10">
        <RoleIcon className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
        <span className="truncate text-xs font-medium text-emerald-50">{roleLabel[role]}</span>
      </div>

      <nav
        className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4"
        aria-label={`${roleLabel[role]} navigation`}
      >
        {items.map((item) => {
          const Icon = iconForPath(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-app px-3 py-2 text-[13px] font-medium text-emerald-100/75 transition-colors hover:bg-white/5 hover:text-white',
                  isActive && 'bg-white/10 text-white shadow-sm ring-1 ring-white/10',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 text-emerald-300/60 transition-colors group-hover:text-emerald-300',
                      isActive && 'text-emerald-300',
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-3">
        <p className="text-[11px] text-emerald-200/60">
          {appConfig.apiMode === 'live' ? 'Kết nối Backend API' : 'Chế độ mock data'} - HK1
          2026-2027
        </p>
      </div>
    </aside>
  );
}
