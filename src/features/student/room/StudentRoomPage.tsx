import { Link } from 'react-router-dom';
import { BedDouble, QrCode, Users, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { fetchCurrentRoom, fetchRoomAssets, fetchRooms } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StudentRoomPage() {
  const { data: current, loading } = useAsyncData(fetchCurrentRoom);
  const { data: allRooms } = useAsyncData(fetchRooms);
  const myRoom = current?.roomCode
    ? (allRooms ?? []).find((room) => room.id === current.roomCode) ?? null
    : null;
  const {
    data: roomAssets,
    loading: assetsLoading,
    error: assetsError,
  } = useAsyncData(() => (myRoom ? fetchRoomAssets(myRoom) : Promise.resolve([])), [
    myRoom?.backendId ?? myRoom?.id ?? 'none',
  ]);

  if (loading) return <LoadingState />;
  if (!current?.roomCode) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Phòng hiện tại"
          description="Bạn chưa được phân phòng. Sau khi hồ sơ được duyệt và phân giường, thông tin phòng sẽ hiển thị tại đây."
          badges={['US-006']}
        />
        <EmptyState
          title="Chưa có phòng"
          description="Nộp hồ sơ đăng ký ở KTX và chờ ban quản lý phân giường."
        />
      </div>
    );
  }

  const myBedId = current.bedCode?.startsWith(current.roomCode)
    ? current.bedCode
    : `${current.roomCode}-${current.bedCode}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Phòng hiện tại: ${current.roomCode}`}
        description={
          myRoom
            ? `${myRoom.building} - Tầng ${myRoom.floor} - Sức chứa ${myRoom.capacity} - Giường của bạn: ${myBedId}.`
            : `Giường của bạn: ${myBedId}.`
        }
        badges={['US-006']}
        actions={
          <Button asChild variant="secondary">
            <Link to="/student/tickets">
              <Wrench className="h-4 w-4" aria-hidden="true" />
              Báo sửa chữa phòng này
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Sơ đồ giường</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {myRoom ? `${myRoom.occupied}/${myRoom.capacity} giường đang sử dụng.` : ''}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {(myRoom?.beds ?? []).map((bed) => {
                const isMine = bed.id === myBedId;
                return (
                  <div
                    key={bed.id}
                    className={
                      isMine
                        ? 'rounded-app border-2 border-brand-600 bg-brand-50 p-3'
                        : 'rounded-app border border-slate-200 p-3'
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{bed.id}</p>
                      <StatusBadge status={isMine ? 'reserved' : bed.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {isMine ? 'Bạn đang ở giường này' : (bed.occupant ?? 'Trống')}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Bạn cùng phòng</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.roommates.length === 0 && (
              <p className="text-sm text-slate-500">Chưa có bạn cùng phòng.</p>
            )}
            {current.roommates.map((mate) => (
              <div
                key={mate.bed}
                className="flex items-center justify-between gap-2 rounded-app border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{mate.name}</p>
                  <p className="text-xs text-slate-500">
                    {mate.bed}
                    {mate.cohort ? ` - ${mate.cohort}` : ''}
                  </p>
                </div>
                <StatusBadge status="checked-in" />
              </div>
            ))}
            <p className="text-xs text-slate-500">
              Thông tin liên hệ bạn cùng phòng chỉ hiển thị sau khi cả hai đồng ý chia sẻ (quy tắc
              bảo vệ dữ liệu cá nhân).
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Tài sản trong phòng</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Quét QR trên tài sản để báo sửa chữa đúng thiết bị.
          </p>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <LoadingState />
          ) : assetsError ? (
            <Alert variant="destructive">
              <AlertTitle>Không tải được tài sản phòng</AlertTitle>
              <AlertDescription>{assetsError}</AlertDescription>
            </Alert>
          ) : !roomAssets || roomAssets.length === 0 ? (
            <EmptyState
              title="Chưa có tài sản"
              description="Phòng này chưa được cấu hình tài sản hoặc mã QR trong backend."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã QR</TableHead>
                    <TableHead>Tài sản</TableHead>
                    <TableHead>Nhóm</TableHead>
                    <TableHead>Tình trạng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomAssets.map((asset) => (
                    <TableRow key={asset.backendId ?? asset.assetCode}>
                      <TableCell className="font-mono text-xs">{asset.assetCode}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>
                        <StatusBadge status={asset.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/student/tickets" aria-label={`Báo sửa ${asset.name}`}>
                            Báo sửa
                          </Link>
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
