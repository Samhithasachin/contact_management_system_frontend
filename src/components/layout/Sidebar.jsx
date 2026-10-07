import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Contact2, Compass, Settings, User } from "lucide-react";
import { BrandMark } from "../ui/BrandMark";

const NAV_ITEMS = [
  { to: "/contacts", label: "Contacts", icon: Contact2 },
  { to: "/find-contacts", label: "Find Contacts", icon: Compass },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-200 bg-white px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <BrandMark size={32} />
        <span className="font-display text-lg font-bold tracking-tight text-ink-900">CMS</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className="relative">
            {({ isActive }) => (
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-brand-50"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "text-brand-700" : "text-ink-500 hover:text-ink-800"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
