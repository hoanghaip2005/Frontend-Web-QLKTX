import { cn } from '@/lib/utils/cn';

type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className="flex rounded-app border border-slate-200 bg-white p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition',
            activeId === item.id && 'bg-brand-50 text-brand-700',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
