import { useState } from 'react';
import { Bell, CalendarClock, PlugZap, Save, Settings2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
  AdminActionButton,
  AdminPageHeader,
  AuditHint,
  SectionPanel,
  StatusBadge,
} from '@/features/admin/_components/AdminShell';
import { systemSettings } from '@/features/admin/data';

export function AdminSettingsPage() {
  const [semesterName, setSemesterName] = useState('2026 Summer Pilot');
  const [changeReason, setChangeReason] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const saveSettings = () => {
    setShowValidation(semesterName.trim().length < 6 || changeReason.trim().length < 12);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="System settings"
        title="Semester, notice, and integration controls"
        description="Keep global configuration visible while preserving frontend-only scope. Sensitive settings require a reason before mock save."
        icon={Settings2}
        primaryAction={
          <Button type="button" onClick={saveSettings}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save settings draft
          </Button>
        }
        secondaryAction={<AdminActionButton icon={PlugZap}>Integration status</AdminActionButton>}
      />

      <Alert>
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Global settings affect multiple flows</AlertTitle>
        <AlertDescription>
          Active semester touches applications, room ledger, allocation rules, and dashboard
          snapshots. This screen uses local state only and does not write real configuration.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionPanel
          title="Current configuration"
          description="Mock settings table with owner and MVP/deferred status."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setting</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemSettings.map((setting) => (
                <TableRow key={setting.name}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{setting.name}</div>
                    <div className="text-xs text-slate-500">{setting.note}</div>
                  </TableCell>
                  <TableCell>{setting.value}</TableCell>
                  <TableCell>{setting.owner}</TableCell>
                  <TableCell>
                    <StatusBadge status={setting.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionPanel>

        <SectionPanel
          title="Semester and notification defaults"
          description="Feature-ready controls without real API or secret configuration."
        >
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Active semester
                <Input
                  value={semesterName}
                  onChange={(event) => {
                    setSemesterName(event.target.value);
                    setShowValidation(false);
                  }}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Application window
                <Select defaultValue="open">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open for pilot intake</SelectItem>
                    <SelectItem value="review">Review only</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="grid gap-2">
              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <Checkbox defaultChecked />
                <span>
                  <span className="block font-medium text-slate-900">
                    Require consent before application submit
                  </span>
                  Student data notice remains mandatory for US-002.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <Checkbox defaultChecked />
                <span>
                  <span className="block font-medium text-slate-900">
                    Notify staff about maintenance hold changes
                  </span>
                  Mock notification only; no push, email, or SIS integration.
                </span>
              </label>
            </div>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Required change reason
              <Textarea
                value={changeReason}
                onChange={(event) => {
                  setChangeReason(event.target.value);
                  setShowValidation(false);
                }}
                placeholder="Example: align active semester with Sprint 1 pilot data"
              />
            </label>
            {showValidation ? (
              <p className="text-sm text-destructive">
                Enter a semester name and a reason with at least 12 characters before saving.
              </p>
            ) : null}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel
        title="Deferred integrations"
        description="Visible status keeps the team from accidentally adding backend scope."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              title: 'SIS sync',
              icon: PlugZap,
              copy: 'Deferred to Phase 3. No real student information sync in this repo.',
            },
            {
              title: 'Payment gateway',
              icon: PlugZap,
              copy: 'Explicitly out of MVP. Billing pages stay mock-only.',
            },
            {
              title: 'Broadcast notification',
              icon: Bell,
              copy: 'UI placeholder only. No push provider or API client added.',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-slate-950">{item.title}</h2>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-600">{item.copy}</p>
                <div className="mt-3">
                  <StatusBadge status="Deferred" />
                </div>
              </div>
            );
          })}
        </div>
      </SectionPanel>

      <AuditHint>
        States covered: default settings table, form validation error, deferred integration state,
        and local-only save control. No env vars, secrets, Supabase, or fetch calls were added.
      </AuditHint>
    </div>
  );
}
