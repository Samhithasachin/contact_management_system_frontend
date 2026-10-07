import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2, RefreshCw } from "lucide-react";
import { FaGoogle, FaApple, FaMicrosoft } from "react-icons/fa6";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { fetchGoogleContacts, mapGoogleContact, requestContactsAccessToken } from "../utils/googleContacts";
import { startGoogleSyncConnect } from "../utils/googleSyncOAuth";
import { startMicrosoftSyncConnect } from "../utils/microsoftSyncOAuth";
import { disableGoogleSync, getGoogleSyncStatus, stagePendingContacts } from "../api/googleSync";
import { disableMicrosoftSync, getMicrosoftSyncStatus } from "../api/microsoftSync";
import { formatDateTime } from "../utils/formatters";

const SOURCES = [
  {
    key: "google",
    name: "Google Contacts",
    icon: FaGoogle,
    color: "text-[#EA4335]",
    includes: ["Google Contacts", "Gmail Contacts"],
    autoSync: { getStatus: getGoogleSyncStatus, disable: disableGoogleSync, connect: startGoogleSyncConnect },
  },
  {
    key: "apple",
    name: "Apple Contacts",
    icon: FaApple,
    color: "text-ink-800",
    includes: ["iCloud Contacts", "Apple Mail Contacts"],
  },
  {
    key: "microsoft",
    name: "Microsoft Contacts",
    icon: FaMicrosoft,
    color: "text-[#00A4EF]",
    includes: ["Outlook Contacts", "Exchange Contacts", "Office 365 Contacts"],
    autoSync: { getStatus: getMicrosoftSyncStatus, disable: disableMicrosoftSync, connect: startMicrosoftSyncConnect },
  },
];

function AutoSyncSection({ source, status, disabling, connecting, onDisable }) {
  if (!source.autoSync || !status) return null;

  return (
    <div className="mt-5 w-full border-t border-ink-100 pt-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-ink-400">Automatic sync</p>
      <Badge tone={status.enabled ? "success" : "neutral"} className="mx-auto">
        {status.enabled && <RefreshCw className="size-3" />}
        {status.enabled ? "Connected" : "Not connected"}
      </Badge>
      {status.enabled && (
        <p className="mt-2 text-xs text-ink-400">
          Last synced {status.lastSyncedAt ? formatDateTime(status.lastSyncedAt) : "never yet"}
        </p>
      )}
      <Button
        variant={status.enabled ? "ghost" : "secondary"}
        size="sm"
        className="mt-3 w-full"
        onClick={status.enabled ? onDisable : source.autoSync.connect}
        loading={disabling}
        disabled={connecting !== null}
      >
        {status.enabled ? "Disconnect" : "Connect automatic sync"}
      </Button>
    </div>
  );
}

export function Integration() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [connecting, setConnecting] = useState(null);
  const [syncStatuses, setSyncStatuses] = useState({});
  const [disablingKey, setDisablingKey] = useState(null);

  useEffect(() => {
    SOURCES.filter((s) => s.autoSync).forEach((source) => {
      source.autoSync
        .getStatus()
        .then((status) => setSyncStatuses((prev) => ({ ...prev, [source.key]: status })))
        .catch(() => setSyncStatuses((prev) => ({ ...prev, [source.key]: { enabled: false, lastSyncedAt: null } })));
    });
  }, []);

  useEffect(() => {
    const connected = searchParams.get("googleSync") || searchParams.get("microsoftSync");
    const error = searchParams.get("error");
    if (connected === "connected") {
      const providerName = searchParams.get("googleSync") ? "Google" : "Microsoft";
      toast.success(`Automatic ${providerName} sync connected`, {
        description: "New contacts will show up for review in My Contacts periodically.",
      });
    } else if (error) {
      toast.error(error);
    }
    if (connected || error) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleDisableSync = async (source) => {
    setDisablingKey(source.key);
    try {
      await source.autoSync.disable();
      setSyncStatuses((prev) => ({ ...prev, [source.key]: { enabled: false, lastSyncedAt: null } }));
      toast.success(`Automatic ${source.name.replace(" Contacts", "")} sync disconnected`);
    } catch (err) {
      toast.error(err.response?.data?.error || `Couldn't disconnect ${source.name}`);
    } finally {
      setDisablingKey(null);
    }
  };

  const handleSelectStub = (source) => {
    setConnecting(source.key);
    setTimeout(() => {
      setConnecting(null);
      toast.info(`${source.name} sync is coming soon`, {
        description: "We're finishing up the secure OAuth connection for this provider.",
      });
    }, 1200);
  };

  const handleSelectGoogle = async () => {
    setConnecting("google");
    try {
      const accessToken = await requestContactsAccessToken();
      const connections = await fetchGoogleContacts(accessToken);
      const contacts = connections.map(mapGoogleContact).filter(Boolean);

      if (contacts.length === 0) {
        toast.info("No contacts to import", {
          description: "We couldn't find any contacts with a name on your Google account.",
        });
        return;
      }

      // Staged server-side (same store the background sync uses) rather than
      // handed to the Contacts page via router state, so My Contacts always
      // has one reliable place to read pending contacts from.
      const result = await stagePendingContacts(contacts);
      toast.success(`Found ${result.staged} new contact${result.staged === 1 ? "" : "s"} from Google`, {
        description:
          result.staged > 0
            ? "Choose which ones to upload on the next screen."
            : "Everything found was already uploaded or already waiting for review.",
      });
      navigate("/contacts");
    } catch (err) {
      toast.error(err.message || "Couldn't sync Google contacts");
    } finally {
      setConnecting(null);
    }
  };

  // Microsoft has no separate one-off flow like Google's "Select" -- its
  // only sync path is the offline-consent "Connect automatic sync" below,
  // whose backend callback also runs an immediate first sync on its own.
  const handleSelect = (source) => (source.key === "google" ? handleSelectGoogle() : handleSelectStub(source));

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate("/profile")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </button>

      <h1 className="mb-1 font-display text-xl font-bold text-ink-900">Sync Source</h1>
      <p className="mb-8 text-sm text-ink-500">What account would you like to connect?</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SOURCES.map((source) => (
          <motion.div
            key={source.key}
            whileHover={{ y: -4 }}
            className="flex flex-col items-center rounded-2xl border border-ink-200 bg-white p-6 text-center shadow-soft"
          >
            <source.icon className={`size-8 ${source.color}`} />
            <p className="mt-3 font-display text-sm font-semibold text-ink-900">{source.name}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink-400">
              This includes
            </p>
            <ul className="mt-2 space-y-1.5">
              {source.includes.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-ink-500">
                  <Check className="size-3 text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
            {source.key !== "microsoft" && (
              <Button
                variant="secondary"
                className="mt-5 w-full"
                onClick={() => handleSelect(source)}
                disabled={connecting !== null}
              >
                {connecting === source.key ? <Loader2 className="size-4 animate-spin" /> : "Select"}
              </Button>
            )}

            <AutoSyncSection
              source={source}
              status={syncStatuses[source.key]}
              disabling={disablingKey === source.key}
              connecting={connecting}
              onDisable={() => handleDisableSync(source)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
