export interface Task {
  id: string | number;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'BLOCKED';
  priority?: number;
  estimated_duration_minutes?: number;
  deadline?: string | null;
  commitment_id?: string | null;
  project_id?: string | null;
  created_at?: string;
}

export interface Commitment {
  id: string;
  title: string;
  description?: string;
  deadline?: string | null;
  priority: number;
  status: 'active' | 'fulfilled' | 'broken' | 'cancelled';
  project_id?: string | null;
  goal_id?: string | null;
  person_id?: string | null;
}

export interface PlanItem {
  id: string;
  plan_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  item_type: 'task' | 'meeting' | 'break' | 'event' | 'buffer';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  why_now?: string;
  task_id?: string;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  plan_date: string;
  summary?: string;
  status?: string;
}

export interface Approval {
  approval_id: string;
  action_id: string;
  tool_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'LOW' | 'MEDIUM' | 'HIGH';
  arguments: Record<string, any>;
  arguments_hash: string;
  requested_at: string;
  status?: string;
}

export interface PendingConnectorAction {
  id: string;
  connector_id: string;
  connector_name: string;
  connector_icon: string;
  action: string;
  params: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'rejected' | 'failed';
  created_at: number | string;
}

export interface AgentRun {
  id: string;
  user_id?: string;
  agent_type: 'coding' | 'browser' | 'research' | string;
  instruction: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  created_at?: string;
}

export interface ActivityItem {
  id: string;
  action_type: string;
  description: string;
  status: string;
  timestamp: string;
  evidence_receipt?: Record<string, any>;
  verified?: boolean;
}

export interface Connector {
  id: string;
  name: string;
  icon: string;
  category: string;
  state: 'available' | 'granted' | 'connected' | 'setup_error' | 'denied';
  scopes: string[];
  scopes_granted: string[];
  has_credentials: boolean;
  needs_oauth: boolean;
  health_msg?: string;
  health_at?: number;
  last_used_at?: number;
}

export interface HomeViewData {
  now?: {
    task?: Task;
    plan_item?: PlanItem;
    message?: string;
  };
  next?: Array<PlanItem | Task>;
  waiting?: Array<{ id: string; title: string; reason: string }>;
  blocked?: Array<{ id: string; title: string; blocker: string }>;
  deadlines?: Array<Task | Commitment>;
  active_agents?: AgentRun[];
  pending_approvals?: Approval[];
  recent_activity?: ActivityItem[];
}

export interface MeData {
  name: string;
  greeting: string;
  mode: string;
  online: boolean;
  model_ok: boolean;
  model: string;
}

export interface MemoryItem {
  key: string;
  value: string;
  type: string;
  updated_at: string;
}

export interface WatcherSuggestion {
  id: number;
  kind: string;
  text: string;
}

export interface AnalyticsData {
  approvals_approved: number;
  approvals_rejected: number;
  approvals_expired: number;
  memories: number;
  tasks_open: number;
  tasks_done: number;
  events: number;
}
