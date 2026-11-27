import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AdminRoute, LearnerRoute, PublicOnlyRoute } from '../components/auth/RouteGuards';
import { AppShell } from '../components/layout/AppShell';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';

const AUTH_KEY = 'tradelab_local_preview_auth_v1';

function seedUser(role: 'learner' | 'admin') {
  window.localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      id: `local-${role}`,
      email: `${role}@tradelab.local`,
      displayName: role,
      avatarUrl: null,
      role,
      authProvider: 'local_preview',
    }),
  );
}

function renderRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
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
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>ADMIN PORTAL SCREEN</div>
              </AdminRoute>
            }
          />
          <Route
            path="/"
            element={
              <LearnerRoute>
                <div>LEARNER HOME SCREEN</div>
              </LearnerRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('role-separated routing', () => {
  it('sends unauthenticated visitors to the login panel', () => {
    renderRoutes('/admin');
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.queryByText('ADMIN PORTAL SCREEN')).not.toBeInTheDocument();
  });

  it('blocks learners from /admin and returns them to the learner view', () => {
    seedUser('learner');
    renderRoutes('/admin');
    expect(screen.getByText('LEARNER HOME SCREEN')).toBeInTheDocument();
    expect(screen.queryByText('ADMIN PORTAL SCREEN')).not.toBeInTheDocument();
  });

  it('lets admins open /admin', () => {
    seedUser('admin');
    renderRoutes('/admin');
    expect(screen.getByText('ADMIN PORTAL SCREEN')).toBeInTheDocument();
  });

  it('redirects a logged-in admin away from /login to the admin portal', () => {
    seedUser('admin');
    renderRoutes('/login');
    expect(screen.getByText('ADMIN PORTAL SCREEN')).toBeInTheDocument();
  });

  it('redirects a logged-in learner away from /login to the learner home', () => {
    seedUser('learner');
    renderRoutes('/login');
    expect(screen.getByText('LEARNER HOME SCREEN')).toBeInTheDocument();
  });
});

describe('login panel in Local Preview Mode', () => {
  it('shows the Google button and both preview role entries', () => {
    renderRoutes('/login');
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Enter as Learner (Normal View)')).toBeInTheDocument();
    expect(screen.getByText('Enter as Admin (Admin Portal)')).toBeInTheDocument();
  });

  it('omits the removed setup guide, SQL promotion snippet, and env hints', () => {
    renderRoutes('/login');
    expect(screen.queryByText(/supabase gmail & admin setup guide/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/public\.profiles/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/VITE_SUPABASE_/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\(Gmail\)/i)).not.toBeInTheDocument();
  });

  it('enters the admin portal when choosing the admin preview role', async () => {
    const user = userEvent.setup();
    renderRoutes('/login');
    await user.click(screen.getByText('Enter as Admin (Admin Portal)'));
    expect(await screen.findByText('ADMIN PORTAL SCREEN')).toBeInTheDocument();
  });

  it('enters the learner view when choosing the learner preview role', async () => {
    const user = userEvent.setup();
    renderRoutes('/login');
    await user.click(screen.getByText('Enter as Learner (Normal View)'));
    expect(await screen.findByText('LEARNER HOME SCREEN')).toBeInTheDocument();
  });
});

describe('learner shell navigation', () => {
  function renderShell() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route
              element={
                <AppShell vaultOpen={false} onOpenVault={() => undefined} onCloseVault={() => undefined}>
                  <Outlet />
                </AppShell>
              }
            >
              <Route path="/" element={<div>shell content</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
  }

  it('hides every admin entry point from learners and exposes the backtester', () => {
    seedUser('learner');
    renderShell();
    expect(screen.queryByText(/Admin Console/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Return to Admin Portal/i)).not.toBeInTheDocument();
    expect(screen.getAllByText('Market Backtester').length).toBeGreaterThan(0);
  });

  it('offers admins a way back to the admin portal', () => {
    seedUser('admin');
    renderShell();
    expect(screen.getAllByText(/Return to Admin Portal/i).length).toBeGreaterThan(0);
  });
});
