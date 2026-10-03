import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OS Uncaught React Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    localStorage.removeItem('os-current-view');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-os-bg text-os-primary flex items-center justify-center p-6 antialiased">
          <div className="max-w-lg w-full p-8 rounded-glass-xl glass-panel border border-rose-500/30 shadow-glass-glow-danger text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400">
                System Interface Fault
              </span>
              <h2 className="text-xl font-bold text-os-primary">
                OS Interface Encountered a Render Error
              </h2>
              <p className="text-xs text-os-secondary leading-relaxed">
                The core OS daemon and database remain fully active and safe. A visual surface component caught an unhandled exception.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left p-3.5 rounded-glass-md bg-black/40 border border-white/5 overflow-x-auto text-[11px] font-mono text-rose-300 max-h-36">
                <div className="font-semibold text-rose-200 mb-1">{this.state.error.name}: {this.state.error.message}</div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-os-muted whitespace-pre-wrap">{this.state.error.stack.split('\n').slice(0, 4).join('\n')}</pre>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="btn-press px-4 py-2 rounded-glass-md bg-white/10 hover:bg-white/15 border border-os-border text-xs font-medium text-os-primary flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload OS</span>
              </button>
              <button
                onClick={this.handleReset}
                className="btn-press px-4 py-2 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-2 transition-all shadow-glass-glow"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
