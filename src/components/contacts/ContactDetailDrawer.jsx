import { Drawer } from "../ui/Drawer";
import { Avatar } from "../ui/Avatar";
import { fullName, formatDate } from "../../utils/formatters";
import { Briefcase, GraduationCap, MapPin, Phone } from "lucide-react";

function Field({ label, value }) {
  if (!value || value === "—") return null;
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 break-words text-sm text-ink-800">{value}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-brand-600">
        <Icon className="size-4" />
        <h3 className="font-display text-sm font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
        {children}
      </div>
    </div>
  );
}

export function ContactDetailDrawer({ contact, open, onClose, footer }) {
  if (!contact) return null;
  const { workInfo = {}, personalInfo = {} } = contact;

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <Avatar contact={contact} size="xl" />
        <h2 className="mt-4 font-display text-xl font-bold text-ink-900">{fullName(contact)}</h2>
        <p className="text-sm text-ink-500">
          {contact.designation !== "—" ? contact.designation : ""}
          {contact.designation !== "—" && contact.company !== "—" ? " · " : ""}
          {contact.company !== "—" ? contact.company : ""}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <Section icon={Briefcase} title="Work History">
          <Field label="Company" value={workInfo.company} />
          <Field label="Designation" value={workInfo.designation} />
          <Field label="Work Email" value={workInfo.email} />
          <Field label="Work Phone" value={workInfo.phone} />
          <Field label="Landline" value={workInfo.landline} />
          <Field label="Experience" value={workInfo.experience} />
        </Section>

        {(personalInfo.email || personalInfo.phone) && (
          <Section icon={Phone} title="Personal Details">
            <Field label="Personal Email" value={personalInfo.email} />
            <Field label="Personal Phone" value={personalInfo.phone} />
          </Section>
        )}

        {(personalInfo.university || personalInfo.degree) && (
          <Section icon={GraduationCap} title="Educational Details">
            <Field label="University" value={personalInfo.university} />
            <Field label="Degree" value={personalInfo.degree} />
            <Field
              label="Duration"
              value={
                personalInfo.yearFrom || personalInfo.yearTo
                  ? `${personalInfo.yearFrom ?? ""} – ${personalInfo.yearTo ?? ""}`
                  : null
              }
            />
          </Section>
        )}

        {(workInfo.city || workInfo.state || workInfo.country) && (
          <Section icon={MapPin} title="Location">
            <Field label="City" value={workInfo.city} />
            <Field label="State" value={workInfo.state} />
            <Field label="Country" value={workInfo.country} />
            <Field label="Pincode" value={workInfo.pinCode} />
          </Section>
        )}

        {contact.createdAt && (
          <p className="text-center text-xs text-ink-400">
            Added on {formatDate(contact.createdAt)}
          </p>
        )}
      </div>

      {footer && <div className="mt-8">{footer}</div>}
    </Drawer>
  );
}
