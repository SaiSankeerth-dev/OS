import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Play,
  Layers,
  Terminal,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Star,
  GitFork,
  Settings,
  X,
  FileText,
  ChevronRight,
  ShieldAlert,
  BarChart2,
  Mail,
  Folder,
  Check,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface Candidate {
  repo_id: string;
  url: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  license_key: string;
  status: string;
  score?: {
    total_score: number;
    breakdown: {
      relevance: number;
      momentum: number;
      quality: number;
      integration: number;
      maintenance: number;
      license_security: number;
      missing_evidence_penalty: number;
    };
    is_disqualified: boolean;
    disqualification_reason?: string;
    tier: string;
  };
  trajectory?: {
    stars_gained_1h: number;
    stars_gained_24h: number;
    growth_acceleration: number;
    fork_growth_24h: number;
    momentum_signal: string;
    confidence: number;
  };
  research?: {
    executive_summary: string;
    why_it_matters_now: string;
    technical_capabilities: string[];
    architecture_relevance: string;
    engineering_quality: Record<string, any>;
    limitations: string[];
    os_gap_addressed: string;
    recommended_action: string;
    confidence_score: number;
    independent_review: {
      review_status: string;
      verified_evidence: string[];
      claims_challenged: string[];
    };
  };
}

export const DiscoveryView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [mainTab, setMainTab] = useState<'skills' | 'github'>('skills');
  const [skillCategory, setSkillCategory] = useState<string>('All');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [installedSkills, setInstalledSkills] = useState<Record<string, boolean>>({
    'web-research': true,
    'data-analysis': true,
    'report-gen': true,
    'email-assistant': true,
    'code-helper': true,
    'file-ops': true,
  });

  const skillsList = [
    {
      id: 'web-research',
      title: 'Web Research',
      category: 'Research',
      icon: Sparkles,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      badgeClass: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
      description: 'Deep search the web, synthesize findings, extract tables, and cite verified sources.',
      prompt: 'Perform in-depth web research and comparative analysis on ',
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      category: 'Data',
      icon: BarChart2,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      badgeClass: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
      description: 'Analyze CSV, JSON, and tabular datasets, generate statistical summaries, and produce visual charts.',
      prompt: 'Analyze this dataset, calculate summary statistics, and generate key insights: ',
    },
    {
      id: 'report-gen',
      title: 'Report Generation',
      category: 'Writing',
      icon: FileText,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      badgeClass: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      description: 'Synthesize multi-source documents, meeting notes, and research into polished Markdown and PDF reports.',
      prompt: 'Generate an executive summary and detailed strategic report on ',
    },
    {
      id: 'email-assistant',
      title: 'Email Assistant',
      category: 'Automation',
      icon: Mail,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      badgeClass: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      description: 'Draft, triage, and review emails with human approval gating via Gmail and Outlook adapters.',
      prompt: 'Review unread high-priority emails, summarize urgent action items, and draft replies.',
    },
    {
      id: 'code-helper',
      title: 'Code Helper',
      category: 'Development',
      icon: Code2,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      badgeClass: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
      description: 'Explain, refactor, write tests, and inspect codebases within the OpenCode sandbox workspace.',
      prompt: 'Review code in this workspace, write comprehensive tests, and explain the architecture.',
    },
    {
      id: 'file-ops',
      title: 'File Operations',
      category: 'Automation',
      icon: Folder,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      badgeClass: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
      description: 'Organize, convert, extract archives, and manage workspace files safely within /workspace.',
      prompt: 'Inspect files in /workspace, summarize the directory tree, and clean temporary files.',
    },
  ];

  const handleRunSkill = (skill: typeof skillsList[0]) => {
    try {
      sessionStorage.setItem('os-pending-query', skill.prompt);
    } catch (_) {}
    setCurrentView('chat');
  };

  const toggleInstallSkill = (id: string) => {
    setInstalledSkills((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSkills = skillsList.filter((s) => {
    const matchesCategory = skillCategory === 'All' || s.category === skillCategory;
    const matchesSearch =
      !skillSearch ||
      s.title.toLowerCase().includes(skillSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(skillSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'high_priority' | 'qualified' | 'evaluated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<Record<string, string>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/discovery/feed?limit=60');
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (err) {
      console.error('Failed to load discovery feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/discovery/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    fetchFeed();
    fetchSettings();
  }, []);

  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/discovery/scan', { method: 'POST' });
      if (res.ok) {
        await fetchFeed();
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRunResearch = async (c: Candidate) => {
    setActionInProgress((prev) => ({ ...prev, [c.repo_id]: 'research' }));
    try {
      const res = await fetch(`/api/discovery/repos/${c.owner}/${c.name}/research`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.candidate) {
          setCandidates((prev) => prev.map((item) => (item.repo_id === c.repo_id ? data.candidate : item)));
          if (selectedCandidate?.repo_id === c.repo_id) {
            setSelectedCandidate(data.candidate);
          }
        }
      }
    } catch (err) {
      console.error('Research error:', err);
    } finally {
      setActionInProgress((prev) => {
        const next = { ...prev };
        delete next[c.repo_id];
        return next;
      });
    }
  };

  const handleRunEvaluation = async (c: Candidate) => {
    setActionInProgress((prev) => ({ ...prev, [c.repo_id]: 'eval' }));
    try {
      const res = await fetch(`/api/discovery/repos/${c.owner}/${c.name}/evaluate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.candidate) {
          setCandidates((prev) => prev.map((item) => (item.repo_id === c.repo_id ? data.candidate : item)));
          if (selectedCandidate?.repo_id === c.repo_id) {
            setSelectedCandidate(data.candidate);
          }
        }
      }
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setActionInProgress((prev) => {
        const next = { ...prev };
        delete next[c.repo_id];
        return next;
      });
    }
  };

  const handleDismiss = async (c: Candidate) => {
    try {
      await fetch(`/api/discovery/repos/${c.owner}/${c.name}/dismiss`, { method: 'POST' });
      setCandidates((prev) => prev.filter((item) => item.repo_id !== c.repo_id));
      if (selectedCandidate?.repo_id === c.repo_id) {
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      console.error('Dismiss error:', err);
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.language || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeTab === 'high_priority') {
      return (c.score?.total_score || 0) >= 80;
    }
    if (activeTab === 'qualified') {
      return c.status === 'QUALIFIED' || c.status === 'RECOMMENDED';
    }
    if (activeTab === 'evaluated') {
      return c.status === 'EVALUATED' || c.status === 'TESTING';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Segmented Mode Selector: Skills & Templates vs Repository Discovery */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50">
        <div className="inline-flex items-center p-1 rounded-xl bg-os-surface border border-os-border shadow-inner gap-1">
          <button
            onClick={() => setMainTab('skills')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mainTab === 'skills'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skills & Templates</span>
          </button>
          <button
            onClick={() => setMainTab('github')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mainTab === 'github'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>GitHub Intelligence ({candidates.length})</span>
          </button>
        </div>

        {mainTab === 'github' && (
          <div className="flex items-center gap-2.5">
            <Button
              variant="glass"
              size="sm"
              onClick={handleScanNow}
              isLoading={isScanning}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Scan GitHub
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              leftIcon={<Settings className="w-3.5 h-3.5" />}
            >
              Settings
            </Button>
          </div>
        )}
      </div>

      {mainTab === 'skills' ? (
        /* Panel 3: Skills & Templates Catalog */
        <div className="space-y-6">
          {/* Top Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-os-primary tracking-tight">
                Skills & Agent Templates
              </h1>
              <p className="text-xs text-os-secondary mt-0.5">
                Extend OS with specialized capabilities, automated tools, and domain skills
              </p>
            </div>

            <div className="flex items-center gap-2 bg-os-surface px-3.5 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 w-full sm:w-80 shadow-sm transition-all">
              <Search className="w-4 h-4 text-os-muted flex-shrink-0" />
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search skills, tools, and integrations..."
                className="w-full bg-transparent text-xs text-os-primary placeholder-os-muted focus:outline-none"
              />
              {skillSearch && (
                <button onClick={() => setSkillSearch('')} className="text-os-muted hover:text-os-primary">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 7 Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Research', 'Development', 'Automation', 'Writing', 'Data', 'Integrations'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSkillCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  skillCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-os-surface hover:bg-os-surface-active text-os-secondary hover:text-os-primary border border-os-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 6 Skill Cards Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;
              const isInstalled = installedSkills[skill.id];

              return (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-os-surface border border-os-border hover:border-blue-500/30 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category Pill + Icon */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${skill.badgeClass}`}>
                        {skill.category}
                      </span>
                      <div className={`p-2.5 rounded-xl border ${skill.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-os-primary group-hover:text-blue-500 transition-colors">
                        {skill.title}
                      </h3>
                      <p className="text-xs text-os-secondary mt-1.5 leading-relaxed line-clamp-3">
                        {skill.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row Actions: [Add/Installed] & [Run] */}
                  <div className="flex items-center justify-between pt-2 border-t border-os-border/40">
                    <button
                      onClick={() => toggleInstallSkill(skill.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isInstalled
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-os-secondary border border-os-border'
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRunSkill(skill)}
                      leftIcon={<Play className="w-3 h-3 fill-current" />}
                    >
                      Run Skill
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GitHub Repository Intelligence Subview */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-os-border/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-500 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Open-Source Intelligence
                </span>
                <span className="h-1 w-1 rounded-full bg-cyan-400"></span>
                <span className="text-xs text-os-secondary">Early-Signal Detection & Virtual Lab</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-os-primary tracking-tight mt-1">
                Proactive Repository Discovery
              </h1>
              <p className="text-xs md:text-sm text-os-secondary mt-0.5 max-w-2xl">
                Detects high-momentum AI tools, MCP servers, and agent skills before they peak. Evaluates real engineering quality and tests candidates in isolated virtual labs.
              </p>
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-os-surface/60 p-1 rounded-glass-md border border-os-border/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-os-surface-active text-os-primary shadow-sm'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            All Discoveries ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('high_priority')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-all ${
              activeTab === 'high_priority'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            High Priority (80+)
          </button>
          <button
            onClick={() => setActiveTab('qualified')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-all ${
              activeTab === 'qualified'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            Qualified
          </button>
          <button
            onClick={() => setActiveTab('evaluated')}
            className={`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-all ${
              activeTab === 'evaluated'
                ? 'bg-os-surface-active text-os-primary shadow-sm'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            Virtual Lab Tested
          </button>
        </div>

        <div className="flex items-center gap-2 bg-os-surface/70 px-3 py-1.5 rounded-glass-md border border-os-border/50 w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-os-muted flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discovered repos..."
            className="w-full bg-transparent text-xs text-os-primary placeholder-os-muted focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Discovery Feed Grid */}
      {filteredCandidates.length === 0 ? (
        <GlassCard className="py-16 text-center text-os-secondary">
          <Compass className="w-10 h-10 text-os-muted mx-auto mb-3 stroke-[1.2]" />
          <div className="text-sm font-semibold text-os-primary">No candidate repositories found</div>
          <div className="text-xs text-os-muted mt-1 max-w-sm mx-auto">
            Click "Scan GitHub" to discover active repositories matching configured AI agent and tooling topics.
          </div>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={handleScanNow} isLoading={isScanning}>
              Start Discovery Scan
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((c) => {
            const scoreTotal = c.score?.total_score || 0;
            const isHighPriority = scoreTotal >= 80;
            const isWorthwhile = scoreTotal >= 65 && scoreTotal < 80;
            const isBlocked = c.score?.is_disqualified;

            return (
              <GlassCard
                key={c.repo_id}
                className={`p-4 flex flex-col justify-between space-y-3.5 transition-all hover:border-os-border-glass ${
                  isHighPriority ? 'border-emerald-500/30' : isBlocked ? 'border-rose-500/30 opacity-75' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Badges & Score */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-os-surface-active text-os-secondary border border-os-border">
                        {c.language || 'Code'}
                      </span>
                      {isBlocked ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          BLOCKED
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            c.status === 'EVALUATED'
                              ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                              : c.status === 'QUALIFIED'
                              ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                              : 'bg-os-surface text-os-muted border border-os-border'
                          }`}
                        >
                          {c.status}
                        </span>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-sm font-extrabold font-mono ${
                          isBlocked
                            ? 'text-rose-500'
                            : isHighPriority
                            ? 'text-emerald-500 dark:text-emerald-400'
                            : isWorthwhile
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-os-secondary'
                        }`}
                      >
                        {isBlocked ? '0' : scoreTotal.toFixed(0)}
                        <span className="text-[10px] font-normal text-os-muted">/100</span>
                      </div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-os-muted">
                        {c.score?.tier?.replace('_', ' ') || 'Score'}
                      </div>
                    </div>
                  </div>

                  {/* Title & Link */}
                  <div className="mt-2">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-os-primary hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="truncate">{c.repo_id}</span>
                      <ExternalLink className="w-3 h-3 text-os-muted group-hover:text-cyan-400 flex-shrink-0" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-os-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {c.description || 'No description provided.'}
                  </p>

                  {/* Trajectory / Why It Matters Callout */}
                  {c.research?.why_it_matters_now ? (
                    <div className="mt-2.5 p-2 rounded-glass-sm bg-os-surface/60 border border-os-border/40 text-[11px] text-os-secondary">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">Why now: </span>
                      <span className="line-clamp-2">{c.research.why_it_matters_now}</span>
                    </div>
                  ) : c.trajectory?.momentum_signal ? (
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-os-muted">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="capitalize">{c.trajectory.momentum_signal}</span>
                      {c.trajectory.stars_gained_24h > 0 && (
                        <span>(+{c.trajectory.stars_gained_24h.toFixed(0)}/day)</span>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-os-border/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-os-muted font-mono">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" /> {c.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-os-muted" /> {c.forks}
                    </span>
                    <span className="truncate max-w-[90px]">{c.license_key}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <Button
                      size="sm"
                      variant={isHighPriority ? 'primary' : 'glass'}
                      onClick={() => handleRunResearch(c)}
                      isLoading={actionInProgress[c.repo_id] === 'research'}
                      className="flex-1 text-xs"
                      title="Run verified 7-step research workflow"
                    >
                      <FileText className="w-3 h-3 mr-1" /> Research
                    </Button>
                    <Button
                      size="sm"
                      variant="glass"
                      onClick={() => handleRunEvaluation(c)}
                      isLoading={actionInProgress[c.repo_id] === 'eval'}
                      className="text-xs"
                      title="Test in isolated virtual computer lab"
                    >
                      <Terminal className="w-3 h-3 mr-1" /> Lab
                    </Button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(c);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-1.5 rounded-glass-sm hover:bg-os-surface text-os-muted hover:text-os-primary transition-colors border border-os-border"
                      title="Inspect full research report & evidence"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDismiss(c)}
                      className="p-1.5 rounded-glass-sm hover:bg-os-surface text-os-muted hover:text-rose-400 transition-colors border border-os-border"
                      title="Dismiss from feed"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
        </div>
      )}

      {/* Detail & Evidence Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Research Report: ${selectedCandidate.repo_id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header / Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-glass-md bg-os-surface border border-os-border">
              <div>
                <div className="text-base font-bold text-os-primary flex items-center gap-2">
                  <span>{selectedCandidate.name}</span>
                  <a
                    href={selectedCandidate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-500 hover:text-cyan-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="text-xs text-os-secondary mt-0.5">
                  {selectedCandidate.owner} • {selectedCandidate.stars} stars • {selectedCandidate.forks} forks • License: {selectedCandidate.license_key}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold font-mono text-emerald-500 dark:text-emerald-400">
                  {selectedCandidate.score?.total_score.toFixed(0) || 0}/100
                </div>
                <div className="text-[10px] font-mono uppercase text-os-muted">
                  {selectedCandidate.score?.tier?.replace('_', ' ') || 'Evaluation Score'}
                </div>
              </div>
            </div>

            {/* Score Breakdown Radar */}
            {selectedCandidate.score && (
              <div className="p-3.5 rounded-glass-md bg-os-surface/60 border border-os-border space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-os-muted">
                  Score Dimensions (Max 100)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2 rounded bg-os-surface border border-os-border">
                    <span className="text-os-muted text-[10px]">Relevance (25):</span>
                    <div className="text-os-primary font-bold">{selectedCandidate.score.breakdown.relevance.toFixed(1)}</div>
                  </div>
                  <div className="p-2 rounded bg-os-surface border border-os-border">
                    <span className="text-os-muted text-[10px]">Momentum (20):</span>
                    <div className="text-os-primary font-bold">{selectedCandidate.score.breakdown.momentum.toFixed(1)}</div>
                  </div>
                  <div className="p-2 rounded bg-os-surface border border-os-border">
                    <span className="text-os-muted text-[10px]">Quality (20):</span>
                    <div className="text-os-primary font-bold">{selectedCandidate.score.breakdown.quality.toFixed(1)}</div>
                  </div>
                  <div className="p-2 rounded bg-os-surface border border-os-border">
                    <span className="text-os-muted text-[10px]">Integration (15):</span>
                    <div className="text-os-primary font-bold">{selectedCandidate.score.breakdown.integration.toFixed(1)}</div>
                  </div>
                  <div className="p-2 rounded bg-os-surface border border-os-border">
                    <span className="text-os-muted text-[10px]">Maintenance (10):</span>
                    <div className="text-os-primary font-bold">{selectedCandidate.score.breakdown.maintenance.toFixed(1)}</div>
                  </div>
                  <div className="p-2 rounded bg-os-surface border border-os-border">
                    <span className="text-os-muted text-[10px]">License/Sec (10):</span>
                    <div className="text-os-primary font-bold">{selectedCandidate.score.breakdown.license_security.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Research Report Content */}
            {selectedCandidate.research ? (
              <div className="space-y-3">
                <div className="p-3 rounded-glass-md bg-os-surface border border-os-border space-y-1.5">
                  <span className="text-xs font-mono uppercase text-os-muted">Executive Summary</span>
                  <p className="text-xs text-os-primary leading-relaxed">
                    {selectedCandidate.research.executive_summary}
                  </p>
                </div>

                <div className="p-3 rounded-glass-md bg-os-surface border border-os-border space-y-1.5">
                  <span className="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400">
                    Why It Matters & Architecture Relevance
                  </span>
                  <p className="text-xs text-os-secondary leading-relaxed">
                    {selectedCandidate.research.why_it_matters_now}
                  </p>
                  <p className="text-xs text-os-primary font-medium mt-1">
                    {selectedCandidate.research.architecture_relevance}
                  </p>
                </div>

                {/* Independent Verification Step G Findings */}
                {selectedCandidate.research.independent_review && (
                  <div className="p-3 rounded-glass-md bg-os-surface border border-os-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-os-muted">
                        Independent Review & Verification
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {selectedCandidate.research.independent_review.review_status}
                      </span>
                    </div>

                    {selectedCandidate.research.independent_review.verified_evidence.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Verified Facts:</span>
                        {selectedCandidate.research.independent_review.verified_evidence.map((v, i) => (
                          <div key={i} className="text-xs text-os-secondary flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCandidate.research.independent_review.claims_challenged.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-os-border/40">
                        <span className="text-[11px] font-semibold text-amber-500 dark:text-amber-400">Claims Challenged / Caveats:</span>
                        {selectedCandidate.research.independent_review.claims_challenged.map((c, i) => (
                          <div key={i} className="text-xs text-os-secondary flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-os-muted bg-os-surface rounded-glass-md border border-os-border">
                Deep research has not been run on this repository yet.
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleRunResearch(selectedCandidate)}
                    isLoading={actionInProgress[selectedCandidate.repo_id] === 'research'}
                  >
                    Run 7-Step Verified Research
                  </Button>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-os-border flex items-center justify-between">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDismiss(selectedCandidate)}
              >
                Dismiss Candidate
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => handleRunEvaluation(selectedCandidate)}
                  isLoading={actionInProgress[selectedCandidate.repo_id] === 'eval'}
                >
                  <Terminal className="w-3.5 h-3.5 mr-1" /> Run in Virtual Lab
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Discovery Settings Modal */}
      <Modal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Proactive Intelligence Settings"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-os-secondary">
            Configure automated GitHub background loop topics, scoring thresholds, and quiet hours.
          </p>

          <div className="space-y-2">
            <span className="font-semibold text-os-primary">Monitored Topics:</span>
            <div className="p-2.5 rounded bg-os-surface border border-os-border font-mono text-[11px] text-os-secondary">
              {(settings?.topics || []).join(', ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="font-semibold text-os-primary">High-Priority Threshold:</span>
              <div className="p-2 rounded bg-os-surface border border-os-border font-mono text-os-primary">
                {settings?.min_high_priority_score || 80} / 100
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-os-primary">Worthwhile Threshold:</span>
              <div className="p-2 rounded bg-os-surface border border-os-border font-mono text-os-primary">
                {settings?.min_worthwhile_score || 65} / 100
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-os-surface border border-os-border text-os-secondary text-[11px] leading-relaxed">
            Quiet hours active between <span className="font-mono text-os-primary">{settings?.quiet_hours_start || 23}:00</span> and <span className="font-mono text-os-primary">{settings?.quiet_hours_end || 7}:00</span>. During quiet hours, proactive notifications are held in queue.
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setSettingsOpen(false)}>
              Close Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
