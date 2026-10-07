import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Lock, Share2 } from "lucide-react";

const ROWS = [
  {
    icon: Eye,
    title: "Profile visibility",
    description: "Only you can see your uploaded and synced contacts unless you unlock them for others.",
  },
  {
    icon: Share2,
    title: "Directory sharing",
    description: "Contacts you upload help populate the shared company directory so others can discover them.",
  },
  {
    icon: Lock,
    title: "Data security",
    description: "Your credentials are hashed and contact data is transmitted over an authenticated, encrypted connection.",
  },
];

export function PrivacyAndSharing() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/profile")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </button>

      <h1 className="mb-6 font-display text-xl font-bold text-ink-900">Privacy and sharing</h1>

      <div className="space-y-3">
        {ROWS.map((row) => (
          <div key={row.title} className="flex gap-3 rounded-xl border border-ink-200 bg-white p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <row.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-800">{row.title}</p>
              <p className="mt-0.5 text-sm text-ink-500">{row.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
