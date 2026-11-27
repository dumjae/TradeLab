import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering issue occurred.',
    };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Render crash captured cleanly in boundary state
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoDashboard = (): void => {
    this.setState({ hasError: false, errorMessage: null });
    window.location.assign('/');
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        id="main-content"
        className="flex min-h-[100dvh] items-center justify-center bg-terminal-bg px-4 py-10 text-terminal-text"
      >
        <div
          role="alert"
          className="w-full max-w-md rounded-lg border border-terminal-border bg-terminal-surface p-6 text-center sm:p-8 tl-page-enter"
        >
          <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-bear/40 bg-bear/10 text-bear">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>

          <h1 className="mt-4 text-lg font-semibold tracking-tight text-terminal-text">
            Something went wrong
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-terminal-muted">
            The screen hit an unexpected issue. Your saved progress and journal data remain safe.
          </p>

          {this.state.errorMessage && (
            <p className="mt-4 truncate rounded-md border border-terminal-border bg-terminal-bg px-3.5 py-2.5 font-mono text-[11px] text-terminal-muted">
              {this.state.errorMessage}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-semibold text-brand-fg hover:brightness-110 tl-press"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Reload
            </button>

            <button
              type="button"
              onClick={this.handleGoDashboard}
              className="inline-flex items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-bg px-4 py-2 text-xs font-semibold text-terminal-text hover:border-brand/50 hover:bg-terminal-elevated tl-press"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }
}
