import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 2xl:max-w-[1600px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-16 text-center"
      >
        <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 size-72 rounded-full bg-brand-400/20 blur-3xl" />
        <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
          Ready to grow your network?
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-ink-300">
          Join Loqo and turn the contacts you already have into credits you can spend.
        </p>
        <Link to="/register" className="relative mt-7 inline-block">
          <Button size="lg" icon={ArrowRight}>
            Create your free account
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
