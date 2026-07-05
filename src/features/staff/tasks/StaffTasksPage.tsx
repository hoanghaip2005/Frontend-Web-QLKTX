import { useState } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchStaffTasks, setTaskStatus, type StaffTask } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StaffTasksPage() {
  const { data: tasks, loading, error, reload } = useAsyncData(fetchStaffTasks);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const complete = async (task: StaffTask) => {
    setSavingId(task.backendId);
    setActionError(null);
    try {
      await setTaskStatus(task, 'done');
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không cập nhật được nhiệm vụ');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ca trực & nhiệm vụ"
        description="Hàng chờ công việc vận hành lấy trực tiếp từ backend."
        actions={
          <Button type="button" variant="secondary" onClick={reload}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Làm mới
          </Button>
        }
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Nhiệm vụ vận hành</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : !tasks?.length ? (
            <EmptyState title="Không có nhiệm vụ" description="Nhiệm vụ mới sẽ xuất hiện tại đây." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Nhiệm vụ</TableHead>
                    <TableHead>Ưu tiên</TableHead>
                    <TableHead>Phụ trách</TableHead>
                    <TableHead>Hạn xử lý</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.backendId}>
                      <TableCell className="font-mono text-xs">{task.code}</TableCell>
                      <TableCell>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-500">{task.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={task.priority} />
                      </TableCell>
                      <TableCell>{task.assignee ?? '-'}</TableCell>
                      <TableCell>{task.dueAt ?? '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={task.status === 'done' || savingId === task.backendId}
                          onClick={() => void complete(task)}
                        >
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          Hoàn tất
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
