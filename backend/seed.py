from app.core.database import SessionLocal, Base, engine
from app.models.resource import LearningResource
from datetime import date, timedelta
import random

def seed_data():
    db = SessionLocal()

    # Clear existing data (optional for dev)
    db.query(LearningResource).delete()

    today = date.today()
    types = ["video", "article", "course", "docs", "other"]

    sample_data = [
        ("https://fastapi.tiangolo.com/", "FastAPI Official Tutorial", "course", 60, "Learned dependency injection"),
        ("https://react.dev/learn", "React 19 New Features", "article", 35, ""),
        ("https://tailwindcss.com/docs", "Tailwind Best Practices", "docs", 25, "Utility classes deep dive"),
        ("https://www.youtube.com/watch?v=...", "Understanding SQLAlchemy 2.0", "video", 50, "Great explanations"),
    ]

    for i, (url, title, res_type, minutes, notes) in enumerate(sample_data):
        resource = LearningResource(
            url=url,
            title=title,
            resource_type=res_type,
            date_completed=today - timedelta(days=random.randint(0, 45)),
            time_spent_minutes=minutes,
            notes=notes,
            is_completed=True,
        )
        db.add(resource)

    db.commit()
    print(f"✅ Seeded {len(sample_data)} sample resources")
    db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)   # ensure tables exist
    seed_data()
