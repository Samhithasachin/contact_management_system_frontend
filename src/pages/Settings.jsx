import { useEffect, useState } from "react";
import { Bell, Mail, Trash2 } from "lucide-react";
import { Toggle } from "../components/ui/Toggle";
import { Button } from "../components/ui/Button";

const STORAGE_KEY = "loqo:settings";

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function Settings() {
  const [settings, setSettings] = useState(() => ({
    productUpdates: true,
    newContactAlerts: true,
    weeklyDigest: false,
    ...loadSettings(),
  }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const ROWS = [
    {
      key: "newContactAlerts",
      icon: Bell,
      title: "New contact alerts",
      description: "Get notified when someone in your directory becomes purchasable.",
    },
    {
      key: "productUpdates",
      icon: Mail,
      title: "Product updates",
      description: "Occasional emails about new Contact Management System features.",
    },
    {
      key: "weeklyDigest",
      icon: Mail,
      title: "Weekly digest",
      description: "A weekly summary of your credits, uploads and unlocks.",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink-900">Settings</h1>
      <p className="mb-8 text-sm text-ink-500">Manage notification preferences for this device.</p>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        {ROWS.map((row, i) => (
          <div
            key={row.key}
            className={`flex items-center gap-3 px-5 py-4 ${
              i !== ROWS.length - 1 ? "border-b border-ink-100" : ""
            }`}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
              <row.icon className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-800">{row.title}</p>
              <p className="text-xs text-ink-500">{row.description}</p>
            </div>
            <Toggle checked={settings[row.key]} onChange={() => toggle(row.key)} />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50/50 p-5">
        <p className="text-sm font-semibold text-rose-700">Danger zone</p>
        <p className="mt-1 text-sm text-rose-600">
          Deleting your account permanently removes your contacts and credit history.
        </p>
        <Button variant="danger" size="sm" className="mt-3" icon={Trash2} disabled>
          Delete account
        </Button>
      </div>
    </div>
  );
}
