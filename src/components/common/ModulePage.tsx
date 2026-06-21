import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Td, Th, Table } from '@/components/ui/table';
import { MetricCard } from '@/components/common/MetricCard';
import { moduleContent } from '@/mocks/data/moduleContent';

type ModulePageProps = {
  pageId: keyof typeof moduleContent;
};

export function ModulePage({ pageId }: ModulePageProps) {
  const content = moduleContent[pageId];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{content.owner}</Badge>
            <Badge tone="success">Mock data</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">{content.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{content.description}</p>
        </div>
        <div className="flex gap-2">
          {content.actions.map((action) => (
            <Button key={action} type="button" variant={action === content.actions[0] ? 'primary' : 'secondary'}>
              {action}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {content.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Phạm vi UI</h2>
          <p className="mt-1 text-sm text-slate-500">Bảng này là placeholder để từng thành viên thay bằng UI thật.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>Hạng mục</Th>
                  <Th>Trạng thái</Th>
                  <Th>DB/View tham chiếu</Th>
                </tr>
              </thead>
              <tbody>
                {content.records.map((record) => (
                  <tr key={record.name}>
                    <Td>{record.name}</Td>
                    <Td>
                      <Badge tone={record.status === 'Ready' ? 'success' : 'warning'}>{record.status}</Badge>
                    </Td>
                    <Td>{record.source}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
