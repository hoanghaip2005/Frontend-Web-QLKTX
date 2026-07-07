import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';

type PageHeaderProps = {
  title: string;
  description: string;
  badges?: string[];
  actions?: ReactNode;
};

const internalStoryPattern = /\bUS-\d{3}\b/;

export function PageHeader({ title, description, badges = [], actions }: PageHeaderProps) {
  const visibleBadges = badges.filter((badge) => !internalStoryPattern.test(badge));

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-950">{title}</h1>
          {visibleBadges.map((badge) => (
            <Badge key={badge} variant="outline" className="text-slate-500">
              {badge}
            </Badge>
          ))}
        </div>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
