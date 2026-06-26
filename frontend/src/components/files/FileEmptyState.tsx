import { FileUp } from 'lucide-react';

export function FileEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60">
      <FileUp className="mx-auto mb-2 size-5 text-teal-500" />
      <p className="font-medium text-slate-700 dark:text-slate-200">No files attached</p>
      <p className="mt-1 text-xs text-slate-500">Drag images or PDFs into the editor.</p>
    </div>
  );
}
