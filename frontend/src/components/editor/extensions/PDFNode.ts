import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pdfNode: {
      insertPDFNode: (attrs: { src: string; filename: string }) => ReturnType;
    };
  }
}

export const PDFNode = Node.create({
  name: 'pdfNode',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      filename: { default: 'document.pdf' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-pdf-node]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-pdf-node': '',
        class: 'pdf-node my-4',
      }),
      ['iframe', { src: HTMLAttributes.src, title: HTMLAttributes.filename }],
      ['p', { class: 'mt-2 text-xs text-slate-500' }, HTMLAttributes.filename],
    ];
  },

  addCommands() {
    return {
      insertPDFNode:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs,
          }),
    };
  },
});
