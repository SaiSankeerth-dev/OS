import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  Search,
  Lock,
  Eye,
  EyeOff,
  Sliders,
  Play,
  Trash2,
  ArrowRight,
  HelpCircle,
  Check,
  Copy,
  Sparkles,
  X,
  KeyRound,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { Connector, CredField, ConnectorActionSpec, ConnectorDefaultField } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

// SVG Logos for authentic provider branding
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="18" height="18" viewBox="0 0 23 23" className="flex-shrink-0">
    <path fill="#f35325" d="M1 1h10.5v10.5H1z" />
    <path fill="#81bc06" d="M12.5 1H23v10.5H12.5z" />
    <path fill="#05a6f0" d="M1 12.5h10.5V23H1z" />
    <path fill="#ffba08" d="M12.5 12.5H23V23H12.5z" />
  </svg>
);

export const ConnectorsView: React.FC = () => {
  const { addNotification, setCurrentView } = useApp();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'connected' | 'available'>('all');
  const [testingId, setTestingId] = useState<string | null>(null);

  // Selected Connector Detail Modal
  const [activeConnector, setActiveConnector] = useState<Connector | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'scopes' | 'settings' | 'actions'>('setup');
  const [credValues, setCredValues] = useState<Record<string, string>>({});
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>({});
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isGrantingScopes, setIsGrantingScopes] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);

  const fetchConnectors = async () => {
    setIsLoading(true);
    try {
      const res = await api.getConnectors();
      setConnectors(res.connectors || []);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Failed to load connectors',
        message: err.message || 'Unknown network error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectors();
  }, []);

  const openDetailModal = async (c: Connector) => {
    try {
      const detailed = await api.getConnector(c.id);
      setActiveConnector(detailed);
      setSelectedScopes(detailed.scopes_granted?.length ? detailed.scopes_granted : detailed.scopes || []);
      setCredValues({});
      setShowPasswordMap({});
      setActiveTab('setup');

      // Load settings
      try {
        const sRes = await api.getConnectorSettings(c.id);
        setDefaultValues(sRes.settings || {});
      } catch {
        setDefaultValues({});
      }
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error loading connector detail',
        message: err.message,
      });
    }
  };

  const handleTest = async (cid: string) => {
    setTestingId(cid);
    try {
      const res = await api.testConnector(cid);
      if (res.ok) {
        addNotification({
          type: 'success',
          title: 'Connector Healthy',
          message: `${cid} passed live API verification.`,
        });
      } else {
        addNotification({
          type: 'warning',
          title: 'Connection Notice',
          message: res.status?.health_msg || 'Requires credential or permission review.',
        });
      }
      await fetchConnectors();
      if (activeConnector && activeConnector.id === cid) {
        const updated = await api.getConnector(cid);
        setActiveConnector(updated);
      }
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Health Check Failed',
        message: err.message,
      });
    } finally {
      setTestingId(null);
    }
  };

  const handleSaveCredentials = async () => {
    if (!activeConnector) return;
    setIsSavingCreds(true);
    try {
      await api.saveConnectorCredentials(activeConnector.id, activeConnector.name, credValues);
      addNotification({
        type: 'success',
        title: 'Credentials Encrypted & Saved',
        message: 'Credentials safely stored in machine vault. Running live health check...',
      });
      // Re-fetch detail and connector list
      const updated = await api.getConnector(activeConnector.id);
      setActiveConnector(updated);
      fetchConnectors();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: err.message,
      });
    } finally {
      setIsSavingCreds(false);
    }
  };

  const handleStartOAuth = async () => {
    if (!activeConnector) return;
    try {
      const res = await api.startConnectorOAuth(activeConnector.id);
      if (!res.url) {
        throw new Error('OAuth URL not returned from server');
      }

      const isMs = activeConnector.auth_kind === 'microsoft_oauth';
      const provider = isMs ? 'Microsoft' : 'Google';

      // Open OAuth popup
      const popup = window.open(
        res.url,
        'oauth_window',
        'width=540,height=680,scrollbars=yes,status=yes'
      );

      const messageListener = async (e: MessageEvent) => {
        if (e.data && (e.data.oauth_done || e.data.type === 'oauth-done')) {
          window.removeEventListener('message', messageListener);
          if (popup && !popup.closed) popup.close();
          addNotification({
            type: 'success',
            title: `${provider} Connected`,
            message: `Tokens exchanged and safely stored in the vault.`,
          });
          const updated = await api.getConnector(activeConnector.id);
          setActiveConnector(updated);
          fetchConnectors();
        }
      };

      window.addEventListener('message', messageListener);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'OAuth Error',
        message: err.message || 'Make sure OAuth Client ID and Secret are saved first.',
      });
    }
  };

  const handleGrantScopes = async () => {
    if (!activeConnector) return;
    setIsGrantingScopes(true);
    try {
      await api.grantConnector(activeConnector.id, selectedScopes);
      addNotification({
        type: 'success',
        title: 'Permissions Granted',
        message: `Granted ${selectedScopes.length} scopes to ${activeConnector.name}.`,
      });
      const updated = await api.getConnector(activeConnector.id);
      setActiveConnector(updated);
      fetchConnectors();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Grant Failed',
        message: err.message,
      });
    } finally {
      setIsGrantingScopes(false);
    }
  };

  const handleRevoke = async () => {
    if (!activeConnector) return;
    setIsRevoking(true);
    try {
      await api.revokeConnector(activeConnector.id);
      addNotification({
        type: 'info',
        title: 'Connector Revoked',
        message: `${activeConnector.name} disconnected and its credentials deleted from vault.`,
      });
      const updated = await api.getConnector(activeConnector.id);
      setActiveConnector(updated);
      fetchConnectors();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Revoke Failed',
        message: err.message,
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const handleSaveDefaults = async () => {
    if (!activeConnector) return;
    setIsSavingSettings(true);
    try {
      await api.saveConnectorSettings(activeConnector.id, defaultValues);
      addNotification({
        type: 'success',
        title: 'Defaults Saved',
        message: `Updated default settings for ${activeConnector.name}.`,
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: err.message,
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleRevokeAll = async () => {
    setShowRevokeAllModal(false);
    setIsLoading(true);
    try {
      const connectedList = connectors.filter((c) => c.state !== 'available');
      for (const c of connectedList) {
        await api.revokeConnector(c.id).catch(() => {});
      }
      addNotification({
        type: 'success',
        title: 'All Connectors Disconnected',
        message: 'All external credentials wiped and permissions reset.',
      });
      fetchConnectors();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Revoke All Failed',
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search
  const filteredConnectors = useMemo(() => {
    return connectors.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tagline && c.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterState === 'connected') return c.state === 'connected';
      if (filterState === 'available') return c.state !== 'connected';
      return true;
    });
  }, [connectors, searchQuery, filterState]);

  const connectedCount = connectors.filter((c) => c.state === 'connected').length;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-os-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Integrations & Services
            </span>
            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-os-secondary">
              {connectedCount} of {connectors.length} live
            </span>
          </div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight mt-1">
            Connectors & Integrations
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Permission-gated adapters with Fernet-encrypted vault storage, OAuth 2.0, and HITL safety rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {connectedCount > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRevokeAllModal(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Revoke All
            </Button>
          )}

          <Button
            variant="glass"
            size="sm"
            onClick={fetchConnectors}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-os-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search integrations (e.g. Gmail, GitHub, Notion)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-os-surface/80 border border-os-border rounded-glass-sm pl-9 pr-3 py-1.5 text-xs text-os-primary placeholder:text-os-muted focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-colors ${
              filterState === 'all'
                ? 'bg-white/10 text-os-primary border border-white/20'
                : 'text-os-muted hover:text-os-secondary hover:bg-white/5'
            }`}
          >
            All ({connectors.length})
          </button>
          <button
            onClick={() => setFilterState('connected')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-colors ${
              filterState === 'connected'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-os-muted hover:text-os-secondary hover:bg-white/5'
            }`}
          >
            Connected ({connectedCount})
          </button>
          <button
            onClick={() => setFilterState('available')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-colors ${
              filterState === 'available'
                ? 'bg-white/10 text-os-primary border border-white/20'
                : 'text-os-muted hover:text-os-secondary hover:bg-white/5'
            }`}
          >
            Available ({connectors.length - connectedCount})
          </button>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnectors.map((c) => {
          const isConnected = c.state === 'connected';
          const isGranted = c.state === 'granted';
          const isSetupError = c.state === 'setup_error';
          const isTesting = testingId === c.id;

          return (
            <GlassCard
              key={c.id}
              className={`p-4 space-y-3.5 transition-all hover:border-os-border-light flex flex-col justify-between ${
                isConnected
                  ? 'border-emerald-500/30 bg-emerald-500/[0.03] shadow-glass-glow'
                  : isSetupError
                  ? 'border-rose-500/30 bg-rose-500/[0.02]'
                  : ''
              }`}
            >
              <div className="space-y-2.5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-glass-sm flex items-center justify-center text-xl flex-shrink-0 border border-white/10 shadow-sm"
                      style={{ backgroundColor: c.color ? `${c.color}25` : '#4285F425' }}
                    >
                      {c.icon || '🔌'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-os-primary tracking-tight">{c.name}</h3>
                      <p className="text-[11px] text-os-secondary line-clamp-1">
                        {c.tagline || 'External API connector'}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      isConnected
                        ? 'emerald'
                        : isGranted
                        ? 'cyan'
                        : isSetupError
                        ? 'danger'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {c.state.toUpperCase()}
                  </Badge>
                </div>

                {/* Health or State message */}
                {c.health_msg ? (
                  <div
                    className={`p-2 rounded-glass-sm text-[11px] leading-snug line-clamp-2 ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {c.health_msg}
                  </div>
                ) : (
                  <p className="text-[11px] text-os-muted leading-relaxed line-clamp-2">
                    {c.note || 'Permission-gated live external adapter.'}
                  </p>
                )}
              </div>

              {/* Bottom controls */}
              <div className="pt-3 border-t border-os-border/40 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-os-muted">
                  {c.scopes_granted?.length || 0} / {c.scopes?.length || 0} scopes
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleTest(c.id)}
                    isLoading={isTesting}
                    title="Run live health check"
                    leftIcon={<Zap className="w-3 h-3 text-emerald-400" />}
                  >
                    Test
                  </Button>

                  <Button
                    variant={isConnected ? 'glass' : 'primary'}
                    size="sm"
                    onClick={() => openDetailModal(c)}
                    leftIcon={<Sliders className="w-3 h-3" />}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {filteredConnectors.length === 0 && (
        <GlassCard className="p-12 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-os-muted mx-auto" />
          <h3 className="text-sm font-semibold text-os-primary">No connectors match your search</h3>
          <p className="text-xs text-os-secondary max-w-sm mx-auto">
            Try searching for a different keyword or switch to the "All" filter to view all available adapters.
          </p>
        </GlassCard>
      )}

      {/* Connector Detail Modal */}
      {activeConnector && (
        <Modal
          isOpen={true}
          onClose={() => setActiveConnector(null)}
          title=""
          maxWidth="lg"
        >
          <div className="space-y-5 -mt-2">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-os-border/50">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-glass-md flex items-center justify-center text-2xl flex-shrink-0 border border-white/10"
                  style={{
                    backgroundColor: activeConnector.color ? `${activeConnector.color}30` : '#4285F430',
                  }}
                >
                  {activeConnector.icon || '🔌'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-os-primary tracking-tight">
                      {activeConnector.name}
                    </h2>
                    <Badge
                      variant={
                        activeConnector.state === 'connected'
                          ? 'emerald'
                          : activeConnector.state === 'granted'
                          ? 'cyan'
                          : activeConnector.state === 'setup_error'
                          ? 'danger'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {activeConnector.state.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-os-secondary mt-0.5">{activeConnector.tagline}</p>
                </div>
              </div>

              {activeConnector.docs_url && (
                <a
                  href={activeConnector.docs_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2 rounded-glass-sm bg-emerald-500/10 border border-emerald-500/20 transition-colors"
                >
                  <span>Official Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* State Banner & Honesty Note */}
            <div className="space-y-2">
              {activeConnector.state === 'connected' ? (
                <div className="p-3 rounded-glass-sm bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Live API Verified: </span>
                    Connected to {activeConnector.name}. Safe read operations execute immediately; sensitive writes pause for your approval.
                  </div>
                </div>
              ) : activeConnector.state === 'setup_error' ? (
                <div className="p-3 rounded-glass-sm bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Setup / Health Check Failed: </span>
                    {activeConnector.health_msg || 'Credentials could not be verified by the service.'}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-glass-sm bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-os-secondary">
                  <Lock className="w-4 h-4 text-os-muted flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-os-primary">Vault Encrypted: </span>
                    OS will never touch external endpoints until you configure credentials and grant permission.
                  </div>
                </div>
              )}

              {activeConnector.note && (
                <p className="text-[11px] text-os-muted italic px-1 leading-relaxed">
                  Note: {activeConnector.note}
                </p>
              )}
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-os-border/50 text-xs gap-1">
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'setup'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-os-muted hover:text-os-secondary'
                }`}
              >
                1. Credentials & Setup
              </button>
              <button
                onClick={() => setActiveTab('scopes')}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'scopes'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-os-muted hover:text-os-secondary'
                }`}
              >
                2. Permissions ({activeConnector.scopes?.length || 0})
              </button>
              {activeConnector.defaults && activeConnector.defaults.length > 0 && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'border-emerald-400 text-emerald-400'
                      : 'border-transparent text-os-muted hover:text-os-secondary'
                  }`}
                >
                  3. Defaults
                </button>
              )}
              {activeConnector.actions && activeConnector.actions.length > 0 && (
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'actions'
                      ? 'border-emerald-400 text-emerald-400'
                      : 'border-transparent text-os-muted hover:text-os-secondary'
                  }`}
                >
                  4. Actions & Prompts
                </button>
              )}
            </div>

            {/* Tab 1: Setup & Credentials */}
            {activeTab === 'setup' && (
              <div className="space-y-4">
                {/* Numbered Setup Instructions */}
                {activeConnector.setup_steps && activeConnector.setup_steps.length > 0 && (
                  <div className="p-3.5 rounded-glass-sm bg-black/30 border border-white/5 space-y-2 text-xs">
                    <h4 className="font-semibold text-os-primary flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Setup Instructions</span>
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-os-secondary leading-relaxed">
                      {activeConnector.setup_steps.map((step, idx) => (
                        <li key={idx} className="pl-1">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* OAuth Flow or Token Fields */}
                <div className="space-y-3">
                  {activeConnector.cred_fields && activeConnector.cred_fields.length > 0 && (
                    <div className="space-y-3">
                      {activeConnector.cred_fields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-xs font-semibold text-os-primary flex items-center justify-between">
                            <span>{field.label || field.key}</span>
                            {field.help && (
                              <span className="text-[10px] text-os-muted font-normal">
                                {field.help}
                              </span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              type={
                                field.secret && !showPasswordMap[field.key]
                                  ? 'password'
                                  : 'text'
                              }
                              placeholder={field.placeholder || `Enter ${field.label || field.key}`}
                              value={credValues[field.key] || ''}
                              onChange={(e) =>
                                setCredValues({ ...credValues, [field.key]: e.target.value })
                              }
                              className="w-full bg-os-surface/80 border border-os-border rounded-glass-sm px-3 py-1.5 text-xs text-os-primary placeholder:text-os-muted focus:outline-none focus:border-emerald-500/50"
                            />
                            {field.secret && (
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswordMap({
                                    ...showPasswordMap,
                                    [field.key]: !showPasswordMap[field.key],
                                  })
                                }
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-os-muted hover:text-os-primary"
                              >
                                {showPasswordMap[field.key] ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={handleSaveCredentials}
                          isLoading={isSavingCreds}
                          leftIcon={<Lock className="w-3.5 h-3.5 text-emerald-400" />}
                        >
                          Save Credentials in Vault
                        </Button>

                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => handleTest(activeConnector.id)}
                          isLoading={testingId === activeConnector.id}
                          leftIcon={<Zap className="w-3 h-3 text-emerald-400" />}
                        >
                          Test Live Connection
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* OAuth Sign-In Button */}
                  {(activeConnector.auth_kind === 'google_oauth' ||
                    activeConnector.auth_kind === 'microsoft_oauth') && (
                    <div className="pt-3 border-t border-os-border/40 space-y-2">
                      <div className="text-xs font-semibold text-os-primary">
                        OAuth 2.0 Authorization
                      </div>
                      <p className="text-[11px] text-os-secondary">
                        Once Client ID & Secret are saved above, click below to authorize access with your account.
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={handleStartOAuth}
                          className="flex items-center gap-2.5 px-4 py-2 rounded-glass-sm bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-os-primary transition-all shadow-sm"
                        >
                          {activeConnector.auth_kind === 'microsoft_oauth' ? (
                            <MicrosoftLogo />
                          ) : (
                            <GoogleLogo />
                          )}
                          <span>
                            {activeConnector.auth_kind === 'microsoft_oauth'
                              ? 'Sign in with Microsoft'
                              : 'Sign in with Google'}
                          </span>
                        </button>

                        {activeConnector.state === 'connected' && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Signed In & Token Refresh Active</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Scopes / Permissions */}
            {activeTab === 'scopes' && (
              <div className="space-y-4 text-xs">
                <p className="text-os-secondary">
                  Configure which permissions OS is authorized to use. You can revoke access at any time.
                </p>

                <div className="space-y-2 rounded-glass-sm bg-black/25 border border-white/5 p-3">
                  {(activeConnector.scopes || []).map((scope) => {
                    const isChecked = selectedScopes.includes(scope);
                    return (
                      <label
                        key={scope}
                        className="flex items-center gap-2.5 p-1.5 rounded hover:bg-white/5 cursor-pointer text-os-primary"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScopes([...selectedScopes, scope]);
                            } else {
                              setSelectedScopes(selectedScopes.filter((s) => s !== scope));
                            }
                          }}
                          className="rounded border-os-border bg-black/40 text-emerald-500 focus:ring-0"
                        />
                        <span className="leading-snug">{scope}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRevoke}
                    isLoading={isRevoking}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Disconnect & Revoke
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGrantScopes}
                    isLoading={isGrantingScopes}
                    leftIcon={<Shield className="w-3.5 h-3.5" />}
                  >
                    Grant Permissions ({selectedScopes.length})
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 3: Defaults & Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-4 text-xs">
                <p className="text-os-secondary">
                  Configure default targets (e.g. default repository, channel ID, calendar) used when no parameter is explicitly passed.
                </p>

                <div className="space-y-3">
                  {(activeConnector.defaults || []).map((def) => (
                    <div key={def.key} className="space-y-1">
                      <label className="font-semibold text-os-primary flex items-center justify-between">
                        <span>{def.label || def.key}</span>
                        {def.help && <span className="text-[10px] text-os-muted">{def.help}</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={def.placeholder || `Default ${def.label}`}
                        value={defaultValues[def.key] || ''}
                        onChange={(e) =>
                          setDefaultValues({ ...defaultValues, [def.key]: e.target.value })
                        }
                        className="w-full bg-os-surface/80 border border-os-border rounded-glass-sm px-3 py-1.5 text-xs text-os-primary focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={handleSaveDefaults}
                    isLoading={isSavingSettings}
                    leftIcon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    Save Defaults
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 4: Actions & Try It */}
            {activeTab === 'actions' && (
              <div className="space-y-4 text-xs">
                {/* Actions list */}
                {activeConnector.actions && activeConnector.actions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-os-primary flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supported Tool Actions</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeConnector.actions.map((act) => (
                        <div
                          key={act.name}
                          className="p-2.5 rounded-glass-sm bg-black/25 border border-white/5 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-emerald-400">
                              {act.name}
                            </span>
                            <Badge
                              variant={act.needs_approval ? 'amber' : 'neutral'}
                              size="sm"
                            >
                              {act.needs_approval ? 'ASKS APPROVAL' : 'DIRECT READ'}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-os-secondary">{act.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Try It Prompts */}
                {activeConnector.try_it && activeConnector.try_it.length > 0 && (
                  <div className="pt-2 border-t border-os-border/40 space-y-2">
                    <h4 className="font-semibold text-os-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Try It in Ask OS</span>
                    </h4>
                    <div className="space-y-1.5">
                      {activeConnector.try_it.map((prompt, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-glass-sm bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-colors"
                        >
                          <span className="text-xs text-os-primary font-mono italic">
                            "{prompt}"
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(prompt);
                                addNotification({
                                  type: 'info',
                                  title: 'Prompt Copied',
                                  message: prompt,
                                });
                              }}
                              className="p-1 rounded text-os-muted hover:text-os-primary hover:bg-white/5"
                              title="Copy prompt"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setActiveConnector(null);
                                setCurrentView('chat');
                                localStorage.setItem('os_pending_chat_prompt', prompt);
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                            >
                              <span>Send</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Revoke All Confirmation Modal */}
      {showRevokeAllModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowRevokeAllModal(false)}
          title="Disconnect All Connectors?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-os-secondary leading-relaxed">
              This will disconnect all integrations, revoke granted scopes, and permanently wipe all credentials from your machine's encrypted vault.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRevokeAllModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRevokeAll}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Revoke All
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
