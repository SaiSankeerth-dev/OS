export type NavView = 
  | 'home'
  | 'chat'
  | 'plan'
  | 'tasks'
  | 'approvals'
  | 'agents'
  | 'activity'
  | 'connectors'
  | 'memory';

export type OrbState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'WORKING';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'os' | 'system';
  content: string;
  timestamp: string;
  streaming?: boolean;
  toolCalls?: ToolExecutionStep[];
  actionApproval?: {
    id: string;
    aid?: string;
    connector_id?: string;
    connector_name?: string;
    action?: string;
    title?: string;
    params?: Record<string, any>;
    status?: 'pending' | 'approved' | 'rejected' | 'executing';
    risk_level?: string;
    arguments_hash?: string;
  } | null;
  execution?: {
    tool: string;
    result: any;
    verified: boolean;
    evidence?: any;
    receipt?: any;
  } | null;
}

export interface ToolExecutionStep {
  id: string;
  tool: string;
  status: 'running' | 'completed' | 'failed' | 'needs_approval';
  input?: any;
  output?: any;
  evidence?: any;
}
