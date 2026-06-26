import Image from 'next/image';
import { ChevronDown, Cloud, PanelLeft, Search } from 'lucide-react';
import type { User } from '@/types/graphql.types';
import { Button } from '@/components/ui/Button';

export function Header({ user }: { user?: User }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <PanelLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3 font-semibold text-slate-950 dark:text-white">
            <span className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-soft-sm dark:border-slate-800 dark:bg-slate-900">
              <Image src="/logo.svg" alt="" width={24} height={24} />
            </span>
            <span className="truncate">Novologic Workbook</span>
          </div>
        </div>
        <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 lg:flex">
          <Search className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">Search notes, files, and saved versions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300 sm:flex">
            <Cloud className="size-3.5" />
            Synced
          </div>
          <button className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="max-w-28 truncate">{user?.name ?? 'Ritik'}</span>
            <ChevronDown className="size-4 shrink-0 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
