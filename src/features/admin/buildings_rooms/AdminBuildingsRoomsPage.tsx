import { useState } from 'react';
import { Building2, Plus, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { rooms } from '@/mocks/data/dormData';
import type { Room } from '@/mocks/data/dormData';

export function AdminBuildingsRoomsPage() {
  const [rows, setRows] = useState<Room[]>(rooms);
  const [holding, setHolding] = useState<Room | null>(null);
  const [holdReason, setHoldReason] = useState('');

  const applyHold = () => {
    if (!holding || !holdReason.trim()) return;
    setRows((current) =>
      current.map((room) =>
        room.id === holding.id
          ? {
              ...room,
              status: room.status === 'maintenance-hold' ? 'available' : 'maintenance-hold',
            }
          : room,
      ),
    );
    setHolding(null);
    setHoldReason('');
  };

  const buildings = [...new Set(rows.map((room) => room.building))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tòa nhà & phòng"
        description="Quản lý tòa, phòng, giường và khóa bảo trì."
        badges={['US-006']}
        actions={
          <Button type="button" variant="secondary" disabled>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Thêm phòng (Phase 2 import)
          </Button>
        }
      />

      {buildings.map((building) => {
        const buildingRooms = rows.filter((room) => room.building === building);
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
      })}

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
            <Button type="button" disabled={!holdReason.trim()} onClick={applyHold}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
