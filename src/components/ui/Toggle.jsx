import { motion } from "framer-motion";
import clsx from "clsx";

export function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "flex h-6 w-11 items-center rounded-full p-0.5 transition-colors",
        checked ? "bg-brand-600" : "bg-ink-200"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 32 }}
        className="size-5 rounded-full bg-white shadow"
        style={{ marginLeft: checked ? "auto" : 0 }}
      />
    </button>
  );
}
