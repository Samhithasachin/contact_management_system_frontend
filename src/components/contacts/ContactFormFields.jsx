import { Input } from "../ui/Input";

export function WorkInfoFields({ register, errors }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Email" type="email" {...register("workEmail")} />
      <Input label="Phone Number" {...register("workPhone")} />
      <Input label="Landline" {...register("workLandline")} />
      <Input
        label="Company"
        error={errors?.workCompany?.message}
        {...register("workCompany", { required: "Work company is required" })}
      />
      <Input label="Designation" {...register("workDesignation")} />
      <Input label="Experience" placeholder="e.g. 5 years" {...register("workExperience")} />
      <Input label="Skills" {...register("workSkills")} />
      <Input label="Country" {...register("workCountry")} />
      <Input label="State" {...register("workState")} />
      <Input label="City" {...register("workCity")} />
      <Input label="Pincode" {...register("workPincode")} />
    </div>
  );
}

export function PersonalInfoFields({ register }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Personal Email" type="email" {...register("personalEmail")} />
      <Input label="Personal Phone" {...register("personalPhone")} />
      <Input label="Last Company" {...register("lastCompany")} />
      <Input label="Last Designation" {...register("lastDesignation")} />
      <Input label="Qualification" {...register("qualification")} />
      <Input label="University" {...register("university")} />
      <Input label="Degree" {...register("degree")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Year From" {...register("yearFrom")} />
        <Input label="Year To" {...register("yearTo")} />
      </div>
      <Input label="Country" {...register("personalCountry")} />
      <Input label="State" {...register("personalState")} />
      <Input label="City" {...register("personalCity")} />
    </div>
  );
}
