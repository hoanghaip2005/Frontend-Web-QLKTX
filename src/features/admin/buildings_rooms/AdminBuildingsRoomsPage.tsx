import { useMemo, useState } from 'react';
import { Building2, ClipboardCheck, Filter, Hammer, Plus, Search } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  CapacityBar,
  EmptyStateLine,
  SectionPanel,
  StatusBadge,
} from '@/features/admin/_components/AdminShell';
import { buildingSummaries, roomLedger } from '@/features/admin/data';

export function AdminBuildingsRoomsPage() {
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [holdReason, setHoldReason] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const filteredRooms = useMemo(
    () =>
      roomLedger.filter((room) => {
        const building = room.room.slice(0, 1);
        const matchesBuilding = buildingFilter === 'all' || building === buildingFilter;
        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        const matchesSearch = `${room.room} ${room.assets} ${room.auditHint}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesBuilding && matchesStatus && matchesSearch;
      }),
    [buildingFilter, search, statusFilter],
  );

  const saveHoldReason = () => {
    setShowValidation(holdReason.trim().length < 16);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Buildings and rooms"
        title="Room, bed, and asset ledger"
        description="Inspect building capacity, room status, available beds, and maintenance holds with mock ledger data from US-006."
        icon={Building2}
        primaryAction={
          <Button>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add room draft
          </Button>
        }
        secondaryAction={
          <AdminActionButton icon={ClipboardCheck}>Audit QR metadata</AdminActionButton>
        }
      />

      <div className="grid gap-3 lg:grid-cols-3">
        {buildingSummaries.map((building) => (
          <SectionPanel
            key={building.id}
            title={building.building}
            description={`${building.rooms} rooms / ${building.beds} beds`}
          >
            <div className="space-y-3">
              <CapacityBar occupied={building.occupied} total={building.beds} />
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{building.available} available</Badge>
                <Badge variant="outline">{building.hold} on hold</Badge>
              </div>
              <p className="text-sm text-slate-600">{building.risk}</p>
            </div>
          </SectionPanel>
        ))}
      </div>

      <Alert>
        <Hammer className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Maintenance hold control</AlertTitle>
        <AlertDescription>
          Rooms on hold are excluded from assignment suggestions. Admin must record the hold reason
          so staff can explain why a bed is unavailable.
        </AlertDescription>
      </Alert>

      <SectionPanel
        title="Room ledger"
        description="Scan capacity, bed IDs, assets, and last sensitive update."
        action={
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search rooms"
                className="w-52 pl-8"
                aria-label="Search rooms"
              />
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All buildings</SelectItem>
                <SelectItem value="A">Building A</SelectItem>
                <SelectItem value="B">Building B</SelectItem>
                <SelectItem value="C">Building C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <Filter className="h-4 w-4" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
                <SelectItem value="Maintenance hold">Maintenance hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filteredRooms.length === 0 ? (
          <EmptyStateLine
            title="No rooms in this ledger view"
            description="Change filters to restore the mock room and bed records."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Available bed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assets / QR</TableHead>
                <TableHead>Audit hint</TableHead>
                <TableHead className="text-right">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.room}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{room.room}</div>
                    <div className="text-xs text-slate-500">{room.gender} policy</div>
                  </TableCell>
                  <TableCell>
                    <CapacityBar
                      occupied={room.occupied}
                      total={room.capacity}
                      className="min-w-32"
                    />
                  </TableCell>
                  <TableCell>{room.availableBeds}</TableCell>
                  <TableCell>
                    <StatusBadge status={room.status} />
                  </TableCell>
                  <TableCell className="max-w-64 whitespace-normal text-slate-600">
                    {room.assets}
                  </TableCell>
                  <TableCell className="max-w-72 whitespace-normal text-slate-600">
                    {room.auditHint}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Hold
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Set maintenance hold for {room.room}</DialogTitle>
                          <DialogDescription>
                            Mock-only action. The reason is required before this room can be
                            excluded from assignment suggestions.
                          </DialogDescription>
                        </DialogHeader>
                        <label className="grid gap-1 text-sm font-medium text-slate-700">
                          Hold reason
                          <Textarea
                            value={holdReason}
                            onChange={(event) => {
                              setHoldReason(event.target.value);
                              setShowValidation(false);
                            }}
                            placeholder="Example: electrical inspection pending after maintenance ticket MT-2026-011"
                          />
                        </label>
                        {showValidation ? (
                          <p className="text-sm text-destructive">
                            Add a reason with at least 16 characters to create an auditable hold.
                          </p>
                        ) : null}
                        <DialogFooter showCloseButton>
                          <Button type="button" onClick={saveHoldReason}>
                            Save hold draft
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionPanel>

      <AuditHint>
        Mobile state: the shadcn table keeps horizontal overflow. Error state: missing hold reason
        blocks the dialog action. Backend state remains mocked in local component state only.
      </AuditHint>
    </div>
  );
}
