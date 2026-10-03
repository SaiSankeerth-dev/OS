import React, { useState, useEffect } from 'react';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  Database,
} from 'lucide-react';
import { api } from '../../services/api';
import { ActivityItem } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ActivityView: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const fetchActivity = async () => {
    setIsLoading(true);
    try {
      const res = await api.getActivity(100);
      setActivities(res.activity || []);
    } catch (err) {
      console.error('Failed to load activity log:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const filtered = activities.filter(
    (a) =>
      a.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.action_type.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            Evidence & Audit Trail
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            Immutable log of system decisions, execution receipts, and external read-back verifications
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={fetchActivity}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* Filter search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md">
        <Search className="w-4 h-4 text-os-muted" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter activity by action or keyword..."
          className="w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"
        />
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <GlassCard className="p-12 text-center text-xs text-os-muted">
            No activity records matching your query.
          </GlassCard>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const hasEvidence = !!item.evidence_receipt;

            return (
              <GlassCard key={item.id} className="p-4 transition-all">
                <div
                  onClick={() => hasEvidence && setExpandedId(isExpanded ? null : item.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    hasEvidence ? 'cursor-pointer select-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-os-primary">
                        {item.description}
                      </div>
                      <div className="text-[10px] font-mono text-os-muted">
                        Type: {item.action_type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-os-muted">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleTimeString()
                        : 'Recorded'}
                    </span>
                    <Badge variant="emerald" size="sm">
                      {item.status || 'VERIFIED'}
                    </Badge>
                    {hasEvidence && (
                      <button className="text-os-muted hover:text-os-primary">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Evidence Receipt Drawer */}
                {isExpanded && item.evidence_receipt && (
                  <div className="mt-3 pt-3 border-t border-os-border/50 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] mb-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>World Model Evidence Receipt</span>
                    </div>
                    <pre className="p-2.5 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary max-h-40">
                      {JSON.stringify(item.evidence_receipt, null, 2)}
                    </pre>
                  </div>
                )}
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};
