import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Building2, Coins, Lock, ShieldCheck } from "lucide-react";
import { Drawer } from "../ui/Drawer";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { maskEmail, maskPhone } from "../../utils/maskContact";
import { purchaseContact } from "../../api/contacts";
import { useCredits } from "../../context/CreditsContext";
import { BuyCreditsModal } from "./BuyCreditsModal";

function MaskedField({ label, value, unlocked }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`mt-0.5 break-words text-sm ${unlocked ? "text-ink-800" : "mask-dots text-ink-400"}`}>
        {value}
      </p>
    </div>
  );
}

export function BuyContactDrawer({ employee, company, open, onClose, isPurchased, isMine, onPurchased }) {
  const [unlocked, setUnlocked] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const { balance, refresh } = useCredits();

  if (!employee) return null;

  const revealed = unlocked || isPurchased || isMine;
  const [fname, ...rest] = (employee.name || "Unknown").split(" ");
  const lname = rest.join(" ");

  const handleBuy = async () => {
    setPurchasing(true);
    try {
      await purchaseContact({
        fname,
        lname,
        employeeRecordId: employee._id,
        workInfo: {
          designation: employee.designation,
          email: employee.email,
          phone: employee.contactNumber,
          company: company?.companyName,
          city: company?.city,
          state: company?.state,
          country: company?.country,
        },
        personalInfo: {},
      });
      toast.success("Contact unlocked");
      setUnlocked(true);
      refresh();
      onPurchased?.(employee);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't unlock this contact");
    } finally {
      setPurchasing(false);
      setConfirming(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <Avatar name={fname?.[0]?.toUpperCase() || "?"} size="xl" />
        <h2 className="mt-4 font-display text-xl font-bold text-ink-900">
          {revealed ? employee.name : `${fname} ${lname ? lname[0] + "." : ""}`}
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <Building2 className="size-3.5" />
          {company?.companyName}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
        <MaskedField label="Designation" value={employee.designation} unlocked />
        <MaskedField label="Company Email" value={revealed ? employee.email : maskEmail(employee.email)} unlocked={revealed} />
        <MaskedField
          label="Contact Number"
          value={revealed ? employee.contactNumber : maskPhone(employee.contactNumber)}
          unlocked={revealed}
        />
        <MaskedField label="Location" value={[company?.city, company?.country].filter(Boolean).join(", ")} unlocked />
      </div>

      <div className="mt-8">
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-medium text-emerald-700"
          >
            <ShieldCheck className="size-4" />
            Full contact details unlocked
          </motion.div>
        ) : confirming ? (
          <div className="space-y-3 rounded-xl border border-ink-200 p-4">
            <p className="text-center text-sm text-ink-600">
              5 credits will be used to unlock this contact. Continue?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirming(false)}
                disabled={purchasing}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleBuy} loading={purchasing}>
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-ink-200 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-ink-500">
                <Lock className="size-3.5" /> Unlock full contact
              </span>
              <span className="flex items-center gap-1 font-semibold text-ink-800">
                <Coins className="size-3.5 text-brand-500" /> 5 credits
              </span>
            </div>
            <Button
              className="w-full"
              onClick={() => setConfirming(true)}
              disabled={balance < 5}
            >
              {balance < 5 ? "Not enough credits" : "Unlock Contact"}
            </Button>
            <p className="text-center text-xs text-ink-400">
              Available credits: {balance} ·{" "}
              <button
                type="button"
                onClick={() => setBuyCreditsOpen(true)}
                className="font-medium text-brand-600 hover:underline"
              >
                Buy Credits?
              </button>
            </p>
          </div>
        )}
      </div>
      <BuyCreditsModal open={buyCreditsOpen} onClose={() => setBuyCreditsOpen(false)} />
    </Drawer>
  );
}
