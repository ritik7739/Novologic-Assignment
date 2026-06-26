'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronRight, Clock, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import type { Workbook } from '@/types/graphql.types';
import { VersionEmptyState } from './VersionEmptyState';
import { VersionItem } from './VersionItem';

export function VersionHistory({ workbookId, onRestore }: { workbookId?: string; onRestore?: (workbook: Workbook) => void }) {
  const [open, setOpen] = useState(true);
  const { versions, loading, error, restoreVersion, refetch } = useVersionHistory(workbookId);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <section className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white shadow-soft-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
          <Clock className="size-4 text-teal-600 dark:text-teal-400" />
          Version History
        </span>
        <span className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{versions.length} saved</span>
          <Chevron className="size-4 text-slate-400" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-slate-200 p-4 dark:border-slate-800">
              {!workbookId ? (
                <VersionEmptyState message="Create or load a workbook to begin version tracking." />
              ) : loading ? (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">
                  <Loader2 className="size-4 animate-spin" />
                  Loading saved versions
                </div>
              ) : error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>Version history could not be loaded.</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 text-rose-700 dark:text-rose-300" onClick={() => void refetch()}>
                    <RefreshCcw className="size-4" />
                    Retry
                  </Button>
                </div>
              ) : versions.length === 0 ? (
                <VersionEmptyState />
              ) : (
                versions.map((version, index) => (
                  <VersionItem
                    key={version.id}
                    version={version}
                    active={index === 0}
                    onRestore={(versionId) =>
                      void restoreVersion(versionId)
                        .then((result) => {
                          const restoredWorkbook = result.data?.restoreVersion;
                          if (restoredWorkbook) {
                            onRestore?.(restoredWorkbook);
                          }
                          toast.success('Version restored');
                        })
                        .catch(() => toast.error('Could not restore version'))
                    }
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
