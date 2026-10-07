import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  IdCard,
  KeyRound,
  Link2,
  LogOut,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCredits } from "../context/CreditsContext";
import { useCountUp } from "../hooks/useCountUp";
import { Avatar } from "../components/ui/Avatar";
import { BuyCreditsModal } from "../components/contacts/BuyCreditsModal";
import { getPurchasedContacts } from "../api/contacts";

const LINKS = [
  { to: "/profile/personal-information", label: "Personal information", icon: IdCard },
  { to: "/profile/change-password", label: "Change password", icon: KeyRound },
  { to: "/profile/integration", label: "Integration", icon: Link2 },
  { to: "/profile/transactions", label: "Transaction History", icon: ReceiptText },
  { to: "/profile/privacy", label: "Privacy and sharing", icon: ShieldCheck },
];

export function Profile() {
  const { user, logout } = useAuth();
  const { balance } = useCredits();
  const animatedBalance = useCountUp(balance);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPurchasedContacts()
      .then((res) => setPurchasedCount((res.contacts || []).length))
      .catch(() => {});
  }, []);

  const animatedPurchased = useCountUp(purchasedCount);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Avatar
          name={`${user?.fname?.[0] ?? ""}${user?.lname?.[0] ?? ""}`.toUpperCase()}
          src={user?.profilePicUrl}
          size="xl"
        />
        <div>
          <h1 className="font-display text-xl font-bold text-ink-900">
            {user?.fname} {user?.lname}
          </h1>
          {user?.workInfo?.company && (
            <p className="text-sm text-brand-600 underline-offset-2 hover:underline">
              {user.workInfo.company}
            </p>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <motion.button
          type="button"
          onClick={() => setBuyCreditsOpen(true)}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-ink-200 bg-white p-5 text-left"
        >
          <p className="font-display text-3xl font-bold text-ink-900">{animatedBalance}</p>
          <p className="mt-1 text-sm text-ink-500">Available Credits</p>
        </motion.button>
        <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-ink-200 bg-white p-5">
          <p className="font-display text-3xl font-bold text-ink-900">{animatedPurchased}</p>
          <p className="mt-1 text-sm text-ink-500">Purchased Contacts</p>
        </motion.div>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        {LINKS.map((link, i) => (
          <button
            key={link.to}
            onClick={() => navigate(link.to)}
            className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-ink-50 ${
              i !== LINKS.length - 1 ? "border-b border-ink-100" : ""
            }`}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
              <link.icon className="size-4" />
            </span>
            <span className="flex-1 text-sm font-medium text-ink-800">{link.label}</span>
            <ChevronRight className="size-4 text-ink-300" />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-6 flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
      >
        <LogOut className="size-4" /> Logout
      </button>

      <BuyCreditsModal open={buyCreditsOpen} onClose={() => setBuyCreditsOpen(false)} />
    </div>
  );
}
