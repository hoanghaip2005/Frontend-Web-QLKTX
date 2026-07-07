import { useNavigate } from 'react-router-dom';
import { KeyRound, LogOut, Mail, MapPin, Phone, ShieldCheck, UserCog } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { clearSession } from '@/config/app';
import { fetchProfile } from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { AppRole } from '@/types/roles';

const roleLabel: Record<AppRole, string> = {
  student: 'Sinh viên',
  staff: 'Nhân viên KTX',
  admin: 'Quản trị hệ thống',
};

const rolePermissions: Record<AppRole, string[]> = {
  student: [
    'Xem và nộp hồ sơ đăng ký KTX của chính mình',
    'Xem phòng/giường được phân và bạn cùng phòng',
    'Tạo và theo dõi ticket sửa chữa, hóa đơn, yêu cầu',
    'Không truy cập được dữ liệu của sinh viên khác (RBAC)',
  ],
  staff: [
    'Duyệt/từ chối hồ sơ kèm lý do (ghi audit)',
    'Phân phòng theo gợi ý rule, override kèm lý do',
    'Check-in/out, quản lý cư dân và ticket SLA',
    'Không truy cập cấu hình chỉ dành cho quản trị',
  ],
  admin: [
    'Quản lý tài khoản, gán role và khóa truy cập',
    'Cấu hình tòa/phòng/giường và luật phân phòng',
    'Xem báo cáo vận hành và toàn bộ audit log',
    'Mọi thao tác nhạy cảm được ghi vết kèm lý do',
  ],
};

function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-app border border-slate-200 p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value || '—'}</p>
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, loading, error } = useAsyncData(fetchProfile);

  if (loading) return <LoadingState />;

  const role = (profile?.role ?? 'student') as AppRole;
  const initials =
    profile?.name
      ?.split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'ND';
  const codeLine = [profile?.code, profile?.cohort, profile?.className]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Thông tin tài khoản, phạm vi quyền và cài đặt bảo mật của bạn."
      />

      {error && (
        <p className="rounded-app bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Không tải được đầy đủ hồ sơ từ máy chủ. Hiển thị thông tin sẵn có.
        </p>
      )}

      {/* Header identity */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-brand-600 text-xl font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-950">
                  {profile?.name ?? 'Người dùng'}
                </h2>
                <Badge variant="secondary" className="bg-brand-50 text-brand-700">
                  {roleLabel[role]}
                </Badge>
                <StatusBadge status={profile?.status ?? 'active'} />
              </div>
              {codeLine && <p className="mt-1 text-sm text-slate-500">{codeLine}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Personal info */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-950">Thông tin liên hệ</h2>
            <p className="mt-1 text-sm text-slate-500">
              Thông tin lấy từ hồ sơ tài khoản. Liên hệ ban quản lý để chỉnh sửa.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoField icon={Mail} label="Email" value={profile?.email ?? ''} />
              <InfoField icon={Phone} label="Số điện thoại" value={profile?.phone ?? ''} />
              <InfoField
                icon={UserCog}
                label={role === 'student' ? 'MSSV' : 'Mã nhân viên'}
                value={profile?.code ?? ''}
              />
              <InfoField
                label="Đơn vị / Khoa"
                value={profile?.department ?? ''}
              />
              {role === 'student' && (
                <>
                  <InfoField label="Lớp" value={profile?.className ?? ''} />
                  <InfoField label="Khóa" value={profile?.cohort ?? ''} />
                  <InfoField
                    icon={MapPin}
                    label="Phòng / Giường"
                    value={
                      [profile?.room, profile?.bed].filter(Boolean).join(' / ') || 'Chưa nhận phòng'
                    }
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Phạm vi quyền</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">Theo vai trò {roleLabel[role]}.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rolePermissions[role].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Bảo mật & phiên đăng nhập</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoField label="Phương thức đăng nhập" value="Email trường (edu.vn)" />
            <InfoField label="Trạng thái tài khoản" value={profile?.status === 'locked' ? 'Đã khóa' : 'Hoạt động'} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled>
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Đổi mật khẩu (qua email trường)
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              onClick={() => {
                clearSession();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
