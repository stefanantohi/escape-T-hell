import { LearningResource } from '@/hooks/useResources';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // TODO: Add auth token later
  const token = localStorage.getItem('access_token');
  if (token) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Define request/response types
export interface CreateResourceData {
  url: string;
  title: string;
  resource_type: 'video' | 'article' | 'course' | 'docs' | 'other';
  date_completed: string;
  time_spent_minutes: number;
  notes?: string;
  is_completed?: boolean;
}

export interface UpdateResourceData extends Partial<CreateResourceData> {}

export const resourcesApi = {
  // GET all resources (optionally filtered by date)
  getAll: (date?: string): Promise<LearningResource[]> =>
    apiRequest(date ? `/resources?date_completed=${date}` : '/resources'),

  // Create new resource
  create: (data: CreateResourceData): Promise<LearningResource> =>
    apiRequest('/resources', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),

  // Update existing resource
  update: (id: string | number, data: UpdateResourceData): Promise<LearningResource> =>
    apiRequest(`/resources/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),

  // Delete resource
  delete: (id: string | number): Promise<void> =>
    apiRequest(`/resources/${id}`, { method: 'DELETE' }),

  // Get heatmap data
  getHeatmap: (year?: number, metric: 'time' | 'count' = 'time'): Promise<Record<string, { value: number }>> =>
    apiRequest(`/resources/heatmap?${new URLSearchParams({
      ...(year && { year: year.toString() }),
      metric,
    })}`),
};
