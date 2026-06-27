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
  Active: 'border-[#147a59] bg-[#e3f6ec] text-[#147a59]',
  Enabled: 'border-[#147a59] bg-[#e3f6ec] text-[#147a59]',
  Ready: 'border-[#147a59] bg-[#e3f6ec] text-[#147a59]',
  Available: 'border-[#147a59] bg-[#e3f6ec] text-[#147a59]',
  Draft: 'border-[#f7c948] bg-[#fff4cc] text-[#8a5a00]',
  Review: 'border-[#f7c948] bg-[#fff4cc] text-[#8a5a00]',
  'Pending review': 'border-[#f7c948] bg-[#fff4cc] text-[#8a5a00]',
  'Needs review': 'border-[#f7c948] bg-[#fff4cc] text-[#8a5a00]',
  Locked: 'border-[#c9354f] bg-[#ffe5eb] text-[#c9354f]',
  Disabled: 'border-[#f2b8c8] bg-white text-[#76525f]',
  Full: 'border-[#f2b8c8] bg-white text-[#76525f]',
  Deferred: 'border-[#f2b8c8] bg-white text-[#76525f]',
  'Deferred export': 'border-[#f2b8c8] bg-white text-[#76525f]',
  High: 'border-[#c9354f] bg-[#ffe5eb] text-[#c9354f]',
  Info: 'border-[#26c6c9] bg-[#e9fbfb] text-[#0b7174]',
  'Maintenance hold': 'border-[#c9354f] bg-[#ffe5eb] text-[#c9354f]',
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
    <div className="flex flex-col gap-4 rounded-lg border border-[#f2b8c8] bg-white px-4 py-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffe5eb] text-[#7a1632] ring-1 ring-[#f2b8c8]">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <Badge variant="outline" className="border-[#f2b8c8] text-[#32121d]">
            {eyebrow}
          </Badge>
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="bg-[#fff1f5] text-[#76525f]">
              {badge}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-[26px] font-bold leading-[35px] text-[#32121d]">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#76525f]">{description}</p>
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
        <Card
          key={metric.label}
          size="sm"
          className="relative rounded-lg border border-[#f2b8c8] ring-0"
        >
          <div className="absolute left-0 top-0 h-1 w-full bg-[#0f9f8f]" />
          <CardContent>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#32121d]">{metric.label}</p>
                <p className="mt-2 text-[27px] font-bold leading-none text-[#32121d]">
                  {metric.value}
                </p>
              </div>
              <Badge
                variant={metric.tone ?? 'secondary'}
                className="border-[#f2b8c8] bg-[#fff1f5] text-[#76525f]"
              >
                {metric.trend}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-[#76525f]">{metric.hint}</p>
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
    <Card className={cn('rounded-lg border border-[#f2b8c8] bg-white ring-0', className)}>
      <CardHeader>
        <CardTitle className="text-[17px] font-bold text-[#32121d]">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-[#76525f]">{description}</CardDescription>
        ) : null}
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
    <div className="rounded-lg border border-dashed border-[#f2b8c8] bg-[#fff1f5] px-3 py-2 text-xs leading-5 text-[#76525f]">
      {children}
    </div>
  );
}

export function EmptyStateLine({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#f2b8c8] bg-white px-4 py-5 text-center">
      <p className="text-sm font-semibold text-[#32121d]">{title}</p>
      <p className="mt-1 text-sm text-[#76525f]">{description}</p>
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
      <div className="mb-1 flex items-center justify-between text-xs text-[#76525f]">
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
    <Button
      type="button"
      variant={variant}
      className="border-[#f2b8c8] data-[variant=secondary]:bg-white data-[variant=secondary]:text-[#7a1632] data-[variant=outline]:text-[#7a1632]"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
