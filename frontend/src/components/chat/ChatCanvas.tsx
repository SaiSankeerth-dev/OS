import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Mic,
  MicOff,
  Bot,
  User,
  RefreshCw,
  CornerDownLeft,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../context/VoiceContext';
import { ChatMessage, ToolExecutionStep } from '../../types/ui';
import { sendChatMessageStream } from '../../services/chatStream';
import { ToolCard } from './ToolCard';
import { ApprovalCard } from './ApprovalCard';
import { VerificationCard } from './VerificationCard';
import { AmbientOrb } from '../orb/AmbientOrb';

export const ChatCanvas: React.FC = () => {
  const { me, orbState, setOrbState, addNotification } = useApp();
  const { isVoiceActive, toggleVoice } = useVoice();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'os',
      content:
        `Hello ${me?.name || 'Sai'}. I'm OS, your personal AI operating system. I can plan your day, research topics, execute email and calendar actions with safety verification, and monitor your commitments. How can I help right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isStreaming) return;

    // Add user message
    const userMsgId = Math.random().toString(36).substring(2, 9);
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Prepare assistant placeholder message
    const botMsgId = Math.random().toString(36).substring(2, 9);
    const botMsg: ChatMessage = {
      id: botMsgId,
      sender: 'os',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputText('');
    setIsStreaming(true);
    setOrbState('THINKING');

    // Live streaming via SSE
    sendChatMessageStream(
      query,
      (delta) => {
        setOrbState('SPEAKING');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, content: m.content + delta } : m
          )
        );
      },
      (doneData) => {
        setIsStreaming(false);
        setOrbState('IDLE');

        // Check if there is an execution receipt or action approval
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === botMsgId) {
              return {
                ...m,
                content: doneData.main || m.content || doneData.full,
                streaming: false,
                actionApproval: doneData.action_approval || doneData.approval || null,
                execution: doneData.execution || null,
              };
            }
            return m;
          })
        );
      },
      (err) => {
        setIsStreaming(false);
        setOrbState('IDLE');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  content:
                    m.content ||
                    `I encountered an issue reaching the model or tools: ${err.message}. Please verify local services are running.`,
                  streaming: false,
                }
              : m
          )
        );
        addNotification({
          type: 'error',
          title: 'Engine Error',
          message: err.message,
        });
      }
    );
  };

  const quickPrompts = [
    'Plan my day and resolve conflicts',
    'What matters right now and what is blocked?',
    'Review all pending approvals',
    'Research recent breakthroughs in AI agents',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 md:px-6 py-4">
      {/* Header Canvas Presence */}
      <div className="flex items-center justify-between pb-3 border-b border-os-border mb-3 select-none">
        <div className="flex items-center gap-3">
          <AmbientOrb state={orbState} size={32} />
          <div>
            <h2 className="text-sm font-semibold text-os-primary tracking-tight">
              Ask OS
            </h2>
            <p className="text-[11px] text-os-secondary">
              Personal intelligence canvas · Safe execution active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              OS is working...
            </span>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } transition-all`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span className="text-[10px] font-mono text-os-muted">{msg.timestamp}</span>
                  <span className="text-xs font-medium text-os-secondary">You</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-xs font-medium text-os-secondary">OS</span>
                  <span className="text-[10px] font-mono text-os-muted">{msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-2xl rounded-glass-lg p-4 text-xs md:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-500/15 border border-emerald-500/25 text-os-primary rounded-br-sm'
                  : 'glass-panel border-os-border-glass text-os-primary rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Streaming Indicator */}
              {msg.streaming && (
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-75"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-150"></span>
                </div>
              )}

              {/* Tool Execution Steps */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
                  {msg.toolCalls.map((step) => (
                    <ToolCard key={step.id} step={step} />
                  ))}
                </div>
              )}

              {/* Action Approval Card */}
              {msg.actionApproval && (
                <ApprovalCard approval={msg.actionApproval} />
              )}

              {/* Execution Verification Card */}
              {msg.execution && msg.execution.verified && (
                <VerificationCard execution={msg.execution} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length < 4 && !isStreaming && (
        <div className="py-2 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="btn-press px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-xs text-os-secondary hover:text-os-primary transition-all select-none"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Deck */}
      <div className="pt-2 select-none">
        <div className="glass-panel rounded-glass-xl border-os-border-glass p-2 shadow-2xl flex items-center gap-2">
          <button
            onClick={toggleVoice}
            className={`btn-press p-2.5 rounded-glass-md transition-all ${
              isVoiceActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glass-glow'
                : 'text-os-muted hover:text-os-primary hover:bg-white/5'
            }`}
            title="Voice talk mode"
          >
            {isVoiceActive ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask OS anything or direct an action (e.g., 'Schedule meeting with Alex at 3pm')..."
            className="flex-1 bg-transparent px-2 text-xs md:text-sm text-os-primary placeholder:text-os-muted focus:outline-none"
            disabled={isStreaming}
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isStreaming}
            className="btn-press p-2.5 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glass-glow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between px-3 pt-1.5 text-[10px] text-os-muted font-mono">
          <span>Press Enter to send</span>
          <span>End-to-end safe execution boundary active</span>
        </div>
      </div>
    </div>
  );
};
