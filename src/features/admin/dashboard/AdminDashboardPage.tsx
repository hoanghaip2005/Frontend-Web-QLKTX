import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, ClipboardList, Download, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AdminActionButton,
  AdminMetricGrid,
  AdminPageHeader,
  AuditHint,
  CapacityBar,
  SectionPanel,
  StatusBadge,
} from '@/features/admin/_components/AdminShell';
import {
  adminMetrics,
  auditRecords,
  buildingSummaries,
  dashboardQueues,
} from '@/features/admin/data';

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Governance and operations overview"
        description="Monitor occupancy, available beds, admin-sensitive queues, and reporting readiness from one mock-only control surface."
        icon={ShieldCheck}
        primaryAction={
          <Button asChild>
            <Link to="/admin/reports-audit">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Review audit
            </Link>
          </Button>
        }
        secondaryAction={<AdminActionButton icon={Download}>Export deferred</AdminActionButton>}
      />

      <AdminMetricGrid metrics={adminMetrics} />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel
          title="Building occupancy snapshot"
          description="Every KPI has a visible target list so the dashboard stays actionable."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/buildings-rooms">
                Open ledger
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Building</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildingSummaries.map((building) => (
                <TableRow key={building.id}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{building.building}</div>
                    <div className="text-xs text-slate-500">{building.owner}</div>
                  </TableCell>
                  <TableCell>{building.genderPolicy}</TableCell>
                  <TableCell>
                    <CapacityBar occupied={building.occupied} total={building.beds} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-950">{building.available} beds</div>
                    <div className="text-xs text-slate-500">{building.hold} on hold</div>
                  </TableCell>
                  <TableCell className="max-w-56 whitespace-normal text-slate-600">
                    {building.risk}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionPanel>

        <SectionPanel
          title="Admin action queue"
          description="Sensitive actions stay separated from staff workflows."
        >
          <div className="space-y-3">
            {dashboardQueues.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-950">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.count}</p>
                  </div>
                  <Badge variant="outline">{item.source}</Badge>
                </div>
                <p className="mt-3 text-sm leading-5 text-slate-600">{item.action}</p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel
        title="Latest governance trail"
        description="Mock audit rows show who changed sensitive data and why."
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/reports-audit">Open reports</Link>
          </Button>
        }
      >
        <div className="space-y-4">
          <AuditHint>
            Admin-only operations require a reason. Export and broad audit packages are marked as
            deferred until Phase 2 approval.
          </AuditHint>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditRecords.slice(0, 3).map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>{record.actor}</TableCell>
                  <TableCell className="max-w-72 whitespace-normal">
                    <div className="font-medium text-slate-950">{record.action}</div>
                    <div className="text-xs text-slate-500">{record.reason}</div>
                  </TableCell>
                  <TableCell>{record.target}</TableCell>
                  <TableCell>
                    <StatusBadge status={record.severity} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionPanel>

      <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">
        <Activity className="h-4 w-4" aria-hidden="true" />
        Mock state: dashboard data is local only; no Supabase, fetch, real auth, or export endpoint.
      </div>
    </div>
  );
}
