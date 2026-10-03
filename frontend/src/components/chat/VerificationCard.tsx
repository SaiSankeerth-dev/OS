import React from 'react';
import { CheckCircle2, ShieldCheck, ExternalLink, Hash } from 'lucide-react';
import { Badge } from '../common/Badge';

interface VerificationCardProps {
  execution: {
    tool: string;
    result?: any;
    verified: boolean;
    evidence?: any;
    receipt?: any;
  };
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ execution }) => {
  return (
    <div className="rounded-glass-md border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm p-3.5 my-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">
            Real-World Verification
          </span>
        </div>
        <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
          VERIFIED
        </Badge>
      </div>

      <div className="pt-2 text-xs space-y-1.5 font-mono">
        <div className="text-os-secondary">
          Target Operation: <span className="text-os-primary font-medium">{execution.tool}</span>
        </div>

        {/* Verification Checkpoints */}
        <div className="space-y-1 pt-1 text-[11px] text-emerald-300/90">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Action completed via connector safe pipeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>External read-back verification confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Receipt stored in World Model evidence ledger</span>
          </div>
        </div>

        {execution.receipt && (
          <div className="mt-2 p-2 rounded bg-black/30 border border-white/5 text-[10px] text-os-muted overflow-x-auto max-h-28">
            <pre>{JSON.stringify(execution.receipt, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
