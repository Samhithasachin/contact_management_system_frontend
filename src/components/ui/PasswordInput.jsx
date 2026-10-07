import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, containerClassName, className, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={clsx("block", containerClassName)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={clsx(
            "h-10 w-full rounded-lg border bg-white px-3 pr-9 text-sm text-ink-900 placeholder:text-ink-400",
            "outline-none transition-shadow focus:ring-4",
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-ink-200 focus:border-brand-400 focus:ring-brand-100",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
});
