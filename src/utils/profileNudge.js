import { toast } from "sonner";

export function maybeNudgeIncompleteProfile(user, navigate) {
  if (user?.profileCompleted !== false) return;
  toast("Finish setting up your profile", {
    description: "Add your company, designation, and other details to get the most out of Contact Management System.",
    action: {
      label: "Complete profile",
      onClick: () => navigate("/profile/personal-information"),
    },
    duration: 8000,
  });
}
