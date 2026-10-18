import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { VoiceProvider } from './context/VoiceContext';
import { Topbar } from './components/navigation/Topbar';
import { Sidebar } from './components/navigation/Sidebar';
import { CommandPalette } from './components/navigation/CommandPalette';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

// Fix 8: Code-splitting views via React.lazy() to eliminate monolith bundle
const HomeView = lazy(() => import('./components/views/HomeView').then(m => ({ default: m.HomeView })));
const ChatCanvas = lazy(() => import('./components/chat/ChatCanvas').then(m => ({ default: m.ChatCanvas })));
const TasksView = lazy(() => import('./components/views/TasksView').then(m => ({ default: m.TasksView })));
const ActivityView = lazy(() => import('./components/views/ActivityView').then(m => ({ default: m.ActivityView })));
const ConnectorsView = lazy(() => import('./components/views/ConnectorsView').then(m => ({ default: m.ConnectorsView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(m => ({ default: m.SettingsView })));
const ComputerView = lazy(() => import('./components/views/ComputerView').then(m => ({ default: m.ComputerView })));
const DiscoveryView = lazy(() => import('./components/views/DiscoveryView').then(m => ({ default: m.DiscoveryView })));
const HudView = lazy(() => import('./components/views/HudView').then(m => ({ default: m.HudView })));

const ViewFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center p-12 text-os-secondary min-h-[360px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest text-os-tertiary">Loading module...</span>
    </div>
  </div>
);

const MainShell: React.FC = () => {
  const { currentView, notifications, removeNotification } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
      case 'overview':
        return <HomeView />;
      case 'chat':
        return <ChatCanvas />;
      case 'discovery':
        return <DiscoveryView />;
      case 'tasks':
        return <TasksView initialTab="tasks" />;
      case 'plan':
        return <TasksView initialTab="plan" />;
      case 'computer':
        return <ComputerView />;
      case 'connections':
      case 'connectors':
        return <ConnectorsView />;
      case 'activity':
        return <ActivityView initialTab="approvals" />;
      case 'approvals':
        return <ActivityView initialTab="approvals" />;
      case 'settings':
        return <SettingsView initialTab="memory" />;
      case 'memory':
        return <SettingsView initialTab="memory" />;
      case 'agents':
        return <SettingsView initialTab="workers" />;
      case 'hud':
        return <HudView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-os-bg text-os-primary flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Topbar */}
      <Topbar />

      {/* Main Workspace Surface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* View Surface */}
        <main className="flex-1 overflow-y-auto relative">
          <Suspense fallback={<ViewFallback />}>
            {renderView()}
          </Suspense>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Floating Notifications Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((toast) => {
          const Icon =
            toast.type === 'success'
              ? CheckCircle2
              : toast.type === 'warning'
              ? AlertTriangle
              : toast.type === 'error'
              ? XCircle
              : Info;

          const colorClass =
            toast.type === 'success'
              ? 'border-emerald-500/40 text-emerald-400 shadow-glass-glow'
              : toast.type === 'warning'
              ? 'border-amber-500/40 text-amber-400 shadow-glass-glow-amber'
              : toast.type === 'error'
              ? 'border-rose-500/40 text-rose-400 shadow-glass-glow-danger'
              : 'border-cyan-500/40 text-cyan-400 shadow-glass-glow-cyan';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-glass-md glass-panel border ${colorClass} flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200`}
            >
              <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="font-bold text-os-primary">{toast.title}</div>
                {toast.message && <div className="text-os-secondary mt-0.5">{toast.message}</div>}
              </div>
              <button
                onClick={() => removeNotification(toast.id)}
                className="text-os-muted hover:text-os-primary p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <VoiceProvider>
        <MainShell />
      </VoiceProvider>
    </AppProvider>
  );
};

export default App;
