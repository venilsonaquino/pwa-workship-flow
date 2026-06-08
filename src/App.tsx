import { Suspense } from 'react';
import { UserListView } from '@features/user';
import { PWAInstallPrompt, NavigationMenu } from '@shared/components';

// ── Suspense Fallback ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin-slow" />
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* Replace with a Router (e.g. react-router-dom) as the app grows */}
      <UserListView />
      <NavigationMenu />
      <PWAInstallPrompt />
    </Suspense>
  );
}

export default App;
