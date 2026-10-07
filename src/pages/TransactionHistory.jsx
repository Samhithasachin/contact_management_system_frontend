import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { getCreditLedger } from "../api/credits";
import { formatDateTime } from "../utils/formatters";
import { EmptyState } from "../components/ui/EmptyState";
import { TableRowSkeleton } from "../components/ui/Skeleton";

const ACTION_LABELS = {
  upload: "Uploaded a contact",
  purchase: "Unlocked a contact",
  redeem: "Redeemed credits",
  delete_upload: "Removed an upload",
  delete_purchase: "Removed a purchase",
};

export function TransactionHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ledger, setLedger] = useState({ totalPoints: 0, transactions: [] });

  useEffect(() => {
    getCreditLedger()
      .then(setLedger)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/profile")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink-900">Transaction History</h1>
        <p className="font-display text-lg font-bold text-brand-600">{ledger.totalPoints} pts</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : ledger.transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Credit activity from uploads and purchases will show up here."
        />
      ) : (
        <div className="space-y-2">
          {ledger.transactions.map((tx, i) => {
            const positive = tx.points > 0;
            return (
              <motion.div
                key={tx._id || i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full ${
                    positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {positive ? (
                    <ArrowDownLeft className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800">
                    {ACTION_LABELS[tx.action] || tx.action}
                  </p>
                  <p className="text-xs text-ink-400">{formatDateTime(tx.createdAt)}</p>
                </div>
                <span className={`font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                  {positive ? "+" : ""}
                  {tx.points}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
