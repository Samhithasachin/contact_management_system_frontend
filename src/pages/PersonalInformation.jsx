import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { CollapsibleSection } from "../components/ui/CollapsibleSection";
import { Avatar } from "../components/ui/Avatar";
import { updateUser } from "../api/auth";

export function PersonalInformation() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fname: user?.fname,
      mname: user?.mname,
      lname: user?.lname,
      workEmail: user?.workInfo?.email,
      workPhone: user?.workInfo?.phone,
      workLandline: user?.workInfo?.landline,
      workCompany: user?.workInfo?.company,
      workDesignation: user?.workInfo?.designation,
      workExperience: user?.workInfo?.experience,
      workSkills: user?.workInfo?.skills,
      workCountry: user?.workInfo?.country,
      workCity: user?.workInfo?.city,
      workState: user?.workInfo?.state,
      workPincode: user?.workInfo?.pinCode,
      personalEmail: user?.personalInfo?.email,
      personalPhone: user?.personalInfo?.phone,
      qualification: user?.personalInfo?.qualification,
      university: user?.personalInfo?.university,
      degree: user?.personalInfo?.degree,
      lastCompany: user?.personalInfo?.lastCompany,
      lastDesignation: user?.personalInfo?.lastDesignation,
      personalCountry: user?.personalInfo?.country,
      personalState: user?.personalInfo?.state,
      personalCity: user?.personalInfo?.city,
      personalPincode: user?.personalInfo?.pinCode,
    },
  });

  const onSubmit = async (values) => {
    try {
      const res = await updateUser({
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
          city: values.workCity,
          state: values.workState,
          pinCode: values.workPincode,
        },
        personalInfo: {
          email: values.personalEmail,
          phone: values.personalPhone,
          qualification: values.qualification,
          university: values.university,
          degree: values.degree,
          lastCompany: values.lastCompany,
          lastDesignation: values.lastDesignation,
          country: values.personalCountry,
          state: values.personalState,
          city: values.personalCity,
          pinCode: values.personalPincode,
        },
        profilePic,
      });
      setUser(res.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't update profile");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/profile")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </button>

      <h1 className="mb-6 font-display text-xl font-bold text-ink-900">Personal Information</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-5">
          <div className="relative">
            <Avatar src={preview || user?.profilePicUrl} name={user?.fname?.[0]} size="lg" />
            <label className="absolute -bottom-1 -right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft">
              <Camera className="size-3" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setProfilePic(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-800">Profile photo</p>
            <p className="text-xs text-ink-400">JPG or PNG, up to 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-ink-200 bg-white p-5 sm:grid-cols-3">
          <Input label="First Name" error={errors.fname?.message} {...register("fname", { required: "Required" })} />
          <Input label="Middle Name" {...register("mname")} />
          <Input label="Last Name" error={errors.lname?.message} {...register("lname", { required: "Required" })} />
        </div>

        <CollapsibleSection title="Work Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Work Email" type="email" {...register("workEmail")} />
            <Input label="Work Phone" {...register("workPhone")} />
            <Input label="Landline" {...register("workLandline")} />
            <Input
              label="Company"
              error={errors.workCompany?.message}
              {...register("workCompany", { required: "Company is required" })}
            />
            <Input label="Designation" {...register("workDesignation")} />
            <Input label="Experience" {...register("workExperience")} />
            <Input label="Skill" {...register("workSkills")} />
            <Input label="Country" {...register("workCountry")} />
            <Input label="State" {...register("workState")} />
            <Input label="City" {...register("workCity")} />
            <Input label="Pin Code" {...register("workPincode")} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Personal Information" defaultOpen={false}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Personal Email" type="email" {...register("personalEmail")} />
            <Input label="Personal Phone" {...register("personalPhone")} />
            <Input label="Qualification" {...register("qualification")} />
            <Input label="University" {...register("university")} />
            <Input label="Degree" {...register("degree")} />
            <Input label="Last Company" {...register("lastCompany")} />
            <Input label="Last Designation" {...register("lastDesignation")} />
            <Input label="Country" {...register("personalCountry")} />
            <Input label="State" {...register("personalState")} />
            <Input label="City" {...register("personalCity")} />
            <Input label="Pin Code" {...register("personalPincode")} />
          </div>
        </CollapsibleSection>

        <Button type="submit" loading={isSubmitting}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
