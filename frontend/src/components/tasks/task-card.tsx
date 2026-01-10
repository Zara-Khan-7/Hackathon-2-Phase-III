"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { Task, TaskStatus } from "@/types/task";
import { STATUS_OPTIONS, STATUS_COLORS, PRIORITY_COLORS } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: TaskCardProps) {
  const isDisabled = isUpdating || isDeleting;
  const isCompleted = task.status === "completed";

  // Format due date for display
  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Check if due date is past
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "completed";

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm transition-opacity",
        isDisabled && "opacity-60",
        isDeleting && "bg-red-50"
      )}
      aria-busy={isDisabled}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-gray-900 break-words",
              isCompleted && "line-through text-gray-500"
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={cn(
                "mt-1 text-sm text-gray-600 line-clamp-2",
                isCompleted && "text-gray-400"
              )}
            >
              {task.description}
            </p>
          )}
          {formattedDueDate && (
            <p
              className={cn(
                "mt-2 text-xs",
                isOverdue ? "text-red-600 font-medium" : "text-gray-500"
              )}
            >
              {isOverdue ? "Overdue: " : "Due: "}
              {formattedDueDate}
            </p>
          )}
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <span
            className={cn(
              "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
              STATUS_COLORS[task.status]
            )}
          >
            <span className="sr-only">Status: </span>
            {task.status === "in_progress"
              ? "In Progress"
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
              PRIORITY_COLORS[task.priority]
            )}
          >
            <span className="sr-only">Priority: </span>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Dropdown */}
        <div className="w-full sm:w-40">
          <Select
            value={task.status}
            onChange={(value) => onStatusChange(value as TaskStatus)}
            options={STATUS_OPTIONS}
            disabled={isDisabled}
            aria-label={`Change status for task: ${task.title}`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            disabled={isDisabled}
            aria-label={`Edit task: ${task.title}`}
            className="flex-1 sm:flex-none"
          >
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
              className="mr-1"
              aria-hidden="true"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isDisabled}
            aria-label={`Delete task: ${task.title}`}
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? (
              <svg
                className="animate-spin mr-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
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
                className="mr-1"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            )}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
