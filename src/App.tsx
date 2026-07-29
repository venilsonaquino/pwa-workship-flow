import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthFlow } from '@features/auth';
import { Layout } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import AppRoutes from '@core/routes/AppRoutes';
import { useThemeStore } from '@shared/hooks/useThemeStore';

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
  useThemeStore();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthFlow />
      </Suspense>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<LoadingScreen />}>
        <Layout>
          <AppRoutes />
        </Layout>
      </Suspense>
    </>
  );
}

export default App;
