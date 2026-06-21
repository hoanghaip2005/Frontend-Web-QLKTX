import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { appConfig } from '@/config/app';

export function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface p-4">
      <Card className="w-full max-w-5xl overflow-hidden">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="bg-brand-700 p-8 text-white lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-app bg-white/10">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-8 text-3xl font-semibold">{appConfig.name}</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-brand-50">
              Base React cho UI quản lý ký túc xá. Hiện chỉ dùng mock data để team dựng giao diện theo từng module.
            </p>
            <div className="mt-8 grid gap-3 text-sm">
              <Link className="inline-flex items-center gap-2 rounded-app bg-white/10 px-4 py-3" to="/student/dashboard">
                Vào Student Portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-app bg-white/10 px-4 py-3" to="/staff/dashboard">
                Vào Staff Console <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-app bg-white/10 px-4 py-3" to="/admin/dashboard">
                Vào Admin Governance <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
          <CardContent className="p-8 lg:p-10">
            <h2 className="text-xl font-semibold text-slate-950">Đăng nhập mock</h2>
            <p className="mt-2 text-sm text-slate-500">Form UI placeholder, chưa nối backend/Supabase.</p>
            <form className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Email hoặc MSSV
                <Input placeholder="student@qlktx.local" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Mật khẩu
                <Input type="password" placeholder="••••••••" />
              </label>
              <Button type="button" className="mt-2">
                Đăng nhập mock
              </Button>
            </form>
          </CardContent>
        </div>
      </Card>
    </main>
  );
}
