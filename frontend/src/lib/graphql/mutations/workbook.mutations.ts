import { gql } from '@apollo/client';

export const SAVE_WORKBOOK = gql`
  mutation SaveWorkbook($workbookId: String!, $content: JSONObject!) {
    saveWorkbook(workbookId: $workbookId, content: $content) {
      id
      updatedAt
    }
  }
`;
