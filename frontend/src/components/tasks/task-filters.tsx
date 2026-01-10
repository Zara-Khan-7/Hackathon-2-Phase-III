"use client";

import * as React from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { TaskFilters as FilterType, TaskStatus, TaskPriority } from "@/types/task";

interface TaskFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  taskCounts?: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_FILTER_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskFilters({
  filters,
  onFilterChange,
  taskCounts,
}: TaskFiltersProps) {
  const hasActiveFilters = filters.status !== null || filters.priority !== null;

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value ? (value as TaskStatus) : null,
    });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({
      ...filters,
      priority: value ? (value as TaskPriority) : null,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({ status: null, priority: null });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-40">
          <Select
            value={filters.status || ""}
            onChange={handleStatusChange}
            options={STATUS_FILTER_OPTIONS}
            aria-label="Filter by status"
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filters.priority || ""}
            onChange={handlePriorityChange}
            options={PRIORITY_FILTER_OPTIONS}
            aria-label="Filter by priority"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="self-start sm:self-auto"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            Clear filters
          </Button>
        )}
      </div>

      {taskCounts && (
        <div className="flex gap-4 text-sm text-gray-500">
          <span>
            <span className="font-medium text-gray-900">{taskCounts.total}</span>{" "}
            total
          </span>
          <span>
            <span className="font-medium text-gray-600">{taskCounts.pending}</span>{" "}
            pending
          </span>
          <span>
            <span className="font-medium text-blue-600">{taskCounts.in_progress}</span>{" "}
            in progress
          </span>
          <span>
            <span className="font-medium text-green-600">{taskCounts.completed}</span>{" "}
            completed
          </span>
        </div>
      )}
    </div>
  );
}
