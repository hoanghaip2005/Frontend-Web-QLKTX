import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { studentRequests } from '@/mocks/data/dormData';

export function StudentRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Yêu cầu sinh viên"
        description="Đổi phòng, gia hạn, về muộn, trả phòng."
        phase2
        actions={
          <Button type="button" variant="secondary" disabled>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tạo yêu cầu (Phase 2)
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Yêu cầu của bạn</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Loại yêu cầu</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell className="max-w-xs">{request.detail}</TableCell>
                    <TableCell>{request.createdAt}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
