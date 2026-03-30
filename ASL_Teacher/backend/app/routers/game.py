from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app import schemas, models
from app.core import deps

router = APIRouter()

@router.get("/achievements", response_model=List[schemas.Achievement])
async def list_achievements(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    result = await db.execute(select(models.Achievement).offset(skip).limit(limit))
    achievements = result.scalars().all()
    return achievements

@router.post("/achievements/{achievement_id}/unlock", response_model=schemas.UnlockResponse)
async def unlock_achievement(
    achievement_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Check if already unlocked
    ua_result = await db.execute(select(models.UserAchievement).filter_by(user_id=current_user.id, achievement_id=achievement_id))
    existing = ua_result.scalars().first()
    
    achievement_result = await db.execute(select(models.Achievement).filter_by(id=achievement_id))
    achievement = achievement_result.scalars().first()
    
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    if existing:
        return {"unlocked": False, "achievement": achievement, "message": "Already unlocked"}

    # Unlock logic
    new_ua = models.UserAchievement(user_id=current_user.id, achievement_id=achievement_id)
    db.add(new_ua)
    
    # Add points/XP
    current_user.xp += achievement.points
    # Simple level up logic
    if current_user.xp >= (current_user.level * 100):
        current_user.level += 1
        current_user.xp -= (current_user.level - 1) * 100
        
    await db.commit()
    await db.refresh(current_user)
    
    return {"unlocked": True, "achievement": achievement, "message": "Achievement Unlocked!"}

@router.get("/store/items", response_model=List[schemas.Item])
async def list_items(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    query = select(models.Item)
    if category:
        query = query.filter(models.Item.category == category)
    
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/store/buy/{item_id}", response_model=schemas.PurchaseResponse)
async def buy_item(
    item_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Check Item
    item_result = await db.execute(select(models.Item).filter_by(id=item_id))
    item = item_result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    # Check if already owned
    owned_result = await db.execute(select(models.UserItem).filter_by(user_id=current_user.id, item_id=item_id))
    if owned_result.scalars().first():
         raise HTTPException(status_code=400, detail="Item already owned")

    # Check funds
    if current_user.coins < item.cost:
        raise HTTPException(status_code=400, detail="Insufficient coins")
        
    # Transaction
    current_user.coins -= item.cost
    new_user_item = models.UserItem(user_id=current_user.id, item_id=item_id)
    db.add(new_user_item)
    
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "success": True, 
        "new_balance": current_user.coins,
        "item": item
    }
