from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2)
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class MeetingCreate(BaseModel):
    meeting_code: str