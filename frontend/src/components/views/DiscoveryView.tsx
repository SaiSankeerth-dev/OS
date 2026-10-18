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
  Upload,
  Trash2,
  Cpu,
  Globe,
  Brain,
  Palette,
  Monitor,
  Copy,
  CheckCheck,
  Loader2,
  GitBranch,
  History,
  ToggleLeft,
  ToggleRight,
  FolderArchive,
  Package,
  ListTree,
  FileCode,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api, getModelType, getModelTypeBadgeClass } from '../../services/api';
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

export interface SkillItem {
  id: string;
  name?: string;
  title: string;
  description: string;
  category: string;
  version?: string;
  status?: string;
  enabled?: boolean;
  review_status?: string;
  source?: 'builtin' | 'github' | 'file' | 'zip' | 'local_dir';
  repo_url?: string;
  tools?: string[];
  prompt?: string;
  has_tools?: boolean;
  has_scripts?: boolean;
  capabilities?: string[];
  content_hash?: string;
  color?: string;
  badge_class?: string;
  icon?: string;
  can_delete?: boolean;
  imported_at?: string;
  container_path?: string;
}

const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: 'websearch_skill',
    name: 'websearch_skill',
    title: 'Web Research',
    category: 'Research',
    icon: 'Sparkles',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    badge_class: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    description: 'Deep search the live internet via DuckDuckGo, extract structured tables, and cite verified sources.',
    prompt: 'Deep search the web and synthesize latest findings on ',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'calc_skill',
    name: 'calc_skill',
    title: 'Safe Math & Arithmetic',
    category: 'Data',
    icon: 'BarChart2',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    badge_class: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
    description: 'Sandboxed arithmetic computation engine using Python AST parsing. Instant, zero cloud leaks.',
    prompt: 'calculate (1024 * 768) / 16 + 250',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'datetime_skill',
    name: 'datetime_skill',
    title: 'System Clock & Datetime',
    category: 'Automation',
    icon: 'Clock',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    badge_class: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    description: 'Reads host clock, ISO-8601 formatting, timezone offset, and local timestamps.',
    prompt: 'Get the current system datetime, day of week, and UTC offset.',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'system_skill',
    name: 'system_skill',
    title: 'System Diagnostics & Hardware',
    category: 'Automation',
    icon: 'Cpu',
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    badge_class: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
    description: 'Inspects CPU load, memory utilization, disk volumes, and kernel posture with zero external overhead.',
    prompt: 'Run system diagnostics: inspect CPU usage, RAM, available disk space, and platform architecture.',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'webread_skill',
    name: 'webread_skill',
    title: 'Verified Web Reader',
    category: 'Research',
    icon: 'Globe',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    badge_class: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    description: 'Reads web pages via HTTP, extracts clean readable markdown text, and strips trackers.',
    prompt: 'Read and extract key takeaways from https://news.ycombinator.com',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'linkedin_skill',
    name: 'linkedin_skill',
    title: 'LinkedIn Intelligence',
    category: 'Integrations',
    icon: 'ExternalLink',
    color: 'text-blue-600 bg-blue-600/10 border-blue-600/20',
    badge_class: 'bg-blue-600/15 text-blue-600 border-blue-600/30',
    description: 'Drafts professional social posts and executive updates with human approval gating.',
    prompt: 'Draft an engineering update announcing our personal AI operating system.',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'memory_skill',
    name: 'memory_skill',
    title: 'Memory & Context Recall',
    category: 'Core',
    icon: 'Brain',
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    badge_class: 'bg-violet-500/15 text-violet-500 border-violet-500/30',
    description: 'Stores and retrieves user preferences, key project facts, and persistent long-term memories.',
    prompt: 'What are my current active projects and key preferences?',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'ui_ux_pro_max_skill',
    name: 'ui_ux_pro_max_skill',
    title: 'UI/UX Design Craft',
    category: 'Development',
    icon: 'Palette',
    color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    badge_class: 'bg-pink-500/15 text-pink-500 border-pink-500/30',
    description: 'Design tokens, Apple HIG, responsive typography scales, color harmony, and anti-AI-slop design craft.',
    prompt: 'Provide expert design specifications and Tailwind classes for a modern Cyber-HUD dashboard.',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'file_skill',
    name: 'file_skill',
    title: 'Workspace File Operations',
    category: 'Automation',
    icon: 'Folder',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    badge_class: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
    description: 'Safely manages, inspects, and organizes files within the user workspace.',
    prompt: 'List files in the workspace and inspect directory layout.',
    source: 'builtin',
    status: 'active',
  },
  {
    id: 'browser_skill',
    name: 'browser_skill',
    title: 'Virtual Computer Browser',
    category: 'Automation',
    icon: 'Monitor',
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    badge_class: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
    description: 'Automates isolated desktop applications and Chromium browsing inside Docker virtual container.',
    prompt: 'Take a screenshot of the virtual desktop and inspect active windows.',
    source: 'builtin',
    status: 'active',
  },
];

const renderSkillIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Cpu':
      return <Cpu className="w-5 h-5" />;
    case 'Clock':
      return <Clock className="w-5 h-5" />;
    case 'BarChart2':
      return <BarChart2 className="w-5 h-5" />;
    case 'Folder':
      return <Folder className="w-5 h-5" />;
    case 'Palette':
      return <Palette className="w-5 h-5" />;
    case 'Monitor':
      return <Monitor className="w-5 h-5" />;
    case 'Brain':
      return <Brain className="w-5 h-5" />;
    case 'Globe':
      return <Globe className="w-5 h-5" />;
    case 'Code2':
      return <Code2 className="w-5 h-5" />;
    case 'FileText':
      return <FileText className="w-5 h-5" />;
    case 'Mail':
      return <Mail className="w-5 h-5" />;
    case 'GitBranch':
      return <GitBranch className="w-5 h-5" />;
    case 'ExternalLink':
      return <ExternalLink className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

export const DiscoveryView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [mainTab, setMainTab] = useState<'skills' | 'runs' | 'github'>('skills');
  const [skillCategory, setSkillCategory] = useState<string>('All');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [installedSkills, setInstalledSkills] = useState<Record<string, boolean>>({});

  // Dynamic Skills State
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);
  const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(false);

  // Skill Details Inspector Modal State
  const [skillDetailsModalOpen, setSkillDetailsModalOpen] = useState(false);
  const [selectedSkillDetails, setSelectedSkillDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'contract' | 'files' | 'security'>('contract');

  // Skill Execution Runs History State
  const [skillRuns, setSkillRuns] = useState<any[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(false);

  // Import Skill Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<'github' | 'zip' | 'file' | 'local_dir'>('github');
  const [importGithubUrl, setImportGithubUrl] = useState('');
  const [importCustomName, setImportCustomName] = useState('');
  const [importCategory, setImportCategory] = useState('Integrations');
  const [importFileType, setImportFileType] = useState<'md' | 'py'>('md');
  const [importFileName, setImportFileName] = useState('');
  const [importFileContent, setImportFileContent] = useState('');
  const [importDescription, setImportDescription] = useState('');
  const [importPrompt, setImportPrompt] = useState('');
  const [importZipFile, setImportZipFile] = useState<File | null>(null);
  const [importZipBase64, setImportZipBase64] = useState<string>('');
  const [importLocalPath, setImportLocalPath] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Run Skill Modal State
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [selectedSkillToRun, setSelectedSkillToRun] = useState<SkillItem | null>(null);
  const [runInput, setRunInput] = useState('');
  const [runModel, setRunModel] = useState<string>('');
  const [isRunningSkill, setIsRunningSkill] = useState(false);
  const [skillRunResult, setSkillRunResult] = useState<{
    ok: boolean;
    output: string;
    latency_ms?: number;
    model_used?: string;
    execution_mode?: string;
    sandbox_mode?: string;
    container_path?: string;
    status?: string;
    verification?: {
      verified: boolean;
      evidence: string;
      environment: string;
    };
    artifacts?: Array<{ path: string; environment: string }>;
    steps?: Array<{
      step: string;
      target?: string;
      command?: string;
      exit_code?: number;
      duration_ms?: number;
      status: string;
      message?: string;
    }>;
  } | null>(null);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const fetchSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const data = await api.getSkills();
      if (data && Array.isArray(data.skills) && data.skills.length > 0) {
        setSkills(data.skills);
        const installed: Record<string, boolean> = {};
        data.skills.forEach((s) => {
          installed[s.id] = s.enabled !== false;
        });
        setInstalledSkills(installed);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const fetchSkillRuns = async () => {
    setLoadingRuns(true);
    try {
      const res = await api.getSkillRuns();
      setSkillRuns(res.runs || []);
    } catch (err) {
      console.error('Failed to load skill runs:', err);
    } finally {
      setLoadingRuns(false);
    }
  };

  const handleClearRuns = async () => {
    try {
      await api.clearSkillRuns();
      setSkillRuns([]);
    } catch (err) {
      console.error('Failed to clear runs:', err);
    }
  };

  const handleOpenDetails = async (skillId: string) => {
    setLoadingDetails(true);
    setSkillDetailsModalOpen(true);
    setDetailsTab('contract');
    try {
      const res = await api.getSkillDetails(skillId);
      setSelectedSkillDetails(res);
    } catch (err) {
      console.error('Failed to load skill details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleSkill = async (skillId: string, currentEnabled: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.toggleSkill(skillId, !currentEnabled);
      setInstalledSkills((prev) => ({ ...prev, [skillId]: !currentEnabled }));
      setSkills((prev) =>
        prev.map((s) => (s.id === skillId ? { ...s, enabled: !currentEnabled } : s))
      );
    } catch (err) {
      console.error('Failed to toggle skill:', err);
    }
  };

  const handleOpenRunModal = (skill: SkillItem) => {
    setSelectedSkillToRun(skill);
    setRunInput(skill.prompt || `Execute ${skill.title} with standard parameters.`);
    setSkillRunResult(null);
    setCopiedOutput(false);
    setIsRunModalOpen(true);
  };

  const handleExecuteSkill = async () => {
    if (!selectedSkillToRun) return;
    setIsRunningSkill(true);
    setSkillRunResult(null);
    try {
      const res = await api.runSkill(selectedSkillToRun.id, runInput, runModel || undefined);
      setSkillRunResult(res);
      fetchSkillRuns();
    } catch (err: any) {
      setSkillRunResult({
        ok: false,
        output: `Execution error: ${err?.message || 'Failed to communicate with OS Virtual Computer runtime'}`,
        latency_ms: 0,
        model_used: 'error',
        execution_mode: 'failed',
        sandbox_mode: 'docker',
        container_path: `/workspace/skills/${selectedSkillToRun.id}`,
        status: 'ERROR',
        verification: {
          verified: false,
          evidence: err?.message || 'Failed execution probe',
          environment: 'docker',
        },
      });
    } finally {
      setIsRunningSkill(false);
    }
  };

  const handleSendToChat = () => {
    if (skillRunResult?.output) {
      sessionStorage.setItem(
        'os-pending-query',
        `Result from skill [${selectedSkillToRun?.title}]:\n\n${skillRunResult.output}`
      );
    } else {
      sessionStorage.setItem('os-pending-query', runInput);
    }
    setIsRunModalOpen(false);
    setCurrentView('chat');
  };

  const handleCopyOutput = () => {
    if (!skillRunResult?.output) return;
    navigator.clipboard.writeText(skillRunResult.output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleImportFromGithub = async (overrideUrl?: string) => {
    const url = (overrideUrl || importGithubUrl).trim();
    if (!url) {
      setImportFeedback({ type: 'error', message: 'Please provide a valid GitHub repository or SKILL.md URL.' });
      return;
    }
    setIsImporting(true);
    setImportFeedback(null);
    try {
      const res = await api.importSkill({
        source_type: 'github',
        github_url: url,
        name: importCustomName.trim() || undefined,
        category: importCategory,
      });
      if (res.ok) {
        setImportFeedback({
          type: 'success',
          message: res.message || `Skill '${res.skill?.title || 'custom'}' installed into OS successfully!`,
        });
        setImportGithubUrl('');
        setImportCustomName('');
        await fetchSkills();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportFeedback(null);
        }, 1500);
      } else {
        setImportFeedback({ type: 'error', message: res.error || 'Failed to import skill.' });
      }
    } catch (err: any) {
      setImportFeedback({ type: 'error', message: err?.message || 'Error communicating with server.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportZipFile(file);
    if (!importFileName) {
      const base = file.name.replace(/\.zip$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      setImportFileName(base);
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        setImportZipBase64(btoa(binary));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportFromZip = async () => {
    if (!importZipBase64) {
      setImportFeedback({ type: 'error', message: 'Please select a ZIP package.' });
      return;
    }
    setIsImporting(true);
    setImportFeedback(null);
    try {
      const res = await api.importSkill({
        source_type: 'zip',
        name: importFileName.trim() || undefined,
        content: importZipBase64,
        category: importCategory,
      });
      if (res.ok) {
        setImportFeedback({
          type: 'success',
          message: res.message || `Skill package '${res.skill?.title || 'package'}' imported into OS!`,
        });
        setImportZipFile(null);
        setImportZipBase64('');
        await fetchSkills();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportFeedback(null);
        }, 1500);
      } else {
        setImportFeedback({ type: 'error', message: res.error || 'Failed to import ZIP package.' });
      }
    } catch (err: any) {
      setImportFeedback({ type: 'error', message: err?.message || 'Error importing ZIP.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromLocalDir = async () => {
    if (!importLocalPath.trim()) {
      setImportFeedback({ type: 'error', message: 'Please enter a local directory path.' });
      return;
    }
    setIsImporting(true);
    setImportFeedback(null);
    try {
      const res = await api.importSkill({
        source_type: 'local_dir',
        local_path: importLocalPath.trim(),
        name: importFileName.trim() || undefined,
        category: importCategory,
      });
      if (res.ok) {
        setImportFeedback({
          type: 'success',
          message: res.message || 'Local skill registered into OS successfully!',
        });
        setImportLocalPath('');
        await fetchSkills();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportFeedback(null);
        }, 1500);
      } else {
        setImportFeedback({ type: 'error', message: res.error || 'Failed to import local directory.' });
      }
    } catch (err: any) {
      setImportFeedback({ type: 'error', message: err?.message || 'Error registering local skill.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromFile = async () => {
    const name = importFileName.trim();
    const content = importFileContent.trim();
    if (!name) {
      setImportFeedback({ type: 'error', message: 'Please enter a skill name.' });
      return;
    }
    if (!content) {
      setImportFeedback({ type: 'error', message: 'Please enter or upload the skill file content.' });
      return;
    }
    setIsImporting(true);
    setImportFeedback(null);
    try {
      const res = await api.importSkill({
        source_type: 'file',
        name,
        content,
        file_type: importFileType,
        category: importCategory,
        description: importDescription.trim() || undefined,
        prompt: importPrompt.trim() || undefined,
      });
      if (res.ok) {
        setImportFeedback({
          type: 'success',
          message: res.message || `Skill '${res.skill?.title || name}' registered in OS successfully!`,
        });
        setImportFileName('');
        setImportFileContent('');
        setImportDescription('');
        setImportPrompt('');
        await fetchSkills();
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportFeedback(null);
        }, 1500);
      } else {
        setImportFeedback({ type: 'error', message: res.error || 'Failed to install skill file.' });
      }
    } catch (err: any) {
      setImportFeedback({ type: 'error', message: err?.message || 'Error installing skill.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPy = file.name.endsWith('.py');
    setImportFileType(isPy ? 'py' : 'md');
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!importFileName) {
      setImportFileName(baseName);
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportFileContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteSkill = async (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the custom skill '${skillId}'?`)) return;
    try {
      const res = await api.deleteSkill(skillId);
      if (res.ok) {
        await fetchSkills();
      }
    } catch (err: any) {
      alert(`Delete failed: ${err?.message || 'Unknown error'}`);
    }
  };

  const toggleInstallSkill = (id: string) => {
    setInstalledSkills((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = skillCategory === 'All' || s.category.toLowerCase() === skillCategory.toLowerCase();
    const matchesSearch =
      !skillSearch ||
      s.title.toLowerCase().includes(skillSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(skillSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(skillSearch.toLowerCase());
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
    fetchSkills();
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
            <span>Skills Catalog ({skills.length})</span>
          </button>
          <button
            onClick={() => {
              setMainTab('runs');
              fetchSkillRuns();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mainTab === 'runs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-os-secondary hover:text-os-primary'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Execution Runs ({skillRuns.length})</span>
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
          {/* Top Search Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-os-primary tracking-tight">
                Skills & Agent Templates
              </h1>
              <p className="text-xs text-os-secondary mt-0.5">
                Extend OS with specialized capabilities, automated tools, and domain skills
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex items-center gap-2 bg-os-surface px-3.5 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 w-full sm:w-72 shadow-sm transition-all">
                <Search className="w-4 h-4 text-os-muted flex-shrink-0" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Search skills, tools, or integrations..."
                  className="w-full bg-transparent text-xs text-os-primary placeholder-os-muted focus:outline-none"
                />
                {skillSearch && (
                  <button onClick={() => setSkillSearch('')} className="text-os-muted hover:text-os-primary">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setImportFeedback(null);
                    setIsImportModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Import Skill
                </Button>

                <Button
                  variant="glass"
                  size="sm"
                  onClick={fetchSkills}
                  isLoading={isLoadingSkills}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  title="Refresh installed skills"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Research', 'Development', 'Automation', 'Writing', 'Data', 'Integrations', 'Core'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSkillCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  skillCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-os-surface hover:bg-os-surface-active text-os-secondary hover:text-os-primary border border-os-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skill Cards Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const isInstalled = skill.enabled !== false && installedSkills[skill.id] !== false;

              return (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-os-surface border border-os-border hover:border-blue-500/30 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category Pill + Source Badge + Review Pill + Delete + Toggle + Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${skill.badge_class || 'bg-blue-500/15 text-blue-500 border-blue-500/30'}`}>
                          {skill.category}
                        </span>

                        {skill.source === 'github' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                            <GitBranch className="w-2.5 h-2.5" /> GitHub
                          </span>
                        )}

                        {skill.source === 'zip' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <FolderArchive className="w-2.5 h-2.5" /> ZIP
                          </span>
                        )}

                        {skill.source === 'file' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Upload className="w-2.5 h-2.5" /> File
                          </span>
                        )}

                        {skill.source === 'builtin' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            Built-in
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> Ready
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {skill.can_delete && (
                          <button
                            onClick={(e) => handleDeleteSkill(skill.id, e)}
                            className="p-1 rounded-md text-os-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete custom skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleToggleSkill(skill.id, isInstalled, e)}
                          className="p-1 text-os-muted hover:text-os-primary transition-colors"
                          title={isInstalled ? "Disable Skill" : "Enable Skill"}
                        >
                          {isInstalled ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-os-muted" />
                          )}
                        </button>
                        <div className={`p-2.5 rounded-xl border ${skill.color || 'text-blue-500 bg-blue-500/10 border-blue-500/20'}`}>
                          {renderSkillIcon(skill.icon)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-os-primary group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
                        {skill.title}
                        {skill.version && (
                          <span className="text-[10px] font-normal font-mono text-os-muted">v{skill.version}</span>
                        )}
                      </h3>
                      <p className="text-xs text-os-secondary mt-1.5 leading-relaxed line-clamp-2">
                        {skill.description}
                      </p>
                    </div>

                    {/* Capabilities & Virtual Computer Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {skill.has_scripts && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Code2 className="w-3 h-3" /> Script-backed
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> Virtual Computer
                      </span>
                      {skill.has_tools && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                          <Terminal className="w-3 h-3" /> Tool-backed
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-os-muted truncate">
                      Container: <span className="text-cyan-400/80">/workspace/skills/{skill.id}</span>
                    </div>

                    {skill.repo_url && (
                      <div className="pt-0.5">
                        <a
                          href={skill.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-os-secondary hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[220px]">{skill.repo_url.replace('https://github.com/', '')}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row Actions: [Inspect] & [Run on Computer] */}
                  <div className="flex items-center justify-between pt-2 border-t border-os-border/40 gap-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => handleOpenDetails(skill.id)}
                      leftIcon={<FileText className="w-3 h-3" />}
                    >
                      Inspect
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenRunModal(skill)}
                      leftIcon={<Play className="w-3 h-3 fill-current" />}
                    >
                      Run on Computer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : mainTab === 'runs' ? (
        /* Panel 2: Execution Runs & Telemetry */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-os-border/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> OS Virtual Computer
                </span>
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-emerald-400 font-mono">Linux Desktop Active (Port 6080/9222)</span>
              </div>
              <h1 className="text-2xl font-bold text-os-primary tracking-tight mt-1">
                Execution Runs & Telemetry
              </h1>
              <p className="text-xs text-os-secondary mt-0.5">
                Verifiable step logs, postcondition checks, and telemetry for all skills run in OS
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={fetchSkillRuns}
                isLoading={loadingRuns}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh
              </Button>
              {skillRuns.length > 0 && (
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handleClearRuns}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>

          {skillRuns.length === 0 ? (
            <GlassCard className="py-16 text-center text-os-secondary">
              <History className="w-10 h-10 text-os-muted mx-auto mb-3 stroke-[1.2]" />
              <div className="text-sm font-semibold text-os-primary">No execution runs recorded yet</div>
              <div className="text-xs text-os-muted mt-1 max-w-sm mx-auto">
                Execute any skill from the Skills Catalog to run scripts and workflows in the OS Virtual Computer environment.
              </div>
              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={() => setMainTab('skills')}>
                  Explore Skills Catalog
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {skillRuns.map((run) => (
                <div
                  key={run.run_id}
                  className="p-4 rounded-xl bg-os-surface border border-os-border hover:border-os-border-glass transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border flex items-center gap-1 ${
                          run.status === 'VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : run.status === 'COMPLETED'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {run.status === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {run.status}
                      </span>
                      <strong className="text-sm text-os-primary">{run.skill_title}</strong>
                      <span className="text-[11px] font-mono text-os-muted">({run.skill_id})</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-os-secondary">
                      <span>{run.timestamp}</span>
                      <span>{run.duration_ms} ms</span>
                      <span className="px-2 py-0.5 rounded bg-black/30 border border-os-border text-cyan-400">
                        {run.sandbox_mode || 'docker'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/30 border border-os-border text-xs text-os-primary font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {run.output_preview || run.input}
                  </div>

                  {run.verification && (
                    <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                        <strong>Verification Evidence:</strong> {run.verification.evidence || 'Postcondition verified.'}
                      </span>
                      <span className="text-os-muted">{run.container_path}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

      {/* Import Skill Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportFeedback(null);
        }}
        title="Import Skill into OS"
        subtitle="Import skills from a GitHub repository or install custom SKILL.md / Python tool files"
        maxWidth="lg"
      >
        <div className="space-y-5 text-xs">
          {/* Source Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 p-1 rounded-xl bg-os-surface border border-os-border gap-1">
            <button
              onClick={() => {
                setImportTab('github');
                setImportFeedback(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-semibold transition-all ${
                importTab === 'github'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-os-secondary hover:text-os-primary'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </button>
            <button
              onClick={() => {
                setImportTab('zip');
                setImportFeedback(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-semibold transition-all ${
                importTab === 'zip'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-os-secondary hover:text-os-primary'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>ZIP Archive</span>
            </button>
            <button
              onClick={() => {
                setImportTab('file');
                setImportFeedback(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-semibold transition-all ${
                importTab === 'file'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-os-secondary hover:text-os-primary'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>SKILL.md / Code</span>
            </button>
            <button
              onClick={() => {
                setImportTab('local_dir');
                setImportFeedback(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-semibold transition-all ${
                importTab === 'local_dir'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-os-secondary hover:text-os-primary'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Local Folder</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {importFeedback && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                importFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {importFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="leading-snug">{importFeedback.message}</span>
            </div>
          )}

          {/* Tab 1: GitHub Repository */}
          {importTab === 'github' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-os-primary flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  GitHub Repository URL or Raw SKILL.md Link
                </label>
                <div className="flex items-center gap-2 bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50">
                  <input
                    type="url"
                    value={importGithubUrl}
                    onChange={(e) => setImportGithubUrl(e.target.value)}
                    placeholder="https://github.com/assafelovic/gpt-researcher or https://raw.githubusercontent.com/.../SKILL.md"
                    className="w-full bg-transparent text-xs text-os-primary placeholder-os-muted focus:outline-none font-mono"
                  />
                  {importGithubUrl && (
                    <button onClick={() => setImportGithubUrl('')} className="text-os-muted hover:text-os-primary">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-os-secondary">
                  OS automatically discovers `SKILL.md`, tools definitions, dependencies, and synthesizes an execution contract.
                </p>
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-os-secondary">Recommended Repositories:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'gpt-researcher', url: 'https://github.com/assafelovic/gpt-researcher' },
                    { label: 'gstack', url: 'https://github.com/garrytan/gstack' },
                    { label: 'agent-browser', url: 'https://github.com/vercel-labs/agent-browser' },
                    { label: 'shadcn-ui', url: 'https://github.com/shadcn-ui/ui' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImportGithubUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg bg-os-surface hover:bg-os-surface-active border border-os-border text-os-secondary hover:text-os-primary font-mono text-[11px] transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Custom Title (Optional)</label>
                  <input
                    type="text"
                    value={importCustomName}
                    onChange={(e) => setImportCustomName(e.target.value)}
                    placeholder="e.g. Autonomous Deep Researcher"
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary placeholder-os-muted focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Category</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary focus:outline-none"
                  >
                    <option value="Research">Research</option>
                    <option value="Development">Development</option>
                    <option value="Automation">Automation</option>
                    <option value="Writing">Writing</option>
                    <option value="Data">Data</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-os-border flex items-center justify-end gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleImportFromGithub()}
                  isLoading={isImporting}
                  leftIcon={<GitBranch className="w-3.5 h-3.5" />}
                  disabled={!importGithubUrl.trim()}
                >
                  Import & Register Skill
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Skill File / Code */}
          {importTab === 'file' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Skill Identifier / Slug</label>
                  <input
                    type="text"
                    value={importFileName}
                    onChange={(e) => setImportFileName(e.target.value)}
                    placeholder="e.g. crypto_analyzer"
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary placeholder-os-muted focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Category</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary focus:outline-none"
                  >
                    <option value="Automation">Automation</option>
                    <option value="Research">Research</option>
                    <option value="Development">Development</option>
                    <option value="Writing">Writing</option>
                    <option value="Data">Data</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>
              </div>

              {/* File Type & File Upload Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-os-surface border border-os-border">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-os-primary">File Format:</span>
                  <div className="inline-flex rounded-lg bg-os-surface-active p-0.5 border border-os-border">
                    <button
                      type="button"
                      onClick={() => setImportFileType('md')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        importFileType === 'md' ? 'bg-blue-600 text-white' : 'text-os-secondary hover:text-os-primary'
                      }`}
                    >
                      SKILL.md (Contract)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportFileType('py')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        importFileType === 'py' ? 'bg-blue-600 text-white' : 'text-os-secondary hover:text-os-primary'
                      }`}
                    >
                      tools.py (Python)
                    </button>
                  </div>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-primary text-xs font-semibold border border-os-border cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Choose File (.md / .py)</span>
                  <input
                    type="file"
                    accept=".md,.py,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Code Editor / Content Textarea */}
              <div className="space-y-1.5">
                <label className="font-semibold text-os-primary flex items-center justify-between">
                  <span>File Content / Instructions</span>
                  <span className="text-[11px] text-os-muted font-normal">
                    {importFileType === 'md' ? 'Markdown contract with YAML frontmatter or guidelines' : 'Python script with tool functions'}
                  </span>
                </label>
                <textarea
                  rows={8}
                  value={importFileContent}
                  onChange={(e) => setImportFileContent(e.target.value)}
                  placeholder={
                    importFileType === 'md'
                      ? `---\nname: my_custom_skill\ndescription: Expert capability for OS\nversion: 1.0.0\n---\n\n# Instructions\nExecute the task with rigorous verification...`
                      : `def run_skill(query: str = "") -> dict:\n    """Custom python execution handler."""\n    return {"status": "success", "result": f"Processed {query}"}`
                  }
                  className="w-full bg-os-surface p-3 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs font-mono text-os-primary placeholder-os-muted focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Short Description</label>
                  <input
                    type="text"
                    value={importDescription}
                    onChange={(e) => setImportDescription(e.target.value)}
                    placeholder="Brief summary of what this skill does"
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border text-xs text-os-primary placeholder-os-muted focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Default Trigger Prompt</label>
                  <input
                    type="text"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                    placeholder="e.g. Run analysis on "
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border text-xs text-os-primary placeholder-os-muted focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-os-border flex items-center justify-end gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleImportFromFile}
                  isLoading={isImporting}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  disabled={!importFileName.trim() || !importFileContent.trim()}
                >
                  Save & Install Skill
                </Button>
              </div>
            </div>
          )}

          {/* Tab: ZIP Archive */}
          {importTab === 'zip' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-os-primary flex items-center gap-1.5">
                  <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                  Skill ZIP Archive (Bundle)
                </label>
                <div className="p-4 rounded-xl border border-dashed border-os-border hover:border-blue-500/50 bg-os-surface/50 text-center transition-colors">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleZipUpload}
                    className="hidden"
                    id="zip-upload-input"
                  />
                  <label htmlFor="zip-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-blue-400 animate-pulse" />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-os-primary">
                        {importZipFile ? importZipFile.name : 'Click to browse or drop skill package (.zip)'}
                      </span>
                      <p className="text-[11px] text-os-secondary">
                        {importZipFile
                          ? `${(importZipFile.size / 1024).toFixed(1)} KB • Validated ZIP Package`
                          : 'Must contain SKILL.md, optional scripts/, references/, and assets/'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Skill Identifier / Slug (Optional)</label>
                  <input
                    type="text"
                    value={importFileName}
                    onChange={(e) => setImportFileName(e.target.value)}
                    placeholder="e.g. gstack_qa_suite"
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary placeholder-os-muted focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Category</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary focus:outline-none"
                  >
                    <option value="Automation">Automation</option>
                    <option value="Research">Research</option>
                    <option value="Development">Development</option>
                    <option value="Writing">Writing</option>
                    <option value="Data">Data</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Zip-Slip security verification and SHA-256 integrity hash will be computed automatically upon unpack.</span>
              </div>

              <div className="pt-3 border-t border-os-border flex items-center justify-end gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleImportFromZip}
                  isLoading={isImporting}
                  leftIcon={<Package className="w-3.5 h-3.5" />}
                  disabled={!importZipBase64}
                >
                  Unpack & Install ZIP
                </Button>
              </div>
            </div>
          )}

          {/* Tab: Local Workspace Directory */}
          {importTab === 'local_dir' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-os-primary flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-cyan-400" />
                  Local Workspace Path or Directory
                </label>
                <input
                  type="text"
                  value={importLocalPath}
                  onChange={(e) => setImportLocalPath(e.target.value)}
                  placeholder="e.g. d:/OS/skills/my_skill or /workspace/skills/custom"
                  className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary placeholder-os-muted focus:outline-none font-mono"
                />
                <p className="text-[11px] text-os-secondary">
                  Imports an existing folder on disk containing `SKILL.md` and syncs it to the OS Virtual Computer runtime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Skill Identifier (Optional)</label>
                  <input
                    type="text"
                    value={importFileName}
                    onChange={(e) => setImportFileName(e.target.value)}
                    placeholder="e.g. local_tool_skill"
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary placeholder-os-muted focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-os-primary">Category</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-os-surface px-3 py-2 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary focus:outline-none"
                  >
                    <option value="Development">Development</option>
                    <option value="Automation">Automation</option>
                    <option value="Research">Research</option>
                    <option value="Writing">Writing</option>
                    <option value="Data">Data</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-os-border flex items-center justify-end gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleImportFromLocalDir}
                  isLoading={isImporting}
                  leftIcon={<Folder className="w-3.5 h-3.5" />}
                  disabled={!importLocalPath.trim()}
                >
                  Register Local Skill
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Skill Details Inspector Modal */}
      <Modal
        isOpen={skillDetailsModalOpen}
        onClose={() => {
          setSkillDetailsModalOpen(false);
          setSelectedSkillDetails(null);
        }}
        title={`Skill Inspector: ${selectedSkillDetails?.manifest?.title || selectedSkillDetails?.meta?.name || 'Skill Details'}`}
        subtitle={`ID: ${selectedSkillDetails?.skill_id || ''} • Version: ${selectedSkillDetails?.meta?.version || '1.0.0'} • Category: ${selectedSkillDetails?.manifest?.category || 'General'}`}
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs">
          {loadingDetails ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-os-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span>Inspecting skill package and container state...</span>
            </div>
          ) : selectedSkillDetails ? (() => {
            const skillId = selectedSkillDetails.id || selectedSkillDetails.skill_id || '';
            const skillTitle = selectedSkillDetails.title || selectedSkillDetails.manifest?.title || selectedSkillDetails.name || selectedSkillDetails.meta?.name || skillId;
            const skillVer = selectedSkillDetails.version || selectedSkillDetails.meta?.version || '1.0.0';
            const skillCat = selectedSkillDetails.category || selectedSkillDetails.manifest?.category || 'Integrations';
            const skillLic = selectedSkillDetails.license || selectedSkillDetails.meta?.license || 'MIT';
            const skillAuth = selectedSkillDetails.author || selectedSkillDetails.meta?.author || 'OS Virtual Desktop';
            const skillDesc = selectedSkillDetails.description || selectedSkillDetails.meta?.description || selectedSkillDetails.manifest?.description || '';
            const skillContract = selectedSkillDetails.skill_md || selectedSkillDetails.contract || '# No SKILL.md found';
            const skillMount = selectedSkillDetails.container_path || `/workspace/skills/${skillId}`;
            const isSkillEnabled = installedSkills[skillId] !== false;

            const filesList: Array<{ path: string; size: number; type: string }> = selectedSkillDetails.files || [
              ...(selectedSkillDetails.scripts || []).map((s: any) => ({ path: `scripts/${s.name}`, size: s.size, type: 'script' })),
              ...(selectedSkillDetails.references || []).map((r: any) => ({ path: `references/${r.name}`, size: r.size, type: 'reference' })),
              ...(selectedSkillDetails.assets || []).map((a: any) => ({ path: `assets/${a.name}`, size: a.size, type: 'asset' })),
              ...(selectedSkillDetails.skill_md ? [{ path: 'SKILL.md', size: selectedSkillDetails.skill_md.length, type: 'contract' }] : []),
            ];

            return (
              <>
                {/* Header Badges & Actions */}
                <div className="p-3.5 rounded-xl bg-os-surface border border-os-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isSkillEnabled
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                      }`}>
                        {isSkillEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        License: {skillLic}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Author: {skillAuth}
                      </span>
                    </div>
                    <p className="text-os-secondary text-xs pt-1">
                      {skillDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={(e) => handleToggleSkill(skillId, isSkillEnabled, e)}
                      leftIcon={isSkillEnabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-zinc-400" />}
                    >
                      {isSkillEnabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSkillDetailsModalOpen(false);
                        const s = skills.find((x) => x.id === skillId) || {
                          id: skillId,
                          name: skillId,
                          title: skillTitle,
                          category: skillCat,
                          description: skillDesc,
                          source: selectedSkillDetails.source || 'imported',
                          status: 'active',
                          has_tools: selectedSkillDetails.has_tools,
                        };
                        setTimeout(() => handleOpenRunModal(s), 200);
                      }}
                      leftIcon={<Play className="w-3 h-3 fill-current" />}
                    >
                      Run on Computer
                    </Button>
                  </div>
                </div>

                {/* SHA-256 Hash and Container Mount Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-os-border flex items-center justify-between">
                    <span className="text-os-muted flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-cyan-400" /> Content Hash:
                    </span>
                    <span className="text-cyan-400 font-semibold" title={selectedSkillDetails.content_hash}>
                      {selectedSkillDetails.content_hash ? `${selectedSkillDetails.content_hash.substring(0, 16)}...` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-os-border flex items-center justify-between">
                    <span className="text-os-muted flex items-center gap-1.5">
                      <Monitor className="w-3 h-3 text-emerald-400" /> Virtual Mount:
                    </span>
                    <span className="text-emerald-400 font-semibold truncate max-w-[200px]" title={skillMount}>
                      {skillMount}
                    </span>
                  </div>
                </div>

                {/* Inspector Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-os-surface border border-os-border">
                  <button
                    onClick={() => setDetailsTab('contract')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      detailsTab === 'contract' ? 'bg-blue-600 text-white shadow-sm' : 'text-os-secondary hover:text-os-primary'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>SKILL.md Contract</span>
                  </button>
                  <button
                    onClick={() => setDetailsTab('files')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      detailsTab === 'files' ? 'bg-blue-600 text-white shadow-sm' : 'text-os-secondary hover:text-os-primary'
                    }`}
                  >
                    <ListTree className="w-3.5 h-3.5" />
                    <span>Files & Scripts ({filesList.length})</span>
                  </button>
                  <button
                    onClick={() => setDetailsTab('security')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      detailsTab === 'security' ? 'bg-blue-600 text-white shadow-sm' : 'text-os-secondary hover:text-os-primary'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Security & Permissions</span>
                  </button>
                </div>

                {/* Tab 1: Contract */}
                {detailsTab === 'contract' && (
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-xl bg-black/50 border border-os-border font-mono text-xs text-os-primary max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                      {skillContract}
                    </div>
                  </div>
                )}

                {/* Tab 2: Files Tree */}
                {detailsTab === 'files' && (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-os-border overflow-hidden">
                      <table className="w-full text-left font-mono text-[11px]">
                        <thead className="bg-os-surface text-os-muted border-b border-os-border">
                          <tr>
                            <th className="py-2 px-3 font-medium">Path</th>
                            <th className="py-2 px-3 font-medium">Type</th>
                            <th className="py-2 px-3 font-medium text-right">Size</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-os-border/50">
                          {filesList.map((f: any, idx: number) => {
                            const isScript = f.path.startsWith('scripts/');
                            const isAsset = f.path.startsWith('assets/');
                            const isRef = f.path.startsWith('references/');
                            return (
                              <tr key={idx} className="hover:bg-os-surface/40 transition-colors">
                                <td className="py-2 px-3 text-os-primary flex items-center gap-2">
                                  {isScript ? (
                                    <Terminal className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                  ) : isAsset ? (
                                    <Palette className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                                  ) : isRef ? (
                                    <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                  ) : (
                                    <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                  )}
                                  <span>{f.path}</span>
                                </td>
                                <td className="py-2 px-3 text-os-muted capitalize">
                                  {isScript ? 'Executable Script' : isAsset ? 'Visual Asset' : isRef ? 'Reference Doc' : 'Contract File'}
                                </td>
                                <td className="py-2 px-3 text-os-secondary text-right">
                                  {f.size > 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${f.size} B`}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab 3: Security & Permissions */}
                {detailsTab === 'security' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-os-surface border border-os-border space-y-2">
                      <span className="font-semibold text-os-primary block">Allowed Tools & Capabilities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedSkillDetails.capabilities || selectedSkillDetails.meta?.capabilities || ['virtual_computer_ready']).map((c: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            {c}
                          </span>
                        ))}
                        {(selectedSkillDetails.allowed_tools || selectedSkillDetails.meta?.allowed_tools || ['python3', 'terminal']).map((t: string, idx: number) => (
                          <span key={`tool-${idx}`} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            tool: {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Agent Skills Runtime Safety Attestation</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-emerald-300/80">
                        All execution takes place inside isolated Docker Linux desktop container (`os-virtual-desktop`) at UID 1000:1000 with read-only host filesystem and postcondition artifact validation.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button variant="glass" size="sm" onClick={() => setSkillDetailsModalOpen(false)}>
                    Close Inspector
                  </Button>
                </div>
              </>
            );
          })() : (
            <div className="py-8 text-center text-os-muted">Skill details not available.</div>
          )}
        </div>
      </Modal>

      {/* Run Skill Execution Modal */}
      {selectedSkillToRun && (
        <Modal
          isOpen={isRunModalOpen}
          onClose={() => {
            setIsRunModalOpen(false);
            setSkillRunResult(null);
          }}
          title={`Run Skill: ${selectedSkillToRun.title}`}
          subtitle={`${selectedSkillToRun.category} • ${selectedSkillToRun.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Skill Overview Card */}
            <div className="p-3.5 rounded-xl bg-os-surface border border-os-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${selectedSkillToRun.badge_class || 'bg-blue-500/15 text-blue-500 border-blue-500/30'}`}>
                    {selectedSkillToRun.category}
                  </span>
                  <span className="text-[10px] font-mono text-os-muted">ID: {selectedSkillToRun.id}</span>
                </div>
                <p className="text-os-secondary text-xs">{selectedSkillToRun.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] text-os-muted">Execution Engine:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                  selectedSkillToRun.has_tools || ['calc', 'calc_skill', 'datetime', 'datetime_skill', 'system', 'system_skill', 'websearch', 'websearch_skill'].includes(selectedSkillToRun.id)
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                }`}>
                  {selectedSkillToRun.has_tools || ['calc', 'calc_skill', 'datetime', 'datetime_skill', 'system', 'system_skill', 'websearch', 'websearch_skill'].includes(selectedSkillToRun.id)
                    ? 'Deterministic Sandbox'
                    : 'Local Ollama LLM'}
                </span>
              </div>
            </div>

            {/* Input Prompt / Parameters */}
            <div className="space-y-1.5">
              <label className="font-semibold text-os-primary flex items-center justify-between">
                <span>Input Prompt / Execution Parameters</span>
                <span className="text-[11px] text-os-muted font-normal">Passed into the skill contract</span>
              </label>
              <textarea
                rows={3}
                value={runInput}
                onChange={(e) => setRunInput(e.target.value)}
                placeholder="Enter prompt, query, or command parameters..."
                className="w-full bg-os-surface p-3 rounded-xl border border-os-border focus-within:border-blue-500/50 text-xs text-os-primary placeholder-os-muted focus:outline-none resize-y"
              />
            </div>

            {/* Execute Button */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-os-secondary flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Runs inside isolated OS host environment
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteSkill}
                isLoading={isRunningSkill}
                leftIcon={<Play className="w-3 h-3 fill-current" />}
              >
                Execute in OS
              </Button>
            </div>

            {/* Live Execution Result Container */}
            {skillRunResult && (
              <div className="space-y-3 pt-2 border-t border-os-border animate-in fade-in duration-150">
                {/* Telemetry Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-os-surface border border-os-border">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                        skillRunResult.ok
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {skillRunResult.ok ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> COMPLETED
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" /> FAILED
                        </>
                      )}
                    </span>

                    {skillRunResult.execution_mode && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {skillRunResult.execution_mode}
                      </span>
                    )}

                    {skillRunResult.sandbox_mode && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                        <Monitor className="w-2.5 h-2.5" /> {skillRunResult.sandbox_mode}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-os-secondary">
                    {skillRunResult.model_used && (
                      <span>
                        Engine: <strong className="text-os-primary">{skillRunResult.model_used}</strong>
                      </span>
                    )}
                    {skillRunResult.latency_ms !== undefined && (
                      <span>
                        Latency: <strong className="text-os-primary">{skillRunResult.latency_ms} ms</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Step-by-Step Container Pipeline Tracker */}
                {skillRunResult.steps && skillRunResult.steps.length > 0 && (
                  <div className="p-3 rounded-xl bg-os-surface/60 border border-os-border space-y-2">
                    <span className="text-[11px] font-semibold text-os-primary flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      Virtual Computer Execution Pipeline
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {skillRunResult.steps.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-black/40 border border-os-border flex items-center justify-between text-[11px] font-mono"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {st.status === 'completed' || st.status === 'ok' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            ) : st.status === 'skipped' ? (
                              <Clock className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                            )}
                            <span className="truncate text-os-secondary capitalize">{st.step.replace(/_/g, ' ')}</span>
                          </div>
                          {st.duration_ms !== undefined && (
                            <span className="text-os-muted text-[10px]">{st.duration_ms}ms</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Postcondition Card */}
                {skillRunResult.verification && (
                  <div
                    className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                      skillRunResult.verification.verified
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {skillRunResult.verification.verified
                            ? 'POSTCONDITION VERIFIED (Agent Skills Spec)'
                            : 'POSTCONDITION UNVERIFIED'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-current">
                        Env: {skillRunResult.verification.environment || 'container'}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-os-primary whitespace-pre-wrap leading-relaxed">
                      {skillRunResult.verification.evidence}
                    </p>
                  </div>
                )}

                {/* Generated Artifacts */}
                {skillRunResult.artifacts && skillRunResult.artifacts.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-os-surface border border-os-border space-y-1.5">
                    <span className="text-[11px] font-semibold text-os-primary flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-cyan-400" />
                      Generated Virtual Desktop Artifacts:
                    </span>
                    <div className="space-y-1">
                      {skillRunResult.artifacts.map((art, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded bg-black/30 border border-os-border font-mono text-[11px] text-cyan-300 flex items-center justify-between"
                        >
                          <span className="truncate">{art.path}</span>
                          <span className="text-os-muted text-[10px] capitalize">{art.environment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Output Text / Card */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-os-primary">Execution Output</span>
                    <button
                      onClick={handleCopyOutput}
                      className="inline-flex items-center gap-1 text-[11px] text-os-secondary hover:text-os-primary transition-colors"
                    >
                      {copiedOutput ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Output</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-os-border font-mono text-xs text-os-primary whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed shadow-inner">
                    {skillRunResult.output}
                  </div>
                </div>

                {/* Actions: Send to Chat / Close */}
                <div className="pt-2 flex items-center justify-between">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setIsRunModalOpen(false)}
                  >
                    Close
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={handleExecuteSkill}
                      isLoading={isRunningSkill}
                      leftIcon={<RefreshCw className="w-3 h-3" />}
                    >
                      Run Again
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendToChat}
                      leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      Send to Ask OS (Chat)
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
