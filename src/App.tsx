import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthFlow } from '@features/auth';
import { ServiceUnavailableView } from '@features/error';
import { useHealthChecker } from '@features/health';
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
  useHealthChecker();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isErrorRoute =
    location.pathname === '/503' || location.pathname === '/maintenance';

  if (isErrorRoute) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ServiceUnavailableView />
      </Suspense>
    );
  }

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
