export function LoadingState() {
  return (
    <div className="space-y-3" aria-label="Đang tải">
      <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded-app bg-slate-100" />
      <div className="h-24 animate-pulse rounded-app bg-slate-100" />
    </div>
  );
}
