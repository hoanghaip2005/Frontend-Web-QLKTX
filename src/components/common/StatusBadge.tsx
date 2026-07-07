import { Badge } from '@/components/ui/badge';
import { getStatusMeta, type StatusTone } from '@/lib/formatters/status';
import { cn } from '@/lib/utils/cn';

const toneClass: Record<StatusTone, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-800',
  neutral: 'bg-slate-100 text-slate-700',
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const entry = getStatusMeta(status);
  return (
    <Badge variant="secondary" className={cn(toneClass[entry.tone], className)}>
      {entry.label}
    </Badge>
  );
}
