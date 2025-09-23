// frontend/src/__tests__/header.auth.smoke.test.jsx
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "../App.jsx";
import I18nProvider from "../i18n/I18nProvider.jsx";
import { ToastProvider } from "../shared/ToastProvider.jsx";
import { AuthProvider } from "../modules/auth/AuthContext.jsx";

function Wrapper({ children }) {
  return (
    <BrowserRouter>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

test("renders header with auth CTAs when unauthenticated", async () => {
  render(<App />, { wrapper: Wrapper });

  const header = screen.getByRole("banner");
  expect(header).toBeInTheDocument();

  // Use role-based queries to avoid collisions with footer text
  const createAccount = within(header).getByRole("link", {
    name: /Create account/i,
  });
  const signIn = within(header).getByRole("link", { name: /Sign in/i });

  expect(createAccount).toBeInTheDocument();
  expect(signIn).toBeInTheDocument();
});
