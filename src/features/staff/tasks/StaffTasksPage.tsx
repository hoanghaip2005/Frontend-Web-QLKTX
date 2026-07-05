import { useState } from 'react';
import { CheckCircle2, Eye, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(null);

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
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTask(task)}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Chi tiết
                          </Button>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedTask !== null} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>Nhiệm vụ {selectedTask?.code}</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-3 text-sm">
              <div className="rounded-app border border-slate-200 p-3 text-slate-700">
                {selectedTask.description || 'Không có mô tả.'}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-app bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-400">Ưu tiên</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedTask.priority} />
                  </div>
                </div>
                <div className="rounded-app bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-400">Trạng thái</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedTask.status} />
                  </div>
                </div>
                <div className="rounded-app bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-400">Phụ trách</p>
                  <p className="mt-1 font-medium text-slate-900">{selectedTask.assignee ?? '-'}</p>
                </div>
                <div className="rounded-app bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-400">Hạn xử lý</p>
                  <p className="mt-1 font-medium text-slate-900">{selectedTask.dueAt ?? '-'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
