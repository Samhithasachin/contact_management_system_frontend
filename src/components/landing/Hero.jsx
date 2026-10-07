import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Building2, Contact2, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const sample = [
    { fname: "Ananya", lname: "Rao", role: "VP · Sales", company: "Central Perk" },
    { fname: "John", lname: "Doe", role: "CEO", company: "Zydus Pharma" },
    { fname: "Priya", lname: "Nair", role: "Sr. Associate", company: "TCS" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden pb-24 pt-6 sm:pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-brand-50 via-white to-white" />
      <motion.div
        className="pointer-events-none absolute right-[-10%] top-10 -z-10 size-[420px] rounded-full bg-brand-200/40 blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-7xl px-6 text-center 2xl:max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-medium text-brand-700"
        >
          <Sparkles className="size-3.5" /> Earn credits by growing the directory
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-6xl"
        >
          Every contact you'll ever need,
          <span className="text-brand-600"> one credit away.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-5 max-w-xl text-lg text-ink-500"
        >
          Sync your network, upload your own contacts to earn credits, and unlock verified people
          from companies across the shared Loqo directory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/register">
            <Button size="lg" icon={ArrowRight}>
              Start for free
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Sign in
            </Button>
          </Link>
        </motion.div>

        <motion.div
          style={{ y, opacity }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative mx-auto mt-16 max-w-3xl rounded-2xl border border-ink-200 bg-white p-4 text-left shadow-soft sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Contact2 className="size-4 text-brand-600" />
              <span className="text-sm font-semibold text-ink-800">All Contacts (2,481)</span>
            </div>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500">
              340 credits
            </span>
          </div>
          <div className="space-y-2">
            {sample.map((c, i) => (
              <motion.div
                key={c.fname}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2.5"
              >
                <Avatar contact={c} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800">
                    {c.fname} {c.lname}
                  </p>
                  <p className="truncate text-xs text-ink-500">{c.role}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-ink-400">
                  <Building2 className="size-3" /> {c.company}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
