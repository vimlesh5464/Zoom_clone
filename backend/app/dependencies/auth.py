from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.utils.jwt_handler import verify_token
from app.db.models import User


# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔐 Auth dependency
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        token = authorization.split(" ")[1]  # "Bearer <token>"
    except:
        raise HTTPException(status_code=401, detail="Invalid token format")

    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("user_id")

    user = db.query(User).filter(User.username == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user