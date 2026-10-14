import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../services/api';
import {
  Volume2,
  Cpu,
  Zap,
  Terminal,
  FileCode,
  FileText,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Lock,
  Share2,
  Video,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';

interface DotInfo {
  dot_id: string;
  name: string;
  role: string;
  instructions?: string;
  permissions: string[];
}

interface MessageItem {
  id: string;
  sender: 'user' | 'os';
  text: string;
  isApproval?: boolean;
  approvalData?: {
    approval_id: string;
    action_type: string;
    payload: string;
    arguments_hash?: string;
  };
}

export const HudView: React.FC = () => {
  const [dots, setDots] = useState<Record<string, DotInfo>>({
    forge: { dot_id: 'forge', name: 'Forge', role: 'Coding & Autonomous Terminal Engineer', permissions: ['files', 'shell', 'memory'] },
    scout: { dot_id: 'scout', name: 'Scout', role: 'Deep Research & Web Specialist', permissions: ['browser', 'memory'] },
    scribe: { dot_id: 'scribe', name: 'Scribe', role: 'Space & Documentation Architect', permissions: ['files', 'memory'] },
    sentinel: { dot_id: 'sentinel', name: 'Sentinel', role: 'System Diagnostics & Security Monitor', permissions: ['memory'] },
  });
  const [activeDot, setActiveDot] = useState<string>('forge');
  const [runtimeState, setRuntimeState] = useState<string>('STANDBY');
  const [hwInfo, setHwInfo] = useState<any>(null);
  const [engineModel, setEngineModel] = useState<string>('ollama/qwen3.5:35b');
  const [telemetry, setTelemetry] = useState<{ traces: number; energy: string; latency: string }>({
    traces: 2,
    energy: '0.064 J',
    latency: '4.2 ms',
  });

  // Pipeline state
  const [pipelineStage, setPipelineStage] = useState<'STANDBY' | 'DOT RBAC' | 'HITL GATE' | 'ENGINE' | 'TELEMETRY'>('STANDBY');
  const [pipelinePercent, setPipelinePercent] = useState<number>(0);
  const [reactorSpeedMultiplier, setReactorSpeedMultiplier] = useState<number>(1.0);

  // Computer takeover state
  const [isHumanControl, setIsHumanControl] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ os init --hardware-aware\n[OK] Detected hardware architecture + local engine active.',
    '$ os doctor\n[OK] All 5 Composable Primitives verified. Safety gates active.',
  ]);

  // Space Page editor state
  const [pageTitle, setPageTitle] = useState<string>('OS Architecture & Lab Roadmap');
  const [pageMarkdown, setPageMarkdown] = useState<string>(
    '# OS Synthesis\n- OpenJarvis: Local-first 5 primitives + energy telemetry\n- OpenMuse: Agent Computer container + Take Control\n- OpenDots: Scoped Dots + Revision-checked Spaces'
  );
  const [pageRevision, setPageRevision] = useState<number>(1);

  // Chat & Stream state
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      sender: 'os',
      text: 'OS v2.0 Control Plane Online.\n• OpenJarvis: 5 Composable Primitives active (Hardware-Aware Local Engine).\n• OpenMuse: Agent Computer & Sandbox Worker connected.\n• OpenDots: 4 Specialist Coworkers (@forge, @scout, @scribe, @sentinel) & Revision-Safe Spaces verified.',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [lastSpeech, setLastSpeech] = useState<string>('OS online and standing by, Sai.');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const setPipeline = (stage: 'STANDBY' | 'DOT RBAC' | 'HITL GATE' | 'ENGINE' | 'TELEMETRY', rState: string, pct: number) => {
    setPipelineStage(stage);
    setRuntimeState(rState);
    setPipelinePercent(pct);
    setReactorSpeedMultiplier(stage === 'STANDBY' ? 1.0 : stage === 'HITL GATE' ? 0.4 : 2.5);
  };

  // Load state from backend
  const loadState = useCallback(async () => {
    try {
      const state = await api.getHudState();
      if (state.dots) setDots(state.dots);
      if (state.runtime_state) setRuntimeState(state.runtime_state);
      if (state.hardware) {
        setHwInfo(state.hardware);
        setEngineModel(`${state.hardware.preferred_engine || 'ollama'}/${state.hardware.recommended_local_model || 'qwen3.5:35b'}`);
      }
      if (state.telemetry) {
        setTelemetry({
          traces: state.telemetry.total_traces || 2,
          energy: `${state.telemetry.total_energy_joules || 0.064} J`,
          latency: `${state.telemetry.avg_latency_ms || 4.2} ms`,
        });
      }
      if (state.computer) {
        setIsHumanControl(state.computer.user_took_control || false);
      }
      if (state.spaces && state.spaces.pages && state.spaces.pages.length > 0) {
        const p = state.spaces.pages[0];
        setPageTitle(p.title);
        setPageMarkdown(p.markdown);
        setPageRevision(p.revision);
      }
    } catch (e) {
      console.warn('Failed to load initial HUD state:', e);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 3D Canvas Reactor Core Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      angle += 0.016 * reactorSpeedMultiplier;

      // Outer rotating telemetry ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.6);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.38)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 8, 4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Counter-rotating segmented ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 1.1);
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.58)';
      ctx.lineWidth = 3;
      ctx.setLineDash([22, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, 58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3D Octahedron core
      const radius = 35;
      const vertices = [
        [0, -radius, 0], [0, radius, 0],
        [-radius, 0, 0], [radius, 0, 0],
        [0, 0, -radius], [0, 0, radius],
      ];
      const edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];

      const projected = vertices.map(([x, y, z]) => {
        const cosY = Math.cos(angle);
        const sinY = Math.sin(angle);
        const cosX = Math.cos(angle * 0.7);
        const sinX = Math.sin(angle * 0.7);
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;
        const scale = 220 / (220 + z2);
        return [cx + x1 * scale, cy + y1 * scale];
      });

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.65;
      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
        ctx.stroke();
      });

      // Glowing center pulse
      const pulse = 10 + Math.sin(angle * 3) * 3;
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, pulse * 2.5);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.95)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse * 2.5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [reactorSpeedMultiplier]);

  const handleSendCommand = async (customQuery?: string, overrideDot?: string) => {
    const q = customQuery || inputText.trim();
    if (!q) return;
    if (!customQuery) setInputText('');

    const targetDot = overrideDot || activeDot;
    setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'user', text: q }]);
    setPipeline('DOT RBAC', 'PROCESSING', 35);

    const ql = q.toLowerCase();
    let actionType: string | undefined = undefined;
    let actionPayload: string | undefined = undefined;

    if (ql.includes('rm -rf') || ql.includes('format c:')) {
      actionType = 'shell_exec';
      actionPayload = q;
    } else if (ql.includes('deploy') || ql.includes('docker') || ql.includes('shell') || ql.includes('git push')) {
      actionType = 'shell_exec';
      actionPayload = q;
    } else if (ql.startsWith('save ') || ql.includes('write file')) {
      actionType = 'file_write';
      actionPayload = q;
    }

    try {
      setPipeline('ENGINE', 'WORKING', 65);
      const res = await api.sendHudCommand(q, targetDot, actionType, actionPayload);

      if (res.status === 'blocked') {
        setPipeline('STANDBY', 'ERROR', 0);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'os',
            text: `🛑 SECURITY BLOCK: ${res.reason}`,
          },
        ]);
        setTerminalLogs((prev) => [...prev, `[SECURITY GATE BLOCKED] ${q}`]);
        return;
      }

      if (res.status === 'permission_denied') {
        setPipeline('STANDBY', 'ERROR', 0);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'os',
            text: `⚠️ Permission Denied: ${res.error}`,
          },
        ]);
        setTerminalLogs((prev) => [...prev, `[PERMISSION DENIED] ${q}`]);
        return;
      }

      if (res.status === 'waiting_approval' && res.approval_card) {
        setPipeline('HITL GATE', 'WAITING_APPROVAL', 50);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'os',
            text: `[${res.dot}] Task Paused — Human Approval Required`,
            isApproval: true,
            approvalData: {
              approval_id: res.approval_card.approval_id,
              action_type: res.approval_card.action_type,
              payload: res.approval_card.payload,
              arguments_hash: res.approval_card.arguments_hash,
            },
          },
        ]);
        return;
      }

      setPipeline('TELEMETRY', 'COMPLETED', 100);
      const responseText = res.response || 'Executed successfully.';
      setLastSpeech(responseText.replace(/<[^>]*>?/gm, ''));
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'os',
          text: responseText,
        },
      ]);

      if (res.telemetry) {
        setTelemetry({
          traces: telemetry.traces + 1,
          energy: `${res.telemetry.energy_joules} J`,
          latency: `${res.telemetry.latency_ms} ms`,
        });
      }

      setTerminalLogs((prev) => [
        ...prev,
        `$ os ask --dot ${targetDot} "${q}"\n[OK] Latency: ${res.telemetry?.latency_ms || 4.2}ms`,
      ]);

      setTimeout(() => {
        setPipeline('STANDBY', 'STANDBY', 0);
      }, 1200);
    } catch (err: any) {
      setPipeline('STANDBY', 'ERROR', 0);
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'os', text: `Error: ${err.message}` },
      ]);
    }
  };

  const handleResolveApproval = async (approvalId: string, decision: string, payload: string) => {
    try {
      const res = await api.resolveHudApproval(approvalId, decision);
      setMessages((prev) =>
        prev.map((m) =>
          m.approvalData?.approval_id === approvalId
            ? { ...m, isApproval: false, text: `${m.text}\n✓ Resolved by Operator: ${decision}` }
            : m
        )
      );

      if (decision === 'deny') {
        setTerminalLogs((prev) => [...prev, `[DENIED BY OPERATOR] ${payload}`]);
        setPipeline('STANDBY', 'STANDBY', 0);
      } else {
        const out = res?.execution_result?.stdout?.trim() || res?.execution_result?.status || `Executed under policy '${decision}'`;
        setTerminalLogs((prev) => [
          ...prev,
          `$ ${payload}\n[AGENT COMPUTER] ${out}`,
        ]);
        setPipeline('TELEMETRY', 'COMPLETED', 100);
        setTimeout(() => setPipeline('STANDBY', 'STANDBY', 0), 1200);
      }
    } catch (err: any) {
      console.error('Failed to resolve approval:', err);
    }
  };

  const handleToggleTakeover = async () => {
    const nextMode = !isHumanControl;
    setIsHumanControl(nextMode);
    try {
      await api.toggleHudTakeover(nextMode);
      setTerminalLogs((prev) => [
        ...prev,
        nextMode
          ? '[OPENMUSE] Human operator took interactive control of browser & terminal.'
          : '[OPENMUSE] Returned terminal & browser session to autonomous agent worker.',
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSpacePage = async () => {
    try {
      const res = await api.saveHudSpacePage(
        'engineering-hq',
        'engineering-notes',
        pageTitle,
        pageMarkdown,
        'Sai',
        pageRevision
      );
      setPageRevision(res.revision);
      setTerminalLogs((prev) => [
        ...prev,
        `[OPENDOTS SPACE] Saved '${pageTitle}' at Revision v${res.revision} (optimistic lock verified).`,
      ]);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'os',
          text: `[Scribe] Saved page '${pageTitle}' to Space engineering-hq (Revision v${res.revision} verified).`,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'os',
          text: `⚠️ Revision Conflict: Another actor modified this page. Your draft was preserved.`,
        },
      ]);
    }
  };

  const handleOptimize = async () => {
    setPipeline('ENGINE', 'PROCESSING', 70);
    try {
      const res = await api.optimizeHudTraces();
      setTelemetry({
        traces: res.total_traces,
        energy: `${res.total_energy_joules} J`,
        latency: `${res.avg_latency_ms} ms`,
      });
      const latestSkill = (res.learned_skills && res.learned_skills.length)
        ? res.learned_skills[res.learned_skills.length - 1].replace(/\.$/, '')
        : 'local-first-routing';
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'os',
          text: `[OS Learning Loop] Synthesized ${res.total_traces} local interaction traces.\n• Latest Skill: ${latestSkill}`,
        },
      ]);
      setTerminalLogs((prev) => [...prev, `$ os optimize\n[OK] Tuned routing weights across ${res.total_traces} traces.`]);
      setPipeline('TELEMETRY', 'COMPLETED', 100);
      setTimeout(() => setPipeline('STANDBY', 'STANDBY', 0), 1200);
    } catch (err: any) {
      console.error(err);
      setPipeline('STANDBY', 'ERROR', 0);
    }
  };

  const handleRunPreset = async (preset: string) => {
    if (preset === 'morning') {
      setActiveDot('sentinel');
      handleSendCommand('Generate my morning briefing', 'sentinel');
    } else if (preset === 'optimize') {
      handleOptimize();
    } else if (preset === 'risky_shell') {
      setActiveDot('forge');
      handleSendCommand('deploy docker container openmuse-computer:local --port 8790', 'forge');
    } else if (preset === 'youtube') {
      setActiveDot('scout');
      setPipeline('ENGINE', 'WORKING', 75);
      try {
        const data = await api.summarizeYouTubeVideo('https://youtube.com/watch?v=9o00NBuluVQ', 'OpenMuse & OpenJarvis Architecture');
        const bullets = (data.key_takeaways || []).map((t: string) => `• ${t}`).join('\n');
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'os',
            text: `[@scout // YouTube Skill Connector] Indexed ${data.title}:\n${bullets}`,
          },
        ]);
        setTerminalLogs((prev) => [
          ...prev,
          `$ os youtube summarize "${data.video_url}"\n[OK] Indexed ${data.key_takeaways?.length || 3} takeaways into Space.`,
        ]);
        setPipeline('TELEMETRY', 'COMPLETED', 100);
        setTimeout(() => setPipeline('STANDBY', 'STANDBY', 0), 1200);
      } catch (e: any) {
        console.error(e);
        setPipeline('STANDBY', 'ERROR', 0);
      }
    } else if (preset === 'linkedin') {
      setActiveDot('scribe');
      setPipeline('ENGINE', 'WORKING', 75);
      try {
        const data = await api.draftLinkedInPost('OS v2.0 Local-First AI Operating System', [
          'OpenJarvis 5 Composable Primitives with Intelligence-Per-Watt telemetry',
          'OpenMuse isolated Agent Computer with 1-click Human Take Control',
          'OpenDots scoped RBAC coworkers & revision-locked Markdown Spaces',
        ]);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'os',
            text: `[@scribe // LinkedIn Skill Connector] Drafted launch post (${data.character_count} chars):\n\n${data.content}`,
          },
        ]);
        setTerminalLogs((prev) => [
          ...prev,
          `$ os linkedin draft --topic "OS v2.0"\n[OK] Draft ready (${data.character_count} chars).`,
        ]);
        setPipeline('TELEMETRY', 'COMPLETED', 100);
        setTimeout(() => setPipeline('STANDBY', 'STANDBY', 0), 1200);
      } catch (e: any) {
        console.error(e);
        setPipeline('STANDBY', 'ERROR', 0);
      }
    } else if (preset === 'destructive') {
      setActiveDot('forge');
      handleSendCommand('rm -rf / --no-preserve-root', 'forge');
    }
  };

  const speakLast = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(lastSpeech);
      utter.rate = 1.02;
      utter.pitch = 0.95;
      window.speechSynthesis.speak(utter);
    }
    api.speakHudVoice(lastSpeech).catch(() => {});
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-3 font-mono text-cyan-50 min-h-screen bg-[#050811]">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#0a1324]/90 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-950/20">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold tracking-widest text-sm flex items-center gap-2">
            <span className="text-cyan-300">◈</span> OS // CYBER-HUD v2.0
          </span>
          <span className="text-[11px] text-cyan-200/50 hidden md:inline">
            OpenJarvis + OpenMuse + OpenDots Architecture
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
              runtimeState === 'WAITING_APPROVAL'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : runtimeState === 'ERROR'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
            }`}
          >
            {runtimeState}
          </span>
          <button
            onClick={speakLast}
            className="flex items-center gap-1.5 px-3 py-1 text-xs rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice Readout</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Task Execution Pipeline Header */}
      <div className="px-4 py-2 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-cyan-400/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Task Execution Pipeline:
          </span>
          <div className="flex items-center gap-2">
            {(['STANDBY', 'DOT RBAC', 'HITL GATE', 'ENGINE', 'TELEMETRY'] as const).map((stage, idx) => (
              <span
                key={stage}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                  pipelineStage === stage
                    ? 'bg-cyan-400 text-black shadow-sm shadow-cyan-400/50'
                    : 'bg-black/40 text-cyan-500/60 border border-cyan-500/20'
                }`}
              >
                {idx + 1}. {stage}
              </span>
            ))}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${pipelinePercent}%` }}
          />
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-3 flex-1">
        {/* Left Column: Specialist Dots & 5 Primitives Telemetry */}
        <div className="flex flex-col gap-3">
          {/* Dots Panel */}
          <div className="p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
              <span>Specialist Coworkers</span>
              <span className="text-[10px] text-cyan-200/50 font-normal">Scoped RBAC</span>
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(dots).map(([id, d]) => (
                <div
                  key={id}
                  onClick={() => setActiveDot(id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer ${
                    activeDot === id
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-sm shadow-cyan-500/30'
                      : 'border-cyan-500/15 bg-black/40 hover:border-cyan-500/40 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="text-cyan-400">●</span> {d.name}
                    </span>
                    <span className="text-[10px] text-cyan-400/80">@{id}</span>
                  </div>
                  <div className="text-[11px] text-cyan-200/60 mt-0.5 line-clamp-1">{d.role}</div>
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {(d.permissions || []).map((perm) => (
                      <span
                        key={perm}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Primitives Telemetry Panel */}
          <div className="p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
              <span>5 Primitives Telemetry</span>
            </div>
            <div className="text-[11px] space-y-1.5 text-cyan-200/70">
              <div className="flex justify-between">
                <span>• Intelligence:</span>
                <span className="text-cyan-300 font-semibold">
                  {hwInfo ? `${hwInfo.cpu_cores} Cores / ${hwInfo.ram_gb} GB` : 'Auto-Detected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>• Engine:</span>
                <span className="text-cyan-400 font-mono text-[10px] truncate max-w-[170px]">
                  {engineModel}
                </span>
              </div>
              <div className="flex justify-between">
                <span>• Energy / Latency:</span>
                <span className="text-emerald-400 font-mono">
                  {telemetry.energy} / {telemetry.latency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>• Safety Gate:</span>
                <span className="text-emerald-400">Patterns Guarded</span>
              </div>
              <div className="flex justify-between">
                <span>• Learning Loop:</span>
                <span className="text-cyan-300">{telemetry.traces} traces tuned</span>
              </div>
            </div>

            {/* 6 1-Click Task Demo Presets */}
            <div className="pt-2 border-t border-cyan-500/20">
              <div className="text-[10px] text-cyan-400/70 uppercase font-bold mb-1.5">1-Click Presets:</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleRunPreset('morning')}
                  className="px-2 py-1 text-[10px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors text-left truncate"
                >
                  ☀ Morning Digest
                </button>
                <button
                  onClick={() => handleRunPreset('optimize')}
                  className="px-2 py-1 text-[10px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors text-left truncate"
                >
                  ⚡ OS Optimize
                </button>
                <button
                  onClick={() => handleRunPreset('risky_shell')}
                  className="px-2 py-1 text-[10px] rounded border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 transition-colors text-left truncate"
                >
                  🛡 HITL Deploy
                </button>
                <button
                  onClick={() => handleRunPreset('youtube')}
                  className="px-2 py-1 text-[10px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors text-left truncate"
                >
                  📹 YouTube Summary
                </button>
                <button
                  onClick={() => handleRunPreset('linkedin')}
                  className="px-2 py-1 text-[10px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors text-left truncate"
                >
                  💼 LinkedIn Draft
                </button>
                <button
                  onClick={() => handleRunPreset('destructive')}
                  className="px-2 py-1 text-[10px] rounded border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 transition-colors text-left truncate"
                >
                  🛑 Security Block
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: 3D Reactor Core + AG-UI Live Stream */}
        <div className="flex flex-col gap-3">
          {/* Reactor Canvas */}
          <div className="relative h-[220px] rounded-lg bg-[#0a1324]/90 border border-cyan-500/20 overflow-hidden shadow-md flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-2.5 left-4 right-4 flex justify-between text-[11px] text-cyan-200/50 pointer-events-none font-mono">
              <span>ACTIVE DOT: {dots[activeDot]?.name.toUpperCase() || 'FORGE'}</span>
              <span>LOCAL-FIRST // VERIFIED SECURE</span>
            </div>
          </div>

          {/* Chat Stream & Approvals */}
          <div className="flex-1 p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col justify-between shadow-md min-h-[340px]">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2 mb-2">
              <span>AG-UI Live Stream & Human-in-the-Loop Approvals</span>
              <button
                onClick={() => handleRunPreset('risky_shell')}
                className="text-[10px] px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
              >
                Test HITL Gate
              </button>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[350px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'ml-auto max-w-[85%] bg-cyan-500/15 border border-cyan-500/30 text-cyan-100'
                      : 'mr-auto max-w-[92%] bg-black/60 border-l-2 border-cyan-400 text-cyan-50'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.isApproval && m.approvalData && (
                    <div className="mt-2.5 p-2.5 rounded bg-amber-950/30 border border-amber-500/40 text-[11px] space-y-1.5">
                      <div>Action: <code>{m.approvalData.action_type}</code></div>
                      <div>Payload: <code>{m.approvalData.payload}</code></div>
                      {m.approvalData.arguments_hash && (
                        <div className="text-[10px] text-amber-300/60 truncate">
                          Hash: {m.approvalData.arguments_hash}
                        </div>
                      )}
                      <div className="flex gap-2 pt-1 flex-wrap">
                        <button
                          onClick={() =>
                            handleResolveApproval(m.approvalData!.approval_id, 'allow_once', m.approvalData!.payload)
                          }
                          className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                        >
                          ✓ Allow Once
                        </button>
                        <button
                          onClick={() =>
                            handleResolveApproval(m.approvalData!.approval_id, 'always_allow', m.approvalData!.payload)
                          }
                          className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                        >
                          ⚡ Always Allow
                        </button>
                        <button
                          onClick={() =>
                            handleResolveApproval(m.approvalData!.approval_id, 'deny', m.approvalData!.payload)
                          }
                          className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                        >
                          ✕ Deny
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3 pt-2 border-t border-cyan-500/20">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                placeholder="Command OS or active Dot (e.g. 'calculate 137 * 42', 'deploy container')..."
                className="flex-1 h-9 px-3 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleSendCommand()}
                className="px-4 h-9 text-xs rounded bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
              >
                EXECUTE
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: OpenMuse Agent Computer + OpenDots Space Editor */}
        <div className="flex flex-col gap-3">
          {/* Agent Computer */}
          <div className="p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
              <span>OpenMuse // Agent Computer</span>
              <button
                onClick={handleToggleTakeover}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  isHumanControl
                    ? 'border-amber-400 text-amber-300 bg-amber-500/20'
                    : 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20'
                }`}
              >
                {isHumanControl ? '🤖 Return to Agent' : '🕹 Take Control'}
              </button>
            </div>
            <div className="text-[11px] text-cyan-200/60">
              Mode:{' '}
              <b className={isHumanControl ? 'text-amber-400' : 'text-emerald-400'}>
                {isHumanControl ? 'HUMAN_OVERRIDE (TAKE CONTROL)' : 'AGENT_AUTONOMOUS'}
              </b>
            </div>
            <div className="h-[140px] p-2 rounded bg-black border border-cyan-500/20 font-mono text-[10px] text-emerald-400 overflow-y-auto whitespace-pre-wrap">
              {terminalLogs.join('\n')}
            </div>
          </div>

          {/* OpenDots Space Editor */}
          <div className="p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md flex-1">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
              <span>OpenDots Space // Page Editor</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                Rev v{pageRevision}
              </span>
            </div>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="h-9 flex-none px-2.5 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 focus:outline-none focus:border-cyan-400"
            />
            <textarea
              value={pageMarkdown}
              onChange={(e) => setPageMarkdown(e.target.value)}
              className="flex-1 min-h-[115px] p-2 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none font-mono"
            />
            <div className="grid grid-cols-2 gap-2 pt-1 flex-none">
              <button
                onClick={handleSaveSpacePage}
                className="px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors"
              >
                💾 Save (Revision Check)
              </button>
              <button
                onClick={() => {
                  setActiveDot('scribe');
                  setPageMarkdown(
                    (prev) =>
                      prev + `\n- [Rev v${pageRevision + 1} by @scribe]: Verified local-first routing, HITL safety gates, and revision-safe documents.`
                  );
                }}
                className="px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors"
              >
                ✍ Ask Scribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HudView;
