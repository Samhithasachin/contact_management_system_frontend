import { motion } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

const PACKS = [
  { credits: 50, price: "$4.99" },
  { credits: 150, price: "$11.99", popular: true },
  { credits: 400, price: "$24.99" },
];

export function BuyCreditsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Buy Credits" className="max-w-lg">
      <p className="mb-5 text-sm text-ink-500">
        Purchasing isn't live yet — earn free credits instantly by uploading your own contacts
        instead.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PACKS.map((pack) => (
          <motion.div
            key={pack.credits}
            whileHover={{ y: -3 }}
            className={`relative rounded-xl border p-4 text-center ${
              pack.popular ? "border-brand-300 bg-brand-50" : "border-ink-200 bg-white"
            }`}
          >
            {pack.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                POPULAR
              </span>
            )}
            <Coins className="mx-auto size-5 text-brand-500" />
            <p className="mt-2 font-display text-lg font-bold text-ink-900">{pack.credits}</p>
            <p className="text-xs text-ink-500">credits</p>
            <p className="mt-2 text-sm font-medium text-ink-700">{pack.price}</p>
          </motion.div>
        ))}
      </div>
      <Button disabled className="mt-5 w-full" icon={Sparkles}>
        Coming soon
      </Button>
    </Modal>
  );
}
