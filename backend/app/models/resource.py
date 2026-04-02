from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from datetime import datetime
from app.core.database import Base

class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # NULL = localStorage fallback for now
    url = Column(String, index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    resource_type = Column(String, nullable=False)   # video, article, course, docs, other
    date_completed = Column(Date, index=True, nullable=False)
    time_spent_minutes = Column(Integer, default=0)
    notes = Column(String, nullable=True)
    is_completed = Column(Integer, default=1)        # 1 = completed, we'll use boolean logic later
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
