"""
Task SQLModel - represents a user-owned work item.
Includes status and priority enums per data-model.md specification.
"""
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum
from typing import Optional


class TaskStatus(str, Enum):
    """Task status values - any transition allowed."""
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class TaskPriority(str, Enum):
    """Task priority levels."""
    low = "low"
    medium = "medium"
    high = "high"


class Task(SQLModel, table=True):
    """
    Task entity - represents a user-owned work item.

    Each task belongs to exactly one user, identified by user_id
    which comes from the JWT token's 'sub' claim.
    """

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: TaskStatus = Field(default=TaskStatus.pending)
    priority: TaskPriority = Field(default=TaskPriority.medium)
    due_date: Optional[datetime] = Field(default=None)
    user_id: str = Field(index=True, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
