from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date, datetime
from typing import List, Optional, Dict

from app.core.database import get_db
from app.schemas.resource import ResourceCreate, ResourceResponse, ResourceUpdate
from app.models.resource import LearningResource

router = APIRouter()

# ====================== CRUD ======================

@router.post("/", response_model=ResourceResponse, status_code=201)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db)):
    db_resource = LearningResource(**resource.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource


@router.get("/", response_model=List[ResourceResponse])
def get_resources(
    date_completed: Optional[date] = Query(None, description="Filter by date"),
    db: Session = Depends(get_db)
):
    query = db.query(LearningResource)
    if date_completed:
        query = query.filter(LearningResource.date_completed == date_completed)
    return query.all()


@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(resource_id: int, resource_update: ResourceUpdate, db: Session = Depends(get_db)):
    resource = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    update_data = resource_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(resource, key, value)
    
    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/{resource_id}", status_code=204)
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    db.delete(resource)
    db.commit()
    return None


# ====================== Heatmap Data ======================

@router.get("/heatmap", response_model=Dict[str, Dict[str, int]])
def get_heatmap(
    year: Optional[int] = Query(None, description="Year to fetch (defaults to current year)"),
    metric: str = Query("time", description="Metric to show: 'time' or 'count'"),
    db: Session = Depends(get_db)
):
    if year is None:
        year = datetime.utcnow().year

    # Base query for the year
    query = db.query(
        LearningResource.date_completed,
        func.sum(LearningResource.time_spent_minutes).label("total_time"),
        func.count(LearningResource.id).label("total_count")
    ).filter(
        extract('year', LearningResource.date_completed) == year
    ).group_by(LearningResource.date_completed)

    results = query.all()

    heatmap: Dict[str, Dict[str, int]] = {}
    for row in results:
        date_str = row.date_completed.isoformat()
        if metric == "time":
            value = row.total_time or 0
        else:  # count
            value = row.total_count or 0
        heatmap[date_str] = {"value": value}

    return heatmap
