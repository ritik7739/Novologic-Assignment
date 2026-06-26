import { PropsWithChildren } from 'react';

export function MainContent({ children }: PropsWithChildren) {
  return <section className="min-w-0 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">{children}</section>;
}
