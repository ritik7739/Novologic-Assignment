import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatDate';
import type { WorkbookVersion } from '@/types/graphql.types';

export function VersionItem({
  version,
  active,
  onRestore,
}: {
  version: WorkbookVersion;
  active?: boolean;
  onRestore: (id: string) => void;
}) {
  return (
    <div className={`flex flex-col gap-3 rounded-lg border p-3 text-sm transition sm:flex-row sm:items-center sm:justify-between ${active ? 'border-teal-300 bg-teal-50 dark:border-teal-900/70 dark:bg-teal-950/30' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950'}`}>
      <div>
        <span className="font-medium text-slate-700 dark:text-slate-200">{formatDate(version.savedAt)}</span>
        {active && <p className="mt-0.5 text-xs text-teal-700 dark:text-teal-300">Latest saved version</p>}
      </div>
      <Button size="sm" variant="ghost" onClick={() => onRestore(version.id)}>
        <RotateCcw className="size-4" />
        Restore
      </Button>
    </div>
  );
}
