import { Check, User } from "lucide-react";
import clsx from "clsx";

export function BrandMark({ size = 32, className }) {
  const ringSize = Math.round(size * 0.84);
  const badgeSize = Math.round(size * 0.42);

  return (
    <span className={clsx("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className="absolute right-0 top-0 flex items-center justify-center rounded-full border-2 border-brand-600 text-brand-600"
        style={{ width: ringSize, height: ringSize }}
      >
        <User style={{ width: ringSize * 0.5, height: ringSize * 0.5 }} />
      </span>
      <span
        className="absolute bottom-0 left-0 flex items-center justify-center rounded-full bg-brand-600 text-white"
        style={{ width: badgeSize, height: badgeSize }}
      >
        <Check style={{ width: badgeSize * 0.6, height: badgeSize * 0.6 }} />
      </span>
    </span>
  );
}
