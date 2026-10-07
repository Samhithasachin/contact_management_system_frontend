import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row 2xl:max-w-[1600px]">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="size-3.5" />
          </div>
          <span className="font-display text-sm font-bold text-ink-900">Loqo</span>
        </div>
        <p className="text-xs text-ink-400">© {new Date().getFullYear()} Loqo. All rights reserved.</p>
      </div>
    </footer>
  );
}
