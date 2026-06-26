'use client';

import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Minus,
  Redo2,
  Sparkles,
  Underline,
  Undo2,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { FileUploadButton } from '@/components/files/FileUploadButton';
import { SaveStatus } from './SaveStatus';
import { ToolbarButton } from './ToolbarButton';
import type { SaveStatusValue } from '@/types/editor.types';

export function Toolbar({
  editor,
  saveStatus,
  uploading,
  onUpload,
  onManualSave,
  onAiSummary,
}: {
  editor: Editor | null;
  saveStatus: SaveStatusValue;
  uploading?: boolean;
  onUpload: (file: File) => void;
  onManualSave: () => void;
  onAiSummary: () => void;
}) {
  return (
    <div className="sticky top-16 z-40 border-b border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:top-0 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
          <ToolbarButton
            label="Bold"
            icon={Bold}
            active={editor?.isActive('bold')}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="Italic"
            icon={Italic}
            active={editor?.isActive('italic')}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="Underline"
            icon={Underline}
            active={editor?.isActive('underline')}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
          <ToolbarButton
            label="Heading 1"
            icon={Heading1}
            active={editor?.isActive('heading', { level: 1 })}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarButton
            label="Heading 2"
            icon={Heading2}
            active={editor?.isActive('heading', { level: 2 })}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            label="Divider"
            icon={Minus}
            disabled={!editor}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarButton
            label="Bullet list"
            icon={List}
            active={editor?.isActive('bulletList')}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="Numbered list"
            icon={ListOrdered}
            active={editor?.isActive('orderedList')}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
        </div>
        <Separator />
        <ToolbarButton label="Undo" icon={Undo2} disabled={!editor} onClick={() => editor?.chain().focus().undo().run()} />
        <ToolbarButton label="Redo" icon={Redo2} disabled={!editor} onClick={() => editor?.chain().focus().redo().run()} />
        <Separator />
        <FileUploadButton kind="image" disabled={uploading} onFile={onUpload} />
        <FileUploadButton kind="pdf" disabled={uploading} onFile={onUpload} />
        <Button variant="gradient" size="sm" onClick={onAiSummary} disabled={!editor}>
          <Sparkles className="size-4" />
          AI Summary
        </Button>
        <div className="ml-auto flex shrink-0 items-center gap-3 pl-2">
          <button className="text-xs font-semibold text-teal-700 transition hover:text-teal-900 hover:underline dark:text-teal-300 dark:hover:text-teal-200" type="button" onClick={onManualSave}>
            Save now
          </button>
          <SaveStatus status={saveStatus} onRetry={onManualSave} />
        </div>
      </div>
    </div>
  );
}
