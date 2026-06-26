'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Upload } from 'lucide-react';

export function DragDropOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-teal-500/10 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="rounded-lg border-2 border-dashed border-teal-400 bg-white/90 p-12 text-center shadow-soft dark:bg-slate-950/90 sm:p-16">
            <Upload className="mx-auto mb-3 size-12 animate-bounce text-teal-500" />
            <p className="font-medium text-slate-800 dark:text-slate-100">Drop files to upload</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
