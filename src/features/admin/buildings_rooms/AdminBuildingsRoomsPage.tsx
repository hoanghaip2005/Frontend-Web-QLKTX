import { useMemo, useState } from 'react';
import { BedDouble, Building2, Eye, Pencil, Plus, Search, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
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
import { EmptyState } from '@/components/ui/empty-state';
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
import {
  createBuilding,
  createRoom,
  fetchBuildings,
  fetchRoomAssets,
  fetchRooms,
  setRoomMaintenance,
  updateBuilding,
  updateRoomDetails,
  type Building,
  type RoomAsset,
  type UpsertBuildingInput,
  type UpsertRoomInput,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Room } from '@/mocks/data/dormData';

type BuildingForm = {
  code: string;
  name: string;
  address: string;
  floorsCount: string;
  genderPolicy: NonNullable<UpsertBuildingInput['genderPolicy']>;
  status: UpsertBuildingInput['status'];
  note: string;
};

type RoomForm = {
  buildingId: string;
  roomCode: string;
  roomNo: string;
  floor: string;
  capacity: string;
  gender: UpsertRoomInput['gender'];
  status: UpsertRoomInput['status'];
  monthlyPrice: string;
  note: string;
};

const emptyBuildingForm: BuildingForm = {
  code: '',
  name: '',
  address: '',
  floorsCount: '5',
  genderPolicy: 'other',
  status: 'active',
  note: '',
};

const emptyRoomForm: RoomForm = {
  buildingId: '',
  roomCode: '',
  roomNo: '',
  floor: '1',
  capacity: '4',
  gender: 'male',
  status: 'available',
  monthlyPrice: '450000',
  note: '',
};

const buildingStatusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'closed', label: 'Đóng' },
] as const;

const roomStatusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'available', label: 'Còn chỗ' },
  { value: 'full', label: 'Đầy' },
  { value: 'maintenance-hold', label: 'Khóa bảo trì' },
] as const;

const genderPolicyLabel: Record<NonNullable<UpsertBuildingInput['genderPolicy']>, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Linh hoạt',
};

function roomNoFromCode(code: string) {
  return code.split('-').at(-1)?.trim() || code.trim();
}

function formFromBuilding(building: Building): BuildingForm {
  return {
    code: building.code,
    name: building.name,
    address: building.address ?? '',
    floorsCount: String(building.floorsCount ?? 1),
    genderPolicy: building.genderPolicy ?? 'other',
    status: building.status,
    note: '',
  };
}

function formFromRoom(room: Room): RoomForm {
  return {
    buildingId: room.buildingId ?? '',
    roomCode: room.id,
    roomNo: roomNoFromCode(room.id),
    floor: String(room.floor),
    capacity: String(room.capacity),
    gender: room.gender === 'Nữ' ? 'female' : 'male',
    status: room.status === 'maintenance-hold' ? 'maintenance' : room.status,
    monthlyPrice: '450000',
    note: '',
  };
}

function toBuildingInput(form: BuildingForm): UpsertBuildingInput {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    address: form.address.trim() || undefined,
    floorsCount: Number(form.floorsCount),
    genderPolicy: form.genderPolicy,
    status: form.status,
    note: form.note.trim() || undefined,
  };
}

function toRoomInput(form: RoomForm): UpsertRoomInput {
  return {
    buildingId: form.buildingId,
    roomCode: form.roomCode.trim(),
    roomNo: form.roomNo.trim() || roomNoFromCode(form.roomCode),
    floor: Number(form.floor),
    capacity: Number(form.capacity),
    gender: form.gender,
    status: form.status,
    monthlyPrice: Number(form.monthlyPrice || 0),
    note: form.note.trim() || undefined,
  };
}

export function AdminBuildingsRoomsPage() {
  const { data: roomsData, loading, error, reload: reloadRooms } = useAsyncData(fetchRooms);
  const {
    data: buildingsData,
    loading: buildingsLoading,
    error: buildingsError,
    reload: reloadBuildings,
  } = useAsyncData(fetchBuildings);
  const [query, setQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [buildingStatusFilter, setBuildingStatusFilter] =
    useState<(typeof buildingStatusOptions)[number]['value']>('all');
  const [roomStatusFilter, setRoomStatusFilter] =
    useState<(typeof roomStatusOptions)[number]['value']>('all');
  const [holding, setHolding] = useState<Room | null>(null);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [creatingBuilding, setCreatingBuilding] = useState(false);
  const [buildingForm, setBuildingForm] = useState<BuildingForm>(emptyBuildingForm);
  const [roomForm, setRoomForm] = useState<RoomForm>(emptyRoomForm);
  const [roomAssets, setRoomAssets] = useState<RoomAsset[]>([]);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rooms = useMemo(() => roomsData ?? [], [roomsData]);
  const buildings = useMemo(() => buildingsData ?? [], [buildingsData]);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) => {
      const matchesQuery =
        !normalizedQuery ||
        building.name.toLowerCase().includes(normalizedQuery) ||
        building.code.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        buildingStatusFilter === 'all' || building.status === buildingStatusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [buildingStatusFilter, buildings, normalizedQuery]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesQuery =
        !normalizedQuery ||
        room.id.toLowerCase().includes(normalizedQuery) ||
        room.building.toLowerCase().includes(normalizedQuery);
      const matchesBuilding = buildingFilter === 'all' || room.building === buildingFilter;
      const matchesStatus = roomStatusFilter === 'all' || room.status === roomStatusFilter;
      return matchesQuery && matchesBuilding && matchesStatus;
    });
  }, [buildingFilter, normalizedQuery, rooms, roomStatusFilter]);

  const summary = useMemo(() => {
    const totalBeds = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupied, 0);
    return {
      buildings: buildings.length,
      rooms: rooms.length,
      beds: totalBeds,
      available: Math.max(totalBeds - occupiedBeds, 0),
      maintenance: rooms.filter((room) => room.status === 'maintenance-hold').length,
    };
  }, [buildings.length, rooms]);

  const reloadAll = () => {
    reloadRooms();
    reloadBuildings();
  };

  const run = async (action: () => Promise<void>) => {
    setSaving(true);
    setActionError(null);
    try {
      await action();
      reloadAll();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const openCreateBuilding = () => {
    setBuildingForm(emptyBuildingForm);
    setCreatingBuilding(true);
  };

  const openEditBuilding = (building: Building) => {
    setBuildingForm(formFromBuilding(building));
    setEditingBuilding(building);
  };

  const openCreateRoom = () => {
    if (buildings.length === 0) {
      setActionError('Tạo tòa nhà trước khi thêm phòng.');
      return;
    }
    setRoomForm({
      ...emptyRoomForm,
      buildingId: buildings[0]?.backendId ?? buildings[0]?.code ?? '',
    });
    setCreatingRoom(true);
  };

  const openEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({
      ...formFromRoom(room),
      buildingId:
        buildings.find((building) => building.name === room.building)?.backendId ??
        buildings.find((building) => building.name === room.building)?.code ??
        room.buildingId ??
        '',
    });
  };

  const openDetail = (room: Room) => {
    setDetailRoom(room);
    setRoomAssets([]);
    void fetchRoomAssets(room)
      .then(setRoomAssets)
      .catch(() => setRoomAssets([]));
  };

  const applyCreateBuilding = () => {
    const input = toBuildingInput(buildingForm);
    if (!input.code || !input.name || !input.floorsCount) {
      setActionError('Nhập mã tòa, tên tòa và số tầng.');
      return;
    }
    void run(async () => {
      await createBuilding(input);
      setCreatingBuilding(false);
      setBuildingForm(emptyBuildingForm);
    });
  };

  const applyEditBuilding = () => {
    if (!editingBuilding || !buildingForm.note.trim()) {
      setActionError('Nhập lý do thay đổi tòa nhà trước khi lưu.');
      return;
    }
    void run(async () => {
      await updateBuilding(editingBuilding, toBuildingInput(buildingForm));
      setEditingBuilding(null);
      setBuildingForm(emptyBuildingForm);
    });
  };

  const applyCreateRoom = () => {
    const input = toRoomInput(roomForm);
    if (!input.buildingId || !input.roomCode || !input.floor || !input.capacity) {
      setActionError('Nhập đủ tòa, mã phòng, tầng và sức chứa.');
      return;
    }
    void run(async () => {
      await createRoom(input);
      setCreatingRoom(false);
      setRoomForm(emptyRoomForm);
    });
  };

  const applyEditRoom = () => {
    if (!editingRoom || !roomForm.note.trim()) {
      setActionError('Nhập lý do thay đổi phòng trước khi lưu.');
      return;
    }
    void run(async () => {
      await updateRoomDetails(editingRoom, { ...toRoomInput(roomForm), reason: roomForm.note });
      setEditingRoom(null);
      setRoomForm(emptyRoomForm);
    });
  };

  const applyHold = () => {
    if (!holding || !roomForm.note.trim()) {
      setActionError('Nhập lý do khóa/mở khóa bảo trì.');
      return;
    }
    void run(async () => {
      await setRoomMaintenance(holding, holding.status !== 'maintenance-hold', roomForm.note);
      setHolding(null);
      setRoomForm(emptyRoomForm);
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tòa nhà & phòng"
        description="Quản lý danh mục tòa, phòng, giường, sức chứa và trạng thái vận hành."
        badges={['US-006']}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={openCreateBuilding}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Thêm tòa
            </Button>
            <Button type="button" onClick={openCreateRoom}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Thêm phòng
            </Button>
          </div>
        }
      />

      {(error || buildingsError || actionError) && (
        <Alert variant="destructive">
          <AlertTitle>Không tải/cập nhật được dữ liệu</AlertTitle>
          <AlertDescription>{error ?? buildingsError ?? actionError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Tòa nhà', summary.buildings],
          ['Phòng', summary.rooms],
          ['Tổng giường', summary.beds],
          ['Giường trống', summary.available],
          ['Phòng bảo trì', summary.maintenance],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Tìm tòa hoặc phòng..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm tòa hoặc phòng"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={buildingStatusFilter}
            onValueChange={(value) =>
              setBuildingStatusFilter(value as (typeof buildingStatusOptions)[number]['value'])
            }
          >
            <SelectTrigger className="w-full sm:w-44" aria-label="Lọc trạng thái tòa">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {buildingStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={buildingFilter} onValueChange={setBuildingFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Lọc tòa">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building.backendId ?? building.code} value={building.name}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={roomStatusFilter}
            onValueChange={(value) =>
              setRoomStatusFilter(value as (typeof roomStatusOptions)[number]['value'])
            }
          >
            <SelectTrigger className="w-full sm:w-44" aria-label="Lọc trạng thái phòng">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roomStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Danh sách tòa nhà</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý trạng thái tòa, số tầng, chính sách giới tính và sức chứa tổng.
          </p>
        </CardHeader>
        <CardContent>
          {buildingsLoading ? (
            <LoadingState />
          ) : filteredBuildings.length === 0 ? (
            <EmptyState
              title="Chưa có tòa nhà"
              description="Thêm tòa trước, sau đó tạo phòng và cấu hình giường."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tòa nhà</TableHead>
                    <TableHead>Quy mô</TableHead>
                    <TableHead>Chính sách</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Quản lý</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuildings.map((building) => (
                    <TableRow key={building.backendId ?? building.code}>
                      <TableCell>
                        <p className="font-medium">{building.name}</p>
                        <p className="text-xs text-slate-500">{building.code}</p>
                      </TableCell>
                      <TableCell>
                        <p>{building.floorsCount ?? 0} tầng</p>
                        <p className="text-xs text-slate-500">
                          {building.roomsCount ?? 0} phòng / {building.bedsCount ?? 0} giường
                        </p>
                      </TableCell>
                      <TableCell>
                        {building.genderPolicy
                          ? genderPolicyLabel[building.genderPolicy]
                          : 'Linh hoạt'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={building.status} />
                      </TableCell>
                      <TableCell>{building.managerName ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setBuildingFilter(building.name)}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Xem phòng
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditBuilding(building)}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Sửa
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Danh sách phòng</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Xem chi tiết giường, sửa cấu hình phòng hoặc khóa bảo trì.
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : filteredRooms.length === 0 ? (
            <EmptyState
              title="Chưa có phòng"
              description="Chạy seed backend hoặc thêm phòng mới để bắt đầu quản lý sức chứa."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phòng</TableHead>
                    <TableHead>Tòa</TableHead>
                    <TableHead>Tầng</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Sức chứa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.id}</TableCell>
                      <TableCell>{room.building}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>{room.gender}</TableCell>
                      <TableCell>
                        {room.occupied}/{room.capacity}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={room.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openDetail(room)}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Chi tiết
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditRoom(room)}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Sửa
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setHolding(room);
                              setRoomForm({ ...emptyRoomForm, note: '' });
                            }}
                          >
                            <Wrench className="h-4 w-4" aria-hidden="true" />
                            {room.status === 'maintenance-hold' ? 'Mở khóa' : 'Bảo trì'}
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

      <Dialog open={creatingBuilding} onOpenChange={setCreatingBuilding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm tòa nhà</DialogTitle>
            <DialogDescription>
              Tạo tòa mới để staff có thể thêm phòng và phân giường.
            </DialogDescription>
          </DialogHeader>
          <BuildingFormFields form={buildingForm} onChange={setBuildingForm} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setCreatingBuilding(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={saving} onClick={applyCreateBuilding}>
              {saving ? 'Đang tạo...' : 'Tạo tòa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingBuilding !== null}
        onOpenChange={(open) => {
          if (!open) setEditingBuilding(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa tòa {editingBuilding?.name}</DialogTitle>
            <DialogDescription>Thay đổi cấu hình tòa cần ghi lý do audit.</DialogDescription>
          </DialogHeader>
          <BuildingFormFields form={buildingForm} onChange={setBuildingForm} requireReason />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setEditingBuilding(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={saving} onClick={applyEditBuilding}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creatingRoom} onOpenChange={setCreatingRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm phòng</DialogTitle>
            <DialogDescription>Tạo phòng mới trong danh mục backend.</DialogDescription>
          </DialogHeader>
          <RoomFormFields buildings={buildings} form={roomForm} onChange={setRoomForm} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setCreatingRoom(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={saving} onClick={applyCreateRoom}>
              {saving ? 'Đang tạo...' : 'Tạo phòng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingRoom !== null}
        onOpenChange={(open) => {
          if (!open) setEditingRoom(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa phòng {editingRoom?.id}</DialogTitle>
            <DialogDescription>Thay đổi cấu hình phòng cần ghi lý do audit.</DialogDescription>
          </DialogHeader>
          <RoomFormFields
            buildings={buildings}
            form={roomForm}
            onChange={setRoomForm}
            requireReason
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setEditingRoom(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={saving} onClick={applyEditRoom}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={holding !== null}
        onOpenChange={(open) => {
          if (!open) setHolding(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {holding?.status === 'maintenance-hold' ? 'Mở khóa bảo trì' : 'Khóa bảo trì'} phòng{' '}
              {holding?.id}
            </DialogTitle>
            <DialogDescription>
              Phòng bảo trì bị loại khỏi gợi ý phân phòng. Lý do được lưu kèm thay đổi.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Ví dụ: sửa hệ thống điện tầng, chống thấm..."
            value={roomForm.note}
            onChange={(event) => setRoomForm((prev) => ({ ...prev, note: event.target.value }))}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setHolding(null)}>
              Hủy
            </Button>
            <Button type="button" disabled={!roomForm.note.trim() || saving} onClick={applyHold}>
              {saving ? 'Đang lưu...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailRoom !== null}
        onOpenChange={(open) => {
          if (!open) setDetailRoom(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết phòng {detailRoom?.id}</DialogTitle>
            <DialogDescription>Giường, sức chứa và tài sản gắn với phòng.</DialogDescription>
          </DialogHeader>
          {detailRoom && (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  ['Tòa', detailRoom.building],
                  ['Tầng', detailRoom.floor],
                  ['Sức chứa', `${detailRoom.occupied}/${detailRoom.capacity}`],
                  ['Giới tính', detailRoom.gender],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-app bg-slate-50 px-3 py-2">
                    <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
                    <p className="mt-1 font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <BedDouble className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  Sơ đồ giường
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {detailRoom.beds.map((bed) => (
                    <div
                      key={bed.id}
                      className="flex items-center justify-between gap-2 rounded-app border border-slate-200 px-3 py-2"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{bed.id}</p>
                        <p className="text-xs text-slate-500">{bed.occupant ?? 'Chưa có cư dân'}</p>
                      </div>
                      <StatusBadge status={bed.status} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-950">Tài sản phòng</p>
                <div className="grid gap-2">
                  {roomAssets.length === 0 ? (
                    <p className="rounded-app bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      Chưa có tài sản gắn phòng.
                    </p>
                  ) : (
                    roomAssets.map((asset) => (
                      <div
                        key={asset.assetCode}
                        className="flex items-center justify-between gap-2 rounded-app border border-slate-200 px-3 py-2"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{asset.name}</p>
                          <p className="text-xs text-slate-500">
                            {asset.assetCode} - {asset.category}
                          </p>
                        </div>
                        <Badge variant="secondary">{asset.status}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BuildingFormFields({
  form,
  onChange,
  requireReason = false,
}: {
  form: BuildingForm;
  onChange: (value: BuildingForm) => void;
  requireReason?: boolean;
}) {
  const patch = (value: Partial<BuildingForm>) => onChange({ ...form, ...value });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Mã tòa
          <Input value={form.code} onChange={(event) => patch({ code: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Tên tòa
          <Input value={form.name} onChange={(event) => patch({ name: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Số tầng
          <Input
            type="number"
            min={1}
            value={form.floorsCount}
            onChange={(event) => patch({ floorsCount: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Chính sách giới tính
          <Select
            value={form.genderPolicy}
            onValueChange={(value) =>
              patch({ genderPolicy: value as BuildingForm['genderPolicy'] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
              <SelectItem value="other">Linh hoạt</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Trạng thái
          <Select
            value={form.status}
            onValueChange={(value) => patch({ status: value as BuildingForm['status'] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
              <SelectItem value="closed">Đóng</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Địa chỉ / ghi chú vị trí
          <Input
            value={form.address}
            onChange={(event) => patch({ address: event.target.value })}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        {requireReason ? 'Lý do thay đổi *' : 'Ghi chú'}
        <Textarea
          value={form.note}
          onChange={(event) => patch({ note: event.target.value })}
          placeholder={
            requireReason
              ? 'Ví dụ: đóng tòa C để bảo trì điện nước trong HK1...'
              : 'Ví dụ: tòa mới mở cho HK1 2026-2027...'
          }
        />
      </label>
    </div>
  );
}

function RoomFormFields({
  buildings,
  form,
  onChange,
  requireReason = false,
}: {
  buildings: Building[];
  form: RoomForm;
  onChange: (value: RoomForm) => void;
  requireReason?: boolean;
}) {
  const patch = (value: Partial<RoomForm>) => onChange({ ...form, ...value });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Tòa
          <Select value={form.buildingId} onValueChange={(value) => patch({ buildingId: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn tòa" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((building) => (
                <SelectItem
                  key={building.backendId ?? building.code}
                  value={building.backendId ?? building.code}
                >
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Mã phòng
          <Input
            value={form.roomCode}
            onChange={(event) => patch({ roomCode: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Số phòng
          <Input value={form.roomNo} onChange={(event) => patch({ roomNo: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Tầng
          <Input
            type="number"
            min={1}
            value={form.floor}
            onChange={(event) => patch({ floor: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Sức chứa
          <Input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(event) => patch({ capacity: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Giá tháng
          <Input
            type="number"
            min={0}
            value={form.monthlyPrice}
            onChange={(event) => patch({ monthlyPrice: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Giới tính
          <Select
            value={form.gender}
            onValueChange={(value) => patch({ gender: value as RoomForm['gender'] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
              <SelectItem value="other">Linh hoạt</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Trạng thái
          <Select
            value={form.status}
            onValueChange={(value) => patch({ status: value as RoomForm['status'] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Còn chỗ</SelectItem>
              <SelectItem value="full">Đầy</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
              <SelectItem value="locked">Khóa</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        {requireReason ? 'Lý do thay đổi *' : 'Ghi chú'}
        <Textarea
          value={form.note}
          onChange={(event) => patch({ note: event.target.value })}
          placeholder={
            requireReason
              ? 'Ví dụ: điều chỉnh sức chứa sau kiểm tra thực tế...'
              : 'Ví dụ: phòng mới mở cho HK1 2026-2027...'
          }
        />
      </label>
    </div>
  );
}
