import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import type { User } from '@/types/graphql.types';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function UserCard({ user }: { user: User }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-teal-600 font-semibold text-white shadow-soft-sm">
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-slate-950 dark:text-white">{user.name}</h2>
          <p className="truncate text-sm text-slate-500">{user.email}</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        <span className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-teal-600 dark:text-teal-400" />
          Workspace owner
        </span>
      </div>
      <div className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
        <p className="flex gap-2.5">
          <Mail className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span className="min-w-0 break-words">{user.email}</span>
        </p>
        <p className="flex gap-2.5">
          <Phone className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span>{user.phone}</span>
        </p>
        <p className="flex gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span>{user.address}</span>
        </p>
      </div>
    </section>
  );
}
