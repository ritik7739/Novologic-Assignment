export function VersionEmptyState({ message = 'No saved versions yet' }: { message?: string }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950">
      {message}
    </p>
  );
}
