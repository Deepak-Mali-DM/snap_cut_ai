import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ApertureProps {
  onImageUpload: (file: File) => void;
}

const Aperture = ({ onImageUpload }: ApertureProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageUpload(file);
    };
    input.click();
  }, [onImageUpload]);

  return (
    <motion.div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative min-h-[420px] md:min-h-[500px] w-full rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-6 ${
        isDragging ? "aperture-active" : "aperture-border"
      }`}
      style={{
        background: isDragging
          ? "hsl(178 65% 48% / 0.04)"
          : "hsl(220 15% 16% / 0.3)",
      }}
      whileHover={{ borderColor: "hsl(178, 65%, 48%)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDragging ? "dragging" : "idle"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl surface-card flex items-center justify-center">
            {isDragging ? (
              <ImageIcon className="w-7 h-7 text-primary" />
            ) : (
              <Upload className="w-7 h-7 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold text-lg">
              {isDragging ? "Release to upload" : "Drop an image here"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              or click to browse · PNG, JPG, WEBP
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Marching ants SVG overlay when dragging */}
      {isDragging && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ borderRadius: "0.75rem" }}
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="12"
            ry="12"
            fill="none"
            stroke="hsl(178, 65%, 48%)"
            strokeWidth="2"
            strokeDasharray="8 4"
            style={{ animation: "marching-ants 0.4s linear infinite" }}
          />
        </svg>
      )}
    </motion.div>
  );
};

export default Aperture;
