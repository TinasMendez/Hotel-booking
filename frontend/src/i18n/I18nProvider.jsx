import React, { useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";

const supportedLocales = {
  en: enMessages,
  es: esMessages,
};

function normalizeLocale(locale) {
  if (!locale) return "en";
  const lower = locale.toLowerCase();
  if (lower.startsWith("es")) return "es";
  return "en";
}

export default function I18nProvider({ children }) {
  const [locale] = useState(() => normalizeLocale(typeof navigator !== "undefined" ? navigator.language : "en"));
  const messages = useMemo(() => supportedLocales[locale] || enMessages, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      {children}
    </IntlProvider>
  );
}
