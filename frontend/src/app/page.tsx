import { WorkbookShell } from '@/components/layout/WorkbookShell';
import type { User } from '@/types/graphql.types';

export const dynamic = 'force-dynamic';

async function getCurrentUser(): Promise<User> {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      query: `
        query CurrentUser {
          currentUser {
            id
            name
            email
            address
            phone
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  const payload = (await response.json()) as { data?: { currentUser?: User }; errors?: unknown[] };
  if (!payload.data?.currentUser) {
    throw new Error(payload.errors?.length ? 'Backend returned an error for currentUser' : 'Current user is missing');
  }

  return payload.data.currentUser;
}

export default async function Page() {
  const user = await getCurrentUser();
  return <WorkbookShell user={user} />;
}
