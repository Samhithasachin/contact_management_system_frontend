export function normalizeContact(raw, source) {
  const workInfo = raw.workInfo || {};
  const personalInfo = raw.personalInfo || {};

  return {
    id: raw._id || raw.originalContactId,
    source,
    raw,
    fname: raw.fname,
    mname: raw.mname,
    lname: raw.lname,
    profilePicUrl: raw.profilePicUrl,
    designation: workInfo.designation || personalInfo.lastDesignation || "—",
    company: workInfo.company || personalInfo.lastCompany || "—",
    phone: workInfo.phone || personalInfo.phone || "—",
    email: workInfo.email || personalInfo.email || "—",
    workInfo,
    personalInfo,
    createdAt: raw.uploadedAt || raw.syncedAt || raw.createdAt,
  };
}

export function flattenUploads(uploads) {
  const all = [];
  for (const batch of uploads || []) {
    for (const contact of batch.contacts || []) {
      all.push(normalizeContact(contact, "uploaded"));
    }
  }
  return all;
}
