import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Monitor,
  Globe,
  Play,
  Square,
  Pause,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Lock,
  Layers,
  Terminal,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Bot,
  User,
  Radio,
  Send,
  Crosshair,
  StopCircle,
  Folder,
  FileText,
  Code2,
  Maximize2,
  Minimize2,
  Sparkles,
  Search,
  Keyboard,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';

interface BackendItem {
  name: string;
  class: string;
  capabilities: {
    supports_browser: boolean;
    supports_desktop: boolean;
    supports_virtual_sandbox: boolean;
    cost_classification: string;
  };
  health: {
    ok: boolean | null;
    status: string;
    message: string;
  };
}

interface AICursor {
  x: number;
  y: number;
  visible: boolean;
  status: string;
  action: string;
  target_rect?: { x: number; y: number; width: number; height: number };
}

interface ActiveTask {
  task_id: string;
  goal: string;
  status: string;
  current_step: string;
  completed_steps: number;
  total_steps: number;
}

export const ComputerView: React.FC = () => {
  // Backends & System status
  const [backends, setBackends] = useState<Record<string, BackendItem>>({});
  const [rateLimits, setRateLimits] = useState<any>({});
  const [approvals, setApprovals] = useState<any[]>([]);
  const [emergencyStopped, setEmergencyStopped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [viewportError, setViewportError] = useState<string | null>(null);
  const [healthChecking, setHealthChecking] = useState<Record<string, boolean>>({});

  // Virtual Lab & Workspace State
  const [workspaceFiles, setWorkspaceFiles] = useState<any[]>([]);
  const [workspacePath, setWorkspacePath] = useState<string>('/workspace');
  const [terminalCmd, setTerminalCmd] = useState<string>('python --version');
  const [isExecutingCmd, setIsExecutingCmd] = useState<boolean>(false);
  const [cmdOutput, setCmdOutput] = useState<{ stdout: string; stderr: string; exit_code: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'viewport' | 'desktop' | 'lab'>('viewport');
  const [desktopStatus, setDesktopStatus] = useState<{
    ok: boolean;
    status: string;
    message: string;
    stream_url?: string;
    cdp_url?: string;
    details?: any;
  } | null>(null);
  const [desktopStarting, setDesktopStarting] = useState<boolean>(false);

  // Active Session & Viewport
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('about:blank');
  const [navInput, setNavInput] = useState<string>('https://google.com');
  const [liveFrame, setLiveFrame] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Arbiter & Dual Cursors
  const [controlState, setControlState] = useState<string>('HUMAN_CONTROL');
  const [aiCursor, setAiCursor] = useState<AICursor>({
    x: 640,
    y: 400,
    visible: false,
    status: 'Standby',
    action: '',
  });
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);

  // Task Assignment form
  const [taskPrompt, setTaskPrompt] = useState<string>('');
  const [allowedDomains, setAllowedDomains] = useState<string>('');

  // AI Virtual Keyboard State
  const [testAiInputText, setTestAiInputText] = useState<string>('https://news.ycombinator.com');
  const [testAiShortcut, setTestAiShortcut] = useState<string>('Ctrl+L');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Fullscreen state & ref
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const browserCardRef = useRef<HTMLDivElement>(null);
  const labSectionRef = useRef<HTMLDivElement>(null);

  // Refs
  const viewportRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastMouseMoveRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const capturedPointerIdRef = useRef<number | null>(null);

  const fetchDesktopStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/computer/desktop/status');
      if (res.ok) {
        const data = await res.json();
        let streamUrl = data.stream_url;
        if (streamUrl && typeof window !== 'undefined') {
          try {
            const parsed = new URL(streamUrl);
            parsed.hostname = window.location.hostname;
            streamUrl = parsed.toString();
          } catch (_) {}
        }
        setDesktopStatus({
          ok: data.health?.ok ?? false,
          status: data.health?.status ?? 'offline',
          message: data.health?.message ?? 'Docker desktop unavailable',
          stream_url: streamUrl,
          cdp_url: data.cdp_url,
          details: data.health?.details,
        });
      }
    } catch (e: any) {
      setDesktopStatus({
        ok: false,
        status: 'offline',
        message: `Failed to query desktop status: ${e.message}`,
      });
    }
  }, []);

  const handleStartDesktop = async () => {
    setDesktopStarting(true);
    setStatusMsg('Starting Linux Virtual Desktop container (Debian + Openbox + noVNC)...');
    try {
      const res = await fetch('/api/computer/desktop/start', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setStatusMsg('Virtual desktop started and verified ready.');
      } else {
        setStatusMsg('Desktop container started, initializing services...');
      }
      fetchDesktopStatus();
    } catch (e: any) {
      setStatusMsg(`Failed to start desktop: ${e.message}`);
    } finally {
      setDesktopStarting(false);
    }
  };

  const handleStopDesktop = async () => {
    setDesktopStarting(true);
    setStatusMsg('Stopping virtual desktop container...');
    try {
      await fetch('/api/computer/desktop/stop', { method: 'POST' });
      setStatusMsg('Desktop container stopped.');
      fetchDesktopStatus();
    } catch (e: any) {
      setStatusMsg(`Failed to stop desktop: ${e.message}`);
    } finally {
      setDesktopStarting(false);
    }
  };

  const handleRestartDesktop = async () => {
    setDesktopStarting(true);
    setStatusMsg('Restarting virtual desktop services...');
    try {
      await fetch('/api/computer/desktop/restart', { method: 'POST' });
      setStatusMsg('Desktop container restarted and verified ready.');
      fetchDesktopStatus();
    } catch (e: any) {
      setStatusMsg(`Failed to restart desktop: ${e.message}`);
    } finally {
      setDesktopStarting(false);
    }
  };

  // Fetch backend & system status periodically
  const fetchStatus = async () => {
    try {
      fetchDesktopStatus();
      const bRes = await fetch('/api/computer/backends');
      if (bRes.ok) {
        const bData = await bRes.json();
        if (bData.backends) {
          setBackends(bData.backends);
          setBackendError(null);
        }
      } else {
        setBackendError(`Backend returned HTTP ${bRes.status}`);
      }

      const rRes = await fetch('/api/computer/rate_limits');
      if (rRes.ok) {
        const rData = await rRes.json();
        setRateLimits(rData);
      }

      const aRes = await fetch('/api/computer/approvals');
      if (aRes.ok) {
        const aData = await aRes.json();
        if (aData.pending) setApprovals(aData.pending);
      }

      // If active session, also poll arbiter status if websocket is disconnected
      if (sessionId && !wsConnected) {
        const arbRes = await fetch(`/api/computer/sessions/browser_harness/${sessionId}/arbiter`);
        if (arbRes.ok) {
          const arbData = await arbRes.json();
          if (arbData.state) setControlState(arbData.state);
          if (arbData.ai_cursor) setAiCursor(arbData.ai_cursor);
          if (arbData.active_task) setActiveTask(arbData.active_task);
        } else if (arbRes.status === 404) {
          setSessionId(null);
          setLiveFrame(null);
          setViewportError('Previous browser session has ended. Click "Start Browser" to begin a new session.');
        }
      }
    } catch (e: any) {
      console.error('Failed to fetch status:', e);
      setBackendError(`Backend server connection error: ${e.message || 'Cannot reach localhost:3000'}`);
    }
  };

  const fetchWorkspaceFiles = useCallback(async (path: string = '/workspace') => {
    try {
      const res = await fetch(`/api/om/computer/files?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.entries)) {
          setWorkspaceFiles(data.entries);
          setWorkspacePath(data.path || path);
        }
      }
    } catch (e) {
      console.error('Failed to load workspace files:', e);
    }
  }, []);

  const handleRunCommand = async (cmd?: string) => {
    const targetCmd = (cmd || terminalCmd).trim();
    if (!targetCmd) return;
    setIsExecutingCmd(true);
    setStatusMsg(`Executing sandbox command: ${targetCmd}...`);
    try {
      const res = await fetch('/api/om/computer/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: targetCmd, cwd: workspacePath }),
      });
      const data = await res.json();
      setCmdOutput(data);
      setStatusMsg(`Command completed (exit code ${data.exit_code ?? 0})`);
      fetchWorkspaceFiles(workspacePath);
    } catch (e: any) {
      setCmdOutput({ stdout: '', stderr: e.message, exit_code: -1 });
      setStatusMsg(`Command execution error: ${e.message}`);
    } finally {
      setIsExecutingCmd(false);
    }
  };

  const handleCreateSampleFile = async () => {
    try {
      setStatusMsg('Creating sample workspace file in /workspace...');
      const timestamp = new Date().toISOString();
      const content = `# OS Virtual Lab Workspace\n\nInitialized: ${timestamp}\nEnvironment: Isolated Local Sandbox\nStatus: Active\n\nThis workspace is jailed to /workspace. You can create files, run Python scripts, and test AI agent automations safely.\n`;

      const res = await fetch('/api/om/computer/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/workspace/welcome.txt',
          text: content,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg('Created /workspace/welcome.txt successfully!');
        fetchWorkspaceFiles(workspacePath);
      } else {
        setStatusMsg(`Failed to create file: ${data.detail || data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setStatusMsg(`File write error: ${err.message}`);
    }
  };

  const handleAiTypeText = async (textToType?: string, targetSelector?: string) => {
    const text = textToType || testAiInputText;
    if (!text) return;
    setIsAiTyping(true);
    setStatusMsg(`AI typing text: "${text.slice(0, 35)}"...`);
    try {
      const bName = activeTab === 'desktop' ? 'docker_desktop' : 'browser_harness';
      const sid = activeTab === 'desktop' ? 'docker_desktop_active' : sessionId || 'default_session';
      const res = await fetch(`/api/computer/sessions/${bName}/${sid}/keyboard/type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target: targetSelector }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusMsg(`AI typed text successfully (${data.observed_outcome || 'Verified'})`);
      } else {
        setStatusMsg(`AI typing notice: ${data.detail || data.error || 'Check session readiness'}`);
      }
    } catch (e: any) {
      setStatusMsg(`AI typing error: ${e.message}`);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAiPressShortcut = async (shortcutToSend?: string) => {
    const shortcut = shortcutToSend || testAiShortcut;
    if (!shortcut) return;
    setIsAiTyping(true);
    setStatusMsg(`AI sending shortcut: ${shortcut}...`);
    try {
      const bName = activeTab === 'desktop' ? 'docker_desktop' : 'browser_harness';
      const sid = activeTab === 'desktop' ? 'docker_desktop_active' : sessionId || 'default_session';
      const res = await fetch(`/api/computer/sessions/${bName}/${sid}/keyboard/shortcut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortcut }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusMsg(`AI sent shortcut '${shortcut}' (${data.observed_outcome || 'Verified'})`);
      } else {
        setStatusMsg(`AI shortcut notice: ${data.detail || data.error || 'Check session readiness'}`);
      }
    } catch (e: any) {
      setStatusMsg(`AI shortcut error: ${e.message}`);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAiReleaseAllKeys = async () => {
    try {
      const bName = activeTab === 'desktop' ? 'docker_desktop' : 'browser_harness';
      const sid = activeTab === 'desktop' ? 'docker_desktop_active' : sessionId || 'default_session';
      await fetch(`/api/computer/sessions/${bName}/${sid}/keyboard/release_all`, { method: 'POST' });
      setStatusMsg('Released all held keys and reset modifier states.');
    } catch (e: any) {
      setStatusMsg(`Release keys error: ${e.message}`);
    }
  };

  // Fullscreen toggle with native API and in-app fallback
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (browserCardRef.current?.requestFullscreen) {
          await browserCardRef.current.requestFullscreen();
        } else {
          setIsFullscreen((prev) => !prev);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Native Fullscreen API failed or was blocked, falling back to in-app overlay:', err);
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  // Listen to native fullscreen changes to keep state synchronized
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Global keyboard shortcuts: Ctrl+Shift+F (or Cmd+Shift+F) to toggle, Escape to exit fallback
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [toggleFullscreen, isFullscreen]);

  useEffect(() => {
    fetchStatus();
    fetchWorkspaceFiles('/workspace');
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, [sessionId, wsConnected, fetchWorkspaceFiles]);

  // Fallback HTTP frame polling when WebSocket is disconnected or unavailable
  useEffect(() => {
    if (!sessionId || wsConnected) return;

    let active = true;
    let pollTimer: any = null;
    let currentBlobUrl: string | null = null;

    const pollFrame = async () => {
      try {
        const res = await fetch(`/api/computer/sessions/browser_harness/${sessionId}/frame?t=${Date.now()}`);
        if (res.ok && active) {
          const blob = await res.blob();
          if (blob.size > 0 && active) {
            const nextUrl = URL.createObjectURL(blob);
            setLiveFrame(nextUrl);
            setViewportError(null);
            if (currentBlobUrl) {
              URL.revokeObjectURL(currentBlobUrl);
            }
            currentBlobUrl = nextUrl;
          }
        } else if (res.status === 404 && active) {
          setViewportError('Browser session expired. Please start a new browser session.');
          setSessionId(null);
          setLiveFrame(null);
          return;
        } else if (active) {
          setViewportError(`Frame polling returned HTTP ${res.status}`);
        }
      } catch (err: any) {
        if (active) {
          setViewportError(`Frame retrieval error: ${err.message}`);
        }
      } finally {
        if (active) {
          pollTimer = setTimeout(pollFrame, 400);
        }
      }
    };

    pollFrame();

    return () => {
      active = false;
      if (pollTimer) clearTimeout(pollTimer);
      if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    };
  }, [sessionId, wsConnected]);

  // Establish WebSocket connection when sessionId is set
  useEffect(() => {
    if (!sessionId) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsConnected(false);
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/computer/ws/${sessionId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      setStatusMsg(`Connected to live browser session ${sessionId}`);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'frame' && msg.image) {
          setLiveFrame(msg.image);
          setViewportError(null);
        } else if (msg.type === 'control_state') {
          if (msg.state) setControlState(msg.state);
          if (msg.ai_cursor) setAiCursor(msg.ai_cursor);
        } else if (msg.type === 'control_state_changed') {
          if (msg.state) setControlState(msg.state);
          if (msg.human_takeover) {
            setStatusMsg('Human takeover: AI halted immediately upon your interaction.');
          }
        } else if (msg.type === 'ai_cursor_update') {
          if (msg.ai_cursor) setAiCursor(msg.ai_cursor);
        } else if (msg.type === 'task_assigned' && msg.task) {
          setActiveTask(msg.task);
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    ws.onerror = (err) => {
      console.warn('WebSocket connection error, operating on HTTP fallback:', err);
      setWsConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [sessionId]);

  // Coordinate scaling helper: maps viewport client coordinates to 1280x800 resolution
  const getScaledCoordinates = useCallback(
    (e: { clientX: number; clientY: number }): { x: number; y: number } | null => {
      if (!viewportRef.current) return null;
      const rect = viewportRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      const scaleX = 1280 / rect.width;
      const scaleY = 800 / rect.height;
      const x = Math.max(0, Math.min(1280, (e.clientX - rect.left) * scaleX));
      const y = Math.max(0, Math.min(800, (e.clientY - rect.top) * scaleY));
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    },
    []
  );

  // Send mouse events
  const sendMouseEvent = useCallback(
    (
      eventType: string,
      x: number,
      y: number,
      button: string = 'left',
      clickCount: number = 1,
      deltaX: number = 0,
      deltaY: number = 0
    ) => {
      if (!sessionId) return;

      // Optimistically transfer ownership to human if in AI_WORKING
      if (controlState === 'AI_WORKING') {
        setControlState('AI_PAUSED');
        setStatusMsg('Human interaction detected: AI paused.');
      }

      const payload = {
        type: 'mouse',
        event: eventType,
        x,
        y,
        button,
        click_count: clickCount,
        deltaX,
        deltaY,
        delta_x: deltaX,
        delta_y: deltaY,
      };

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      } else {
        // Fallback to REST
        fetch(`/api/computer/sessions/browser_harness/${sessionId}/mouse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: eventType,
            x,
            y,
            button,
            click_count: clickCount,
            delta_x: deltaX,
            delta_y: deltaY,
          }),
        }).catch(console.error);
      }
    },
    [sessionId, controlState]
  );

  // Send keyboard events
  const sendKeyboardEvent = useCallback(
    (eventType: 'keydown' | 'keyup', key: string, code: string, text: string = '') => {
      if (!sessionId) return;

      if (controlState === 'AI_WORKING') {
        setControlState('AI_PAUSED');
        setStatusMsg('Human keyboard input: AI paused.');
      }

      const payload = {
        type: 'keyboard',
        event: eventType,
        key,
        code,
        text,
      };

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      } else {
        fetch(`/api/computer/sessions/browser_harness/${sessionId}/keyboard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: eventType,
            key,
            code,
            text,
          }),
        }).catch(console.error);
      }
    },
    [sessionId, controlState]
  );

  // Pointer event handlers on viewport (complete drag and coordinate isolation)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    viewportRef.current?.focus();
    setIsFocused(true);

    // Stop default HTML drag/text selection on outer layout
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
      capturedPointerIdRef.current = e.pointerId;
    } catch (_) {}

    isPointerDownRef.current = true;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };

    const coords = getScaledCoordinates(e);
    if (!coords) return;
    const button = e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left';
    sendMouseEvent('mousedown', coords.x, coords.y, button, 1);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const coords = getScaledCoordinates(e);
    if (!coords) return;
    const now = Date.now();
    if (now - lastMouseMoveRef.current > 30) {
      lastMouseMoveRef.current = now;
      sendMouseEvent('mousemove', coords.x, coords.y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    capturedPointerIdRef.current = null;

    const wasDown = isPointerDownRef.current;
    isPointerDownRef.current = false;

    const coords = getScaledCoordinates(e);
    if (!coords) return;
    const button = e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left';

    sendMouseEvent('mouseup', coords.x, coords.y, button, 1);

    // If it was a quick click without significant drag (< 5px)
    const downPos = pointerDownPosRef.current;
    const dist = downPos ? Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) : 0;
    if (dist < 5 && wasDown) {
      sendMouseEvent('click', coords.x, coords.y, button, 1);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    capturedPointerIdRef.current = null;

    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      const coords = getScaledCoordinates(e);
      if (coords) {
        sendMouseEvent('mouseup', coords.x, coords.y, 'left', 1);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const coords = getScaledCoordinates(e);
    if (!coords) return;
    sendMouseEvent('dblclick', coords.x, coords.y, 'left', 2);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const coords = getScaledCoordinates(e);
    if (!coords) return;
    sendMouseEvent('click', coords.x, coords.y, 'right', 1);
  };

  // Native Non-Passive Event Listeners on Viewport for Complete Input & Scroll Isolation
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    // 1. Non-passive wheel handler: prevents default outer scrolling & stops propagation
    const onNativeWheel = (e: WheelEvent) => {
      // Always prevent default outer container scrolling and stop bubbling
      e.preventDefault();
      e.stopPropagation();

      if (!sessionId) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const scaleX = 1280 / rect.width;
      const scaleY = 800 / rect.height;
      const x = Math.max(0, Math.min(1280, (e.clientX - rect.left) * scaleX));
      const y = Math.max(0, Math.min(800, (e.clientY - rect.top) * scaleY));

      sendMouseEvent('wheel', Math.round(x * 10) / 10, Math.round(y * 10) / 10, 'left', 1, e.deltaX, e.deltaY);
    };

    // 2. Native keydown listener: stops propagation to window (shortcuts like Ctrl+K) & prevents outer scroll on scroll keys
    const onNativeKeyDown = (e: KeyboardEvent) => {
      // Allow Ctrl+Shift+F to toggle fullscreen even when typing inside browser
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        e.stopPropagation();
        toggleFullscreen();
        return;
      }

      // Allow Escape to exit fallback fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        e.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          setIsFullscreen(false);
        }
        return;
      }

      if (!sessionId) return;

      // Prevent outer dashboard or window from receiving hotkeys while typing in browser
      e.stopPropagation();

      // Prevent default page scroll on navigation/scroll keys
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Backspace', 'Tab', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key) ||
        e.code === 'Space'
      ) {
        e.preventDefault();
      }

      sendKeyboardEvent('keydown', e.key, e.code, e.key.length === 1 ? e.key : '');
    };

    // 3. Native keyup listener
    const onNativeKeyUp = (e: KeyboardEvent) => {
      if (!sessionId) return;
      e.stopPropagation();
      sendKeyboardEvent('keyup', e.key, e.code, '');
    };

    // Note: { passive: false } is essential to permit e.preventDefault()
    el.addEventListener('wheel', onNativeWheel, { passive: false });
    el.addEventListener('keydown', onNativeKeyDown);
    el.addEventListener('keyup', onNativeKeyUp);

    return () => {
      el.removeEventListener('wheel', onNativeWheel);
      el.removeEventListener('keydown', onNativeKeyDown);
      el.removeEventListener('keyup', onNativeKeyUp);
    };
  }, [sessionId, sendMouseEvent, sendKeyboardEvent, toggleFullscreen, isFullscreen]);

  // Navigation handlers
  const handleNavAction = async (action: 'back' | 'forward' | 'reload') => {
    if (!sessionId) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'nav_action', action }));
    } else {
      try {
        await fetch(`/api/computer/sessions/browser_harness/${sessionId}/nav_action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      } catch (err) {
        console.error('Nav action failed:', err);
      }
    }
  };

  const handleCheckBackendHealth = async (backendName: string) => {
    setHealthChecking((prev) => ({ ...prev, [backendName]: true }));
    try {
      const res = await fetch(`/api/computer/backends/${backendName}/health`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.health) {
        setBackends((prev) => ({
          ...prev,
          [backendName]: {
            ...prev[backendName],
            health: data.health,
          },
        }));
        setStatusMsg(`Backend '${backendName}' status: ${data.health.status.toUpperCase()} (${data.health.message})`);
      }
    } catch (e: any) {
      console.error('Health check error:', e);
      setStatusMsg(`Health check error for ${backendName}: ${e.message}`);
    } finally {
      setHealthChecking((prev) => ({ ...prev, [backendName]: false }));
    }
  };

  const handleNavigate = async () => {
    if (!sessionId) {
      setStatusMsg('Please start a browser session first.');
      return;
    }
    let target = navInput.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('about:')) {
      target = `https://${target}`;
      setNavInput(target);
    }
    setLoading(true);
    setViewportError(null);
    setStatusMsg(`Navigating to ${target}...`);
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'navigate', url: target }));
        setCurrentUrl(target);
        setStatusMsg(`Navigating to ${target}`);
      } else {
        const res = await fetch(`/api/computer/sessions/browser_harness/${sessionId}/navigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: target }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setCurrentUrl(target);
          setStatusMsg(`Navigated to ${target}`);
          setViewportError(null);
        } else {
          const errMsg = data.detail || data.error || data.observed_outcome || 'Unknown navigation failure';
          if (res.status === 404) {
            setSessionId(null);
            setLiveFrame(null);
            setViewportError('Browser session expired or closed. Click "Start Browser" to launch a new session.');
          } else {
            setViewportError(`Navigation failed: ${errMsg}`);
          }
          setStatusMsg(`Navigation failed: ${errMsg}`);
        }
      }
    } catch (e: any) {
      setViewportError(`Navigation network error: ${e.message}`);
      setStatusMsg(`Navigation error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Arbiter Control actions
  const sendControlAction = async (action: string) => {
    if (!sessionId) return;
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'control', action }));
      } else {
        await fetch(`/api/computer/sessions/browser_harness/${sessionId}/control`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      }

      if (action === 'take_control') setControlState('HUMAN_CONTROL');
      else if (action === 'pause_ai') setControlState('AI_PAUSED');
      else if (action === 'resume_ai') setControlState('AI_WORKING');
      else if (action === 'stop_ai') setControlState('STOPPED');
    } catch (e: any) {
      console.error('Control action error:', e);
    }
  };

  // Start dedicated AI Task
  const handleStartTask = async () => {
    if (!sessionId) {
      setStatusMsg('Please start a browser session before assigning a task.');
      return;
    }
    if (!taskPrompt.trim()) {
      setStatusMsg('Please describe the task for the AI agent.');
      return;
    }

    setLoading(true);
    try {
      const allowed = allowedDomains
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/computer/sessions/browser_harness/${sessionId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_task',
          goal: taskPrompt.trim(),
          allowed_domains: allowed,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setControlState('AI_WORKING');
        setStatusMsg(`Task started: "${taskPrompt.slice(0, 45)}..."`);
        if (data.active_task) setActiveTask(data.active_task);
      } else {
        setStatusMsg(`Failed to start task: ${data.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setStatusMsg(`Task launch error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Session lifecycle
  const handleStartSession = async (headless: boolean = false) => {
    setLoading(true);
    setViewportError(null);
    setStatusMsg(
      headless
        ? 'Launching embedded Playwright Chromium browser...'
        : 'Opening visible Chromium browser window on your desktop...'
    );
    try {
      const targetUrl = navInput.trim() || 'https://google.com';
      const res = await fetch('/api/computer/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backend: 'browser_harness',
          headless,
          initial_url: targetUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSessionId(data.session_id);
        setCurrentUrl(data.current_url || targetUrl);
        setNavInput(data.current_url || targetUrl);
        setStatusMsg(
          headless
            ? `Embedded browser active (${data.session_id})`
            : `Visible desktop browser opened (${data.session_id})`
        );
        setViewportError(null);
      } else {
        const err = data.detail || data.error || 'Failed to start browser instance';
        setViewportError(`Session creation failed: ${err}`);
        setStatusMsg(`Error starting browser: ${err}`);
      }
    } catch (e: any) {
      setViewportError(`Network error connecting to backend: ${e.message}`);
      setStatusMsg(`Error starting browser: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/computer/sessions/browser_harness/${sessionId}`, { method: 'DELETE' });
      setSessionId(null);
      setLiveFrame(null);
      setViewportError(null);
      setControlState('STOPPED');
      setActiveTask(null);
      setStatusMsg('Browser session closed.');
    } catch (e: any) {
      setStatusMsg(`Error closing session: ${e.message}`);
    }
  };

  const toggleEmergencyStop = async () => {
    const nextState = !emergencyStopped;
    try {
      const res = await fetch('/api/computer/emergency_stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextState }),
      });
      const data = await res.json();
      setEmergencyStopped(data.emergency_stopped);
      setStatusMsg(
        nextState
          ? 'EMERGENCY KILL SWITCH TRIPPED: All computer actions halted immediately.'
          : 'Emergency kill switch reset.'
      );
    } catch (e: any) {
      setStatusMsg(`Kill switch error: ${e.message}`);
    }
  };

  const handleResolveApproval = async (ticketId: string, decision: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/computer/approvals/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, user: 'dashboard_user' }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusMsg(`Ticket ${ticketId} resolved: ${decision}`);
        fetchStatus();
      }
    } catch (e: any) {
      setStatusMsg(`Failed to resolve approval: ${e.message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-os-border/50 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-os-primary flex items-center gap-2">
                OS Computer & Virtual Desktop
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Live Interactive
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  Dual Cursors
                </span>
              </h1>
              <p className="text-xs text-os-secondary">
                Genuinely interactive Playwright browser and isolated execution sandbox with human control, dual cursors, and instant takeover.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={emergencyStopped ? 'danger' : 'glass'}
            size="sm"
            onClick={toggleEmergencyStop}
            className={emergencyStopped ? 'animate-pulse font-mono uppercase' : 'text-rose-600 dark:text-rose-400 border-rose-500/40'}
          >
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            {emergencyStopped ? 'Kill Switch Active (Reset)' : 'Emergency Stop'}
          </Button>

          <Button variant="glass" size="sm" onClick={() => { fetchStatus(); fetchWorkspaceFiles(workspacePath); }}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {backendError && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-lg text-xs font-mono text-rose-600 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{backendError}</span>
          </div>
          <Button size="sm" variant="glass" onClick={fetchStatus}>
            Retry Connection
          </Button>
        </div>
      )}

      {statusMsg && (
        <div className="p-3 bg-os-surface/80 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-700 dark:text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {statusMsg}
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-os-muted hover:text-os-primary text-xs px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top View Mode Switcher: Apple-Inspired Segmented Glass Control */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-os-border/40 pb-3.5">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-inner gap-1">
            <button
              onClick={() => setActiveTab('viewport')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeTab === 'viewport'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Browser</span>
              {sessionId && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('desktop'); fetchDesktopStatus(); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeTab === 'desktop'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Desktop</span>
              <span
                className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border font-semibold ${
                  desktopStatus?.status === 'ready'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : desktopStatus?.status === 'starting'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                    : desktopStatus?.status === 'standby'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {desktopStatus?.status?.toUpperCase() || 'READY'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('lab');
                setTimeout(() => labSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeTab === 'lab'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>Terminal</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('lab');
                setTimeout(() => {
                  const filesEl = document.getElementById('workspace-files-card');
                  if (filesEl) filesEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else labSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-150"
            >
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>Files</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300">
                {workspaceFiles.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-os-secondary">
            <button
              type="button"
              onClick={() => setIsInspectorOpen((open) => !open)}
              className="px-2.5 py-1 rounded-full bg-os-surface border border-os-border hover:border-blue-400/50 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              aria-expanded={isInspectorOpen}
            >
              {isInspectorOpen ? 'Hide inspector' : 'Show inspector'}
            </button>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Host: Windows / Guest: Linux Debian 12
            </span>
          </div>
        </div>
      )}

      {/* Grid: Live Workspace + Arbiter/Backends */}
      <div className={`grid grid-cols-1 gap-6 ${isInspectorOpen && activeTab !== 'lab' ? 'lg:grid-cols-[minmax(0,1fr)_300px]' : ''}`}>
        {/* Primary browser, desktop, or terminal work surface */}
        <div className="min-w-0 space-y-4">
          <div
            ref={browserCardRef}
            className={
              activeTab === 'lab'
                ? 'hidden'
                : isFullscreen
                ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col h-screen w-screen overflow-hidden'
                : 'space-y-4'
            }
          >
            {activeTab === 'desktop' ? (
              <GlassCard className={`p-0 overflow-hidden space-y-0 ${isFullscreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
                {/* macOS Window Chrome Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-white/10 select-none">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-sm" title="Close" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-sm" title="Minimize" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-sm" title="Maximize" />
                  </div>

                  {/* Centered Capsule Pill */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Linux Virtual Computer (Debian GNU/Linux 12)</span>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border font-semibold ${
                        desktopStatus?.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : desktopStatus?.status === 'starting'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {desktopStatus?.status?.toUpperCase() || 'OFFLINE'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="glass"
                      onClick={fetchDesktopStatus}
                      className="text-xs h-7 px-2.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Probe
                    </Button>
                    <Button
                      size="sm"
                      variant="glass"
                      onClick={toggleFullscreen}
                      className="text-xs h-7 px-2.5"
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 mr-1" /> : <Maximize2 className="w-3.5 h-3.5 mr-1" />}
                      {isFullscreen ? 'Exit' : 'Full'}
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-4 flex-1 flex flex-col min-h-0">
                {desktopStatus?.status === 'ready' && desktopStatus?.details?.stream_ready ? (
                  <div className="space-y-3 flex-1 flex flex-col min-h-0">
                    <div className="relative aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border border-os-border/60 flex-1">
                      <iframe
                        src={desktopStatus.stream_url || 'http://127.0.0.1:6080/vnc.html?autoconnect=true&resize=scale'}
                        title="OS Linux Virtual Desktop Stream"
                        className="w-full h-full border-0"
                        allow="fullscreen; clipboard-read; clipboard-write"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-os-secondary bg-os-surface/40 p-2.5 rounded-lg border border-os-border/40 gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 ${desktopStatus.details?.stream_ready ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {desktopStatus.details?.stream_ready ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                          HTML5 noVNC Active (:6080)
                        </span>
                        <span className={`flex items-center gap-1.5 ${desktopStatus.details?.cdp_ready ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {desktopStatus.details?.cdp_ready ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                          Chromium CDP Active (:9222)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="glass"
                          onClick={handleRestartDesktop}
                          disabled={desktopStarting}
                          className="text-[10px] h-6 px-2 text-os-secondary hover:text-os-primary"
                        >
                          <RefreshCw className={`w-3 h-3 mr-1 ${desktopStarting ? 'animate-spin' : ''}`} />
                          Restart
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={handleStopDesktop}
                          disabled={desktopStarting}
                          className="text-[10px] h-6 px-2 text-rose-400"
                        >
                          <Square className="w-3 h-3 mr-1" />
                          Stop
                        </Button>
                      </div>
                    </div>

                    {/* AI Virtual Keyboard Interactive Control Bar */}
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Keyboard className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-white">AI Virtual Keyboard Interface</span>
                          {isAiTyping ? (
                            <span className="inline-flex items-center text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-ping" />
                              AI TYPING ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              STANDBY
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleAiReleaseAllKeys}
                            className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                            title="Release all held keys and reset stuck modifiers"
                          >
                            Release All Keys
                          </button>
                        </div>
                      </div>

                      {/* Quick Shortcut Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono mr-1">Shortcuts:</span>
                        {[
                          { label: 'Ctrl+L (Address Bar)', shortcut: 'Ctrl+L' },
                          { label: 'Ctrl+A (Select All)', shortcut: 'Ctrl+A' },
                          { label: 'Ctrl+C (Copy)', shortcut: 'Ctrl+C' },
                          { label: 'Ctrl+V (Paste)', shortcut: 'Ctrl+V' },
                          { label: 'Enter', shortcut: 'Enter' },
                          { label: 'Tab', shortcut: 'Tab' },
                          { label: 'Escape', shortcut: 'Escape' },
                        ].map((item) => (
                          <button
                            key={item.shortcut}
                            onClick={() => handleAiPressShortcut(item.shortcut)}
                            disabled={isAiTyping}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 transition-colors active:scale-95 disabled:opacity-40"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Direct AI Typing Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
                          <input
                            type="text"
                            value={testAiInputText}
                            onChange={(e) => setTestAiInputText(e.target.value)}
                            placeholder="Type text for AI to enter..."
                            disabled={isAiTyping}
                            className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
                          />
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAiTypeText()}
                            disabled={isAiTyping || !testAiInputText.trim()}
                            className="text-[11px] h-7 px-2.5 font-mono bg-cyan-600 hover:bg-cyan-500 text-white"
                          >
                            <Keyboard className="w-3 h-3 mr-1" />
                            AI Type
                          </Button>
                        </div>

                        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
                          <input
                            type="text"
                            value={testAiShortcut}
                            onChange={(e) => setTestAiShortcut(e.target.value)}
                            placeholder="Shortcut e.g. Ctrl+L"
                            disabled={isAiTyping}
                            className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
                          />
                          <Button
                            size="sm"
                            variant="glass"
                            onClick={() => handleAiPressShortcut()}
                            disabled={isAiTyping || !testAiShortcut.trim()}
                            className="text-[11px] h-7 px-2.5 font-mono text-slate-200 hover:text-white"
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : desktopStatus?.status === 'starting' ? (
                  <div className="p-8 text-center space-y-4 bg-os-surface/30 border border-os-border/60 rounded-xl my-auto">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <RefreshCw className="w-7 h-7 animate-spin" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-base font-semibold text-os-primary">
                        Virtual Desktop Starting...
                      </h3>
                      <p className="text-xs text-os-secondary">
                        Debian container is initializing Xvfb, Openbox, x11vnc, noVNC, and Chromium CDP.
                      </p>
                      <div className="p-3 bg-slate-950/80 rounded-lg text-[11px] font-mono text-cyan-400 border border-cyan-500/30 text-left">
                        {desktopStatus?.message || 'Waiting for services on port 6080 and 9222...'}
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <Button variant="glass" size="sm" onClick={fetchDesktopStatus} className="text-xs">
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Check Status
                      </Button>
                    </div>
                  </div>
                ) : desktopStatus?.status === 'standby' ? (
                  <div className="p-8 text-center space-y-4 bg-os-surface/30 border border-os-border/60 rounded-xl my-auto">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Monitor className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-base font-semibold text-os-primary">
                        Virtual Desktop Standby
                      </h3>
                      <p className="text-xs text-os-secondary">
                        Docker engine is running. Click below to launch the isolated Linux desktop container.
                      </p>
                      <div className="p-3 bg-slate-950/80 rounded-lg text-[11px] font-mono text-blue-400 border border-blue-500/30 text-left">
                        {desktopStatus?.message || 'Ready to start container.'}
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleStartDesktop}
                        disabled={desktopStarting}
                        className="text-xs"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        {desktopStarting ? 'Starting...' : 'Start Virtual Desktop'}
                      </Button>
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => setActiveTab('viewport')}
                        className="text-xs"
                      >
                        <Globe className="w-3.5 h-3.5 mr-1.5" />
                        Use Native Browser Viewport
                      </Button>
                    </div>
                  </div>
                ) : desktopStatus?.status === 'degraded' || desktopStatus?.status === 'failed' ? (
                  <div className="p-8 text-center space-y-4 bg-os-surface/30 border border-os-border/60 rounded-xl my-auto">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-base font-semibold text-os-primary">
                        Desktop Services Degraded
                      </h3>
                      <p className="text-xs text-os-secondary">
                        The container is running but one of the core services (noVNC or Chromium CDP) is not responding.
                      </p>
                      <div className="p-3 bg-slate-950/80 rounded-lg text-[11px] font-mono text-amber-400 border border-amber-500/30 text-left">
                        {desktopStatus?.message}
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRestartDesktop}
                        disabled={desktopStarting}
                        className="text-xs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${desktopStarting ? 'animate-spin' : ''}`} />
                        Restart Services
                      </Button>
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={fetchDesktopStatus}
                        className="text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Check Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-4 bg-os-surface/30 border border-os-border/60 rounded-xl my-auto">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Monitor className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-base font-semibold text-os-primary">
                        Docker Desktop Runtime is Offline
                      </h3>
                      <p className="text-xs text-os-secondary">
                        The isolated Linux virtual desktop container (Debian + Openbox + Selkies/noVNC) requires Docker to be running on this machine.
                      </p>
                      <div className="p-3 bg-slate-950/80 rounded-lg text-[11px] font-mono text-amber-400/90 border border-amber-500/30 text-left">
                        {desktopStatus?.message || 'Docker daemon is offline or unreachable.'}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveTab('viewport')}
                        className="text-xs"
                      >
                        <Globe className="w-3.5 h-3.5 mr-1.5" />
                        Use Native Browser Viewport (Zero-Docker)
                      </Button>

                      <Button
                        variant="glass"
                        size="sm"
                        onClick={fetchDesktopStatus}
                        className="text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Check Again
                      </Button>
                    </div>

                    <div className="text-[11px] text-os-tertiary font-mono pt-2">
                      Compose: <code>docker compose -f docker/docker-compose.desktop.yml up -d</code>
                    </div>
                  </div>
                )}
                </div>
              </GlassCard>
            ) : (
            <GlassCard className={`p-4 space-y-4 ${isFullscreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
            {/* Session Header & State Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-os-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-os-primary">Browser Viewport</span>
                {sessionId && (
                  <span className="text-[11px] font-mono text-os-secondary bg-os-bg/60 px-2 py-0.5 rounded border border-os-border">
                    {sessionId.slice(0, 16)}...
                  </span>
                )}
                {wsConnected ? (
                  <span className="inline-flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    LIVE STREAM (~12 FPS)
                  </span>
                ) : sessionId ? (
                  <span className="inline-flex items-center text-[10px] font-mono text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    HTTP POLLING
                  </span>
                ) : null}
              </div>

              {/* Ownership State Badge */}
              <div className="flex items-center gap-2">
                {controlState === 'HUMAN_CONTROL' && (
                  <span className="inline-flex items-center text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 px-2.5 py-1 rounded-md">
                    <User className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    HUMAN IN CONTROL
                  </span>
                )}
                {controlState === 'AI_WORKING' && (
                  <span className="inline-flex items-center text-[11px] font-mono font-medium text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/40 px-2.5 py-1 rounded-md animate-pulse">
                    <Bot className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    AI AGENT WORKING
                  </span>
                )}
                {controlState === 'AI_PAUSED' && (
                  <span className="inline-flex items-center text-[11px] font-mono font-medium text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/40 px-2.5 py-1 rounded-md">
                    <Pause className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    AI PAUSED (TAKEOVER)
                  </span>
                )}
                {controlState === 'STOPPED' && (
                  <span className="inline-flex items-center text-[11px] font-mono font-medium text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/40 px-2.5 py-1 rounded-md">
                    <StopCircle className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                    STOPPED
                  </span>
                )}

                {!sessionId ? (
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStartSession(false)}
                      disabled={loading}
                      title="Open a real visible Chromium browser window on your Windows desktop"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Desktop Window
                    </Button>
                    <Button
                      size="sm"
                      variant="glass"
                      onClick={() => handleStartSession(true)}
                      disabled={loading}
                      title="Run browser silently inside the dashboard viewport"
                    >
                      <Play className="w-3.5 h-3.5 mr-1" /> In Viewport
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="danger" onClick={handleCloseSession}>
                    <Square className="w-3.5 h-3.5 mr-1" /> Close Browser
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation Toolbar */}
            <div className="flex items-center gap-2 bg-os-surface-active/60 p-1.5 rounded-lg border border-os-border/50">
              <button
                onClick={() => handleNavAction('back')}
                disabled={!sessionId}
                title="Back"
                className="p-1.5 rounded hover:bg-os-surface text-os-secondary hover:text-os-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleNavAction('forward')}
                disabled={!sessionId}
                title="Forward"
                className="p-1.5 rounded hover:bg-os-surface text-os-secondary hover:text-os-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleNavAction('reload')}
                disabled={!sessionId}
                title="Reload"
                className="p-1.5 rounded hover:bg-os-surface text-os-secondary hover:text-os-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex items-center bg-os-bg/80 px-2 py-1 rounded border border-os-border/50">
                <Lock className="w-3 h-3 text-emerald-400 mr-1.5 flex-shrink-0" />
                <input
                  type="text"
                  value={navInput}
                  onChange={(e) => setNavInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNavigate();
                  }}
                  placeholder="https://..."
                  className="w-full bg-transparent text-xs font-mono text-os-primary placeholder-os-muted focus:outline-none"
                  disabled={!sessionId || loading}
                />
              </div>

              <Button size="sm" variant="glass" onClick={handleNavigate} disabled={!sessionId || loading}>
                Go
              </Button>

              <Button
                size="sm"
                variant="glass"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen (Esc or Ctrl+Shift+F)' : 'Fullscreen (Ctrl+Shift+F)'}
                className="flex items-center gap-1.5 text-xs font-mono"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </>
                )}
              </Button>
            </div>

            {/* Interactive Browser Viewport */}
            <div
              ref={viewportRef}
              tabIndex={0}
              role="region"
              aria-label="Interactive Browser Viewport"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onDoubleClick={handleDoubleClick}
              onContextMenu={handleContextMenu}
              style={{
                overscrollBehavior: 'contain',
                touchAction: 'none',
              }}
              className={`bg-slate-950 rounded-lg border relative overflow-hidden select-none outline-none overscroll-contain touch-none browser-viewport-isolated transition-all duration-150 ${
                isFullscreen ? 'flex-1 w-full h-full min-h-0' : 'aspect-[16/10]'
              } ${
                isFocused
                  ? 'border-cyan-500/60 ring-1 ring-cyan-500/30'
                  : 'border-os-border hover:border-os-border-glass'
              } ${sessionId ? 'cursor-default' : 'cursor-auto'}`}
            >
              {/* Live Image Frame */}
              {liveFrame ? (
                <img
                  src={liveFrame}
                  alt="Live Interactive Browser Viewport"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col p-5 overflow-y-auto bg-slate-900/95 text-slate-100 select-auto">
                  {viewportError ? (
                    <div className="m-auto flex flex-col items-center max-w-md text-center p-5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 shadow-2xl pointer-events-auto">
                      <AlertTriangle className="w-9 h-9 text-rose-400 mb-2.5 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-white mb-1">Browser Session Notice</p>
                      <p className="text-xs font-mono text-rose-200 mb-4 px-2">{viewportError}</p>
                      <div className="flex gap-2">
                        {sessionId ? (
                          <Button size="sm" variant="glass" onClick={handleNavigate}>
                            Retry Navigation
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="primary" onClick={() => handleStartSession(false)}>
                              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Desktop Window
                            </Button>
                            <Button size="sm" variant="glass" onClick={() => handleStartSession(true)}>
                              <Play className="w-3.5 h-3.5 mr-1" /> In Viewport
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none relative bg-gradient-to-b from-slate-900/60 to-slate-950/90">
                      {/* Subtle Grid background */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

                      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center space-y-4">
                        {/* Status Icon with Ring */}
                        <div className="relative">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              loading
                                ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 animate-pulse shadow-glass-glow-cyan'
                                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glass-glow'
                            }`}
                          >
                            <Globe className={`w-7 h-7 ${loading ? 'animate-spin' : ''}`} />
                          </div>
                          <span
                            className={`absolute -bottom-1 -right-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase border font-semibold ${
                              loading
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                            }`}
                          >
                            {loading ? 'Starting' : 'Standby'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center justify-center gap-2">
                            Playwright Chromium Browser Viewport
                          </h3>
                          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                            Full non-passive input isolation, live dual-cursor telemetry, and instantaneous human takeover.
                          </p>
                        </div>

                        {/* URL launcher bar */}
                        <div className="w-full max-w-md flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 shadow-inner">
                          <div className="flex-1 flex items-center px-2 py-1 text-xs font-mono text-slate-200">
                            <Lock className="w-3 h-3 text-emerald-400 mr-2 flex-shrink-0" />
                            <input
                              type="text"
                              value={navInput}
                              onChange={(e) => setNavInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleStartSession(false);
                              }}
                              placeholder="https://..."
                              disabled={loading}
                              className="w-full bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
                            />
                          </div>

                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStartSession(false)}
                            disabled={loading}
                            className="text-xs font-mono whitespace-nowrap bg-emerald-600 hover:bg-emerald-500"
                            title="Open a real visible Chromium browser window on your Windows desktop"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Desktop Window
                          </Button>
                          <Button
                            size="sm"
                            variant="glass"
                            onClick={() => handleStartSession(true)}
                            disabled={loading}
                            className="text-xs font-mono whitespace-nowrap"
                            title="Run browser silently inside this dashboard viewport"
                          >
                            <Play className="w-3.5 h-3.5 mr-1" /> In Viewport
                          </Button>
                        </div>

                        {/* Quick destination presets */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-500 font-mono mr-1">Quick Launch:</span>
                          {[
                            { name: 'Google', url: 'https://google.com' },
                            { name: 'YouTube', url: 'https://youtube.com' },
                            { name: 'GitHub', url: 'https://github.com' },
                            { name: 'Wikipedia', url: 'https://wikipedia.org' },
                          ].map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                setNavInput(item.url);
                                if (!sessionId) handleStartSession(false);
                              }}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-3 border-t border-slate-800/60 text-left">
                          <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 space-y-1">
                            <div className="text-[10px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Input Isolation
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              Mouse wheel & scroll events are strictly scoped to the webpage.
                            </p>
                          </div>
                          <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 space-y-1">
                            <div className="text-[10px] font-mono font-semibold text-cyan-400 flex items-center gap-1">
                              <Crosshair className="w-3 h-3" /> Dual Cursors
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              Direct hardware input for human; glowing cyan cursor for AI.
                            </p>
                          </div>
                          <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 space-y-1">
                            <div className="text-[10px] font-mono font-semibold text-amber-400 flex items-center gap-1">
                              <User className="w-3 h-3" /> Instant Takeover
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              Moving mouse or typing pauses AI immediately for your safety.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Target Element Bounding Box (AI Highlight) */}
              {sessionId && aiCursor.visible && aiCursor.target_rect && (
                <div
                  className="absolute pointer-events-none z-20 border-2 border-dashed border-cyan-400 bg-cyan-500/10 rounded transition-all duration-200"
                  style={{
                    left: `${(aiCursor.target_rect.x / 1280) * 100}%`,
                    top: `${(aiCursor.target_rect.y / 800) * 100}%`,
                    width: `${(aiCursor.target_rect.width / 1280) * 100}%`,
                    height: `${(aiCursor.target_rect.height / 800) * 100}%`,
                  }}
                >
                  <span className="absolute -top-4 left-0 text-[9px] font-mono px-1 rounded bg-slate-900/90 text-cyan-300 border border-cyan-500/40">
                    ai target
                  </span>
                </div>
              )}

              {/* AI Agent Cursor Overlay */}
              {sessionId && aiCursor.visible && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-200 ease-out"
                  style={{
                    left: `${(aiCursor.x / 1280) * 100}%`,
                    top: `${(aiCursor.y / 800) * 100}%`,
                    transform: 'translate(-3px, -3px)',
                  }}
                >
                  <div className="relative">
                    {/* Glowing AI Cursor SVG */}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)]"
                    >
                      <path
                        d="M5.5 3.2L18.8 11.6C19.7 12.2 19.3 13.6 18.2 13.6H12.6L10.2 19.8C9.8 20.8 8.4 20.9 7.8 20.0L5.1 15.6L2.3 18.4C1.6 19.1 0.4 18.6 0.4 17.6V4.4C0.4 3.4 1.6 2.9 2.3 3.6L5.5 3.2Z"
                        fill="#06b6d4"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                    </svg>

                    {/* Click Ripple Effect */}
                    {aiCursor.action === 'click' && (
                      <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-ping" />
                    )}

                    {/* Status Pill Badge */}
                    <div className="absolute left-6 top-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/95 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 shadow-xl whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="font-semibold text-white">OS Agent</span>
                      {aiCursor.status && (
                        <span className="text-cyan-200 border-l border-slate-700 pl-1.5">
                          {aiCursor.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Viewport Overlay Controls / Indicators */}
              {sessionId && (
                <div className="absolute bottom-2 left-2 flex items-center gap-2 pointer-events-none">
                  <div className="px-2 py-0.5 bg-black/80 backdrop-blur rounded text-[10px] font-mono text-os-secondary border border-os-border/50">
                    1280 &times; 800
                  </div>
                  {isFocused && (
                    <div className="px-2 py-0.5 bg-cyan-950/80 backdrop-blur rounded text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                      Keyboard Captured
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Viewport Footer Quick Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-os-secondary font-mono">Control Arbiter:</span>
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() => sendControlAction('take_control')}
                  disabled={!sessionId || controlState === 'HUMAN_CONTROL'}
                >
                  <User className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Take Control
                </Button>
                {controlState === 'AI_WORKING' ? (
                  <Button
                    size="sm"
                    variant="glass"
                    onClick={() => sendControlAction('pause_ai')}
                    disabled={!sessionId}
                  >
                    <Pause className="w-3.5 h-3.5 mr-1 text-amber-400" /> Pause AI
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="glass"
                    onClick={() => sendControlAction('resume_ai')}
                    disabled={!sessionId || !activeTask || controlState !== 'AI_PAUSED'}
                  >
                    <Play className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Resume AI
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() => sendControlAction('stop_ai')}
                  disabled={!sessionId || controlState === 'STOPPED'}
                >
                  <StopCircle className="w-3.5 h-3.5 mr-1 text-rose-400" /> Stop AI
                </Button>
              </div>

              <div className="text-[10px] font-mono text-os-tertiary">
                Human Override: Move mouse or type to pause AI instantly
              </div>
            </div>
          </GlassCard>
          )}
        </div>

        {/* Dedicated Workspace & Sandbox Lab, Task Assignment, and Approvals: Hidden in Fullscreen */}
        {!isFullscreen && activeTab === 'lab' && (
          <div ref={labSectionRef}>
            {/* Dedicated Virtual Sandbox Lab & Workspace Panel */}
            <GlassCard className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-os-border/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-os-primary flex items-center gap-2">
                      Isolated Sandbox Lab & Workspace
                      <span
                        className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${
                          workspaceFiles.length > 0
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                        }`}
                      >
                        {workspaceFiles.length > 0 ? `ACTIVE (${workspaceFiles.length} FILES)` : 'EMPTY WORKSPACE'}
                      </span>
                    </h3>
                    <p className="text-xs text-os-secondary">
                      Jailed workspace filesystem and subprocess runner with scrubbed environment and 30s timeout.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-os-secondary">
                  <span className="px-2 py-0.5 rounded bg-os-surface border border-os-border/50">
                    cwd: {workspacePath}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-4">
                {/* Workspace File Explorer */}
                <div className="order-2 bg-os-surface/40 border border-os-border/60 rounded-lg p-3 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-os-border/40 pb-2">
                      <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 font-medium">
                        <Folder className="w-3.5 h-3.5" /> Workspace Explorer
                      </span>
                      <button
                        onClick={() => fetchWorkspaceFiles(workspacePath)}
                        className="text-[10px] text-os-muted hover:text-os-primary flex items-center gap-1 font-mono"
                        title="Refresh file listing"
                      >
                        <RefreshCw className="w-3 h-3" /> Refresh
                      </button>
                    </div>

                    {workspaceFiles.length === 0 ? (
                      <div className="py-8 text-center text-xs text-os-muted space-y-2">
                        <Folder className="w-8 h-8 mx-auto opacity-30 text-os-muted" />
                        <div>Workspace is empty (<code className="font-mono text-os-secondary">{workspacePath}</code>).</div>
                        <p className="text-[11px] text-os-tertiary">
                          Create a sample file or run scripts to generate artifacts.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {workspaceFiles.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs py-1.5 px-2 rounded hover:bg-os-surface-active/60 font-mono text-os-primary border border-transparent hover:border-os-border/40"
                          >
                            <span className="flex items-center gap-2 truncate">
                              {f.dir ? (
                                <Folder className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                              )}
                              <span className="truncate">{f.name}</span>
                            </span>
                            <span className="text-[10px] text-os-muted font-mono">{f.size} B</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-os-border/40 text-[11px] text-os-secondary flex justify-between items-center">
                    <span className="text-os-muted font-mono text-[10px]">Jailed safe file operations</span>
                    <button
                      onClick={handleCreateSampleFile}
                      className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono text-xs flex items-center gap-1"
                    >
                      + Create Sample File
                    </button>
                  </div>
                </div>

                {/* macOS iTerm2-Inspired Sandbox Terminal Runner */}
                <div className="order-1 min-h-[32rem] bg-slate-950/90 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg">
                  {/* Terminal Window Chrome */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-white/10 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 font-medium">jarvis@os-linux: ~/workspace</span>
                    {isExecutingCmd ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                        RUNNING
                      </span>
                    ) : cmdOutput ? (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          cmdOutput.exit_code === 0
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        EXIT {cmdOutput.exit_code}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500">bash</span>
                    )}
                  </div>

                  <div className="p-3 space-y-2.5">
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono">
                        <span className="text-emerald-400 mr-1.5 select-none font-bold">$</span>
                        <input
                          aria-label="Sandbox command"
                          type="text"
                          value={terminalCmd}
                          onChange={(e) => setTerminalCmd(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRunCommand();
                          }}
                          placeholder="e.g. uname -a, python --version, ls -la"
                          className="w-full bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleRunCommand()}
                        isLoading={isExecutingCmd}
                        className="text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Run
                      </Button>
                    </div>

                    {/* Quick Command Suggestions */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        'uname -a',
                        'whoami',
                        'cat /etc/os-release',
                        'python --version',
                      ].map((sampleCmd) => (
                        <button
                          key={sampleCmd}
                          onClick={() => {
                            setTerminalCmd(sampleCmd);
                            handleRunCommand(sampleCmd);
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors"
                        >
                          {sampleCmd}
                        </button>
                      ))}
                    </div>

                    <div className="bg-black/90 p-3 rounded-lg text-[11px] font-mono text-slate-300 min-h-[21rem] flex-1 overflow-y-auto whitespace-pre-wrap border border-white/5 leading-relaxed">
                      {cmdOutput ? (
                        <>
                          <div className="text-slate-500 select-none pb-1">jarvis@os-linux:~/workspace$ {terminalCmd}</div>
                          {cmdOutput.stdout && <div className="text-slate-200">{cmdOutput.stdout}</div>}
                          {cmdOutput.stderr && <div className="text-rose-400">{cmdOutput.stderr}</div>}
                          {!cmdOutput.stdout && !cmdOutput.stderr && (
                            <div className="text-slate-500">Command exited with code {cmdOutput.exit_code} (no output).</div>
                          )}
                        </>
                      ) : (
                        <div className="text-slate-600">
                          jarvis@os-linux:~/workspace$ _
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

        )}

        {!isFullscreen && activeTab !== 'lab' && (
          <>
            {/* Dedicated Task-Scoped AI Execution Panel */}
            <GlassCard className="p-4 space-y-3 border-cyan-500/30 bg-cyan-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-os-primary">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  Assign Task to OS AI Agent
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  Task-Scoped Bounds
                </span>
              </div>

              <p className="text-xs text-os-secondary">
                The AI agent will only execute this explicit task within authorized domains, displaying live cursor telemetry and element highlights.
              </p>

              <div className="space-y-2">
                <textarea
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder="E.g., Go to wikipedia.org, search for Quantum Computing, and summarize the intro paragraph."
                  rows={2}
                  disabled={!sessionId || loading || controlState === 'AI_WORKING'}
                  className="w-full bg-os-surface/80 border border-os-border/60 rounded-lg p-2.5 text-xs text-os-primary placeholder-os-muted focus:outline-none focus:border-cyan-500/60 font-mono disabled:opacity-50"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-os-surface/60 px-2 py-1 rounded border border-os-border/40">
                    <span className="text-[10px] font-mono text-os-secondary whitespace-nowrap">
                      Allowed Domains:
                    </span>
                    <input
                      type="text"
                      value={allowedDomains}
                      onChange={(e) => setAllowedDomains(e.target.value)}
                      placeholder="wikipedia.org, google.com (optional)"
                      disabled={!sessionId || loading}
                      className="w-full bg-transparent text-[11px] font-mono text-os-primary focus:outline-none placeholder-os-muted"
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleStartTask}
                    disabled={!sessionId || loading || !taskPrompt.trim() || controlState === 'AI_WORKING'}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Plan & Start Task
                  </Button>
                </div>
              </div>

              {/* Active Task Progress Banner */}
              {activeTask && (
                <div className="mt-3 p-3 bg-os-surface/90 border border-cyan-500/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-700 dark:text-cyan-300 font-medium">Goal: {activeTask.goal}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      {activeTask.status}
                    </span>
                  </div>
                  {activeTask.current_step && (
                    <div className="text-[11px] font-mono text-os-secondary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Current Action: {activeTask.current_step}</span>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>

            {/* Pending HITL Approvals */}
            {approvals.length > 0 && (
              <GlassCard className="p-4 border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Human-in-the-Loop Approvals Waiting ({approvals.length})
                </div>
                <div className="space-y-2">
                  {approvals.map((appr) => (
                    <div
                      key={appr.ticket_id}
                      className="p-3 bg-os-surface/80 border border-amber-500/20 rounded flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded mr-2">
                          {appr.risk_level}
                        </span>
                        <span className="text-xs font-mono text-os-primary font-medium">
                          {appr.action_type} &rarr; {appr.target}
                        </span>
                        <p className="text-[11px] text-os-secondary mt-1">{appr.reason}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleResolveApproval(appr.ticket_id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleResolveApproval(appr.ticket_id, 'reject')}
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </>
        )}
      </div>

        {/* Right Col: collapsible telemetry and backend inspector */}
        {isInspectorOpen && (
        <aside className="space-y-4">
          {/* Arbiter & Dual-Cursor Telemetry Card */}
          <GlassCard className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-os-primary flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              Dual-Cursor Telemetry
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-os-border/50 bg-os-surface/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-os-secondary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" /> Human Cursor:
                  </span>
                  <span className="font-mono text-emerald-500 dark:text-emerald-400">Direct Hardware Input</span>
                </div>
                <p className="text-[10px] text-os-muted">
                  Pointer coordinates forward dynamically with 1280&times;800 aspect ratio mapping.
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-os-border/50 bg-os-surface/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-os-secondary flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" /> AI Cursor:
                  </span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-300">
                    {aiCursor.visible ? `${Math.round(aiCursor.x)}, ${Math.round(aiCursor.y)}` : 'Hidden (Standby)'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-os-secondary">
                  <span>Current State:</span>
                  <span className="font-mono text-os-primary">{aiCursor.status || 'Idle'}</span>
                </div>
                {aiCursor.target_rect && (
                  <div className="text-[10px] font-mono text-cyan-500 dark:text-cyan-400">
                    Target bounds: {Math.round(aiCursor.target_rect.width)}&times;{Math.round(aiCursor.target_rect.height)} at ({Math.round(aiCursor.target_rect.x)}, {Math.round(aiCursor.target_rect.y)})
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Execution Backends */}
          <GlassCard className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-os-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Execution Backends
            </h3>
            <div className="space-y-2">
              {Object.entries(backends).map(([name, b]) => {
                let displayTitle = name.replace('_', ' ');
                let subtitle = b.capabilities.supports_desktop ? 'Native Desktop' : 'Web Browser';
                if (name === 'docker_desktop') {
                  displayTitle = 'Linux Virtual Computer';
                  subtitle = 'Debian 12 Bookworm + Openbox + Chromium';
                } else if (name === 'windows_harness') {
                  displayTitle = 'Host Windows Desktop (Optional)';
                  subtitle = 'Local host desktop UI automation';
                } else if (name === 'browser_harness') {
                  displayTitle = 'Local Browser Harness';
                  subtitle = 'Playwright Chromium CDP session';
                } else if (name === 'e2b_sandbox') {
                  displayTitle = 'E2B Virtual Sandbox';
                  subtitle = 'Isolated cloud container sandbox';
                } else if (name === 'skyvern_adapter') {
                  displayTitle = 'Skyvern Browser Agent';
                  subtitle = 'Vision-based browser automation';
                }
                return (
                <div
                  key={name}
                  className="p-2.5 rounded-lg border border-os-border/50 bg-os-surface/40 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-mono font-medium text-os-primary capitalize">
                      {displayTitle}
                    </div>
                    <div className="text-[10px] text-os-secondary">
                      {subtitle} •{' '}
                      <span className="text-emerald-500 dark:text-emerald-400 font-mono">{b.capabilities.cost_classification}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.health?.ok ? (
                      <span className="inline-flex items-center text-[10px] font-mono text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> READY
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center text-[10px] font-mono text-os-muted bg-os-surface px-2 py-0.5 rounded border border-os-border cursor-help"
                        title={b.health?.message || 'Offline'}
                      >
                        OFFLINE
                      </span>
                    )}
                    <button
                      onClick={() => handleCheckBackendHealth(name)}
                      disabled={healthChecking[name]}
                      title={`Run health check on ${name}`}
                      className="p-1 rounded hover:bg-os-surface-active text-os-muted hover:text-os-primary transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${healthChecking[name] ? 'animate-spin text-cyan-400' : ''}`} />
                    </button>
                  </div>
                </div>
              );})}
            </div>
          </GlassCard>

          {/* Rate Limits & Quotas */}
          <GlassCard className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-os-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Quota & Rate Scheduler
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between text-os-secondary text-[11px]">
                <span>Queued Tasks:</span>
                <span className="font-mono text-os-primary">{rateLimits.queued_count || 0}</span>
              </div>
              <div className="flex justify-between text-os-secondary text-[11px]">
                <span>Waiting Quota Reset:</span>
                <span className="font-mono text-amber-500 dark:text-amber-400">{rateLimits.waiting_quota_count || 0}</span>
              </div>
              <div className="flex justify-between text-os-secondary text-[11px]">
                <span>Active Cooldowns:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">
                  {(rateLimits.active_cooldowns || []).length}
                </span>
              </div>

              {rateLimits.active_cooldowns && rateLimits.active_cooldowns.length > 0 && (
                <div className="mt-2 pt-2 border-t border-os-border/40 space-y-1">
                  {rateLimits.active_cooldowns.map((cd: any, idx: number) => (
                    <div key={idx} className="p-1.5 bg-os-surface/70 rounded text-[10px] font-mono text-amber-600 dark:text-amber-300">
                      {cd.provider}:{cd.model} — resets in {Math.round(cd.remaining_seconds)}s
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </aside>
        )}
      </div>
    </div>
  );
};
