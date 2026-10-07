import clsx from "clsx";

const TONES = {
  brand: "bg-brand-50 text-brand-700",
  neutral: "bg-ink-100 text-ink-600",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-rose-50 text-rose-700",
  warning: "bg-amber-50 text-amber-700",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
