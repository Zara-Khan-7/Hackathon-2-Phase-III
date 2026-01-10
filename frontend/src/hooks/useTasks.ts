"use client";

import * as React from "react";
import { tasksApi } from "@/lib/api/tasks";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types/task";

interface UseTasksReturn {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Operations
  createTask: (data: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  refresh: () => Promise<void>;

  // Operation state
  isCreating: boolean;
  updatingId: string | null;
  deletingId: string | null;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tasks = await tasksApi.getTasks();
      setTasks(tasks || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tasks on mount
  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = React.useCallback(async (data: CreateTaskInput): Promise<Task> => {
    setIsCreating(true);
    try {
      const task = await tasksApi.createTask(data);
      setTasks((prev) => [task, ...prev]);
      return task;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create task";
      throw new Error(message);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateTask = React.useCallback(async (id: string, data: UpdateTaskInput): Promise<Task> => {
    setUpdatingId(id);
    try {
      const task = await tasksApi.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      return task;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update task";
      throw new Error(message);
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const deleteTask = React.useCallback(async (id: string): Promise<void> => {
    setDeletingId(id);
    try {
      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete task";
      throw new Error(message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refresh,
    isCreating,
    updatingId,
    deletingId,
  };
}
