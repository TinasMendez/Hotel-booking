import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { getUserDisplayName, getUserInitials } from "../utils/user.js";

export default function Profile() {
  const { formatMessage } = useIntl();
  const { user, isLoadingAuth, authError, refreshProfile, logout } = useAuth();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isLoadingAuth && !user) {
      setIsFetching(true);
      refreshProfile()
        .catch(() => {})
        .finally(() => {
          if (active) setIsFetching(false);
        });
    }
    return () => {
      active = false;
    };
  }, [isLoadingAuth, user, refreshProfile]);

  const handleRetry = async () => {
    setIsFetching(true);
    try {
      await refreshProfile();
    } catch {
      // handled by context
    } finally {
      setIsFetching(false);
    }
  };

  const loading = isLoadingAuth || isFetching;

  if (loading && !user) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center">
        <div
          className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-slate-600">
          {formatMessage({ id: "profile.loading" })}
        </p>
      </div>
    );
  }

  if (!user) {
    const messageId = authError?.code || "auth.profileError";
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-slate-600 max-w-md">
          {formatMessage({ id: messageId })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isFetching}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            {formatMessage({ id: "profile.retry" })}
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {formatMessage({ id: "profile.goToLogin" })}
          </button>
        </div>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user) || (user.email ? user.email.slice(0, 2).toUpperCase() : "");
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const roles = Array.isArray(user.roles) && user.roles.length ? user.roles : ["ROLE_USER"];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          {formatMessage({ id: "profile.title" })}
        </h1>
        <p className="text-sm text-slate-600">
          {formatMessage({ id: "profile.subtitle" })}
        </p>
      </header>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div
            className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-semibold uppercase"
            aria-label={formatMessage({ id: "profile.avatarAlt" }, { name: displayName || user.email })}
          >
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{displayName || user.email}</h2>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {formatMessage({ id: "profile.section.account" })}
          </h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-500">
                {formatMessage({ id: "profile.fullName" })}
              </dt>
              <dd className="text-base text-slate-900 mt-1">{fullName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">
                {formatMessage({ id: "profile.roles" })}
              </dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          {formatMessage({ id: "profile.needHelp" })}
        </h2>
        <p className="text-sm text-slate-600">
          {formatMessage({ id: "profile.support" })}{" "}
          <a
            href="mailto:reservas@digitalbooking.local"
            className="text-blue-600 underline"
          >
            reservas@digitalbooking.local
          </a>
          .
        </p>
      </section>
    </div>
  );
}

