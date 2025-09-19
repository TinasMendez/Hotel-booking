import React from "react";
import { useIntl } from "react-intl";
import { useAuth } from "../modules/auth/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const { formatMessage } = useIntl();

  if (!user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-slate-600">We could not load your profile information. Please log in again.</p>
      </div>
    );
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;
  const roles = Array.isArray(user.roles) ? user.roles : [];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">{formatMessage({ id: "profile.title" })}</h1>
        <p className="text-sm text-slate-600">{formatMessage({ id: "profile.subtitle" })}</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-slate-500">{formatMessage({ id: "profile.fullName" })}</p>
          <p className="text-lg text-slate-900">{fullName}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">{formatMessage({ id: "profile.email" })}</p>
          <p className="text-lg text-slate-900">{user.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">{formatMessage({ id: "profile.roles" })}</p>
          <p className="text-sm text-slate-700">
            {roles.length ? roles.join(", ") : "ROLE_USER"}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">{formatMessage({ id: "profile.needHelp" })}</h2>
        <p className="text-sm text-slate-600">
          {formatMessage({ id: "profile.support" })}
          {" "}
          <a href="mailto:reservas@digitalbooking.local" className="text-blue-600 underline">
            reservas@digitalbooking.local
          </a>
          .
        </p>
      </section>
    </div>
  );
}
