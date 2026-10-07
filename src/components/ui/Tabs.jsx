import { motion } from "framer-motion";
import clsx from "clsx";

export function Tabs({ tabs, active, onChange, layoutId = "tab-underline" }) {
  return (
    <div className="flex items-center gap-6 border-b border-ink-200">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={clsx(
              "relative flex items-center gap-1.5 pb-3 pt-1 text-sm font-medium transition-colors",
              isActive ? "text-brand-600" : "text-ink-500 hover:text-ink-800"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.5 text-[11px]",
                  isActive ? "bg-brand-50 text-brand-600" : "bg-ink-100 text-ink-500"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand-600"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
