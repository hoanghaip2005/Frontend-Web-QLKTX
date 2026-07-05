import { useCallback, useEffect, useRef, useState } from 'react';

type Result<T> = { key: string; data: T | null; error: string | null };

/**
 * Minimal data-fetching hook for repository calls: loading/error state plus
 * a reload() used after mutations. Intentionally not a cache library —
 * per team rules no data-fetching dependency until a concrete need appears.
 *
 * `loading` is derived by comparing the requested key (deps + reload tick)
 * with the key of the last settled result, so no synchronous setState happens
 * inside effects.
 */
export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [tick, setTick] = useState(0);
  const key = `${JSON.stringify(deps)}:${tick}`;
  const [result, setResult] = useState<Result<T>>({ key: '', data: null, error: null });

  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let cancelled = false;
    loaderRef.current().then(
      (data) => {
        if (!cancelled) setResult({ key, data, error: null });
      },
      (error: unknown) => {
        if (!cancelled)
          setResult({
            key,
            data: null,
            error: error instanceof Error ? error.message : 'Không tải được dữ liệu',
          });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [key]);

  const reload = useCallback(() => setTick((current) => current + 1), []);

  return {
    data: result.data,
    error: result.key === key ? result.error : null,
    loading: result.key !== key,
    reload,
  };
}
