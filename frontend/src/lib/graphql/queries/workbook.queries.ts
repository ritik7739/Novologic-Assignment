import { gql } from '@apollo/client';

export const GET_WORKBOOK = gql`
  query GetWorkbook($userId: String!) {
    workbook(userId: $userId) {
      id
      content
      updatedAt
      files {
        id
        name
        mimeType
        size
        storageKey
        createdAt
      }
    }
  }
`;
