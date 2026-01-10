"""
Task CRUD API endpoints.
All endpoints require JWT authentication and enforce task ownership.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime
from typing import List

from app.database import get_session
from app.auth.jwt import get_current_user
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

# Create router with /api/tasks prefix
router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> Task:
    """
    Create a new task for the authenticated user.

    US1: Authenticated User Creates a Task
    - Task is created and associated with user_id from JWT
    - Returns 201 with created task
    - Returns 401 if not authenticated
    - Returns 422 if validation fails
    """
    task = Task(
        **task_data.model_dump(),
        user_id=user_id,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("", response_model=List[TaskResponse])
def list_tasks(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> List[Task]:
    """
    List all tasks for the authenticated user.

    US2: Authenticated User Lists Their Tasks
    - Returns only tasks belonging to the authenticated user
    - Returns empty list if user has no tasks
    - Returns 401 if not authenticated
    """
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks


def get_task_or_404(
    task_id: UUID,
    session: Session,
    user_id: str,
) -> Task:
    """
    Helper function to fetch task by ID and validate ownership.

    US3/US4: Ownership validation for single task operations
    - Returns task if found and owned by user
    - Raises 404 if task not found
    - Raises 403 if task belongs to different user
    """
    statement = select(Task).where(Task.id == task_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )

    return task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: UUID,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> Task:
    """
    Get a specific task by ID.

    US3: Authenticated User Retrieves a Single Task
    - Returns task details if owned by user
    - Returns 401 if not authenticated
    - Returns 403 if task belongs to different user
    - Returns 404 if task not found
    """
    return get_task_or_404(task_id, session, user_id)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> Task:
    """
    Update an existing task.

    US4: Authenticated User Updates Their Task
    - Updates task fields (partial update supported)
    - Refreshes updated_at timestamp
    - Returns 401 if not authenticated
    - Returns 403 if task belongs to different user
    - Returns 404 if task not found
    - Returns 422 if validation fails
    """
    task = get_task_or_404(task_id, session, user_id)

    # Apply partial updates
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: UUID,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> None:
    """
    Delete a task.

    US5: Authenticated User Deletes Their Task
    - Permanently removes the task
    - Returns 204 on success (no content)
    - Returns 401 if not authenticated
    - Returns 403 if task belongs to different user
    - Returns 404 if task not found
    """
    task = get_task_or_404(task_id, session, user_id)

    session.delete(task)
    session.commit()
    return None
