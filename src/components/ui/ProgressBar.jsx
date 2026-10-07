import { motion } from "framer-motion";
import clsx from "clsx";

export function ProgressBar({ value, tone = "brand", className }) {
  const colors = {
    brand: "bg-brand-500",
    success: "bg-emerald-500",
    danger: "bg-rose-500",
  };

  return (
    <div className={clsx("h-1.5 w-full overflow-hidden rounded-full bg-ink-100", className)}>
      <motion.div
        className={clsx("h-full rounded-full", colors[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
