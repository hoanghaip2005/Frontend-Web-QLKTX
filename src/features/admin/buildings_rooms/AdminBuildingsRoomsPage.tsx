import { useState } from 'react';
import { Building2, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Textarea } from '@/components/ui/textarea';
import { fetchRooms, setRoomMaintenance } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Room } from '@/mocks/data/dormData';

export function AdminBuildingsRoomsPage() {
  const { data, loading, error, reload } = useAsyncData(fetchRooms);
  const [holding, setHolding] = useState<Room | null>(null);
  const [holdReason, setHoldReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const rooms = data ?? [];

  const applyHold = async () => {
    if (!holding || !holdReason.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await setRoomMaintenance(holding, holding.status !== 'maintenance-hold');
      setHolding(null);
      setHoldReason('');
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không cập nhật được phòng');
    } finally {
      setSaving(false);
    }
  };

  const buildings = [...new Set(rooms.map((room) => room.building))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tòa nhà & phòng"
        description="Quản lý tòa, phòng, giường và khóa bảo trì từ backend."
        badges={['US-006']}
      />

      {(error || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Không tải/cập nhật được dữ liệu</AlertTitle>
          <AlertDescription>{error ?? actionError}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : buildings.length === 0 ? (
        <EmptyState title="Chưa có phòng" description="Chạy seed backend để tạo tòa, phòng, giường demo." />
      ) : (
        buildings.map((building) => {
          const buildingRooms = rooms.filter((room) => room.building === building);
          const totalBeds = buildingRooms.reduce((sum, room) => sum + room.capacity, 0);
          const occupiedBeds = buildingRooms.reduce((sum, room) => sum + room.occupied, 0);

          return (
            <Card key={building}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    <h2 className="text-base font-semibold text-slate-950">{building}</h2>
                  </div>
                  <p className="text-sm text-slate-500">
                    {occupiedBeds}/{totalBeds} giường đang sử dụng
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phòng</TableHead>
                        <TableHead>Tầng</TableHead>
                        <TableHead>Giới tính</TableHead>
                        <TableHead>Sức chứa</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {buildingRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.id}</TableCell>
                          <TableCell>{room.floor}</TableCell>
                          <TableCell>{room.gender}</TableCell>
                          <TableCell>
                            {room.occupied}/{room.capacity}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={room.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setHolding(room)}
                            >
                              <Wrench className="h-4 w-4" aria-hidden="true" />
                              {room.status === 'maintenance-hold' ? 'Mở khóa bảo trì' : 'Khóa bảo trì'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      <Dialog open={holding !== null} onOpenChange={(open) => !open && setHolding(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {holding?.status === 'maintenance-hold' ? 'Mở khóa bảo trì' : 'Khóa bảo trì'} phòng{' '}
              {holding?.id}
            </DialogTitle>
            <DialogDescription>
              Phòng bị khóa bảo trì sẽ bị loại khỏi gợi ý phân phòng. Lý do được ghi vào audit log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: sửa hệ thống điện tầng, chống thấm..."
            value={holdReason}
            onChange={(event) => setHoldReason(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setHolding(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={!holdReason.trim() || saving} onClick={() => void applyHold()}>
              {saving ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
