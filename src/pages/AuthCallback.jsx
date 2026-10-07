import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { consumeLinkedInState } from "../utils/linkedinOAuth";
import { maybeNudgeIncompleteProfile } from "../utils/profileNudge";

export function AuthCallback() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const error = searchParams.get("error");
    const token = searchParams.get("token");
    const state = searchParams.get("state");

    if (error) {
      toast.error(error);
      navigate("/login", { replace: true });
      return;
    }

    if (!token || !consumeLinkedInState(state)) {
      toast.error("LinkedIn sign-in could not be verified. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    loginWithToken(token)
      .then((user) => {
        maybeNudgeIncompleteProfile(user, navigate);
        navigate("/contacts", { replace: true });
      })
      .catch(() => {
        toast.error("Couldn't complete LinkedIn sign-in. Please try again.");
        navigate("/login", { replace: true });
      });
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink-50">
      <Loader2 className="size-6 animate-spin text-brand-600" />
    </div>
  );
}
