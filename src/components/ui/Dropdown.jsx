import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export function Dropdown({ trigger, items, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
            className={clsx(
              "absolute z-30 mt-2 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white p-1.5 shadow-soft",
              align === "right" ? "right-0" : "left-0",
              className
            )}
          >
            {items.map((item, i) =>
              item.type === "divider" ? (
                <div key={i} className="my-1 h-px bg-ink-100" />
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-ink-50"
                >
                  {item.icon && <item.icon className="size-4 text-ink-400" />}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
