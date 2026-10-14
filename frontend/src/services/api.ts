import {
  Task,
  Commitment,
  PlanItem,
  DailyPlan,
  Approval,
  PendingConnectorAction,
  AgentRun,
  ActivityItem,
  Connector,
  HomeViewData,
  MeData,
  MemoryItem,
  WatcherSuggestion,
  AnalyticsData,
} from '../types/api';

const BASE_URL = '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = `Request failed: ${response.statusText}`;
    try {
      const err = await response.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Me & System
  async getMe(): Promise<MeData> {
    return request<MeData>('/api/me');
  },

  // Home View
  async getHomeView(): Promise<HomeViewData> {
    return request<HomeViewData>('/api/v1/home');
  },

  // Commitments
  async getCommitments(status?: string): Promise<{ commitments: Commitment[] }> {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<{ commitments: Commitment[] }>(`/api/v1/commitments${q}`);
  },

  async createCommitment(data: Partial<Commitment>): Promise<{ ok: boolean; commitment: Commitment }> {
    return request('/api/v1/commitments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Tasks
  async getTasks(status?: string): Promise<{ tasks: Task[] }> {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<{ tasks: Task[] }>(`/api/v1/tasks${q}`);
  },

  async createTask(title: string, options: Partial<Task> = {}): Promise<{ ok: boolean; task: Task }> {
    return request('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, ...options }),
    });
  },

  async completeTask(taskId: string, receipt?: any): Promise<{ ok: boolean; status: string; verified: boolean; message: string }> {
    return request(`/api/v1/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ receipt: receipt || {} }),
    });
  },

  // Plan
  async getPlan(planDate?: string): Promise<{ plan: DailyPlan | null; items: PlanItem[] }> {
    const q = planDate ? `?plan_date=${encodeURIComponent(planDate)}` : '';
    return request<{ plan: DailyPlan | null; items: PlanItem[] }>(`/api/v1/plan${q}`);
  },

  async generatePlan(planDate?: string): Promise<{ ok: boolean; plan: DailyPlan; items: PlanItem[] }> {
    const q = planDate ? `?plan_date=${encodeURIComponent(planDate)}` : '';
    return request(`/api/v1/plan/generate${q}`, {
      method: 'POST',
    });
  },

  // Approvals (Unified)
  async getV1Approvals(): Promise<{ pending_approvals: Approval[] }> {
    return request<{ pending_approvals: Approval[] }>('/api/v1/approvals');
  },

  async approveV1(approvalId: string, args: Record<string, any>): Promise<{ ok: boolean }> {
    return request(`/api/v1/approvals/${approvalId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ arguments: args }),
    });
  },

  async rejectV1(approvalId: string, reason = ''): Promise<{ ok: boolean }> {
    return request(`/api/v1/approvals/${approvalId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async getPendingActions(): Promise<{ pending: PendingConnectorAction[] }> {
    return request<{ pending: PendingConnectorAction[] }>('/api/actions/pending');
  },

  async approveAction(actionId: string): Promise<{ ok: boolean; result?: any }> {
    return request(`/api/actions/${actionId}/approve`, {
      method: 'POST',
    });
  },

  async rejectAction(actionId: string): Promise<{ ok: boolean }> {
    return request(`/api/actions/${actionId}/reject`, {
      method: 'POST',
    });
  },

  // Agents & Dispatch
  async getAgents(): Promise<{ agent_runs: AgentRun[] }> {
    return request<{ agent_runs: AgentRun[] }>('/api/v1/agents');
  },

  async dispatchAgent(agentType: string, instruction: string, parameters: Record<string, any> = {}): Promise<{ ok: boolean; result: any }> {
    return request('/api/v1/agents/dispatch', {
      method: 'POST',
      body: JSON.stringify({
        agent_type: agentType,
        instruction,
        parameters,
      }),
    });
  },

  // Activity & Evidence
  async getActivity(limit = 50): Promise<{ activity: ActivityItem[] }> {
    return request<{ activity: ActivityItem[] }>(`/api/v1/activity?limit=${limit}`);
  },

  // Connectors
  async getConnectors(): Promise<{ connectors: Connector[] }> {
    return request<{ connectors: Connector[] }>('/api/connectors');
  },

  async testConnector(cid: string): Promise<{ ok: boolean; status: any }> {
    return request(`/api/connectors/${cid}/test`, {
      method: 'POST',
    });
  },

  // Memory & Knowledge
  async getMemory(): Promise<{ memories: MemoryItem[] }> {
    return request<{ memories: MemoryItem[] }>('/api/memory');
  },

  async forgetMemory(key: string): Promise<{ ok: boolean }> {
    return request(`/api/memory/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
  },

  // Watchers & Proactive suggestions
  async getWatchers(): Promise<{ suggestions: WatcherSuggestion[] }> {
    return request<{ suggestions: WatcherSuggestion[] }>('/api/watchers');
  },

  async markWatcherSeen(id: number): Promise<{ ok: boolean }> {
    return request(`/api/watchers/${id}/seen`, {
      method: 'POST',
    });
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return request<AnalyticsData>('/api/analytics');
  },

  // Cyber-HUD & 5 Primitives
  async getHudState(): Promise<any> {
    return request<any>('/api/hud/state');
  },

  async sendHudCommand(query: string, dot?: string, actionType?: string, actionPayload?: string): Promise<any> {
    return request<any>('/api/hud/command', {
      method: 'POST',
      body: JSON.stringify({
        query,
        dot,
        action_type: actionType,
        action_payload: actionPayload,
      }),
    });
  },

  async resolveHudApproval(approvalId: string, decision: string): Promise<any> {
    return request<any>('/api/hud/approval', {
      method: 'POST',
      body: JSON.stringify({
        approval_id: approvalId,
        decision,
      }),
    });
  },

  async toggleHudTakeover(takeControl: boolean): Promise<any> {
    return request<any>('/api/hud/computer/takeover', {
      method: 'POST',
      body: JSON.stringify({
        take_control: takeControl,
      }),
    });
  },

  async saveHudSpacePage(spaceId: string, pageId: string, title: string, markdown: string, author = 'Sai', expectedRevision?: number): Promise<any> {
    return request<any>('/api/hud/spaces/save', {
      method: 'POST',
      body: JSON.stringify({
        space_id: spaceId,
        page_id: pageId,
        title,
        markdown,
        author,
        expected_revision: expectedRevision,
      }),
    });
  },

  async optimizeHudTraces(): Promise<any> {
    return request<any>('/api/hud/optimize', {
      method: 'POST',
    });
  },

  async draftLinkedInPost(topic: string, highlights: string[] = []): Promise<any> {
    return request<any>('/api/hud/social/linkedin/draft', {
      method: 'POST',
      body: JSON.stringify({ topic, highlights }),
    });
  },

  async publishLinkedInPost(postText: string, token?: string): Promise<any> {
    return request<any>('/api/hud/social/linkedin/publish', {
      method: 'POST',
      body: JSON.stringify({ post_text: postText, token }),
    });
  },

  async summarizeYouTubeVideo(videoUrl: string, title = ''): Promise<any> {
    return request<any>('/api/hud/social/youtube/summarize', {
      method: 'POST',
      body: JSON.stringify({ video_url: videoUrl, title }),
    });
  },

  async speakHudVoice(text: string): Promise<any> {
    return request<any>('/api/hud/voice/speak', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

