import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ImageUploader from "@/components/ImageUploader";
import ImageWorkbench from "@/components/ImageWorkbench";
import heroPerson from "@/assets/hero-person.png";

const sampleThumbs = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
];

const navItems = ["Uploads", "Bulk Editing", "API", "Plugins", "Pricing"];

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="w-full border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.png.png" alt="SnapCut.ai Logo" className="w-32" />
            </a>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </a>
            <a
              href="#"
              className="text-sm font-medium border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!imageFile ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-7xl mx-auto px-6 py-16 md:py-24"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left — Hero */}
                <div className="space-y-6">
                  <img
                    src={heroPerson}
                    alt="Person with background removed"
                    className="w-72 md:w-80 mx-auto md:mx-0"
                  />
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                      Remove Image
                      <br />
                      Background
                    </h1>
                    <p className="mt-3 text-lg text-muted-foreground">
                      100% Automatically and{" "}
                      <span className="bg-primary text-primary-foreground text-sm font-bold px-2 py-0.5 rounded">
                        Free
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right — Upload */}
                <div className="space-y-5">
                  <ImageUploader onImageUpload={setImageFile} />

                  <div className="flex items-center gap-3 px-1">
                    <span className="text-sm text-muted-foreground">
                      No image? Try one of these:
                    </span>
                    <div className="flex gap-2">
                      {sampleThumbs.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Sample ${i + 1}`}
                          className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground/60 px-1">
                    By uploading an image you agree to our{" "}
                    <a href="#" className="underline">Terms of Service</a>. To learn more
                    about how SnapCut.ai handles your personal data, check our{" "}
                    <a href="#" className="underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workbench"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6 py-12"
            >
              <ImageWorkbench
                imageFile={imageFile}
                onReset={() => setImageFile(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
