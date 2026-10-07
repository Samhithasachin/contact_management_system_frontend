import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaGoogle,
  FaApple,
  FaTelegram,
  FaWhatsapp,
  FaDiscord,
  FaWeixin,
} from "react-icons/fa6";

const PLATFORMS = [
  { key: "facebook", icon: FaFacebook, color: "text-[#1877F2] bg-[#1877F2]/10" },
  { key: "x", icon: FaXTwitter, color: "text-ink-800 bg-ink-100" },
  { key: "instagram", icon: FaInstagram, color: "text-[#E1306C] bg-[#E1306C]/10" },
  { key: "linkedin", icon: FaLinkedin, color: "text-[#0A66C2] bg-[#0A66C2]/10" },
  { key: "google", icon: FaGoogle, color: "text-[#EA4335] bg-[#EA4335]/10" },
  { key: "apple", icon: FaApple, color: "text-ink-800 bg-ink-100" },
  { key: "telegram", icon: FaTelegram, color: "text-[#26A5E4] bg-[#26A5E4]/10" },
  { key: "whatsapp", icon: FaWhatsapp, color: "text-[#25D366] bg-[#25D366]/10" },
  { key: "discord", icon: FaDiscord, color: "text-[#5865F2] bg-[#5865F2]/10" },
  { key: "wechat", icon: FaWeixin, color: "text-[#07C160] bg-[#07C160]/10" },
];

export function SocialAccountsGrid({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {PLATFORMS.map(({ key, icon: Icon, color }) => (
        <div
          key={key}
          className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2"
        >
          <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${color}`}>
            <Icon className="size-3.5" />
          </span>
          <input
            value={values?.[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder="www.untitledui.com"
            className="w-full bg-transparent text-sm text-ink-700 placeholder:text-ink-300 outline-none"
          />
        </div>
      ))}
    </div>
  );
}
