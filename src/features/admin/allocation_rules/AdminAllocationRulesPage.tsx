import { useState } from 'react';
import { Scale } from 'lucide-react';

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
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { fetchAllocationRules, setRuleEnabled } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { AllocationRule } from '@/mocks/data/dormData';

export function AdminAllocationRulesPage() {
  const { data: rules, loading, error, reload } = useAsyncData(fetchAllocationRules);
  const [toggling, setToggling] = useState<AllocationRule | null>(null);
  const [toggleReason, setToggleReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const applyToggle = async () => {
    if (!toggling || !toggleReason.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await setRuleEnabled(toggling, !toggling.enabled, toggleReason);
      setToggling(null);
      setToggleReason('');
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không cập nhật được rule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Luật phân phòng"
        description="Rule bắt buộc luôn bật; bật/tắt rule ưu tiên cần lý do."
        badges={['US-008', 'US-009']}
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Bộ rule hiện hành</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Giới tính, sức chứa, trạng thái phòng, ưu tiên và khóa/ngành.
            </p>
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
                  {(rules ?? []).map((rule) => (
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
                        {rule.type === 'Bắt buộc' ? (
                          <span className="text-xs text-slate-400">Không thể tắt</span>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setToggling(rule)}
                          >
                            {rule.enabled ? 'Tắt rule' : 'Bật rule'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={toggling !== null} onOpenChange={(open) => !open && setToggling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {toggling?.enabled ? 'Tắt' : 'Bật'} rule {toggling?.name}
            </DialogTitle>
            <DialogDescription>
              Thay đổi rule ảnh hưởng trực tiếp tới gợi ý phân phòng. Lý do được ghi vào audit log
              và áp dụng cho các gợi ý mới.
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
            <Button
              type="button"
              disabled={!toggleReason.trim() || saving}
              onClick={() => void applyToggle()}
            >
              {saving ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
