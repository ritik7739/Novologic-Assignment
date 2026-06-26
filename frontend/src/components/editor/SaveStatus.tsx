import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { SaveStatusValue } from '@/types/editor.types';

export function SaveStatus({ status, onRetry }: { status: SaveStatusValue; onRetry?: () => void }) {
  if (status === 'idle') {
    return <span className="text-xs font-medium text-amber-600 dark:text-amber-300">Unsaved changes</span>;
  }

  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Loader2 className="size-3 animate-spin" />
        Saving...
      </span>
    );
  }

  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
        <AlertCircle className="size-3" />
        Error
        <button className="font-medium underline" onClick={onRetry} type="button">
          Retry
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <CheckCircle2 className="size-3 text-emerald-500" />
      Saved
    </span>
  );
}
