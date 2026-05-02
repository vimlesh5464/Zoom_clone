from fastapi import FastAPI
from app.db.database import engine, Base
from app.routes.user_routes import router
from fastapi.middleware.cors import CORSMiddleware
from app.websocket.socket import router as ws_router

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Routes
app.include_router(router, prefix="/api/v1/users")

# ✅ Only this
app.include_router(ws_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health
@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}