import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Link2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { BrandMark } from "../components/ui/BrandMark";
import { AuthShowcase } from "../components/auth/AuthShowcase";
import { GoogleLoginButton } from "../components/auth/GoogleLoginButton";
import { loginWithGoogle } from "../api/auth";
import { startLinkedInLogin } from "../utils/linkedinOAuth";
import { maybeNudgeIncompleteProfile } from "../utils/profileNudge";

export function Login() {
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values);
      navigate(location.state?.from ?? "/contacts", { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.error || "Couldn't sign you in. Check your details.");
      toast.error("Login failed");
    }
  };

  const handleGoogleToken = async (idToken) => {
    try {
      const { token } = await loginWithGoogle(idToken);
      const user = await loginWithToken(token);
      maybeNudgeIncompleteProfile(user, navigate);
      navigate(location.state?.from ?? "/contacts", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-svh bg-ink-50">
      <AuthShowcase />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-8 flex items-center gap-2">
            <BrandMark size={32} />
            <span className="font-display text-lg font-bold text-ink-900">CMS</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to keep growing your network.</p>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              icon={Link2}
              onClick={startLinkedInLogin}
            >
              Continue with LinkedIn
            </Button>
            <GoogleLoginButton
              onToken={handleGoogleToken}
              onError={() => toast.error("Google sign-in failed. Please try again.")}
            />
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />
            <span className="text-xs text-ink-400">or</span>
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work email"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />

            {serverError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600"
              >
                {serverError}
              </motion.p>
            )}

            <Button type="submit" className="w-full" loading={isSubmitting} icon={ArrowRight}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            New to Contact Management System?{" "}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
