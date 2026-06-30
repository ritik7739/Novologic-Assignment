'use client';

import { useMutation } from '@apollo/client';
import type { Editor } from '@tiptap/react';
import { useCallback, useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { UPLOAD_FILE_METADATA } from '@/lib/graphql/mutations/file.mutations';
import { GET_WORKBOOK } from '@/lib/graphql/queries/workbook.queries';
import { MAX_EMBEDDED_PDF_PAGES, renderPdfPagesToImages } from '@/lib/utils/pdfToImages';
import type { UploadResult } from '@/types/file.types';

export type UploadProgressState = {
  kind: 'image' | 'pdf';
  mode: 'uploading' | 'rendering' | 'embedding';
  label: string;
  current?: number;
  total?: number;
  percent?: number;
};

const filesBaseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL ?? 'http://localhost:4000';
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL ?? 'http://localhost:4000/upload';

function getPageImageName(fileName: string, pageNumber: number) {
  const baseName = fileName.replace(/\.pdf$/i, '') || 'pdf';
  return `${baseName}-page-${String(pageNumber).padStart(3, '0')}.png`;
}

export function useFileUpload(workbookId?: string, userId?: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<UploadProgressState | null>(null);
  const [saveMetadata] = useMutation(UPLOAD_FILE_METADATA);

  const saveUploadedMetadata = useCallback(
    async (uploaded: UploadResult, refetch = true) => {
      await saveMetadata({
        variables: {
          workbookId,
          name: uploaded.name,
          mimeType: uploaded.mimeType,
          size: uploaded.size,
          storageKey: uploaded.storageKey,
        },
        refetchQueries: refetch && userId ? [{ query: GET_WORKBOOK, variables: { userId } }] : [],
        awaitRefetchQueries: refetch,
      });
    },
    [saveMetadata, userId, workbookId],
  );

  const uploadToStorage = useCallback(
    async (file: File): Promise<UploadResult> => {
      if (!workbookId) {
        throw new Error('Workbook is not ready');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('workbookId', workbookId);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.status === 413 ? 'File is too large' : 'Upload failed');
      }

      return (await response.json()) as UploadResult;
    },
    [workbookId],
  );

  const uploadFile = useCallback(async (file: File): Promise<UploadResult> => {
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
      setProgress({ kind: file.type === 'application/pdf' ? 'pdf' : 'image', mode: 'uploading', label: 'Uploading file...', percent: 15 });
      const uploaded = await uploadToStorage(file);
      await saveUploadedMetadata(uploaded);
      toast.success('File uploaded');
      return uploaded;
    } catch (uploadError) {
      const normalized = uploadError instanceof Error ? uploadError : new Error('Upload failed');
      setError(normalized);
      toast.error(normalized.message);
      throw normalized;
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }, [saveUploadedMetadata, uploadToStorage, workbookId]);

  const uploadAndInsertFile = useCallback(
    async (file: File, editor: Editor | null): Promise<void> => {
      if (!editor) {
        return;
      }

      const isSupported = file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!isSupported) {
        toast.error('Only images and PDFs can be uploaded');
        return;
      }

      setUploading(true);
      setError(null);
      setProgress({
        kind: file.type === 'application/pdf' ? 'pdf' : 'image',
        mode: 'uploading',
        label: 'Uploading file...',
        percent: 10,
      });

      try {
        if (file.type.startsWith('image/')) {
          const uploaded = await uploadToStorage(file);
          await saveUploadedMetadata(uploaded);
          const src = `${filesBaseUrl}${uploaded.storageKey}`;
          editor.chain().focus().setImage({ src, alt: uploaded.name }).run();
          toast.success('Image inserted');
          return;
        }

        const originalPdf = await uploadToStorage(file);
        await saveUploadedMetadata(originalPdf, false);

        const pageImages = await renderPdfPagesToImages(file, {
          maxPages: MAX_EMBEDDED_PDF_PAGES,
          onProgress: (currentPage, totalPages) => {
            setProgress({
              kind: 'pdf',
              mode: 'rendering',
              label: `Rendering page ${currentPage} of ${totalPages}...`,
              current: currentPage,
              total: totalPages,
              percent: Math.round((currentPage / totalPages) * 100),
            });
          },
        });

        if (pageImages.length === 0) {
          throw new Error("Couldn't read this PDF. Please try another file.");
        }

        if (pageImages.length === MAX_EMBEDDED_PDF_PAGES) {
          toast.warning(`PDF too large - only the first ${MAX_EMBEDDED_PDF_PAGES} pages were embedded`);
        }

        const content = [];

        for (let index = 0; index < pageImages.length; index += 1) {
          const pageNumber = index + 1;
          setProgress({
            kind: 'pdf',
            mode: 'embedding',
            label: `Uploading page ${pageNumber} of ${pageImages.length}...`,
            current: pageNumber,
            total: pageImages.length,
            percent: Math.round((pageNumber / pageImages.length) * 100),
          });

          const pageFile = new File([pageImages[index]], getPageImageName(file.name, pageNumber), {
            type: 'image/png',
          });
          const uploadedPage = await uploadToStorage(pageFile);
          await saveUploadedMetadata(uploadedPage, pageNumber === pageImages.length);
          const src = `${filesBaseUrl}${uploadedPage.storageKey}`;

          content.push({ type: 'image', attrs: { src, alt: `${file.name} page ${pageNumber}` } });
          content.push({ type: 'paragraph' });
        }

        editor.chain().focus().insertContent(content, { updateSelection: true }).run();
        toast.success(`PDF embedded - ${pageImages.length} pages added to workbook`);
      } catch (uploadError) {
        const message =
          file.type === 'application/pdf' && !(uploadError instanceof Error && uploadError.message === 'File is too large')
            ? "Couldn't read this PDF. Please try another file."
            : uploadError instanceof Error
              ? uploadError.message
              : 'Upload failed';
        const normalized = uploadError instanceof Error ? uploadError : new Error(message);
        setError(normalized);
        toast.error(message);
      } finally {
        setUploading(false);
        setProgress(null);
      }
    },
    [saveUploadedMetadata, uploadToStorage],
  );

  return { uploadFile, uploadAndInsertFile, uploading, error, progress };
}
