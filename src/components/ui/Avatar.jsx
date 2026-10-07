import clsx from "clsx";
import { avatarColor, initials, initialsFromString } from "../../utils/formatters";

const SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-24 text-2xl",
};

export function Avatar({ contact, name, src, size = "md", className }) {
  const url = src ?? contact?.profilePicUrl;
  const label = contact ? initials(contact) : initialsFromString(name);

  if (url) {
    return (
      <img
        src={url}
        alt={label}
        className={clsx("rounded-full object-cover ring-2 ring-white", SIZES[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white",
        avatarColor(contact ? initials(contact) : label),
        SIZES[size],
        className
      )}
    >
      {label}
    </div>
  );
}
