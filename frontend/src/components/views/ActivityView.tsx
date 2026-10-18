import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  Database,
  Lock,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { Approval, PendingConnectorAction, ActivityItem } from '../../types/api';
import { ApprovalCard } from '../chat/ApprovalCard';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface ActivityViewProps {
  initialTab?: 'approvals' | 'audit';
}

export const ActivityView: React.FC<ActivityViewProps> = ({ initialTab = 'approvals' }) => {
  const { refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<'approvals' | 'audit'>(initialTab);
  const [v1Approvals, setV1Approvals] = useState<Approval[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingConnectorAction[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vRes, aRes, actRes] = await Promise.allSettled([
        api.getV1Approvals(),
        api.getPendingActions(),
        api.getActivity(100),
      ]);

      if (vRes.status === 'fulfilled') {
        setV1Approvals(vRes.value.pending_approvals || []);
      }
      if (aRes.status === 'fulfilled') {
        setPendingActions(aRes.value.pending || []);
      }
      if (actRes.status === 'fulfilled') {
        setActivities(actRes.value.activity || []);
      }
    } catch (err) {
      console.error('Failed to load activity / approvals data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPending = v1Approvals.length + pendingActions.length;

  const filteredActivities = activities.filter((a) => {
    const desc = a.summary || a.description || (a as any).event_type || '';
    const type = a.action_type || (a as any).event_type || '';
    return (
      desc.toLowerCase().includes(filterQuery.toLowerCase()) ||
      type.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Governance & Oversight
            </span>
            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
            <span className="text-xs text-os-secondary">{totalPending} pending review</span>
          </div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight mt-1">
            Activity, Approvals & Evidence
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Real-time human-in-the-loop safety gating, execution audit logs, and cryptographic verification receipts
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={fetchData}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Log
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-os-border select-none">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'approvals'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          <span>Safety Approvals</span>
          {totalPending > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
              {totalPending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${
            activeTab === 'audit'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-os-secondary hover:text-os-primary'
          }`}
        >
          <span>Evidence & Audit Trail</span>
          <span className="text-os-muted text-[10px] font-mono">({activities.length})</span>
        </button>
      </div>

      {/* Tab 1: Safety Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {/* Safety Summary Banner */}
          <GlassCard className="p-4 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-semibold text-os-primary">Safe Execution Boundary Active</h4>
                <p className="text-os-secondary leading-relaxed">
                  Every external write operation (sending emails, modifying calendar events, deleting files, running terminal processes)
                  is intercepted by the <code>SafeExecutor</code>. The exact arguments are hashed with SHA-256; parameter tampering or replay
                  between approval and execution results in an immediate abort.
                </p>
              </div>
            </div>
          </GlassCard>

          {totalPending === 0 ? (
            <GlassCard className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-os-primary">Queue Clear</h3>
              <p className="text-xs text-os-secondary max-w-sm mx-auto">
                No actions currently require manual human approval. Background processes will ask you before touching external endpoints.
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {/* Connector Pending Actions */}
              {pendingActions.map((action) => (
                <ApprovalCard
                  key={action.id}
                  approval={{
                    id: action.id,
                    aid: action.id,
                    connector_id: action.connector_id,
                    connector_name: action.connector_name,
                    action: action.action,
                    params: action.params,
                    status: 'pending',
                  }}
                  onDecided={() => {
                    fetchData();
                    refreshData();
                  }}
                />
              ))}

              {/* V1 Domain Engine Approvals */}
              {v1Approvals.map((app) => (
                <ApprovalCard
                  key={app.approval_id}
                  approval={{
                    id: app.approval_id,
                    action: app.tool_name,
                    risk_level: app.risk_level,
                    params: app.arguments,
                    arguments_hash: app.arguments_hash,
                    status: 'pending',
                  }}
                  onDecided={() => {
                    fetchData();
                    refreshData();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Evidence & Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Search Filter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-glass-md bg-os-surface/80 border border-os-border text-xs max-w-md">
            <Search className="w-4 h-4 text-os-muted" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter audit trail by action or keyword..."
              className="w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"
            />
          </div>

          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <GlassCard className="p-12 text-center text-xs text-os-muted">
                No activity records matching your query.
              </GlassCard>
            ) : (
              filteredActivities.map((item) => {
                const isExpanded = expandedId === item.id;
                const evidenceObj = item.evidence_receipt || (item as any).metadata;
                const hasEvidence = !!evidenceObj && Object.keys(evidenceObj).length > 0;
                const summaryText = item.summary || item.description || (item as any).event_type || 'Activity logged';
                const typeText = (item as any).event_type || item.action_type || 'Event';
                const timeText = item.timestamp || (item as any).created_at
                  ? new Date(item.timestamp || (item as any).created_at).toLocaleString()
                  : 'Recent';

                return (
                  <GlassCard
                    key={item.id}
                    className="p-4 space-y-2 transition-all hover:border-os-border-glass"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-semibold text-os-primary">
                            {summaryText}
                          </div>
                          <div className="text-[10px] font-mono text-os-muted flex items-center gap-2 mt-0.5">
                            <span>{typeText.toUpperCase()}</span>
                            <span>·</span>
                            <span>{timeText}</span>
                            {(item as any).risk_level && (
                              <>
                                <span>·</span>
                                <span className="text-amber-400 font-bold">{(item as any).risk_level} RISK</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasEvidence && (
                          <Badge variant="cyan" size="sm">
                            VERIFIED PROOF
                          </Badge>
                        )}
                        {hasEvidence && (
                          <button className="text-os-muted hover:text-os-primary p-1">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Verification Proof */}
                    {isExpanded && hasEvidence && (
                      <div className="mt-3 pt-3 border-t border-os-border/40 space-y-2 text-xs">
                        <div className="font-mono text-[10px] uppercase text-emerald-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>External Read-Back Evidence</span>
                        </div>
                        <div className="p-3 rounded-glass-sm bg-black/40 border border-white/5 font-mono text-[11px] text-os-secondary overflow-x-auto">
                          <pre>{JSON.stringify(evidenceObj, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
