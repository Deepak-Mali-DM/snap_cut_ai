import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) onImageUpload(file);
    },
    [onImageUpload]
  );

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageUpload(file);
    };
    input.click();
  }, [onImageUpload]);

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const item = e.clipboardData?.items[0];
      if (item?.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) onImageUpload(file);
      } else if (item?.type === 'text/plain') {
        const url = await new Promise<string>((resolve) => {
          item.getAsString(resolve);
        });
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], 'pasted-image', { type: blob.type });
          onImageUpload(file);
        } catch (error) {
          console.error('Failed to fetch image from URL:', error);
        }
      }
    },
    [onImageUpload]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`upload-card flex flex-col items-center justify-center gap-5 p-10 min-h-[320px] transition-all duration-200 ${
        isDragging ? 'ring-2 ring-primary ring-offset-2 bg-primary/[0.02]' : ''
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDragging ? 'drop' : 'idle'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex flex-col items-center gap-5"
        >
          <Button
            variant="snap"
            size="lg"
            className="text-base px-10 py-6 rounded-full"
            onClick={handleClick}
          >
            Upload Image
          </Button>
          <div className="text-center space-y-1">
            <p className="text-muted-foreground font-medium text-sm">
              or drop a file,
            </p>
            <p className="text-muted-foreground/70 text-xs">
              paste image or URL
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
