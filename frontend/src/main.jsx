import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./modules/auth/AuthContext.jsx";
import { ToastProvider } from "./shared/ToastProvider.jsx";
import I18nProvider from "./i18n/I18nProvider.jsx";
import "./index.css"; // <- importante para Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  </React.StrictMode>
);
