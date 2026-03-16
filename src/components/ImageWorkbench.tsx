import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, Eye, EyeOff, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProcessState = "idle" | "scanning" | "done";

interface ImageWorkbenchProps {
  imageFile: File;
  onReset: () => void;
}

const ImageWorkbench = ({ imageFile, onReset }: ImageWorkbenchProps) => {
  const [state, setState] = useState<ProcessState>("idle");
  const [showOriginal, setShowOriginal] = useState(false);
  const [processTime, setProcessTime] = useState<number>(0);
  const [imageUrl] = useState(() => URL.createObjectURL(imageFile));

  const fileSizeKB = (imageFile.size / 1024).toFixed(1);
  const fileSizeMB = (imageFile.size / (1024 * 1024)).toFixed(2);

  const handleProcess = useCallback(() => {
    setState("scanning");
    const start = performance.now();
    // Simulate AI processing
    setTimeout(() => {
      setProcessTime(parseFloat(((performance.now() - start) / 1000).toFixed(1)));
      setState("done");
    }, 1800);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `snapcut-${imageFile.name}`;
    link.click();
  }, [imageUrl, imageFile.name]);

  return (
    <div className="w-full space-y-6">
      {/* Image Preview */}
      <div className="relative min-h-[420px] md:min-h-[500px] w-full rounded-xl overflow-hidden upload-card">
        {/* Transparency grid (visible when processed and not showing original) */}
        {state === "done" && !showOriginal && (
          <div className="absolute inset-0 transparency-grid opacity-40" />
        )}

        {/* The image */}
        <motion.img
          src={imageUrl}
          alt="Uploaded image"
          className="relative z-10 w-full h-full object-contain min-h-[420px] md:min-h-[500px]"
          style={{
            filter: state === "done" && !showOriginal ? "contrast(1.02)" : "none",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Scan line animation */}
        <AnimatePresence>
          {state === "scanning" && (
            <motion.div
              className="absolute inset-y-0 z-20 w-1"
              style={{
                background:
                  "linear-gradient(180deg, transparent, hsl(178 65% 48%), hsl(178 65% 48%), transparent)",
                boxShadow: "0 0 20px 4px hsl(178 65% 48% / 0.4)",
              }}
              initial={{ left: "-2%" }}
              animate={{ left: "102%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            />
          )}
        </AnimatePresence>

        {/* Processing overlay */}
        <AnimatePresence>
          {state === "scanning" && (
            <motion.div
              className="absolute inset-0 z-10 flex items-end justify-center pb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="surface-card rounded-lg px-4 py-2">
                <p className="font-mono-tech text-xs text-primary">
                  Processing...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metadata bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono-tech px-1">
        <span className="truncate max-w-[200px]">{imageFile.name}</span>
        <div className="flex items-center gap-4">
          <span>{fileSizeKB} KB</span>
          {state === "done" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary"
            >
              Processed in {processTime}s
            </motion.span>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <motion.div
        className="flex items-center justify-center gap-3 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {state === "idle" && (
          <>
            <Button variant="snap" size="lg" onClick={handleProcess}>
              <Scissors className="w-4 h-4 mr-2" />
              Remove Background
            </Button>
            <Button variant="snapOutline" size="lg" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </>
        )}

        {state === "done" && (
          <>
            <Button
              variant="snapOutline"
              size="lg"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              {showOriginal ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showOriginal ? "Show Result" : "Show Original"}
            </Button>
            <Button variant="snap" size="lg" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="snapOutline" size="lg" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Image
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ImageWorkbench;
