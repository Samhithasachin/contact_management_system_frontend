import { motion } from "framer-motion";
import { Building2, CheckCircle2, Contact2, Users } from "lucide-react";

const floatCard = (delay) => ({
  initial: { opacity: 0, y: 24, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export function AuthShowcase() {
  return (
    <div className="relative hidden w-[42%] overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 lg:flex lg:flex-col lg:justify-center lg:px-14">
      <motion.div
        className="absolute -left-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-16 size-96 rounded-full bg-brand-300/20 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative font-display text-3xl font-bold leading-tight text-white"
      >
        Every contact, <br /> perfectly organized.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative mt-3 max-w-sm text-sm text-brand-100"
      >
        Sync, enrich, and discover the people that matter to your business — with credits you earn
        just by contributing.
      </motion.p>

      <div className="relative mt-10 space-y-3">
        <motion.div
          {...floatCard(0.3)}
          className="flex items-center gap-3 rounded-2xl bg-white/95 p-3.5 shadow-soft backdrop-blur"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Contact2 className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink-800">1,240 contacts synced</p>
            <p className="text-xs text-ink-500">From Google & Outlook</p>
          </div>
          <CheckCircle2 className="ml-auto size-4 text-emerald-500" />
        </motion.div>

        <motion.div
          {...floatCard(0.45)}
          className="ml-8 flex items-center gap-3 rounded-2xl bg-white/95 p-3.5 shadow-soft backdrop-blur"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Building2 className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink-800">Zydus Pharma</p>
            <p className="text-xs text-ink-500">12 employees found</p>
          </div>
        </motion.div>

        <motion.div
          {...floatCard(0.6)}
          className="flex items-center gap-3 rounded-2xl bg-white/95 p-3.5 shadow-soft backdrop-blur"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Users className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink-800">+340 credits earned</p>
            <p className="text-xs text-ink-500">By uploading your network</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
