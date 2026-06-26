'use client';

import { AlertTriangle, RefreshCcw, Server } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertTriangle className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-950 dark:text-white">Workbook failed to load</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check that the backend is running and seeded, then try again.
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                <Server className="size-4" />
                {process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql'}
              </span>
              <p className="mt-1 break-words">{error.message}</p>
            </div>
          </div>
        </div>
        <Button className="mt-5 w-full" onClick={reset}>
          <RefreshCcw className="size-4" />
          Retry
        </Button>
      </div>
    </main>
  );
}
