import { api } from "@/lib/api-client";

// Types based on backend API
export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

// Task API methods
export const tasksApi = {
  /**
   * Get all tasks for the authenticated user
   * Backend returns array directly, not wrapped in { tasks: [...] }
   */
  getTasks: async (params?: {
    skip?: number;
    limit?: number;
    status?: TaskStatus;
    priority?: TaskPriority;
  }): Promise<Task[]> => {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set("skip", String(params.skip));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.priority) searchParams.set("priority", params.priority);

    const query = searchParams.toString();
    const endpoint = `/api/tasks${query ? `?${query}` : ""}`;

    return api.get<Task[]>(endpoint);
  },

  /**
   * Get a single task by ID
   */
  getTask: async (taskId: string): Promise<Task> => {
    return api.get<Task>(`/api/tasks/${taskId}`);
  },

  /**
   * Create a new task
   */
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    return api.post<Task>("/api/tasks", data);
  },

  /**
   * Update an existing task
   */
  updateTask: async (taskId: string, data: UpdateTaskInput): Promise<Task> => {
    return api.put<Task>(`/api/tasks/${taskId}`, data);
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId: string): Promise<void> => {
    return api.delete<void>(`/api/tasks/${taskId}`);
  },
};
