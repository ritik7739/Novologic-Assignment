import { Skeleton } from '@/components/ui/Skeleton';

export function EditorSkeleton() {
  return (
    <div className="space-y-4 p-4 lg:p-8 xl:p-10">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="mx-auto h-[760px] max-w-5xl rounded-lg" />
    </div>
  );
}
