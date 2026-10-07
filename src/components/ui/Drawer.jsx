import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { createPortal } from "react-dom";

export function Drawer({ open, onClose, children, width = "max-w-md", showBack = false }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className={`relative flex h-full w-full ${width} flex-col overflow-y-auto scrollbar-thin bg-white shadow-soft`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/90 px-5 py-4 backdrop-blur">
              {showBack ? (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
