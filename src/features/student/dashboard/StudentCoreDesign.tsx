import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Clock3, Loader2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StudentTone = 'rose' | 'cyan' | 'green' | 'amber' | 'red' | 'slate' | 'plum';
type DemoState = 'data' | 'loading' | 'empty' | 'error';

type StudentMetric = {
  label: string;
  value: string;
  hint: string;
  tone: StudentTone;
};

type StudentPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
  metrics?: StudentMetric[];
  children: ReactNode;
};

type StudentMetricCardProps = StudentMetric;

type StudentStatusPillProps = {
  children: ReactNode;
  tone?: StudentTone;
};

type StudentStateTabsProps = {
  value: DemoState;
  onChange: (value: DemoState) => void;
};

type StudentStatePanelProps = {
  state: DemoState;
  emptyTitle: string;
  emptyDescription: string;
  errorTitle?: string;
  errorDescription?: string;
  children: ReactNode;
};

type StudentTimelineItem = {
  title: string;
  description: string;
  meta?: string;
  done?: boolean;
  tone?: StudentTone;
};

type StudentTimelineProps = {
  items: StudentTimelineItem[];
};

const toneClass: Record<StudentTone, string> = {
  rose: 'border-[#f2cdd4] bg-[#fff1f5] text-[#a72c3a]',
  cyan: 'border-[#c8f2f3] bg-[#e9fbfc] text-[#087e82]',
  green: 'border-[#c9f0db] bg-[#e7f8ef] text-[#16845c]',
  amber: 'border-[#f9e5a6] bg-[#fff6d8] text-[#b54708]',
  red: 'border-[#ffcfd7] bg-[#ffe8ec] text-[#c91d2e]',
  slate: 'border-[#f2cdd4] bg-[#fff9fb] text-[#667085]',
  plum: 'border-[#ead6dd] bg-[#2a0f1a] text-white',
};

const accentClass: Record<StudentTone, string> = {
  rose: 'bg-[#a72c3a]',
  cyan: 'bg-[#26c6c9]',
  green: 'bg-[#20a676]',
  amber: 'bg-[#e6b84a]',
  red: 'bg-[#c91d2e]',
  slate: 'bg-[#667085]',
  plum: 'bg-[#2a0f1a]',
};

const textClass: Record<StudentTone, string> = {
  rose: 'text-[#a72c3a]',
  cyan: 'text-[#087e82]',
  green: 'text-[#20a676]',
  amber: 'text-[#b54708]',
  red: 'text-[#c91d2e]',
  slate: 'text-[#667085]',
  plum: 'text-[#2a0f1a]',
};

export function StudentStatusPill({ children, tone = 'slate' }: StudentStatusPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn('h-6 rounded-lg border px-2 text-xs font-semibold', toneClass[tone])}
    >
      {children}
    </Badge>
  );
}

export function StudentMetricCard({ label, value, hint, tone }: StudentMetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
      <div className={cn('absolute inset-x-0 top-0 h-1', accentClass[tone])} />
      <CardContent className="p-4 pt-5">
        <p className="text-2xl font-bold leading-none text-[#101828] sm:text-3xl">{value}</p>
        <p className="mt-2 text-sm font-semibold text-[#667085]">{label}</p>
        <p className={cn('mt-2 text-xs', textClass[tone])}>{hint}</p>
      </CardContent>
    </Card>
  );
}

export function StudentPageShell({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  metrics = [],
  children,
}: StudentPageShellProps) {
  return (
    <section className="min-h-[calc(100vh-4rem)] rounded-[18px] bg-[#fff7f9] p-4 text-[#101828] sm:p-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#a72c3a]">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{description}</p>
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-2">
              {secondaryAction && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#f2cdd4] bg-white text-[#a72c3a] hover:bg-[#fff1f5]"
                >
                  {secondaryAction}
                </Button>
              )}
              {primaryAction && (
                <Button type="button" className="bg-[#a72c3a] text-white hover:bg-[#8f2633]">
                  {primaryAction}
                </Button>
              )}
            </div>
          )}
        </header>

        {metrics.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <StudentMetricCard key={metric.label} {...metric} />
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}

export function StudentStateTabs({ value, onChange }: StudentStateTabsProps) {
  const states: DemoState[] = ['data', 'loading', 'empty', 'error'];

  return (
    <div className="flex flex-wrap gap-2">
      {states.map((state) => (
        <Button
          key={state}
          type="button"
          size="sm"
          variant={value === state ? 'default' : 'outline'}
          className={
            value === state
              ? 'bg-[#a72c3a] text-white hover:bg-[#8f2633]'
              : 'border-[#f2cdd4] bg-white text-[#667085] hover:bg-[#fff1f5]'
          }
          onClick={() => onChange(state)}
        >
          {state}
        </Button>
      ))}
    </div>
  );
}

export function StudentStatePanel({
  state,
  emptyTitle,
  emptyDescription,
  errorTitle = 'Không tải được dữ liệu',
  errorDescription = 'Đây là mock error state để nhóm demo luồng empty/loading/error.',
  children,
}: StudentStatePanelProps) {
  if (state === 'loading') {
    return (
      <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
        <CardContent className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full bg-[#f6dfe5]" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (state === 'empty') {
    return (
      <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
        <CardContent className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </CardContent>
      </Card>
    );
  }

  if (state === 'error') {
    return (
      <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
        <CardContent className="p-4">
          <Alert variant="destructive" className="border-[#ffcfd7] bg-[#fff1f5]">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>{errorDescription}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

export function StudentTimeline({ items }: StudentTimelineProps) {
  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        const tone = item.tone ?? (item.done ? 'green' : 'amber');
        const Icon = item.done ? CheckCircle2 : index === 0 ? Loader2 : Clock3;

        return (
          <div key={item.title} className="flex gap-3">
            <div
              className={cn(
                'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                toneClass[tone],
              )}
            >
              <Icon className={cn('h-4 w-4', !item.done && index === 0 && 'animate-spin')} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#101828]">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#667085]">{item.description}</p>
              {item.meta && <p className="mt-1 text-xs font-semibold text-[#a72c3a]">{item.meta}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StudentSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
      <CardHeader>
        <CardTitle className="text-base font-bold text-[#101828]">{title}</CardTitle>
        {description && <p className="text-sm leading-6 text-[#667085]">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}