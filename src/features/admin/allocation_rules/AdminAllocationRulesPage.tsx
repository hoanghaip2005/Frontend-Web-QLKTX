import { useMemo, useState } from 'react';
import { ListChecks, Save, Scale, SlidersHorizontal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
  EmptyStateLine,
  SectionPanel,
  StatusBadge,
} from '@/features/admin/_components/AdminShell';
import { allocationRules } from '@/features/admin/data';

export function AdminAllocationRulesPage() {
  const [category, setCategory] = useState('all');
  const [selectedRuleId, setSelectedRuleId] = useState(allocationRules[0].id);
  const [reason, setReason] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const filteredRules = useMemo(
    () => allocationRules.filter((rule) => category === 'all' || rule.category === category),
    [category],
  );

  const selectedRule =
    allocationRules.find((rule) => rule.id === selectedRuleId) ?? allocationRules[0];

  const saveRuleDraft = () => {
    setShowValidation(reason.trim().length < 12);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Allocation rules"
        title="Transparent room assignment policy"
        description="Configure the mock rules that explain assignment suggestions. Required constraints are separated from priority ranking rules."
        icon={SlidersHorizontal}
        primaryAction={
          <Button type="button" onClick={saveRuleDraft}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save rule draft
          </Button>
        }
        secondaryAction={<AdminActionButton icon={Scale}>Simulate suggestion</AdminActionButton>}
      />

      <Alert>
        <ListChecks className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Rule governance</AlertTitle>
        <AlertDescription>
          MVP rules stay explainable: gender policy, open capacity, cohort preference, and
          maintenance hold guardrails. Advanced optimization is outside this phase.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionPanel
          title="Rule registry"
          description="Select a rule to inspect the explanation and audit requirement."
          action={
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Required">Required</SelectItem>
                <SelectItem value="Priority">Priority</SelectItem>
                <SelectItem value="Guardrail">Guardrail</SelectItem>
              </SelectContent>
            </Select>
          }
        >
          {filteredRules.length === 0 ? (
            <EmptyStateLine
              title="No rules in this category"
              description="Switch the category filter to inspect other mock allocation rules."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last changed</TableHead>
                  <TableHead className="text-right">Inspect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id} data-state={rule.id === selectedRuleId ? 'selected' : ''}>
                    <TableCell>
                      <div className="font-medium text-slate-950">{rule.name}</div>
                      <div className="text-xs text-slate-500">{rule.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.category}</Badge>
                    </TableCell>
                    <TableCell>#{rule.priority}</TableCell>
                    <TableCell>
                      <StatusBadge status={rule.status} />
                    </TableCell>
                    <TableCell className="max-w-52 whitespace-normal text-slate-600">
                      {rule.lastChanged}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRuleId(rule.id)}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionPanel>

        <SectionPanel
          title="Rule editor"
          description="Local form state only; no backend write happens in this MVP UI."
        >
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedRule.status} />
                <Badge variant="secondary">{selectedRule.category}</Badge>
              </div>
              <h2 className="mt-3 text-base font-semibold text-slate-950">{selectedRule.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selectedRule.explanation}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Priority
                <Input type="number" min={1} max={10} defaultValue={selectedRule.priority} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Status
                <Select defaultValue={selectedRule.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enabled">Enabled</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <Checkbox defaultChecked={selectedRule.category === 'Required'} />
              <span>
                <span className="block font-medium text-slate-900">Require audit on change</span>
                Sensitive rule edits should appear in Reports/Audit with actor, target, and reason.
              </span>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Change reason
              <Textarea
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setShowValidation(false);
                }}
                placeholder="Example: policy review for Sprint 2 assignment suggestions"
              />
            </label>
            {showValidation ? (
              <p className="text-sm text-destructive">
                Add a reason with at least 12 characters before saving a rule draft.
              </p>
            ) : null}

            <AuditHint>{selectedRule.auditHint}</AuditHint>
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}
