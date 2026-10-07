import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, containerClassName, ...props },
  ref
) {
  return (
    <label className={clsx("block", containerClassName)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        )}
        <input
          ref={ref}
          className={clsx(
            "h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400",
            "outline-none transition-shadow focus:ring-4",
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-ink-200 focus:border-brand-400 focus:ring-brand-100",
            Icon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <span className="mt-1 block text-xs text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-400">{hint}</span>
      ) : null}
    </label>
  );
});

export const Select = forwardRef(function Select(
  { label, error, className, containerClassName, children, ...props },
  ref
) {
  return (
    <label className={clsx("block", containerClassName)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <select
        ref={ref}
        className={clsx(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 outline-none transition-shadow focus:ring-4",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-ink-200 focus:border-brand-400 focus:ring-brand-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, className, containerClassName, ...props },
  ref
) {
  return (
    <label className={clsx("block", containerClassName)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <textarea
        ref={ref}
        className={clsx(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400",
          "outline-none transition-shadow focus:ring-4",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-ink-200 focus:border-brand-400 focus:ring-brand-100",
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
});
