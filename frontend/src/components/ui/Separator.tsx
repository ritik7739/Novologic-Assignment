import { cn } from '@/lib/utils/cn';

export function Separator({ className }: { className?: string }) {
  return <span className={cn('mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700', className)} />;
}
