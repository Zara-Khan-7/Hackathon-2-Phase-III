"use client";

import * as React from "react";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onRetry?: () => void;
  onAddTask?: () => void;
  emptyMessage?: string;
  updatingId?: string | null;
  deletingId?: string | null;
}

// Loading skeleton component
function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm animate-pulse">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-1" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-9 bg-gray-200 rounded w-40" />
        <div className="h-9 bg-gray-200 rounded w-20" />
        <div className="h-9 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({
  message,
  onAddTask,
}: {
  message: string;
  onAddTask?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-white p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto text-gray-400 mb-4"
        aria-hidden="true"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        <path d="m15 5 3 3" />
      </svg>
      <p className="text-gray-500 mb-4">{message}</p>
      {onAddTask && (
        <Button onClick={onAddTask}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add Task
        </Button>
      )}
    </div>
  );
}

// Error state component
function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto text-red-500 mb-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <p className="text-red-700 font-medium mb-2">Failed to load tasks</p>
      <p className="text-red-600 text-sm mb-4">{error}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function TaskList({
  tasks,
  isLoading,
  error,
  onStatusChange,
  onEdit,
  onDelete,
  onRetry,
  onAddTask,
  emptyMessage = "No tasks yet. Create your first task to get started!",
  updatingId,
  deletingId,
}: TaskListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4" aria-label="Loading tasks">
        {[1, 2, 3].map((n) => (
          <TaskCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Empty state
  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage} onAddTask={onAddTask} />;
  }

  // Task list
  return (
    <div className="space-y-4" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskCard
            task={task}
            onStatusChange={(status) => onStatusChange(task.id, status)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            isUpdating={updatingId === task.id}
            isDeleting={deletingId === task.id}
          />
        </div>
      ))}
    </div>
  );
}
