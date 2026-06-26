'use client';

import { useMutation, useQuery } from '@apollo/client';
import { RESTORE_VERSION } from '@/lib/graphql/mutations/version.mutations';
import { GET_VERSIONS } from '@/lib/graphql/queries/version.queries';
import type { Workbook, WorkbookVersion } from '@/types/graphql.types';

export function useVersionHistory(workbookId?: string) {
  const query = useQuery<{ workbookVersions: WorkbookVersion[] }>(GET_VERSIONS, {
    variables: { workbookId },
    skip: !workbookId,
  });
  const [restoreMutation] = useMutation<{ restoreVersion: Workbook }>(RESTORE_VERSION, {
    refetchQueries: ['GetVersions', 'GetWorkbook'],
  });

  const restoreVersion = (versionId: string) => restoreMutation({ variables: { versionId } });

  return {
    versions: query.data?.workbookVersions ?? [],
    loading: query.loading,
    error: query.error,
    restoreVersion,
    refetch: query.refetch,
  };
}
