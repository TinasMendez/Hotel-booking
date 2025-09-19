import React from "react";
import { useIntl } from "react-intl";
import PolicyBlock from "../components/PolicyBlock.jsx";

const STATIC_POLICIES = {
  rules: [
    "Check-in available from 3:00 PM, check-out by 11:00 AM.",
    "Respect quiet hours between 10:00 PM and 8:00 AM.",
    "Smoking is not allowed inside rooms or common areas.",
    "Only registered guests may access the property unless authorised by the host.",
  ],
  health: [
    "Daily sanitation of high-touch surfaces and ventilation of rooms.",
    "Contactless check-in available upon request.",
    "All staff trained on health & safety protocols.",
    "Emergency assistance available 24/7 at the front desk or via WhatsApp.",
  ],
  cancellation: [
    "Free cancellation up to 5 days before arrival unless otherwise stated in the listing.",
    "50% refund if cancelled within 48 hours of arrival; no refund on the day of check-in.",
    "Date changes subject to availability; price difference may apply.",
  ],
};

export default function Policies() {
  const { formatMessage } = useIntl();
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">{formatMessage({ id: "policies.title" })}</h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          {formatMessage({ id: "policies.subtitle" })}
        </p>
      </header>

      <PolicyBlock policies={STATIC_POLICIES} />

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">{formatMessage({ id: "policies.assistance" })}</h2>
        <p className="text-sm text-slate-600">
          {formatMessage({ id: "policies.contact" })} {" "}
          <a href="mailto:reservas@digitalbooking.local" className="text-blue-600 underline">reservas@digitalbooking.local</a>
          {" "}or through the WhatsApp button that you can find on every page.
        </p>
      </section>
    </div>
  );
}
