import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Loader2, MapPin, Search as SearchIcon, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useCompanySearch } from "../hooks/useCompanySearch";
import { EmptyState } from "../components/ui/EmptyState";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { BuyContactDrawer } from "../components/contacts/BuyContactDrawer";
import { getPurchasedContacts } from "../api/contacts";

export function FindContacts() {
  const { user } = useAuth();
  const { query, setQuery } = useSearch();
  const { companies, loading } = useCompanySearch(query);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeCompany, setActiveCompany] = useState(null);
  const [purchasedIds, setPurchasedIds] = useState(new Set());

  useEffect(() => {
    getPurchasedContacts()
      .then((res) => {
        const ids = new Set((res.contacts || []).map((c) => c.originalContactId).filter(Boolean));
        setPurchasedIds(ids);
      })
      .catch(() => {});
  }, []);

  const openEmployee = (employee, company) => {
    setActiveEmployee(employee);
    setActiveCompany(company);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-900">Find Contacts</h1>
        <p className="mt-1 text-sm text-ink-500">
          Search companies in the shared directory and unlock the people you need with credits.
        </p>
      </div>

      <div className="relative mb-6 max-w-lg">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company or contact name…"
          className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 text-sm outline-none transition-shadow focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <Loader2 className="size-4 animate-spin" /> Searching…
        </div>
      )}

      {!loading && query && companies.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="Try a different company or contact name."
        />
      )}

      {!query && (
        <EmptyState
          icon={SearchIcon}
          title="Search to discover contacts"
          description="Type a company name (e.g. Zydus Pharma) or a person's name to browse the shared directory."
        />
      )}

      <div className="space-y-4">
        {companies.map((company) => (
          <motion.div
            key={company.companyName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-ink-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-ink-900">
                    {company.companyName}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-ink-500">
                    <MapPin className="size-3" />
                    {[company.city, company.country].filter(Boolean).join(", ") || "Unknown location"}
                  </p>
                </div>
              </div>
              <Badge tone="brand">
                <Users className="size-3" /> {company.employees.length}
              </Badge>
            </div>
            <div className="divide-y divide-ink-100">
              {company.employees.map((employee) => {
                const isMine = Boolean(user?._id) && employee.userId === user._id;
                const isPurchased = purchasedIds.has(employee._id);
                const badge = isMine
                  ? { tone: "brand", label: "Uploaded by you" }
                  : isPurchased
                  ? { tone: "success", label: "Unlocked" }
                  : { tone: "neutral", label: "5 credits" };
                return (
                  <button
                    key={employee._id || employee.email}
                    onClick={() => openEmployee(employee, company)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-ink-50"
                  >
                    <Avatar name={employee.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-800">{employee.name}</p>
                      <p className="truncate text-xs text-ink-500">{employee.designation}</p>
                    </div>
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <BuyContactDrawer
        employee={activeEmployee}
        company={activeCompany}
        open={Boolean(activeEmployee)}
        onClose={() => setActiveEmployee(null)}
        isPurchased={activeEmployee ? purchasedIds.has(activeEmployee._id) : false}
        isMine={Boolean(user?._id) && activeEmployee?.userId === user._id}
        onPurchased={(employee) =>
          setPurchasedIds((prev) => new Set(prev).add(employee._id))
        }
      />
    </div>
  );
}
