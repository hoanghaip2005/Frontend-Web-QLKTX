import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type AdminTone = 'primary' | 'cyan' | 'green' | 'amber' | 'danger' | 'pink' | 'neutral';

export type AdminOverviewMetric = {
  value: string;
  label: string;
  hint: string;
  accent: AdminTone;
};

export type AdminTableHeader = {
  label: string;
  className?: string;
};

export type AdminTableCell =
  | ReactNode
  | {
      text: ReactNode;
      tone: AdminTone;
      strong?: boolean;
      className?: string;
    };

export type AdminContextItem = {
  title: string;
  description: string;
  tone: AdminTone;
};

export type FigmaAdminPageProps = {
  title: string;
  scope: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  metrics: readonly AdminOverviewMetric[];
  searchPlaceholder: string;
  tableHeaders: readonly AdminTableHeader[];
  tableRows: readonly (readonly AdminTableCell[])[];
  contextTitle: string;
  contextItems: readonly AdminContextItem[];
  footerDescription: string;
  footerChip: string;
};

const accentClassName: Record<AdminTone, string> = {
  primary: 'bg-[#a72c3a]',
  cyan: 'bg-[#26c6c9]',
  green: 'bg-[#20a676]',
  amber: 'bg-[#e6b84a]',
  danger: 'bg-[#c91d2e]',
  pink: 'bg-[#fff1f5]',
  neutral: 'bg-[#fff9fb]',
};

const hintClassName: Record<AdminTone, string> = {
  primary: 'text-[#a72c3a]',
  cyan: 'text-[#087e82]',
  green: 'text-[#20a676]',
  amber: 'text-[#b54708]',
  danger: 'text-[#c91d2e]',
  pink: 'text-[#a72c3a]',
  neutral: 'text-[#667085]',
};

const badgeClassName: Record<AdminTone, string> = {
  primary: 'bg-[#fff1f5] text-[#a72c3a]',
  cyan: 'bg-[#e9fbfc] text-[#087e82]',
  green: 'bg-[#e7f8ef] text-[#20a676]',
  amber: 'bg-[#fff6d8] text-[#b54708]',
  danger: 'bg-[#ffe8ec] text-[#c91d2e]',
  pink: 'bg-[#fff1f5] text-[#a72c3a]',
  neutral: 'bg-[#fff9fb] text-[#667085]',
};

function isBadgeCell(cell: AdminTableCell): cell is Exclude<AdminTableCell, ReactNode> {
  return typeof cell === 'object' && cell !== null && 'tone' in cell && 'text' in cell;
}

function AdminStatusPill({
  tone,
  children,
  className,
}: {
  tone: AdminTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-7 min-w-16 items-center justify-center rounded-md px-3 text-xs font-semibold',
        badgeClassName[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

function AdminMetricCard({ metric }: { metric: AdminOverviewMetric }) {
  return (
    <Card className="relative overflow-hidden rounded-lg border border-[#f2cdd4] bg-white py-0 shadow-[0_14px_30px_rgba(122,22,50,0.08)] ring-0">
      <div className={cn('h-1 w-full', accentClassName[metric.accent])} />
      <CardContent className="px-4 py-4">
        <p className="text-[29px] font-bold leading-8 text-[#101828]">{metric.value}</p>
        <p className="mt-1 text-sm font-semibold text-[#667085]">{metric.label}</p>
        <p className={cn('mt-1 text-xs font-semibold', hintClassName[metric.accent])}>
          {metric.hint}
        </p>
      </CardContent>
    </Card>
  );
}

export function FigmaAdminPage({
  title,
  scope,
  primaryActionLabel,
  secondaryActionLabel,
  metrics,
  searchPlaceholder,
  tableHeaders,
  tableRows,
  contextTitle,
  contextItems,
  footerDescription,
  footerChip,
}: FigmaAdminPageProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-[31px] text-[#101828]">{title}</h1>
          <p className="text-sm leading-[18px] text-[#667085]">Phạm vi: QT / {scope}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {secondaryActionLabel ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[#e58ba4] bg-white px-5 text-sm font-semibold text-[#7a1632] hover:bg-[#fff1f5]"
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-10 bg-[#a72c3a] px-5 text-sm font-semibold text-white hover:bg-[#8f2434]"
          >
            {primaryActionLabel}
          </Button>
        </div>
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AdminMetricCard key={`${metric.label}-${metric.value}`} metric={metric} />
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <Card className="rounded-lg border border-[#f2cdd4] bg-white py-3 shadow-[0_10px_24px_rgba(122,22,50,0.06)] ring-0">
            <CardContent className="flex flex-col gap-3 px-4 md:flex-row md:items-center">
              <Input
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                className="h-10 border-[#e8d5da] bg-white text-sm placeholder:text-[#667085] md:w-[254px]"
              />
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#667085]">
                <span className="rounded-md bg-[#fff9fb] px-3 py-2">Trạng thái: Tất cả</span>
                <span className="rounded-md bg-[#fff9fb] px-3 py-2">Kỳ: 2026</span>
              </div>
              <Button
                type="button"
                className="h-10 bg-[#a72c3a] px-5 text-sm font-semibold text-white hover:bg-[#8f2434] md:ml-auto md:w-[146px]"
              >
                {primaryActionLabel}
              </Button>
            </CardContent>
          </Card>

          <Card className="min-h-[470px] overflow-hidden rounded-lg border border-[#f2cdd4] bg-white py-0 shadow-[0_10px_24px_rgba(122,22,50,0.06)] ring-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#f2cdd4] bg-[#fff9fb] hover:bg-[#fff9fb]">
                    {tableHeaders.map((header) => (
                      <TableHead
                        key={header.label}
                        className={cn(
                          'h-11 px-4 text-xs font-semibold text-[#667085]',
                          header.className,
                        )}
                      >
                        {header.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row, rowIndex) => (
                    <TableRow
                      key={`${title}-${rowIndex}`}
                      className="border-[#f2cdd4] hover:bg-[#fff9fb]"
                    >
                      {row.map((cell, cellIndex) => {
                        const badgeCell = isBadgeCell(cell);

                        return (
                          <TableCell
                            key={`${title}-${rowIndex}-${cellIndex}`}
                            className={cn(
                              'h-[54px] px-4 py-4 text-sm text-[#667085]',
                              cellIndex === 0 && 'font-bold text-[#101828]',
                              badgeCell && cell.className,
                            )}
                          >
                            {badgeCell ? (
                              <AdminStatusPill tone={cell.tone}>{cell.text}</AdminStatusPill>
                            ) : (
                              cell
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-[#f2cdd4] bg-white shadow-[0_10px_24px_rgba(122,22,50,0.06)] ring-0">
            <CardContent className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-[#101828]">Thao tác tiếp theo</p>
                <p className="mt-1 text-sm leading-5 text-[#667085]">{footerDescription}</p>
              </div>
              <AdminStatusPill tone="cyan" className="w-fit">
                {footerChip}
              </AdminStatusPill>
            </CardContent>
          </Card>
        </div>

        <Card className="min-h-[616px] rounded-lg border border-[#f2cdd4] bg-white shadow-[0_14px_30px_rgba(122,22,50,0.08)] ring-0">
          <CardContent className="flex h-full flex-col px-5 py-5">
            <h2 className="text-lg font-bold text-[#101828]">{contextTitle}</h2>
            <div className="mt-5 space-y-6">
              {contextItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span
                    className={cn('mt-1.5 h-2.5 w-2.5 rounded-full', accentClassName[item.tone])}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#101828]">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[#667085]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-auto h-10 w-28 border-[#f2cdd4] bg-white text-sm font-semibold text-[#a72c3a] hover:bg-[#fff1f5]"
            >
              Mở bảng
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
