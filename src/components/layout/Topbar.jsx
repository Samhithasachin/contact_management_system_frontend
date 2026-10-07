import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Search, Wallet } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useCredits } from "../../context/CreditsContext";
import { useCountUp } from "../../hooks/useCountUp";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { NewContactMenu } from "../contacts/NewContactMenu";

export function Topbar() {
  const { query, setQuery } = useSearch();
  const { balance } = useCredits();
  const animatedBalance = useCountUp(balance);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-ink-200 bg-white px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="h-10 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm outline-none transition-shadow focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-500" />
        </button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profile")}
          className="flex items-center gap-1.5 rounded-full bg-ink-100 py-1.5 pl-3 pr-3.5 text-sm font-semibold text-ink-700"
        >
          <Wallet className="size-3.5 text-brand-600" />
          {animatedBalance}
        </motion.button>

        <NewContactMenu compact />

        <button onClick={() => navigate("/profile")}>
          <Avatar
            name={user ? `${user.fname?.[0] ?? ""}${user.lname?.[0] ?? ""}`.toUpperCase() : "?"}
            src={user?.profilePicUrl}
            size="sm"
          />
        </button>
      </div>
    </header>
  );
}
