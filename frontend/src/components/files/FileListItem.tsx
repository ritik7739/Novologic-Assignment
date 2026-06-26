import { FileText, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/utils/formatFileSize';
import type { WorkbookFile } from '@/types/graphql.types';

export function FileListItem({
  file,
  deleting,
  onSelect,
  onDelete,
}: {
  file: WorkbookFile;
  deleting?: boolean;
  onSelect?: (file: WorkbookFile) => void;
  onDelete: (id: string) => void;
}) {
  const isImage = file.mimeType.startsWith('image/');
  const Icon = isImage ? ImageIcon : FileText;

  return (
    <div className="group flex items-center gap-2 rounded-lg border border-transparent p-1 transition hover:border-slate-200 hover:bg-white hover:shadow-soft-sm dark:hover:border-slate-800 dark:hover:bg-slate-900">
      <button
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 text-left"
        type="button"
        onClick={() => onSelect?.(file)}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</span>
          <span className="block text-xs text-slate-400">{formatFileSize(file.size)}</span>
        </span>
      </button>
      <Button
        size="icon"
        variant="destructive"
        disabled={deleting}
        className="opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Delete ${file.name}`}
        onClick={() => onDelete(file.id)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
