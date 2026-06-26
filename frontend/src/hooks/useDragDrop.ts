'use client';

import { RefObject, useEffect, useState } from 'react';

export function useDragDrop(
  ref: RefObject<HTMLElement>,
  onFiles: (files: File[]) => void | Promise<void>,
) {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    const onDragEnter = (event: DragEvent) => {
      event.preventDefault();
      setDragging(true);
    };
    const onDragOver = (event: DragEvent) => event.preventDefault();
    const onDragLeave = (event: DragEvent) => {
      if (!target.contains(event.relatedTarget as Node | null)) {
        setDragging(false);
      }
    };
    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length > 0) {
        void onFiles(files);
      }
    };

    target.addEventListener('dragenter', onDragEnter);
    target.addEventListener('dragover', onDragOver);
    target.addEventListener('dragleave', onDragLeave);
    target.addEventListener('drop', onDrop);

    return () => {
      target.removeEventListener('dragenter', onDragEnter);
      target.removeEventListener('dragover', onDragOver);
      target.removeEventListener('dragleave', onDragLeave);
      target.removeEventListener('drop', onDrop);
    };
  }, [onFiles, ref]);

  return { dragging };
}
