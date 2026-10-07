import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Button } from "../components/ui/Button";
import { changePassword } from "../api/auth";

export function ChangePassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password updated");
      reset();
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Couldn't update password");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <button
        onClick={() => navigate("/profile")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </button>

      <h1 className="mb-6 font-display text-xl font-bold text-ink-900">Change Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-ink-200 bg-white p-5">
        <PasswordInput
          label="Current password"
          error={errors.currentPassword?.message}
          {...register("currentPassword", { required: "Required" })}
        />
        <PasswordInput
          label="New password"
          error={errors.newPassword?.message}
          {...register("newPassword", {
            required: "Required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        <PasswordInput
          label="Confirm new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Required",
            validate: (value) => value === watch("newPassword") || "Passwords don't match",
          })}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </div>
  );
}
