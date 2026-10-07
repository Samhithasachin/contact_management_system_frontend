import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { BrandMark } from "../components/ui/BrandMark";
import { AuthShowcase } from "../components/auth/AuthShowcase";

const STEPS = ["About you", "Work details"];

export function Register() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const [direction, setDirection] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm();

  const goNext = async () => {
    const valid = await trigger(["fname", "lname", "password", "personalEmail"]);
    if (!valid) return;
    setDirection(1);
    setStep(1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(0);
  };

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await signUp({
        fname: values.fname,
        mname: values.mname,
        lname: values.lname,
        password: values.password,
        workInfo: {
          email: values.workEmail,
          designation: values.designation,
          experience: values.experience,
          company: values.company,
          country: values.country,
        },
        personalInfo: {
          email: values.personalEmail,
        },
      });
      toast.success("Welcome to Contact Management System!");
      navigate("/contacts", { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong. Please try again.");
      toast.error("Registration failed");
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
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2">
            <BrandMark size={32} />
            <span className="font-display text-lg font-bold text-ink-900">CMS</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-ink-500">Takes less than a minute.</p>

          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-brand-600" : "bg-ink-200"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First name"
                      error={errors.fname?.message}
                      {...register("fname", { required: "Required" })}
                    />
                    <Input label="Last name" error={errors.lname?.message} {...register("lname", { required: "Required" })} />
                  </div>
                  <Input
                    label="Personal email"
                    type="email"
                    error={errors.personalEmail?.message}
                    {...register("personalEmail", { required: "Required" })}
                  />
                  <Input
                    label="Password"
                    type="password"
                    error={errors.password?.message}
                    {...register("password", { required: "Required", minLength: { value: 6, message: "At least 6 characters" } })}
                  />
                  <Button type="button" className="w-full" icon={ArrowRight} onClick={goNext}>
                    Continue
                  </Button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <Input
                    label="Work email"
                    type="email"
                    error={errors.workEmail?.message}
                    {...register("workEmail", { required: "Required" })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Company"
                      error={errors.company?.message}
                      {...register("company", { required: "Required" })}
                    />
                    <Input
                      label="Designation"
                      error={errors.designation?.message}
                      {...register("designation", { required: "Required" })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Experience"
                      placeholder="e.g. 5 years"
                      error={errors.experience?.message}
                      {...register("experience", { required: "Required" })}
                    />
                    <Input
                      label="Country"
                      error={errors.country?.message}
                      {...register("country", { required: "Required" })}
                    />
                  </div>

                  {serverError && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{serverError}</p>
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" icon={ArrowLeft} onClick={goBack}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" loading={isSubmitting}>
                      Create account
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
