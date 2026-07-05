import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  icon?: LucideIcon;
};

export function MetricCard({ label, value, hint, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          {Icon && (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-app bg-brand-50">
              <Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />
            </span>
          )}
        </div>
        <p className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-2 text-sm text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}
