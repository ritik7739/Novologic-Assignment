'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { ApolloError } from '@apollo/client';
import { EditorContent, useEditor } from '@tiptap/react';
import { AlertCircle, FileText, RefreshCcw } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { DragDropOverlay } from '@/components/files/DragDropOverlay';
import { useAutosave } from '@/hooks/useAutosave';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useFileUpload } from '@/hooks/useFileUpload';
import { editorExtensions } from '@/lib/tiptap/editorConfig';
import { cn } from '@/lib/utils/cn';
import { EditorSkeleton } from './EditorSkeleton';
import { Toolbar } from './Toolbar';
import { VersionHistory } from '@/components/versions/VersionHistory';
import type { Workbook, WorkbookFile } from '@/types/graphql.types';

type SaveWorkbookFn = (workbookId: string, content: Record<string, unknown>) => Promise<unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getUploadStorageKey(src: unknown) {
  if (typeof src !== 'string') {
    return undefined;
  }

  const uploadIndex = src.indexOf('/uploads/');
  return uploadIndex >= 0 ? src.slice(uploadIndex) : undefined;
}

function removeMissingFileEmbeds(node: unknown, availableStorageKeys: Set<string>): unknown {
  if (Array.isArray(node)) {
    return node
      .map((child) => removeMissingFileEmbeds(child, availableStorageKeys))
      .filter((child): child is Record<string, unknown> => isRecord(child));
  }

  if (!isRecord(node)) {
    return node;
  }

  const storageKey = getUploadStorageKey(isRecord(node.attrs) ? node.attrs.src : undefined);
  const isFileEmbed = node.type === 'image' || node.type === 'pdfNode';

  if (isFileEmbed && storageKey && !availableStorageKeys.has(storageKey)) {
    return undefined;
  }

  return {
    ...node,
    ...(Array.isArray(node.content) ? { content: removeMissingFileEmbeds(node.content, availableStorageKeys) } : {}),
  };
}

function sanitizeWorkbookContent(content: Record<string, unknown>, files: WorkbookFile[]) {
  const availableStorageKeys = new Set(files.map((file) => file.storageKey));
  return removeMissingFileEmbeds(content, availableStorageKeys) as Record<string, unknown>;
}

export function WorkbookEditor({
  userId,
  workbook,
  loading,
  error,
  saveWorkbook,
  refetch,
  fileToInsert,
  onFileInserted,
}: {
  userId: string;
  workbook?: Workbook;
  loading: boolean;
  error?: ApolloError;
  saveWorkbook: SaveWorkbookFn;
  refetch: () => unknown;
  fileToInsert?: { file: WorkbookFile; requestId: number };
  onFileInserted?: (requestId: number) => void;
}) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { uploadFile, uploading } = useFileUpload(workbook?.id, userId);
  const { status, scheduleSave, saveNow } = useAutosave(workbook?.id, saveWorkbook);

  const editor = useEditor({
    extensions: editorExtensions,
    content: workbook?.content ?? '',
    editorProps: {
      attributes: {
        class:
          'prose prose-slate dark:prose-invert max-w-none rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-soft-sm transition focus-within:border-teal-300 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-teal-700 sm:px-8 sm:py-8 lg:px-14',
      },
    },
    onUpdate: ({ editor }) => {
      scheduleSave(editor.getJSON() as Record<string, unknown>);
    },
  });

  useEffect(() => {
    if (editor && workbook?.content) {
      const sanitizedContent = sanitizeWorkbookContent(workbook.content, workbook.files);
      const currentContent = editor.getJSON() as Record<string, unknown>;
      const serializedSanitizedContent = JSON.stringify(sanitizedContent);

      if (JSON.stringify(currentContent) !== serializedSanitizedContent) {
        editor.commands.setContent(sanitizedContent, false);
      }

      if (serializedSanitizedContent !== JSON.stringify(workbook.content)) {
        void saveNow(sanitizedContent);
      }
    }
  }, [editor, saveNow, workbook?.content, workbook?.files]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void saveNow(editor?.getJSON() as Record<string, unknown> | undefined);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editor, saveNow]);

  const insertUploadedFile = useCallback(
    async (file: File) => {
      if (!editor) {
        return;
      }

      try {
        const uploaded = await uploadFile(file);
        const src = `${process.env.NEXT_PUBLIC_FILES_BASE_URL ?? 'http://localhost:4000'}${uploaded.storageKey}`;

        if (uploaded.mimeType.startsWith('image/')) {
          editor.chain().focus().setImage({ src, alt: uploaded.name }).run();
          return;
        }

        if (uploaded.mimeType === 'application/pdf') {
          editor.commands.insertPDFNode({ src, filename: uploaded.name });
        }
      } catch {
        // Toast is emitted by useFileUpload; keep the editor stable.
      }
    },
    [editor, uploadFile],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        await insertUploadedFile(file);
      }
    },
    [insertUploadedFile],
  );

  const { dragging } = useDragDrop(editorContainerRef, handleFiles);

  useEffect(() => {
    if (!editor || !fileToInsert) {
      return;
    }

    const { file, requestId } = fileToInsert;
    const src = `${process.env.NEXT_PUBLIC_FILES_BASE_URL ?? 'http://localhost:4000'}${file.storageKey}`;

    if (file.mimeType.startsWith('image/')) {
      editor.chain().focus().setImage({ src, alt: file.name }).run();
      toast.success('Image inserted');
    } else if (file.mimeType === 'application/pdf') {
      editor.chain().focus().insertPDFNode({ src, filename: file.name }).run();
      toast.success('PDF inserted');
    }

    onFileInserted?.(requestId);
  }, [editor, fileToInsert, onFileInserted]);

  if (loading) {
    return <EditorSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 xl:p-10">
        <div className="rounded-lg border border-rose-200 bg-white p-6 shadow-soft-sm dark:border-rose-900/70 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-950 dark:text-white">Workbook could not be loaded</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Check the backend connection or try loading the workbook again.
              </p>
              <Button className="mt-4" variant="outline" onClick={() => void refetch()}>
                <RefreshCcw className="size-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workbook) {
    return <EditorSkeleton />;
  }

  return (
    <div ref={editorContainerRef} className="relative">
      <Toolbar
        editor={editor}
        saveStatus={status}
        uploading={uploading}
        onUpload={(file) => void insertUploadedFile(file)}
        onManualSave={() => void saveNow(editor?.getJSON() as Record<string, unknown> | undefined)}
        onAiSummary={() => {
          editor
            ?.chain()
            .focus()
            .insertContent(
              [
                {
                  type: 'blockquote',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'AI summary: This workbook captures the latest notes, files, and key decisions in one editable workspace.' }],
                    },
                  ],
                },
                { type: 'paragraph' },
              ],
              { updateSelection: true },
            )
            .run();
          toast.success('Summary inserted');
        }}
      />
      <div className={cn('px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8 xl:px-10')}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-soft-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-slate-950 dark:text-white">Primary workbook</h1>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">Autosaved notes, uploads, and version history</p>
              </div>
            </div>
            <span className="w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {workbook.files.length} attached {workbook.files.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="px-4 pb-8 lg:px-8 xl:px-10">
        <VersionHistory
          workbookId={workbook.id}
          onRestore={(restoredWorkbook) => {
            const sanitizedContent = sanitizeWorkbookContent(restoredWorkbook.content, workbook.files);
            editor?.commands.setContent(sanitizedContent, false);
          }}
        />
      </div>
      <DragDropOverlay visible={dragging} />
    </div>
  );
}
