import { PropsWithChildren } from 'react';

export function Sidebar({ children }: PropsWithChildren) {
  return (
    <aside className="border-b border-slate-200 bg-white/95 p-4 dark:border-slate-800 dark:bg-slate-950/95 lg:h-full lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-5">
      {children}
    </aside>
  );
}
