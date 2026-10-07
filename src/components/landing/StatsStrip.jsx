import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";

const STATS = [
  { value: 128000, suffix: "+", label: "Contacts synced" },
  { value: 4600, suffix: "+", label: "Companies indexed" },
  { value: 32000, suffix: "+", label: "Credits earned by users" },
  { value: 99, suffix: "%", label: "Uptime" },
];

function Stat({ value, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const animated = useCountUp(inView ? value : 0, { duration: 1.4 });

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-bold text-white sm:text-4xl">
        {animated.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-brand-100">{label}</p>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section className="bg-gradient-to-r from-brand-700 to-brand-900 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 sm:grid-cols-4 2xl:max-w-[1600px]">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
