import { useMemo, useState } from 'react';
import { Pencil, Scale, Search } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { fetchAllocationRules, setRuleEnabled, updateAllocationRule } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { AllocationRule } from '@/mocks/data/dormData';

type RuleForm = {
  weight: string;
  description: string;
  reason: string;
};

const ruleTypes: Array<AllocationRule['type'] | 'all'> = ['all', 'Bắt buộc', 'Ưu tiên'];

function ruleFormFrom(rule: AllocationRule): RuleForm {
  return {
    weight: String(rule.weight),
    description: rule.description,
    reason: '',
  };
}

export function AdminAllocationRulesPage() {
  const { data: rules, loading, error, reload } = useAsyncData(fetchAllocationRules);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AllocationRule['type'] | 'all'>('all');
  const [toggling, setToggling] = useState<AllocationRule | null>(null);
  const [editing, setEditing] = useState<AllocationRule | null>(null);
  const [toggleReason, setToggleReason] = useState('');
  const [ruleForm, setRuleForm] = useState<RuleForm>({ weight: '0', description: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredRules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (rules ?? []).filter((rule) => {
      const matchesQuery =
        !normalized ||
        rule.id.toLowerCase().includes(normalized) ||
        rule.name.toLowerCase().includes(normalized) ||
        rule.description.toLowerCase().includes(normalized);
      const matchesType = typeFilter === 'all' || rule.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, rules, typeFilter]);

  const counts = useMemo(() => {
    const rows = rules ?? [];
    return {
      total: rows.length,
      required: rows.filter((rule) => rule.type === 'Bắt buộc').length,
      priority: rows.filter((rule) => rule.type === 'Ưu tiên').length,
      disabled: rows.filter((rule) => !rule.enabled).length,
    };
  }, [rules]);

  const run = async (action: () => Promise<void>) => {
    setSaving(true);
    setActionError(null);
    try {
      await action();
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không cập nhật được rule');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (rule: AllocationRule) => {
    setEditing(rule);
    setRuleForm(ruleFormFrom(rule));
  };

  const applyToggle = () => {
    if (!toggling || !toggleReason.trim()) return;
    void run(async () => {
      await setRuleEnabled(toggling, !toggling.enabled, toggleReason);
      setToggling(null);
      setToggleReason('');
    });
  };

  const applyEdit = () => {
    if (!editing || !ruleForm.description.trim() || !ruleForm.reason.trim()) {
      setActionError('Nhập mô tả và lý do thay đổi rule.');
      return;
    }
    void run(async () => {
      await updateAllocationRule(editing, {
        weight: Number(ruleForm.weight),
        description: ruleForm.description,
        reason: ruleForm.reason,
      });
      setEditing(null);
      setRuleForm({ weight: '0', description: '', reason: '' });
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Luật phân phòng"
        description="Cấu hình rule bắt buộc, rule ưu tiên, trọng số và lý do thay đổi."
        badges={['US-008', 'US-009']}
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Tổng rule', counts.total],
          ['Bắt buộc', counts.required],
          ['Ưu tiên', counts.priority],
          ['Đang tắt', counts.disabled],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-950">Bộ rule hiện hành</h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Giới tính, sức chứa, trạng thái phòng, ưu tiên chính sách và nguyện vọng.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative sm:w-72">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    className="pl-9"
                    placeholder="Tìm rule..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Tìm rule phân phòng"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value as AllocationRule['type'] | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-40" aria-label="Lọc loại rule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ruleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'Tất cả loại' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Trọng số</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <p className="font-medium">{rule.name}</p>
                        <p className="font-mono text-xs text-slate-500">{rule.id}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.type === 'Bắt buộc' ? 'default' : 'secondary'}>
                          {rule.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-sm text-sm text-slate-600">
                        {rule.description}
                      </TableCell>
                      <TableCell>{rule.weight}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            rule.enabled
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }
                        >
                          {rule.enabled ? 'Đang bật' : 'Đang tắt'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(rule)}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Sửa
                          </Button>
                          {rule.type === 'Bắt buộc' ? (
                            <span className="self-center text-xs text-slate-400">
                              Không thể tắt
                            </span>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setToggling(rule)}
                            >
                              {rule.enabled ? 'Tắt' : 'Bật'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa rule {editing?.name}</DialogTitle>
            <DialogDescription>
              Trọng số cao hơn sẽ được ưu tiên hơn khi engine gợi ý phòng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Trọng số
              <Input
                type="number"
                value={ruleForm.weight}
                onChange={(event) =>
                  setRuleForm((prev) => ({ ...prev, weight: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Mô tả
              <Textarea
                value={ruleForm.description}
                onChange={(event) =>
                  setRuleForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Lý do thay đổi *
              <Textarea
                placeholder="Ví dụ: điều chỉnh trọng số ưu tiên chính sách trong đợt cao điểm..."
                value={ruleForm.reason}
                onChange={(event) =>
                  setRuleForm((prev) => ({ ...prev, reason: event.target.value }))
                }
              />
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!ruleForm.description.trim() || !ruleForm.reason.trim() || saving}
              onClick={applyEdit}
            >
              {saving ? 'Đang lưu...' : 'Lưu rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={toggling !== null} onOpenChange={(open) => !open && setToggling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {toggling?.enabled ? 'Tắt' : 'Bật'} rule {toggling?.name}
            </DialogTitle>
            <DialogDescription>
              Thay đổi rule ảnh hưởng trực tiếp tới gợi ý phân phòng. Lý do được ghi vào audit log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: tạm tắt rule nguyện vọng trong đợt cao điểm..."
            value={toggleReason}
            onChange={(event) => setToggleReason(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setToggling(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={!toggleReason.trim() || saving} onClick={applyToggle}>
              {saving ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
