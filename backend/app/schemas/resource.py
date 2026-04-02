from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class ResourceBase(BaseModel):
    url: str
    title: str
    resource_type: str = Field(..., pattern="^(video|article|course|docs|other)$")
    date_completed: date
    time_spent_minutes: int = Field(ge=0)
    notes: Optional[str] = None
    is_completed: bool = True

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    url: Optional[str] = None
    title: Optional[str] = None
    resource_type: Optional[str] = None
    date_completed: Optional[date] = None
    time_spent_minutes: Optional[int] = None
    notes: Optional[str] = None
    is_completed: Optional[bool] = None

class ResourceResponse(ResourceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
