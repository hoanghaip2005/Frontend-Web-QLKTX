import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AdminMetric, BadgeTone } from '@/features/admin/data';
import { cn } from '@/lib/utils';

type AdminPageHeaderProps = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  badges?: string[];
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

type AdminMetricGridProps = {
  metrics: AdminMetric[];
};

type SectionPanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

type StatusBadgeProps = {
  status: string;
  tone?: BadgeTone;
};

const statusClassName = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Enabled: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Ready: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Draft: 'border-amber-200 bg-amber-50 text-amber-700',
  Review: 'border-amber-200 bg-amber-50 text-amber-700',
  'Pending review': 'border-amber-200 bg-amber-50 text-amber-700',
  'Needs review': 'border-amber-200 bg-amber-50 text-amber-700',
  Locked: 'border-rose-200 bg-rose-50 text-rose-700',
  Disabled: 'border-slate-200 bg-slate-50 text-slate-600',
  Full: 'border-slate-200 bg-slate-50 text-slate-600',
  Deferred: 'border-slate-200 bg-slate-50 text-slate-600',
  'Deferred export': 'border-slate-200 bg-slate-50 text-slate-600',
  High: 'border-rose-200 bg-rose-50 text-rose-700',
  Info: 'border-blue-200 bg-blue-50 text-blue-700',
  'Maintenance hold': 'border-rose-200 bg-rose-50 text-rose-700',
} as const;

export function AdminPageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  badges = ['Member 7', 'Mock data'],
  primaryAction,
  secondaryAction,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <Badge variant="outline">{eyebrow}</Badge>
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {secondaryAction}
        {primaryAction}
      </div>
    </div>
  );
}

export function AdminMetricGrid({ metrics }: AdminMetricGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} size="sm">
          <CardContent>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{metric.value}</p>
              </div>
              <Badge variant={metric.tone ?? 'secondary'}>{metric.trend}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500">{metric.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SectionPanel({
  title,
  description,
  action,
  children,
  className,
}: SectionPanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function StatusBadge({ status, tone }: StatusBadgeProps) {
  return (
    <Badge
      variant={tone ?? 'outline'}
      className={statusClassName[status as keyof typeof statusClassName]}
    >
      {status}
    </Badge>
  );
}

export function AuditHint({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
      {children}
    </div>
  );
}

export function EmptyStateLine({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-5 text-center">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function CapacityBar({
  occupied,
  total,
  className,
}: {
  occupied: number;
  total: number;
  className?: string;
}) {
  const value = Math.round((occupied / total) * 100);

  return (
    <div className={cn('min-w-40', className)}>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{value}% occupied</span>
        <span>
          {occupied}/{total}
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
}

export function IconButtonLabel({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export function AdminActionButton({
  icon: Icon,
  children,
  variant = 'secondary',
}: {
  icon: LucideIcon;
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}) {
  return (
    <Button type="button" variant={variant}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
