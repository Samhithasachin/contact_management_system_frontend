export function maskEmail(email) {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain) return "•".repeat(email.length);
  const visible = user.slice(0, 1);
  return `${visible}${"•".repeat(Math.max(user.length - 1, 3))}@${domain}`;
}

export function maskPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const tail = digits.slice(-2);
  return `${phone.slice(0, phone.length - digits.length + 2)}${"•".repeat(6)}${tail}`;
}
