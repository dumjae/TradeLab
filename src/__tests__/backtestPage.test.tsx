import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BacktestPage } from '../pages/BacktestPage';

function readBar(): { current: number; total: number } {
  const text = screen.getByText(/^Bar \d+ \/ \d+$/).textContent ?? '';
  const [, current, total] = text.match(/Bar (\d+) \/ (\d+)/) ?? [];
  return { current: Number(current), total: Number(total) };
}

describe('BacktestPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to an honestly-labelled offline sample when live data is unreachable', async () => {
    render(<BacktestPage />);
    expect(await screen.findByText('Offline Historical Sample')).toBeInTheDocument();
    expect(screen.queryByText(/Live Binance/)).not.toBeInTheDocument();
  });

  it('steps bars forward and hides future candles behind the replay index', async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);
    await screen.findByText('Order Ticket');
    const before = readBar();
    await user.click(screen.getByText('Step +5 Bars'));
    expect(readBar().current).toBe(before.current + 5);
    expect(readBar().total).toBe(before.total);
  });

  it('rejects an order whose stop sits on the wrong side of entry', async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);
    await screen.findByText('Order Ticket');
    const lastPrice = Number(screen.getByText(/Market entry at last close/).querySelector('strong')?.textContent);
    await user.type(screen.getByLabelText('Stop loss price'), String(lastPrice * 1.01));
    await user.click(screen.getByText('Execute Market Order'));
    expect(await screen.findByRole('alert')).toHaveTextContent(/below Entry/i);
    expect(screen.getByText('Open Positions (0)')).toBeInTheDocument();
  });

  it('opens a long, sizes risk at 1% and lets the user close it at market', async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);
    await screen.findByText('Order Ticket');
    const lastPrice = Number(screen.getByText(/Market entry at last close/).querySelector('strong')?.textContent);
    await user.type(screen.getByLabelText('Stop loss price'), (lastPrice * 0.99).toFixed(2));
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    await user.click(screen.getByText('Execute Market Order'));
    expect(await screen.findByText('Open Positions (1)')).toBeInTheDocument();

    await user.click(screen.getByText('Close at Market'));
    await waitFor(() => expect(screen.getByText('Open Positions (0)')).toBeInTheDocument());
    expect(screen.getAllByText(/manual close/).length).toBeGreaterThan(0);
  });

  it('refuses to save a session with no trades', async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);
    await screen.findByText('Order Ticket');
    await user.click(screen.getByText('Save Session'));
    expect(await screen.findByText(/Place at least one trade/)).toBeInTheDocument();
  });
});
