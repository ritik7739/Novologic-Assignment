'use client';

import { useMutation } from '@apollo/client';
import type { ApolloError } from '@apollo/client';
import { AlertCircle, Folder, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { DELETE_FILE } from '@/lib/graphql/mutations/file.mutations';
import { GET_WORKBOOK } from '@/lib/graphql/queries/workbook.queries';
import type { WorkbookFile } from '@/types/graphql.types';
import { FileEmptyState } from './FileEmptyState';
import { FileListItem } from './FileListItem';

export function FileList({
  files,
  userId,
  loading,
  error,
  onRetry,
  onSelect,
}: {
  files: WorkbookFile[];
  userId: string;
  loading?: boolean;
  error?: ApolloError;
  onRetry?: () => void;
  onSelect?: (file: WorkbookFile) => void;
}) {
  const [deleteFile, { loading: deleting }] = useMutation(DELETE_FILE, {
    refetchQueries: [{ query: GET_WORKBOOK, variables: { userId } }],
    onCompleted: () => toast.success('File removed'),
    onError: () => toast.error('Could not delete file'),
  });

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between border-y border-slate-200 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">
        <span className="flex items-center gap-2">
          <Folder className="size-4 text-teal-600 dark:text-teal-400" />
          Files
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {files.length}
        </span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="size-4 animate-spin" />
          Loading files
        </div>
      ) : error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>Files could not be loaded.</span>
          </div>
          <Button variant="ghost" size="sm" className="mt-2 text-rose-700 dark:text-rose-300" onClick={onRetry}>
            <RefreshCcw className="size-4" />
            Retry
          </Button>
        </div>
      ) : files.length === 0 ? (
        <FileEmptyState />
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <FileListItem
              key={file.id}
              file={file}
              deleting={deleting}
              onSelect={onSelect}
              onDelete={(fileId) => void deleteFile({ variables: { fileId } })}
            />
          ))}
        </div>
      )}
    </section>
  );
}
