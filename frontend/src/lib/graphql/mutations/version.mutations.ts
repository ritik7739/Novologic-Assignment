import { gql } from '@apollo/client';

export const RESTORE_VERSION = gql`
  mutation RestoreVersion($versionId: String!) {
    restoreVersion(versionId: $versionId) {
      id
      content
      updatedAt
    }
  }
`;
