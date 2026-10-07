import { FaGoogle, FaMicrosoft } from "react-icons/fa6";
import { fullName } from "../../utils/formatters";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

const SOURCE_ICONS = {
  google: { icon: FaGoogle, color: "text-[#EA4335]", label: "Google" },
  microsoft: { icon: FaMicrosoft, color: "text-[#00A4EF]", label: "Microsoft" },
};

export function PendingContactsPanel({ contacts, selectedIds, onToggle, onToggleAll, onUpload, onDiscard, uploading }) {
  if (contacts.length === 0) return null;
  const allSelected = contacts.every((c) => selectedIds.has(c.id));

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-brand-200 bg-brand-50/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 px-5 py-3">
        <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-800">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => onToggleAll(!allSelected)}
            className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
          />
          Found by sync · {contacts.length} pending
        </label>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onDiscard} disabled={uploading}>
            Discard
          </Button>
          <Button size="sm" onClick={onUpload} loading={uploading} disabled={selectedIds.size === 0}>
            Upload selected ({selectedIds.size})
          </Button>
        </div>
      </div>

      <div className="divide-y divide-brand-100">
        {contacts.map((c) => {
          const source = SOURCE_ICONS[c.raw?.source];
          return (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-white/60"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(c.id)}
                onChange={() => onToggle(c.id)}
                className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
              />
              <Avatar contact={c} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-800">{fullName(c)}</p>
                <p className="truncate text-xs text-ink-500">
                  {c.company} · {c.email}
                </p>
              </div>
              {source && (
                <source.icon className={`size-3.5 shrink-0 ${source.color}`} title={source.label} />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
