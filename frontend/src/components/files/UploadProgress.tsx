import { Loader2 } from 'lucide-react';
import type { UploadProgressState } from '@/hooks/useFileUpload';

export function UploadProgress({ progress }: { progress: UploadProgressState | null }) {
  if (!progress) {
    return null;
  }

  const percent = Math.max(0, Math.min(100, progress.percent ?? 0));

  return (
    <div className="border-t border-slate-200/80 px-3 py-2 dark:border-slate-800 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Loader2 className="size-4 shrink-0 animate-spin text-teal-600 dark:text-teal-300" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="truncate">{progress.label}</span>
            {progress.current && progress.total ? (
              <span className="shrink-0 tabular-nums">
                {progress.current}/{progress.total}
              </span>
            ) : null}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-teal-500 transition-all duration-200" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
