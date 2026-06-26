'use client';

import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_WORKBOOK } from '@/lib/graphql/queries/workbook.queries';
import { SAVE_WORKBOOK } from '@/lib/graphql/mutations/workbook.mutations';
import type { Workbook } from '@/types/graphql.types';

export function useWorkbook(userId: string) {
  const query = useQuery<{ workbook: Workbook }>(GET_WORKBOOK, {
    variables: { userId },
    skip: !userId,
  });
  const [saveWorkbookMutation] = useMutation(SAVE_WORKBOOK, {
    refetchQueries: ['GetVersions'],
  });

  const saveWorkbook = useCallback(
    (workbookId: string, content: Record<string, unknown>) => saveWorkbookMutation({ variables: { workbookId, content } }),
    [saveWorkbookMutation],
  );

  return {
    workbook: query.data?.workbook,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
    saveWorkbook,
  };
}
