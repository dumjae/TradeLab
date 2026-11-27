import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppShell } from '../components/layout/AppShell';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { DashboardPage } from '../pages/DashboardPage';
import { LessonPage } from '../pages/LessonPage';
import { LoginPage } from '../pages/LoginPage';

function renderWithProviders(ui: React.ReactElement, initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <AuthProvider>{ui}</AuthProvider>
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe('Editorial Fintech UI/UX Redesign', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders LoginPage with asymmetric editorial folio, market specimen, and clean auth controls', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, ['/login']);

    expect(
      screen.getByRole('heading', { name: /read market structure with discipline/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('358')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google \(gmail\)/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue with email & password/i }));
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it('renders AppShell with single-line top navigation (zero desktop left sidebar) and interactive More menu', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('tradelab_local_preview_role_v1', 'learner');

    const { container } = renderWithProviders(
      <AppShell vaultOpen={false} onOpenVault={() => {}} onCloseVault={() => {}}>
        <div>Workspace Content</div>
      </AppShell>,
    );

    // No generic persistent desktop left sidebar
    expect(container.querySelector('aside')).toBeNull();

    // Primary top-bar destinations exist cleanly
    expect(screen.getByRole('link', { name: /^overview$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^academy$/i }).length).toBeGreaterThan(0);

    // Secondary routes live cleanly inside More dropdown
    const moreButton = screen.getByRole('button', { name: /^more$/i });
    await user.click(moreButton);
    expect(screen.getByRole('menuitem', { name: /glossary & cards/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /evaluation/i })).toBeInTheDocument();
  });

  it('renders LessonPage in a single-column editorial flow and opens/closes the Study Companion drawer on demand', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/academy/:slug" element={<LessonPage />} />
      </Routes>,
      ['/academy/chart-reading-fundamentals'],
    );

    // Study Companion drawer is closed by default so reading content is unobstructed
    expect(screen.queryByRole('dialog', { name: /study companion/i })).not.toBeInTheDocument();

    // Open Study Companion drawer on demand
    const companionBtn = screen.getByRole('button', { name: /study companion/i });
    await user.click(companionBtn);

    expect(screen.getByRole('heading', { name: /ai mentor/i })).toBeInTheDocument();

    // Switch to Explain Differently tab inside drawer
    await user.click(screen.getByRole('tab', { name: /explain differently/i }));
    expect(screen.getByRole('heading', { name: /explain differently/i })).toBeInTheDocument();

    // Close drawer via backdrop button
    await user.click(screen.getByRole('button', { name: /dismiss study companion backdrop/i }));
    expect(screen.queryByRole('heading', { name: /explain differently/i })).not.toBeInTheDocument();
  });

  it('renders DashboardPage with unboxed editorial study focus, PH Market Hours strip, and Mastery readout', () => {
    renderWithProviders(<DashboardPage onOpenVault={() => {}} onOpenTour={() => {}} />);

    expect(screen.getByText(/market hours \(ph time\)/i)).toBeInTheDocument();
    expect(screen.getByText(/practical trading tools/i)).toBeInTheDocument();
    expect(screen.getByText(/market specializations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /1-min app tour/i })).toBeInTheDocument();
  });
});
