'use client';

import { ChangeEvent, useRef } from 'react';
import { FileText, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FileUploadButton({
  kind,
  disabled,
  busyLabel,
  onFile,
}: {
  kind: 'image' | 'pdf';
  disabled?: boolean;
  busyLabel?: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = kind === 'image';
  const label = busyLabel ?? (isImage ? 'Image' : 'PDF');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }
    event.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={isImage ? 'image/*' : 'application/pdf'}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        className="border-dashed"
        onClick={() => inputRef.current?.click()}
      >
        {busyLabel ? <Loader2 className="size-4 animate-spin" /> : isImage ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
        {label}
      </Button>
    </>
  );
}
