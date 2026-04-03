from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import resources
from app.core.database import Base, engine

# Force table creation on every startup
Base.metadata.create_all(bind=engine)
print("✅ Database tables created/verified on startup")

app = FastAPI(
    title=settings.APP_NAME,
    description="Persona learning tracker",
    version="0.1.0"
)

# CORS - allow frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://172.18.0.3:5173",   # Docker internal
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resources.router, prefix="/api/resources", tags=["resources"])

@app.get("/")
def read_root():
    return {
        "message": "Escape Tutorial Hell API is running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

