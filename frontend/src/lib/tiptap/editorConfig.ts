import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { CustomImage } from '@/components/editor/extensions/CustomImage';
import { PDFNode } from '@/components/editor/extensions/PDFNode';

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    history: {},
  }),
  Underline,
  Placeholder.configure({ placeholder: 'Start writing your workbook...' }),
  CustomImage.configure({ inline: false, allowBase64: false }),
  PDFNode,
  Typography,
];
