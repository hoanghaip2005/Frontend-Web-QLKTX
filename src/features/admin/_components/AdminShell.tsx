import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

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

export const ADMIN_SEARCH_EVENT = 'admin:search';
export const ADMIN_EXPORT_EVENT = 'admin:export';
export const ADMIN_EXPORT_READY_EVENT = 'admin:export-ready';

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

export type AdminBadgeCell = {
  text: ReactNode;
  tone: AdminTone;
  strong?: boolean;
  className?: string;
};

export type AdminTableCell = ReactNode | AdminBadgeCell;

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

export type AdminExportDetail = {
  href: string;
  fileName: string;
  rowCount: number;
};

declare global {
  interface Window {
    __adminExportLink?: AdminExportDetail;
  }
}

type SelectedRowAction = {
  action: string;
  rowName: string;
  status: string;
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

function isBadgeCell(cell: AdminTableCell): cell is AdminBadgeCell {
  return (
    typeof cell === 'object' &&
    cell !== null &&
    !Array.isArray(cell) &&
    'tone' in cell &&
    'text' in cell
  );
}

function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToText).filter(Boolean).join(' ');
  }

  return '';
}

function cellToText(cell: AdminTableCell): string {
  return isBadgeCell(cell) ? nodeToText(cell.text) : nodeToText(cell);
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function slugify(value: string): string {
  return (
    normalizeText(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'admin'
  );
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsv(
  tableHeaders: readonly AdminTableHeader[],
  rows: readonly (readonly AdminTableCell[])[],
): string {
  const csvRows = [
    tableHeaders.map((header) => header.label),
    ...rows.map((row) => tableHeaders.map((_, index) => cellToText(row[index] ?? ''))),
  ];

  return `\uFEFF${csvRows.map((row) => row.map(csvEscape).join(',')).join('\n')}`;
}

function buildCsvHref(
  tableHeaders: readonly AdminTableHeader[],
  rows: readonly (readonly AdminTableCell[])[],
): string {
  return `data:text/csv;charset=utf-8,${encodeURIComponent(buildCsv(tableHeaders, rows))}`;
}

function isDownloadAction(action: string): boolean {
  const normalizedAction = normalizeText(action);

  return normalizedAction.includes('tai') || normalizedAction.includes('xuat');
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
  const tableRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('2026');
  const [actionMessage, setActionMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState<SelectedRowAction | null>(null);

  const actionColumnIndex = Math.max(0, tableHeaders.length - 1);
  const exportBaseName = useMemo(() => slugify(title), [title]);

  const statusColumnIndex = useMemo(() => {
    return tableRows[0]?.findIndex((cell) => isBadgeCell(cell)) ?? -1;
  }, [tableRows]);

  const statusOptions = useMemo(() => {
    if (statusColumnIndex < 0) {
      return [];
    }

    const options = tableRows
      .map((row) => row[statusColumnIndex])
      .filter((cell): cell is AdminBadgeCell => Boolean(cell) && isBadgeCell(cell))
      .map((cell) => cellToText(cell))
      .filter(Boolean);

    return [...new Set(options)];
  }, [statusColumnIndex, tableRows]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = normalizeText(searchValue.trim());

    return tableRows.filter((row) => {
      const rowText = normalizeText(row.map(cellToText).join(' '));
      const rowStatus =
        statusColumnIndex >= 0 && row[statusColumnIndex]
          ? cellToText(row[statusColumnIndex])
          : '';

      const matchesSearch = normalizedSearch.length === 0 || rowText.includes(normalizedSearch);
      const matchesStatus = statusFilter === 'all' || rowStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchValue, statusFilter, statusColumnIndex, tableRows]);

  const exportDetail = useMemo<AdminExportDetail>(
    () => ({
      href: buildCsvHref(tableHeaders, filteredRows),
      fileName: `${exportBaseName}-${periodFilter}.csv`,
      rowCount: filteredRows.length,
    }),
    [exportBaseName, filteredRows, periodFilter, tableHeaders],
  );

  useEffect(() => {
    window.__adminExportLink = exportDetail;
    window.dispatchEvent(new CustomEvent(ADMIN_EXPORT_READY_EVENT, { detail: exportDetail }));
  }, [exportDetail]);

  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string }>).detail;

      setSearchValue(detail?.value ?? '');
    };

    const handleGlobalExport = () => {
      setActionMessage(`Đã xuất ${filteredRows.length} dòng ra CSV.`);
    };

    window.addEventListener(ADMIN_SEARCH_EVENT, handleGlobalSearch);
    window.addEventListener(ADMIN_EXPORT_EVENT, handleGlobalExport);

    return () => {
      window.removeEventListener(ADMIN_SEARCH_EVENT, handleGlobalSearch);
      window.removeEventListener(ADMIN_EXPORT_EVENT, handleGlobalExport);
    };
  }, [filteredRows.length]);

  const handlePageAction = useCallback(
    (label: string) => {
      setSelectedAction(null);
      setActionMessage(`Đã mở thao tác "${label}" cho phạm vi ${scope}.`);
    },
    [scope],
  );

  const handleRowAction = useCallback(
    (row: readonly AdminTableCell[], rowIndex: number) => {
      const action = cellToText(row[actionColumnIndex] ?? '');
      const rowName = cellToText(row[0] ?? '') || `Dòng ${rowIndex + 1}`;
      const status =
        statusColumnIndex >= 0 && row[statusColumnIndex]
          ? cellToText(row[statusColumnIndex])
          : 'Đã chọn';

      setSelectedAction({ action, rowName, status });

      if (isDownloadAction(action)) {
        setActionMessage(`Đã tải "${rowName}" ra CSV.`);
        return;
      }

      setActionMessage(`Đã chọn "${action}" cho "${rowName}".`);
    },
    [actionColumnIndex, statusColumnIndex],
  );

  const handleOpenTable = useCallback(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActionMessage(`Đã mở bảng ${scope}.`);
  }, [scope]);

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
              onClick={() => handlePageAction(secondaryActionLabel)}
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-10 bg-[#a72c3a] px-5 text-sm font-semibold text-white hover:bg-[#8f2434]"
            onClick={() => handlePageAction(primaryActionLabel)}
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
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onInput={(event) => setSearchValue(event.currentTarget.value)}
                className="h-10 border-[#e8d5da] bg-white text-sm placeholder:text-[#667085] md:w-[254px]"
              />
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#667085]">
                <select
                  aria-label="Lọc trạng thái"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-10 rounded-md border border-transparent bg-[#fff9fb] px-3 text-xs font-semibold text-[#667085] outline-none ring-[#a72c3a] focus:border-[#f2b8c8] focus:ring-2"
                >
                  <option value="all">Trạng thái: Tất cả</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      Trạng thái: {status}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Lọc kỳ"
                  value={periodFilter}
                  onChange={(event) => {
                    setPeriodFilter(event.target.value);
                    setActionMessage(`Đã chọn kỳ ${event.target.value}.`);
                  }}
                  className="h-10 rounded-md border border-transparent bg-[#fff9fb] px-3 text-xs font-semibold text-[#667085] outline-none ring-[#a72c3a] focus:border-[#f2b8c8] focus:ring-2"
                >
                  <option value="2026">Kỳ: 2026</option>
                  <option value="2025">Kỳ: 2025</option>
                  <option value="2024">Kỳ: 2024</option>
                </select>
              </div>
              <Button
                type="button"
                className="h-10 bg-[#a72c3a] px-5 text-sm font-semibold text-white hover:bg-[#8f2434] md:ml-auto md:w-[146px]"
                onClick={() => handlePageAction(primaryActionLabel)}
              >
                {primaryActionLabel}
              </Button>
              {actionMessage ? (
                <p
                  className="basis-full text-xs font-semibold text-[#a72c3a]"
                  aria-live="polite"
                >
                  {actionMessage}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <div ref={tableRef}>
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
                    {filteredRows.length > 0 ? (
                      filteredRows.map((row, rowIndex) => (
                        <TableRow
                          key={`${title}-${row.map(cellToText).join('-')}-${rowIndex}`}
                          className="border-[#f2cdd4] hover:bg-[#fff9fb]"
                        >
                          {row.map((cell, cellIndex) => {
                            const badgeCell = isBadgeCell(cell);
                            const isActionCell = cellIndex === actionColumnIndex && !badgeCell;
                            const actionText = isActionCell ? cellToText(cell) : '';
                            const rowName = cellToText(row[0] ?? '') || `Dòng ${rowIndex + 1}`;
                            const actionClassName =
                              'rounded-md px-2 py-1 text-left text-sm font-semibold text-[#a72c3a] outline-none hover:bg-[#fff1f5] focus-visible:ring-2 focus-visible:ring-[#a72c3a]';

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
                                ) : isActionCell && isDownloadAction(actionText) ? (
                                  <a
                                    className={actionClassName}
                                    href={buildCsvHref(tableHeaders, [row])}
                                    download={`${exportBaseName}-${slugify(rowName)}.csv`}
                                    onClick={() => handleRowAction(row, rowIndex)}
                                  >
                                    {cell}
                                  </a>
                                ) : isActionCell ? (
                                  <button
                                    type="button"
                                    className={actionClassName}
                                    onClick={() => handleRowAction(row, rowIndex)}
                                  >
                                    {cell}
                                  </button>
                                ) : (
                                  cell
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-[#f2cdd4] hover:bg-white">
                        <TableCell
                          colSpan={tableHeaders.length}
                          className="h-40 px-4 text-center text-sm font-semibold text-[#667085]"
                        >
                          Không có dòng phù hợp
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

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
            {selectedAction ? (
              <div className="mt-6 rounded-lg border border-[#f2cdd4] bg-[#fff9fb] p-3">
                <p className="text-sm font-bold text-[#101828]">{selectedAction.action}</p>
                <p className="mt-1 text-sm leading-5 text-[#667085]">
                  Hồ sơ: {selectedAction.rowName}
                </p>
                <p className="mt-1 text-sm leading-5 text-[#667085]">
                  Trạng thái: {selectedAction.status}
                </p>
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="mt-auto h-10 w-28 border-[#f2cdd4] bg-white text-sm font-semibold text-[#a72c3a] hover:bg-[#fff1f5]"
              onClick={handleOpenTable}
            >
              Mở bảng
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
