import { motion } from "framer-motion";
import { Building2, Coins, ScanLine, ShieldCheck, Sparkles, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Sync from anywhere",
    description: "Pull in contacts from Google, Apple, or Microsoft the moment you connect them.",
  },
  {
    icon: Coins,
    title: "Earn as you contribute",
    description: "Every contact you add earns 5 credits — no cost to build up your balance.",
  },
  {
    icon: Building2,
    title: "A living company directory",
    description: "Uploads automatically enrich a searchable directory of companies and people.",
  },
  {
    icon: ScanLine,
    title: "Business card capture",
    description: "Snap a photo at a conference and add it to your contacts in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Locked until unlocked",
    description: "Sensitive details stay masked until a contact is purchased with credits.",
  },
  {
    icon: Sparkles,
    title: "Built for speed",
    description: "A fast, focused workspace so managing thousands of contacts still feels light.",
  },
];

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 2xl:max-w-[1600px]">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-ink-900">
          Everything a growing network needs
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-ink-200 bg-white p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <f.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{f.title}</h3>
            <p className="mt-1.5 text-sm text-ink-500">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
