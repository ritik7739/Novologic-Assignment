'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SaveStatusValue } from '@/types/editor.types';

type SaveFn = (workbookId: string, content: Record<string, unknown>) => Promise<unknown>;

export function useAutosave(workbookId: string | undefined, saveWorkbook: SaveFn) {
  const [status, setStatus] = useState<SaveStatusValue>('saved');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const latestContentRef = useRef<Record<string, unknown>>();

  const saveNow = useCallback(
    async (content = latestContentRef.current) => {
      if (!workbookId || !content) {
        return;
      }

      setStatus('saving');
      try {
        await saveWorkbook(workbookId, content);
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    },
    [saveWorkbook, workbookId],
  );

  const scheduleSave = useCallback(
    (content: Record<string, unknown>) => {
      latestContentRef.current = content;
      setStatus('idle');

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        void saveNow(content);
      }, 5000);
    },
    [saveNow],
  );

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return { status, scheduleSave, saveNow };
}
