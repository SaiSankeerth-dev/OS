import React, { useState, useEffect } from 'react';
import {
  Brain,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  Calendar,
  Lock,
} from 'lucide-react';
import { api } from '../../services/api';
import { MemoryItem } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const MemoryView: React.FC = () => {
  const { addNotification } = useApp();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMemory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMemory();
      setMemories(res.memories || []);
    } catch (err) {
      console.error('Failed to load memory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  const handleForget = async (key: string) => {
    try {
      await api.forgetMemory(key);
      addNotification({
        type: 'info',
        title: 'Memory Cleared',
        message: `OS has forgotten: "${key}"`,
      });
      fetchMemory();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  const filtered = memories.filter((m) => {
    const k = (m.key || '').toLowerCase();
    const v = (typeof m.value === 'string' ? m.value : JSON.stringify(m.value || '')).toLowerCase();
    const t = (m.type || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return k.includes(q) || v.includes(q) || t.includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div>
          <h1 className="text-2xl font-bold text-os-primary tracking-tight">
            OS Memory & Knowledge
          </h1>
          <p className="text-xs text-os-secondary mt-0.5">
            What OS knows about your preferences, projects, context, and working style
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={fetchMemory}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md">
        <Search className="w-4 h-4 text-os-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search what OS remembers..."
          className="w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"
        />
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-os-muted">
            No memories match your query. OS learns preferences naturally as you converse and assign tasks.
          </div>
        ) : (
          filtered.map((item) => (
            <GlassCard key={item.key} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">
                    {item.type.toUpperCase()}
                  </Badge>
                  <h4 className="text-xs font-bold text-os-primary font-mono">{item.key}</h4>
                </div>

                <button
                  onClick={() => handleForget(item.key)}
                  className="text-os-muted hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors"
                  title="Forget this memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-os-secondary leading-relaxed bg-black/20 p-2.5 rounded-glass-sm border border-white/5">
                {item.value}
              </p>

              <div className="text-[10px] font-mono text-os-muted flex items-center gap-1 pt-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {item.updated_at || 'Recently'}</span>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
