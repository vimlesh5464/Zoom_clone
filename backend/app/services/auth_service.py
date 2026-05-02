from passlib.context import CryptContext
from app.db.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 🔐 Hash password safely
def hash_password(password: str):
    if not password:
        raise ValueError("Password cannot be empty")
    return pwd_context.hash(password)


# 🔐 Verify password safely
def verify_password(plain_password, hashed_password):
    if not plain_password or not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)


# 🔍 Get user
def get_user_by_username(db, username: str):
    return db.query(User).filter(User.username == username).first()