import { Suspense } from 'react';
import { UserListView } from '@features/user';
import { Layout } from '@shared/components';

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
      <Layout
        onSearchClick={() => console.info('[Header] Search clicked')}
        onNotificationClick={() => console.info('[Header] Notifications clicked')}
      >
        <UserListView />
      </Layout>
    </Suspense>
  );
}

export default App;

