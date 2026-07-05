import { useState } from 'react';
import { CheckCircle2, Info, ShieldAlert } from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  assignApplication,
  fetchApplications,
  fetchRooms,
  fetchSuggestion,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Application, AssignmentSuggestion } from '@/mocks/data/dormData';

export function StaffAllocationPage() {
  const { data: rooms, loading: roomsLoading, error: roomsError } = useAsyncData(fetchRooms);
  const {
    data: applications,
    loading: appsLoading,
    reload: reloadApps,
  } = useAsyncData(fetchApplications);

  const approvedApps = (applications ?? []).filter((app) => app.status === 'approved');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const selectedApp: Application | null =
    approvedApps.find((app) => app.id === selectedAppId) ?? approvedApps[0] ?? null;

  const selectedAppKey = selectedApp?.id ?? null;
  const {
    data: suggestion,
    loading: suggestionLoading,
    error: suggestionError,
  } = useAsyncData<AssignmentSuggestion | null>(
    () => (selectedApp ? fetchSuggestion(selectedApp) : Promise.resolve(null)),
    [selectedAppKey],
  );

  const [confirmedByApp, setConfirmedByApp] = useState<Record<string, string>>({});
  const confirmedBed = selectedAppKey ? (confirmedByApp[selectedAppKey] ?? null) : null;
  const [overriding, setOverriding] = useState(false);
  const [overrideBed, setOverrideBed] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const applyAssign = async (override?: { bed: string; reason: string }) => {
    if (!selectedApp || !suggestion) return;
    setSaving(true);
    setActionError(null);
    try {
      await assignApplication(selectedApp, suggestion, override);
      setConfirmedByApp((current) => ({
        ...current,
        [selectedApp.id]: override?.bed ?? suggestion.suggestedBed,
      }));
      setOverriding(false);
      setOverrideBed('');
      setOverrideReason('');
      reloadApps();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Không ghi nhận được phân giường');
    } finally {
      setSaving(false);
    }
  };

  const availableBeds = (rooms ?? [])
    .flatMap((room) => room.beds)
    .filter((bed) => bed.status === 'available')
    .map((bed) => bed.id);

  const [buildingFilter, setBuildingFilter] = useState('all');
  const [roomStatusFilter, setRoomStatusFilter] = useState('all');
  const buildingOptions = [...new Set((rooms ?? []).map((room) => room.building))].sort();
  const ledgerRooms = (rooms ?? []).filter(
    (room) =>
      (buildingFilter === 'all' || room.building === buildingFilter) &&
      (roomStatusFilter === 'all' || room.status === roomStatusFilter),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phân phòng & sổ giường"
        description="Gợi ý giường theo rule minh bạch; override cần lý do."
        badges={['US-006', 'US-008', 'US-009']}
      />

      {(actionError || suggestionError) && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi xảy ra</AlertTitle>
          <AlertDescription>{actionError ?? suggestionError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="suggestion">
        <TabsList>
          <TabsTrigger value="suggestion">Gợi ý phân phòng</TabsTrigger>
          <TabsTrigger value="ledger">Sổ phòng / giường</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestion" className="mt-4 space-y-4">
          {appsLoading ? (
            <LoadingState />
          ) : approvedApps.length === 0 ? (
            <EmptyState
              title="Chưa có hồ sơ đã duyệt chờ phân phòng"
              description="Duyệt hồ sơ ở mục Duyệt hồ sơ trước, sau đó quay lại đây để phân giường."
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-700">Hồ sơ đã duyệt:</p>
                <Select
                  value={selectedApp?.id ?? ''}
                  onValueChange={(value) => setSelectedAppId(value)}
                >
                  <SelectTrigger className="w-72" aria-label="Chọn hồ sơ cần phân phòng">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedApps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.id} - {app.studentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {suggestionLoading ? (
                <LoadingState />
              ) : !suggestion ? (
                <EmptyState
                  title="Không có gợi ý phù hợp"
                  description="Không còn giường thỏa các rule bắt buộc. Kiểm tra sổ giường hoặc rule phân phòng."
                />
              ) : (
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-slate-950">
                          Gợi ý cho {suggestion.studentName}
                        </h2>
                        <StatusBadge status={confirmedBed ? 'approved' : 'pending'} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-app border-2 border-brand-600 bg-brand-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                          Giường được gợi ý
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {confirmedBed ?? suggestion.suggestedBed}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Phòng {suggestion.room}
                          {confirmedBed && confirmedBed !== suggestion.suggestedBed
                            ? ' (đã override khỏi gợi ý gốc)'
                            : ''}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <Info className="h-4 w-4 text-brand-600" aria-hidden="true" />
                          Vì sao gợi ý giường này?
                        </p>
                        <ul className="mt-2 space-y-2">
                          {suggestion.reasons.map((reasonItem) => (
                            <li
                              key={reasonItem}
                              className="flex items-start gap-2 text-sm text-slate-600"
                            >
                              <CheckCircle2
                                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                                aria-hidden="true"
                              />
                              {reasonItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {!confirmedBed && (
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" disabled={saving} onClick={() => void applyAssign()}>
                            {saving ? 'Đang lưu...' : 'Xác nhận gợi ý'}
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOverriding(true)}
                          >
                            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                            Override (cần lý do)
                          </Button>
                        </div>
                      )}
                      {confirmedBed && (
                        <p className="rounded-app bg-emerald-50 p-3 text-sm text-emerald-800">
                          Đã ghi nhận phân giường {confirmedBed} cho {suggestion.studentName}. Sinh
                          viên sẽ xác nhận trước khi check-in.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h2 className="text-base font-semibold text-slate-950">
                        Phương án khác và lý do xếp hạng
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Minh bạch rule: các lựa chọn còn lại và vì sao không được chọn đầu tiên.
                      </p>
                    </CardHeader>
                    <CardContent>
                      {suggestion.rejectedOptions.length === 0 ? (
                        <EmptyState
                          title="Không có phương án khác"
                          description="Chỉ còn một lựa chọn thỏa rule bắt buộc."
                        />
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Giường</TableHead>
                                <TableHead>Lý do</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {suggestion.rejectedOptions.map((option) => (
                                <TableRow key={option.bed}>
                                  <TableCell className="font-mono text-xs">{option.bed}</TableCell>
                                  <TableCell className="text-sm text-slate-600">
                                    {option.reason}
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
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          {roomsLoading ? (
            <LoadingState />
          ) : roomsError ? (
            <Alert variant="destructive">
              <AlertTitle>Không tải được sổ phòng</AlertTitle>
              <AlertDescription>{roomsError}</AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-base font-semibold text-slate-950">Sổ phòng / giường</h2>
                  <div className="flex gap-2">
                    <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                      <SelectTrigger className="w-36" aria-label="Lọc theo tòa nhà">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả tòa</SelectItem>
                        {buildingOptions.map((building) => (
                          <SelectItem key={building} value={building}>
                            {building}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={roomStatusFilter} onValueChange={setRoomStatusFilter}>
                      <SelectTrigger className="w-40" aria-label="Lọc theo trạng thái phòng">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Mọi trạng thái</SelectItem>
                        <SelectItem value="available">Còn chỗ</SelectItem>
                        <SelectItem value="full">Đầy</SelectItem>
                        <SelectItem value="maintenance-hold">Khóa bảo trì</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {ledgerRooms.length === 0 && (
                  <EmptyState
                    title="Không có phòng khớp bộ lọc"
                    description="Thử đổi tòa nhà hoặc trạng thái."
                  />
                )}
                {ledgerRooms.map((room) => (
                  <div key={room.id} className="rounded-app border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-950">{room.id}</p>
                        <span className="text-xs text-slate-500">
                          {room.building} - Tầng {room.floor} - {room.gender}
                        </span>
                        <StatusBadge status={room.status} />
                      </div>
                      <p className="text-sm text-slate-600">
                        {room.occupied}/{room.capacity} giường
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {room.beds.map((bed) => (
                        <div
                          key={bed.id}
                          className="flex items-center gap-2 rounded-app bg-slate-50 px-3 py-1.5 text-xs"
                        >
                          <span className="font-mono">{bed.id.split('-').pop()}</span>
                          <StatusBadge status={bed.status} />
                          {bed.occupant && <span className="text-slate-600">{bed.occupant}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={overriding} onOpenChange={setOverriding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override phân giường cho {selectedApp?.id}</DialogTitle>
            <DialogDescription>
              Chọn giường thay thế và ghi lý do. Thao tác này được lưu vào audit log kèm người thực
              hiện và thời điểm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            Giường thay thế *
            {availableBeds.length > 0 ? (
              <Select value={overrideBed} onValueChange={setOverrideBed}>
                <SelectTrigger aria-label="Chọn giường thay thế">
                  <SelectValue placeholder="Chọn giường còn trống" />
                </SelectTrigger>
                <SelectContent>
                  {availableBeds
                    .filter((bed) => bed !== suggestion?.suggestedBed)
                    .map((bed) => (
                      <SelectItem key={bed} value={bed}>
                        {bed}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder="Nhập mã giường, ví dụ A-201-B3"
                value={overrideBed}
                onChange={(event) => setOverrideBed(event.target.value)}
              />
            )}
          </div>
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            Lý do override *
            <Textarea
              placeholder="Ví dụ: sinh viên xin ở cùng anh/em ruột, đã xác minh..."
              value={overrideReason}
              onChange={(event) => setOverrideReason(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOverriding(false)}>
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!overrideBed || !overrideReason.trim() || saving}
              onClick={() => void applyAssign({ bed: overrideBed, reason: overrideReason })}
            >
              {saving ? 'Đang lưu...' : 'Ghi nhận override'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
