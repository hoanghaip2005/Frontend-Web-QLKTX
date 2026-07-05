import { useState } from 'react';
import { Eye, Search } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { fetchStudentRooms, type StudentRoomRecord } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StaffResidentsPage() {
  const { data: rows, loading, error } = useAsyncData(fetchStudentRooms);
  const [query, setQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [selectedResident, setSelectedResident] = useState<StudentRoomRecord | null>(null);

  const roomOptions = [...new Set((rows ?? []).map((row) => row.room))].sort();
  const filtered = (rows ?? []).filter((row) => {
    const matchesQuery =
      row.studentName.toLowerCase().includes(query.toLowerCase()) ||
      row.studentCode.toLowerCase().includes(query.toLowerCase());
    const matchesRoom = roomFilter === 'all' || row.room === roomFilter;
    return matchesQuery && matchesRoom;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý cư dân"
        description="Tra cứu sinh viên đang lưu trú theo tên, MSSV hoặc phòng."
        badges={['Hỗ trợ US-006/US-010']}
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Không tải được danh sách cư dân</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Tìm theo tên hoặc MSSV..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm cư dân"
          />
        </div>
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Lọc theo phòng">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phòng</SelectItem>
            {roomOptions.map((room) => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Cư dân ({filtered.length})</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chỉ hiển thị thông tin tối thiểu theo nguyên tắc bảo vệ dữ liệu.
            </p>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <EmptyState
                title="Không tìm thấy cư dân"
                description="Thử từ khóa khác hoặc bỏ bộ lọc phòng."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sinh viên</TableHead>
                      <TableHead>Phòng / Giường</TableHead>
                      <TableHead>Trạng thái lưu trú</TableHead>
                      <TableHead>Từ ngày</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => (
                      <TableRow key={`${row.studentCode}-${row.bed}`}>
                        <TableCell>
                          <p className="font-medium">{row.studentName}</p>
                          <p className="text-xs text-slate-500">{row.studentCode}</p>
                        </TableCell>
                        <TableCell>
                          {row.room} / {row.bed}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell>{row.since}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedResident(row)}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Chi tiết
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
      )}

      <Dialog
        open={selectedResident !== null}
        onOpenChange={(open) => !open && setSelectedResident(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedResident?.studentName}</DialogTitle>
            <DialogDescription>Chi tiết lưu trú sinh viên.</DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="grid gap-3 text-sm">
              {[
                ['MSSV', selectedResident.studentCode],
                ['Phòng', selectedResident.room],
                ['Giường', selectedResident.bed],
                ['Từ ngày', selectedResident.since],
                ['Mã backend', selectedResident.backendId ?? '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-app bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-900">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-app bg-slate-50 px-3 py-2">
                <span className="text-slate-500">Trạng thái lưu trú</span>
                <StatusBadge status={selectedResident.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
