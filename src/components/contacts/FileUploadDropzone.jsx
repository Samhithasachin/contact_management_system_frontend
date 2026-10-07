import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, File, CheckCircle2, AlertCircle, RotateCcw, Trash2 } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB

function makeEntry(file) {
  const tooLarge = file.size > MAX_SIZE;
  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    file,
    progress: tooLarge ? 0 : 0,
    status: tooLarge ? "error" : "uploading",
    error: tooLarge ? "File exceeds 15MB limit" : null,
  };
}

export function FileUploadDropzone({ onFilesReady, accept, hint = "Max file size: 15MB" }) {
  const [entries, setEntries] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const runProgress = useCallback((id) => {
    const tick = () => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.id !== id || e.status !== "uploading") return e;
          const next = Math.min(e.progress + Math.random() * 22 + 8, 100);
          return { ...e, progress: next, status: next >= 100 ? "done" : "uploading" };
        })
      );
    };
    const interval = setInterval(() => {
      tick();
    }, 220);
    setTimeout(() => clearInterval(interval), 2400);
  }, []);

  const addFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList);
      const newEntries = files.map(makeEntry);
      setEntries((prev) => [...prev, ...newEntries]);
      newEntries.forEach((e) => {
        if (e.status === "uploading") runProgress(e.id);
      });
      const readyFiles = newEntries.filter((e) => e.status !== "error").map((e) => e.file);
      if (readyFiles.length) onFilesReady?.(readyFiles);
    },
    [onFilesReady, runProgress]
  );

  const retry = (id) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "uploading", progress: 0, error: null } : e))
    );
    runProgress(id);
  };

  const remove = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <div>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: dragActive ? "var(--color-brand-400)" : "var(--color-ink-200)",
          scale: dragActive ? 1.01 : 1,
          backgroundColor: dragActive ? "var(--color-brand-50)" : "#ffffff",
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-14 text-center"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files.length && addFiles(e.target.files)}
        />
        <motion.div
          animate={{ y: dragActive ? -4 : 0 }}
          className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-500"
        >
          <UploadCloud className="size-5" />
        </motion.div>
        <p className="text-sm text-ink-600">
          Drag and drop your file(s) here or{" "}
          <span className="font-medium text-brand-600 underline-offset-4 hover:underline">Browse</span>
        </p>
        <p className="text-xs text-ink-400">{hint}</p>
      </motion.div>

      {entries.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white px-3 py-2.5"
              >
                <File className="size-4 shrink-0 text-ink-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-700">{entry.file.name}</p>
                  {entry.status === "uploading" && (
                    <ProgressBar value={entry.progress} className="mt-1.5" />
                  )}
                  {entry.status === "error" && (
                    <p className="mt-0.5 text-xs text-rose-500">{entry.error}</p>
                  )}
                </div>
                {entry.status === "uploading" && (
                  <button onClick={() => remove(entry.id)}>
                    <Trash2 className="size-4 text-ink-300 hover:text-ink-500" />
                  </button>
                )}
                {entry.status === "done" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  </motion.span>
                )}
                {entry.status === "error" && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="size-4 text-rose-500" />
                    <button onClick={() => retry(entry.id)}>
                      <RotateCcw className="size-4 text-ink-400 hover:text-ink-600" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
