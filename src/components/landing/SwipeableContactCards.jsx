import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Check, MapPin, ShieldCheck, X } from "lucide-react";

const CARDS = [
  { name: "Meera Iyer", role: "VP · Sales", company: "Zydus Pharma", location: "Ahmedabad", initials: "MI" },
  { name: "Rahul Nair", role: "Senior Associate", company: "Infosys BPM", location: "Bengaluru", initials: "RN" },
  { name: "Arjun Shah", role: "CEO", company: "Cadila Healthcare", location: "Mumbai", initials: "AS" },
  { name: "Priya Menon", role: "Head of Growth", company: "Freshworks", location: "Chennai", initials: "PM" },
];

const STACK_SIZE = 3;
const SWIPE_THRESHOLD = 110;

function ContactCard({ card, stackPos, leaving, onDragEnd }) {
  const isTop = stackPos === 0;

  return (
    <motion.div
      className="absolute inset-0 flex select-none flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-soft"
      style={{ zIndex: STACK_SIZE - stackPos, cursor: isTop ? "grab" : "default" }}
      initial={false}
      animate={
        leaving
          ? {
              x: leaving.dir * 420,
              opacity: 0,
              rotate: leaving.dir * 18,
              transition: { duration: 0.32, ease: "easeIn" },
            }
          : {
              x: 0,
              opacity: 1,
              rotate: 0,
              scale: 1 - stackPos * 0.05,
              y: stackPos * 14,
              transition: { duration: 0.25, ease: "easeOut" },
            }
      }
      drag={isTop && !leaving ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.6}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) onDragEnd(1);
        else if (info.offset.x < -SWIPE_THRESHOLD) onDragEnd(-1);
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-semibold text-brand-600">
          {card.initials}
        </div>
        <div>
          <p className="font-display text-base font-semibold text-ink-900">{card.name}</p>
          <p className="text-sm text-ink-500">{card.role}</p>
        </div>
        <ShieldCheck className="ml-auto size-4 text-ink-300" />
      </div>

      <div className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm text-ink-500">
        <p className="flex items-center gap-2">
          <Briefcase className="size-3.5 text-ink-400" /> {card.company}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 text-ink-400" /> {card.location}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 self-start rounded-lg bg-ink-50 px-3 py-2 text-xs font-medium text-ink-400">
        <ShieldCheck className="size-3.5" /> Details locked until unlocked
      </div>
    </motion.div>
  );
}

export function SwipeableContactCards() {
  const [order, setOrder] = useState(CARDS.map((_, i) => i));
  const [leaving, setLeaving] = useState(null);

  const triggerSwipe = (dir) => {
    if (leaving) return;
    setLeaving({ index: order[0], dir });
    window.setTimeout(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      setLeaving(null);
    }, 320);
  };

  const visible = order.slice(0, STACK_SIZE);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 2xl:max-w-[1600px]">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-ink-900">Browse the directory, card by card</h2>
        <p className="mt-2 text-ink-500">Drag or tap through sample contacts to see how discovery feels.</p>
      </div>

      <div className="mx-auto flex max-w-sm flex-col items-center">
        <div className="relative h-72 w-full">
          {visible
            .map((cardIndex, stackPos) => ({ cardIndex, stackPos }))
            .reverse()
            .map(({ cardIndex, stackPos }) => (
              <ContactCard
                key={cardIndex}
                card={CARDS[cardIndex]}
                stackPos={stackPos}
                leaving={leaving?.index === cardIndex ? leaving : null}
                onDragEnd={triggerSwipe}
              />
            ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            aria-label="Skip contact"
            onClick={() => triggerSwipe(-1)}
            className="flex size-12 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-400 shadow-soft transition hover:border-rose-200 hover:text-rose-500"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next contact"
            onClick={() => triggerSwipe(1)}
            className="flex size-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition hover:bg-brand-700"
          >
            <Check className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
