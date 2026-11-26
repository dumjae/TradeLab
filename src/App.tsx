import { useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AdminRoute, LearnerRoute, PublicOnlyRoute } from './components/auth/RouteGuards';
import { AdminShell } from './components/layout/AdminShell';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { AcademyCatalogPage } from './pages/AcademyCatalogPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminQuotesPage } from './pages/AdminQuotesPage';
import { AdminVisualLibraryPage } from './pages/AdminVisualLibraryPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { BacktestPage } from './pages/BacktestPage';
import { DashboardPage } from './pages/DashboardPage';
import { LessonPage } from './pages/LessonPage';
import { LibraryPage } from './pages/LibraryPage';
import { LoginPage } from './pages/LoginPage';
import { PracticePage } from './pages/PracticePage';
import { TradingLabPage } from './pages/TradingLabPage';

export function App() {
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);
  const openVault = () => setVaultOpen(true);

  return (
    <BrowserRouter>
      <AuthProvider>
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
                  <Outlet />
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
                  <Outlet />
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
            <Route path="/lab" element={<TradingLabPage />} />
            <Route path="/library" element={<LibraryPage onOpenVault={openVault} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
