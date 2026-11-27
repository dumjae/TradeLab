import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AdminRoute, LearnerRoute, PublicOnlyRoute } from './components/auth/RouteGuards';
import { AdminShell } from './components/layout/AdminShell';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

const AcademyCatalogPage = lazy(() =>
  import('./pages/AcademyCatalogPage').then((m) => ({ default: m.AcademyCatalogPage })),
);
const LessonPage = lazy(() =>
  import('./pages/LessonPage').then((m) => ({ default: m.LessonPage })),
);
const PracticePage = lazy(() =>
  import('./pages/PracticePage').then((m) => ({ default: m.PracticePage })),
);
const BacktestPage = lazy(() =>
  import('./pages/BacktestPage').then((m) => ({ default: m.BacktestPage })),
);
const TradingLabPage = lazy(() =>
  import('./pages/TradingLabPage').then((m) => ({ default: m.TradingLabPage })),
);
const LibraryPage = lazy(() =>
  import('./pages/LibraryPage').then((m) => ({ default: m.LibraryPage })),
);
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage })),
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminVisualLibraryPage = lazy(() =>
  import('./pages/AdminVisualLibraryPage').then((m) => ({ default: m.AdminVisualLibraryPage })),
);
const AdminQuotesPage = lazy(() =>
  import('./pages/AdminQuotesPage').then((m) => ({ default: m.AdminQuotesPage })),
);

function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center p-6"
    >
      <div className="flex items-center gap-3 rounded-full border border-terminal-border bg-terminal-surface px-4 py-2.5 shadow-sm">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"
        />
        <span className="text-xs font-medium text-terminal-muted">Loading workspace...</span>
      </div>
    </div>
  );
}

export function App() {
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);
  const openVault = () => setVaultOpen(true);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              <Route
                element={
                  <AdminRoute>
                    <AdminShell>
                      <Suspense fallback={<RouteLoadingFallback />}>
                        <Outlet />
                      </Suspense>
                    </AdminShell>
                  </AdminRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/visual-library" element={<AdminVisualLibraryPage />} />
                <Route path="/admin/quotes" element={<AdminQuotesPage />} />
              </Route>

              <Route
                element={
                  <LearnerRoute>
                    <AppShell
                      vaultOpen={vaultOpen}
                      onOpenVault={openVault}
                      onCloseVault={() => setVaultOpen(false)}
                    >
                      <Suspense fallback={<RouteLoadingFallback />}>
                        <Outlet />
                      </Suspense>
                    </AppShell>
                  </LearnerRoute>
                }
              >
                <Route path="/" element={<DashboardPage onOpenVault={openVault} />} />
                <Route path="/academy" element={<AcademyCatalogPage />} />
                <Route path="/academy/:slug" element={<LessonPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/practice/:slug" element={<PracticePage />} />
                <Route path="/backtest" element={<BacktestPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/lab" element={<TradingLabPage />} />
                <Route path="/library" element={<LibraryPage onOpenVault={openVault} />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
