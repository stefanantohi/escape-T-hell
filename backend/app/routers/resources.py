from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.resource import ResourceCreate, ResourceResponse, ResourceUpdate
from app.models.resource import LearningResource
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ResourceResponse)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db)):
    db_resource = LearningResource(**resource.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.get("/", response_model=List[ResourceResponse])
def get_resources(db: Session = Depends(get_db)):
    return db.query(LearningResource).all()

@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource
