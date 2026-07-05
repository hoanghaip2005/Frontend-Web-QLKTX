import { useState } from 'react';
import { Search } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { fetchStudentRooms } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';

export function StaffResidentsPage() {
  const { data: rows, loading, error } = useAsyncData(fetchStudentRooms);
  const [query, setQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');

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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
