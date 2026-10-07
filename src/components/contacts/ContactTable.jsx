import { motion } from "framer-motion";
import { fullName } from "../../utils/formatters";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

const listVariants = {
  animate: { transition: { staggerChildren: 0.035 } },
};

const rowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function ContactTable({ contacts, onRowClick, renderMeta }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      <div className="grid grid-cols-[1.6fr_1.1fr_1.1fr_1.4fr_1fr] gap-4 border-b border-ink-100 bg-ink-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
        <span>Name</span>
        <span>Designation</span>
        <span>Contact Number</span>
        <span>Email</span>
        <span>Company</span>
      </div>

      <motion.div variants={listVariants} initial="initial" animate="animate">
        {contacts.map((contact) => (
          <motion.button
            key={contact.id}
            variants={rowVariants}
            onClick={() => onRowClick(contact)}
            whileHover={{ backgroundColor: "rgba(43,79,234,0.03)" }}
            className="grid w-full grid-cols-[1.6fr_1.1fr_1.1fr_1.4fr_1fr] items-center gap-4 border-b border-ink-100 px-6 py-3.5 text-left last:border-b-0"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Avatar contact={contact} size="sm" />
              <span className="truncate text-sm font-medium text-ink-800">{fullName(contact)}</span>
            </span>
            <span className="truncate text-sm text-ink-500">{contact.designation}</span>
            <span className="truncate text-sm text-ink-500">{contact.phone}</span>
            <span className="truncate text-sm text-ink-500">{contact.email}</span>
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-ink-500">{contact.company}</span>
              {renderMeta?.(contact)}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export function CreditPill({ credits }) {
  if (!credits) return null;
  const positive = credits > 0;
  return (
    <Badge tone={positive ? "success" : "danger"} className="shrink-0">
      {positive ? "+" : ""}
      {credits}
    </Badge>
  );
}
