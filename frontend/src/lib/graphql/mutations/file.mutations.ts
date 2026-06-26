import { gql } from '@apollo/client';

export const UPLOAD_FILE_METADATA = gql`
  mutation UploadFileMetadata(
    $workbookId: String!
    $name: String!
    $mimeType: String!
    $size: Int!
    $storageKey: String!
  ) {
    uploadFileMetadata(
      workbookId: $workbookId
      name: $name
      mimeType: $mimeType
      size: $size
      storageKey: $storageKey
    ) {
      id
      name
      mimeType
      size
      storageKey
      createdAt
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($fileId: String!) {
    deleteFile(fileId: $fileId)
  }
`;
