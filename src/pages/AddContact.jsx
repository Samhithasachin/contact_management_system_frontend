import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FilePlus2, IdCard, UserPlus2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { CollapsibleSection } from "../components/ui/CollapsibleSection";
import { WorkInfoFields, PersonalInfoFields } from "../components/contacts/ContactFormFields";
import { SocialAccountsGrid } from "../components/contacts/SocialAccountsGrid";
import { FileUploadDropzone } from "../components/contacts/FileUploadDropzone";
import { uploadContacts } from "../api/contacts";
import { useCredits } from "../context/CreditsContext";

const MODES = [
  { value: "manual", label: "Add Manually", icon: UserPlus2 },
  { value: "upload", label: "Upload File", icon: FilePlus2 },
  { value: "scan", label: "Scan Business Card", icon: IdCard },
];

export function AddContact() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "manual";
  const [socials, setSocials] = useState({});
  const { refresh: refreshCredits } = useCredits();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const setMode = (value) => setSearchParams({ mode: value });

  const onSubmit = async (values) => {
    const contact = {
      fname: values.fname,
      mname: values.mname,
      lname: values.lname,
      workInfo: {
        email: values.workEmail,
        phone: values.workPhone,
        landline: values.workLandline,
        company: values.workCompany,
        designation: values.workDesignation,
        experience: values.workExperience,
        skills: values.workSkills,
        country: values.workCountry,
        state: values.workState,
        city: values.workCity,
        pinCode: values.workPincode,
      },
      personalInfo: {
        email: values.personalEmail,
        phone: values.personalPhone,
        lastCompany: values.lastCompany,
        lastDesignation: values.lastDesignation,
        qualification: values.qualification,
        university: values.university,
        degree: values.degree,
        yearFrom: values.yearFrom,
        yearTo: values.yearTo,
        country: values.personalCountry,
        state: values.personalState,
        city: values.personalCity,
      },
    };

    try {
      const res = await uploadContacts([contact], {
        action: "upload",
        points: 5,
        metadata: { count: 1, source: mode },
      });

      if (res.error) {
        toast.error(res.message || "Some contacts were already uploaded");
        return;
      }

      toast.success("Contact added — you earned 5 credits!");
      refreshCredits();
      navigate("/contacts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save this contact");
    }
  };

  const showDropzone = mode !== "manual";

  const dropzoneCopy = useMemo(
    () =>
      mode === "scan"
        ? {
            accept: "image/*",
            hint: "Snap or upload a photo of the card · Max file size: 15MB",
            note: "We'll support automatic scanning soon — for now, confirm the details below and we'll save them to your contacts.",
          }
        : {
            accept: ".csv,.vcf,.xlsx",
            hint: "CSV, VCF or Excel · Max file size: 15MB",
            note: "Bulk import parsing is coming soon — for now, confirm the details below and we'll save this contact.",
          },
    [mode]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <UserPlus2 className="size-4" />
          </span>
          <h1 className="font-display text-xl font-bold text-ink-900">Add New Contact</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/contacts")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
            Save Contact
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl bg-ink-100 p-1">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === m.value ? "bg-white text-brand-700 shadow-soft" : "text-ink-500 hover:text-ink-700"
            }`}
          >
            <m.icon className="size-4" />
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {showDropzone && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <FileUploadDropzone accept={dropzoneCopy.accept} hint={dropzoneCopy.hint} />
            <p className="mt-2 text-xs text-ink-400">{dropzoneCopy.note}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-ink-200 bg-white p-5 sm:grid-cols-3">
          <Input label="First Name" error={errors.fname?.message} {...register("fname", { required: "Required" })} />
          <Input label="Middle Name" {...register("mname")} />
          <Input label="Last Name" error={errors.lname?.message} {...register("lname", { required: "Required" })} />
        </div>

        <CollapsibleSection title="Work Information">
          <WorkInfoFields register={register} errors={errors} />
        </CollapsibleSection>

        <CollapsibleSection title="Personal Information" defaultOpen={false}>
          <PersonalInfoFields register={register} />
        </CollapsibleSection>

        <CollapsibleSection title="Social Accounts" defaultOpen={false}>
          <SocialAccountsGrid
            values={socials}
            onChange={(key, value) => setSocials((s) => ({ ...s, [key]: value }))}
          />
        </CollapsibleSection>
      </form>
    </div>
  );
}
