import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { AlertCircle, Download, Search } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type OpsTone = 'rose' | 'cyan' | 'green' | 'amber' | 'red' | 'slate';
type DemoState = 'data' | 'loading' | 'empty' | 'error';

export type OpsMetric = {
  label: string;
  value: string;
  hint: string;
  tone: OpsTone;
};

export type WorkflowStep = {
  title: string;
  description: string;
  tone?: OpsTone;
};

export type StaffColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type StaffOpsScreenProps<T extends { id: string }> = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  metrics: OpsMetric[];
  searchPlaceholder: string;
  chips: string[];
  rows: T[];
  columns: StaffColumn<T>[];
  searchText: (row: T) => string;
  workflowTitle: string;
  workflow: WorkflowStep[];
  decisionDescription: string;
  decisionTag: string;
  detailTitle: (row: T) => string;
  detailDescription: (row: T) => string;
  renderDetails: (row: T) => ReactNode;
};

const toneClass: Record<OpsTone, string> = {
  rose: 'bg-[#fff1f5] text-[#a72c3a] border-[#f2cdd4]',
  cyan: 'bg-[#e9fbfc] text-[#087e82] border-[#c8f2f3]',
  green: 'bg-[#e7f8ef] text-[#16845c] border-[#c9f0db]',
  amber: 'bg-[#fff6d8] text-[#b54708] border-[#f9e5a6]',
  red: 'bg-[#ffe8ec] text-[#c91d2e] border-[#ffcfd7]',
  slate: 'bg-[#fff9fb] text-[#667085] border-[#f2cdd4]',
};

const accentClass: Record<OpsTone, string> = {
  rose: 'bg-[#a72c3a]',
  cyan: 'bg-[#26c6c9]',
  green: 'bg-[#20a676]',
  amber: 'bg-[#e6b84a]',
  red: 'bg-[#c91d2e]',
  slate: 'bg-[#667085]',
};

const textClass: Record<OpsTone, string> = {
  rose: 'text-[#a72c3a]',
  cyan: 'text-[#087e82]',
  green: 'text-[#20a676]',
  amber: 'text-[#b54708]',
  red: 'text-[#c91d2e]',
  slate: 'text-[#667085]',
};

export function StatusPill({ children, tone = 'slate' }: { children: ReactNode; tone?: OpsTone }) {
  return (
    <Badge
      variant="outline"
      className={cn('h-6 rounded-lg border px-2 text-xs font-semibold', toneClass[tone])}
    >
      {children}
    </Badge>
  );
}

export function StaffOpsScreen<T extends { id: string }>(props: StaffOpsScreenProps<T>) {
  const [query, setQuery] = useState('');
  const [demoState, setDemoState] = useState<DemoState>('data');
  const [selected, setSelected] = useState<T | null>(null);

  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return props.rows;
    return props.rows.filter((row) => props.searchText(row).toLowerCase().includes(keyword));
  }, [props, query]);

  const visibleRows = demoState === 'empty' ? [] : filteredRows;

  return (
    <>
      <section className="min-h-[calc(100vh-4rem)] rounded-[18px] bg-[#fff7f9] p-4 text-[#101828] sm:p-6">
        <div className="mx-auto max-w-[1220px] space-y-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#a72c3a]">{props.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">{props.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
                {props.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[#f2cdd4] bg-white text-[#a72c3a] hover:bg-[#fff1f5]"
              >
                <Download className="h-4 w-4" />
                Xuất file
              </Button>

              <Button type="button" className="bg-[#a72c3a] text-white hover:bg-[#8f2633]">
                {props.primaryAction}
              </Button>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {props.metrics.map((metric) => (
              <Card
                key={metric.label}
                className="relative overflow-hidden border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]"
              >
                <div className={cn('absolute inset-x-0 top-0 h-1', accentClass[metric.tone])} />
                <CardContent className="p-4 pt-5">
                  <p className="text-3xl font-bold leading-none">{metric.value}</p>
                  <p className="mt-2 text-sm font-semibold text-[#667085]">{metric.label}</p>
                  <p className={cn('mt-2 text-xs', textClass[metric.tone])}>{metric.hint}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-4">
              <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
                <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full lg:max-w-[280px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={props.searchPlaceholder}
                      className="h-10 border-[#e8d5da] bg-white pl-9 text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {props.chips.map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex h-7 items-center rounded-lg bg-[#fff9fb] px-3 text-xs font-semibold text-[#667085]"
                      >
                        {chip}
                      </span>
                    ))}

                    {(['data', 'loading', 'empty', 'error'] as const).map((state) => (
                      <Button
                        key={state}
                        type="button"
                        size="sm"
                        variant={demoState === state ? 'default' : 'outline'}
                        className={
                          demoState === state
                            ? 'bg-[#a72c3a] text-white hover:bg-[#8f2633]'
                            : 'border-[#f2cdd4] bg-white text-[#667085] hover:bg-[#fff1f5]'
                        }
                        onClick={() => setDemoState(state)}
                      >
                        {state}
                      </Button>
                    ))}
                  </div>

                  <Button type="button" className="bg-[#a72c3a] text-white hover:bg-[#8f2633]">
                    {props.primaryAction}
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
                {demoState === 'loading' && (
                  <div className="space-y-3 p-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full bg-[#f6dfe5]" />
                    ))}
                  </div>
                )}

                {demoState === 'error' && (
                  <div className="p-4">
                    <Alert variant="destructive" className="border-[#ffcfd7] bg-[#fff1f5]">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Không tải được dữ liệu</AlertTitle>
                      <AlertDescription>
                        Đây là mock error state để nhóm demo luồng empty/loading/error.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {demoState !== 'loading' && demoState !== 'error' && visibleRows.length === 0 && (
                  <div className="p-4">
                    <EmptyState
                      title="Không có dữ liệu phù hợp"
                      description="Đổi từ khóa tìm kiếm hoặc bấm Data để quay lại dữ liệu demo."
                    />
                  </div>
                )}

                {demoState === 'data' && visibleRows.length > 0 && (
                  <Table>
                    <TableHeader className="bg-[#fff9fb]">
                      <TableRow className="border-[#f2cdd4] hover:bg-[#fff9fb]">
                        {props.columns.map((column) => (
                          <TableHead
                            key={column.key}
                            className={cn('text-xs font-semibold text-[#667085]', column.className)}
                          >
                            {column.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {visibleRows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="cursor-pointer border-[#f2cdd4] hover:bg-[#fff9fb]"
                          onClick={() => setSelected(row)}
                        >
                          {props.columns.map((column) => (
                            <TableCell key={column.key} className={cn('text-[#667085]', column.className)}>
                              {column.render(row)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>

              <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)]">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold">Thao tác tiếp theo</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
                      {props.decisionDescription}
                    </p>
                  </div>
                  <StatusPill tone="cyan">{props.decisionTag}</StatusPill>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#f2cdd4] bg-white shadow-[0px_4px_14px_-4px_rgba(16,24,40,0.08)] xl:min-h-[438px]">
              <CardHeader>
                <CardTitle className="text-base font-bold">{props.workflowTitle}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-7">
                {props.workflow.map((step, index) => (
                  <div key={step.title} className="flex gap-3">
                    <span
                      className={cn(
                        'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                        accentClass[step.tone ?? (index < 2 ? 'green' : 'amber')],
                      )}
                    />
                    <div>
                      <h3 className="text-sm font-bold">{step.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#667085]">{step.description}</p>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 border-[#f2cdd4] bg-white text-[#a72c3a] hover:bg-[#fff1f5]"
                >
                  Mở bảng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="border-[#f2cdd4] sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{props.detailTitle(selected)}</SheetTitle>
                <SheetDescription>{props.detailDescription(selected)}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4 px-4 pb-4">{props.renderDetails(selected)}</div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}