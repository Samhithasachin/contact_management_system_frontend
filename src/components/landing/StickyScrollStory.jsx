import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { UploadCloud, Search, Unlock, Coins, Building2, Lock } from "lucide-react";

const STEPS = [
  {
    key: "upload",
    kicker: "01 · Contribute",
    title: "Upload the contacts you already have",
    description:
      "Add contacts manually, drop a file, or scan a business card. Every new contact earns you 5 credits and quietly builds the shared company directory.",
    icon: UploadCloud,
    visual: (
      <div className="w-full max-w-xs rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 text-brand-600">
          <UploadCloud className="size-4" />
          <span className="text-sm font-semibold">Uploading contact.csv</span>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: "10%" }}
            animate={{ width: "92%" }}
            transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <Coins className="size-3.5" /> +5 credits earned
        </div>
      </div>
    ),
  },
  {
    key: "discover",
    kicker: "02 · Discover",
    title: "Search any company's directory",
    description:
      "Look up a company or a name and see who's already in the network — designation, company, and enough context to know it's the right person.",
    icon: Search,
    visual: (
      <div className="w-full max-w-xs rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-400">
          <Search className="size-4" /> Zydus Pharma
        </div>
        <div className="mt-4 space-y-2">
          {["VP · Sales", "Senior Associate", "CEO"].map((role, i) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2"
            >
              <Building2 className="size-3.5 text-ink-400" />
              <span className="text-xs text-ink-600">{role}</span>
              <Lock className="ml-auto size-3 text-ink-300" />
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "purchase",
    kicker: "03 · Unlock",
    title: "Spend credits to reveal full details",
    description:
      "Found the right person? Unlock their full contact info for 5 credits — no subscriptions, no invoices, just the credits you've already earned.",
    icon: Unlock,
    visual: (
      <div className="w-full max-w-xs rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 text-brand-600">
          <Unlock className="size-4" />
          <span className="text-sm font-semibold">Contact unlocked</span>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p className="flex justify-between text-ink-500">
            <span>Email</span> <span className="text-ink-800">j.doe@zydus.com</span>
          </p>
          <p className="flex justify-between text-ink-500">
            <span>Phone</span> <span className="text-ink-800">+91 98765 43210</span>
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
          <Coins className="size-3.5" /> −5 credits spent
        </div>
      </div>
    ),
  },
];

function Scene({ step, onEnter, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);

  return (
    <div ref={ref} className="flex min-h-[28vh] flex-col justify-center py-6 lg:min-h-[38vh] lg:py-6">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        {step.kicker}
      </span>
      <h3 className="mt-3 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        {step.title}
      </h3>
      <p className="mt-3 max-w-md text-ink-500">{step.description}</p>
    </div>
  );
}

export function StickyScrollStory() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 2xl:max-w-[1600px]">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-ink-900">How Loqo works</h2>
        <p className="mt-2 text-ink-500">Three steps, one shared network.</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          {STEPS.map((step, i) => (
            <Scene key={step.key} step={step} index={i} onEnter={setActive} />
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 flex h-[38vh] items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[active].key}
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {STEPS[active].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
