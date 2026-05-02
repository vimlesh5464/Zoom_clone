from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import User, Meeting
from app.schemas.user_schema import UserCreate, UserLogin, MeetingCreate
from app.services.auth_service import (
    hash_password,
    verify_password,
    get_user_by_username
)
from app.utils.jwt_handler import create_access_token

router = APIRouter()


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# ✅ REGISTER
# =========================
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    print("REGISTER DATA:", user.dict())

    existing = get_user_by_username(db, user.username)

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        name=user.name,
        username=user.username,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }


# =========================
# ✅ LOGIN
# =========================
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user.username)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": db_user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# =========================
# ✅ ADD MEETING
# =========================
@router.post("/meetings")
def add_meeting(data: MeetingCreate, db: Session = Depends(get_db)):
    meeting = Meeting(
        meeting_code=data.meeting_code,
        user_id=1  # later replace with JWT user_id
    )

    db.add(meeting)
    db.commit()

    return {"message": "Meeting saved"}


# =========================
# ✅ GET MEETINGS
# =========================
@router.get("/meetings")
def get_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).all()