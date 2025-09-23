export function getUserDisplayName(user) {
  if (!user) return "";
  const first = (user.firstName || "").trim();
  const last = (user.lastName || "").trim();
  if (first && last) return `${first} ${last}`.trim();
  if (first) return first;
  if (last) return last;
  const email = (user.email || "").trim();
  if (email) return email.split("@")[0];
  return "";
}

export function getUserFirstName(user) {
  const display = getUserDisplayName(user);
  if (!display) return "";
  return display.split(/\s+/)[0];
}

export function getUserInitials(user) {
  const display = getUserDisplayName(user);
  const source = display || user?.email || "";
  if (!source) return "";
  const segments = source.split(/\s+/).filter(Boolean).slice(0, 2);
  if (segments.length === 0 && user?.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  if (segments.length === 0) return "";
  const initials = segments.map((segment) => segment[0]).join("");
  return initials.toUpperCase();
}
