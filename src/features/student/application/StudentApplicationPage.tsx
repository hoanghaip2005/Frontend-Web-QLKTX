import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  CircleDashed,
  FileUp,
  QrCode,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  confirmAssignment,
  createAndSubmitApplication,
  fetchApplications,
  fetchBuildings,
  fetchProfile,
  verifyCheckinQr,
} from '@/lib/api/repositories';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import type { Application, ApplicationStatus } from '@/mocks/data/dormData';

type Step = 'consent' | 'form';

type BarcodeDetectorResult = { rawValue?: string };
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect(source: CanvasImageSource): Promise<BarcodeDetectorResult[]>;
};

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

// Progress milestones per status for the timeline view.
const statusRank: Partial<Record<ApplicationStatus, number>> = {
  pending: 1,
  reviewing: 1,
  'needs-update': 2,
  rejected: 2,
  approved: 2,
  suggested: 3,
  'waiting-checkin': 4,
  'checked-in': 5,
};

const statusProgress: Partial<Record<ApplicationStatus, number>> = {
  draft: 10,
  pending: 35,
  reviewing: 45,
  'needs-update': 45,
  approved: 70,
  rejected: 100,
  suggested: 80,
  'waiting-checkin': 90,
  'checked-in': 100,
  cancelled: 100,
};

const reviewCheckLabel: Record<string, string> = {
  passed: 'Đạt',
  missing: 'Cần bổ sung',
  failed: 'Không đạt',
  warning: 'Lưu ý',
  info: 'Đã ghi nhận',
};

const reviewCheckTone: Record<string, string> = {
  passed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  missing: 'border-amber-200 bg-amber-50 text-amber-800',
  failed: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
};

function ApplicationStatusView({
  application,
  onReload,
}: {
  application: Application;
  onReload: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [verifyingQr, setVerifyingQr] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const rank = statusRank[application.status] ?? 0;
  const failed = application.status === 'rejected' || application.status === 'needs-update';
  const progress = application.progressPercent ?? statusProgress[application.status] ?? 0;
  const assignedRoomCode = application.assignedBed?.replace(/-B\d+$/, '');
  const demoQrCode = assignedRoomCode ? `ROOM-${assignedRoomCode.replaceAll('-', '')}` : '';
  const reviewChecks =
    application.reviewChecks && application.reviewChecks.length > 0
      ? application.reviewChecks
      : rank >= 2
        ? [
            {
              label: 'Xét duyệt minh chứng',
              result: failed ? ('warning' as const) : ('passed' as const),
              note: application.note,
            },
          ]
        : [];

  const steps = [
    { label: 'Nộp hồ sơ', done: true },
    { label: 'Xét duyệt minh chứng', done: rank >= 2 },
    { label: 'Gợi ý phòng/giường', done: rank >= 3 },
    { label: 'Bạn xác nhận giường', done: rank >= 4 },
    { label: 'Check-in nhận phòng', done: rank >= 5 },
  ];

  const confirm = async () => {
    setConfirming(true);
    setActionError(null);
    try {
      await confirmAssignment(application);
      onReload();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Không xác nhận được');
    } finally {
      setConfirming(false);
    }
  };

  const stopCamera = () => {
    scanningRef.current = false;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      scanningRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const verifyQr = async (rawCode = qrCode) => {
    const code = rawCode.trim();
    if (!code) {
      setActionError('Vui lòng nhập hoặc quét mã QR phòng.');
      return;
    }
    setVerifyingQr(true);
    setActionError(null);
    try {
      await verifyCheckinQr(application, code);
      setQrCode(code);
      onReload();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Không xác thực được QR nhận phòng');
    } finally {
      setVerifyingQr(false);
    }
  };

  const startScanner = async () => {
    setScannerOpen(true);
    setCameraError(null);
    setActionError(null);
    if (!window.BarcodeDetector) {
      setCameraError('Trình duyệt chưa hỗ trợ quét QR trực tiếp. Nhập mã QR bên dưới để demo.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      scanningRef.current = true;
      const scan = async () => {
        if (!scanningRef.current) return;
        const video = videoRef.current;
        if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          try {
            const [result] = await detector.detect(video);
            if (result?.rawValue) {
              stopCamera();
              setScannerOpen(false);
              await verifyQr(result.rawValue);
              return;
            }
          } catch {
            // Some frames are undecodable; keep scanning.
          }
        }
        window.requestAnimationFrame(scan);
      };
      window.requestAnimationFrame(scan);
    } catch {
      setCameraError('Không mở được camera. Kiểm tra quyền trình duyệt hoặc nhập mã QR thủ công.');
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-950">Hồ sơ {application.id}</h2>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Nộp lúc {application.submittedAt}
            {application.preference ? ` - ${application.preference}` : ''}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-app border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">Tiến trình hồ sơ</span>
              <span className="font-semibold text-slate-950">{progress}%</span>
            </div>
            <Progress className="mt-2 h-2" value={progress} />
            {application.reviewedAt && (
              <p className="mt-2 text-xs text-slate-500">
                Cập nhật duyệt: {application.reviewedAt}
              </p>
            )}
          </div>

          {failed && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>
                {application.status === 'rejected' ? 'Hồ sơ bị từ chối' : 'Cần bổ sung hồ sơ'}
              </AlertTitle>
              <AlertDescription>{application.note ?? 'Liên hệ ban quản lý KTX.'}</AlertDescription>
            </Alert>
          )}

          <ol className="space-y-4">
            {steps.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                {item.done ? (
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                ) : (
                  <CircleDashed
                    className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                    aria-hidden="true"
                  />
                )}
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
              </li>
            ))}
          </ol>

          <div>
            <h3 className="text-sm font-semibold text-slate-950">Kết quả xét duyệt minh chứng</h3>
            {reviewChecks.length === 0 ? (
              <p className="mt-2 rounded-app bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Nhân viên chưa ghi nhận kết quả kiểm tra minh chứng.
              </p>
            ) : (
              <ul className="mt-2 grid gap-2">
                {reviewChecks.map((check) => (
                  <li
                    key={`${check.label}-${check.result}`}
                    className={`rounded-app border px-3 py-2 text-sm ${reviewCheckTone[check.result] ?? reviewCheckTone.info}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{check.label}</span>
                      <span className="text-xs font-semibold">
                        {reviewCheckLabel[check.result] ?? reviewCheckLabel.info}
                      </span>
                    </div>
                    {check.note && <p className="mt-1 text-xs opacity-80">{check.note}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-950">Bước tiếp theo</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          {actionError && <p className="text-red-600">{actionError}</p>}
          {application.status === 'suggested' && (
            <>
              <p>
                Bạn được gợi ý giường{' '}
                <strong className="text-slate-900">{application.assignedBed ?? '—'}</strong>. Xác
                nhận để giữ chỗ và chuyển sang bước check-in.
              </p>
              <Button type="button" disabled={confirming} onClick={() => void confirm()}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {confirming ? 'Đang xác nhận...' : 'Xác nhận nhận giường'}
              </Button>
            </>
          )}
          {(application.status === 'pending' || application.status === 'reviewing') && (
            <p>Ban quản lý sẽ phản hồi trong 3 ngày làm việc.</p>
          )}
          {application.status === 'approved' && <p>Hồ sơ đã duyệt. Chờ ban quản lý phân giường.</p>}
          {application.status === 'waiting-checkin' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">Quét QR tại phòng được phân</p>
                <Badge variant={application.qrVerified ? 'default' : 'secondary'}>
                  {application.qrVerified ? 'Đã quét QR' : 'Chưa quét QR'}
                </Badge>
              </div>
              <p>
                Quét mã QR dán ở cửa phòng để xác nhận bạn đã đến đúng phòng. Nhân viên vẫn là người
                hoàn tất bàn giao/check-in cuối.
              </p>
              {application.qrVerified && (
                <p className="rounded-app bg-emerald-50 px-3 py-2 text-emerald-800">
                  QR đã xác thực{application.qrVerifiedAt ? ` lúc ${application.qrVerifiedAt}` : ''}
                  . Chờ nhân viên đối chiếu CCCD và bàn giao tài sản.
                </p>
              )}
              <div className="grid gap-2">
                <Input
                  value={qrCode}
                  placeholder={demoQrCode || 'Ví dụ: ROOM-A302'}
                  onChange={(event) => setQrCode(event.target.value)}
                  aria-label="Mã QR nhận phòng"
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => void startScanner()}>
                    <Camera className="h-4 w-4" aria-hidden="true" />
                    Quét bằng camera
                  </Button>
                  <Button type="button" disabled={verifyingQr} onClick={() => void verifyQr()}>
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    {verifyingQr ? 'Đang xác thực...' : 'Xác thực QR'}
                  </Button>
                  {demoQrCode && (
                    <Button type="button" variant="ghost" onClick={() => setQrCode(demoQrCode)}>
                      Dùng mã demo {demoQrCode}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          {application.status === 'checked-in' && (
            <p>
              Bạn đã nhận phòng. Xem chi tiết tại mục <strong>Phòng hiện tại</strong>.
            </p>
          )}
          {failed && <p>Bạn có thể chỉnh sửa và nộp lại hồ sơ sau khi bổ sung.</p>}
        </CardContent>
      </Card>

      <Dialog
        open={scannerOpen}
        onOpenChange={(open) => {
          setScannerOpen(open);
          if (!open) stopCamera();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Quét QR nhận phòng</DialogTitle>
            <DialogDescription>
              Đưa camera vào mã QR dán tại cửa phòng hoặc nhập mã thủ công nếu trình duyệt không hỗ
              trợ.
            </DialogDescription>
          </DialogHeader>
          {cameraError ? (
            <Alert variant="destructive">
              <AlertTitle>Không thể quét bằng camera</AlertTitle>
              <AlertDescription>{cameraError}</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-hidden rounded-app border border-slate-200 bg-slate-950">
              <video
                ref={videoRef}
                className="aspect-video w-full object-cover"
                muted
                playsInline
              />
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                stopCamera();
                setScannerOpen(false);
              }}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function StudentApplicationPage() {
  const { data: applications, loading, reload } = useAsyncData(fetchApplications);
  const { data: profile } = useAsyncData(fetchProfile);
  const {
    data: buildings,
    loading: buildingsLoading,
    error: buildingsError,
  } = useAsyncData(fetchBuildings);
  const [step, setStep] = useState<Step>('consent');
  const [consented, setConsented] = useState(false);
  const [desiredBuildingId, setDesiredBuildingId] = useState('');
  const [preference, setPreference] = useState('');
  const [evidenceAdded, setEvidenceAdded] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const applicationRows = applications ?? [];
  const latest =
    applicationRows.find((application) => application.status !== 'cancelled') ??
    applicationRows[0] ??
    null;
  const buildingOptions = (buildings ?? []).filter((building) => building.status === 'active');
  const selectedBuilding = buildingOptions.find(
    (building) => (building.backendId ?? building.code) === desiredBuildingId,
  );

  const submitForm = async () => {
    if (!desiredBuildingId || !preference.trim() || !evidenceAdded) {
      setFormError(
        !evidenceAdded
          ? 'Cần đính kèm CCCD và giấy xác nhận sinh viên.'
          : !desiredBuildingId
            ? 'Vui lòng chọn tòa nhà mong muốn.'
            : 'Vui lòng nhập nguyện vọng phòng ở.',
      );
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await createAndSubmitApplication({
        desiredBuildingId,
        desiredBuildingLabel: selectedBuilding?.name,
        lifestyleNeeds: [preference],
        priorityNote: 'Không thuộc diện ưu tiên',
        documents: [{ name: 'CCCD_2mat.pdf' }, { name: 'GiayXacNhanSV.pdf' }],
      });
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Không nộp được hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đăng ký ở KTX"
        description="Đồng ý dữ liệu, nộp hồ sơ và theo dõi trạng thái duyệt."
        badges={['US-002', 'US-003', 'US-004']}
      />

      {loading ? (
        <LoadingState />
      ) : latest ? (
        <ApplicationStatusView application={latest} onReload={reload} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {(
              [
                ['consent', '1. Đồng ý dữ liệu'],
                ['form', '2. Nộp hồ sơ'],
              ] as const
            ).map(([key, label], index) => (
              <div key={key} className="flex items-center gap-2">
                {index > 0 && <Separator className="w-6" />}
                <span
                  className={
                    step === key
                      ? 'rounded-app bg-brand-600 px-3 py-1.5 font-medium text-white'
                      : 'rounded-app bg-white px-3 py-1.5 text-slate-600 ring-1 ring-slate-200'
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {step === 'consent' && (
            <Card className="max-w-3xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-950">Xử lý dữ liệu cá nhân</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Mục đích:</strong> xét duyệt hồ sơ, phân phòng và quản lý lưu trú.
                  </li>
                  <li>
                    <strong>Dữ liệu:</strong> họ tên, MSSV, giới tính, khóa/ngành, liên hệ, minh
                    chứng ưu tiên.
                  </li>
                  <li>
                    <strong>Truy cập:</strong> chỉ ban quản lý KTX được phân quyền.
                  </li>
                  <li>
                    <strong>Lưu trữ:</strong> trong thời gian lưu trú + tối đa 12 tháng.
                  </li>
                </ul>
                <label className="flex items-start gap-3 rounded-app border border-slate-200 bg-slate-50 p-4">
                  <Checkbox
                    checked={consented}
                    onCheckedChange={(value) => setConsented(value === true)}
                    aria-label="Đồng ý xử lý dữ liệu cá nhân"
                  />
                  <span className="text-slate-700">
                    Tôi đồng ý để KTX xử lý dữ liệu cá nhân theo mục đích trên.
                  </span>
                </label>
                <Button type="button" disabled={!consented} onClick={() => setStep('form')}>
                  Tiếp tục
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'form' && (
            <Card className="max-w-3xl">
              <CardHeader>
                <h2 className="text-base font-semibold text-slate-950">Hồ sơ đăng ký</h2>
              </CardHeader>
              <CardContent className="space-y-5">
                {formError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertTitle>Không thể nộp hồ sơ</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                {buildingsError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertTitle>Không tải được danh sách tòa</AlertTitle>
                    <AlertDescription>{buildingsError}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Họ và tên
                    <Input value={profile?.name ?? ''} readOnly />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    MSSV
                    <Input value={profile?.code ?? profile?.id ?? ''} readOnly />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Giới tính
                    <Input value="Theo hồ sơ sinh viên" readOnly />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Khóa / Ngành
                    <Input
                      value={[profile?.cohort, profile?.className].filter(Boolean).join(' - ')}
                      readOnly
                    />
                  </label>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2 text-sm font-medium text-slate-700">
                    Diện ưu tiên
                    <Select defaultValue="none">
                      <SelectTrigger aria-label="Diện ưu tiên">
                        <SelectValue placeholder="Chọn diện ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không</SelectItem>
                        <SelectItem value="poor">Hộ nghèo / cận nghèo</SelectItem>
                        <SelectItem value="veteran">Con thương binh, liệt sĩ</SelectItem>
                        <SelectItem value="remote">Vùng sâu vùng xa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 text-sm font-medium text-slate-700">
                    Tòa nhà mong muốn
                    <Select
                      value={desiredBuildingId}
                      disabled={buildingsLoading || buildingOptions.length === 0}
                      onValueChange={setDesiredBuildingId}
                    >
                      <SelectTrigger aria-label="Tòa nhà mong muốn">
                        <SelectValue
                          placeholder={
                            buildingsLoading
                              ? 'Đang tải tòa nhà...'
                              : buildingOptions.length === 0
                                ? 'Chưa có tòa đang hoạt động'
                                : 'Chọn tòa nhà'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingOptions.map((building) => (
                          <SelectItem
                            key={building.backendId ?? building.code}
                            value={building.backendId ?? building.code}
                          >
                            {building.name} ({building.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nguyện vọng khác *
                  <Textarea
                    placeholder="Ví dụ: phòng yên tĩnh, ở cùng bạn cùng lớp..."
                    value={preference}
                    onChange={(event) => setPreference(event.target.value)}
                  />
                </label>
                <div className="grid gap-2 text-sm font-medium text-slate-700">
                  Minh chứng *
                  <div className="rounded-app border border-dashed border-slate-300 bg-slate-50 p-4">
                    {evidenceAdded ? (
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                          CCCD_2mat.pdf
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                          GiayXacNhanSV.pdf
                        </li>
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        CCCD 2 mặt và giấy xác nhận sinh viên (PDF/JPG, tối đa 5 MB).
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-3"
                      onClick={() => setEvidenceAdded(true)}
                    >
                      <FileUp className="h-4 w-4" aria-hidden="true" />
                      {evidenceAdded ? 'Thêm tệp khác' : 'Tải minh chứng lên'}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" disabled={submitting} onClick={() => void submitForm()}>
                    {submitting ? 'Đang nộp...' : 'Nộp hồ sơ'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep('consent')}>
                    Quay lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
