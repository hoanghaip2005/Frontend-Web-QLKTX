import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const shifts = [
  { shift: 'Ca sáng 02/07', staff: 'Kỳ Duyên', scope: 'Trực quầy, duyệt hồ sơ', status: 'checked-in' },
  { shift: 'Ca chiều 02/07', staff: 'Thanh Tùng', scope: 'Check-in tân sinh viên', status: 'pending-checkin' },
  { shift: 'Ca tối 02/07', staff: 'Anh Cường (Tổ điện)', scope: 'Xử lý ticket MT-2026-011', status: 'pending-checkin' },
];

export function StaffTasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ca trực & nhiệm vụ"
        description="Bảng phân ca và hàng chờ công việc vận hành trong ngày."
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Lịch trực hôm nay</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ca</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Phạm vi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((row) => (
                  <TableRow key={row.shift}>
                    <TableCell className="font-medium">{row.shift}</TableCell>
                    <TableCell>{row.staff}</TableCell>
                    <TableCell>{row.scope}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
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
