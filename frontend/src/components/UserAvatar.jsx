// frontend/src/components/UserAvatar.jsx
import React from "react";
import { getInitials, fullNameOf } from "../utils/strings";

export default function UserAvatar({ user, size = 36 }) {
  const initials = getInitials(user);
  const label = fullNameOf(user) || "User";
  const px = `${size}px`;
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
      style={{ width: px, height: px, fontSize: Math.max(12, Math.floor(size * 0.42)) }}
      aria-label={label}
      role="img"
    >
      {initials}
    </div>
  );
}
