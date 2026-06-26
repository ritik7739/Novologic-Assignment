import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 lg:p-6">
      <Skeleton className="mb-4 h-16 w-full rounded-lg" />
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-56 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
        <Skeleton className="h-[820px] rounded-lg" />
      </div>
    </main>
  );
}
