import { useNavigate } from "react-router-dom";
import { FilePlus2, IdCard, UserPlus2 } from "lucide-react";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";

export function NewContactMenu({ compact = false }) {
  const navigate = useNavigate();

  const items = [
    {
      label: "Upload Contact",
      icon: FilePlus2,
      onClick: () => navigate("/contacts/new?mode=upload"),
    },
    {
      label: "Add Contact Manually",
      icon: UserPlus2,
      onClick: () => navigate("/contacts/new?mode=manual"),
    },
    {
      label: "Scan a business card",
      icon: IdCard,
      onClick: () => navigate("/contacts/new?mode=scan"),
    },
  ];

  return (
    <Dropdown
      align="right"
      trigger={
        compact ? (
          <button className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-pop transition-transform hover:scale-105 active:scale-95">
            <UserPlus2 className="size-4" />
          </button>
        ) : (
          <Button icon={UserPlus2}>New Contact</Button>
        )
      }
      items={items}
    />
  );
}
