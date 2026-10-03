import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { VoiceProvider } from './context/VoiceContext';
import { Topbar } from './components/navigation/Topbar';
import { Sidebar } from './components/navigation/Sidebar';
import { CommandPalette } from './components/navigation/CommandPalette';
import { HomeView } from './components/views/HomeView';
import { ChatCanvas } from './components/chat/ChatCanvas';
import { PlanView } from './components/views/PlanView';
import { TasksView } from './components/views/TasksView';
import { ApprovalsView } from './components/views/ApprovalsView';
import { AgentsView } from './components/views/AgentsView';
import { ActivityView } from './components/views/ActivityView';
import { ConnectorsView } from './components/views/ConnectorsView';
import { MemoryView } from './components/views/MemoryView';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const MainShell: React.FC = () => {
  const { currentView, notifications, removeNotification } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'chat':
        return <ChatCanvas />;
      case 'plan':
        return <PlanView />;
      case 'tasks':
        return <TasksView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'agents':
        return <AgentsView />;
      case 'activity':
        return <ActivityView />;
      case 'connectors':
        return <ConnectorsView />;
      case 'memory':
        return <MemoryView />;
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
          {renderView()}
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
