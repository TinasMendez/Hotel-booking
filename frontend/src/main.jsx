import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './modules/auth/AuthContext'
import ErrorBoundary from './shared/ErrorBoundary'
import { ToastProvider } from './shared/ToastProvider'
import './index.css' // Tailwind + global styles

// Safety: ensure the root element exists to avoid a blank screen.
const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML =
    '<pre style="padding:16px;color:crimson">Missing &lt;div id="root"&gt; in index.html</pre>'
} else {
  const root = createRoot(rootEl)
  root.render(
    <React.StrictMode>
      {/* ErrorBoundary shows a readable screen instead of a blank page on runtime crashes */}
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <ToastProvider>
              <App />
            </ToastProvider>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
