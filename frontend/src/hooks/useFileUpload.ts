'use client';

import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { UPLOAD_FILE_METADATA } from '@/lib/graphql/mutations/file.mutations';
import { GET_WORKBOOK } from '@/lib/graphql/queries/workbook.queries';
import type { UploadResult } from '@/types/file.types';

export function useFileUpload(workbookId?: string, userId?: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [saveMetadata] = useMutation(UPLOAD_FILE_METADATA, {
    refetchQueries: userId ? [{ query: GET_WORKBOOK, variables: { userId } }] : [],
  });

  const uploadFile = async (file: File): Promise<UploadResult> => {
    if (!workbookId) {
      throw new Error('Workbook is not ready');
    }

    const isSupported = file.type.startsWith('image/') || file.type === 'application/pdf';
    if (!isSupported) {
      throw new Error('Only images and PDFs can be uploaded');
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('workbookId', workbookId);

      const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL ?? 'http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.status === 413 ? 'File is too large' : 'Upload failed');
      }

      const uploaded = (await response.json()) as UploadResult;
      await saveMetadata({
        variables: {
          workbookId,
          name: uploaded.name,
          mimeType: uploaded.mimeType,
          size: uploaded.size,
          storageKey: uploaded.storageKey,
        },
      });
      toast.success('File uploaded');
      return uploaded;
    } catch (uploadError) {
      const normalized = uploadError instanceof Error ? uploadError : new Error('Upload failed');
      setError(normalized);
      toast.error(normalized.message);
      throw normalized;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
}
