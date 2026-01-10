"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFormErrors,
} from "@/types/task";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/types/task";

interface TaskFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Task>;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: TaskFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [description, setDescription] = React.useState(
    initialData?.description || ""
  );
  const [status, setStatus] = React.useState(
    initialData?.status || "pending"
  );
  const [priority, setPriority] = React.useState(
    initialData?.priority || "medium"
  );
  const [dueDate, setDueDate] = React.useState(
    initialData?.due_date?.split("T")[0] || ""
  );
  const [errors, setErrors] = React.useState<TaskFormErrors>({});

  const titleInputRef = React.useRef<HTMLInputElement>(null);

  // Focus title input on mount
  React.useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const validate = (): boolean => {
    const newErrors: TaskFormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 255) {
      newErrors.title = "Title must be 255 characters or less";
    }

    if (dueDate) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        newErrors.due_date = "Invalid date format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreateTaskInput | UpdateTaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate ? `${dueDate}T00:00:00Z` : null,
    };

    try {
      await onSubmit(data);
      // Clear form on successful create
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
        setDueDate("");
        setErrors({});
      }
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div
          className="rounded-md bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {errors.general}
        </div>
      )}

      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          ref={titleInputRef}
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          maxLength={255}
        />
      </div>

      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <Textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          placeholder="Add more details (optional)"
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="task-status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <Select
            id="task-status"
            value={status}
            onChange={(value) => setStatus(value as typeof status)}
            options={STATUS_OPTIONS}
            disabled={isSubmitting}
            error={errors.status}
          />
        </div>

        <div>
          <label
            htmlFor="task-priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <Select
            id="task-priority"
            value={priority}
            onChange={(value) => setPriority(value as typeof priority)}
            options={PRIORITY_OPTIONS}
            disabled={isSubmitting}
            error={errors.priority}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="task-due-date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Due Date
        </label>
        <Input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.due_date}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
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
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : mode === "create" ? (
            "Create Task"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
