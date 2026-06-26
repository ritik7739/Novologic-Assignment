import { gql } from '@apollo/client';

export const GET_VERSIONS = gql`
  query GetVersions($workbookId: String!) {
    workbookVersions(workbookId: $workbookId) {
      id
      content
      savedAt
    }
  }
`;
