import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UsersRound } from "lucide-react";
import { Tabs } from "../components/ui/Tabs";
import { TableRowSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ContactTable, CreditPill } from "../components/contacts/ContactTable";
import { ContactDetailDrawer } from "../components/contacts/ContactDetailDrawer";
import { NewContactMenu } from "../components/contacts/NewContactMenu";
import { PendingContactsPanel } from "../components/contacts/PendingContactsPanel";
import { useSearch } from "../context/SearchContext";
import { useCredits } from "../context/CreditsContext";
import { getLinkedContacts, getLoadedContacts, getPurchasedContacts } from "../api/contacts";
import { discardPendingContacts, getPendingContacts, uploadPendingContacts } from "../api/contactSync";
import { flattenUploads, normalizeContact } from "../utils/normalizeContact";
import { fullName } from "../utils/formatters";

const TABS = [
  { value: "my", label: "My Contacts" },
  { value: "uploaded", label: "Uploaded Contacts" },
  { value: "purchased", label: "Purchased Contacts" },
];

export function Contacts() {
  const { query } = useSearch();
  const { refresh: refreshCredits } = useCredits();
  const [tab, setTab] = useState("my");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ my: [], uploaded: [], purchased: [] });
  const [activeContact, setActiveContact] = useState(null);
  const [pendingContacts, setPendingContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [uploadingPending, setUploadingPending] = useState(false);

  const loadAll = () => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([getLinkedContacts(), getLoadedContacts(), getPurchasedContacts()]).then(
      ([myRes, uploadedRes, purchasedRes]) => {
        if (cancelled) return;
        const my = myRes.status === "fulfilled" ? myRes.value.contacts ?? [] : [];
        const uploaded =
          uploadedRes.status === "fulfilled" ? uploadedRes.value.data ?? [] : [];
        const purchased =
          purchasedRes.status === "fulfilled" ? purchasedRes.value.contacts ?? [] : [];

        setData({
          my: my.map((c) => normalizeContact(c, "my")),
          uploaded: flattenUploads(uploaded),
          purchased: purchased.map((c) => normalizeContact(c, "purchased")),
        });
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  };

  useEffect(loadAll, []);

  // Contacts staged for review -- by the daily background sync or the
  // one-off manual "Select" button (Integration.jsx), both of which now
  // write into the same server-side PendingSyncContacts store, so this is
  // the one place that needs to read it back.
  useEffect(() => {
    getPendingContacts()
      .then((res) => {
        const staged = (res.contacts || []).map((c) => normalizeContact(c, "pending"));
        setPendingContacts(staged);
        setSelectedIds(new Set(staged.map((c) => c.id)));
      })
      .catch(() => {});
  }, []);

  const togglePending = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPending = (select) => {
    setSelectedIds(select ? new Set(pendingContacts.map((c) => c.id)) : new Set());
  };

  const removeFromPending = (ids) => {
    setPendingContacts((prev) => prev.filter((c) => !ids.has(c.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  const discardPending = async () => {
    const ids = pendingContacts.map((c) => c.id);
    if (ids.length === 0) return;
    removeFromPending(new Set(ids));
    try {
      await discardPendingContacts(ids);
    } catch {
      toast.error("Couldn't discard some synced contacts on the server");
    }
  };

  const uploadSelectedPending = async () => {
    const chosen = pendingContacts.filter((c) => selectedIds.has(c.id));
    if (chosen.length === 0) return;

    setUploadingPending(true);
    try {
      const res = await uploadPendingContacts(chosen.map((c) => c.id));
      if (res.error) {
        toast.error(res.message || "Some contacts were already uploaded");
        return;
      }

      removeFromPending(new Set(chosen.map((c) => c.id)));
      toast.success(`Uploaded ${chosen.length} contact${chosen.length === 1 ? "" : "s"}`);
      refreshCredits();
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't upload the selected contacts");
    } finally {
      setUploadingPending(false);
    }
  };

  const activeList = data[tab];

  const filtered = useMemo(() => {
    if (!query.trim()) return activeList;
    const q = query.toLowerCase();
    return activeList.filter((c) =>
      [fullName(c), c.company, c.email, c.designation].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [activeList, query]);

  const total = data.my.length + data.uploaded.length + data.purchased.length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">
            All Contacts <span className="text-ink-400">({total})</span>
          </h1>
          <p className="mt-1 text-sm text-ink-500">View all the uploaded and purchased contacts.</p>
        </div>
        <NewContactMenu />
      </div>

      <Tabs
        tabs={TABS.map((t) => ({ ...t, count: data[t.value].length }))}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-5">
        {tab === "my" && (
          <PendingContactsPanel
            contacts={pendingContacts}
            selectedIds={selectedIds}
            onToggle={togglePending}
            onToggleAll={toggleAllPending}
            onUpload={uploadSelectedPending}
            onDiscard={discardPending}
            uploading={uploadingPending}
          />
        )}
        {loading ? (
          <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title={query ? "No matches found" : "No contacts here yet"}
            description={
              query
                ? "Try a different search term."
                : "Add contacts manually, upload a file, or scan a business card to get started."
            }
          />
        ) : (
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <ContactTable
              contacts={filtered}
              onRowClick={setActiveContact}
              renderMeta={(c) => <CreditPill credits={c.raw.credits} />}
            />
          </motion.div>
        )}
      </div>

      <ContactDetailDrawer
        contact={activeContact}
        open={Boolean(activeContact)}
        onClose={() => setActiveContact(null)}
      />
    </div>
  );
}
