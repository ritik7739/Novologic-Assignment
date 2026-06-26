import type { Editor } from '@tiptap/react';

export type SaveStatusValue = 'idle' | 'saving' | 'saved' | 'error';

export type WorkbookEditorProps = {
  userId: string;
};

export type EditorCommandProps = {
  editor: Editor | null;
};
