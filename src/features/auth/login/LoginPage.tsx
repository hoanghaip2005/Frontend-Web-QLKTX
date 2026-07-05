import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, UserRound, UsersRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { appConfig, setActiveRole, setSession } from '@/config/app';
import { login } from '@/lib/api/repositories';
import { cn } from '@/lib/utils/cn';
import type { AppRole } from '@/types/roles';

const roleOptions: { role: AppRole; label: string; icon: typeof UserRound }[] = [
  { role: 'student', label: 'Sinh viên', icon: UserRound },
  { role: 'staff', label: 'Nhân viên', icon: UsersRound },
  { role: 'admin', label: 'Quản trị', icon: Shield },
];

const roleDestination: Record<AppRole, string> = {
  student: '/student/dashboard',
  staff: '/staff/dashboard',
  admin: '/admin/dashboard',
};

const isLive = appConfig.apiMode === 'live';

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<AppRole>('student');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!account.trim()) {
      setError('Nhập email hoặc MSSV.');
      return;
    }
    setError(null);

    if (!isLive) {
      setActiveRole(role);
      navigate(roleDestination[role]);
      return;
    }

    if (!password) {
      setError('Nhập mật khẩu.');
      return;
    }
    setSubmitting(true);
    try {
      const session = await login(account.trim(), password);
      setSession(session);
      navigate(roleDestination[session.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-surface p-4">
      <Card className="w-full max-w-3xl overflow-hidden py-0">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-between bg-brand-900 p-8 text-white lg:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-app bg-white/10 ring-1 ring-white/15">
              <Building2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{appConfig.product}</h1>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                Quản lý ký túc xá tập trung.
              </p>
            </div>
          </section>

          <CardContent className="p-8 lg:p-10">
            <h2 className="text-lg font-semibold text-slate-950">Đăng nhập</h2>

            <form
              className="mt-6 grid gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              {!isLive && (
                <fieldset>
                  <legend className="sr-only">Vai trò</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((option) => (
                      <button
                        key={option.role}
                        type="button"
                        onClick={() => setRole(option.role)}
                        aria-pressed={role === option.role}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-app border px-2 py-3 text-xs font-medium transition',
                          role === option.role
                            ? 'border-brand-600 bg-brand-50 text-brand-800'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50',
                        )}
                      >
                        <option.icon
                          className={cn(
                            'h-4.5 w-4.5',
                            role === option.role ? 'text-brand-700' : 'text-slate-400',
                          )}
                          aria-hidden="true"
                        />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Email trường (edu.vn)
                <Input
                  placeholder="student@edu.vn"
                  autoComplete="username"
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Mật khẩu
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </CardContent>
        </div>
      </Card>
    </main>
  );
}
