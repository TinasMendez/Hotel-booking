import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PolicyBlock from "../components/PolicyBlock.jsx";

export default function Policies() {
  const { formatMessage } = useIntl();

  const sections = useMemo(() => ([
    {
      id: "house",
      title: formatMessage({ id: "policies.sections.house.title" }),
      summary: formatMessage({ id: "policies.sections.house.summary" }),
      items: [
        formatMessage({ id: "policies.sections.house.item1" }),
        formatMessage({ id: "policies.sections.house.item2" }),
        formatMessage({ id: "policies.sections.house.item3" }),
        formatMessage({ id: "policies.sections.house.item4" }),
      ],
    },
    {
      id: "health",
      title: formatMessage({ id: "policies.sections.health.title" }),
      summary: formatMessage({ id: "policies.sections.health.summary" }),
      items: [
        formatMessage({ id: "policies.sections.health.item1" }),
        formatMessage({ id: "policies.sections.health.item2" }),
        formatMessage({ id: "policies.sections.health.item3" }),
        formatMessage({ id: "policies.sections.health.item4" }),
      ],
    },
    {
      id: "cancellation",
      title: formatMessage({ id: "policies.sections.cancellation.title" }),
      summary: formatMessage({ id: "policies.sections.cancellation.summary" }),
      items: [
        formatMessage({ id: "policies.sections.cancellation.item1" }),
        formatMessage({ id: "policies.sections.cancellation.item2" }),
        formatMessage({ id: "policies.sections.cancellation.item3" }),
        formatMessage({ id: "policies.sections.cancellation.item4" }),
      ],
    },
  ]), [formatMessage]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          {formatMessage({ id: "policies.title" })}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          {formatMessage({ id: "policies.subtitle" })}
        </p>
      </header>

      <PolicyBlock sections={sections} />

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {formatMessage({ id: "policies.assistance" })}
        </h2>
        <p className="text-sm text-slate-600">
          {formatMessage({ id: "policies.contact" })}{" "}
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

