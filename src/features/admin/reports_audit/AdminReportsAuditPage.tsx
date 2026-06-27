import { useMemo, useState } from 'react';
import { Download, FileBarChart2, Filter, History, ShieldAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AdminActionButton,
  AdminPageHeader,
  AuditHint,
  EmptyStateLine,
  SectionPanel,
  StatusBadge,
} from '@/features/admin/_components/AdminShell';
import { auditRecords, reports } from '@/features/admin/data';

export function AdminReportsAuditPage() {
  const [severity, setSeverity] = useState('all');

  const filteredAudit = useMemo(
    () => auditRecords.filter((record) => severity === 'all' || record.severity === severity),
    [severity],
  );

  const deferredReports = reports.filter((report) => report.status === 'Deferred export');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Reports and audit"
        title="Leadership reports and sensitive action trail"
        description="Review dashboard source reports and admin-sensitive events. Export packages stay visibly deferred for Phase 2."
        icon={FileBarChart2}
        primaryAction={
          <Button>
            <FileBarChart2 className="h-4 w-4" aria-hidden="true" />
            Generate mock report
          </Button>
        }
        secondaryAction={<AdminActionButton icon={Download}>Export disabled</AdminActionButton>}
      />

      <Alert>
        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Audit scope guardrail</AlertTitle>
        <AlertDescription>
          MVP shows report readiness and audit filtering only. Broad PDF/Excel export and full audit
          export remain deferred unless the team moves US-020 or US-021 into scope.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
          <TabsTrigger value="exports">Deferred exports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <SectionPanel
            title="Report catalog"
            description="Each report points to a mock data source and owner."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Cadence</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium text-[#32121d]">{report.name}</div>
                      <div className="text-xs text-[#76525f]">{report.id}</div>
                    </TableCell>
                    <TableCell>{report.owner}</TableCell>
                    <TableCell>{report.cadence}</TableCell>
                    <TableCell className="max-w-72 whitespace-normal text-[#76525f]">
                      {report.source}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" variant="outline" size="sm">
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionPanel>
        </TabsContent>

        <TabsContent value="audit">
          <SectionPanel
            title="Sensitive action audit"
            description="Filter mock audit rows by severity to support governance review."
            action={
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severity</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            }
          >
            {filteredAudit.length === 0 ? (
              <EmptyStateLine
                title="No audit rows match this filter"
                description="Switch severity to inspect other sensitive action states."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudit.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium text-[#32121d]">{record.id}</div>
                        <div className="text-xs text-[#76525f]">{record.time}</div>
                      </TableCell>
                      <TableCell>{record.actor}</TableCell>
                      <TableCell>{record.action}</TableCell>
                      <TableCell>{record.target}</TableCell>
                      <TableCell className="max-w-80 whitespace-normal text-[#76525f]">
                        {record.reason}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.severity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionPanel>
        </TabsContent>

        <TabsContent value="exports">
          <SectionPanel
            title="Deferred export controls"
            description="Visible placeholders keep Phase 2 reporting honest without implementing real export."
          >
            <div className="space-y-3">
              {deferredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#f2b8c8] bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-[#32121d]">{report.name}</h2>
                      <StatusBadge status={report.status} />
                    </div>
                    <p className="mt-2 text-sm text-[#76525f]">
                      Source planned later: {report.source}. Owner: {report.owner}.
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Disabled
                  </Button>
                </div>
              ))}
              <AuditHint>
                Error state: export buttons are disabled by design because US-021 is not in the MVP
                will-have list. Audit previews remain usable for demo.
              </AuditHint>
            </div>
          </SectionPanel>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2 text-sm text-[#76525f]">
        <History className="h-4 w-4 text-[#7a1632]" aria-hidden="true" />
        <span>
          Evidence ready: report list, audit filter, empty state, and deferred export state.
        </span>
        <Badge variant="outline">Mock data only</Badge>
      </div>
    </div>
  );
}
