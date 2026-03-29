from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
import datetime

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    sub: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

# --- User ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    password: Optional[str] = None
    avatar_url: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    created_at: datetime.datetime
    email: EmailStr
    username: str
    coins: int = 0
    level: int = 1
    xp: int = 0

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

# --- Achievements ---
class AchievementBase(BaseModel):
    name: str
    description: str
    points: int = 10
    icon_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    id: int
    class Config:
        from_attributes = True

# --- Items ---
class ItemBase(BaseModel):
    name: str
    description: str
    cost: int = 0
    category: str
    image_url: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    class Config:
        from_attributes = True

# --- Game Actions ---
class UnlockResponse(BaseModel):
    unlocked: bool
    achievement: Achievement
    message: str

class PurchaseResponse(BaseModel):
    success: bool
    new_balance: int
    item: Item
