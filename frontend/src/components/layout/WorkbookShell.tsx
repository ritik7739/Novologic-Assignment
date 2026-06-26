'use client';

import { useCallback, useState } from 'react';
import type { User, WorkbookFile } from '@/types/graphql.types';
import { FileList } from '@/components/files/FileList';
import { WorkbookEditor } from '@/components/editor/WorkbookEditor';
import { UserCard } from '@/components/user/UserCard';
import { useWorkbook } from '@/hooks/useWorkbook';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { Sidebar } from './Sidebar';

export function WorkbookShell({ user }: { user: User }) {
  const { workbook, loading, error, refetch, saveWorkbook } = useWorkbook(user.id);
  const [fileToInsert, setFileToInsert] = useState<{ file: WorkbookFile; requestId: number }>();
  const handleFileInserted = useCallback((requestId: number) => {
    setFileToInsert((current) => (current?.requestId === requestId ? undefined : current));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <Header user={user} />
      <div className="flex flex-col lg:h-[calc(100vh-4rem)] lg:flex-row lg:overflow-hidden">
        <Sidebar>
          <UserCard user={user} />
          <FileList
            files={workbook?.files ?? []}
            userId={user.id}
            loading={loading}
            error={error}
            onRetry={() => void refetch()}
            onSelect={(file) => setFileToInsert({ file, requestId: Date.now() })}
          />
        </Sidebar>
        <MainContent>
          <WorkbookEditor
            userId={user.id}
            workbook={workbook}
            loading={loading}
            error={error}
            saveWorkbook={saveWorkbook}
            refetch={refetch}
            fileToInsert={fileToInsert}
            onFileInserted={handleFileInserted}
          />
        </MainContent>
      </div>
    </div>
  );
}
