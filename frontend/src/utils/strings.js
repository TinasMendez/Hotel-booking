// frontend/src/utils/strings.js
export function getInitials(input) {
  if (!input) return "?";
  let full = "";
  if (typeof input === "string") {
    full = input.trim();
  } else {
    const { firstName, lastName, name, email } = input;
    full =
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      name ||
      email ||
      "";
  }
  const parts = full.split(/\s+/g).filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts[1]?.[0] || "";
  const initials = `${a}${b}`.toUpperCase();
  return initials || "?";
}

export function fullNameOf(user) {
  if (!user) return "";
  const { firstName, lastName, name, email } = user;
  const composed = [firstName, lastName].filter(Boolean).join(" ").trim();
  return composed || name || email || "";
}

export function hasRole(user, role) {
  const arr = Array.isArray(user?.roles)
    ? user.roles
    : typeof user?.role === "string"
      ? [user.role]
      : [];
  const names = arr
    .map((r) => (typeof r === "string" ? r : r?.name))
    .filter(Boolean);
  return names.includes(role);
}
