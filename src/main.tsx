import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// ── Service Worker Registration ────────────────────────────────────────────────
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-update: reload the page when a new SW version is available
    updateSW(true);
  },
  onOfflineReady() {
    console.info('[PWA] App ready to work offline.');
  },
  onRegistered(swRegistration) {
    console.info('[PWA] Service Worker registered:', swRegistration);
  },
  onRegisterError(error) {
    console.error('[PWA] Service Worker registration failed:', error);
  },
});

// ── Mount Application ──────────────────────────────────────────────────────────

const container = document.getElementById('root');

if (!container) {
  throw new Error('[App] Root element #root not found in DOM.');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
