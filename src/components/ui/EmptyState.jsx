import { motion } from "framer-motion";

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Icon className="size-6" />
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-ink-800">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-500">{description}</p>}
      {action}
    </motion.div>
  );
}
